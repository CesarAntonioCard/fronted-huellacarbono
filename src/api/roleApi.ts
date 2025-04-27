import axiosConfig from "./axiosConfig";

export type RoleEstado = "ACTIVO" | "INACTIVO";

export interface Role {
  id: number;
  nombre: string;
  estado: RoleEstado;
  creation_time?: Date;
  update_time?: Date;
  delete_time?: Date;
}

export interface PaginatedRolesResponse {
  roles: Role[];
  page: number;
  totalPages: number;
  totalRoles: number;
}

const BASE_URL = "/api/roles";

export const getRoles = async (
  page: number = 1,
  limit: number = 5
): Promise<PaginatedRolesResponse> => {
  const response = await axiosConfig.get<PaginatedRolesResponse>(
    `${BASE_URL}?page=${page}&limit=${limit}`
  );
  return response.data;
};

export const getRoleById = async (id: number): Promise<Role> => {
  const response = await axiosConfig.get<Role>(`${BASE_URL}/${id}`);
  return response.data;
};

export const createRole = async (nombre: string): Promise<Role> => {
  const response = await axiosConfig.post<Role>(BASE_URL, { nombre });
  return response.data;
};

export const updateRole = async (id: number, nombre: string): Promise<Role> => {
  const response = await axiosConfig.put<Role>(`${BASE_URL}/${id}`, { nombre });
  return response.data;
};

// Eliminar un rol
export const deleteRole = async (id: number): Promise<Role> => {
  const response = await axiosConfig.delete<Role>(`${BASE_URL}/${id}`);
  return response.data;
};

// Restaurar un rol
export const restoreRole = async (id: number): Promise<Role> => {
  const response = await axiosConfig.put<Role>(`${BASE_URL}/restore/${id}`);
  return response.data;
};
