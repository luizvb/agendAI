import { api } from "@/lib/api";
import { Organization } from "@/types";

interface BusinessHours {
  [key: string]: { start: string; end: string } | null;
}

interface CreateOrganizationData {
  name: string;
  description?: string;
  plan: string;
  businessHours: BusinessHours;
  trialStartDate?: Date;
  trialEndDate?: Date;
  services?: Array<{ name: string; duration: number; price: number }>;
  team?: Array<{ name: string; role: string; specialties: string[] }>;
}

export const organizationService = {
  async createOrganization(
    data: CreateOrganizationData
  ): Promise<Organization> {
    const response = await api.post("/organizations", data);
    return response.data;
  },

  async getOrganization(): Promise<Organization | null> {
    try {
      const response = await api.get("/auth/me");
      return response.data.organization;
    } catch (error) {
      return null;
    }
  },

  async updateOrganization(
    id: string,
    data: Partial<CreateOrganizationData>
  ): Promise<Organization> {
    const response = await api.put(`/organizations/${id}`, data);
    return response.data;
  },

  async activateSubscription(
    organizationId: string,
    priceId: string
  ): Promise<{ url: string }> {
    const response = await api.post(
      `/organizations/${organizationId}/subscription`,
      { priceId }
    );
    return response.data;
  },

  async cancelSubscription(organizationId: string): Promise<void> {
    await api.delete(`/organizations/${organizationId}/subscription`);
  },
};
