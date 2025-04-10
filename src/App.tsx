import { Routes, Route } from "react-router-dom";

import Inicio from "./pages/Inicio";
import Simulador from "./pages/Simulador";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/simulador" element={<Simulador />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
