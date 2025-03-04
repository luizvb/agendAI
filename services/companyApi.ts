import { api } from "@/lib/api";

export const companyApi = {
  fetchAddress: async () => {
    const response = await api.get("/address");
    return response.data;
  },

  updateAddress: async (data: any) => {
    const response = await api.put("/address", data);
    return response.data;
  },

  fetchCompanyProfile: async () => {
    const response = await api.get("/company-profile");
    return response.data;
  },

  updateCompanyProfile: async (data: any) => {
    const response = await api.put("/company-profile", data);
    return response.data;
  },
};
