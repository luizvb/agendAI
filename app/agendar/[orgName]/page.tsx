"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { X, Calendar, CalendarCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/phone-input";
import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Organization {
  id: string;
  name: string;
  logo: string;
  businessHours: Record<string, { start: string; end: string }>;
}

interface Service {
  id: string;
  name: string;
  durationMinutes: number;
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
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [loadingTime, setLoadingTime] = useState<string | null>(null);
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
      if (
        selectedDate &&
        selectedProfessional &&
        organization &&
        selectedService
      ) {
        setIsLoadingSlots(true);
        try {
          const response = await api.get(
            "/appointments/public/available-times",
            {
              params: {
                organizationId: organization.id,
                professionalId: selectedProfessional.id,
                date: selectedDate.toISOString(),
                serviceId: selectedService?.id,
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
        } finally {
          setIsLoadingSlots(false);
        }
      }
    };

    fetchAvailableTimes();
  }, [selectedDate, selectedProfessional, organization, selectedService]);

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

  const handleSchedule = async (time: string) => {
    if (!selectedService || !selectedProfessional) {
      toast.error("Selecione um serviço e profissional");
      return;
    }

    if (!clientInfo.name || !clientInfo.phoneNumber) {
      toast.error("Por favor, preencha seus dados");
      return;
    }

    setLoadingTime(time);

    const datetime = `${selectedDate.toISOString().split("T")[0]}T${time}`;

    try {
      await api.post("/appointments/public", {
        organizationId: organization?.id,
        client: clientInfo,
        serviceId: selectedService?.id,
        professionalId: selectedProfessional?.id,
        startTime: new Date(datetime),
      });

      toast.success("Agendamento realizado com sucesso!");
      resetSelections();
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast.error("Erro ao realizar agendamento");
    } finally {
      setLoadingTime(null);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pb-24">
      <div
        className={`flex-grow flex flex-col ${
          showScheduleModal ? "blur-md brightness-50" : ""
        }`}
      >
        <div className="flex-grow flex flex-col p-4 md:p-8 max-w-7xl mx-auto w-full">
          <div className="mb-8 text-center">
            <div className="bg-gradient-to-br from-primary/5 via-white to-primary/5 rounded-2xl shadow-lg p-8 mb-6 backdrop-blur-sm border border-gray-100">
              <img
                src="/logopretocut.png"
                alt="Logo"
                className="mx-auto h-24 w-auto mb-4 drop-shadow-sm"
              />
              <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
                Bem-vindo!
              </h2>
              <p className="text-xl text-gray-600 font-medium">
                Vamos agendar? ✨
              </p>
            </div>
            <div className="flex items-center justify-center gap-4 mb-8">
              {organization.logo && (
                <img
                  src={organization.logo}
                  alt={organization.name}
                  className="h-16 w-16 object-contain rounded-full shadow-sm"
                />
              )}
              <h1 className="text-2xl font-bold text-gray-800">
                Agendamento de serviços para: {organization.name}
              </h1>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Para agendar seu atendimento, selecione um serviço abaixo e
              escolha seu melhor horário
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services?.map((service) => (
              <Card
                key={service.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedService?.id === service.id
                    ? "border-2 border-primary ring-2 ring-primary/20"
                    : "hover:border-primary/50"
                }`}
                onClick={() => {
                  setSelectedService(service);
                  setShowScheduleModal(true);
                }}
              >
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    {service.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                      </svg>
                      Duração: {service.durationMinutes} minutos
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                      R$ {Number(service.price).toFixed(2)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {showScheduleModal && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            const target = e.target as HTMLDivElement;
            if (target === e.currentTarget) {
              resetSelections();
            }
          }}
        >
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between sticky top-0 bg-background/80 backdrop-blur-sm z-10 border-b">
              <CardTitle className="text-xl font-bold">
                Agendar Horário
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={resetSelections}
                className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="min-h-[400px] p-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Left Column */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Serviço
                    </Label>
                    <Select
                      value={selectedService?.id?.toString()}
                      onValueChange={(value) =>
                        setSelectedService(
                          services.find((s) => s.id.toString() === value) ||
                            null
                        )
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o serviço" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem
                            key={service.id}
                            value={service.id.toString()}
                          >
                            {service.name} - R${" "}
                            {Number(service.price).toFixed(2)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Profissional
                    </Label>
                    <Select
                      value={selectedProfessional?.id?.toString()}
                      onValueChange={(value) =>
                        setSelectedProfessional(
                          professionals.find(
                            (p) => p.id.toString() === value
                          ) || null
                        )
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o profissional" />
                      </SelectTrigger>
                      <SelectContent>
                        {professionals.map((professional) => (
                          <SelectItem
                            key={professional.id}
                            value={professional.id.toString()}
                          >
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={professional.avatarUrl} />
                                <AvatarFallback>
                                  {professional.name[0]}
                                </AvatarFallback>
                              </Avatar>
                              {professional.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-sm font-medium text-gray-700">
                      Seus Dados
                    </Label>
                    <div className="space-y-3">
                      <Input
                        placeholder="Seu nome"
                        value={clientInfo.name}
                        onChange={(e) =>
                          setClientInfo({ ...clientInfo, name: e.target.value })
                        }
                        className="w-full"
                      />
                      <PhoneInput
                        placeholder="Seu telefone"
                        value={clientInfo.phoneNumber}
                        onChange={(value) =>
                          setClientInfo({
                            ...clientInfo,
                            phoneNumber: value || "",
                          })
                        }
                        defaultCountry="BR"
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Data
                    </Label>
                    <div className="relative">
                      <Input
                        type="date"
                        className="w-full"
                        value={format(selectedDate, "yyyy-MM-dd")}
                        onChange={(e) => {
                          if (e.target.value) {
                            const newDate = parse(
                              e.target.value,
                              "yyyy-MM-dd",
                              new Date()
                            );
                            setSelectedDate(newDate);
                          }
                        }}
                        min={format(new Date(), "yyyy-MM-dd")}
                        required
                      />
                      {selectedDate && (
                        <div className="mt-2 text-sm text-gray-500 font-medium">
                          {format(selectedDate, "EEEE, d 'de' MMMM", {
                            locale: ptBR,
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700">
                      Horários Disponíveis
                    </Label>
                    <div className="grid grid-cols-3 gap-2">
                      {isLoadingSlots ? (
                        <div className="col-span-3 flex justify-center py-8">
                          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-r-transparent" />
                        </div>
                      ) : availableTimes.length > 0 ? (
                        availableTimes.map((slot) => (
                          <Button
                            key={slot.time}
                            variant={
                              loadingTime === slot.time ? "default" : "outline"
                            }
                            onClick={() => handleSchedule(slot.time)}
                            disabled={loadingTime !== null}
                            className={`w-full transition-all duration-200 ${
                              loadingTime === slot.time
                                ? "bg-primary text-white"
                                : "hover:border-primary/50"
                            }`}
                          >
                            {loadingTime === slot.time ? (
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent" />
                            ) : (
                              slot.time
                            )}
                          </Button>
                        ))
                      ) : (
                        <p className="col-span-3 text-center text-sm text-gray-500 py-8">
                          Nenhum horário disponível para esta data
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* App-like Footer Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg px-4 py-2 z-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="ghost"
              className="flex flex-col items-center justify-center h-16 hover:bg-primary/5"
              onClick={() => setShowScheduleModal(true)}
            >
              <Calendar className="h-6 w-6 mb-1 text-primary" />
              <span className="text-xs font-medium text-gray-600">Agendar</span>
            </Button>
            <Button
              variant="ghost"
              className="flex flex-col items-center justify-center h-16 hover:bg-primary/5"
              onClick={() => toast.info("Em breve!")}
            >
              <CalendarCheck className="h-6 w-6 mb-1 text-primary" />
              <span className="text-xs font-medium text-gray-600">
                Meus Agendamentos
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
