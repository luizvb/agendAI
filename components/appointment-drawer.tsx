"use client";

import { useEffect, useState } from "react";
import { CheckIcon, Clock } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "./phone-input";
import { appointmentApi } from "@/services/appointmentApi";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ClientSelect } from "./client-select";
import { Client } from "@/types/client";

interface AppointmentDrawerProps {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  service: string;
  selectedDay: string;
  selectedTime: string;
  handleSchedule: () => void;
  resetSelections: () => void;
  clients: Client[];
  selectedClient: Client | null;
  onClientSelect: (client: Client) => void;
}

export function AppointmentDrawer({
  isDrawerOpen,
  setIsDrawerOpen,
  service,
  selectedDay,
  selectedTime,
  handleSchedule,
  resetSelections,
  clients,
  selectedClient,
  onClientSelect,
}: AppointmentDrawerProps) {
  const [isScheduled, setIsScheduled] = useState(false);
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );
  const [phoneNumber, setPhoneNumber] = useState(
    localStorage.getItem("phone_number") || ""
  );
  const [needRegister, setNeedRegister] = useState(false);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [isLoadingTimes, setIsLoadingTimes] = useState(false);

  useEffect(() => {
    if (
      !localStorage.getItem("username") ||
      !localStorage.getItem("phone_number")
    ) {
      setNeedRegister(true);
    }
  }, []);

  useEffect(() => {
    const fetchAvailableTimes = async () => {
      if (selectedDay && selectedProfessional?.id) {
        setIsLoadingTimes(true);
        try {
          const response = await appointmentApi.fetchNext45DaysAppointments(
            selectedProfessional.id
          );

          // Encontrar os horários disponíveis para o dia selecionado
          const selectedDayData = response.find((day) => {
            const dayDate = new Date(day.date);
            const selectedDate = new Date(selectedDay);
            return (
              dayDate.getFullYear() === selectedDate.getFullYear() &&
              dayDate.getMonth() === selectedDate.getMonth() &&
              dayDate.getDate() === selectedDate.getDate()
            );
          });

          if (selectedDayData) {
            const availableTimes = selectedDayData.times
              .map((t) => t.time)
              .sort((a, b) => {
                const [aHours, aMinutes] = a.split(":").map(Number);
                const [bHours, bMinutes] = b.split(":").map(Number);
                return aHours * 60 + aMinutes - (bHours * 60 + bMinutes);
              });
            setAvailableTimes(availableTimes);
          } else {
            setAvailableTimes([]);
          }
        } catch (error) {
          console.error("Error fetching available times:", error);
          setAvailableTimes([]);
        } finally {
          setIsLoadingTimes(false);
        }
      } else {
        setAvailableTimes([]);
      }
    };

    fetchAvailableTimes();
  }, [selectedDay, selectedProfessional]);

  const handleScheduleClick = () => {
    handleSchedule();
    setIsScheduled(true);
  };

  const handleCheckIconClick = () => {
    setIsDrawerOpen(false);
    setIsScheduled(false);
    resetSelections();
  };

  const handleSaveUserInfo = () => {
    localStorage.setItem("username", username);
    localStorage.setItem("phone_number", phoneNumber);
    setNeedRegister(false);
  };

  const formatDateToBrazilian = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("pt-BR", options);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e);
  };

  return (
    <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Confirmar Agendamento</SheetTitle>
        </SheetHeader>
        <div className="py-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Cliente</label>
              <ClientSelect
                value={selectedClient?.id}
                onChange={(value) => {
                  const client = clients.find((c) => c.id === value);
                  onClientSelect(client);
                }}
                clients={clients}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Serviço</label>
              <p>{service}</p>
            </div>

            <div>
              <label className="text-sm font-medium">Data</label>
              <p>{new Date(selectedDay).toLocaleDateString()}</p>
            </div>

            <div>
              <label className="text-sm font-medium">Horário</label>
              <p>{selectedTime}</p>
            </div>
          </div>

          <div className="mt-6 space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsDrawerOpen(false);
                resetSelections();
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleSchedule}>Confirmar Agendamento</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
