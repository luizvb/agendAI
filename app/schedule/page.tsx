"use client";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DaySelector } from "@/components/day-selector";
import { AppointmentDrawer } from "@/components/appointment-drawer";
import { AppointmentList } from "@/components/appoitment-list";
import {
  fetchServices,
  fetchNext45DaysAppointments,
  scheduleAppointment,
  cancelAppointment,
  fetchAppointmentsByPhone,
  fetchProfessionalsByService,
} from "@/services/api";

import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function Home() {
  const [availableDays, setAvailableDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [appointmentId, setAppointmentId] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [services, setServices] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [professionals, setProfessionals] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchServices().then((data) => setServices(data));
    const phone = localStorage.getItem("phone_number");
    if (phone) {
      fetchAppointmentsByPhone(phone).then((data) => setAppointments(data));
    }
  }, []);

  useEffect(() => {
    if (selectedProfessional) {
      fetchNext45DaysAppointments(selectedProfessional.id).then((data) => {
        setAvailableDays(data);
      });
    }
  }, [selectedProfessional]);

  useEffect(() => {
    if (selectedService) {
      fetchProfessionalsByService(selectedService.id).then((data) => {
        setProfessionals(data);
      });
    }
  }, [selectedService]);

  const handleDateTimeSelection = (date, time) => {
    setSelectedDay(date);
    setSelectedTime(time);
    setIsDrawerOpen(true);
  };

  const handleSchedule = () => {
    if (
      !selectedDay ||
      !selectedTime ||
      !selectedService?.id ||
      !selectedProfessional?.id
    ) {
      console.error("Dados insuficientes para agendar o compromisso");
      return;
    }

    console.log(selectedDay, selectedTime);
    const appointmentDate = new Date(
      `${selectedDay.split("T")[0]}T${selectedTime}:00-03:00`
    );

    scheduleAppointment({
      user: {
        phone_number: localStorage.getItem("phone_number"),
        username: localStorage.getItem("username"),
      },
      service: { id: selectedService.id },
      appointmentDate,
      professional: { id: selectedProfessional.id },
      company: { id: 1 },
    })
      .then((data) => {
        setAppointmentId(data.id);
        toast({
          title: "Sucesso",
          description: `Agendamento realizado com sucesso!`,
        });
        fetchAppointmentsByPhone("5511990096054@c.us").then((data) =>
          setAppointments(data)
        );
      })
      .catch((error) => {
        console.error("Erro ao agendar o compromisso:", error);
      });
  };

  const handleCancel = (id) => {
    cancelAppointment(id).then(() => {
      setAppointments((prev) => prev.filter((appt) => appt.id !== id));
      if (id === appointmentId) setAppointmentId(null);
      toast({
        title: "Cancelado",
        description: `Agendamento cancelado com sucesso!`,
      });
      fetchAppointmentsByPhone("5511990096054@c.us").then((data) =>
        setAppointments(data)
      );
    });
  };

  const handleNextDays = () => {
    setCurrentWeek((prevWeek) => prevWeek + 4);
  };

  const handlePreviousDays = () => {
    setCurrentWeek((prevWeek) => Math.max(prevWeek - 4, 0));
  };

  const startOfDays = currentWeek * 4;
  const endOfDays = startOfDays + 4;
  const daysToShow = availableDays.slice(startOfDays, endOfDays);

  const handleBackToProfessionals = () => {
    setSelectedProfessional(null);
    setSelectedDay(null);
    setSelectedTime(null);
  };

  const handleBackToServices = () => {
    setSelectedService(null);
    setSelectedProfessional(null);
    setSelectedDay(null);
    setSelectedTime(null);
  };

  const resetSelections = () => {
    setSelectedService(null);
    setSelectedProfessional(null);
    setSelectedDay(null);
    setSelectedTime(null);
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-grow flex flex-col">
        <div className="flex-grow flex flex-col items-center justify-center p-8">
          {!selectedService ? (
            <Card className="w-full min-h-[500px]">
              <CardHeader>
                <CardTitle>Escolha um Serviço</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Selecione um serviço abaixo para ver os horários disponíveis e
                  agendar seu atendimento.
                </p>
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 transition-opacity duration-500">
                  {services.map((service) => (
                    <Card
                      key={service.id}
                      className="cursor-pointer min-h-[150px]"
                      onClick={() => setSelectedService(service)}
                    >
                      <CardHeader>
                        <CardTitle>{service.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>{service.description}</p>
                        <p>R$ {service.price}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : !selectedProfessional ? (
            <Card className="w-full mt-8 min-h-[500px]">
              <CardHeader className="flex">
                <div className="flex flex-col items-start">
                  <Button
                    variant="outline"
                    onClick={handleBackToServices}
                    className="mr-2"
                  >
                    <ArrowLeft />
                  </Button>
                  <CardTitle className="mt-4">
                    Escolha um Profissional
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Selecione um profissional abaixo para realizar o serviço
                  escolhido.
                </p>
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 transition-opacity duration-500">
                  {professionals.map((professional) => (
                    <Card
                      key={professional.id}
                      className="cursor-pointer min-h-[150px]"
                      onClick={() => setSelectedProfessional(professional)}
                    >
                      <CardHeader>
                        <CardTitle>{professional.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>{professional.bio}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="w-full mt-8 transition-opacity duration-500 min-h-[500px]">
              <CardHeader className="flex">
                <div className="flex flex-col items-start">
                  <Button
                    variant="outline"
                    onClick={handleBackToProfessionals}
                    className="mr-2"
                  >
                    <ArrowLeft />
                  </Button>
                  <CardTitle className="mt-4">
                    Selecionar Horário para {selectedService.name} com{" "}
                    {selectedProfessional.name}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Selecione uma data e horário disponíveis para agendar seu
                  atendimento.
                </p>
                <DaySelector
                  currentWeek={currentWeek}
                  handlePreviousDays={handlePreviousDays}
                  handleNextDays={handleNextDays}
                  daysToShow={daysToShow}
                  selectedDay={selectedDay}
                  selectedTime={selectedTime}
                  handleDateTimeSelection={handleDateTimeSelection}
                  bookedTimes={availableDays.reduce((acc, day) => {
                    acc[day.date] = day.times
                      .filter((time) => time.booked)
                      .map((time) => time.time);
                    return acc;
                  }, {})}
                />
                <AppointmentDrawer
                  isDrawerOpen={isDrawerOpen}
                  setIsDrawerOpen={setIsDrawerOpen}
                  service={selectedService.name}
                  selectedDay={selectedDay}
                  selectedTime={selectedTime}
                  handleSchedule={handleSchedule}
                  resetSelections={resetSelections}
                />
              </CardContent>
            </Card>
          )}
          <Card className="w-full mt-8">
            <CardHeader>
              <CardTitle>Meus Agendamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <AppointmentList
                appointments={appointments}
                handleCancel={handleCancel}
              />
            </CardContent>
          </Card>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
