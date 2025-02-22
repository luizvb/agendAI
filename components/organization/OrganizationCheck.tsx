"use client";

import { useEffect, useState } from "react";
import { useOrganization } from "@/hooks/useOrganization";
import { CreateOrganizationModal } from "./CreateOrganizationModal";
import { LoadingScreen } from "@/components/loading-screen";

export function OrganizationCheck({ children }: { children: React.ReactNode }) {
  const { organization, isLoading } = useOrganization();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!isLoading && !organization) {
      setShowModal(true);
    }
  }, [isLoading, organization]);

  if (isLoading) {
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
