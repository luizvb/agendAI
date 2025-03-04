"use client";

import * as React from "react";
import {
  BookOpen,
  Building2,
  Command,
  HandPlatterIcon,
  LifeBuoy,
  Phone,
  PieChart,
  UsersRound,
  Users,
} from "lucide-react";

import { NavProjects } from "@/components/nav-projects";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { User } from "next-auth";
import { useOrganization } from "@/hooks/useOrganization";

const data = {
  navSecondary: [
    {
      title: "Suporte",
      url: "#",
      icon: LifeBuoy,
    },
  ],
  projects: [
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: PieChart,
    },
    {
      name: "Agendamentos",
      url: "/appointments",
      icon: BookOpen,
    },
    {
      name: "Serviços",
      url: "/manage/services",
      icon: HandPlatterIcon,
    },
    {
      name: "Time",
      url: "/manage/professionals",
      icon: UsersRound,
    },
    {
      name: "Clientes",
      url: "/manage/clients",
      icon: Users,
    },
    {
      name: "Perfil da Empresa",
      url: "/manage/company-profile",
      icon: Building2,
    },
    {
      name: "Whatsapp",
      url: "/whatsapp",
      icon: Phone,
    },
  ],
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: User;
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const [orgName, setOrgName] = useState("Carregando...");
  const [loading, setLoading] = useState<string | null>(null);
  const { organization } = useOrganization();
  const router = useRouter();

  useEffect(() => {
    const name = localStorage.getItem("organization-name");
    if (name) {
      setOrgName(name);
    }
  }, []);

  useEffect(() => {
    if (organization?.name) {
      setOrgName(organization.name);
      localStorage.setItem("organization-name", organization.name);
    }
  }, [organization]);

  const handleOrgClick = () => {
    router.push("/manage/company-profile");
  };

  return (
    <Sidebar
      className="top-[--header-height] !h-[calc(100svh-var(--header-height))] "
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleOrgClick();
                }}
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-[#6c359b] text-sidebar-primary-foreground overflow-hidden">
                  {organization?.logo ? (
                    <Image
                      src={organization.logo}
                      alt={orgName}
                      width={32}
                      height={32}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <Command className="size-4" />
                  )}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{orgName}</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects
          projects={data.projects}
          loading={loading}
          setLoading={setLoading}
        />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
    </Sidebar>
  );
}
