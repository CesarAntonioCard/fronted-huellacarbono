export interface AppUsageEvent {
  usuario_id: number;
  app: string;
  category: "Light" | "Medium" | "Heavy";
  startTime: string;
  endTime: string;
  duration_seconds: number;
  energy_mwh: number;
  cpu_usage?: number;
  hca?: number;
  tipo?: string;
}

export interface AppEnergySummary {
  app: string;
  total_energy_mwh: number;
  total_hca: number;
  total_duracion_segundos: number;
}

export interface CategoryEnergySummary {
  category: "Light" | "Medium" | "Heavy";
  total_energy_mwh: number;
  total_hca: number;
  total_duracion_segundos: number;
}

export interface AppUsageTodayResponse {
  resumen: {
    total_registros: number;
    total_energy_mwh: number;
    total_hca: number;
  };
  registros: AppUsageEvent[];
  por_aplicacion: AppEnergySummary[];
  por_categoria: CategoryEnergySummary[];
}

export interface Top3User {
  usuario_id: number;
  nombre: string;
  total_hca: number;
}

export interface Top3UserResponse {
  top3: Top3User[];
}

export interface TodosEventosResponse {
  usuario_id: number;
  nombre_completo: string;
  total_energy: number;
  max_energy: number;
}

export type AplicacionData = {
  app: string;
  total_energy_mwh: number;
  total_duracion_segundos: number;
};

export type CategoriaData = {
  category: string;
  total_energy_mwh: number;
  total_duracion_segundos: number;
};

type WebSocketMessage =
  | { type: "updateDashboard"; data: AppUsageEvent }
  | { type: "updateDashboardToday"; data: AppUsageTodayResponse }
  | { type: "updateTop3"; data: Top3User[] };

type MessageHandlerMap = {
  updateDashboard: (data: AppUsageEvent) => void;
  updateDashboardToday: (data: AppUsageTodayResponse) => void;
  updateTop3: (data: Top3User[]) => void;
};

let socket: WebSocket | null = null;

export const connectToDashboardWebSocket = (
  handlers: Partial<MessageHandlerMap>,
  usuario_id?: number
) => {
  if (socket && socket.readyState === WebSocket.OPEN) return;

  socket = new WebSocket(`${import.meta.env.VITE_WS_URL}`);

  socket.onopen = () => {
    console.log("🟢 Conectado al WebSocket");
    socket?.send(
      JSON.stringify({
        type: "handshake",
        data: { usuario_id: usuario_id ?? null, tipo_cliente: "pc" },
      })
    );
  };

  socket.onmessage = (event) => {
    const message: WebSocketMessage = JSON.parse(event.data);

    switch (message.type) {
      case "updateDashboard":
        handlers.updateDashboard?.(message.data);
        break;
      case "updateDashboardToday":
        handlers.updateDashboardToday?.(message.data);
        break;
      case "updateTop3":
        handlers.updateTop3?.(message.data);
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
    socket = null;
  };
};

export const closeDashboardWebSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};
