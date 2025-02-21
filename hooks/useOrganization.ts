import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Organization } from "@/types";

export function useOrganization() {
  const { data: session } = useSession();
  const router = useRouter();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const organizationId = localStorage.getItem("organization-id");

        if (!organizationId) {
          router.push("/create-organization");
          return;
        }

        const currentOrgId = organizationId;

        setOrganization(currentOrgId);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch organization"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganization();
  }, [session, router]);

  return {
    organization,
    isLoading,
    error,
  };
}
