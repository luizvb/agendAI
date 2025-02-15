import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format, getDay } from "date-fns";
import { ptBR } from "date-fns/locale";

const dayNames = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

export function AppointmentList({ appointments, handleCancel }) {
  return (
    <>
      {appointments.length === 0 ? (
        <p>Você não tem agendamentos.</p>
      ) : (
        <div className="max-h-64 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Serviço</TableHead>
                <TableHead>Hora</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appt) => (
                <TableRow key={appt.id}>
                  <TableCell>
                    {`${
                      dayNames[getDay(new Date(appt.appointmentDate))]
                    }, ${format(new Date(appt.appointmentDate), "dd/MM", {
                      locale: ptBR,
                    })}`}
                  </TableCell>
                  <TableCell>{appt.service.name}</TableCell>
                  <TableCell>
                    {format(new Date(appt.appointmentDate), "HH:mm")}
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => handleCancel(appt.id)}>
                      Cancelar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}
