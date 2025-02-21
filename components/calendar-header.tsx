"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";

export function CalendarHeader({
  setShowScheduleModal,
  selectedProfessional,
  setSelectedProfessional,
  professionals,
}) {
  return (
    <div className="pb-4 md:pb-6">
      <div className="flex justify-between items-center">
        <CardTitle>Agenda do Dia</CardTitle>
        <Button onClick={() => setShowScheduleModal(true)}>Agendar</Button>
      </div>
      <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
        <Avatar
          className={`ml-2 mt-2 cursor-pointer transition-all hover:ring-2 hover:ring-primary ${
            !selectedProfessional ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => setSelectedProfessional(null)}
        >
          <AvatarFallback>ALL</AvatarFallback>
        </Avatar>
        {professionals.map((professional) => (
          <Avatar
            key={professional.id}
            className={`ml-2 mt-2 cursor-pointer transition-all hover:ring-2 hover:ring-primary ${
              selectedProfessional?.id === professional.id
                ? "ring-2 ring-primary"
                : ""
            }`}
            onClick={() => setSelectedProfessional(professional)}
          >
            <AvatarImage src={professional.avatarUrl} alt={professional.name} />
            <AvatarFallback>
              {professional.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ))}
      </div>
    </div>
  );
}
