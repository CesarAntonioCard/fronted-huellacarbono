import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import {
  connectToDashboardWebSocket,
  AppUsageEvent,
} from "../../api/updateDashboardApi";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeaf, faPlug, faMicrochip } from "@fortawesome/free-solid-svg-icons";

const formatFecha = (fecha: Date) => {
  const offsetMs = fecha.getTimezoneOffset() * 60000;
  const localISO = new Date(fecha.getTime() - offsetMs).toISOString();
  return localISO.split("T")[0];
};

export const MiHuella = () => {
  const { user } = useAuth();
  const [eventos, setEventos] = useState<AppUsageEvent[]>([]);
  const [fechaInicio, setFechaInicio] = useState<string>(
    formatFecha(new Date())
  );
  const [fechaFin, setFechaFin] = useState<string>(formatFecha(new Date()));

  const fetchEventos = useCallback(async () => {
    if (!user?.id) return;

    try {
      let url = `http://localhost:8000/api/time_pc?usuario_id=${user.id}`;

      if (fechaInicio === fechaFin) {
        url += `&fecha=${fechaInicio}`;
      } else {
        url += `&fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`;
      }

      const response = await axios.get(url);

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
  }, [user?.id, fechaInicio, fechaFin]);

  useEffect(() => {
    fetchEventos();
  }, [fetchEventos]);

  useEffect(() => {
    if (!user?.id) return;

    const userIdNumber = Number(user.id);

    connectToDashboardWebSocket((data) => {
      if (data.usuario_id === userIdNumber) {
        setEventos((prev) => [...prev, data]);
      }
    }, userIdNumber);
  }, [user]);

  const calcularTotalMwh = () =>
    eventos.reduce((sum, e) => sum + e.energy_mwh, 0);

  const calcularTotalCO2 = () => calcularTotalMwh() * 0.000475;

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
          }}
          className="bg-gray-100 hover:bg-gray-200 text-sm px-4 py-2 rounded-xl"
        >
          Día de Ayer
        </button>
        <button
          onClick={() => {
            setFechaInicio(hoy);
            setFechaFin(hoy);
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
      </div>

      {eventos.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          No hay datos registrados 📭
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-4 rounded-2xl shadow-md flex items-center gap-4">
              <FontAwesomeIcon
                icon={faPlug}
                className="text-green-600 text-3xl"
              />
              <div>
                <p className="text-sm text-gray-500">Consumo Energético</p>
                <p className="text-xl font-bold">
                  {calcularTotalMwh().toFixed(2)} mWh
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-md flex items-center gap-4">
              <FontAwesomeIcon
                icon={faMicrochip}
                className="text-blue-600 text-3xl"
              />
              <div>
                <p className="text-sm text-gray-500">Eventos Registrados</p>
                <p className="text-xl font-bold">{eventos.length}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-md flex items-center gap-4">
              <FontAwesomeIcon
                icon={faLeaf}
                className="text-lime-600 text-3xl"
              />
              <div>
                <p className="text-sm text-gray-500">Huella CO₂ estimada</p>
                <p className="text-xl font-bold">
                  {calcularTotalCO2().toFixed(4)} kg
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              Consumo{" "}
              {fechaInicio === fechaFin
                ? `el ${fechaInicio}`
                : `entre ${fechaInicio} y ${fechaFin}`}
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={eventos}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="app" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="cpu_usage"
                  stroke="#8884d8"
                  name="CPU Usage"
                />
                <Line
                  type="monotone"
                  dataKey="energy_mwh"
                  stroke="#82ca9d"
                  name="Energía (mWh)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};
