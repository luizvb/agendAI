import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Organization } from "@/types";
import { organizationService } from "@/services/organizationService";

export function useOrganization() {
  const { data: session, status } = useSession();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const org = await organizationService.getOrganization();
        console.log("setou?", org);
        setOrganization(org);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch organization"
        );
        setOrganization(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganization();
  }, [session, status]);

  return {
    organization,
    isLoading,
    error,
  };
}
