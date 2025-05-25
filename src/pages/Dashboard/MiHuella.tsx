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
import { PDFDownloadLink } from "@react-pdf/renderer";
import PDFReport from "@/components/PDFReport";
import { getFechaAyerLima, getFechaLima } from "@/lib/dateUtils";

export const MiHuella = () => {
  const { user } = useAuth();

  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  const [horaInicio, setHoraInicio] = useState<string>("00:00");
  const [horaFin, setHoraFin] = useState<string>("23:59");

  const hoy = getFechaLima();
  const ayer = getFechaAyerLima();

  const [dataFiltros, setDataFiltros] = useState<AppUsageTodayResponse>({
    resumen: {
      total_registros: 0,
      total_energy_mwh: 0,
      total_hca: 0,
    },
    registros: [],
    por_aplicacion: [],
    por_categoria: [],
  });

  const dataFiltrosRef = useRef<AppUsageTodayResponse>({
    resumen: {
      total_registros: 0,
      total_energy_mwh: 0,
      total_hca: 0,
    },
    registros: [],
    por_aplicacion: [],
    por_categoria: [],
  });

  const [loadingDatos, setLoadingDatos] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchFiltrado = async () => {
    if (!user?.id) return;

    setLoadingDatos(true);
    setError(null);

    try {
      const url = `${apiUrl}/api/time_pc/filtrado?usuario_id=${user.id}&fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}&hora_inicio=${horaInicio}&hora_fin=${horaFin}`;
      const response = await axios.get<AppUsageTodayResponse>(url);
      setDataFiltros(response.data);
      dataFiltrosRef.current = response.data;
    } catch (error) {
      console.error("Error al obtener datos filtrados:", error);
      setError("Error al cargar datos filtrados.");
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
      setDataFiltros(emptyData);
      dataFiltrosRef.current = emptyData;
    } finally {
      setLoadingDatos(false);
    }
  };

  useEffect(() => {
    const fetchEventosHoy = async () => {
      if (!user?.id) return;
      setLoadingDatos(true);
      setError(null);

      try {
        const url = `${apiUrl}/api/time_pc/filtrado?usuario_id=${user.id}`;
        const response = await axios.get<AppUsageTodayResponse>(url);
        setDataFiltros(response.data);
        dataFiltrosRef.current = response.data;
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
        setDataFiltros(emptyData);
        dataFiltrosRef.current = emptyData;
      } finally {
        setLoadingDatos(false);
      }
    };

    fetchEventosHoy();
  }, [user, apiUrl]);

  if (error) return <div className="text-center text-red-500 p-6">{error}</div>;

  if (!user?.id) {
    return (
      <div className="text-center text-red-500 mt-10">
        Usuario no autenticado.
      </div>
    );
  }

  const calcularPorcentaje = (valor: number) =>
    (valor / dataFiltros.resumen.total_energy_mwh) * 100 || 0;

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
        <button
          onClick={fetchFiltrado}
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

      {loadingDatos || dataFiltros.registros.length === 0 ? (
        <button className="bg-gray-400 text-white px-4 py-2 rounded-xl cursor-not-allowed">
          Exportar a PDF (esperando datos)
        </button>
      ) : (
        <PDFDownloadLink
          document={
            <PDFReport
              dataHoy={dataFiltros}
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

      {dataFiltros.registros.length === 0 ? (
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
                  {dataFiltros.resumen.total_energy_mwh.toFixed(4)} mWh
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
                  {dataFiltros.resumen.total_registros}
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
                  {dataFiltros.resumen.total_hca.toFixed(4)} kg
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4">Consumo </h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dataFiltros.registros}>
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
                    {dataFiltros.por_aplicacion.map((app) => {
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
                      data={dataFiltros.por_categoria}
                      dataKey="total_energy_mwh"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#82ca9d"
                      label={({ percent }) => `${(percent * 100).toFixed(2)}%`}
                    >
                      {dataFiltros.por_categoria.map((categoria, index) => (
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
                          .payload as (typeof dataFiltros.por_categoria)[0];
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
