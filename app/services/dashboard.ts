import { api } from "@/lib/api";

export type ServiceStat = {
  serviceName: string;
  count: number;
  percentage: number;
};

export type TopProfessional = {
  professionalName: string;
  revenue: number;
  appointmentsCount: number;
};

export type DailyConversion = {
  date: string;
  conversations: number;
  appointments: number;
};

export type ConversationMetrics = {
  dailyConversions: DailyConversion[];
  conversionRate: number;
};

export type Metrics = {
  appointments: number;
  revenue: number;
  conversations: number;
};

export type Period = "today" | "week" | "month";

export type DashboardMetrics = {
  today: Metrics;
  week: Metrics;
  month: Metrics;
  totalUniqueUsers: number;
  dailyAppointments: Array<{
    date: string;
    count: number;
  }>;
  serviceStats: ServiceStat[];
  detailedAppointments: Array<{
    id: string;
    date: string;
    serviceName: string;
    clientName: string;
    value: number;
    professionalName: string;
  }>;
  topClients: Array<{
    clientName: string;
    totalSpent: number;
    appointmentsCount: number;
  }>;
  topProfessionals: TopProfessional[];
  conversationMetrics: ConversationMetrics;
  [key: string]: any; // Add index signature to allow dynamic access
};

export async function getDashboardMetrics(
  professionalId?: string,
  organizationId?: string,
  month?: string
): Promise<DashboardMetrics> {
  const response = await api.get("/metrics", {
    params: {
      professionalId,
      organizationId,
      month,
    },
  });

  return response.data;
}
