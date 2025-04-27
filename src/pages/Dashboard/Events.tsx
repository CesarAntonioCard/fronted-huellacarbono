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
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Event,
  getEventsAdmin,
  deleteEvent,
  updateEvent,
  createEvent,
  restoreEvent,
} from "../../api/eventApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faCheck } from "@fortawesome/free-solid-svg-icons";
import { Input } from "@/components/ui/input";

const defaultImage = "http://localhost:8000/uploads/default-image.webp";

export const Events = () => {
  const BACKEND_URL = "http://localhost:8000";

  const [events, setEvents] = useState<Event[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEventos, setTotalEventos] = useState(0);
  const [limit] = useState(5);

  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteEventId, setDeleteEventId] = useState<number | null>(null);
  const [restoreEventId, setRestoreEventId] = useState<number | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<{
    nombre: string;
    descripcion: string;
    link: string;
    fechaevento: Date;
    url_image: File | string | undefined;
  }>({
    nombre: "",
    descripcion: "",
    link: "",
    fechaevento: new Date(),
    url_image: undefined,
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEventsAdmin(currentPage, limit);
        setEvents(data.events);
        setTotalPages(data.totalPages);
        setTotalEventos(data.totalEventos);
      } catch (error) {
        console.error("Error al obtener eventos:", error);
      }
    };

    fetchEvents();
  }, [currentPage, limit]);

  const handleConfirmDelete = async () => {
    if (deleteEventId !== null) {
      try {
        const updated = await deleteEvent(deleteEventId);
        setEvents((prev) =>
          prev.map((r) => (r.id === updated.id ? updated : r))
        );
        setDeleteEventId(null);
      } catch (error) {
        console.error("Error al eliminar el eventos:", error);
      }
    }
  };

  const handleConfirmRestore = async () => {
    if (restoreEventId !== null) {
      try {
        const restored = await restoreEvent(restoreEventId);
        setEvents((prev) =>
          prev.map((r) => (r.id === restored.id ? restored : r))
        );
        setRestoreEventId(null);
      } catch (error) {
        console.error("Error restaurando el evento:", error);
      }
    }
  };

  const handleCreateEvent = async () => {
    try {
      const imageFile =
        formData.url_image instanceof File ? formData.url_image : undefined;

      const newEvent = await createEvent(
        formData.nombre,
        formData.descripcion,
        formData.link,
        formData.fechaevento,
        imageFile
      );
      setEvents((prevEvents) => [...prevEvents, newEvent]);
      setTotalEventos((prev) => prev + 1);
      setTotalPages(Math.ceil((totalEventos + 1) / limit));

      setIsOpen(false);
    } catch (error) {
      console.error("Error al crear evento:", error);
    }
  };

  const handleUpdateEvent = async () => {
    if (selectedEvent) {
      try {
        const imageFile =
          formData.url_image instanceof File ? formData.url_image : undefined;

        const updatedEvent = await updateEvent(
          selectedEvent.id,
          formData.nombre,
          formData.descripcion,
          formData.link,
          formData.fechaevento,
          imageFile
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

    if (name === "fechaevento") {
      const [year, month, day] = value.split("-").map(Number);

      const localDate = new Date(year, month - 1, day);

      setFormData((prev) => ({
        ...prev,
        [name]: localDate,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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
              setIsEditMode(false);
              setFormData({
                nombre: "",
                descripcion: "",
                link: "",
                fechaevento: new Date(),
                url_image: undefined,
              });
              setSelectedEvent(null);
              setIsOpen(true);
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
            <DialogDescription>
              {isEditMode
                ? "Modifica los campos para actualizar el evento."
                : "Completa los campos para crear un nuevo evento."}
            </DialogDescription>
          </DialogHeader>
          <div className="mb-4">
            <Input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Nombre del Evento"
            />
          </div>
          <div className="mb-4">
            <Input
              type="text"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              placeholder="Descripción del Evento"
            />
          </div>
          <div className="mb-4">
            <Input
              type="text"
              name="link"
              value={formData.link}
              onChange={handleInputChange}
              placeholder="Link del Evento"
            />
          </div>
          <div className="mb-4">
            <Input
              type="date"
              name="fechaevento"
              value={formData.fechaevento.toISOString().split("T")[0]}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <Input
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

      <Dialog
        open={!!deleteEventId}
        onOpenChange={() => setDeleteEventId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar evento?</DialogTitle>
            <DialogDescription>
              Esta acción cambiará el estado del evento a NO VISIBLE.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Eliminar
            </Button>
            <Button variant="outline" onClick={() => setDeleteEventId(null)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!restoreEventId}
        onOpenChange={() => setRestoreEventId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Restaurar evento?</DialogTitle>
            <DialogDescription>
              Esta acción cambiará el estado del evento a VISIBLE.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={handleConfirmRestore}>
              Restaurar
            </Button>
            <Button variant="outline" onClick={() => setRestoreEventId(null)}>
              Cancelar
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
              <TableCell>
                <span
                  className={`font-bold ${
                    event.estado === "VISIBLE"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {event.estado}
                </span>
              </TableCell>
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
                      fechaevento: new Date(event.fechaevento),
                      url_image: event.url_image ?? undefined,
                    });
                    setSelectedEvent(event);
                    setIsOpen(true);
                  }}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </Button>
                {event.estado === "VISIBLE" ? (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      setDeleteEventId(event.id);
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => {
                      setRestoreEventId(event.id);
                    }}
                  >
                    <FontAwesomeIcon icon={faCheck} />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center mt-4 space-x-4">
        <Button
          variant="outline"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-6 py-2 rounded-md font-medium text-sm"
        >
          Anterior
        </Button>

        <span className="font-medium text-lg text-gray-700">
          Página {currentPage} de {totalPages}
        </span>

        <Button
          variant="outline"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-6 py-2 rounded-md font-medium text-sm"
        >
          Siguiente
        </Button>
      </div>
      <div className="border-t border-gray-300 my-4"></div>
      <div className="mt-4 text-lg font-semibold text-gray-800 flex justify-center items-center">
        <span>Total de eventos: </span>
        <span className="text-xl text-blue-600 ml-2">{totalEventos}</span>
      </div>
    </div>
  );
};
