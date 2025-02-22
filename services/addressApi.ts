import { api } from "@/lib/api";

export const addressApi = {
  fetchAddress: async () => {
    const response = await api.get("/address");
    return response.data;
  },

  updateAddress: async (data: any) => {
    const response = await api.put("/address", data);
    return response.data;
  },
};
