import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function TimeForm({ onSubmit }) {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("");

  const handleSubmit = (e) => {
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
            onChange={(e) => setDayOfWeek(e.target.value)}
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
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Horário de Término
          </label>
          <Input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit">Adicionar Horário</Button>
        </div>
      </div>
    </form>
  );
}

export default TimeForm;
