import { JSX, useRef, useState } from "react";
import axios from "axios";
import {
  AllUsersEnergyResponse,
  UserEnergyData,
} from "@/api/updateDashboardApi";
import { getFechaAyerLima, getFechaLima } from "@/lib/dateUtils";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PDFReport from "@/components/PDFReport";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeaf, faMicrochip, faPlug } from "@fortawesome/free-solid-svg-icons";

export const Graficos = () => {
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  const [horaInicio, setHoraInicio] = useState<string>("00:00");
  const [horaFin, setHoraFin] = useState<string>("23:59");

  const hoy = getFechaLima();
  const ayer = getFechaAyerLima();

  const [selectedUser, setSelectedUser] = useState<UserEnergyData | null>(null);

  const [dataFiltros, setDataFiltros] = useState<AllUsersEnergyResponse>({
    users: [],
  });

  const dataFiltrosRef = useRef<AllUsersEnergyResponse>({
    users: [],
  });

  const [loadingDatos, setLoadingDatos] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchDatos = async (
    fechaIni: string,
    fechaFin: string,
    horaIni: string,
    horaFin: string
  ) => {
    setLoadingDatos(true);
    setError(null);

    try {
      const response = await axios.get<AllUsersEnergyResponse>(
        `${apiUrl}/api/time_pc/filtrado-todos?fecha_inicio=${fechaIni}&fecha_fin=${fechaFin}&hora_inicio=${horaIni}&hora_fin=${horaFin}`
      );

      setDataFiltros(response.data);
      dataFiltrosRef.current = response.data;
    } catch (error) {
      console.error("Error al obtener datos filtrados:", error);
      setError("No se pudieron obtener los datos");
    } finally {
      setLoadingDatos(false);
    }
  };

  const normalize = (value: number, min: number, max: number): number => {
    if (max === min) return 0;
    return (value - min) / (max - min);
  };

  const getColor = (intensity: number): string => {
    if (intensity < 0.33) return "#00cc66";
    if (intensity < 0.66) return "#ffcc00";
    return "#ff4444";
  };

  const hcaValues = dataFiltros.users.map((u) => u.resumen.total_hca);
  const minHca = Math.min(...hcaValues);
  const maxHca = Math.max(...hcaValues);

  const handleVolver = () => setSelectedUser(null);

  if (error) return <div className="text-center text-red-500 p-6">{error}</div>;

  const calcularPorcentaje = (valor: number): number => {
    const totalEnergy = selectedUser?.resumen.total_energy_mwh ?? 0;
    return totalEnergy ? (valor / totalEnergy) * 100 : 0;
  };

  let contenido: JSX.Element;

  if (loadingDatos) {
    contenido = <p className="text-gray-500">Cargando datos...</p>;
  } else if (error) {
    contenido = <p className="text-red-500">{error}</p>;
  } else if (dataFiltros.users.length === 0) {
    contenido = <p className="text-gray-500">No hay datos para mostrar 📭</p>;
  } else {
    contenido = (
      <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-15 lg:grid-cols-20 gap-0.5 mt-8">
        {dataFiltros.users.map((user) => {
          const intensidad = normalize(user.resumen.total_hca, minHca, maxHca);
          const color = getColor(intensidad);

          return (
            <button
              key={user.id}
              type="button"
              className="w-10 h-10 rounded-sm cursor-pointer shadow-sm border-0 p-0"
              style={{ backgroundColor: color }}
              title={[
                `ID: ${user.id}`,
                `Nombre: ${user.nombre_completo}`,
                `Registros: ${user.resumen.total_registros}`,
                `Energía: ${user.resumen.total_energy_mwh.toFixed(2)} mWh`,
                `HCA: ${user.resumen.total_hca.toFixed(5)} CO2`,
              ].join("\n")}
              onClick={() => setSelectedUser(user)}
            />
          );
        })}
      </div>
    );
  }

  if (selectedUser) {
    return (
      <div className="p-6">
        <button
          onClick={handleVolver}
          className="mb-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          ← Volver
        </button>

        <h1 className="text-3xl font-bold mb-6">
          Detalle de Huella - {selectedUser.nombre_completo}
        </h1>

        {loadingDatos || selectedUser.registros.length === 0 ? (
          <button className="bg-gray-400 text-white px-4 py-2 rounded-xl cursor-not-allowed">
            Exportar a PDF (esperando datos)
          </button>
        ) : (
          <PDFDownloadLink
            document={
              <PDFReport
                dataHoy={selectedUser}
                calcularPorcentaje={calcularPorcentaje}
              />
            }
            fileName="huella_carbono.pdf"
          >
            {({ loading }) => (
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl">
                {loading ? "Generando PDF..." : "Exportar a PDF"}
              </button>
            )}
          </PDFDownloadLink>
        )}

        {selectedUser.registros.length === 0 ? (
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
                    {selectedUser.resumen.total_energy_mwh.toFixed(4)} mWh
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
                    {selectedUser.resumen.total_registros}
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
                    {selectedUser.resumen.total_hca.toFixed(4)} kg
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-md mb-8">
              <h2 className="text-xl font-semibold mb-4">Consumo </h2>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={selectedUser.registros}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="start_time"
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
                        : date.toLocaleString("es-PE", {
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
                      {selectedUser.por_aplicacion.map((app) => {
                        const totalEmision = app.total_energy_mwh * 0.000475;
                        const porcentaje = calcularPorcentaje(
                          app.total_energy_mwh
                        );

                        return (
                          <tr key={app.app} className="border-t">
                            <td className="p-2">{app.app}</td>
                            <td className="p-2">
                              {totalEmision.toFixed(4)} kg
                            </td>
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
                        data={selectedUser.por_categoria}
                        dataKey="total_energy_mwh"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#82ca9d"
                        label={({ percent }) =>
                          `${(percent * 100).toFixed(2)}%`
                        }
                      >
                        {selectedUser.por_categoria.map((categoria, index) => (
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
                            .payload as (typeof selectedUser.por_categoria)[0];
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
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Mapa de Calor - Huella de Carbono Digital
      </h1>

      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <button
          onClick={() => {
            setFechaInicio(ayer);
            setFechaFin(ayer);
            setHoraInicio("00:00");
            setHoraFin("23:59");
          }}
          className="bg-gray-100 hover:bg-gray-200 text-sm px-4 py-2 rounded-xl text-black"
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
          className="appearance-none bg-white text-black border px-2 py-1 rounded-lg text-sm"
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
        <button
          onClick={() => {
            if (!fechaInicio || !fechaFin) return;
            fetchDatos(fechaInicio, fechaFin, horaInicio, horaFin);
          }}
          className={`px-4 py-2 rounded-xl text-white ${
            !fechaInicio || !fechaFin
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
          disabled={
            !fechaInicio ||
            !fechaFin ||
            new Date(fechaInicio) > new Date(fechaFin)
          }
        >
          Filtrar
        </button>
      </div>

      {contenido}

      <div className="mb-4 flex flex-col items-center gap-1 mt-5">
        <div
          className="w-full max-w-[200px] h-4 rounded border border-gray-300"
          style={{
            background: "linear-gradient(to right, #22c55e, #facc15, #ef4444)",
          }}
        ></div>

        <div className="w-full max-w-[200px] flex justify-between text-[10px] text-gray-600 px-1">
          <span>Baja huella</span>
          <span>Moderada huella</span>
          <span>Alta huella</span>
        </div>
      </div>
    </div>
  );
};
