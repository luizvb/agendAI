import { api } from "@/lib/api";

export const professionalApi = {
  fetchProfessionals: async () => {
    const response = await api.get("/professionals");
    return response.data;
  },

  createProfessional: async (data: any) => {
    const response = await api.post("/professionals", data);
    return response.data;
  },

  getProfessional: async (id: number) => {
    const response = await api.get(`/professionals/${id}`);
    return response.data;
  },

  updateProfessional: async (id: number, data: any) => {
    const response = await api.put(`/professionals/${id}`, data);
    return response.data;
  },

  deleteProfessional: async (id: number) => {
    const response = await api.delete(`/professionals/${id}`);
    return response.data;
  },

  fetchProfessionalsByService: async (serviceId: number) => {
    const response = await api.get(`/professionals`, {
      params: { serviceId },
    });
    return response.data;
  },
};
