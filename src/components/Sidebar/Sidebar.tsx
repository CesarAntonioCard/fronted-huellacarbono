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
  faUserCog,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar = ({ collapsed, setCollapsed }: SidebarProps) => {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  const handleItemClick = () => {
    setCollapsed(true);
  };

  const menuItems = [
    ...(user?.rol === "ADMIN"
      ? [{ label: "Gráficos", icon: faChartBar, to: "/dashboard/graficos" }]
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
    ...(user?.rol === "ADMIN"
      ? [
          { label: "Roles", icon: faUserCog, to: "/dashboard/roles" },
          { label: "Usuarios", icon: faUsers, to: "/dashboard/usuarios" },
          { label: "Eventos", icon: faCalendarAlt, to: "/dashboard/eventos" },
        ]
      : []),

    { label: "Perfil", icon: faUser, to: "/dashboard/perfil" },
    { label: "Inicio", icon: faHome, to: "/" },
    { label: "Cerrar sesión", icon: faSignOutAlt, action: handleLogout },
  ];

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-white border-r border-teal-200 p-4 flex flex-col transition-all duration-300 z-50 ${
        collapsed ? "w-16" : "w-48"
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
              onClick={() => {
                item.action?.();
                handleItemClick();
              }}
              className="flex items-center w-full p-2 text-green-800 hover:bg-teal-100 rounded-lg transition-all"
            >
              <FontAwesomeIcon icon={item.icon} className="mr-3" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          ) : (
            <Link
              key={idx}
              to={item.to}
              onClick={handleItemClick}
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
