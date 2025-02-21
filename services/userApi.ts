import { getHeaders, handleUnauthorized } from "./api";

export const userApi = {
  fetchAvailableUsers: async () => {
    return fetch("http://localhost:3001/api/users", {
      headers: getHeaders(),
    })
      .then(handleUnauthorized)
      .then((response) => response.json());
  },
};

export const meApi = {
  fetchMe: async () => {
    return fetch("http://localhost:3001/api/auth/me", {
      headers: getHeaders(),
    })
      .then(handleUnauthorized)
      .then((response) => response.json());
  },
};
