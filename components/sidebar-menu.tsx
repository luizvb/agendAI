"use client";

import * as React from "react";
import { BookOpen, Settings2 } from "lucide-react";
import Image from "next/image";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarProvider,
} from "@/components/ui/sidebar";

const data = {
  navMain: [
    {
      title: "Agendamentos",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Agendamentos",
          url: "/",
        },
      ],
    },

    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Serviços",
          url: "/manage/services",
        },
        {
          title: "Profissionais",
          url: "/manage/professionals",
        },
        {
          title: "Endereço",
          url: "/manage/address",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
};

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & { user: any }) {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <SidebarProvider>
        <Sidebar collapsible="icon" {...props}>
          <SidebarHeader>
            <h1 className="">PG AgendAI</h1>
          </SidebarHeader>
          <SidebarContent>
            <NavMain items={data.navMain} />
          </SidebarContent>
          <SidebarFooter>
            <NavUser user={user} />
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
      </SidebarProvider>
    </div>
  );
}
