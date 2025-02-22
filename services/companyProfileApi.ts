import { api } from "@/lib/api";

export const companyProfileApi = {
  fetchCompanyProfile: async () => {
    const response = await api.get("/company-profile");
    return response.data;
  },

  updateCompanyProfile: async (data: any) => {
    const response = await api.put("/company-profile", data);
    return response.data;
  },
};
