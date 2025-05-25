// 🧱 Datos base de eventos individuales
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

// 📊 Resumen por aplicación
export interface AppEnergySummary {
  app: string;
  total_energy_mwh: number;
  total_hca: number;
  total_duracion_segundos: number;
}

// 📊 Resumen por categoría
export interface CategoryEnergySummary {
  category: "Light" | "Medium" | "Heavy";
  total_energy_mwh: number;
  total_hca: number;
  total_duracion_segundos: number;
}

// ✅ Respuesta para uso diario (usuario único)
export interface UserEnergyResumen {
  total_registros: number;
  total_energy_mwh: number;
  total_hca: number;
}

export interface AppUsageTodayResponse {
  resumen: UserEnergyResumen;
  registros: AppUsageEvent[];
  por_aplicacion: AppEnergySummary[];
  por_categoria: CategoryEnergySummary[];
}

// 🏆 Top 3 usuarios por HCA
export interface Top3User {
  usuario_id: number;
  nombre: string;
  total_hca: number;
}

export interface Top3UserResponse {
  top3: Top3User[];
}

// 👥 Resumen por usuario (uso de todos los usuarios)
export interface UserEnergyData {
  id: number;
  nombre_completo: string;
  registros: AppUsageEvent[];
  resumen: UserEnergyResumen;
  por_aplicacion: AppEnergySummary[];
  por_categoria: CategoryEnergySummary[];
}

export interface AllUsersEnergyResponse {
  users: UserEnergyData[];
}
