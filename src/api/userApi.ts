import axiosConfig from "./axiosConfig";

export type UsuarioEstado = "ACTIVO" | "INACTIVO";

export interface User {
  id: number;
  nombre_completo: string;
  email: string;
  paswword: string;
  rol: string;
  estado: UsuarioEstado;
  creation_time?: Date;
  update_time?: Date;
  delete_time?: Date;
}

export interface PaginatedUsersResponse {
  users: User[];
  page: number;
  totalPages: number;
  totalUsers: number;
}

const BASE_URL = "/api/users";

export const getUsers = async (
  page: number = 1,
  limit: number = 5,
  nameFilter: string = "",
  estadoFilter: string = "",
  emailFilter: string = ""
): Promise<PaginatedUsersResponse> => {
  let query = `?page=${page}&limit=${limit}`;

  if (nameFilter) {
    query += `&nombre_completo=${nameFilter}`;
  }

  if (estadoFilter) {
    query += `&estado=${estadoFilter}`;
  }

  if (emailFilter) {
    query += `&email=${emailFilter}`;
  }
  const response = await axiosConfig.get<PaginatedUsersResponse>(
    `${BASE_URL}/${query}`
  );
  return response.data;
};

export const getUserById = async (id: number): Promise<User> => {
  const response = await axiosConfig.get<User>(`${BASE_URL}/${id}`);
  return response.data;
};

export const deleteUser = async (id: number): Promise<User> => {
  const response = await axiosConfig.delete<User>(`${BASE_URL}/${id}`);
  return response.data;
};

export const restoreUser = async (id: number): Promise<User> => {
  const response = await axiosConfig.put<User>(`${BASE_URL}/restore/${id}`);
  return response.data;
};
