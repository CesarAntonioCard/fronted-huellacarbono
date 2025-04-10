import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { login } from "../../api/authApi";

import "./Border.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const togglePassword = () => setShowPassword(!showPassword);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      console.error("Error en login:", error);
      alert("Credenciales incorrectas ❌");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="bg-white p-5 rounded-2xl shadow-xl w-full max-w-md border-4 border-transparent bg-clip-border animate-border">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-4">
            👋 ¡Bienvenido de nuevo!
          </h2>
          <form onSubmit={handleLogin}>
            <label htmlFor="email" className="block text-green-900 mb-2">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="ejemplo@email.com"
            />

            <label htmlFor="password" className="block text-green-900 mb-2">
              Contraseña
            </label>
            <div className="relative mb-6">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="w-full p-3 border border-gray-300 rounded-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="********"
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-600"
                onClick={togglePassword}
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold hover:bg-green-700"
            >
              Iniciar Sesión 🚀
            </button>
          </form>

          <p className="text-center text-sm text-gray-700 mt-6">
            ¿No tienes cuenta?{" "}
            <Link
              to="/register"
              className="text-green-600 font-semibold hover:underline"
            >
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
