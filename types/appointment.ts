import { Client } from "./client";
import { Professional } from "./professional";
import { Service } from "./service";

export interface Appointment {
  id: number;
  client: Client;
  service: Service;
  professional: Professional;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
}

export interface CreateAppointmentDTO {
  clientId: number;
  serviceId: number;
  professionalId: number;
  startTime: string;
}
