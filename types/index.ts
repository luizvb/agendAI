export interface Organization {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  address?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  businessHours: {
    [day: string]: {
      start: string;
      end: string;
    } | null;
  };
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  active: boolean;
  plan: "trial" | "free" | "basic" | "premium";
  trialStartDate?: string;
  trialEndDate?: string;
  trialUsed: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  isSubscriptionActive: boolean;
  subscriptionEndDate?: string;
  createdAt: string;
  updatedAt: string;
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
