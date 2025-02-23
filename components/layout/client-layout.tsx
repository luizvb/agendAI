"use client";

import { useEffect } from "react";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { AppSidebar } from "@/components/app-sidebar";
import SignIn from "@/components/sign-in";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header";
import { OrganizationCheck } from "@/components/organization/OrganizationCheck";

import { userApi } from "@/services";

interface ClientLayoutProps {
  children: React.ReactNode;
  session: Session | null;
}

export function ClientLayout({ children, session }: ClientLayoutProps) {
  useEffect(() => {
    if (session?.accessToken) {
      userApi
        .fetchMe()
        .then((data) => {
          if (data.organizationId) {
            localStorage.setItem("organization-id", data.organizationId);
            localStorage.setItem("organization-name", data.organization.name);
          }
        })
        .catch((error) => console.error("Error fetching organization:", error));
    } else {
      localStorage.removeItem("jwt-token");
      localStorage.removeItem("organization-id");
      localStorage.removeItem("authenticated");
    }
  }, [session]);

  return (
    <SessionProvider>
      {session ? (
        <OrganizationCheck>
          <div className="[--header-height:calc(theme(spacing.14))]">
            <SidebarProvider className="flex flex-col">
              <SiteHeader />
              <div className="flex flex-1">
                <AppSidebar user={session.user} />
                <SidebarInset>
                  <div className="flex-grow">{children}</div>
                </SidebarInset>
              </div>
            </SidebarProvider>
          </div>
        </OrganizationCheck>
      ) : (
        <SignIn />
      )}
    </SessionProvider>
  );
}
