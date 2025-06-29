import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // Redireciona para a landing page se não estiver logado
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
