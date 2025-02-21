"use client";

import * as React from "react";
import {
  BookOpen,
  Command,
  LifeBuoy,
  PieChart,
  Send,
  Settings2,
} from "lucide-react";

import { NavProjects } from "@/components/nav-projects";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import { useRouter } from "next/navigation";
import { useOrganization } from "@/hooks/useOrganization";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { User } from "next-auth";

const data = {
  navMain: [
    {
      title: "Configurações",
      url: "#",
      icon: Settings2,
      isActive: true,
      items: [
        {
          title: "Serviços",
          url: "/manage/services",
        },
        {
          title: "Time",
          url: "/manage/professionals",
        },
        {
          title: "Perfil da Empresa",
          url: "/manage/company-profile",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "Agendamentos",
      url: "/",
      icon: BookOpen,
    },
    {
      name: "Dashboard",
      url: "/",
      icon: PieChart,
    },
  ],
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: User;
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const router = useRouter();

  const handleSwitchCompany = () => {
    router.push("/switch-company");
  };

  return (
    <Sidebar
      className="top-[--header-height] !h-[calc(100svh-var(--header-height))]"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div
                  onClick={() => {}}
                  className="grid flex-1 text-left text-sm leading-tight"
                >
                  <span className="truncate font-semibold">
                    {localStorage.getItem("organization-name") ||
                      "Carregando..."}
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} />
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
