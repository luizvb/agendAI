import { getHeaders } from "./api";

export const professionalApi = {
  fetchProfessionals: async () => {
    return fetch("http://localhost:3001/api/professionals", {
      headers: getHeaders(),
    }).then((response) => response.json());
  },

  addProfessional: async (professional: any) => {
    return fetch("http://localhost:3001/api/professionals", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(professional),
    }).then((response) => response.json());
  },

  updateProfessional: async (id: number, updatedProfessional: any) => {
    return fetch(`http://localhost:3001/api/professionals/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(updatedProfessional),
    }).then((response) => response.json());
  },

  deleteProfessional: async (id: number) => {
    return fetch(`http://localhost:3001/api/professionals/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
  },

  fetchProfessionalsByService: async (serviceId: number) => {
    return fetch(`http://localhost:3001/api/professionals`, {
      headers: getHeaders(),
    }).then((response) => response.json());
  },
};
