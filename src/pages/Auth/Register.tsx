import { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../api/authApi";

const Register = () => {
  const [email, setEmail] = useState("");
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formError, setFormError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const navigate = useNavigate();

  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    try {
      if (password !== confirmarPassword) {
        throw new Error("Las contraseñas no coinciden ❌");
      }

      await register(nombreCompleto, email, password);

      setIsModalOpen(true);

      setTimeout(() => {
        setIsModalOpen(false);
        navigate("/");
      }, 2000);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error en register:", error);
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
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border-4 border-transparent bg-clip-border animate-border">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-4">
            ¡Regístrate y comienza tu viaje sostenible!
          </h2>
          {formError && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center">
              {formError}
            </div>
          )}
          <form onSubmit={handleRegister}>
            <label
              htmlFor="nombreCompletto"
              className="block text-green-900 mb-2"
            >
              Nombre completo
            </label>
            <input
              type="text"
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
              value={nombreCompleto}
              onChange={(e) => setNombreCompleto(e.target.value)}
              required
              placeholder="Tu nombre completo"
            />

            <label htmlFor="email" className="block text-green-900 mb-2">
              Correo electrónico
            </label>
            <input
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
            <div className="relative mb-4">
              <input
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
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>

            <label
              htmlFor="confirmarPassword"
              className="block text-green-900 mb-2"
            >
              Confirmar contraseña
            </label>
            <div className="relative mb-6">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="w-full p-3 border border-gray-300 rounded-lg"
                value={confirmarPassword}
                onChange={(e) => setConfirmarPassword(e.target.value)}
                required
                placeholder="********"
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-600"
                onClick={toggleConfirmPassword}
              >
                <FontAwesomeIcon
                  icon={showConfirmPassword ? faEyeSlash : faEye}
                />
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold hover:bg-green-700"
            >
              Registrarse
            </button>
          </form>

          {isModalOpen && (
            <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300 ease-out">
              <div className="bg-gradient-to-r from-green-200 to-blue-300 p-8 rounded-lg shadow-2xl max-w-lg w-full transform scale-95 transition-transform duration-300 ease-out hover:scale-100">
                <div className="flex justify-between items-center">
                  <p className="text-3xl font-semibold text-black">
                    ¡Registro Exitoso! 🎉
                  </p>
                </div>
                <p className="text-black mt-4 text-lg">
                  Tu cuenta ha sido creada con éxito. Serás redirigido en breve.
                </p>
              </div>
            </div>
          )}

          <p className="text-center text-sm text-gray-700 mt-6">
            ¿Ya tienes cuenta?{" "}
            <Link
              to="/login"
              className="text-green-600 font-semibold hover:underline"
            >
              Inicia Sesion
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
