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
  limit: number = 5
): Promise<PaginatedEventsResponse> => {
  const response = await axiosConfig.get<PaginatedEventsResponse>(
    `${BASE_URL}/admin/all?page=${page}&limit=${limit}`
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
};

export const updateEvent = async (
  id: number,
  nombre: string,
  descripcion: string,
  link: string,
  fechaevento: Date,
  file?: File
): Promise<Event> => {
  const formData = new FormData();
  formData.append("nombre", nombre);
  formData.append("descripcion", descripcion);
  formData.append("link", link);
  formData.append("fechaevento", fechaevento.toISOString());

  if (file) {
    formData.append("image", file);
  }

  const response = await axiosConfig.put<Event>(`${BASE_URL}/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

export const deleteEvent = async (id: number): Promise<Event> => {
  const response = await axiosConfig.delete<Event>(`${BASE_URL}/${id}`);
  return response.data;
};

export const restoreEvent = async (id: number): Promise<Event> => {
  const response = await axiosConfig.put<Event>(`${BASE_URL}/restore/${id}`);
  return response.data;
};
