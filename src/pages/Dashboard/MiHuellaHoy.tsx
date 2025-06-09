import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import { AppUsageTodayResponse } from "../../api/updateDashboardApi";
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
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { useWebSocket } from "@/context/WebSocketContext";

export const MiHuellaHoy = () => {
  const { user } = useAuth();

  const [dataHoy, setDataHoy] = useState<AppUsageTodayResponse>({
    resumen: {
      total_registros: 0,
      total_energy_mwh: 0,
      total_hca: 0,
    },
    registros: [],
    por_aplicacion: [],
    por_categoria: [],
  });

  const dataHoyRef = useRef<AppUsageTodayResponse>({
    resumen: {
      total_registros: 0,
      total_energy_mwh: 0,
      total_hca: 0,
    },
    registros: [],
    por_aplicacion: [],
    por_categoria: [],
  });

  const [error, setError] = useState<string | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL;

  const { registerHandlers } = useWebSocket();

  const [xInterval, setXInterval] = useState<number | "preserveStartEnd">(0);

  useEffect(() => {
    const fetchEventosHoy = async () => {
      if (!user?.id) return;
      setError(null);

      try {
        const url = `${apiUrl}/api/time_pc/hoy?usuario_id=${user.id}`;
        const response = await axios.get<AppUsageTodayResponse>(url);
        setDataHoy(response.data);
        dataHoyRef.current = response.data;
      } catch (error) {
        console.error("Error al obtener consumo por aplicación:", error);
        setError("Error al cargar datos de hoy.");
        const emptyData: AppUsageTodayResponse = {
          resumen: {
            total_registros: 0,
            total_energy_mwh: 0,
            total_hca: 0,
          },
          registros: [],
          por_aplicacion: [],
          por_categoria: [],
        };
        setDataHoy(emptyData);
        dataHoyRef.current = emptyData;
      }
    };

    fetchEventosHoy();

    if (!user?.id) return;

    registerHandlers({
      updateDashboardToday: (newData: AppUsageTodayResponse) => {
        setDataHoy(newData);
        dataHoyRef.current = newData;
      },
    });
  }, [user, apiUrl, registerHandlers]);

  useEffect(() => {
    function updateInterval() {
      if (window.innerWidth < 640) {
        setXInterval(30);
      } else {
        setXInterval("preserveStartEnd");
      }
    }

    updateInterval();
    window.addEventListener("resize", updateInterval);
    return () => window.removeEventListener("resize", updateInterval);
  }, []);

  if (error) return <div className="text-center text-red-500 p-6">{error}</div>;

  if (!user?.id) {
    return (
      <div className="text-center text-red-500 mt-10">
        Usuario no autenticado.
      </div>
    );
  }

  const calcularPorcentaje = (valor: number) =>
    (valor / dataHoy.resumen.total_energy_mwh) * 100 || 0;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Mi Huella de Carbono</h1>

      {dataHoy.registros.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          No hay datos registrados 📭
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-md flex items-center gap-4 transition hover:shadow-lg">
              <div className="bg-green-100 text-green-600 p-3 rounded-full">
                <FontAwesomeIcon icon={faPlug} className="text-2xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Consumo Energético</p>
                <p className="text-2xl font-semibold text-gray-800">
                  {dataHoy.resumen.total_energy_mwh.toFixed(4)} mWh
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
                  {dataHoy.resumen.total_registros}
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
                  {dataHoy.resumen.total_hca.toFixed(4)} kg
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-md mb-8 overflow-x-auto">
            <h2 className="text-xl font-semibold mb-4">Consumo</h2>
            <div className="w-full h-[200px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dataHoy.registros}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="start_time"
                    interval={xInterval}
                    minTickGap={20}
                    tickFormatter={(str) => {
                      const date = new Date(str);
                      return isNaN(date.getTime())
                        ? ""
                        : date.toLocaleTimeString("es-PE", {
                            hour: "2-digit",
                            minute: "2-digit",
                            timeZone: "America/Lima",
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
                      return isNaN(date.getTime())
                        ? ""
                        : date.toLocaleString("es-ES", {
                            hour: "2-digit",
                            minute: "2-digit",
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            timeZone: "America/Lima",
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
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Top Aplicaciones por Emisión */}
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
                    {dataHoy.por_aplicacion.map((app) => {
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
            {/* Fin Top Aplicaciones por Emisión */}

            {/* Top Categorías por Emisión */}
            <div className="bg-white p-4 rounded-2xl shadow-md md:w-1/2">
              <h2 className="text-xl font-semibold mb-4">
                Top Categorías por Emisión
              </h2>
              <div className="overflow-x-auto">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dataHoy.por_categoria}
                      dataKey="total_energy_mwh"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#82ca9d"
                      label={({ percent }) => `${(percent * 100).toFixed(2)}%`}
                    >
                      {dataHoy.por_categoria.map((categoria, index) => (
                        <Cell
                          key={categoria.category}
                          fill={["#32CD32", "#FFD700", "#FF0000"][index % 3]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ payload }) => {
                        if (!payload || payload.length === 0) return null;
                        const data = payload[0]
                          .payload as (typeof dataHoy.por_categoria)[0];
                        const totalEmision = data.total_energy_mwh * 0.000475;
                        return (
                          <div className="custom-tooltip bg-white p-2 rounded shadow">
                            <p>
                              <strong>Categoría:</strong> {data.category}
                            </p>
                            <p>
                              <strong>Energía Total:</strong>{" "}
                              {data.total_energy_mwh.toFixed(2)} MWh
                            </p>
                            <p>
                              <strong>Emisión:</strong>{" "}
                              {totalEmision.toFixed(4)} kg
                            </p>
                          </div>
                        );
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            {/* Fin Top Categorías por Emisión */}
          </div>
        </div>
      )}
    </div>
  );
};
