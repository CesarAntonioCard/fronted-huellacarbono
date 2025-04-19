import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  getEvents,
  deleteEvent,
  updateEvent,
  createEvent,
} from "../../api/eventApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faEye } from "@fortawesome/free-solid-svg-icons";

const defaultImage = "/uploads/default-image.webp";
// 💡 Tipo de evento
interface Event {
  id: number;
  nombre: string;
  descripcion: string;
  link: string;
  estado: string;
  fechaevento: Date;
  url_image?: string;
}

export const Events = () => {
  const BACKEND_URL = "http://localhost:8000";

  const [events, setEvents] = useState<Event[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    link: "",
    estado: "",
    fechaevento: new Date(),
    url_image: undefined as File | undefined,
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (error) {
        console.error("Error al obtener eventos:", error);
      }
    };

    fetchEvents();
  }, []);

  const handleDelete = async () => {
    if (selectedEvent) {
      try {
        await deleteEvent(selectedEvent.id);
        setEvents((prev) =>
          prev.filter((event) => event.id !== selectedEvent.id)
        );
        setIsDeleteModalOpen(false);
      } catch (error) {
        console.error("Error al eliminar evento:", error);
      }
    }
  };

  const handleCreateEvent = async () => {
    try {
      const newEvent = await createEvent(
        formData.nombre,
        formData.descripcion,
        formData.link,
        formData.estado,
        formData.fechaevento,
        formData.url_image
      );
      setEvents((prevEvents) => [...prevEvents, newEvent]);
      setIsOpen(false);
    } catch (error) {
      console.error("Error al crear evento:", error);
    }
  };

  const handleUpdateEvent = async () => {
    if (selectedEvent) {
      try {
        const updatedEvent = await updateEvent(
          selectedEvent.id,
          formData.nombre,
          formData.descripcion,
          formData.link,
          formData.estado,
          formData.fechaevento,
          formData.url_image
        );
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.id === selectedEvent.id ? updatedEvent : event
          )
        );
        setIsOpen(false);
      } catch (error) {
        console.error("Error al actualizar evento:", error);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, url_image: file }));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            className="mb-4"
            onClick={() => {
              // Reset state for creating a new event
              setIsEditMode(false); // Ensure it's set to "Crear Evento"
              setFormData({
                nombre: "",
                descripcion: "",
                link: "",
                estado: "",
                fechaevento: new Date(),
                url_image: undefined,
              });
              setSelectedEvent(null); // Ensure no selected event
              setIsOpen(true); // Open the modal
            }}
          >
            Crear Evento
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Editar Evento" : "Crear Evento"}
            </DialogTitle>
          </DialogHeader>
          <div className="mb-4">
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Nombre del Evento"
              className="input"
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              placeholder="Descripción del Evento"
              className="input"
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="link"
              value={formData.link}
              onChange={handleInputChange}
              placeholder="Link del Evento"
              className="input"
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="estado"
              value={formData.estado}
              onChange={handleInputChange}
              placeholder="Estado del Evento"
              className="input"
            />
          </div>
          <div className="mb-4">
            <input
              type="date"
              name="fechaevento"
              value={formData.fechaevento.toISOString().split("T")[0]}
              onChange={handleInputChange}
              className="input"
            />
          </div>
          <div className="mb-4">
            <input
              type="file"
              name="url_image"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>
          <DialogFooter>
            <Button
              onClick={isEditMode ? handleUpdateEvent : handleCreateEvent}
            >
              {isEditMode ? "Actualizar" : "Crear"}
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Estás seguro de eliminar este evento?</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Imagen</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell>{event.nombre}</TableCell>
              <TableCell>{event.descripcion}</TableCell>
              <TableCell>{event.estado}</TableCell>
              <TableCell>
                {new Date(event.fechaevento).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {event.url_image && (
                  <img
                    src={
                      event.url_image
                        ? `${BACKEND_URL}${event.url_image}`
                        : defaultImage
                    }
                    alt="Evento"
                    width={50}
                  />
                )}
              </TableCell>
              <TableCell className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsEditMode(true);
                    setFormData({
                      nombre: event.nombre,
                      descripcion: event.descripcion,
                      link: event.link,
                      estado: event.estado,
                      fechaevento: new Date(event.fechaevento),
                      url_image: undefined,
                    });
                    setSelectedEvent(event);
                    setIsOpen(true);
                  }}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    setSelectedEvent(event);
                    setIsDeleteModalOpen(true);
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
                <Button size="sm" variant="secondary">
                  <FontAwesomeIcon icon={faEye} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
