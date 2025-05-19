import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import {
  AppEnergySummary,
  AppUsageTodayResponse,
  connectToDashboardWebSocket,
} from "@/api/updateDashboardApi";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationCircle,
  faExclamationTriangle,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

const iconos = [
  faExclamationCircle,
  faExclamationTriangle,
  faExclamationTriangle,
  faExclamationTriangle,
  faCheckCircle,
];

const coloresFondo = [
  "bg-red-50",
  "bg-yellow-50",
  "bg-yellow-50",
  "bg-yellow-50",
  "bg-green-50",
];

const coloresBorde = [
  "border-red-400",
  "border-yellow-400",
  "border-yellow-400",
  "border-yellow-400",
  "border-green-400",
];

const coloresTexto = [
  "text-red-900",
  "text-yellow-900",
  "text-yellow-900",
  "text-yellow-900",
  "text-green-900",
];

const coloresIcono = [
  "text-red-500",
  "text-yellow-500",
  "text-yellow-500",
  "text-yellow-500",
  "text-green-500",
];

const PLANTILLAS_RECOMENDACION = [
  "Estás usando mucho {app}. Considera tomar un descanso.",
  "¿Necesitas tener {app} abierto tanto tiempo? Puedes cerrarlo un rato para ahorrar energía.",
  "El uso de {app} representa una parte importante de tu huella hoy.",
  "Quizás podrías alternar entre {app} y otra herramienta más ligera.",
  "Tanta actividad en {app} puede estar afectando tu eficiencia energética.",
  "Reducir el uso de {app} puede mejorar el rendimiento de tu equipo.",
  "¿Has pensado en cerrar {app} cuando no lo uses para ahorrar energía?",
  "Optimizar el tiempo con {app} puede ayudarte a ser más eficiente.",
  "Alternar entre aplicaciones menos demandantes puede ser beneficioso.",
  "Cada minuto con {app} cuenta para tu consumo energético total.",
];

function generarMensaje(app: string): string {
  const index = Math.floor(Math.random() * PLANTILLAS_RECOMENDACION.length);
  return PLANTILLAS_RECOMENDACION[index].replace("{app}", app);
}

export const Recomendaciones = () => {
  const { user } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [recomendaciones, setRecomendaciones] = useState<
    { app: string; mensaje: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const appsRef = useRef<AppEnergySummary[]>([]);
  const dataHoyRef = useRef<AppUsageTodayResponse | null>(null);

  const actualizarRecomendaciones = (apps: AppEnergySummary[]) => {
    const topApps = [...apps]
      .sort((a, b) => b.total_energy_mwh - a.total_energy_mwh)
      .slice(0, 5);

    const nuevas = topApps.map((appData) => ({
      app: appData.app,
      mensaje: generarMensaje(appData.app),
    }));

    setRecomendaciones(nuevas);
  };

  const fetchEventosHoy = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const url = `${apiUrl}/api/time_pc/hoy?usuario_id=${user.id}`;
      const response = await axios.get<AppUsageTodayResponse>(url);
      const dataHoy = response.data;

      if (!dataHoy?.por_aplicacion?.length) {
        setRecomendaciones([]);
        appsRef.current = [];
        dataHoyRef.current = null;
        return;
      }

      appsRef.current = dataHoy.por_aplicacion;
      dataHoyRef.current = dataHoy;
      actualizarRecomendaciones(appsRef.current);
    } catch (error) {
      console.error("Error al obtener recomendaciones:", error);
      setRecomendaciones([]);
      dataHoyRef.current = null;
    } finally {
      setLoading(false);
    }
  }, [user?.id, apiUrl]);

  useEffect(() => {
    if (!user?.id) return;

    fetchEventosHoy();

    const userIdNumber = Number(user.id);

    connectToDashboardWebSocket(
      {
        updateDashboardToday: (newData: AppUsageTodayResponse) => {
          dataHoyRef.current = newData;
          appsRef.current = newData.por_aplicacion || [];
          actualizarRecomendaciones(appsRef.current);
        },
      },
      userIdNumber
    );
  }, [user, fetchEventosHoy]);

  if (!user?.id) {
    return (
      <div className="text-center text-red-500 mt-10">
        Usuario no autenticado.
      </div>
    );
  }

  let contenido;

  if (loading) {
    contenido = <p className="text-gray-500">Cargando recomendaciones...</p>;
  } else if (recomendaciones.length === 0) {
    contenido = <p className="text-gray-500">No hay recomendaciones aún.</p>;
  } else {
    contenido = (
      <ul className="space-y-4">
        {recomendaciones.map((item, idx) => {
          const colorIndex = idx % coloresFondo.length;
          return (
            <li
              key={`${item.app}-${idx}`}
              className={`w-[100%] ${coloresFondo[colorIndex]} border-l-4 ${coloresBorde[colorIndex]} ${coloresTexto[colorIndex]} rounded-xl shadow-md flex items-start p-4`}
            >
              <div className={`text-2xl mr-4 ${coloresIcono[colorIndex]}`}>
                <FontAwesomeIcon icon={iconos[colorIndex]} />
              </div>
              <div className="flex flex-col justify-center">
                <p className="font-medium">{item.mensaje}</p>
                <small className="text-sm opacity-70">App: {item.app}</small>
              </div>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <div className="p-4 bg-white rounded-2xl shadow-md mt-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Recomendaciones</h2>
      {contenido}
    </div>
  );
};
