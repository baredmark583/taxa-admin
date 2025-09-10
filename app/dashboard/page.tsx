export const dynamic = 'force-dynamic';

import { AppSidebar } from "@/components/app-sidebar"
import { ChartRichestPlayers } from "@/components/chart-richest-players"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
// FIX: Changed alias path to relative path to fix module resolution error.
import { AdminUser } from "../../types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AssetManagement } from "@/components/asset-management"

// Fetch data from the game server API
async function getUsers(): Promise<AdminUser[]> {
    // Prioritize the internal URL for server-side rendering to leverage Render's private network.
    // Fall back to the public URL for broader compatibility (e.g., local development).
    const apiUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
        console.error("API URL is not configured. Please set INTERNAL_API_URL or NEXT_PUBLIC_API_URL environment variable.");
        return [];
    }
    try {
        // The `fetch` call here runs on the server during SSR.
        // Using the internal URL avoids slow public network requests between services,
        // preventing timeouts and improving initial load performance.
        const res = await fetch(`${apiUrl}/api/users`, { cache: 'no-store' }); // Disable caching for fresh data
        if (!res.ok) {
            throw new Error(`Failed to fetch users: ${res.statusText}`);
        }
        const users = await res.json();
        return users;
    } catch (error) {
        console.error("Error fetching users in admin dashboard:", error);
        return []; // Return empty array on error
    }
}


export default async function Page() {
  const userData = await getUsers();

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <Tabs defaultValue="dashboard" className="flex flex-1 flex-col gap-2 @container/main">
            <div className="flex items-center justify-between px-4 py-4 lg:px-6 lg:py-6">
                 <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
                    <TabsTrigger value="dashboard">Дашборд</TabsTrigger>
                    <TabsTrigger value="users">Пользователи</TabsTrigger>
                    <TabsTrigger value="assets">Ассеты</TabsTrigger>
                </TabsList>
            </div>
            <TabsContent value="dashboard" className="flex flex-1 flex-col gap-4">
                <SectionCards users={userData} />
                <div className="px-4 lg:px-6">
                    <ChartRichestPlayers users={userData} />
                </div>
            </TabsContent>
            <TabsContent value="users" className="flex flex-1 flex-col">
                <DataTable data={userData} />
            </TabsContent>
            <TabsContent value="assets" className="flex flex-1 flex-col">
                <AssetManagement />
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
