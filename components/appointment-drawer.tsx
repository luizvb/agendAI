import { useState } from "react";
import { CheckIcon } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

export function AppointmentDrawer({
  isDrawerOpen,
  setIsDrawerOpen,
  service,
  selectedDay,
  selectedTime,
  handleSchedule,
  resetSelections,
}) {
  const [isScheduled, setIsScheduled] = useState(false);

  const handleScheduleClick = () => {
    handleSchedule();
    setIsScheduled(true);
  };

  const handleCheckIconClick = () => {
    setIsDrawerOpen(false);
    setIsScheduled(false);
    resetSelections();
  };

  const formatDateToBrazilian = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString("pt-BR", options);
  };

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger asChild>
        <Button className="hidden">Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerTitle className="sr-only">Agendar Serviço</DrawerTitle>
        <div className="p-4 flex flex-col items-center">
          {isScheduled ? (
            <p className="font-bold text-xl ">
              Seu atendimento foi agendado com sucesso!
            </p>
          ) : (
            <>
              <p className="font-bold text-xl">
                Serviço: <span className="text-blue-500">{service}</span>
              </p>
              <p className="font-bold text-xl">
                Data:{" "}
                <span className="text-blue-500">
                  {formatDateToBrazilian(selectedDay)}
                </span>
              </p>
              <p className="font-bold text-xl">
                Hora: <span className="text-blue-500">{selectedTime}</span>
              </p>
            </>
          )}
          <Button
            onClick={isScheduled ? handleCheckIconClick : handleScheduleClick}
            disabled={!selectedDay || !selectedTime || !service}
            className={`w-full h-16 text-lg mt-4 ${
              isScheduled ? "bg-green-500" : ""
            }`}
          >
            {isScheduled ? (
              <CheckIcon className="w-6 h-6 text-white" />
            ) : (
              "Agendar Serviço"
            )}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
