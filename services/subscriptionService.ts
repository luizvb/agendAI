import { Plan, StripeCheckoutSession, Subscription } from "@/types";
import { api } from "@/lib/api";

export const subscriptionService = {
  async getPlans(): Promise<Plan[]> {
    const response = await api.get("/plans");
    return response.data;
  },

  async getCurrentSubscription(organizationId: string): Promise<Subscription> {
    const response = await api.get(
      `/organizations/${organizationId}/subscription`
    );
    return response.data;
  },

  async createCheckoutSession(
    organizationId: string,
    planId: string
  ): Promise<StripeCheckoutSession> {
    const response = await api.post("/checkout-sessions", {
      organizationId,
      planId,
    });
    return response.data;
  },

  async cancelSubscription(organizationId: string): Promise<void> {
    await api.delete(`/organizations/${organizationId}/subscription`);
  },
};
