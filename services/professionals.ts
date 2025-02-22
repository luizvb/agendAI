import { api } from "@/lib/api";

export interface Professional {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
}

export const getProfessionals = async (): Promise<Professional[]> => {
  const response = await api.get("/professionals");
  return response.data;
};
