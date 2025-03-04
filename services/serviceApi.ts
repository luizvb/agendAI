import { api } from "@/lib/api";
import { Service } from "@/types/service";

interface CreateServiceDTO {
  name: string;
  price: number;
  duration: number;
  description?: string;
}

export const serviceApi = {
  fetchServices: async (): Promise<Service[]> => {
    const response = await api.get("/services");
    return response.data;
  },

  createService: async (data: CreateServiceDTO): Promise<Service> => {
    const response = await api.post("/services", data);
    return response.data;
  },

  updateService: async (
    id: number,
    data: Partial<CreateServiceDTO>
  ): Promise<Service> => {
    const response = await api.put(`/services/${id}`, data);
    return response.data;
  },

  deleteService: async (id: number): Promise<void> => {
    await api.delete(`/services/${id}`);
  },
};
