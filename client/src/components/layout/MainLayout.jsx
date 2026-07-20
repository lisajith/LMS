import { Outlet, useLocation } from "react-router-dom";

import Navbar from "./Navbar";
import Footer from "./Footer";

function MainLayout() {
  const location = useLocation();

  const isDashboard = location.pathname.startsWith("/dashboard");

  // Detect exam route
  const isExamMode = location.pathname.includes("/dashboard/tests/attempt/");

  return (
    <div className="min-h-screen flex flex-col bg-theme">
      {/* Hide Navbar during exam */}
      {!isExamMode && <Navbar />}

      {/* Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer only for public pages and not during exam */}
      {!isDashboard && !isExamMode && <Footer />}
    </div>
  );
}

export default MainLayout;
