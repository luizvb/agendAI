"use client";

import { useEffect, useState } from "react";
import { useOrganization } from "@/hooks/useOrganization";
import { CreateOrganizationModal } from "./CreateOrganizationModal";
import { LoadingScreen } from "@/components/loading-screen";

export function OrganizationCheck({ children }: { children: React.ReactNode }) {
  const { organization, isLoading: orgLoading } = useOrganization();
  const [showModal, setShowModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("authenticated") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  if (orgLoading || !isAuthenticated) {
    return <LoadingScreen />;
  }

  if (!organization && isAuthenticated) {
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
