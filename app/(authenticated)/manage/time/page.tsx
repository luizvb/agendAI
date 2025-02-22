"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

interface TimeFormData {
  startTime: string;
  endTime: string;
  dayOfWeek: DayOfWeek | "";
}

interface TimeFormProps {
  onSubmit: (data: TimeFormData) => void;
}

export default function TimeForm({ onSubmit }: TimeFormProps) {
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek | "">("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({ startTime, endTime, dayOfWeek });
    setStartTime("");
    setEndTime("");
    setDayOfWeek("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Dia da Semana
          </label>
          <select
            value={dayOfWeek}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setDayOfWeek(e.target.value as DayOfWeek | "")
            }
            className="w-full border rounded-md p-2"
          >
            <option value="">Selecione um dia</option>
            <option value="monday">Segunda-feira</option>
            <option value="tuesday">Terça-feira</option>
            <option value="wednesday">Quarta-feira</option>
            <option value="thursday">Quinta-feira</option>
            <option value="friday">Sexta-feira</option>
            <option value="saturday">Sábado</option>
            <option value="sunday">Domingo</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Horário de Início
          </label>
          <Input
            type="time"
            value={startTime}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setStartTime(e.target.value)
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Horário de Término
          </label>
          <Input
            type="time"
            value={endTime}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEndTime(e.target.value)
            }
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit">Adicionar Horário</Button>
        </div>
      </div>
    </form>
  );
}
