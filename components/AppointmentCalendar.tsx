"use client";

import { Scheduler } from "@aldabil/react-scheduler";
import { useEffect, useState } from "react";
import { appointmentApi } from "@/services";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "@/components/ui/use-toast";
import { Appointment } from "@/types/api";

interface AppointmentCalendarProps {
  selectedProfessional?: any;
  onAppointmentMove?: (appointmentId: number, newTime: string) => void;
  onSchedule?: (date: Date) => void;
  appointments: Appointment[];
  onAppointmentUpdate: () => void;
}

interface Event {
  event_id: number;
  title: string;
  start: Date;
  end: Date;
  draggable: boolean;
  deletable: boolean;
  editable: boolean;
  professionalId: number;
}

type DayHours = number;

interface BusinessHours {
  startHour: DayHours;
  endHour: DayHours;
}

export function AppointmentCalendar({
  selectedProfessional,
  onAppointmentMove,
  onSchedule,
  appointments: appointmentsData,
  onAppointmentUpdate,
}: AppointmentCalendarProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [businessHours, setBusinessHours] = useState<BusinessHours>({
    startHour: 8,
    endHour: 20,
  });

  const getBusinessHours = () => {
    if (!appointmentsData[0]?.organization?.businessHours) {
      return businessHours;
    }

    const businessHoursData = appointmentsData[0].organization.businessHours;

    // Encontra o menor horário de início e o maior horário de término da semana
    let minStartHour = 24;
    let maxEndHour = 0;

    const daysOfWeek = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];

    daysOfWeek.forEach((day) => {
      const hours = businessHoursData[day];
      if (hours?.start && hours?.end) {
        const [startHour] = hours.start.split(":").map(Number);
        let [endHour] = hours.end.split(":").map(Number);

        // Ajusta meia-noite para 24
        endHour = endHour === 0 ? 24 : endHour;

        minStartHour = Math.min(minStartHour, startHour);
        maxEndHour = Math.max(maxEndHour, endHour);
      }
    });

    // Se não encontrou nenhum horário válido, retorna o padrão
    if (minStartHour === 24 && maxEndHour === 0) {
      return businessHours;
    }

    return {
      startHour: minStartHour,
      endHour: maxEndHour,
    };
  };

  useEffect(() => {
    if (!appointmentsData) {
      setEvents([]);
      return;
    }

    // Atualiza os horários de funcionamento usando toda a semana
    if (appointmentsData[0]?.organization?.businessHours) {
      const hours = getBusinessHours();
      setBusinessHours(hours);
    }

    const formattedEvents =
      appointmentsData?.length > 0
        ? appointmentsData?.map((apt: any) => ({
            event_id: apt.id,
            title: `${apt?.client?.name || ""} - ${apt?.service?.name}`,
            start: new Date(apt.startTime),
            end: new Date(apt.endTime),
            draggable: true,
            deletable: true,
            editable: false,
            professionalId: apt.professional.id,
          }))
        : [];

    setEvents(formattedEvents);
  }, [appointmentsData]);

  const handleEventDrop = async (
    draggedEvent: any,
    updatedEvent: any,
    droppedOn: Date
  ) => {
    try {
      const formattedTime = format(droppedOn, "HH:mm");
      await appointmentApi.updateAppointmentTime(
        draggedEvent.event_id,
        formattedTime
      );
      onAppointmentMove?.(draggedEvent.event_id, formattedTime);
      toast({
        title: "Sucesso",
        description: "Horário atualizado com sucesso",
      });
      onAppointmentUpdate();
    } catch (error) {
      console.error("Error updating appointment time:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o horário",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (deletedId: string | number) => {
    try {
      await appointmentApi.delete(deletedId as number);
      toast({
        title: "Sucesso",
        description: "Agendamento cancelado com sucesso",
      });
      onAppointmentUpdate();
      return deletedId;
    } catch (error) {
      console.error("Error deleting appointment:", error);
      toast({
        title: "Erro",
        description: "Não foi possível cancelar o agendamento",
        variant: "destructive",
      });
      return undefined;
    }
  };

  const handleCellClick = (selectedDate: Date) => {
    onSchedule?.(selectedDate);
  };

  const handleNavigate = (date: Date) => {
    console.log("Navigating to date:", date);
    setCurrentDate(date);
  };

  const filteredEvents = selectedProfessional
    ? events.filter((apt) => apt.professionalId === selectedProfessional.id)
    : events;

  return (
    <div className="h-[calc(100vh-100px)] relative z-0">
      <div className="absolute inset-0 overflow-auto">
        <Scheduler
          view="day"
          events={filteredEvents}
          loading={loading}
          onEventDrop={handleEventDrop}
          onDelete={handleDelete}
          onCellClick={handleCellClick}
          draggable={true}
          deletable={true}
          editable={false}
          hourFormat="24"
          locale={ptBR}
          onNavigate={handleNavigate}
          selectedDate={currentDate}
          month={{
            weekDays: [0, 1, 2, 3, 4, 5, 6],
            weekStartOn: 0,
            startHour: businessHours.startHour as number,
            endHour: businessHours.endHour as number,
          }}
          week={{
            weekDays: [0, 1, 2, 3, 4, 5, 6],
            weekStartOn: 0,
            startHour: businessHours.startHour as number,
            endHour: businessHours.endHour as number,
            step: 30,
          }}
          day={{
            startHour: businessHours.startHour as number,
            endHour: businessHours.endHour as number,
            step: 30,
          }}
          translations={{
            navigation: {
              month: "Mês",
              week: "Semana",
              day: "Dia",
              today: "Hoje",
              agenda: "Agenda",
            },
            form: {
              addTitle: "Adicionar Agendamento",
              editTitle: "Editar Agendamento",
              confirm: "Confirmar",
              delete: "Deletar",
              cancel: "Cancelar",
            },
            event: {
              title: "Título",
              subtitle: "Detalhes",
              start: "Início",
              end: "Fim",
              allDay: "Dia inteiro",
            },
            moreEvents: "Mais",
            loading: "Carregando...",
            noDataToDisplay: "Nenhum agendamento encontrado",
          }}
        />
      </div>
    </div>
  );
}
