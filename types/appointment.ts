import { Client } from "./client";
import { Professional } from "./professional";
import { Service } from "./service";

export interface Appointment {
  id: number;
  client: Client;
  professional: Professional;
  service: Service;
  startTime: string;
  endTime: string;
  status: string;
  organization?: {
    businessHours?: {
      [key: string]: {
        start: string;
        end: string;
      };
    };
  };
}
