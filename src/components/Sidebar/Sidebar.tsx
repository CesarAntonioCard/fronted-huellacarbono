import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faChartBar,
  faUsers,
  faUser,
  faCalendarAlt,
  faSignOutAlt,
  faBars,
  faTree,
  faClockRotateLeft,
  faLightbulb,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

const Sidebar = () => {
  const { logout, user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  const menuItems = [
    ...(user?.rol === "ADMIN"
      ? [
          { label: "Gráficos", icon: faChartBar, to: "/dashboard/graficos" },
          { label: "Roles", icon: faUsers, to: "/dashboard/roles" },
          { label: "Usuarios", icon: faUser, to: "/dashboard/usuarios" },
          { label: "Eventos", icon: faCalendarAlt, to: "/dashboard/eventos" },
        ]
      : []),
    { label: "Mi Huella", icon: faTree, to: "/dashboard/mihuella" },
    {
      label: "Historial Huella",
      icon: faClockRotateLeft,
      to: "/dashboard/historialdemihuella",
    },
    {
      label: "Recomendaciones",
      icon: faLightbulb,
      to: "/dashboard/recomendaciones",
    },
    { label: "Ranking", icon: faTrophy, to: "/dashboard/ranking" },
    { label: "Perfil", icon: faUser, to: "/dashboard/perfil" },
    { label: "Inicio", icon: faHome, to: "/" },
    { label: "Cerrar sesión", icon: faSignOutAlt, action: handleLogout },
  ];

  return (
    <div
      className={`bg-white border-r border-teal-200 h-screen p-4 flex flex-col transition-all duration-300 ${
        collapsed ? "w-15" : "w-50"
      }`}
    >
      <button
        className="mb-6 text-green-700 hover:text-green-900 focus:outline-none"
        onClick={toggleSidebar}
      >
        <FontAwesomeIcon icon={faBars} size="lg" />
      </button>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item, idx) =>
          item.action ? (
            <button
              key={idx}
              onClick={item.action}
              className="flex items-center w-full p-2 text-green-800 hover:bg-teal-100 rounded-lg transition-all"
            >
              <FontAwesomeIcon icon={item.icon} className="mr-3" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          ) : (
            <Link
              key={idx}
              to={item.to}
              className="flex items-center p-2 text-green-800 hover:bg-teal-100 rounded-lg transition-all"
            >
              <FontAwesomeIcon icon={item.icon} className="mr-3" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
