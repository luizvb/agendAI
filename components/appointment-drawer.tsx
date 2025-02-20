import { useEffect, useState } from "react";
import { CheckIcon } from "lucide-react";
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
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );
  const [phoneNumber, setPhoneNumber] = useState(
    localStorage.getItem("phone_number") || ""
  );
  const [needRegister, setNeedRegister] = useState(false);

  useEffect(() => {
    if (
      !localStorage.getItem("username") ||
      !localStorage.getItem("phone_number")
    ) {
      setNeedRegister(true);
    }
  }, []);

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
  };

  const formatDateToBrazilian = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString("pt-BR", options);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e);
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
              {needRegister ? (
                <>
                  <p className="font-bold text-xl mb-4">
                    Por favor, atualize suas informações uma única vez para
                    continuar.
                  </p>
                  <Label
                    htmlFor="username"
                    className="text-left text-lg font-bold"
                  >
                    Nome:
                  </Label>
                  <Input
                    id="username"
                    placeholder="Nome, Sobrenome ou apelido"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mb-4"
                  />
                  <Label
                    htmlFor="phone_number"
                    className="text-left text-lg font-bold"
                  >
                    Whatsapp:
                  </Label>
                  <PhoneInput
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    width={"100%"}
                  />
                  <Button
                    onClick={() => {
                      handleSaveUserInfo();
                      setNeedRegister(false);
                    }}
                    className="w-full h-16 text-lg mt-4"
                  >
                    Salvar Informações
                  </Button>
                </>
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
            </>
          )}
          <Button
            onClick={isScheduled ? handleCheckIconClick : handleScheduleClick}
            disabled={!selectedDay || !selectedTime || !service || needRegister}
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
