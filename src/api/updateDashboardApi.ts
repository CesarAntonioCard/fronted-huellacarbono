export interface AppUsageEvent {
  usuario_id: number;
  app: string;
  category: string;
  startTime: string;
  endTime: string;
  duration_seconds: number;
  energy_mwh: number;
  cpu_usage: number;
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

type Callback = (event: AppUsageEvent) => void;

let socket: WebSocket | null = null;

export const connectToDashboardWebSocket = (
  onData: Callback,
  usuario_id: number
) => {
  if (socket && socket.readyState === WebSocket.OPEN) return;

  socket = new WebSocket(`${import.meta.env.VITE_WS_URL}`);

  socket.onopen = () => {
    console.log("🟢 Conectado al WebSocket");
    socket?.send(
      JSON.stringify({
        type: "handshake",
        data: { usuario_id, tipo_cliente: "pc" },
      })
    );
  };

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.type === "updateDashboard") {
      onData(message.data);
    }
  };

  socket.onerror = (err) => {
    console.error("🚨 Error WebSocket:", err);
  };

  socket.onclose = () => {
    console.warn("🔌 WebSocket cerrado");
  };
};
