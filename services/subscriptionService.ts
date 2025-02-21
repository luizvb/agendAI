import { Plan, StripeCheckoutSession, Subscription } from "@/types";
import { getHeaders, handleUnauthorized } from "./api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const subscriptionService = {
  async getPlans(): Promise<Plan[]> {
    const response = await fetch(`${API_URL}/api/plans`, {
      headers: getHeaders(),
    }).then(handleUnauthorized);

    if (!response.ok) {
      throw new Error("Failed to fetch plans");
    }

    return response.json();
  },

  async getCurrentSubscription(organizationId: string): Promise<Subscription> {
    const response = await fetch(
      `${API_URL}/api/organizations/${organizationId}/subscription`,
      {
        headers: getHeaders(),
      }
    ).then(handleUnauthorized);

    if (!response.ok) {
      throw new Error("Failed to fetch subscription");
    }

    return response.json();
  },

  async createCheckoutSession(
    organizationId: string,
    planId: string
  ): Promise<StripeCheckoutSession> {
    const response = await fetch(`${API_URL}/api/checkout-sessions`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        organizationId,
        planId,
      }),
    }).then(handleUnauthorized);

    if (!response.ok) {
      throw new Error("Failed to create checkout session");
    }

    return response.json();
  },

  async cancelSubscription(organizationId: string): Promise<void> {
    const response = await fetch(
      `${API_URL}/api/organizations/${organizationId}/subscription`,
      {
        method: "DELETE",
        headers: getHeaders(),
      }
    ).then(handleUnauthorized);

    if (!response.ok) {
      throw new Error("Failed to cancel subscription");
    }
  },
};
