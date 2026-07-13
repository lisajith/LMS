import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

function MainLayout() {

  const location = useLocation();

  const dashboardRoutes = [
    "/dashboard",
    "/course",
    "/notes",
    "/attendance",
    "/assignments",
    "/tests",
    "/certificates",
    "/profile",
  ];

  const isDashboard = dashboardRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">

      {!isDashboard && <Navbar />}

      <main className="grow">
        <Outlet />
      </main>

      {!isDashboard && <Footer />}

    </div>
  );
}

export default MainLayout;