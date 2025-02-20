export const fetchServices = () => {
  return fetch("http://localhost:3001/api/services").then((response) =>
    response.json()
  );
};

export const fetchProfessionals = () => {
  return fetch("http://localhost:3001/api/professionals").then((response) =>
    response.json()
  );
};

export const fetchAvailableDays = () => {
  return fetch("http://localhost:3001/api/appointments/available-days").then(
    (response) => response.json()
  );
};

export const fetchAddress = () => {
  return fetch("http://localhost:3001/api/address").then((response) =>
    response.json()
  );
};

export const addService = (service) => {
  return fetch("http://localhost:3001/api/services", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(service),
  }).then((response) => response.json());
};

export const updateService = (id, updatedService) => {
  return fetch(`http://localhost:3001/api/services/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedService),
  }).then((response) => response.json());
};

export const deleteService = (id) => {
  return fetch(`http://localhost:3001/api/services/${id}`, {
    method: "DELETE",
  });
};

export const addProfessional = (professional) => {
  return fetch("http://localhost:3001/api/professionals", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(professional),
  }).then((response) => response.json());
};

export const updateProfessional = (id, updatedProfessional) => {
  return fetch(`http://localhost:3001/api/professionals/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedProfessional),
  }).then((response) => response.json());
};

export const deleteProfessional = (id) => {
  return fetch(`http://localhost:3001/api/professionals/${id}`, {
    method: "DELETE",
  });
};

export const fetchProfessionalsByService = (serviceId) => {
  return fetch(`http://localhost:3001/api/professionals`).then((response) =>
    response.json()
  );
};

export const updateAddress = (newAddress) => {
  return fetch("http://localhost:3001/api/address", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ address: newAddress }),
  }).then((response) => response.json());
};

export const scheduleAppointment = (appointment) => {
  return fetch("http://localhost:3001/api/appointments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(appointment),
  }).then((response) => response.json());
};

export const fetchAppointmentById = (id) => {
  return fetch(`http://localhost:3001/api/appointments/${id}`).then(
    (response) => response.json()
  );
};

export const cancelAppointment = (id) => {
  return fetch(`http://localhost:3001/api/appointments/${id}`, {
    method: "DELETE",
  });
};

export const fetchAppointmentsByPhone = (phone) => {
  return fetch(`http://localhost:3001/api/appointments/phone/${phone}`).then(
    (response) => response.json()
  );
};

export const fetchNext45DaysAppointments = (professionalId: number) => {
  return fetch(
    `http://localhost:3001/api/appointments/times/${professionalId}`
  ).then((response) => response.json());
};

export const fetchCompanyProfile = () => {
  return fetch("http://localhost:3001/api/company-profile").then((response) =>
    response.json()
  );
};

export const updateCompanyProfile = (profile) => {
  return fetch("http://localhost:3001/api/company-profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profile),
  }).then((response) => response.json());
};

export const fetchAppointments = () => {
  return fetch("http://localhost:3001/api/appointments").then((response) =>
    response.json()
  );
};

export const updateAppointmentTime = (id: number, newDateTime: string) => {
  return fetch(`http://localhost:3001/api/appointments/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ appointmentDate: newDateTime }),
  }).then((response) => response.json());
};
