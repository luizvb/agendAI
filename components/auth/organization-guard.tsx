"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { organizationService } from "@/services/organizationService";

interface OrganizationGuardProps {
  children: React.ReactNode;
}

export function OrganizationGuard({ children }: OrganizationGuardProps) {
  const router = useRouter();

  useEffect(() => {
    async function checkOrganization() {
      try {
        const organization = await organizationService.getOrganization();

        if (!organization) {
          router.push("/onboarding");
          return null;
        }
      } catch (error) {
        console.error("Error checking organization:", error);
        return null;
      }
    }

    checkOrganization();
  }, [router]);

  return <>{children}</>;
}
