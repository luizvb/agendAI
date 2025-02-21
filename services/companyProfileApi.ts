import { getHeaders } from "./api";

export const companyProfileApi = {
  fetchCompanyProfile: async () => {
    return fetch("http://localhost:3001/api/company-profile", {
      headers: getHeaders(),
    }).then((response) => response.json());
  },

  updateCompanyProfile: async (profile: any) => {
    return fetch("http://localhost:3001/api/company-profile", {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(profile),
    }).then((response) => response.json());
  },
};
