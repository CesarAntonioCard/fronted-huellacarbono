import { useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="h-screen bg-gray-50 overflow-auto relative">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="p-4 ml-10">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
