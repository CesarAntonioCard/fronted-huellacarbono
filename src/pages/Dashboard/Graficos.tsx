import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { TodosEventosResponse } from "@/api/updateDashboardApi";

// Formato de fecha
const formatFecha = (fecha: Date) => {
  const offsetMs = fecha.getTimezoneOffset() * 60000;
  const localISO = new Date(fecha.getTime() - offsetMs).toISOString();
  return localISO.split("T")[0];
};

export const Graficos = () => {
  const [eventosTodos, setEventosTodos] = useState<TodosEventosResponse[]>([]);
  const [fechaInicio, setFechaInicio] = useState<string>(
    formatFecha(new Date())
  );
  const [fechaFin, setFechaFin] = useState<string>(formatFecha(new Date()));
  const [horaInicio, setHoraInicio] = useState<string>("00:00");
  const [horaFin, setHoraFin] = useState<string>("23:59");

  const apiUrl = import.meta.env.VITE_API_URL;

  // Función para obtener eventos de la API
  const fetchEventosTodos = useCallback(async () => {
    try {
      let url = `${apiUrl}/api/time_pc/todos?`;

      if (fechaInicio === fechaFin) {
        url += `&fecha=${fechaInicio}`;
        url += `&hora_inicio=${horaInicio}&hora_fin=${horaFin}`;
      } else {
        url += `&fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`;
        url += `&hora_inicio=${horaInicio}&hora_fin=${horaFin}`;
      }

      const response = await axios.get(url);
      if (Array.isArray(response.data)) {
        setEventosTodos(response.data);
      } else {
        console.error("Respuesta inesperada:", response.data);
        setEventosTodos([]);
      }
    } catch (error) {
      console.error("Error al obtener eventos:", error);
      setEventosTodos([]);
    }
  }, [fechaInicio, fechaFin, horaInicio, horaFin, apiUrl]);

  useEffect(() => {
    fetchEventosTodos();
  }, [fetchEventosTodos]);

  const hoy = formatFecha(new Date());
  const ayer = formatFecha(new Date(Date.now() - 86400000));

  // Cálculo de la huella de carbono en CO2
  const calcularHuellaCarbono = (energia: number) => energia * 0.000475;

  // Normalización del valor de intensidad (entre 0 y 1)
  const normalizeValue = (value: number, min: number, max: number) => {
    if (max === min) return 0.5;
    return (value - min) / (max - min);
  };

  // Obtener el color según la intensidad (verde, amarillo, rojo)
  const getColor = (intensity: number) => {
    if (intensity <= 0.33) {
      return "rgb(34, 139, 34)"; // Verde
    } else if (intensity <= 0.66) {
      return "rgb(255, 255, 0)"; // Amarillo
    } else {
      return "rgb(255, 0, 0)"; // Rojo
    }
  };

  // Agrupar eventos por usuario_id
  const eventosPorUsuario = eventosTodos.reduce(
    (acc, evento: TodosEventosResponse) => {
      if (!acc[evento.usuario_id]) {
        acc[evento.usuario_id] = [];
      }
      acc[evento.usuario_id].push(evento);
      return acc;
    },
    {} as Record<number, TodosEventosResponse[]>
  );

  // Obtener el maximo valor de energía para la normalización
  const maxEnergy = Math.max(
    ...eventosTodos.map((evento) => evento.max_energy || 0)
  );

  // Función para manejar el clic en un cuadrito
  const handleClick = (usuarioId: number) => {
    alert(`ID de usuario: ${usuarioId}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Huella de Carbono digital de todos
      </h1>

      {/* Filtros de fecha y hora */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <button
          onClick={() => {
            setFechaInicio(ayer);
            setFechaFin(ayer);
            setHoraInicio("00:00");
            setHoraFin("23:59");
          }}
          className="bg-gray-100 hover:bg-gray-200 text-sm px-4 py-2 rounded-xl"
        >
          Día de Ayer
        </button>
        <button
          onClick={() => {
            setFechaInicio(hoy);
            setFechaFin(hoy);
            setHoraInicio("00:00");
            setHoraFin("23:59");
          }}
          className="bg-gray-100 hover:bg-gray-200 text-sm px-4 py-2 rounded-xl"
        >
          Hoy
        </button>
        <span className="mx-2 text-sm">Desde:</span>
        <input
          type="date"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
          className="border px-2 py-1 rounded-lg text-sm"
        />
        <span className="mx-2 text-sm">Hasta:</span>
        <input
          type="date"
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
          className="border px-2 py-1 rounded-lg text-sm"
        />
        <span className="mx-2 text-sm">Desde Hora:</span>
        <input
          type="time"
          value={horaInicio}
          onChange={(e) => setHoraInicio(e.target.value)}
          className="border px-2 py-1 rounded-lg text-sm"
        />
        <span className="mx-2 text-sm">Hasta Hora:</span>
        <input
          type="time"
          value={horaFin}
          onChange={(e) => setHoraFin(e.target.value)}
          className="border px-2 py-1 rounded-lg text-sm"
        />
      </div>

      {/* Visualización de los usuarios */}
      {Object.keys(eventosPorUsuario).length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          No hay datos registrados 📭
        </div>
      ) : (
        <div className="grid grid-cols-5 gap-4 mt-10">
          {Object.entries(eventosPorUsuario).map(([usuarioIdStr, eventos]) => {
            const usuarioId = parseInt(usuarioIdStr, 10);
            const maxEnergyUsuario = Math.max(
              ...eventos.map((evento) => evento.max_energy ?? 0)
            );
            const huellaCarbono = calcularHuellaCarbono(maxEnergyUsuario);
            const intensity = normalizeValue(huellaCarbono, 0, maxEnergy);
            const color = getColor(intensity);

            return (
              <button
                key={usuarioId}
                onClick={() => handleClick(usuarioId)}
                className="w-[50px] h-[50px] rounded-md"
                style={{
                  backgroundColor: color,
                }}
                title={`Usuario: ${
                  eventos[0].nombre_completo
                }\nHuella de Carbono: ${huellaCarbono.toFixed(5)} CO2`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
