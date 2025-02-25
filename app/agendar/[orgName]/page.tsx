"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { X } from "lucide-react";
import { Calendar } from "../../../components/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/phone-input";

interface Organization {
  id: string;
  name: string;
  logo: string;
  businessHours: Record<string, { start: string; end: string }>;
}

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
}

interface Professional {
  id: string;
  name: string;
  expertise: string;
  avatarUrl?: string;
}

interface ClientInfo {
  name: string;
  phoneNumber: string;
}

interface AvailableTimeSlot {
  time: string;
}

interface AvailableDay {
  date: string;
  times: AvailableTimeSlot[];
}

export default function SchedulePage() {
  const params = useParams();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [availableTimes, setAvailableTimes] = useState<AvailableTimeSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedProfessional, setSelectedProfessional] =
    useState<Professional | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [clientInfo, setClientInfo] = useState<ClientInfo>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("clientInfo");
      return saved ? JSON.parse(saved) : { name: "", phoneNumber: "" };
    }
    return { name: "", phoneNumber: "" };
  });

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const orgName = params.orgName as string;
        const response = await api.get(`/organizations/public/${orgName}`);
        setOrganization(response.data);

        // Fetch services and professionals after getting organization
        const servicesResponse = await api.get(
          `/services/public/${response.data.id}`
        );
        setServices(servicesResponse.data);

        const professionalsResponse = await api.get(
          `/professionals/public/${response.data.id}`
        );
        setProfessionals(professionalsResponse.data);

        // Select first professional automatically
        if (professionalsResponse.data.length > 0) {
          setSelectedProfessional(professionalsResponse.data[0]);
        }
      } catch (error) {
        console.error("Error fetching organization:", error);
        toast.error("Erro ao carregar dados da organização");
      }
    };

    fetchOrganization();
  }, [params.orgName]);

  useEffect(() => {
    const fetchAvailableTimes = async () => {
      if (selectedDate && selectedProfessional && organization) {
        try {
          const response = await api.get(
            "/appointments/public/available-times",
            {
              params: {
                organizationId: organization.id,
                professionalId: selectedProfessional.id,
                date: selectedDate.toISOString(),
              },
            }
          );

          // Ensure response is an array and has the expected structure
          if (
            Array.isArray(response.data) &&
            response.data.every(
              (item) => typeof item === "object" && "time" in item
            )
          ) {
            const formattedTimes = response.data.map((slot) => ({
              time: slot.time as string,
            }));
            setAvailableTimes(formattedTimes);
          } else {
            console.error("Unexpected API response format:", response.data);
            setAvailableTimes([]);
          }
        } catch (error) {
          console.error("Error fetching available times:", error);
          toast.error("Erro ao carregar horários disponíveis");
          setAvailableTimes([]);
        }
      }
    };

    fetchAvailableTimes();
  }, [selectedDate, selectedProfessional, organization]);

  const handleClientInfoChange = (info: ClientInfo) => {
    setClientInfo(info);
    localStorage.setItem("clientInfo", JSON.stringify(info));
  };

  const handlePhoneChange = (value: string) => {
    handleClientInfoChange({
      ...clientInfo,
      phoneNumber: value || "",
    });
  };

  const handleSchedule = async () => {
    if (!clientInfo.name || !clientInfo.phoneNumber) {
      toast.error("Por favor, preencha seus dados");
      return;
    }

    const datetime = `${
      selectedDate.toISOString().split("T")[0]
    }T${selectedTime}`;

    try {
      await api.post("/appointments/public", {
        organizationId: organization?.id,
        client: clientInfo,
        serviceId: selectedService?.id,
        professionalId: selectedProfessional?.id,
        startTime: new Date(datetime),
      });

      toast.success("Agendamento realizado com sucesso!");
      setShowScheduleModal(false);
      resetSelections();
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast.error("Erro ao realizar agendamento");
    }
  };

  const resetSelections = () => {
    setSelectedService(null);
    setSelectedTime("");
    setShowScheduleModal(false);
  };

  if (!organization) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen flex">
      <div
        className={`flex-grow flex flex-col ${
          showScheduleModal ? "blur-md brightness-50" : ""
        }`}
      >
        <div className="flex-grow flex flex-col p-4 md:p-8">
          <div className="mb-8 text-center">
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 p-6 rounded-lg shadow-sm mb-6">
              <img
                src="/logo.png"
                alt="Logo"
                className="mx-auto h-28 w-auto mb-4"
              />
              <h2 className="text-3xl font-bold text-primary mb-2">
                Bem-vindo!
              </h2>
              <p className="text-xl text-gray-600">Vamos agendar? ✨</p>
            </div>
            <h1 className="text-2xl font-bold">{organization.name}</h1>
            {organization.logo && (
              <img
                src={organization.logo}
                alt={organization.name}
                className="mx-auto h-24 w-24 object-contain"
              />
            )}
            <p className="mt-4 text-gray-600">
              Para agendar seu atendimento, selecione um serviço abaixo e
              escolha seu melhor horário
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <Card
                key={service.id}
                className={`cursor-pointer ${
                  selectedService?.id === service.id
                    ? "border-2 border-primary"
                    : ""
                }`}
                onClick={() => {
                  setSelectedService(service);
                  setShowScheduleModal(true);
                }}
              >
                <CardHeader>
                  <CardTitle className="text-base">{service.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Duração: {service.durationMinutes} minutos
                  </p>
                  <p className="text-sm text-gray-500">
                    Preço: R$ {Number(service.price).toFixed(2)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {showScheduleModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              resetSelections();
            }
          }}
        >
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Novo Agendamento</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={resetSelections}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Selecione a Data</h3>
                  <Calendar
                    selectedDate={selectedDate}
                    onDateChange={setSelectedDate}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">
                    Selecione o Profissional
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {professionals.map((professional) => (
                      <Card
                        key={professional.id}
                        className={`cursor-pointer transition-all hover:border-primary ${
                          selectedProfessional?.id === professional.id
                            ? "border-2 border-primary"
                            : ""
                        }`}
                        onClick={() => setSelectedProfessional(professional)}
                      >
                        <CardContent className="flex flex-col items-center p-2">
                          <Avatar className="h-8 w-8 mb-1">
                            <AvatarImage
                              src={professional.avatarUrl}
                              alt={professional.name}
                            />
                            <AvatarFallback>
                              {professional.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <p className="text-xs font-medium text-center">
                            {professional.name}
                          </p>
                          {professional.expertise && (
                            <p className="text-xs text-gray-500 text-center mt-0.5">
                              {professional.expertise}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {availableTimes.length > 0 && selectedProfessional && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">
                      Horários Disponíveis
                    </h3>
                    <div className="grid grid-cols-4 gap-2">
                      {availableTimes.map((slot) => (
                        <Button
                          key={slot.time}
                          variant={
                            selectedTime === slot.time ? "default" : "outline"
                          }
                          onClick={() => setSelectedTime(slot.time)}
                        >
                          {slot.time}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedTime && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium mb-4">
                      Informações do Cliente
                    </h3>
                    <div>
                      <Label htmlFor="name">Nome</Label>
                      <Input
                        id="name"
                        value={clientInfo.name}
                        onChange={(e) =>
                          handleClientInfoChange({
                            ...clientInfo,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefone</Label>
                      <PhoneInput
                        id="phone"
                        value={clientInfo.phoneNumber}
                        onChange={handlePhoneChange}
                        defaultCountry="BR"
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-2 mt-6">
                  <Button variant="outline" onClick={resetSelections}>
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSchedule}
                    disabled={
                      !selectedTime ||
                      !clientInfo.name ||
                      !clientInfo.phoneNumber
                    }
                  >
                    Confirmar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
