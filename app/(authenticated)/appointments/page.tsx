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

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [availableDays, setAvailableDays] = useState([]);
  const { organization } = useOrganization();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedProfessional) {
      appointmentApi
        .fetchNext45DaysAppointments(selectedProfessional.id)
        .then((data) => {
          setAvailableDays(data);
        });
    }
  }, [selectedProfessional]);

  const loadData = async () => {
    try {
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
      console.error("Error loading data:", error);
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

  return (
    <div className="min-h-screen flex">
      <div
        className={`flex-grow flex flex-col ${
          showScheduleModal ? "blur-md brightness-50" : ""
        }`}
      >
        <div className="flex-grow flex flex-col p-4 md:p-8">
          <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-2">
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
