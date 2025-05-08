import { useCallback, useEffect, useState } from "react";
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
import { PaginationBar } from "@/components/PaginationBar";

const defaultImage = `${
  import.meta.env.VITE_API_URL
}/uploads/default-image.webp`;

export const Events = () => {
  const BACKEND_URL = import.meta.env.VITE_API_URL;

  const [events, setEvents] = useState<Event[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEventos, setTotalEventos] = useState(0);
  const [limit] = useState(5);
  const [nameFilter, setNameFilter] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");
  const [descripcionFilter, setDescripcionFilter] = useState("");
  const [fechaeventoFilter, setFechaeventoFilter] = useState<
    Date | undefined
  >();

  const [formError, setFormError] = useState("");

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

  const fetchEvents = useCallback(
    async (page: number = currentPage) => {
      try {
        const data = await getEventsAdmin(
          page,
          limit,
          nameFilter,
          estadoFilter,
          descripcionFilter,
          fechaeventoFilter
        );
        setEvents(data.events);
        setTotalPages(data.totalPages);
        setTotalEventos(data.totalEventos);
      } catch (error) {
        console.error("Error al obtener roles:", error);
      }
    },
    [
      currentPage,
      limit,
      nameFilter,
      estadoFilter,
      descripcionFilter,
      fechaeventoFilter,
    ]
  );

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

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
    setFormError("");
    try {
      const imageFile =
        formData.url_image instanceof File ? formData.url_image : undefined;

      await createEvent(
        formData.nombre,
        formData.descripcion,
        formData.link,
        formData.fechaevento,
        imageFile
      );

      setCurrentPage(1);
      fetchEvents(1);

      setIsOpen(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error en rol:", error);
      setFormError(error.message ?? "Error desconocido");
      setTimeout(() => {
        setFormError("");
      }, 2000);
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error("Error en rol:", error);
        setFormError(error.message ?? "Error desconocido");
        setTimeout(() => {
          setFormError("");
        }, 2000);
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
          {formError && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center">
              {formError}
            </div>
          )}
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

      <div className="mb-4 flex flex-col md:flex-row flex-wrap gap-4">
        <div className="w-full md:w-auto">
          <input
            type="text"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            placeholder="Filtrar por nombre"
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="w-full md:w-auto">
          <input
            type="text"
            value={descripcionFilter}
            onChange={(e) => setDescripcionFilter(e.target.value)}
            placeholder="Filtrar por descripción"
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="w-full md:w-auto">
          <input
            type="date"
            value={
              fechaeventoFilter
                ? fechaeventoFilter.toISOString().split("T")[0]
                : ""
            }
            onChange={(e) => {
              const selectedDate = e.target.value
                ? new Date(e.target.value)
                : undefined;
              setFechaeventoFilter(selectedDate);
            }}
            placeholder="Filtrar por fecha"
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="w-full md:w-auto">
          <select
            value={estadoFilter}
            onChange={(e) => setEstadoFilter(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">Filtrar por estado</option>
            <option value="VISIBLE">VISIBLE</option>
            <option value="NO VISIBLE">NO VISIBLE</option>
          </select>
        </div>
      </div>

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
              <TableCell className="max-w-[100px] truncate overflow-hidden whitespace-nowrap">
                {event.nombre}
              </TableCell>
              <TableCell className="max-w-[100px] truncate overflow-hidden whitespace-nowrap">
                {event.descripcion}
              </TableCell>

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

      <PaginationBar
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalEventos}
        label="eventos"
        onPageChange={setCurrentPage}
      />
    </div>
  );
};
