import { getHeaders, handleUnauthorized } from "./api";
import { AppointmentResponse } from "../types/api";

export const appointmentApi = {
  fetchAvailableDays: async () => {
    return fetch("http://localhost:3001/api/appointments/available-days", {
      headers: getHeaders(),
    })
      .then(handleUnauthorized)
      .then((response) => response.json());
  },

  scheduleAppointment: async (appointment: any) => {
    return fetch("http://localhost:3001/api/appointments", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(appointment),
    })
      .then(handleUnauthorized)
      .then((response) => response.json());
  },

  fetchAppointmentById: async (id: number) => {
    return fetch(`http://localhost:3001/api/appointments/${id}`, {
      headers: getHeaders(),
    })
      .then(handleUnauthorized)
      .then((response) => response.json());
  },

  cancelAppointment: async (id: number) => {
    return fetch(`http://localhost:3001/api/appointments/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    }).then(handleUnauthorized);
  },

  fetchAppointmentsByPhone: async (phone: string) => {
    return fetch(`http://localhost:3001/api/appointments/phone/${phone}`, {
      headers: getHeaders(),
    })
      .then(handleUnauthorized)
      .then((response) => response.json());
  },

  fetchNext45DaysAppointments: async (professionalId: number) => {
    return fetch(
      `http://localhost:3001/api/appointments/next-45-days/${professionalId}`,
      {
        headers: getHeaders(),
      }
    )
      .then(handleUnauthorized)
      .then((response) => response.json());
  },

  fetchAppointments: async (): Promise<AppointmentResponse> => {
    return fetch("http://localhost:3001/api/appointments", {
      headers: getHeaders(),
    })
      .then(handleUnauthorized)
      .then((response) => response.json());
  },

  updateAppointmentTime: async (id: number, newDateTime: string) => {
    return fetch(`http://localhost:3001/api/appointments/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ appointmentDate: newDateTime }),
    })
      .then(handleUnauthorized)
      .then((response) => response.json());
  },
};
