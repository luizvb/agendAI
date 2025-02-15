import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, getDay } from "date-fns";
import { ptBR } from "date-fns/locale";

const dayNames = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

export function DaySelector({
  currentWeek,
  handlePreviousDays,
  handleNextDays,
  daysToShow,
  selectedDay,
  selectedTime,
  handleDateTimeSelection,
  handleCancelClick = () => {},
  showBookedTimes = true, // nova prop
}) {
  return (
    <>
      <div className="flex flex-wrap justify-between mb-4">
        {daysToShow.map(({ date, times }) => (
          <div key={date} className="w-full md:w-1/4 p-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-center">
                  {`${dayNames[getDay(new Date(date))]}, ${format(
                    new Date(date),
                    "dd/MM",
                    { locale: ptBR }
                  )}`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 justify-center">
                  {times?.map(
                    (time) =>
                      (showBookedTimes || !time.booked) && (
                        <Button
                          key={time.time}
                          variant={
                            selectedDay === date && selectedTime === time.time
                              ? "default"
                              : time.booked
                              ? "destructive"
                              : "outline"
                          }
                          onClick={() =>
                            time.booked
                              ? handleCancelClick(time.id)
                              : handleDateTimeSelection(date, time.time)
                          }
                        >
                          {time.time}
                        </Button>
                      )
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
      <div className="flex justify-between mb-4">
        <Button onClick={handlePreviousDays} disabled={currentWeek === 0}>
          Dias Anteriores
        </Button>
        <Button onClick={handleNextDays} disabled={daysToShow.length < 4}>
          Próximos Dias
        </Button>
      </div>
    </>
  );
}
