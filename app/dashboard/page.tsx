
"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { ChartRichestPlayers } from "@/components/chart-richest-players"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AdminUser } from "../../types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AssetManagement } from "@/components/asset-management"
import { Skeleton } from "@/components/ui/skeleton"

async function getUsers(): Promise<AdminUser[]> {
  // This now runs on the client, so it MUST use NEXT_PUBLIC_API_URL.
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    console.error("API URL is not configured. Please set NEXT_PUBLIC_API_URL environment variable.");
    return [];
  }
  try {
    const res = await fetch(`${apiUrl}/api/users`, { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`Failed to fetch users: ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching users in admin dashboard:", error);
    return [];
  }
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [users, setUsers] = useState<AdminUser[] | null>(null);

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  if (!users) {
     return (
        <SidebarProvider
            style={
                {
                "--sidebar-width": "calc(var(--spacing) * 72)",
                "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
            >
            <AppSidebar variant="inset" activeTab={"dashboard"} onTabChange={setActiveTab} />
            <SidebarInset>
                <SiteHeader />
                <div className="p-4 lg:p-6 space-y-4">
                    <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
                        <Skeleton className="h-32" />
                        <Skeleton className="h-32" />
                        <Skeleton className="h-32" />
                        <Skeleton className="h-32" />
                    </div>
                    <Skeleton className="h-96" />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
  }
  
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar 
        variant="inset" 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <Tabs 
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex flex-1 flex-col gap-2 @container/main"
          >
            <div className="flex items-center justify-between px-4 py-4 lg:px-6 lg:py-6">
              <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
                <TabsTrigger value="dashboard">Дашборд</TabsTrigger>
                <TabsTrigger value="users">Пользователи</TabsTrigger>
                <TabsTrigger value="assets">Ассеты</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="dashboard" className="flex flex-1 flex-col gap-4">
              <SectionCards users={users} />
              <div className="px-4 lg:px-6">
                <ChartRichestPlayers users={users} />
              </div>
            </TabsContent>
            <TabsContent value="users" className="flex flex-1 flex-col">
              <DataTable data={users} />
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
