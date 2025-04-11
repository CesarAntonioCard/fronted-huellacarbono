import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faCalculator,
  faSignInAlt,
  faCalendarAlt,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useState } from "react";

import { useAuth } from "../../hooks/useAuth";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-gradient-to-r from-teal-400 via-emerald-500 to-indigo-500 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <h1 className="text-3xl font-extrabold text-white">
            Huella de Carbono
          </h1>
        </div>

        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-white">
            <FontAwesomeIcon icon={faBars} className="h-6 w-6" />
          </button>
        </div>

        <div className="hidden md:flex space-x-6">
          <Link
            to="/"
            className="text-white hover:text-teal-300 font-semibold flex items-center space-x-1"
          >
            <FontAwesomeIcon icon={faHome} className="h-6 w-6" />
            <span>¿Qué es la Huella de Carbono?</span>
          </Link>
          <Link
            to="/simulador"
            className="text-white hover:text-teal-300 font-semibold flex items-center space-x-1"
          >
            <FontAwesomeIcon icon={faCalculator} className="h-6 w-6" />
            <span>Calcula tu Huella</span>
          </Link>
          <Link
            to="/eventos"
            className="text-white hover:text-teal-300 font-semibold flex items-center space-x-1"
          >
            <FontAwesomeIcon icon={faCalendarAlt} className="h-6 w-6" />
            <span>Próximos Eventos</span>
          </Link>

          {!isAuthenticated ? (
            <Link
              to="/login"
              className="text-white hover:text-teal-300 font-semibold flex items-center space-x-1"
            >
              <FontAwesomeIcon icon={faSignInAlt} className="h-6 w-6" />
              <span>Acceder</span>
            </Link>
          ) : (
            <>
              <Link
                to="/dashboard"
                className="text-white hover:text-teal-300 font-semibold flex items-center space-x-1"
              >
                <FontAwesomeIcon icon={faCalculator} className="h-6 w-6" />
                <span>Dashboard</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-white hover:text-red-300 font-semibold flex items-center space-x-1"
              >
                <FontAwesomeIcon icon={faSignInAlt} className="h-6 w-6" />
                <span>Cerrar sesión</span>
              </button>
            </>
          )}
        </div>
      </div>

      <div
        className={`${
          isOpen ? "block" : "hidden"
        } absolute left-0 top-18 w-full bg-gradient-to-r from-teal-800 via-emerald-800 to-indigo-800 p-4 md:hidden`}
      >
        <div className="flex flex-col items-center space-y-4">
          <Link
            to="/"
            className="text-white hover:text-teal-300 font-semibold flex items-center space-x-1"
          >
            <FontAwesomeIcon icon={faHome} className="h-6 w-6" />
            <span>¿Qué es la Huella de Carbono?</span>
          </Link>
          <Link
            to="/simulador"
            className="text-white hover:text-teal-300 font-semibold flex items-center space-x-1"
          >
            <FontAwesomeIcon icon={faCalculator} className="h-6 w-6" />
            <span>Calcula tu Huella</span>
          </Link>
          <Link
            to="/eventos"
            className="text-white hover:text-teal-300 font-semibold flex items-center space-x-1"
          >
            <FontAwesomeIcon icon={faCalendarAlt} className="h-6 w-6" />
            <span>Próximos Eventos</span>
          </Link>
          {!isAuthenticated ? (
            <Link
              to="/login"
              className="text-white hover:text-teal-300 font-semibold flex items-center space-x-1"
            >
              <FontAwesomeIcon icon={faSignInAlt} className="h-6 w-6" />
              <span>Acceder</span>
            </Link>
          ) : (
            <>
              <Link
                to="/dashboard"
                className="text-white hover:text-teal-300 font-semibold flex items-center space-x-1"
                onClick={toggleMenu}
              >
                <FontAwesomeIcon icon={faCalculator} className="h-6 w-6" />
                <span>Dashboard</span>
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="text-white hover:text-red-300 font-semibold flex items-center space-x-1"
              >
                <FontAwesomeIcon icon={faSignInAlt} className="h-6 w-6" />
                <span>Cerrar sesión</span>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
