export interface Company {
  // Add company fields as needed
}

export interface Service {
  name: string;
  price: string;
  durationMinutes: number;
  isActive: boolean;
  id: number;
  description: string;
  customFields: any | null;
}

export interface Professional {
  name: string;
  color: string;
  isActive: boolean;
  id: number;
  email: string | null;
  phone: string | null;
  preferences: any | null;
}

export interface User {
  name: string;
  email: string;
  phone_number: string;
  notifications_enabled: boolean;
  isActive: boolean;
  id: number;
  username: string;
  preferences: any | null;
}

export interface Appointment {
  company: Company;
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
  metadata: any | null;
}

export type AppointmentResponse = Appointment[];
