import axiosConfig from "./axiosConfig";

export type UsuarioEstado = "ACTIVO" | "INACTIVO";

export interface User {
  id: number;
  nombre_completo: string;
  email: string;
  password: string;
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

export interface SimplifiedUser {
  nombre_completo: string;
  email: string;
  password: string;
}

export interface UpdateUserDTO {
  email: string;
  nombre_completo: string;
  password?: string;
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

export const getUserByIdUser = async (id: number): Promise<SimplifiedUser> => {
  const response = await axiosConfig.get<User>(`${BASE_URL}/${id}`);
  const user = response.data;

  const simplifiedUser: SimplifiedUser = {
    nombre_completo: user.nombre_completo,
    email: user.email,
    password: user.password,
  };

  return simplifiedUser;
};

export const putUserByIdUser = async (
  id: number,
  data: UpdateUserDTO
): Promise<SimplifiedUser> => {
  try {
    const payload = {
      email: data.email,
      nombreCompleto: data.nombre_completo,
      password: data.password,
    };

    const response = await axiosConfig.put<User>(`${BASE_URL}/${id}`, payload);
    const user = response.data;

    return {
      nombre_completo: user.nombre_completo,
      email: user.email,
      password: user.password,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error actualizando usuario:", error);

    if (error?.response?.data) {
      const { code, message } = error.response.data;

      switch (code) {
        case "FIELDS_MISSING":
          throw new Error("Todos los campos son obligatorios ❌");
        case "INVALID_NAME_LENGTH":
          throw new Error("El nombre debe tener al menos 3 caracteres ❌");
        case "INVALID_EMAIL_FORMAT":
          throw new Error("Correo electrónico no válido ❌");
        case "WEAK_PASSWORD":
          throw new Error(
            "La contraseña debe incluir al menos una mayúscula, un número, un carácter especial y debe contar con al menos 8 caracteres ❌"
          );
        case "EMAIL_ALREADY_REGISTERED":
          throw new Error("El correo electrónico ya está registrado ❌");
        case "USER_NOT_FOUND":
          throw new Error("Usuario no encontrado o inactivo ❌");
        default:
          throw new Error(
            message ?? "Error desconocido al actualizar usuario ❌"
          );
      }
    }

    throw new Error("Error al actualizar usuario. Intenta nuevamente ❌");
  }
};

export const deleteUser = async (id: number): Promise<User> => {
  const response = await axiosConfig.delete<User>(`${BASE_URL}/${id}`);
  return response.data;
};

export const restoreUser = async (id: number): Promise<User> => {
  const response = await axiosConfig.put<User>(`${BASE_URL}/restore/${id}`);
  return response.data;
};
