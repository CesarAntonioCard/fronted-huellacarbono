import { createContext, useContext, useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";
import {
  AppUsageEvent,
  AppUsageTodayResponse,
  Top3UserResponse,
} from "@/api/updateDashboardApi";

type WebSocketMessage =
  | { type: "updateDashboard"; data: AppUsageEvent }
  | { type: "updateDashboardToday"; data: AppUsageTodayResponse }
  | { type: "updateTop3"; data: Top3UserResponse };

type MessageHandlerMap = {
  updateDashboard?: (data: AppUsageEvent) => void;
  updateDashboardToday?: (data: AppUsageTodayResponse) => void;
  updateTop3?: (data: Top3UserResponse) => void;
};

type WebSocketContextType = {
  registerHandlers: (handlers: Partial<MessageHandlerMap>) => void;
};

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const socketRef = useRef<WebSocket | null>(null);
  const handlersRef = useRef<Partial<MessageHandlerMap>>({});

  useEffect(() => {
    if (!user) return;

    const socket = new WebSocket(import.meta.env.VITE_WS_URL);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("🟢 WebSocket conectado");
      socket.send(
        JSON.stringify({
          type: "handshake",
          data: {
            usuario_id: Number(user.id),
            tipo_cliente: "pc",
          },
        })
      );
    };

    socket.onmessage = (event) => {
      const message: WebSocketMessage = JSON.parse(event.data);

      switch (message.type) {
        case "updateDashboard":
          handlersRef.current.updateDashboard?.(message.data);
          break;
        case "updateDashboardToday":
          handlersRef.current.updateDashboardToday?.(message.data);
          break;
        case "updateTop3":
          handlersRef.current.updateTop3?.(message.data);
          break;
        default:
          console.warn("📬 Tipo de mensaje no manejado:", message);
      }
    };

    socket.onerror = (err) => {
      console.error("🚨 Error WebSocket:", err);
    };

    socket.onclose = () => {
      console.warn("🔌 WebSocket cerrado");
      socketRef.current = null;
    };

    return () => {
      socket.close();
    };
  }, [user]);

  const registerHandlers = (newHandlers: Partial<MessageHandlerMap>) => {
    handlersRef.current = {
      ...handlersRef.current,
      ...newHandlers,
    };
  };

  return (
    <WebSocketContext.Provider value={{ registerHandlers }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket debe usarse dentro de WebSocketProvider");
  }
  return context;
};
