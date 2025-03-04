"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Calendar as CalendarIcon,
} from "lucide-react";
import { appointmentApi, clientApi } from "@/services";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/phone-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Client } from "@/types/client";
import { Service } from "@/types/service";
import { Professional } from "@/types/professional";
import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import "react-day-picker/dist/style.css";

interface ScheduleModalProps {
  showScheduleModal: boolean;
  setShowScheduleModal: (show: boolean) => void;
  selectedService: Service | null;
  setSelectedService: (service: Service | null) => void;
  services: Service[];
  professionals: Professional[];
  selectedProfessional: Professional | null;
  setSelectedProfessional: (professional: Professional | null) => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  availableDays: { date: string; times: string[] }[];
  onScheduleSuccess: () => void;
  initialSelectedTime?: string;
}

export function ScheduleModal({
  showScheduleModal,
  setShowScheduleModal,
  selectedService,
  setSelectedService,
  services,
  professionals,
  selectedProfessional,
  setSelectedProfessional,
  selectedDate,
  setSelectedDate,
  availableDays,
  onScheduleSuccess,
  initialSelectedTime,
}: ScheduleModalProps) {
  const { toast } = useToast();
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [availableClients, setAvailableClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [newClientName, setNewClientName] = useState("");
  const [newClientPhone, setNewClientPhone] = useState("");
  const [isNewClient, setIsNewClient] = useState(false);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [loadingTime, setLoadingTime] = useState<string | null>(null);

  // Função para atualizar os horários disponíveis
  const updateAvailableSlots = () => {
    setIsLoadingSlots(true);
    setAvailableSlots([]);

    const todaySlots = availableDays.find(
      (day) =>
        day.date.split("T")[0] === selectedDate.toISOString().split("T")[0]
    );

    setTimeout(() => {
      setAvailableSlots(todaySlots?.times || []);
      setIsLoadingSlots(false);
    }, 300);
  };

  // Effect para carregar clientes quando o modal abrir
  useEffect(() => {
    if (showScheduleModal) {
      clientApi.list().then((clients) => {
        setAvailableClients(clients);
      });
    }
  }, [showScheduleModal]);

  // Effect para selecionar automaticamente o profissional quando há apenas um
  useEffect(() => {
    if (
      showScheduleModal &&
      professionals.length === 1 &&
      !selectedProfessional
    ) {
      setSelectedProfessional(professionals[0]);
    }
  }, [showScheduleModal, professionals, selectedProfessional]);

  // Effect para atualizar horários quando qualquer dependência mudar
  useEffect(() => {
    if (
      showScheduleModal &&
      selectedService &&
      selectedProfessional &&
      selectedDate
    ) {
      updateAvailableSlots();
    }
  }, [
    showScheduleModal,
    selectedService?.id,
    selectedProfessional?.id,
    selectedDate,
    availableDays,
  ]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const newDate = parse(e.target.value, "yyyy-MM-dd", new Date());
      setSelectedDate(newDate);
    }
  };

  const resetModal = () => {
    setShowScheduleModal(false);
    setSelectedService(null);
    setAvailableSlots([]);
    setSelectedClient(null);
    setNewClientName("");
    setNewClientPhone("");
    setIsNewClient(false);
  };

  const handleScheduleAppointment = async (time: string) => {
    if (!selectedService || !selectedProfessional) {
      toast({
        title: "Erro",
        description: "Selecione um serviço e profissional",
        variant: "destructive",
      });
      return;
    }

    if (!selectedClient && !isNewClient) {
      toast({
        title: "Atenção",
        description: "Selecione um cliente ou cadastre um novo",
        variant: "destructive",
      });
      return;
    }

    if (isNewClient && (!newClientName || !newClientPhone)) {
      toast({
        title: "Atenção",
        description: "Preencha o nome e telefone do novo cliente",
        variant: "destructive",
      });
      return;
    }

    setLoadingTime(time);

    const appointmentDate = new Date(selectedDate);
    const [hours, minutes] = time.split(":");
    appointmentDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    try {
      let client = selectedClient;

      if (isNewClient) {
        client = await clientApi.create({
          name: newClientName,
          phoneNumber: newClientPhone,
        });
      }

      if (!client) {
        throw new Error("Cliente não selecionado");
      }

      await appointmentApi.create({
        clientId: client.id,
        serviceId: selectedService.id,
        professionalId: selectedProfessional.id,
        startTime: appointmentDate.toISOString(),
      });

      toast({
        title: "Sucesso",
        description: "Agendamento realizado com sucesso!",
      });

      onScheduleSuccess();
      resetModal();
    } catch (error) {
      console.error("Erro ao agendar:", error);
      toast({
        title: "Erro",
        description: "Não foi possível realizar o agendamento.",
        variant: "destructive",
      });
    } finally {
      setLoadingTime(null);
    }
  };

  return showScheduleModal ? (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && resetModal()}
    >
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between sticky top-0 bg-background z-10 border-b">
          <CardTitle>Agendar Horário</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={resetModal}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="min-h-[400px]">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="min-h-[76px]">
                <label className="text-sm font-medium mb-1 block">
                  Serviço
                </label>
                <Select
                  value={selectedService?.id?.toString()}
                  onValueChange={(value) =>
                    setSelectedService(
                      services.find((s) => s.id.toString() === value) || null
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o serviço" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem
                        key={service.id}
                        value={service.id.toString()}
                      >
                        {service.name} - R$ {Number(service.price).toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="min-h-[76px]">
                <label className="text-sm font-medium mb-1 block">
                  Profissional
                </label>
                <Select
                  value={selectedProfessional?.id?.toString()}
                  onValueChange={(value) =>
                    setSelectedProfessional(
                      professionals.find((p) => p.id.toString() === value) ||
                        null
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o profissional" />
                  </SelectTrigger>
                  <SelectContent>
                    {professionals.map((professional) => (
                      <SelectItem
                        key={professional.id}
                        value={professional.id.toString()}
                      >
                        {professional.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="min-h-[120px]">
                <label className="text-sm font-medium mb-1 block">
                  Cliente
                </label>
                {!isNewClient ? (
                  <div className="space-y-2">
                    <Select
                      value={selectedClient?.id?.toString()}
                      onValueChange={(value) =>
                        setSelectedClient(
                          availableClients.find(
                            (c) => c.id.toString() === value
                          ) || null
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        <div className="flex items-center px-3 pb-2">
                          <Input
                            placeholder="Buscar cliente..."
                            className="h-8"
                            onChange={(e) => {
                              const input = e.target as HTMLInputElement;
                              const list = input.closest('[role="listbox"]');
                              if (list) {
                                const items =
                                  list.querySelectorAll('[role="option"]');
                                items.forEach((item) => {
                                  const text =
                                    item.textContent?.toLowerCase() || "";
                                  const searchText = input.value.toLowerCase();
                                  item.classList.toggle(
                                    "hidden",
                                    !text.includes(searchText)
                                  );
                                });
                              }
                            }}
                          />
                        </div>
                        {availableClients.map((client) => (
                          <SelectItem
                            key={client.id}
                            value={client.id.toString()}
                          >
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => setIsNewClient(true)}
                    >
                      Novo Cliente
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Input
                      placeholder="Nome do cliente"
                      value={newClientName}
                      onChange={(e) => setNewClientName(e.target.value)}
                    />
                    <PhoneInput
                      placeholder="Telefone"
                      value={newClientPhone}
                      onChange={(value) => setNewClientPhone(value || "")}
                      defaultCountry="BR"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => setIsNewClient(false)}
                    >
                      Voltar para lista
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="min-h-[76px]">
                <label className="text-sm font-medium mb-1 block">Data</label>
                <div className="relative">
                  <Input
                    type="date"
                    className="w-full"
                    value={format(selectedDate, "yyyy-MM-dd")}
                    onChange={handleDateChange}
                    min={format(new Date(), "yyyy-MM-dd")}
                    required
                  />
                  {selectedDate && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      {format(selectedDate, "EEEE, d 'de' MMMM", {
                        locale: ptBR,
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="min-h-[200px]">
                <label className="text-sm font-medium mb-1 block">
                  Horários Disponíveis
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {isLoadingSlots ? (
                    <div className="col-span-3 flex justify-center py-4">
                      <div className="h-[20px] w-[20px] animate-spin rounded-full border-2 border-primary border-r-transparent" />
                    </div>
                  ) : availableSlots.length > 0 ? (
                    availableSlots.map((time) => (
                      <Button
                        key={time}
                        variant={loadingTime === time ? "default" : "outline"}
                        onClick={() => handleScheduleAppointment(time)}
                        disabled={loadingTime !== null}
                        className="w-full"
                      >
                        {loadingTime === time ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-r-transparent" />
                        ) : (
                          time
                        )}
                      </Button>
                    ))
                  ) : (
                    <p className="col-span-3 text-center text-sm text-gray-500 py-4">
                      Nenhum horário disponível
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  ) : null;
}
