import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy, faMedal, faStar } from "@fortawesome/free-solid-svg-icons";
import { useWebSocket } from "@/context/WebSocketContext";
import { Top3User, Top3UserResponse } from "@/api/updateDashboardApi";

const iconos = [faTrophy, faMedal, faStar];
const coloresFondo = ["bg-yellow-100", "bg-gray-200", "bg-orange-100"];
const coloresBorde = [
  "border-yellow-400",
  "border-gray-400",
  "border-orange-400",
];
const coloresTexto = ["text-yellow-800", "text-gray-700", "text-orange-800"];
const coloresIcono = ["text-yellow-500", "text-gray-500", "text-orange-500"];

export const Ranking = () => {
  const [top3, setTop3] = useState<Top3User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const top3Ref = useRef<Top3User[]>([]);

  const apiUrl = import.meta.env.VITE_API_URL;

  const { registerHandlers } = useWebSocket();

  useEffect(() => {
    const fetchTop3 = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get<Top3UserResponse>(
          `${apiUrl}/api/time_pc/top3`
        );
        setTop3(response.data.top3);
        top3Ref.current = response.data.top3;
      } catch (err) {
        console.error(err);
        setError("Error al cargar el ranking.");
      } finally {
        setLoading(false);
      }
    };

    fetchTop3();

    registerHandlers({
      updateTop3: (data: Top3UserResponse) => {
        setTop3(data.top3);
        top3Ref.current = data.top3;
      },
    });
  }, [apiUrl, registerHandlers]);

  if (loading)
    return (
      <div className="text-center text-gray-500 p-6">Cargando ranking...</div>
    );

  if (error) return <div className="text-center text-red-500 p-6">{error}</div>;

  if (top3.length === 0)
    return (
      <div className="text-center text-gray-500 p-6">
        No hay datos para mostrar.
      </div>
    );

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg mt-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Top 3 Usuarios
      </h2>
      <ul className="space-y-4">
        {top3.map((user, idx) => {
          const colorIndex = idx % coloresFondo.length;
          return (
            <li
              key={user.usuario_id}
              className={`flex items-center p-4 rounded-lg border-l-8 ${coloresBorde[colorIndex]} ${coloresFondo[colorIndex]} shadow-sm`}
            >
              <div className={`mr-4 text-3xl ${coloresIcono[colorIndex]}`}>
                <FontAwesomeIcon icon={iconos[colorIndex]} />
              </div>
              <div className="flex-1">
                <p className={`font-bold text-lg ${coloresTexto[colorIndex]}`}>
                  {user.nombre}
                </p>
                <p className="text-gray-600">
                  Huella: {user.total_hca.toFixed(4)}
                </p>
              </div>
              <div className="text-gray-400 font-semibold text-xl w-8 text-right">
                #{idx + 1}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
