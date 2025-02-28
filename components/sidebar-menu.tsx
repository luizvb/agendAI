"use client";

import * as React from "react";
import { BookOpen, Settings2, Users } from "lucide-react";

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
      title: "Clientes",
      url: "/clients",
      icon: Users,
    },
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
            <h1 className="">Gendaia</h1>
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
