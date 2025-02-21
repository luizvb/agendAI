import { Organization } from "@/types";
import { getHeaders, handleUnauthorized } from "./api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const organizationService = {
  async getUserOrganizations(): Promise<Organization[]> {
    const response = await fetch(`${API_URL}/api/organizations/user`, {
      headers: getHeaders(),
    }).then(handleUnauthorized);

    if (!response.ok) {
      throw new Error("Failed to fetch user organizations");
    }

    return response.json();
  },

  async getOrganization(organizationId: string): Promise<Organization> {
    const response = await fetch(
      `${API_URL}/api/organizations/${organizationId}`,
      {
        headers: getHeaders(),
      }
    ).then(handleUnauthorized);

    if (!response.ok) {
      throw new Error("Failed to fetch organization");
    }

    return response.json();
  },

  async createOrganization(data: {
    name: string;
    description?: string;
    logoUrl?: string;
  }): Promise<Organization> {
    const response = await fetch(`${API_URL}/api/organizations`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleUnauthorized);

    if (!response.ok) {
      throw new Error("Failed to create organization");
    }

    return response.json();
  },

  async updateOrganization(
    organizationId: string,
    data: {
      name?: string;
      description?: string;
      logoUrl?: string;
      businessHours?: {
        [key: string]: {
          open: string;
          close: string;
        };
      };
    }
  ): Promise<Organization> {
    const response = await fetch(
      `${API_URL}/api/organizations/${organizationId}`,
      {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(data),
      }
    ).then(handleUnauthorized);

    if (!response.ok) {
      throw new Error("Failed to update organization");
    }

    return response.json();
  },
};
