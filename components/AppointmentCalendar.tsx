"use client";

import { Scheduler } from "@aldabil/react-scheduler";
import { useEffect, useState } from "react";
import { appointmentApi } from "@/services";
import { ptBR } from "date-fns/locale";
import { toast } from "@/components/ui/use-toast";
import { Appointment } from "@/types/appointment";
import { Professional } from "@/types/professional";

interface AppointmentCalendarProps {
  selectedProfessional?: Professional;
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
  color?: string;
}

interface BusinessHours {
  startHour: number;
  endHour: number;
}

export function AppointmentCalendar({
  selectedProfessional,
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
        ? appointmentsData?.map((apt: Appointment) => {
            const startDate = new Date(apt.startTime);
            const endDate = new Date(apt.endTime);

            return {
              event_id: apt.id,
              title: `${apt?.client?.name || ""} - ${apt?.service?.name}`,
              start: startDate,
              end: endDate,
              draggable: true,
              deletable: true,
              editable: false,
              professionalId: apt.professional.id,
              color: apt.professional.color || "#6366f1", // Use professional's color or default to purple
            };
          })
        : [];

    setEvents(formattedEvents);
  }, [appointmentsData]);

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

  const filteredEvents = selectedProfessional
    ? events.filter((apt) => apt.professionalId === selectedProfessional.id)
    : events;

  return (
    <div className="h-full w-full">
      <div className="h-full w-full relative isolate">
        <Scheduler
          view="day"
          events={filteredEvents}
          loading={loading}
          timeZone="America/Sao_Paulo"
          onDelete={handleDelete}
          onCellClick={handleCellClick}
          draggable={true}
          deletable={true}
          editable={false}
          hourFormat="24"
          locale={ptBR}
          selectedDate={currentDate}
          month={{
            weekDays: [0, 1, 2, 3, 4, 5, 6],
            weekStartOn: 0,
            startHour: businessHours.startHour as any,
            endHour: businessHours.endHour as any,
          }}
          week={{
            weekDays: [0, 1, 2, 3, 4, 5, 6],
            weekStartOn: 0,
            startHour: businessHours.startHour as any,
            endHour: businessHours.endHour as any,
            step: 30,
          }}
          day={{
            startHour: businessHours.startHour as any,
            endHour: businessHours.endHour as any,
            step: 30,
          }}
          eventRenderer={({ event, onClick }) => {
            // Convert hex to rgb
            const hexToRgb = (hex: string) => {
              const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
                hex
              );
              return result
                ? {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16),
                  }
                : null;
            };

            const color = event.color || "#6366f1";
            const rgb = hexToRgb(color);
            const backgroundColor = rgb
              ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.99)`
              : color;

            return (
              <div
                onClick={onClick}
                style={{
                  backgroundColor,
                  color: "#fff",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  height: "100%",
                  overflow: "hidden",
                  cursor: "pointer",
                  boxShadow: `0 1px 3px rgba(${rgb?.r}, ${rgb?.g}, ${rgb?.b}, 0.3)`,
                }}
              >
                {event.title}
              </div>
            );
          }}
          fields={[
            {
              name: "title",
              type: "input",
              config: { label: "Título", required: true },
            },
            {
              name: "start",
              type: "date",
              config: { label: "Início", required: true },
            },
            {
              name: "end",
              type: "date",
              config: { label: "Fim", required: true },
            },
          ]}
          dialogMaxWidth="sm"
          translations={{
            navigation: {
              month: "MÊS",
              week: "SEMANA",
              day: "DIA",
              today: "HOJE",
              agenda: "AGENDA",
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
