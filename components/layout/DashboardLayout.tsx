"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { useOrganization } from "@/hooks/useOrganization";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { OrganizationGuard } from "@/components/auth/organization-guard";
import { LoadingScreen } from "@/components/loading-screen";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { organization, isLoading, error } = useOrganization();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <OrganizationGuard>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="text-xl font-bold">
                  {organization?.name || "Dashboard"}
                </Link>
              </div>

              <div className="flex items-center space-x-4">
                <Link href="/manage/subscription">
                  <Button variant="outline">Subscription</Button>
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </nav>

        <main className="container mx-auto px-4 py-8">{children}</main>
      </div>
    </OrganizationGuard>
  );
}
