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
            WhatsApp is connected and active
          </div>
          <Button onClick={handleDisconnect} variant="destructive">
            Disconnect WhatsApp
          </Button>
        </div>
      ) : (
        <div>
          {qrCode ? (
            <div className="flex flex-col items-center gap-4">
              <QRCodeCanvas value={qrCode} size={256} />
              <p className="text-sm text-gray-600">
                Scan this QR code with WhatsApp to connect
              </p>
            </div>
          ) : (
            <Button onClick={handleInitialize} disabled={loading}>
              {loading ? "Generating QR Code..." : "Configure WhatsApp"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
