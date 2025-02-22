import { api } from "@/lib/api";
import { Appointment, CreateAppointmentDTO } from "@/types/appointment";

export const appointmentApi = {
  create: async (data: CreateAppointmentDTO): Promise<Appointment> => {
    const response = await api.post<Appointment>("/appointments", {
      clientId: data.clientId,
      serviceId: data.serviceId,
      professionalId: data.professionalId,
      startTime: data.startTime,
    });
    return response.data;
  },

  list: async (clientId?: number): Promise<Appointment[]> => {
    const params = clientId ? { clientId } : {};
    const response = await api.get<Appointment[]>("/appointments", { params });
    return response.data;
  },

  fetchNext45DaysAppointments: async (id): Promise<Appointment[]> => {
    const response = await api.get<Appointment[]>(
      `/appointments/next-45-days/${id}`
    );
    return response.data;
  },

  getById: async (id: number): Promise<Appointment> => {
    const response = await api.get<Appointment>(`/appointments/${id}`);
    return response.data;
  },

  update: async (
    id: number,
    data: Partial<CreateAppointmentDTO>
  ): Promise<Appointment> => {
    const response = await api.put<Appointment>(`/appointments/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/appointments/${id}`);
  },

  getAvailableTimes: async (
    date: string,
    professionalId: number
  ): Promise<string[]> => {
    const response = await api.get<string[]>(`/appointments/available-times`, {
      params: { date, professionalId },
    });
    return response.data;
  },
};
