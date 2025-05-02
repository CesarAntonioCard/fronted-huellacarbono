import axiosConfig from "./axiosConfig";

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    nombreCompleto: string;
    rol: string;
  };
}

export const login = async (email: string, password: string) => {
  try {
    const response = await axiosConfig.post<LoginResponse>("/login", {
      email,
      password,
    });

    const { token, user } = response.data;

    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(user));

    return {
      token,
      user: {
        ...user,
        rol: user.rol.toUpperCase() as "ADMIN" | "USER",
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error en login:", error);

    if (error?.response?.data) {
      const { error: errorCode, message } = error.response.data;

      if (errorCode === "USER_NOT_FOUND") {
        throw new Error("Usuario no encontrado ❌");
      } else if (errorCode === "USER_DISABLED") {
        throw new Error("Tu cuenta está deshabilitada. Contacta al soporte ❌");
      } else if (errorCode === "INVALID_PASSWORD") {
        throw new Error("Contraseña incorrecta ❌");
      } else {
        throw new Error(message ?? "Error desconocido ❌");
      }
    }

    throw new Error("Error en la autenticación. Intenta nuevamente ❌");
  }
};

export const register = async (
  nombreCompleto: string,
  email: string,
  password: string
) => {
  try {
    return await axiosConfig.post("/api/users", {
      nombreCompleto,
      email,
      password,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error en el registrar:", error);

    if (error?.response?.data) {
      const { error: errorCode, message } = error.response.data;

      if (errorCode === "WEAK_PASSWORD") {
        throw new Error(
          "La contraseña debe incluir al menos una mayúscula, un número, un carácter especial y debe contar con al menos 8 caracteres ❌"
        );
      } else if (errorCode === "FIELDS_MISSING") {
        throw new Error("Todos los campos son obligatorios ❌");
      } else if (errorCode === "INVALID_NAME_LENGTH") {
        throw new Error("El nombre debe tener al menos 3 caracteres ❌");
      } else if (errorCode === "INVALID_EMAIL_FORMAT") {
        throw new Error("Correo electrónico no válido ❌");
      } else if (errorCode === "EMAIL_ALREADY_REGISTERED") {
        throw new Error("El correo electrónico ya está registrado ❌");
      } else {
        throw new Error(message ?? "Error desconocido ❌");
      }
    }

    throw new Error("Error al registrar usuario. Intenta nuevamente ❌");
  }
};
