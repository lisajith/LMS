import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function PublicRoute({ children }) {

  const { user, loading } = useAuth();

  if (loading) {
    return (
      <h1 className="text-center mt-20">
        Loading...
      </h1>
    );
  }

  // Only verified users are redirected
  if (user && user.emailVerified) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default PublicRoute;