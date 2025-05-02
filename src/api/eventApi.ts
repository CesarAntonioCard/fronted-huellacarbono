import axiosConfig from "./axiosConfig";

export type EventEstado = "VISIBLE" | "NO VISIBLE";

export interface Event {
  id: number;
  nombre: string;
  descripcion: string;
  link: string;
  estado: EventEstado;
  fechaevento: Date;
  url_image?: string;
  creation_time?: Date;
  update_time?: Date;
  delete_time?: Date;
}

export interface PaginatedEventsResponse {
  events: Event[];
  page: number;
  totalPages: number;
  totalEventos: number;
}

const BASE_URL = "/eventos";

// Eventos públicos
export const getEvents = async (): Promise<Event[]> => {
  const response = await axiosConfig.get<Event[]>(BASE_URL);
  return response.data;
};

export const getEventById = async (id: number): Promise<Event> => {
  const response = await axiosConfig.get<Event>(`${BASE_URL}/${id}`);
  return response.data;
};

// Eventos admin
export const getEventsAdmin = async (
  page: number = 1,
  limit: number = 5,
  nameFilter: string = "",
  estadoFilter: string = "",
  descripcionFilter: string = "",
  fechaeventoFilter?: Date
): Promise<PaginatedEventsResponse> => {
  let query = `?page=${page}&limit=${limit}`;

  if (nameFilter) {
    query += `&nombre=${nameFilter}`;
  }

  if (estadoFilter) {
    query += `&estado=${estadoFilter}`;
  }

  if (descripcionFilter) {
    query += `&descripcion=${descripcionFilter}`;
  }

  if (fechaeventoFilter) {
    query += `&fechaevento=${encodeURIComponent(
      fechaeventoFilter.toISOString()
    )}`;
  }

  const response = await axiosConfig.get<PaginatedEventsResponse>(
    `${BASE_URL}/admin/all${query}`
  );
  return response.data;
};

export const createEvent = async (
  nombre: string,
  descripcion: string,
  link: string,
  fechaevento: Date,
  file?: File
): Promise<Event> => {
  try {
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("descripcion", descripcion);
    formData.append("link", link);
    formData.append("fechaevento", fechaevento.toISOString());

    if (file) {
      formData.append("image", file);
    }

    const response = await axiosConfig.post<Event>(BASE_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error al crear:", error);

    if (error?.response?.data) {
      const { error: errorCode, message } = error.response.data;

      if (errorCode === "INVALID_DESCRIPTION") {
        throw new Error("La descripción debe tener al menos 3 caracteres ❌");
      } else if (errorCode === "INVALID_DATE") {
        throw new Error("La fecha del evento no puede ser pasada ❌");
      } else if (errorCode === "EVENT_EXISTS") {
        throw new Error("El evento ya existe ❌");
      } else {
        throw new Error(message ?? "Error desconocido ❌");
      }
    }

    throw new Error("Error al registrar el evento. Intenta nuevamente ❌");
  }
};

export const updateEvent = async (
  id: number,
  nombre: string,
  descripcion: string,
  link: string,
  fechaevento: Date,
  file?: File
): Promise<Event> => {
  try {
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("descripcion", descripcion);
    formData.append("link", link);
    formData.append("fechaevento", fechaevento.toISOString());

    if (file) {
      formData.append("image", file);
    }

    const response = await axiosConfig.put<Event>(
      `${BASE_URL}/${id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error al crear:", error);

    if (error?.response?.data) {
      const { error: errorCode, message } = error.response.data;

      if (errorCode === "INVALID_DESCRIPTION") {
        throw new Error("La descripción debe tener al menos 3 caracteres ❌");
      } else if (errorCode === "EVENT_EXISTS") {
        throw new Error("El evento ya existe ❌");
      } else {
        throw new Error(message ?? "Error desconocido ❌");
      }
    }

    throw new Error("Error al registrar el evento. Intenta nuevamente ❌");
  }
};

export const deleteEvent = async (id: number): Promise<Event> => {
  const response = await axiosConfig.delete<Event>(`${BASE_URL}/${id}`);
  return response.data;
};

export const restoreEvent = async (id: number): Promise<Event> => {
  const response = await axiosConfig.put<Event>(`${BASE_URL}/restore/${id}`);
  return response.data;
};
