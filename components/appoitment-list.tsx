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
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appt) => {
                const startTime = new Date(appt.startTime);
                return (
                  <TableRow key={appt.id}>
                    <TableCell>
                      {`${dayNames[getDay(startTime)]}, ${format(
                        startTime,
                        "dd/MM",
                        {
                          locale: ptBR,
                        }
                      )}`}
                    </TableCell>
                    <TableCell>{appt.service.name}</TableCell>
                    <TableCell>{format(startTime, "HH:mm")}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          appt.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : appt.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : appt.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {appt.status === "pending"
                          ? "Pendente"
                          : appt.status === "confirmed"
                          ? "Confirmado"
                          : appt.status === "cancelled"
                          ? "Cancelado"
                          : appt.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {appt.status !== "cancelled" && (
                        <Button
                          onClick={() => handleCancel(appt.id)}
                          variant="destructive"
                          size="sm"
                        >
                          Cancelar
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}
