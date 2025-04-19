import axiosConfig from "./axiosConfig";

export interface Role {
  id: number;
  nombre: string;
}

const BASE_URL = "/api/roles";

export const getRoles = async (): Promise<Role[]> => {
  const response = await axiosConfig.get<Role[]>(BASE_URL);
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

export const deleteRole = async (id: number): Promise<void> => {
  await axiosConfig.delete(`${BASE_URL}/${id}`);
};
