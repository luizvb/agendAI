// Utility functions for API calls
export const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("session-token-id");
  }
  return undefined;
};

export const getHeaders = (): Record<string, string> => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export const handleUnauthorized = (response: Response): Response => {
  if (response.status === 401) {
    if (typeof window !== "undefined") {
      window.location.href = "/api/auth/signin";
    }
  }
  return response;
};
