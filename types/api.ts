export interface Organization {
  name: string;
  description: string | null;
  isActive: boolean;
  id: number;
  businessHours: {
    [key: string]: {
      start: string;
      end: string;
    };
  };
}

export interface Service {
  name: string;
  price: string;
  duration: number;
  isActive: boolean;
  id: number;
  description: string;
  customFields: Record<string, unknown> | null;
}

export interface Professional {
  name: string;
  color: string;
  isActive: boolean;
  id: number;
  email: string | null;
  phone: string | null;
  preferences: {
    workingHours?: {
      [day: string]: {
        start: string;
        end: string;
      };
    };
    services?: number[];
    notifications?: {
      email?: boolean;
      sms?: boolean;
      whatsapp?: boolean;
    };
  } | null;
}

export interface User {
  name: string;
  email: string;
  phone_number: string;
  notifications_enabled: boolean;
  isActive: boolean;
  id: number;
  username: string;
  preferences: {
    theme?: "light" | "dark" | "system";
    language?: string;
    notifications?: {
      email?: boolean;
      sms?: boolean;
      whatsapp?: boolean;
    };
  } | null;
}

export interface Appointment {
  organization: Organization;
  service: Service;
  professional: Professional;
  user: User;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  id: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  price: number | null;
  rating: number | null;
  notes: string | null;
  cancellationReason: string | null;
  metadata: {
    source?: string;
    paymentMethod?: string;
    paymentStatus?: string;
    additionalNotes?: string;
    customFields?: Record<string, unknown>;
  } | null;
}

export type AppointmentResponse = Appointment[];
