import Sidebar from "./Sidebar";
import { Outlet, useLocation } from "react-router-dom";

function DashboardLayout() {
  const location = useLocation();

  // Detect exam route
  const isExamMode = location.pathname.includes("/dashboard/tests/attempt/");

  return (
    <div className="flex min-h-screen bg-theme">
      {/* Hide Sidebar during exam */}
      {!isExamMode && <Sidebar />}

      {/* Main Content */}
      <main
        className={`

          flex-1

          bg-theme

          min-h-screen

          ${isExamMode ? "p-0 ml-0" : "lg:ml-72 p-6 lg:p-8"}

        `}
      >
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
