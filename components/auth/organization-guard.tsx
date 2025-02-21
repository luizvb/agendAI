"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import { organizationService } from "@/services/organizationService";
import { useCookies } from "next-client-cookies";

interface OrganizationGuardProps {
  children: React.ReactNode;
  session: Session | null;
}

export function OrganizationGuard({
  children,
  session,
}: OrganizationGuardProps) {
  const router = useRouter();
  const cookies = useCookies();
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasChecked = useRef(false);

  useEffect(() => {
    if (hasChecked.current) return;

    async function checkOrganization() {
      if (!session?.accessToken) {
        setIsChecking(false);
        return;
      }

      try {
        const organizations = await organizationService.getUserOrganizations(
          session.accessToken
        );

        if (!organizations || organizations.length === 0) {
          router.push("/create-organization");
          return;
        }

        const currentOrgId = cookies.get("currentOrganizationId");

        if (!currentOrgId) {
          if (organizations.length > 1) {
            router.push("/switch-organization");
          } else {
            // Se tem apenas uma organização, seleciona automaticamente
            cookies.set("currentOrganizationId", organizations[0].id);
          }
        }

        setError(null);
      } catch (err) {
        console.error("Error checking organization:", err);
        setError(
          err instanceof Error ? err.message : "Failed to check organization"
        );
      } finally {
        hasChecked.current = true;
        setIsChecking(false);
      }
    }

    hasChecked.current = true;
    setIsChecking(false);
    return;
    // checkOrganization();
  }, [session?.accessToken]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => {
              hasChecked.current = false;
              setIsChecking(true);
              setError(null);
            }}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return children;
}
