"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
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
}) {
  const { toast } = useToast();
  const [availableSlots, setAvailableSlots] = useState([]);
  const [availableClients, setAvailableClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [newClientName, setNewClientName] = useState("");
  const [newClientPhone, setNewClientPhone] = useState("");
  const [isNewClient, setIsNewClient] = useState(false);

  // Criar um array com as datas disponíveis
  const availableDates = availableDays.map((day) => new Date(day.date));

  useEffect(() => {
    if (showScheduleModal) {
      clientApi.list().then((clients) => {
        setAvailableClients(clients);
      });
    }
  }, [showScheduleModal]);

  useEffect(() => {
    if (
      showScheduleModal &&
      selectedService &&
      selectedProfessional &&
      availableDays
    ) {
      const todaySlots = availableDays.find(
        (day) =>
          day.date.split("T")[0] === selectedDate.toISOString().split("T")[0]
      );

      setAvailableSlots(todaySlots?.times || []);
    }
  }, [
    showScheduleModal,
    selectedService,
    selectedProfessional,
    availableDays,
    selectedDate,
  ]);

  const resetModal = () => {
    setShowScheduleModal(false);
    setSelectedService(null);
    setAvailableSlots([]);
    setSelectedClient(null);
    setNewClientName("");
    setNewClientPhone("");
    setIsNewClient(false);
  };

  const handleServiceSelection = (service) => {
    setSelectedService(service);
    const professionalToUse = selectedProfessional || professionals[0];
    if (professionalToUse) {
      setSelectedProfessional(professionalToUse);
    }
  };

  const handleProfessionalSelection = (professional) => {
    setSelectedProfessional(professional);
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
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
        title: "Erro",
        description: "Selecione um cliente ou cadastre um novo",
        variant: "destructive",
      });
      return;
    }

    if (isNewClient && (!newClientName || !newClientPhone)) {
      toast({
        title: "Erro",
        description: "Preencha o nome e telefone do novo cliente",
        variant: "destructive",
      });
      return;
    }

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
    }
  };

  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      resetModal();
    }
  };

  return (
    showScheduleModal && (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={handleClickOutside}
      >
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Novo Agendamento</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={resetModal}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">
                  Selecione o Serviço
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((service) => (
                    <Card
                      key={service.id}
                      className={`cursor-pointer ${
                        selectedService?.id === service.id
                          ? "border-2 border-primary"
                          : ""
                      }`}
                      onClick={() => handleServiceSelection(service)}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">
                          {service.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>{service.durationMinutes} min</span>
                          <span>R$ {Number(service.price).toFixed(2)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {selectedService && (
                <div>
                  <h3 className="text-lg font-medium mb-4">
                    Selecione o Profissional
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {professionals.map((professional) => (
                      <Card
                        key={professional.id}
                        className={`cursor-pointer ${
                          selectedProfessional?.id === professional.id
                            ? "border-2 border-primary"
                            : ""
                        }`}
                        onClick={() =>
                          handleProfessionalSelection(professional)
                        }
                      >
                        <CardHeader className="flex flex-row items-center gap-2 py-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={professional.avatarUrl}
                              alt={professional.name}
                            />
                            <AvatarFallback>
                              {professional.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <CardTitle className="text-base">
                            {professional.name}
                          </CardTitle>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {selectedProfessional && (
                <>
                  <div>
                    <h3 className="text-lg font-medium mb-4">
                      Selecione o Cliente
                    </h3>
                    <div className="space-y-4">
                      {!isNewClient ? (
                        <>
                          <Select
                            value={selectedClient?.id?.toString()}
                            onValueChange={(value) => {
                              const client = availableClients.find(
                                (c) => c.id.toString() === value
                              );
                              setSelectedClient(client || null);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um cliente" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableClients.map((client) => (
                                <SelectItem
                                  key={client.id}
                                  value={client.id.toString()}
                                >
                                  {client.name} - {client.phoneNumber}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            variant="outline"
                            onClick={() => setIsNewClient(true)}
                          >
                            Novo Cliente
                          </Button>
                        </>
                      ) : (
                        <div className="space-y-4">
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
                            onClick={() => setIsNewClient(false)}
                          >
                            Voltar para lista de clientes
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">
                      Selecione o Horário
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Button
                          variant="outline"
                          onClick={() =>
                            handleDateChange(
                              new Date(
                                selectedDate.setDate(selectedDate.getDate() - 1)
                              )
                            )
                          }
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-lg">
                          {selectedDate.toLocaleDateString("pt-BR", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                          })}
                        </span>
                        <Button
                          variant="outline"
                          onClick={() =>
                            handleDateChange(
                              new Date(
                                selectedDate.setDate(selectedDate.getDate() + 1)
                              )
                            )
                          }
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {availableSlots.map((slot) => (
                          <Button
                            key={slot.time}
                            variant="outline"
                            onClick={() => handleScheduleAppointment(slot.time)}
                          >
                            {slot.time}
                          </Button>
                        ))}
                        {availableSlots.length === 0 && (
                          <p className="col-span-4 text-center text-gray-500">
                            Nenhum horário disponível para este dia.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={resetModal}>
                  Cancelar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  );
}
