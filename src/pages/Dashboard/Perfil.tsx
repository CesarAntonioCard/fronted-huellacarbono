import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getUserByIdUser, putUserByIdUser, UpdateUserDTO } from "@/api/userApi";
import { Input } from "@/components/ui/input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faLock,
  faSave,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";

export const Perfil = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    nombre_completo: "",
    email: "",
  });

  const [originalPassword, setOriginalPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (user?.id) {
      getUserByIdUser(Number(user.id)).then((data) => {
        setFormData({
          nombre_completo: data.nombre_completo,
          email: data.email,
        });
        setOriginalPassword(data.password);
      });
    }
  }, [user?.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    try {
      if (newPassword) {
        if (newPassword === originalPassword) {
          setFormError("La nueva contraseña no puede ser igual a la actual ❌");
          return;
        }
      }

      const payload: UpdateUserDTO = {
        email: formData.email,
        nombre_completo: formData.nombre_completo,
      };

      if (newPassword) {
        payload.password = newPassword;
      }

      await putUserByIdUser(Number(user?.id), payload);

      setIsModalOpen(true);

      setTimeout(() => {
        setIsModalOpen(false);
      }, 2000);

      setNewPassword("");
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
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-xl mt-10">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        👤 Perfil de Usuario
      </h2>
      {formError && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center">
          {formError}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="relative">
          <FontAwesomeIcon
            icon={faUser}
            className="absolute left-3 top-3 text-gray-400"
          />
          <Input
            type="text"
            name="nombre_completo"
            value={formData.nombre_completo}
            onChange={handleChange}
            placeholder="Nombre completo"
            required
            className="pl-10"
          />
        </div>
        <div className="relative">
          <FontAwesomeIcon
            icon={faEnvelope}
            className="absolute left-3 top-3 text-gray-400"
          />
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Correo electrónico"
            required
            className="pl-10"
          />
        </div>
        <div className="relative">
          <FontAwesomeIcon
            icon={faLock}
            className="absolute left-3 top-3 text-gray-400"
          />
          <Input
            type={showPassword ? "text" : "password"}
            name="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Nueva contraseña (opcional)"
            className="pl-10 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-400 focus:outline-none"
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:scale-105 transition-transform duration-300 flex items-center justify-center gap-2"
        >
          <FontAwesomeIcon icon={faSave} /> Actualizar Perfil
        </button>
      </form>

      {isModalOpen && (
        <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gradient-to-r from-green-200 to-blue-300 p-8 rounded-lg shadow-2xl max-w-lg w-full transform scale-95 transition-transform duration-300 ease-out hover:scale-100">
            <div className="flex justify-between items-center">
              <p className="text-3xl font-semibold text-black">
                ¡Perfil actualizado! 🎉
              </p>
            </div>
            <p className="text-black mt-4 text-lg">
              Tu perfil ha sido actualizado con éxito.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
