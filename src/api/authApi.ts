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
  } catch (error) {
    console.error("Error en login:", error);
    throw error;
  }
};

export const register = (
  nombreCompleto: string,
  email: string,
  password: string
) => {
  return axiosConfig.post("/api/users", {
    nombreCompleto,
    email,
    password,
  });
};
