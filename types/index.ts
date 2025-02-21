export interface Organization {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  workingHours?: {
    [key: string]: {
      open: string;
      close: string;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface UserOrganization {
  userId: string;
  organizationId: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
}

export interface Subscription {
  id: string;
  organizationId: string;
  status: "active" | "canceled" | "trial" | "past_due";
  planId: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: "month" | "year";
  features: string[];
  stripePriceId: string;
}

export interface StripeCheckoutSession {
  id: string;
  url: string;
}
