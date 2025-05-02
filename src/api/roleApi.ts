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
  limit: number = 5,
  nameFilter: string = "",
  estadoFilter: string = ""
): Promise<PaginatedRolesResponse> => {
  let query = `?page=${page}&limit=${limit}`;

  if (nameFilter) {
    query += `&nombre=${nameFilter}`;
  }

  if (estadoFilter) {
    query += `&estado=${estadoFilter}`;
  }

  const response = await axiosConfig.get<PaginatedRolesResponse>(
    `${BASE_URL}${query}`
  );
  return response.data;
};

export const getRoleById = async (id: number): Promise<Role> => {
  const response = await axiosConfig.get<Role>(`${BASE_URL}/${id}`);
  return response.data;
};

export const createRole = async (nombre: string): Promise<Role> => {
  try {
    const response = await axiosConfig.post<Role>(BASE_URL, { nombre });
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error al crear:", error);

    if (error?.response?.data) {
      const { error: errorCode, message } = error.response.data;

      if (errorCode === "ROLE_EXISTS") {
        throw new Error("El rol ya existe ❌");
      } else {
        throw new Error(message ?? "Error desconocido ❌");
      }
    }

    throw new Error("Error al registrar el rol. Intenta nuevamente ❌");
  }
};

export const updateRole = async (id: number, nombre: string): Promise<Role> => {
  try {
    const response = await axiosConfig.put<Role>(`${BASE_URL}/${id}`, {
      nombre,
    });
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error al crear:", error);

    if (error?.response?.data) {
      const { error: errorCode, message } = error.response.data;

      if (errorCode === "ROLE_EXISTS") {
        throw new Error("El rol ya existe ❌");
      } else {
        throw new Error(message ?? "Error desconocido ❌");
      }
    }

    throw new Error("Error al actualizar el rol. Intenta nuevamente ❌");
  }
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
