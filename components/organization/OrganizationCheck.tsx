"use client";

import { useEffect, useState } from "react";
import { useOrganization } from "@/hooks/useOrganization";
import { CreateOrganizationModal } from "./CreateOrganizationModal";
import { LoadingScreen } from "@/components/loading-screen";
import { useSession } from "next-auth/react";

export function OrganizationCheck({ children }: { children: React.ReactNode }) {
  const { organization, isLoading: orgLoading } = useOrganization();
  const { status: sessionStatus } = useSession();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!orgLoading && !organization && sessionStatus === "authenticated") {
      setShowModal(true);
    }
  }, [orgLoading, organization, sessionStatus]);

  // Show loading while checking session or organization
  if (sessionStatus === "loading" || orgLoading) {
    return <LoadingScreen />;
  }

  // If user is not authenticated, show loading (they will be redirected by auth guard)
  if (sessionStatus !== "authenticated") {
    return <LoadingScreen />;
  }

  if (!organization) {
    return <CreateOrganizationModal isOpen={true} onClose={() => {}} />;
  }

  return (
    <>
      {children}
      <CreateOrganizationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}
