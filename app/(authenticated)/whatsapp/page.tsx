"use client";

import { useWhatsAppStatus } from "@/app/hooks/useWhatsAppStatus";
import { AIConfigurationForm } from "./components/AIConfigurationForm";
import { WhatsAppQRCode } from "./components/WhatsAppQRCode";

export default function WhatsAppPage() {
  const { isConnected } = useWhatsAppStatus();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">Configuração do WhatsApp</h1>

      <WhatsAppQRCode />

      {isConnected && (
        <div className="mt-8">
          <AIConfigurationForm />
        </div>
      )}
    </div>
  );
}
