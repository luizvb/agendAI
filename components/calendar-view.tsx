import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useDraggable } from "@dnd-kit/core";
import { updateAppointmentTime, cancelAppointment } from "@/services/api";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface Appointment {
  id: number;
  appointmentDate: string;
  service: {
    name: string;
    duration: number;
  };
  user: {
    username: string;
  };
  professional: {
    id: number;
  };
}

interface CalendarViewProps {
  appointments: Appointment[];
  date: Date;
  onDateChange: (date: Date) => void;
  onAppointmentMove: (appointmentId: number, newTime: string) => void;
  professionals: Array<{
    id: number;
    name: string;
    color?: string;
    avatarUrl?: string;
  }>;
}

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
        distance: 8,
      },
    })
  );

  console.log("appointments", appointments);

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

  // Modify timeSlots to show hourly intervals by default
  const timeSlots = Array.from({ length: 11 }, (_, i) => {
    const hour = i + 8;
    return `${hour.toString().padStart(2, "0")}:00`;
  });

  // Organiza os appointments por horário
  const appointmentsByHour = appointments
    .filter((appointment) => {
      const appointmentDate = new Date(appointment.appointmentDate);
      return (
        appointmentDate.getDate() === date.getDate() &&
        appointmentDate.getMonth() === date.getMonth() &&
        appointmentDate.getFullYear() === date.getFullYear()
      );
    })
    .reduce((acc, appointment) => {
      const appointmentDate = new Date(appointment.appointmentDate);
      const hour = appointmentDate.getHours().toString().padStart(2, "0");
      const time = `${hour}:00`;

      if (!acc[time]) {
        acc[time] = [];
      }
      acc[time].push({
        ...appointment,
        exactTime: appointmentDate.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });

      // Ordena os agendamentos pelo horário
      acc[time].sort((a, b) => {
        const timeA = new Date(a.appointmentDate).getTime();
        const timeB = new Date(b.appointmentDate).getTime();
        return timeA - timeB;
      });

      return acc;
    }, {} as Record<string, (Appointment & { exactTime: string })[]>);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const appointmentId = Number(active.id);
    const appointment = appointments.find((apt) => apt.id === appointmentId);
    if (!appointment) return;

    console.log("appointment", appointment);

    const duration = appointment?.service?.minDuration;
    const newTime = over.id as string;
    const activeSlotTime = (over as any).data?.current?.activeSlot;

    if (!activeSlotTime) return;

    const [slotHour, slotMinutes] = activeSlotTime.split(":");
    const finalHours = parseInt(slotHour);
    const finalMinutes = parseInt(slotMinutes);

    const newDate = new Date(date);
    newDate.setHours(finalHours, finalMinutes, 0, 0);
    const endTime = new Date(newDate.getTime() + duration * 60000);

    // Check for conflicts with existing appointments
    const hasConflict = appointments.some((apt) => {
      console.log("apt", apt);
      if (apt.id === appointmentId) return false;
      const aptStart = new Date(apt.appointmentDate);
      const aptEnd = new Date(
        aptStart.getTime() + apt?.service?.minDuration * 60000
      );

      return (
        (newDate >= aptStart && newDate < aptEnd) ||
        (endTime > aptStart && endTime <= aptEnd) ||
        (newDate <= aptStart && endTime >= aptEnd)
      );
    });

    if (hasConflict) {
      console.error("Conflito de horários");
      toast({
        title: "Conflito de horários",
        description: "O horário selecionado já está ocupado.",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateAppointmentTime(appointmentId, newDate.toISOString());
      const formattedTime = `${finalHours
        .toString()
        .padStart(2, "0")}:${finalMinutes.toString().padStart(2, "0")}`;
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
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
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
                    {slotAppointments.length > 0
                      ? slotAppointments.map((apt) => (
                          <div key={apt.id}>{apt.exactTime}</div>
                        ))
                      : time}
                  </div>

                  {/* Coluna de compromissos */}
                  <TimeSlotDroppable
                    time={time}
                    appointments={slotAppointments}
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
  );
}

// Novo componente para o card arrastável
function DraggableAppointment({
  appointment,
  professionals,
}: {
  appointment: Appointment & { exactTime: string };
  professionals: CalendarViewProps["professionals"];
}) {
  const [showModal, setShowModal] = useState(false);
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: appointment.id,
  });

  const professional = professionals.find(
    (p) => p.id === appointment.professional.id
  );
  const backgroundColor = professional?.color || "var(--primary)";

  const style = {
    ...(transform ? { transform: CSS.Transform.toString(transform) } : {}),
    backgroundColor: `${backgroundColor}20`,
    borderLeft: `3px solid ${backgroundColor}`,
  };

  const handleClick = (e: React.MouseEvent) => {
    // Prevent drag from starting when clicking to open modal
    e.stopPropagation();
    setShowModal(true);
  };

  const handleCancelAppointment = async () => {
    try {
      await cancelAppointment(appointment.id);
      setShowModal(false);
      // You might want to add a callback to refresh the appointments list
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
        className="p-1 md:p-2 mb-1 cursor-move"
        onClick={handleClick}
        {...attributes}
        {...listeners}
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs md:text-sm font-medium truncate">
              {appointment.service.name}
            </p>
            <p className="text-[10px] md:text-xs text-muted-foreground truncate">
              {appointment.user.username}
            </p>
          </div>
          <span className="text-[10px] md:text-xs text-muted-foreground">
            {appointment.exactTime}
          </span>
        </div>
      </Card>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={(e) => {
            // Close modal only if clicking the backdrop (not the modal content)
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
                <strong>Cliente:</strong> {appointment.user.username}
              </p>
              <p>
                <strong>Horário:</strong> {appointment.exactTime}
              </p>
              <p>
                <strong>Duração:</strong> {appointment.service.duration} minutos
              </p>
              <p>
                <strong>Profissional:</strong> {professional?.name}
              </p>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                Fechar
              </button>
              <button
                onClick={handleCancelAppointment}
                className="px-4 py-2 rounded bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Cancelar Agendamento
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Modificar a coluna de compromissos para usar useDroppable
const TimeSlotDroppable = ({
  time,
  children,
  appointments,
}: {
  time: string;
  children: React.ReactNode;
  appointments: (Appointment & { exactTime: string })[];
}) => {
  const [isOver, setIsOver] = useState(false);
  const [activeSlot, setActiveSlot] = useState<string | null>(null);

  // Generate available time slots considering appointment durations
  const timeSlots = (() => {
    const [hour] = time.split(":");
    return Array.from({ length: 4 }, (_, i) => {
      const minutes = i * 15;
      const slotTime = `${hour}:${minutes.toString().padStart(2, "0")}`;

      // Check if this slot would conflict with any existing appointment
      const isOccupied = (draggedAppointment: Appointment) => {
        if (!draggedAppointment) return false;
        console.log("draggedAppointment", draggedAppointment);
        const duration = draggedAppointment?.service?.minDuration;
        const slotDate = new Date(date);
        const [h, m] = slotTime.split(":");
        slotDate.setHours(parseInt(h), parseInt(m), 0, 0);
        const endTime = new Date(slotDate.getTime() + duration * 60000);

        return appointments.some((apt) => {
          const aptStart = new Date(apt.appointmentDate);
          const aptEnd = new Date(
            aptStart.getTime() + apt.service.duration * 60000
          );

          return (
            (slotDate >= aptStart && slotDate < aptEnd) ||
            (endTime > aptStart && endTime <= aptEnd) ||
            (slotDate <= aptStart && endTime >= aptEnd)
          );
        });
      };

      return { time: slotTime, isOccupied };
    });
  })();

  const { setNodeRef, isOver: dndIsOver } = useDroppable({
    id: time,
    disabled: appointments.length > 0,
    data: {
      activeSlot,
    },
  });

  // Atualizar isOver quando o estado do dnd mudar
  useEffect(() => {
    setIsOver(dndIsOver);
  }, [dndIsOver]);

  // Handler para mouse over nos slots de minutos
  const handleSlotMouseOver = (slotTime: string) => {
    if (!isOver) return;
    setActiveSlot(slotTime);
  };

  const handleSlotMouseOut = () => {
    setActiveSlot(null);
  };

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 px-1 md:px-2 py-1 transition-all duration-200 ${
        isOver ? "bg-accent/20 min-h-[120px]" : ""
      }`}
    >
      {isOver ? (
        <div className="grid grid-cols-1 gap-1">
          {timeSlots.map((slot) => {
            const isOccupied = slot.isOccupied(appointments[0]);
            return (
              <div
                key={slot.time}
                onMouseOver={() => handleSlotMouseOver(slot.time)}
                onMouseOut={handleSlotMouseOut}
                className={`
                  h-6 border border-dashed rounded px-2 text-xs 
                  ${
                    isOccupied
                      ? "bg-destructive/10 border-destructive/30 cursor-not-allowed"
                      : "border-primary/30 cursor-pointer"
                  }
                  ${
                    activeSlot === slot.time && !isOccupied
                      ? "bg-primary/20 border-primary"
                      : ""
                  }
                  transition-colors duration-200
                `}
              >
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{slot.time}</span>
                  {isOccupied && (
                    <span className="text-destructive text-[10px]">
                      Ocupado
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        children
      )}
    </div>
  );
};
