// src/privateroute/PublicRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
  const { authenticated, loading } = useAuth();

  if (loading) return <div>Carregando...</div>;

  if (authenticated) return <Navigate to="/dashboard" />;

  return children;
};

export default PublicRoute;
