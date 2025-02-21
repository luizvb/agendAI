"use client";
import { useState, useEffect } from "react";
import { CalendarView } from "@/components/calendar-view";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Toaster } from "@/components/ui/toaster";
import { appointmentApi, professionalApi, serviceApi } from "@/services";
import { CalendarHeader } from "@/components/calendar-header";
import { ScheduleModal } from "@/components/schedule-modal";
import { PWAInstallPrompt } from "@/components/pwa-install-prompt";
import { useOrganization } from "@/hooks/useOrganization";

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const { organization } = useOrganization();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [appointmentsData, professionalsData, servicesData] =
        await Promise.all([
          appointmentApi.fetchAppointments(),
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

  const handleAppointmentMove = (appointmentId: number, newTime: string) => {
    setAppointments((currentAppointments) =>
      currentAppointments.map((apt) => {
        if (apt.id === appointmentId) {
          const [hours, minutes] = newTime.split(":");
          const newDate = new Date(apt.startTime);
          newDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
          const endDate = new Date(
            newDate.getTime() + apt.service.durationMinutes * 60000
          );
          return {
            ...apt,
            startTime: newDate.toISOString(),
            endTime: endDate.toISOString(),
          };
        }
        return apt;
      })
    );
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
            <CardHeader>
              <CalendarHeader
                setShowScheduleModal={setShowScheduleModal}
                selectedProfessional={selectedProfessional}
                setSelectedProfessional={setSelectedProfessional}
                professionals={professionals}
              />
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
          availableSlots={availableSlots}
          setAvailableSlots={setAvailableSlots}
          onScheduleSuccess={loadData}
        />
      )}
      <PWAInstallPrompt />
      <Toaster />
    </div>
  );
}
