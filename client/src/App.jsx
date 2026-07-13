import Navbar from "./components/layout/Footer";
import AppRoutes from "./routes/AppRoutes";
import { useLocation } from "react-router-dom";

function App() {

  const location = useLocation();

  const dashboardRoutes = [
    "/dashboard",
    "/notes",
    "/attendance",
    "/assignments",
    "/tests",
    "/certificates",
    "/profile",
  ];

  const isDashboard = dashboardRoutes.includes(location.pathname);

  return (
    <AppRoutes />
  );
}

export default App;
