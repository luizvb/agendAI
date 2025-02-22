import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export function useWhatsAppStatus() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/whatsapp/status");
      setIsConnected(response.data.isActive);
    } catch (error) {
      console.error("Error checking WhatsApp status:", error);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isConnected,
    isLoading,
    checkStatus,
  };
}
