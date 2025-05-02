import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { login as loginApi } from "../../api/authApi";
import { useAuth } from "../../hooks/useAuth";

import "./Border.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetPassword, setResetPassword] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const togglePassword = () => setShowPassword(!showPassword);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    try {
      const response = await loginApi(email, password);
      login(response.user);
      navigate("/");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error en login:", error);
      setFormError(error.message ?? "Error desconocido");
      setTimeout(() => {
        setFormError("");
      }, 2000);
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
          {formError && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center">
              {formError}
            </div>
          )}
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
            {/* <button
              className="text-sm text-green-700 underline cursor-pointer text-right mb-4"
              onClick={() => setIsModalOpen(true)}
            >
              ¿Olvidaste tu contraseña?
            </button> */}

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
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-r from-green-200 to-blue-300 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h3 className="text-xl font-semibold text-center text-green-800 mb-4">
              Restablecer contraseña
            </h3>

            <label className="block mb-2 text-sm text-green-900">
              Correo electrónico
            </label>
            <input
              type="email"
              className="w-full p-2 mb-4 border border-gray-300 rounded"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              placeholder="ejemplo@email.com"
            />

            <label className="block mb-2 text-sm text-green-900">
              Nueva contraseña
            </label>
            <input
              type="password"
              className="w-full p-2 mb-4 border border-gray-300 rounded"
              value={resetPassword}
              onChange={(e) => setResetPassword(e.target.value)}
              placeholder="********"
            />

            <div className="flex justify-between">
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-sm text-gray-600 hover:underline"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  console.log(
                    "Correo:",
                    resetEmail,
                    "Nueva contraseña:",
                    resetPassword
                  );
                  setIsModalOpen(false);
                }}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
              >
                Restablecer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
