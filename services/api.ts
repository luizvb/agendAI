export const fetchServices = () => {
  return fetch("http://localhost:3000/api/services").then((response) =>
    response.json()
  );
};

export const fetchProfessionals = () => {
  return fetch("http://localhost:3000/api/professionals").then((response) =>
    response.json()
  );
};

export const fetchAvailableDays = () => {
  return fetch("http://localhost:3000/api/appointments/available-days").then(
    (response) => response.json()
  );
};

export const fetchAddress = () => {
  return fetch("http://localhost:3000/api/address").then((response) =>
    response.json()
  );
};

export const addService = (service) => {
  return fetch("http://localhost:3000/api/services", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(service),
  }).then((response) => response.json());
};

export const updateService = (id, updatedService) => {
  return fetch(`http://localhost:3000/api/services/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedService),
  }).then((response) => response.json());
};

export const deleteService = (id) => {
  return fetch(`http://localhost:3000/api/services/${id}`, {
    method: "DELETE",
  });
};

export const addProfessional = (professional) => {
  return fetch("http://localhost:3000/api/professionals", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(professional),
  }).then((response) => response.json());
};

export const updateProfessional = (id, updatedProfessional) => {
  return fetch(`http://localhost:3000/api/professionals/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedProfessional),
  }).then((response) => response.json());
};

export const deleteProfessional = (id) => {
  return fetch(`http://localhost:3000/api/professionals/${id}`, {
    method: "DELETE",
  });
};

export const fetchProfessionalsByService = (serviceId) => {
  return fetch(`http://localhost:3000/api/professionals`).then((response) =>
    response.json()
  );
};

export const updateAddress = (newAddress) => {
  return fetch("http://localhost:3000/api/address", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ address: newAddress }),
  }).then((response) => response.json());
};

export const scheduleAppointment = (appointment) => {
  return fetch("http://localhost:3000/api/appointments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(appointment),
  }).then((response) => response.json());
};

export const fetchAppointmentById = (id) => {
  return fetch(`http://localhost:3000/api/appointments/${id}`).then(
    (response) => response.json()
  );
};

export const cancelAppointment = (id) => {
  return fetch(`http://localhost:3000/api/appointments/${id}`, {
    method: "DELETE",
  });
};

export const fetchAppointmentsByPhone = (phone) => {
  return fetch(`http://localhost:3000/api/appointments/phone/${phone}`).then(
    (response) => response.json()
  );
};

export const fetchNext45DaysAppointments = () => {
  return fetch("http://localhost:3000/api/appointments/times").then(
    (response) => response.json()
  );
};
