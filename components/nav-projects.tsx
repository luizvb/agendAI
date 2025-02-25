"use client";

import { type LucideIcon } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavProjects({
  projects,
  loading,
  setLoading,
}: {
  projects: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
  loading: string | null;
  setLoading: (url: string | null) => void;
}) {
  const { isMobile, setOpen } = useSidebar();
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = async (url: string) => {
    setLoading(url);
    await router.push(url);
    setLoading(null);
    setOpen(false);
  };

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Seções</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              asChild
              className={`hover:bg-primary/10 ${
                pathname === item.url ? "bg-primary/10" : ""
              } ${loading === item.url ? "opacity-50 cursor-wait" : ""}`}
              disabled={loading === item.url}
            >
              <button onClick={() => handleClick(item.url)}>
                <item.icon
                  className={loading === item.url ? "animate-spin" : ""}
                />
                <span>{item.name}</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
