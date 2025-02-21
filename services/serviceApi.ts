import { getHeaders, handleUnauthorized } from "./api";

export const serviceApi = {
  fetchServices: async () => {
    return fetch("http://localhost:3001/api/services", {
      headers: getHeaders(),
    })
      .then(handleUnauthorized)
      .then((response) => response.json());
  },

  addService: async (service: any) => {
    return fetch("http://localhost:3001/api/services", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(service),
    })
      .then(handleUnauthorized)
      .then((response) => response.json());
  },

  updateService: async (id: number, updatedService: any) => {
    return fetch(`http://localhost:3001/api/services/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(updatedService),
    })
      .then(handleUnauthorized)
      .then((response) => response.json());
  },

  deleteService: async (id: number) => {
    return fetch(`http://localhost:3001/api/services/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    }).then(handleUnauthorized);
  },
};
