import api from "@/lib/axios";

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export const getClients = async (): Promise<Client[]> => {
  const response = await api.get("/clients");
  return response.data;
};

export const createClient = async (client: Omit<Client, "id">) => {
  const response = await api.post("/clients", client);
  return response.data;
};

export const updateClient = async (id: string, client: Partial<Client>) => {
  const response = await api.put(`/clients/${id}`, client);
  return response.data;
};

export const deleteClient = async (id: string) => {
  await api.delete(`/clients/${id}`);
};
