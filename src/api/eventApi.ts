import axiosConfig from "./axiosConfig";

interface Event {
  id: number;
  nombre: string;
  descripcion: string;
  link: string;
  estado: string;
  fechaevento: Date;
  url_image?: string;
  creation_time?: Date;
  update_time?: Date;
  delete_time?: Date;
}

export const getEvents = async (): Promise<Event[]> => {
  const response = await axiosConfig.get<Event[]>("/eventos");
  return response.data;
};

export const getEventById = async (id: number): Promise<Event> => {
  const response = await axiosConfig.get<Event>(`/eventos/${id}`);
  return response.data;
};

export const createEvent = async (
  nombre: string,
  descripcion: string,
  link: string,
  estado: string,
  fechaevento: Date,
  file?: File
): Promise<Event> => {
  const formData = new FormData();
  formData.append("nombre", nombre);
  formData.append("descripcion", descripcion);
  formData.append("link", link);
  formData.append("estado", estado);
  formData.append("fechaevento", fechaevento.toISOString());

  if (file) {
    formData.append("image", file);
  }

  const response = await axiosConfig.post<Event>("/eventos", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

export const updateEvent = async (
  id: number,
  nombre: string,
  descripcion: string,
  link: string,
  estado: string,
  fechaevento: Date,
  file?: File
): Promise<Event> => {
  const formData = new FormData();
  formData.append("nombre", nombre);
  formData.append("descripcion", descripcion);
  formData.append("link", link);
  formData.append("estado", estado);
  formData.append("fechaevento", fechaevento.toISOString());

  if (file) {
    formData.append("image", file);
  }

  const response = await axiosConfig.put<Event>(`/eventos/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

export const deleteEvent = async (id: number): Promise<Event> => {
  const response = await axiosConfig.delete<Event>(`/eventos/${id}`);
  return response.data;
};
