"use client";

import { useWhatsAppStatus } from "@/app/hooks/useWhatsAppStatus";
import { AIConfigurationForm } from "./components/AIConfigurationForm";
import { WhatsAppQRCode } from "./components/WhatsAppQRCode";

export default function WhatsAppPage() {
  const { isConnected } = useWhatsAppStatus();

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-8">
        <h1 className="text-3xl font-semibold text-gray-900">
          Assistente Virtual (Whatsapp IA)
        </h1>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600 leading-relaxed">
            Ative seu assistente virtual de agendamento conectando sua conta do
            WhatsApp.
          </p>
        </div>

        {<AIConfigurationForm />}
        <WhatsAppQRCode />
      </div>
    </div>
  );
}
