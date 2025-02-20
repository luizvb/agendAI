"use client";
import { CalendarView } from "@/components/calendar-view";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster } from "@/components/ui/toaster";
import { useState, useEffect } from "react";
import {
  fetchAppointments,
  fetchProfessionals,
  fetchServices,
  fetchNext45DaysAppointments,
  scheduleAppointment,
} from "@/services/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [appointmentsData, professionalsData, servicesData] =
          await Promise.all([
            fetchAppointments(),
            fetchProfessionals(),
            fetchServices(),
          ]);
        setAppointments(appointmentsData);
        setProfessionals(professionalsData);
        setServices(servicesData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (selectedService && selectedProfessional && showScheduleModal) {
      fetchNext45DaysAppointments(selectedProfessional.id).then((data) => {
        const todaySlots = data.find(
          (day) =>
            day.date.split("T")[0] === selectedDate.toISOString().split("T")[0]
        );
        setAvailableSlots(todaySlots?.times || []);
      });
    }
  }, [selectedService]);

  const handleAppointmentMove = (appointmentId: number, newTime: string) => {
    setAppointments((currentAppointments) =>
      currentAppointments.map((apt) => {
        if (apt.id === appointmentId) {
          const [hours, minutes] = newTime.split(":");
          const newDate = new Date(apt.appointmentDate);
          newDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

          return {
            ...apt,
            appointmentDate: newDate.toISOString(),
          };
        }
        return apt;
      })
    );
  };

  const handleScheduleAppointment = async (time) => {
    if (!selectedService || !selectedProfessional) {
      toast({
        title: "Erro",
        description: "Selecione um serviço e profissional",
        variant: "destructive",
      });
      return;
    }

    const appointmentDate = new Date(selectedDate);
    const [hours, minutes] = time.split(":");
    appointmentDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    try {
      await scheduleAppointment({
        service: { id: selectedService.id },
        professional: { id: selectedProfessional.id },
        appointmentDate: appointmentDate.toISOString(),
        company: { id: 1 },
        user: {
          phone_number: localStorage.getItem("phone_number"),
          username: localStorage.getItem("username"),
        },
      });

      toast({
        title: "Sucesso",
        description: "Agendamento realizado com sucesso!",
      });

      setShowScheduleModal(false);
      setSelectedService(null);
      // Refresh appointments
      const appointmentsData = await fetchAppointments();
      setAppointments(appointmentsData);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao realizar agendamento",
        variant: "destructive",
      });
    }
  };

  const handleServiceSelection = (service) => {
    setSelectedService(service);
    if (selectedProfessional) {
      fetchNext45DaysAppointments(selectedProfessional.id).then((data) => {
        const todaySlots = data.find(
          (day) =>
            day.date.split("T")[0] === selectedDate.toISOString().split("T")[0]
        );
        setAvailableSlots(todaySlots?.times || []);
      });
    }
  };

  return (
    <div className="min-h-screen flex">
      <div
        className={`flex-grow flex flex-col ${
          showScheduleModal ? "blur-md brightness-50" : ""
        }`}
      >
        <div className="flex-grow flex flex-col p-4 md:p-8">
          <Card className="w-full">
            <CardHeader className="pb-4 md:pb-6">
              <div className="flex justify-between items-center">
                <CardTitle>Agenda do Dia</CardTitle>
                <Button onClick={() => setShowScheduleModal(true)}>
                  Agendar
                </Button>
              </div>
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                <Avatar
                  className={`ml-2 mt-2 cursor-pointer transition-all hover:ring-2 hover:ring-primary ${
                    !selectedProfessional ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedProfessional(null)}
                >
                  <AvatarFallback>ALL</AvatarFallback>
                </Avatar>
                {professionals.map((professional) => (
                  <Avatar
                    key={professional.id}
                    className={` ml-2 mt-2  cursor-pointer transition-all hover:ring-2 hover:ring-primary ${
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
            </CardHeader>
            <CardContent>
              <CalendarView
                appointments={appointments.filter(
                  (apt) =>
                    !selectedProfessional ||
                    apt.professional.id === selectedProfessional.id
                )}
                date={selectedDate}
                onDateChange={setSelectedDate}
                onAppointmentMove={handleAppointmentMove}
                professionals={professionals}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {showScheduleModal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowScheduleModal(false);
              setSelectedService(null);
              setAvailableSlots([]);
            }
          }}
        >
          <div className="w-full h-full md:h-auto flex items-center justify-center">
            <div className="bg-background w-full h-full md:w-[600px] md:min-h-[500px] md:max-h-[80vh] md:rounded-lg overflow-hidden">
              <div className="sticky top-0 bg-background z-10 p-4 md:p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg md:text-xl font-semibold">
                    Novo Agendamento
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowScheduleModal(false);
                      setSelectedService(null);
                      setAvailableSlots([]);
                    }}
                  >
                    ✕
                  </Button>
                </div>
              </div>

              <div className="overflow-y-auto h-[calc(100%-73px)]">
                <div className="p-4 md:p-6">
                  {!selectedService ? (
                    <div>
                      <h3 className="text-lg font-medium mb-4">
                        Escolha um Serviço
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {services.map((service) => (
                          <Card
                            key={service.id}
                            className="cursor-pointer hover:bg-accent/50 transition-colors"
                            onClick={() => handleServiceSelection(service)}
                          >
                            <CardHeader>
                              <CardTitle className="text-base">
                                {service.name}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground">
                                {service.description}
                              </p>
                              <p className="text-sm font-medium mt-2">
                                R$ {service.price}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedService(null);
                          setAvailableSlots([]);
                        }}
                        className="mb-4"
                      >
                        ← Voltar aos serviços
                      </Button>
                      <div className="space-y-6">
                        <div className="mb-6">
                          <h3 className="text-lg font-medium mb-4">
                            Detalhes do Agendamento
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            Serviço: {selectedService.name}
                          </p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium mb-2">
                            Profissional
                          </h3>
                          <div className="flex gap-2 overflow-x-auto pb-2">
                            {professionals.map((professional) => (
                              <Avatar
                                key={professional.id}
                                className={`mt-2 ml-2 cursor-pointer transition-all hover:ring-2 hover:ring-primary ${
                                  selectedProfessional?.id === professional.id
                                    ? "ring-2 ring-primary"
                                    : ""
                                }`}
                                onClick={() => {
                                  setSelectedProfessional(professional);
                                  fetchNext45DaysAppointments(
                                    professional.id
                                  ).then((data) => {
                                    const todaySlots = data.find(
                                      (day) =>
                                        day.date.split("T")[0] ===
                                        selectedDate.toISOString().split("T")[0]
                                    );
                                    setAvailableSlots(todaySlots?.times || []);
                                  });
                                }}
                              >
                                <AvatarImage
                                  src={professional.avatarUrl}
                                  alt={professional.name}
                                />
                                <AvatarFallback>
                                  {professional.name
                                    .substring(0, 2)
                                    .toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium mb-2">Data</h3>
                          <div className="flex items-center gap-2 mb-4">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                const newDate = new Date(selectedDate);
                                newDate.setDate(selectedDate.getDate() - 1);
                                setSelectedDate(newDate);
                                if (selectedProfessional) {
                                  fetchNext45DaysAppointments(
                                    selectedProfessional.id
                                  ).then((data) => {
                                    const todaySlots = data.find(
                                      (day) =>
                                        day.date.split("T")[0] ===
                                        newDate.toISOString().split("T")[0]
                                    );
                                    setAvailableSlots(todaySlots?.times || []);
                                  });
                                }
                              }}
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-sm">
                              {selectedDate.toLocaleDateString("pt-BR", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                              })}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                const newDate = new Date(selectedDate);
                                newDate.setDate(selectedDate.getDate() + 1);
                                setSelectedDate(newDate);
                                if (selectedProfessional) {
                                  fetchNext45DaysAppointments(
                                    selectedProfessional.id
                                  ).then((data) => {
                                    const todaySlots = data.find(
                                      (day) =>
                                        day.date.split("T")[0] ===
                                        newDate.toISOString().split("T")[0]
                                    );
                                    setAvailableSlots(todaySlots?.times || []);
                                  });
                                }
                              }}
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium mb-2">
                            Horários Disponíveis
                          </h3>
                          {selectedProfessional ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                              {availableSlots.map((slot) => (
                                <Button
                                  key={slot.time}
                                  variant="outline"
                                  className={`p-4 ${
                                    slot.booked
                                      ? "opacity-50 cursor-not-allowed"
                                      : "hover:bg-primary hover:text-primary-foreground"
                                  }`}
                                  disabled={slot.booked}
                                  onClick={() =>
                                    handleScheduleAppointment(slot.time)
                                  }
                                >
                                  {slot.time}
                                </Button>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              Selecione um profissional para ver os horários
                              disponíveis
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Toaster />
    </div>
  );
}
