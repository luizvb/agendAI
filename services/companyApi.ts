import { getHeaders, handleUnauthorized } from "./api";

export const companyApi = {
  fetchAddress: async () => {
    const headers = getHeaders();
    return fetch("http://localhost:3001/api/address", { headers })
      .then(handleUnauthorized)
      .then((response) => response.json());
  },

  updateAddress: async (newAddress: string) => {
    const headers = getHeaders();
    return fetch("http://localhost:3001/api/address", {
      method: "PUT",
      headers,
      body: JSON.stringify({ address: newAddress }),
    })
      .then(handleUnauthorized)
      .then((response) => response.json());
  },

  fetchCompanyProfile: async () => {
    const headers = getHeaders();
    return fetch("http://localhost:3001/api/company-profile", { headers })
      .then(handleUnauthorized)
      .then((response) => response.json());
  },

  updateCompanyProfile: async (profile: any) => {
    const headers = getHeaders();
    return fetch("http://localhost:3001/api/company-profile", {
      method: "PUT",
      headers,
      body: JSON.stringify(profile),
    })
      .then(handleUnauthorized)
      .then((response) => response.json());
  },
};
