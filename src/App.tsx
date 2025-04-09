import { Routes, Route } from "react-router-dom";

import Inicio from "./pages/Inicio";
import Simulador from "./pages/Simulador";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/simulador" element={<Simulador />} />
    </Routes>
  );
}

export default App;
