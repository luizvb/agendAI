import { api } from "@/lib/api";

export const serviceApi = {
  fetchServices: async () => {
    const response = await api.get("/services");
    return response.data;
  },

  createService: async (data: any) => {
    const response = await api.post("/services", data);
    return response.data;
  },

  updateService: async (id: number, data: any) => {
    const response = await api.put(`/services/${id}`, data);
    return response.data;
  },

  deleteService: async (id: number) => {
    const response = await api.delete(`/services/${id}`);
    return response.data;
  },
};
