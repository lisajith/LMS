import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-theme">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 ml-72 p-8 bg-theme min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;