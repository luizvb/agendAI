"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface CalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function Calendar({ selectedDate, onDateChange }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate);

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const handlePreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date) => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <Button variant="outline" onClick={handlePreviousMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-lg font-semibold">
          {currentMonth.toLocaleDateString("pt-BR", {
            month: "long",
            year: "numeric",
          })}
        </span>
        <Button variant="outline" onClick={handleNextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
          <div key={day} className="text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, index) => {
          const date = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            index + 1
          );
          const dayIsSelected = isSelected(date);
          const dayIsPast = isPastDate(date);
          const dayIsToday = isToday(date);

          return (
            <Button
              key={index}
              variant={dayIsSelected ? "default" : "outline"}
              className={`h-10 ${
                dayIsPast
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-primary hover:text-primary-foreground"
              } ${dayIsToday ? "border-primary" : ""}`}
              disabled={dayIsPast}
              onClick={() => onDateChange(date)}
            >
              {index + 1}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
