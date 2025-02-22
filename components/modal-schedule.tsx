"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ClientSelect } from "./client-select";
import { ServiceSelect } from "./service-select";
import { DateTimePicker } from "./date-time-picker";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { appointmentService } from "@/services/appointmentService";
import { clientService } from "@/services/clientService";
import { Client } from "@/types/client";
import { useRouter } from "next/navigation";

interface ModalScheduleProps {
  isOpen: boolean;
  onClose: () => void;
  professionalId: number;
  defaultDate?: string;
}

export function ModalSchedule({
  isOpen,
  onClose,
  professionalId,
  defaultDate,
}: ModalScheduleProps) {
  const [clientId, setClientId] = useState<number>();
  const [serviceId, setServiceId] = useState<number>();
  const [startTime, setStartTime] = useState<string>(defaultDate || "");
  const [isLoading, setIsLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      loadClients();
    }
  }, [isOpen]);

  const loadClients = async () => {
    try {
      const data = await clientService.list();
      setClients(data);
    } catch (error) {
      console.error("Error loading clients:", error);
      toast({
        title: "Erro",
        description: "Erro ao carregar a lista de clientes",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientId || !serviceId || !startTime) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      await appointmentService.create({
        clientId,
        serviceId,
        professionalId,
        startTime,
      });

      toast({
        title: "Agendamento realizado",
        description: "O agendamento foi criado com sucesso!",
      });

      onClose();
      router.refresh();
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar o agendamento.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Agendamento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Cliente</label>
              <ClientSelect
                value={clientId}
                onChange={(value) => setClientId(value)}
                clients={clients}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Serviço</label>
              <ServiceSelect
                value={serviceId}
                onChange={(value) => setServiceId(value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Data e Hora</label>
              <DateTimePicker
                value={startTime}
                onChange={(value) => setStartTime(value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Agendando..." : "Agendar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
