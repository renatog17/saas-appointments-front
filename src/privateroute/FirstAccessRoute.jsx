// src/components/FirstAccessRoute.jsx
import { Navigate } from "react-router-dom";

const FirstAccessRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const isFirstLogin = localStorage.getItem("isFirstLogin");

  if (!token || isFirstLogin !== "true") {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default FirstAccessRoute;
