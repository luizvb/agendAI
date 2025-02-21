"use client";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDroppable,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useDraggable } from "@dnd-kit/core";
import { appointmentApi } from "@/services";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface Service {
  id: number;
  name: string;
  price: string;
  durationMinutes: number;
  isActive: boolean;
  description: string;
  customFields: any | null;
}

interface Professional {
  id: number;
  name: string;
  color: string;
  isActive: boolean;
  email: string | null;
  phone: string | null;
  preferences: any | null;
}

interface User {
  name: string;
  email: string;
  phone_number: string;
  notifications_enabled: boolean;
  isActive: boolean;
  id: number;
  username: string;
  preferences: any | null;
}

interface Appointment {
  id: number;
  company: any;
  service: Service;
  professional: Professional;
  user: User;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  price: number | null;
  rating: number | null;
  notes: string | null;
  cancellationReason: string | null;
  metadata: any | null;
}

interface CalendarViewProps {
  appointments: Appointment[];
  date: Date;
  onDateChange: (date: Date) => void;
  onAppointmentMove: (appointmentId: number, newTime: string) => void;
  professionals: Professional[];
}

// Função para verificar se um horário está disponível para um profissional
const isTimeAvailableForProfessional = (
  targetDate: Date,
  appointment: Appointment,
  appointments: Appointment[],
  excludeAppointmentId?: number
) => {
  console.log("Checking availability:", {
    targetDate,
    appointmentId: appointment.id,
    professionalId: appointment.professional.id,
    excludeAppointmentId,
  });

  // Filtra apenas os agendamentos do mesmo profissional e do mesmo dia
  const professionalAppointments = appointments.filter((apt) => {
    if (apt.id === excludeAppointmentId) return false;
    if (apt.professional.id !== appointment.professional.id) return false;

    const aptDate = new Date(apt.startTime);
    const isSameDay =
      aptDate.getDate() === targetDate.getDate() &&
      aptDate.getMonth() === targetDate.getMonth() &&
      aptDate.getFullYear() === targetDate.getFullYear();

    console.log("Appointment being checked:", {
      appointmentId: apt.id,
      startTime: apt.startTime,
      endTime: apt.endTime,
      isSameDay,
    });

    return isSameDay;
  });

  // Calcula o horário de início e fim do novo agendamento
  const originalDuration =
    new Date(appointment.endTime).getTime() -
    new Date(appointment.startTime).getTime();
  const targetEndDate = new Date(targetDate.getTime() + originalDuration);

  console.log("Target time range:", {
    start: targetDate,
    end: targetEndDate,
    duration: originalDuration / 60000, // Convertendo para minutos para debug
  });

  // Verifica se há conflito com algum dos agendamentos do profissional
  const hasConflict = professionalAppointments.some((apt) => {
    const aptStartDate = new Date(apt.startTime);
    const aptEndDate = new Date(apt.endTime);

    const conflict =
      (targetDate < aptEndDate && targetEndDate > aptStartDate) || // Novo agendamento sobrepõe com existente
      (aptStartDate < targetEndDate && aptEndDate > targetDate); // Agendamento existente sobrepõe com novo

    console.log("Checking conflict with appointment:", {
      appointmentId: apt.id,
      aptStart: aptStartDate,
      aptEnd: aptEndDate,
      hasConflict: conflict,
    });

    return conflict;
  });

  console.log("Final availability result:", !hasConflict);

  return !hasConflict;
};

// Função para gerar slots de tempo disponíveis
const generateAvailableTimeSlots = (
  hour: string,
  appointments: Appointment[],
  draggedAppointment: Appointment | null,
  currentDate: Date
) => {
  const slots: { time: string; isAvailable: boolean }[] = [];
  const [baseHour] = hour.split(":");

  // Gera slots de 15 em 15 minutos
  for (let minutes = 0; minutes < 60; minutes += 15) {
    const slotTime = `${baseHour}:${minutes.toString().padStart(2, "0")}`;
    const slotDate = new Date(currentDate);
    slotDate.setHours(parseInt(baseHour), minutes, 0, 0);

    // Se não há agendamento sendo arrastado, o slot está disponível
    if (!draggedAppointment) {
      slots.push({ time: slotTime, isAvailable: true });
      continue;
    }

    // Verifica se o slot específico está disponível para o profissional
    const isAvailable = isTimeAvailableForProfessional(
      slotDate,
      draggedAppointment,
      appointments,
      draggedAppointment.id
    );

    slots.push({ time: slotTime, isAvailable });
  }

  return slots;
};

// Componente para o slot de tempo
const TimeSlot = ({
  slot,
  activeSlot,
  onMouseOver,
  onMouseOut,
}: {
  slot: { time: string; isAvailable: boolean };
  activeSlot: string | null;
  onMouseOver: (time: string) => void;
  onMouseOut: () => void;
}) => (
  <div
    onMouseOver={() => onMouseOver(slot.time)}
    onMouseOut={onMouseOut}
    className={`
      h-8 md:h-6 border border-dashed rounded px-2 text-xs 
      ${
        !slot.isAvailable
          ? "bg-destructive/10 border-destructive/30 cursor-not-allowed"
          : "border-primary/30 cursor-pointer"
      }
      ${
        activeSlot === slot.time && slot.isAvailable
          ? "bg-primary/20 border-primary"
          : ""
      }
      transition-colors duration-200
    `}
  >
    <div className="flex justify-between items-center h-full">
      <span className="text-muted-foreground">{slot.time}</span>
      {!slot.isAvailable && (
        <span className="text-destructive text-[10px]">Ocupado</span>
      )}
    </div>
  </div>
);

// Componente para a área que recebe o drop
const TimeSlotDroppable = ({
  time,
  appointments,
  draggedAppointmentId,
  allAppointments,
  currentDate,
  children,
}: {
  time: string;
  appointments: (Appointment & { exactTime: string })[];
  draggedAppointmentId: number | null;
  allAppointments: Appointment[];
  currentDate: Date;
  children: React.ReactNode;
}) => {
  const [isOver, setIsOver] = useState(false);
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const draggedAppointment = allAppointments.find(
    (apt) => apt.id === draggedAppointmentId
  );

  console.log("TimeSlotDroppable render:", {
    time,
    draggedAppointmentId,
    draggedAppointment,
  });

  const { setNodeRef, isOver: dndIsOver } = useDroppable({
    id: time,
    data: {
      time,
      activeSlot,
    },
  });

  useEffect(() => {
    setIsOver(dndIsOver);
  }, [dndIsOver]);

  const handleSlotMouseOver = (slotTime: string) => {
    if (!draggedAppointment) return;
    console.log("Slot mouse over:", slotTime);
    setActiveSlot(slotTime);
  };

  const handleSlotMouseOut = () => {
    setActiveSlot(null);
  };

  // Gera os slots disponíveis
  const availableSlots = draggedAppointment
    ? Array.from({ length: 4 }, (_, i) => {
        const minutes = i * 15;
        const [hour] = time.split(":");
        const slotTime = `${hour}:${minutes.toString().padStart(2, "0")}`;
        const slotDate = new Date(currentDate);
        slotDate.setHours(parseInt(hour), minutes, 0, 0);

        console.log("Checking slot availability:", {
          slotTime,
          appointment: draggedAppointment,
        });

        const isAvailable = isTimeAvailableForProfessional(
          slotDate,
          draggedAppointment,
          allAppointments,
          draggedAppointment.id
        );

        return { time: slotTime, isAvailable };
      })
    : [];

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 px-2 py-2 min-h-[120px] transition-colors duration-200 ${
        isOver ? "bg-accent/20" : ""
      } ${draggedAppointment ? "cursor-copy" : ""}`}
    >
      <div className="grid grid-cols-1 gap-2">
        {draggedAppointment && (
          <div className="grid grid-cols-1 gap-2">
            {availableSlots.map((slot) => (
              <TimeSlot
                key={slot.time}
                slot={slot}
                activeSlot={activeSlot}
                onMouseOver={handleSlotMouseOver}
                onMouseOut={handleSlotMouseOut}
              />
            ))}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export function CalendarView({
  appointments,
  date,
  onDateChange,
  onAppointmentMove,
  professionals,
}: CalendarViewProps) {
  const { toast } = useToast();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    })
  );

  const [draggedAppointmentId, setDraggedAppointmentId] = useState<
    number | null
  >(null);

  // Modify timeSlots to show hourly intervals by default
  const timeSlots = Array.from({ length: 11 }, (_, i) => {
    const hour = i + 8;
    return `${hour.toString().padStart(2, "0")}:00`;
  });

  // Filtra os agendamentos do dia atual
  const todayAppointments = appointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.startTime);
    const isSameDay =
      appointmentDate.getDate() === date.getDate() &&
      appointmentDate.getMonth() === date.getMonth() &&
      appointmentDate.getFullYear() === date.getFullYear();

    console.log("Appointment Date:", appointmentDate);
    console.log("Current Date:", date);
    console.log("Is Same Day:", isSameDay);

    return isSameDay;
  });

  // Organiza os appointments por horário
  const appointmentsByHour = todayAppointments.reduce((acc, appointment) => {
    const startTime = new Date(appointment.startTime);
    const hour = startTime.getHours().toString().padStart(2, "0");
    const time = `${hour}:00`;

    if (!acc[time]) {
      acc[time] = [];
    }

    acc[time].push({
      ...appointment,
      exactTime: startTime.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });

    // Ordena os agendamentos pelo horário
    acc[time].sort((a, b) => {
      const timeA = new Date(a.startTime).getTime();
      const timeB = new Date(b.startTime).getTime();
      return timeA - timeB;
    });

    return acc;
  }, {} as Record<string, (Appointment & { exactTime: string })[]>);

  // Função para navegar entre dias
  const navigateDay = (direction: "prev" | "next") => {
    const newDate = new Date(date);
    if (direction === "prev") {
      newDate.setDate(date.getDate() - 1);
    } else {
      newDate.setDate(date.getDate() + 1);
    }
    onDateChange(newDate);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setDraggedAppointmentId(Number(active.id));
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const appointmentId = Number(active.id);
    const appointment = appointments.find((apt) => apt.id === appointmentId);
    if (!appointment) return;

    const activeSlotTime = (over as any).data?.current?.activeSlot;
    const dropTime = (over as any).data?.current?.time;

    if (!activeSlotTime && !dropTime) {
      toast({
        title: "Erro ao mover agendamento",
        description: "Não foi possível identificar o horário selecionado.",
        variant: "destructive",
      });
      return;
    }

    const targetTime = activeSlotTime || dropTime;
    const [hours, minutes] = targetTime.split(":");

    const newDate = new Date(date);
    newDate.setHours(parseInt(hours));
    newDate.setMinutes(parseInt(minutes));
    newDate.setSeconds(0);
    newDate.setMilliseconds(0);

    console.log("Target Time:", targetTime);
    console.log("New Date:", newDate);
    console.log("New Date ISO:", newDate.toISOString());

    const isAvailable = isTimeAvailableForProfessional(
      newDate,
      appointment,
      appointments,
      appointment.id
    );

    if (!isAvailable) {
      toast({
        title: "Horário indisponível",
        description:
          "Este profissional já possui um serviço agendado neste horário.",
        variant: "destructive",
      });
      return;
    }

    try {
      await appointmentApi.updateAppointmentTime(
        appointmentId,
        newDate.toISOString()
      );

      const formattedTime = `${hours.padStart(2, "0")}:${minutes.padStart(
        2,
        "0"
      )}`;
      if (onAppointmentMove) {
        onAppointmentMove(appointmentId, formattedTime);
      }

      toast({
        title: "Agendamento movido",
        description: `O agendamento foi movido para ${formattedTime}.`,
      });
    } catch (error) {
      console.error("Erro ao atualizar agendamento:", error);
      toast({
        title: "Erro ao mover agendamento",
        description: "Ocorreu um erro ao mover o agendamento.",
        variant: "destructive",
      });
    } finally {
      setDraggedAppointmentId(null);
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="w-full overflow-x-auto">
          <div className="min-w-[300px] md:min-w-[600px]">
            {/* Cabeçalho com navegação e data */}
            <div className="sticky top-0 bg-background z-10 py-2 border-b">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1 md:gap-2">
                  <button
                    onClick={() => navigateDay("prev")}
                    className="p-1 md:p-2 hover:bg-accent rounded-full"
                  >
                    <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
                  </button>
                  <button
                    onClick={() => navigateDay("next")}
                    className="p-1 md:p-2 hover:bg-accent rounded-full"
                  >
                    <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
                  </button>
                  <h3 className="text-sm md:text-lg font-semibold truncate">
                    {date.toLocaleDateString("pt-BR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </h3>
                </div>
                <button
                  onClick={() => {
                    onDateChange(new Date());
                  }}
                  className="text-xs md:text-sm px-2 md:px-3 py-1 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                  Hoje
                </button>
              </div>
            </div>

            {/* Grade de horários */}
            <div className="divide-y">
              {timeSlots.map((time) => {
                const slotAppointments = appointmentsByHour[time] || [];
                return (
                  <div key={time} className="flex min-h-[50px] md:min-h-[60px]">
                    {/* Coluna de horário */}
                    <div className="w-14 md:w-20 py-2 text-xs md:text-sm text-muted-foreground">
                      {time}
                    </div>

                    {/* Coluna de compromissos */}
                    <TimeSlotDroppable
                      time={time}
                      appointments={slotAppointments}
                      draggedAppointmentId={draggedAppointmentId}
                      allAppointments={todayAppointments}
                      currentDate={date}
                    >
                      {slotAppointments.map((appointment) => (
                        <DraggableAppointment
                          key={appointment.id}
                          appointment={appointment}
                          professionals={professionals}
                        />
                      ))}
                    </TimeSlotDroppable>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DndContext>
    </div>
  );
}

// Componente para o card arrastável
function DraggableAppointment({
  appointment,
  professionals,
}: {
  appointment: Appointment & { exactTime: string };
  professionals: CalendarViewProps["professionals"];
}) {
  const [showModal, setShowModal] = useState(false);
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: appointment.id,
    });

  const professional =
    Object.keys(appointment.professional).length === 0
      ? professionals.find((p) => p.id === appointment.professional.id)
      : appointment.professional;

  const backgroundColor = professional?.color || "#94a3b8";

  const style = {
    backgroundColor: `${backgroundColor}20`,
    borderLeft: `3px solid ${backgroundColor}`,
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    touchAction: "none" as const,
    width: isDragging ? "200px" : "100%",
    position: "relative" as const,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.9 : 1,
  };

  const startTime = new Date(appointment.startTime);
  const formattedTime = startTime.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleClick = (e: React.MouseEvent) => {
    if (isDragging) return;
    e.preventDefault();
    e.stopPropagation();
    setShowModal(true);
  };

  const handleCancelAppointment = async () => {
    try {
      await appointmentApi.cancelAppointment(appointment.id);
      setShowModal(false);
      window.location.reload();
    } catch (error) {
      console.error("Error canceling appointment:", error);
    }
  };

  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        className={`
          p-2 mb-2 md:mb-1 
          min-h-[2.5rem] md:min-h-[2.5rem] 
          touch-none select-none cursor-pointer
          transition-all duration-200 ease-in-out
          hover:shadow-md
          ${isDragging ? "shadow-lg !scale-90" : ""}
          ${appointment.status === "cancelled" ? "opacity-50" : ""}
        `}
        {...attributes}
        {...listeners}
        onClick={handleClick}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {appointment.service.name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {appointment.user.name}
            </p>
          </div>
          <div className="flex flex-col items-end ml-2">
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {formattedTime}
            </span>
            <span
              className={`text-[10px] whitespace-nowrap ${
                appointment.status === "pending"
                  ? "text-yellow-600"
                  : appointment.status === "confirmed"
                  ? "text-green-600"
                  : appointment.status === "cancelled"
                  ? "text-red-600"
                  : "text-gray-600"
              }`}
            >
              {appointment.status === "pending"
                ? "Pendente"
                : appointment.status === "confirmed"
                ? "Confirmado"
                : appointment.status === "cancelled"
                ? "Cancelado"
                : appointment.status}
            </span>
          </div>
        </div>
      </Card>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
            }
          }}
        >
          <div className="bg-background p-6 rounded-lg max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">
              Detalhes do Agendamento
            </h2>
            <div className="space-y-2">
              <p>
                <strong>Serviço:</strong> {appointment.service.name}
              </p>
              <p>
                <strong>Cliente:</strong> {appointment.user.name}
              </p>
              <p>
                <strong>Horário:</strong> {formattedTime}
              </p>
              <p>
                <strong>Duração:</strong> {appointment.service.durationMinutes}{" "}
                minutos
              </p>
              <p>
                <strong>Profissional:</strong>{" "}
                {professional?.name || "Não definido"}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    appointment.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : appointment.status === "confirmed"
                      ? "bg-green-100 text-green-800"
                      : appointment.status === "cancelled"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {appointment.status === "pending"
                    ? "Pendente"
                    : appointment.status === "confirmed"
                    ? "Confirmado"
                    : appointment.status === "cancelled"
                    ? "Cancelado"
                    : appointment.status}
                </span>
              </p>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                Fechar
              </button>
              {appointment.status !== "cancelled" && (
                <button
                  onClick={handleCancelAppointment}
                  className="px-4 py-2 rounded bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Cancelar Agendamento
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
