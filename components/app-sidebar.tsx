"use client"

import * as React from "react"
import {
  IconChartBar,
  IconDashboard,
  IconFileDescription,
  IconSettings,
  IconUsers,
  IconPhoto,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Администратор",
    email: "admin@cryptopoker.club",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Дашборд",
      url: "#",
      icon: IconDashboard,
    },
    {
      title: "Пользователи",
      url: "#",
      icon: IconUsers,
    },
    {
      title: "Аналитика",
      url: "#",
      icon: IconChartBar,
    },
     {
      title: "Ассеты",
      url: "#",
      icon: IconPhoto,
    },
    {
      title: "Логи",
      url: "#",
      icon: IconFileDescription,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <span className="text-lg font-semibold">♣️ Poker Club</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
         <SidebarMenu className="mt-auto">
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="#">
                  <IconSettings />
                  <span>Настройки</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
