import { useState, useEffect } from "react";
import { getEvents } from "../api/eventApi";
import Navbar from "../components/Navbar/Navbar";

const defaultImage = "/uploads/default-image.webp";

interface EventData {
  id: number;
  nombre: string;
  descripcion: string;
  link?: string;
  estado: string;
  fechaevento: string;
  url_image?: string;
}

function Eventos() {
  const BACKEND_URL = import.meta.env.VITE_API_URL;

  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents = await getEvents();

        const formattedEvents = fetchedEvents.map((event) => {
          return {
            ...event,
            fechaevento: new Date(event.fechaevento).toLocaleDateString(),
          };
        });

        setEvents(formattedEvents);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Error desconocido al cargar los eventos.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>Cargando eventos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <div className="w-full max-w-7xl p-4">
          {events.length === 0 ? (
            <p className="text-center text-xl text-gray-700">
              No hay eventos registrados.
            </p>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-full"
                  style={{ maxWidth: "600px" }}
                >
                  <div className="w-full mb-4">
                    <img
                      src={
                        event.url_image
                          ? `${BACKEND_URL}${event.url_image}`
                          : defaultImage
                      }
                      alt={event.nombre}
                      className="w-full h-48 object-cover rounded-md"
                    />
                  </div>

                  <div className="flex flex-col justify-between">
                    <h3 className="text-2xl font-semibold text-gray-800">
                      {event.nombre}
                    </h3>
                    <p className="text-sm text-gray-600">{event.fechaevento}</p>

                    <p className="text-gray-700 mt-2 text-ellipsis overflow-hidden whitespace-nowrap">
                      {event.descripcion}
                    </p>

                    {event.link && (
                      <a
                        href={event.link}
                        className="mt-2 text-blue-500 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Ver más
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Eventos;
