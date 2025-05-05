import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import {
  connectToDashboardWebSocket,
  AppUsageEvent,
} from "../../api/updateDashboardApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeaf, faMicrochip, faPlug } from "@fortawesome/free-solid-svg-icons";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const formatFecha = (fecha: Date) => {
  const offsetMs = fecha.getTimezoneOffset() * 60000;
  const localISO = new Date(fecha.getTime() - offsetMs).toISOString();
  return localISO.split("T")[0]; // Formato YYYY-MM-DD
};

export const MiHuella = () => {
  const { user } = useAuth();
  const [eventos, setEventos] = useState<AppUsageEvent[]>([]);
  const [eventosPorAplicacion, setEventosPorAplicacion] = useState<
    AppUsageEvent[]
  >([]);
  const [eventosPorCategoria, setEventosPorCategoria] = useState<
    AppUsageEvent[]
  >([]);
  const [fechaInicio, setFechaInicio] = useState<string>(
    formatFecha(new Date())
  );
  const [fechaFin, setFechaFin] = useState<string>(formatFecha(new Date()));

  const [horaInicio, setHoraInicio] = useState<string>("00:00");
  const [horaFin, setHoraFin] = useState<string>("23:59");

  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchEventos = useCallback(async () => {
    if (!user?.id) return;

    try {
      let url = `${apiUrl}/api/time_pc?usuario_id=${user.id}`;

      if (fechaInicio === fechaFin) {
        url += `&fecha=${fechaInicio}`;
        url += `&hora_inicio=${horaInicio}&hora_fin=${horaFin}`;
      } else {
        url += `&fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`;
        url += `&hora_inicio=${horaInicio}&hora_fin=${horaFin}`;
      }

      const response = await axios.get(url);
      console.log("Respuesta de la API:", response.data);
      if (Array.isArray(response.data)) {
        setEventos(response.data);
      } else {
        console.error("Respuesta inesperada:", response.data);
        setEventos([]);
      }
    } catch (error) {
      console.error("Error al obtener eventos:", error);
      setEventos([]);
    }
  }, [user?.id, fechaInicio, fechaFin, horaInicio, horaFin, apiUrl]);

  const fetchEventosPorAplicacion = useCallback(async () => {
    if (!user?.id) return;

    try {
      let url = `${apiUrl}/api/time_pc/por-aplicacion?usuario_id=${user.id}`;
      if (fechaInicio === fechaFin) {
        url += `&fecha=${fechaInicio}`;
      } else {
        url += `&fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`;
      }

      const response = await axios.get(url);
      if (Array.isArray(response.data)) {
        setEventosPorAplicacion(response.data);
      } else {
        console.error("Respuesta inesperada:", response.data);
        setEventosPorAplicacion([]);
      }
    } catch (error) {
      console.error("Error al obtener consumo por aplicación:", error);
      setEventosPorAplicacion([]);
    }
  }, [user?.id, fechaInicio, fechaFin, apiUrl]);

  const fetchEventosPorCategoria = useCallback(async () => {
    if (!user?.id) return;

    try {
      let url = `${apiUrl}/api/time_pc/por-categoria?usuario_id=${user.id}`;
      if (fechaInicio === fechaFin) {
        url += `&fecha=${fechaInicio}`;
      } else {
        url += `&fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`;
      }

      const response = await axios.get(url);
      if (Array.isArray(response.data)) {
        setEventosPorCategoria(response.data);
      } else {
        console.error("Respuesta inesperada:", response.data);
        setEventosPorCategoria([]);
      }
    } catch (error) {
      console.error("Error al obtener consumo por categoría:", error);
      setEventosPorCategoria([]);
    }
  }, [user?.id, fechaInicio, fechaFin, apiUrl]);

  useEffect(() => {
    fetchEventos();
    fetchEventosPorAplicacion();
    fetchEventosPorCategoria();
  }, [fetchEventos, fetchEventosPorAplicacion, fetchEventosPorCategoria]);

  useEffect(() => {
    if (!user?.id) return;

    const userIdNumber = Number(user.id);

    connectToDashboardWebSocket((data) => {
      if (data.usuario_id === userIdNumber) {
        setEventos((prev) => [...prev, data]);
        fetchEventosPorAplicacion();
        fetchEventosPorCategoria();
      }
    }, userIdNumber);
  }, [user, fetchEventosPorAplicacion, fetchEventosPorCategoria]);

  const calcularTotalMwh = () =>
    eventos.reduce((sum, e) => sum + e.energy_mwh, 0);

  const calcularTotalCO2 = () => calcularTotalMwh() * 0.000475;

  const calcularPorcentaje = (valor: number) => {
    const total = calcularTotalMwh();
    return total > 0 ? Math.min((valor / total) * 100, 100) : 0;
  };

  if (!user?.id) {
    return (
      <div className="text-center text-red-500 mt-10">
        Usuario no autenticado.
      </div>
    );
  }

  const hoy = formatFecha(new Date());
  const ayer = formatFecha(new Date(Date.now() - 86400000));

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Mi Huella de Carbono</h1>

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

      {eventos.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          No hay datos registrados 📭
        </div>
      ) : (
        <>
          {/* Consumo total mejorado */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-md flex items-center gap-4 transition hover:shadow-lg">
              <div className="bg-green-100 text-green-600 p-3 rounded-full">
                <FontAwesomeIcon icon={faPlug} className="text-2xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Consumo Energético</p>
                <p className="text-2xl font-semibold text-gray-800">
                  {calcularTotalMwh().toFixed(2)} mWh
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md flex items-center gap-4 transition hover:shadow-lg">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                <FontAwesomeIcon icon={faMicrochip} className="text-2xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Eventos Registrados</p>
                <p className="text-2xl font-semibold text-gray-800">
                  {eventos.length}
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md flex items-center gap-4 transition hover:shadow-lg">
              <div className="bg-lime-100 text-lime-600 p-3 rounded-full">
                <FontAwesomeIcon icon={faLeaf} className="text-2xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Huella CO₂ estimada</p>
                <p className="text-2xl font-semibold text-gray-800">
                  {calcularTotalCO2().toFixed(4)} kg
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4">
              Consumo{" "}
              {fechaInicio === fechaFin
                ? `el ${fechaInicio} de ${horaInicio} a ${horaFin}`
                : `entre ${fechaInicio} ${horaInicio} y ${fechaFin} ${horaFin}`}
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={eventos}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="start_time"
                  tickFormatter={(str) => {
                    const date = new Date(str);
                    return date.toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                  }}
                />
                <YAxis
                  label={{
                    value: "Consumo (mWh)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  labelFormatter={(str) => {
                    const date = new Date(str);
                    return date.toLocaleString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    });
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="cpu_usage"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.3}
                  name="CPU Usage"
                />
                <Area
                  type="monotone"
                  dataKey="energy_mwh"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.3}
                  name="Energía (mWh)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Tablas de Aplicaciones y Categorías */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Top de Aplicaciones por Emisión */}
            <div className="bg-white p-4 rounded-2xl shadow-md md:w-1/2">
              <h2 className="text-xl font-semibold mb-4">
                Top Aplicaciones por Emisión
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 text-left">Aplicación</th>
                      <th className="p-2 text-left">Emisión (kg CO₂)</th>
                      <th className="p-2 text-left">Porcentaje</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventosPorAplicacion.slice(0, 5).map((app: any) => {
                      const totalEmision = app.total_energy_mwh * 0.000475;
                      const porcentaje = calcularPorcentaje(
                        app.total_energy_mwh
                      );

                      return (
                        <tr key={app.app} className="border-t">
                          <td className="p-2">{app.app}</td>
                          <td className="p-2">{totalEmision.toFixed(4)} kg</td>
                          <td className="p-2">{porcentaje.toFixed(2)}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top de Categorías por Emisión */}
            <div className="bg-white p-4 rounded-2xl shadow-md md:w-1/2">
              <h2 className="text-xl font-semibold mb-4">
                Top Categorías por Emisión
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 text-left">Categoría</th>
                      <th className="p-2 text-left">Emisión (kg CO₂)</th>
                      <th className="p-2 text-left">Porcentaje</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventosPorCategoria.map((categoria: any) => {
                      const totalEmision =
                        categoria.total_energy_mwh * 0.000475;
                      const porcentaje = calcularPorcentaje(
                        categoria.total_energy_mwh
                      );

                      return (
                        <tr key={categoria.category} className="border-t">
                          <td className="p-2">{categoria.category}</td>
                          <td className="p-2">{totalEmision.toFixed(4)} kg</td>
                          <td className="p-2">{porcentaje.toFixed(2)}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
