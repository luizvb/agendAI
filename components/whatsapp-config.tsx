"use client";

import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Button } from "./ui/button";
import { api } from "@/lib/api";

export const WhatsAppConfig = () => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const response = await api.get("/whatsapp/status");
      setIsActive(response.data.isActive);
    } catch (error) {
      console.error("Error checking WhatsApp status:", error);
    }
  };

  const handleInitialize = async () => {
    setLoading(true);
    try {
      const response = await api.post("/whatsapp/init");
      setQrCode(response.data.qrCode);
      setTimeout(() => {
        checkStatus();
      }, 10000);
    } catch (error) {
      console.error("Error initializing WhatsApp:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await api.post("/whatsapp/disconnect");
      setIsActive(false);
      setQrCode(null);
    } catch (error) {
      console.error("Error disconnecting WhatsApp:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">WhatsApp Configuration</h2>

      {isActive ? (
        <div>
          <div className="bg-green-100 p-4 rounded mb-4">
            WhatsApp está conectado e ativo. O seu assistente virtual está
            ligado no número conectado
          </div>
          <Button onClick={handleDisconnect} variant="destructive">
            Desconectar WhatsApp
          </Button>
        </div>
      ) : (
        <div>
          {qrCode ? (
            <div className="flex flex-col items-center gap-4">
              <QRCodeCanvas value={qrCode} size={256} />
              <p className="text-sm text-gray-600">
                Escaneie esse código no seu whatsapp para conectar o seu
                assistente virtual ao seu número.
              </p>
            </div>
          ) : (
            <Button onClick={handleInitialize} disabled={loading}>
              {loading ? "Gerando QR Code." : "Configure o WhatsApp"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
