import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Wraps couple-only pages (dashboard, create invite). Guests viewing a
// /invite/:slug link never pass through this component.
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="page-loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
