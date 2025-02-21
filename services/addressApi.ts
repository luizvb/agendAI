import { getHeaders, handleUnauthorized } from "./api";

export const addressApi = {
  fetchAddress: async () => {
    return fetch("http://localhost:3001/api/address", {
      headers: getHeaders(),
    })
      .then(handleUnauthorized)
      .then((response) => response.json());
  },

  updateAddress: async (newAddress: string) => {
    return fetch("http://localhost:3001/api/address", {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ address: newAddress }),
    })
      .then(handleUnauthorized)
      .then((response) => response.json());
  },
};
