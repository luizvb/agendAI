"use client";

import { Card } from "@/components/ui/card";
import { getDashboardMetrics } from "@/services/dashboard";
import type { DashboardMetrics } from "@/services/dashboard";
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
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  TooltipProps,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

// Definindo a paleta de cores em tons de azul e roxo
const CHART_COLORS = {
  primary: "#4f46e5", // Indigo 600
  secondary: "#6366f1", // Indigo 500
  tertiary: "#818cf8", // Indigo 400
  quaternary: "#a5b4fc", // Indigo 300
  quinary: "#c7d2fe", // Indigo 200
  accent1: "#7c3aed", // Violet 600
  accent2: "#8b5cf6", // Violet 500
  accent3: "#a78bfa", // Violet 400
  green: "#10b981", // Emerald 500
  blue: "#3b82f6", // Blue 500
  orange: "#f97316", // Orange 500
  pink: "#ec4899", // Pink 500
  yellow: "#eab308", // Yellow 500
};

type DailyAppointment = {
  date: string;
  Agendamentos: number;
};

type Period = "today" | "week" | "month";

type MetricsType = {
  appointments: number;
  revenue: number;
  conversations: number;
};

const periods = [
  { value: "today" as const, label: "Hoje" },
  { value: "week" as const, label: "Semana" },
  { value: "month" as const, label: "Mês" },
] as const;

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [selectedProfessional, setSelectedProfessional] = useState<string>("");
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("week");
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

        // Ensure month values are at least equal to week values
        const adjustedMetrics = {
          ...metricsData,
          month: {
            ...metricsData.month,
            appointments: Math.max(
              metricsData.month.appointments,
              metricsData.week.appointments
            ),
            revenue: Math.max(
              metricsData.month.revenue,
              metricsData.week.revenue
            ),
            conversations: Math.max(
              metricsData.month.conversations || 0,
              metricsData.week.conversations || 0
            ),
          },
        };

        setMetrics(adjustedMetrics);
        setProfessionals(professionalsData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    };

    loadData();
  }, [selectedProfessional, session?.user?.organizationId, selectedMonth]);

  if (!metrics) return <LoadingScreen />;

  const selectedMetrics = metrics[selectedPeriod];
  const periodLabel = periods.find((p) => p.value === selectedPeriod)?.label;

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

  return (
    <div className="p-4 space-y-6 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      <div className="flex justify-between items-center bg-white rounded-xl p-4 shadow-sm border">
        <div className="text-lg font-semibold">Dashboard</div>
        <div className="flex items-center gap-4">
          <Select
            value={selectedPeriod}
            onValueChange={(value: Period) => setSelectedPeriod(value)}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              {periods.map((period) => (
                <SelectItem key={period.value} value={period.value}>
                  {period.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-sm border rounded-xl p-4">
          <div className="text-sm font-semibold">
            Agendamentos {periodLabel}
          </div>
          <div className="text-2xl font-bold mt-1">
            {selectedMetrics.appointments}
          </div>
          <div className="text-sm">R$ {selectedMetrics.revenue.toFixed(2)}</div>
          <Badge className="mt-1">{periodLabel}</Badge>
        </Card>
        <Card className="shadow-sm border rounded-xl p-4">
          <div className="text-sm font-semibold">Conversas {periodLabel}</div>
          <div className="text-2xl font-bold mt-1">
            {selectedMetrics.conversations}
          </div>
          <div className="text-sm">Conversas iniciadas</div>
          <Badge className="mt-1">{periodLabel}</Badge>
        </Card>
        <Card className="shadow-sm border rounded-xl p-4">
          <div className="text-sm font-semibold">Taxa de Conversão</div>
          <div className="text-2xl font-bold mt-1">
            {metrics.conversationMetrics.conversionRate}%
          </div>
          <div className="text-sm">Conversas convertidas em agendamentos</div>
          <Badge className="mt-1">Geral</Badge>
        </Card>
        <Card className="shadow-sm border rounded-xl p-4">
          <div className="text-sm font-semibold">Usuários Únicos</div>
          <div className="text-2xl font-bold mt-1">
            {metrics.totalUniqueUsers}
          </div>
          <div className="text-sm">Total de clientes ativos</div>
          <Badge className="mt-1">Total</Badge>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="shadow-sm border rounded-xl p-4">
          <div className="text-sm font-semibold">
            Conversão de Conversas em Agendamentos
          </div>
          <div className="w-full aspect-[16/9] mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.conversationMetrics.dailyConversions}>
                <XAxis
                  dataKey="date"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("pt-BR")
                  }
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Area
                  type="monotone"
                  name="Conversas"
                  dataKey="conversations"
                  stroke={CHART_COLORS.blue}
                  fill={CHART_COLORS.blue}
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  name="Agendamentos"
                  dataKey="appointments"
                  stroke={CHART_COLORS.green}
                  fill={CHART_COLORS.green}
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
                <Legend verticalAlign="top" height={36} />
                <Tooltip
                  content={({
                    active,
                    payload,
                    label,
                  }: TooltipProps<ValueType, NameType>) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid gap-2">
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Data
                              </span>
                              <span className="font-bold text-muted-foreground">
                                {new Date(label).toLocaleDateString("pt-BR")}
                              </span>
                            </div>
                            {payload.map((entry) => (
                              <div key={entry.name} className="flex flex-col">
                                <span className="text-[0.70rem] uppercase text-muted-foreground">
                                  {entry.name}
                                </span>
                                <span className="font-bold">{entry.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="shadow-sm border rounded-xl p-4">
          <div className="text-sm font-semibold">Distribuição de Serviços</div>
          <div className="w-full aspect-[16/9] mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metrics.serviceStats}
                  dataKey="count"
                  nameKey="serviceName"
                  innerRadius="60%"
                  outerRadius="80%"
                  paddingAngle={2}
                  label
                >
                  {metrics.serviceStats.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        [
                          CHART_COLORS.blue,
                          CHART_COLORS.green,
                          CHART_COLORS.orange,
                          CHART_COLORS.pink,
                          CHART_COLORS.yellow,
                        ][index % 5]
                      }
                    />
                  ))}
                </Pie>
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                />
                <Tooltip
                  content={({
                    active,
                    payload,
                    label,
                  }: TooltipProps<ValueType, NameType>) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid gap-2">
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Serviço
                              </span>
                              <span className="font-bold text-muted-foreground">
                                {label}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Agendamentos
                              </span>
                              <span className="font-bold">
                                {payload[0].value}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Porcentagem
                              </span>
                              <span className="font-bold">
                                {data.percentage?.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="shadow-sm border rounded-xl p-4">
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm font-semibold">Top Clientes</div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="shadow-sm border rounded-xl p-4">
          <div className="text-sm font-semibold">Profissionais por Receita</div>
          <div className="w-full aspect-[16/9] mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metrics.topProfessionals}
                  dataKey="revenue"
                  nameKey="professionalName"
                  innerRadius="60%"
                  outerRadius="80%"
                  paddingAngle={2}
                  label
                >
                  {metrics.topProfessionals.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        [
                          CHART_COLORS.blue,
                          CHART_COLORS.green,
                          CHART_COLORS.orange,
                          CHART_COLORS.pink,
                          CHART_COLORS.yellow,
                        ][index % 5]
                      }
                    />
                  ))}
                </Pie>
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                />
                <Tooltip
                  content={({
                    active,
                    payload,
                    label,
                  }: TooltipProps<ValueType, NameType>) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid gap-2">
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Profissional
                              </span>
                              <span className="font-bold text-muted-foreground">
                                {label}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Receita
                              </span>
                              <span className="font-bold">
                                {Number(payload[0].value).toLocaleString(
                                  "pt-BR",
                                  {
                                    style: "currency",
                                    currency: "BRL",
                                  }
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="shadow-sm border rounded-xl p-4">
          <div className="text-sm font-semibold">
            Profissionais por Atendimentos
          </div>
          <div className="w-full aspect-[16/9] mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.topProfessionals}>
                <XAxis
                  dataKey="professionalName"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Bar
                  dataKey="appointmentsCount"
                  fill={CHART_COLORS.blue}
                  radius={[4, 4, 0, 0]}
                >
                  {metrics.topProfessionals.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        [
                          CHART_COLORS.blue,
                          CHART_COLORS.green,
                          CHART_COLORS.orange,
                          CHART_COLORS.pink,
                          CHART_COLORS.yellow,
                        ][index % 5]
                      }
                    />
                  ))}
                </Bar>
                <Legend verticalAlign="top" height={36} />
                <Tooltip
                  content={({
                    active,
                    payload,
                    label,
                  }: TooltipProps<ValueType, NameType>) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid gap-2">
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Profissional
                              </span>
                              <span className="font-bold text-muted-foreground">
                                {label}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Atendimentos
                              </span>
                              <span className="font-bold">
                                {payload[0].value}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="shadow-sm border rounded-xl p-4">
        <div className="text-sm font-semibold">Serviços Realizados</div>
        <div className="mt-4 overflow-x-auto">
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
