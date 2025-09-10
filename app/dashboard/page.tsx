
"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { ChartRichestPlayers } from "@/components/chart-richest-players"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AdminUser } from "../../types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AssetManagement } from "@/components/asset-management"

// The data fetching part remains separate and can be called from a server component wrapper if needed.
// For simplicity in this structure, we assume data is fetched and passed as props.
async function getUsers(): Promise<AdminUser[]> {
  const apiUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL
  if (!apiUrl) {
    console.error(
      "API URL is not configured. Please set INTERNAL_API_URL or NEXT_PUBLIC_API_URL environment variable."
    )
    return []
  }
  try {
    const res = await fetch(`${apiUrl}/api/users`, { cache: "no-store" })
    if (!res.ok) {
      throw new Error(`Failed to fetch users: ${res.statusText}`)
    }
    return await res.json()
  } catch (error) {
    console.error("Error fetching users in admin dashboard:", error)
    return []
  }
}

// A new wrapper component to keep the main page as a Server Component for data fetching
export default async function Page() {
    const userData = await getUsers();
    
    // We pass the server-fetched data to the interactive client component.
    return <DashboardPage initialUsers={userData} />
}


// This is the main client component that handles state and interactivity.
function DashboardPage({ initialUsers }: { initialUsers: AdminUser[] }) {
  const [activeTab, setActiveTab] = useState("dashboard")
  
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
              <SectionCards users={initialUsers} />
              <div className="px-4 lg:px-6">
                <ChartRichestPlayers users={initialUsers} />
              </div>
            </TabsContent>
            <TabsContent value="users" className="flex flex-1 flex-col">
              <DataTable data={initialUsers} />
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
