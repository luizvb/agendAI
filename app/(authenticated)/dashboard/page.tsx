"use client";

import { Card, Title, Text } from "@tremor/react";
import { BarChart, LineChart, DonutChart } from "@tremor/react";
import { getDashboardMetrics, DashboardMetrics } from "@/services/dashboard";
import { useEffect, useState } from "react";
import { getProfessionals, Professional } from "@/services/professionals";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { LoadingScreen } from "@/components/loading-screen";

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [selectedProfessional, setSelectedProfessional] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  });
  const { data: session } = useSession();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [metricsData, professionalsData] = await Promise.all([
          getDashboardMetrics(
            selectedProfessional || undefined,
            session?.user?.organizationId,
            selectedMonth
          ),
          getProfessionals(),
        ]);
        setMetrics(metricsData);
        setProfessionals(professionalsData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    };

    loadData();
  }, [selectedProfessional, session?.user?.organizationId, selectedMonth]);

  if (!metrics) return <LoadingScreen />;

  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return {
      value: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`,
      label: date.toLocaleString("pt-BR", { month: "long", year: "numeric" }),
    };
  });

  const dailyAppointmentsData = metrics.dailyAppointments.map((day) => ({
    date: new Date(day.date).toLocaleDateString("pt-BR"),
    Agendamentos: day.count,
  }));

  const customTooltip = ({
    payload,
    active,
    label,
  }: {
    payload: any;
    active: boolean;
    label: string;
  }) => {
    if (!active || !payload) return null;

    const data = payload[0];
    let content;

    if (data.name === "Agendamentos") {
      content = (
        <>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="font-medium">
            {data.value} agendamento{data.value !== 1 ? "s" : ""}
          </p>
        </>
      );
    } else if (data.name === "totalSpent") {
      content = (
        <>
          <p className="text-sm text-gray-600">Cliente: {label}</p>
          <p className="font-medium">
            {data.value.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        </>
      );
    } else if (data.name === "revenue") {
      content = (
        <>
          <p className="text-sm text-gray-600">Profissional: {label}</p>
          <p className="font-medium">
            {data.value.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        </>
      );
    } else if (data.name === "appointmentsCount") {
      content = (
        <>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="font-medium">
            {data.value} atendimento{data.value !== 1 ? "s" : ""}
          </p>
        </>
      );
    } else if (data.name === "count") {
      content = (
        <>
          <p className="text-sm text-gray-600">Serviço: {label}</p>
          <p className="font-medium">
            {data.value} agendamento{data.value !== 1 ? "s" : ""}
          </p>
          <p className="text-xs text-gray-500">
            {payload[0].payload.percentage.toFixed(1)}% do total
          </p>
        </>
      );
    }

    return (
      <div className="p-3 bg-white/90 backdrop-blur-sm shadow-lg rounded-xl border">
        {content}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      <div className="flex justify-between items-center bg-white rounded-xl p-6 shadow-sm border">
        <Title className="text-primary">Dashboard</Title>
        <div className="flex items-center gap-4">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Selecione o mês" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex -space-x-2">
            {professionals.map((professional) => (
              <div
                key={professional.id}
                onClick={() => setSelectedProfessional(professional.id)}
                className={`cursor-pointer ${
                  selectedProfessional === professional.id
                    ? "ring-2 ring-primary"
                    : ""
                }`}
              >
                <Avatar className="border-2 border-background hover:border-primary">
                  <AvatarImage
                    src={professional.avatar_url}
                    alt={professional.name}
                  />
                  <AvatarFallback>{professional.name[0]}</AvatarFallback>
                </Avatar>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm border rounded-xl p-6">
          <Title>Agendamentos Hoje</Title>
          <Text className="text-3xl font-bold mt-2">
            {metrics.today.appointments}
          </Text>
          <Text>R$ {metrics.today.revenue.toFixed(2)}</Text>
          <Badge className="mt-2">Hoje</Badge>
        </Card>
        <Card className="shadow-sm border rounded-xl p-6">
          <Title>Agendamentos na Semana</Title>
          <Text className="text-3xl font-bold mt-2">
            {metrics.week.appointments}
          </Text>
          <Text>R$ {metrics.week.revenue.toFixed(2)}</Text>
          <Badge className="mt-2">Semana</Badge>
        </Card>
        <Card className="shadow-sm border rounded-xl p-6">
          <Title>Agendamentos no Mês</Title>
          <Text className="text-3xl font-bold mt-2">
            {metrics.month.appointments}
          </Text>
          <Text>R$ {metrics.month.revenue.toFixed(2)}</Text>
          <Badge className="mt-2">Mês</Badge>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm border rounded-xl p-6">
          <Title>Evolução de Agendamentos Diários</Title>
          <LineChart
            className="mt-6 h-80"
            data={dailyAppointmentsData}
            index="date"
            categories={["Agendamentos"]}
            colors={["#000000"]}
            yAxisWidth={48}
            showAnimation={true}
            showLegend={true}
            curveType="natural"
            customTooltip={customTooltip}
          />
        </Card>

        <Card className="shadow-sm border rounded-xl p-6">
          <Title>Distribuição de Serviços</Title>
          <DonutChart
            className="mt-6 h-80"
            data={metrics.serviceStats}
            category="count"
            index="serviceName"
            valueFormatter={(value) => `${value} agendamentos`}
            colors={["#000000", "#333333", "#666666", "#999999", "#CCCCCC"]}
            showAnimation={true}
            customTooltip={customTooltip}
            variant="pie"
            showLabel={false}
            showTooltip={true}
          />
        </Card>
      </div>

      <Card className="shadow-sm border rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <Title>Top Clientes</Title>
          <Badge className="">Top 5</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Por Valor Gasto</h3>
            <Table>
              <TableHeader>
                <TableRow className="">
                  <TableHead>Cliente</TableHead>
                  <TableHead className="text-right">Valor Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metrics.topClients.slice(0, 5).map((client) => (
                  <TableRow key={client.clientName}>
                    <TableCell>{client.clientName}</TableCell>
                    <TableCell className="text-right font-medium">
                      {client.totalSpent.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Por Quantidade</h3>
            <Table>
              <TableHeader>
                <TableRow className="">
                  <TableHead>Cliente</TableHead>
                  <TableHead className="text-right">Agendamentos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metrics.topClients.slice(0, 5).map((client) => (
                  <TableRow key={client.clientName}>
                    <TableCell>{client.clientName}</TableCell>
                    <TableCell className="text-right font-medium">
                      {client.appointmentsCount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm border rounded-xl p-6">
          <Title>Profissionais por Receita</Title>
          <DonutChart
            className="mt-6 h-80"
            data={metrics.topProfessionals}
            category="revenue"
            index="professionalName"
            valueFormatter={(value) => `R$ ${value.toFixed(2)}`}
            colors={["#e11d48", "#8b5cf6", "#4f46e5", "#06b6d4", "#059669"]}
            showAnimation={true}
            customTooltip={customTooltip}
            variant="pie"
            showLabel={false}
            showTooltip={true}
          />
        </Card>

        <Card className="shadow-sm border rounded-xl p-6">
          <Title>Profissionais por Atendimentos</Title>
          <BarChart
            className="mt-6 h-80"
            data={metrics.topProfessionals}
            index="professionalName"
            categories={["appointmentsCount"]}
            colors={["#059669"]}
            valueFormatter={(value) => `${value} atendimentos`}
            yAxisWidth={48}
            customTooltip={customTooltip}
            showLegend={true}
          />
        </Card>
      </div>

      <Card className="shadow-sm border rounded-xl p-6">
        <Title>Serviços Realizados</Title>
        <div className="mt-6 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead>Data</TableHead>
                <TableHead>Serviço</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Profissional</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metrics.detailedAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>{appointment.date}</TableCell>
                  <TableCell>{appointment.serviceName}</TableCell>
                  <TableCell>{appointment.clientName}</TableCell>
                  <TableCell>{appointment.professionalName}</TableCell>
                  <TableCell className="text-right">
                    R$ {appointment.value.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
