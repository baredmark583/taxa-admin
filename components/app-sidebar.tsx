
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
    avatar: "/next.svg",
  },
  navMain: [
    {
      title: "Дашборд",
      value: "dashboard",
      icon: IconDashboard,
    },
    {
      title: "Пользователи",
      value: "users",
      icon: IconUsers,
    },
    {
      title: "Аналитика",
      // No value, will be disabled
      icon: IconChartBar,
    },
     {
      title: "Ассеты",
      value: "assets",
      icon: IconPhoto,
    },
    {
      title: "Логи",
      // No value, will be disabled
      icon: IconFileDescription,
    },
  ],
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    activeTab?: string;
    onTabChange?: (tab: string) => void;
}

export function AppSidebar({ activeTab, onTabChange, ...props }: AppSidebarProps) {
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
        <NavMain items={data.navMain} activeTab={activeTab} onTabChange={onTabChange} />
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
