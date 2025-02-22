import { api } from "@/lib/api";
import { AIConfiguration } from "@/types/ai";

export const aiService = {
  getConfiguration: async (): Promise<AIConfiguration> => {
    const response = await api.get("/ai/configuration");
    return response.data;
  },

  updateConfiguration: async (
    config: Partial<AIConfiguration>
  ): Promise<AIConfiguration> => {
    const response = await api.put("/ai/configuration", config);
    return response.data;
  },
};
