import { api } from "@/lib/api";
import { Client, CreateClientDTO } from "@/types/client";

export const clientApi = {
  create: async (data: CreateClientDTO): Promise<Client> => {
    const response = await api.post<Client>("/clients", data);
    return response.data;
  },

  list: async (): Promise<Client[]> => {
    const response = await api.get<Client[]>("/clients");
    return response.data;
  },

  update: async (
    id: number,
    data: Partial<CreateClientDTO>
  ): Promise<Client> => {
    const response = await api.put<Client>(`/clients/${id}`, data);
    return response.data;
  },

  findByPhone: async (phoneNumber: string): Promise<Client | null> => {
    try {
      const response = await api.get<Client>(`/clients/phone/${phoneNumber}`);
      return response.data;
    } catch (error) {
      return null;
    }
  },
};
