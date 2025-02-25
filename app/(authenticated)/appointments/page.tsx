"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Toaster } from "@/components/ui/toaster";
import { appointmentApi, professionalApi, serviceApi } from "@/services";
import { ScheduleModal } from "@/components/schedule-modal";
import { PWAInstallPrompt } from "@/components/pwa-install-prompt";
import { useOrganization } from "@/hooks/useOrganization";
import { AppointmentCalendar } from "@/components/AppointmentCalendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ErrorPage } from "@/components/error-page";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import type { Appointment } from "@/types/api";

interface Professional {
  id: number;
  name: string;
  avatarUrl: string;
}

interface Service {
  id: number;
  name: string;
}

interface TimeSlot {
  time: string;
}

interface AvailableTime {
  date: string;
  times: string[];
}

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [selectedProfessional, setSelectedProfessional] =
    useState<Professional | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [availableDays, setAvailableDays] = useState<AvailableTime[]>([]);
  const [error, setError] = useState<{
    type: "CORS" | "SERVER" | "GENERIC";
    message: string;
  } | null>(null);
  const { organization } = useOrganization();
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedProfessional) {
      appointmentApi
        .getAvailableTimes(selectedDate, selectedProfessional.id)
        .then((response: unknown) => {
          // Ensure response is an array and has the expected structure
          if (
            Array.isArray(response) &&
            response.every((item) => typeof item === "object" && "time" in item)
          ) {
            const formattedResponse: AvailableTime = {
              date: selectedDate.toISOString(),
              times: response.map((slot) => slot.time as string),
            };

            setAvailableDays([formattedResponse]);
          } else {
            console.error("Unexpected API response format:", response);
            setAvailableDays([{ date: selectedDate.toISOString(), times: [] }]);
          }
        })
        .catch((error) => {
          handleError(error);
        });
    }
  }, [selectedDate, selectedProfessional]);

  const handleError = (error: any) => {
    if (error.message?.includes("CORS")) {
      setError({ type: "CORS", message: error.message });
    } else if (error.response?.status === 500) {
      setError({ type: "SERVER", message: error.message });
    } else {
      setError({ type: "GENERIC", message: error.message });
    }
  };

  const loadData = async () => {
    try {
      setError(null);
      const [appointmentsData, professionalsData, servicesData] =
        await Promise.all([
          appointmentApi.list(),
          professionalApi.fetchProfessionals(),
          serviceApi.fetchServices(),
        ]);

      setAppointments(appointmentsData);
      setProfessionals(professionalsData);
      setServices(servicesData);
    } catch (error) {
      handleError(error);
    }
  };

  const handleSchedule = (date: Date) => {
    setSelectedDate(date);
    const formattedTime = date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    setSelectedTime(formattedTime);
    setShowScheduleModal(true);
  };

  const handleScheduleSuccess = () => {
    loadData();
  };

  const handleCopySchedulingLink = () => {
    if (organization?.name) {
      const baseUrl = window.location.origin;
      const schedulingLink = `${baseUrl}/agendar/${organization.name}`;

      navigator.clipboard
        .writeText(schedulingLink)
        .then(() => {
          toast({
            title: "Link copiado!",
            description:
              "O link de agendamento foi copiado para sua área de transferência.",
          });
        })
        .catch(() => {
          toast({
            variant: "destructive",
            title: "Erro",
            description: "Não foi possível copiar o link.",
          });
        });
    }
  };

  if (error) {
    return (
      <ErrorPage
        errorType={error.type}
        error={new Error(error.message)}
        onRetry={loadData}
      />
    );
  }

  return (
    <div className="min-h-screen flex">
      <div
        className={`flex-grow flex flex-col ${
          showScheduleModal ? "blur-md brightness-50" : ""
        }`}
      >
        <div className="flex-grow flex flex-col p-4 md:p-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {professionals.length > 0 &&
                professionals?.map((professional) => (
                  <Avatar
                    key={professional.id}
                    className={`cursor-pointer transition-all hover:ring-2 hover:ring-primary ${
                      selectedProfessional?.id === professional.id
                        ? "ring-2 ring-primary"
                        : ""
                    }`}
                    onClick={() => setSelectedProfessional(professional)}
                  >
                    <AvatarImage
                      src={professional.avatarUrl}
                      alt={professional.name}
                    />
                    <AvatarFallback>
                      {professional.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ))}
            </div>
            <Button
              onClick={handleCopySchedulingLink}
              className="whitespace-nowrap"
            >
              Copiar link de agendamento
            </Button>
          </div>
          <AppointmentCalendar
            selectedProfessional={selectedProfessional}
            onSchedule={handleSchedule}
            appointments={appointments}
            onAppointmentUpdate={loadData}
          />
        </div>
      </div>

      <ScheduleModal
        showScheduleModal={showScheduleModal}
        setShowScheduleModal={setShowScheduleModal}
        selectedService={selectedService}
        setSelectedService={setSelectedService}
        services={services}
        professionals={professionals}
        selectedProfessional={selectedProfessional}
        setSelectedProfessional={setSelectedProfessional}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        availableDays={availableDays}
        onScheduleSuccess={handleScheduleSuccess}
      />

      <PWAInstallPrompt />
      <Toaster />
    </div>
  );
}
