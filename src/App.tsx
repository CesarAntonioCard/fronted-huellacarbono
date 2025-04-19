import { Routes, Route } from "react-router-dom";

import Inicio from "./pages/Inicio";
import Simulador from "./pages/Simulador";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Eventos from "./pages/Eventos";
import Dashboard from "./pages/Dashboard";
import { Graficos } from "./pages/Dashboard/Graficos";
import { Roles } from "./pages/Dashboard/Roles";
import { Usuarios } from "./pages/Dashboard/Usuarios";
import { MiHuella } from "./pages/Dashboard/MiHuella";
import { Events } from "./pages/Dashboard/Events";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/simulador" element={<Simulador />} />
      <Route path="/eventos" element={<Eventos />} />

      <Route path="/dashboard" element={<Dashboard />}>
        <Route path="graficos" element={<Graficos />} />
        <Route path="roles" element={<Roles />} />
        <Route path="usuarios" element={<Usuarios />} />
        <Route path="eventos" element={<Events />} />
        <Route path="mihuella" element={<MiHuella />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
