import { api } from "@/lib/api";

export const userApi = {
  fetchAvailableUsers: async () => {
    const response = await api.get("/users");
    return response.data;
  },

  fetchMe: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },
};
