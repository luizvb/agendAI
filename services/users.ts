import { api } from "@/lib/api";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
}

export async function getUsers() {
  const response = await api.get<User[]>("/users");
  return response.data;
}

export async function createUser(data: CreateUserInput) {
  const response = await api.post<User>("/users", data);
  return response.data;
}

export async function updateUser(id: string, data: UpdateUserInput) {
  const response = await api.put<User>(`/users/${id}`, data);
  return response.data;
}

export async function deleteUser(id: string) {
  await api.delete(`/users/${id}`);
}
