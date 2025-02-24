"use client";

import { useEffect, useState } from "react";
import { useOrganization } from "@/hooks/useOrganization";
import { CreateOrganizationModal } from "./CreateOrganizationModal";
import { LoadingScreen } from "@/components/loading-screen";

export function OrganizationCheck({ children }: { children: React.ReactNode }) {
  const { organization, isLoading: orgLoading, error } = useOrganization();
  const [showModal, setShowModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  console.log("error", error);

  useEffect(() => {
    if (localStorage.getItem("authenticated") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  if (orgLoading || !isAuthenticated) {
    return <LoadingScreen />;
  }

  if (!organization && isAuthenticated && !error) {
    return <CreateOrganizationModal isOpen={true} onClose={() => {}} />;
  }

  if (error) {
    return <>{children}</>;
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
