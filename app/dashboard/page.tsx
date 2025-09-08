import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { AdminUser } from "@/types"

// Fetch data from the game server API
async function getUsers(): Promise<AdminUser[]> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
        console.error("API URL is not configured. Please set NEXT_PUBLIC_API_URL environment variable.");
        return [];
    }
    try {
        const res = await fetch(`${apiUrl}/api/users`, { cache: 'no-store' }); // Disable caching for fresh data
        if (!res.ok) {
            throw new Error(`Failed to fetch users: ${res.statusText}`);
        }
        const users = await res.json();
        return users;
    } catch (error) {
        console.error(error);
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
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <DataTable data={userData} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}