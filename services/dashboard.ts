import { api } from "@/lib/api";

export interface DashboardMetrics {
  today: {
    appointments: number;
    revenue: number;
  };
  week: {
    appointments: number;
    revenue: number;
  };
  month: {
    appointments: number;
    revenue: number;
  };
  totalUniqueUsers: number;
  dailyAppointments: {
    date: string;
    count: number;
  }[];
  serviceStats: {
    serviceName: string;
    count: number;
    percentage: number;
  }[];
  detailedAppointments: {
    id: string;
    date: string;
    serviceName: string;
    clientName: string;
    value: number;
    professionalName: string;
  }[];
  topClients: {
    clientName: string;
    totalSpent: number;
    appointmentsCount: number;
  }[];
  topProfessionals: {
    professionalName: string;
    revenue: number;
    appointmentsCount: number;
  }[];
}

export const getDashboardMetrics = async (
  professionalId?: string,
  organizationId?: string,
  month?: string
): Promise<DashboardMetrics> => {
  const params = {
    ...(professionalId && { professionalId }),
    ...(organizationId && { organizationId }),
    ...(month && { month }),
  };
  const response = await api.get("/dashboard/metrics", { params });
  return response.data;
};
