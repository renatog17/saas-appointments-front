import "./App.css";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import CadastroPage from "./pages/CadastroPage/CadastroPage";
import PrivateRoute from "./privateroute/PrivateRoute";
import PublicRoute from "./privateroute/PublicRoute";
import Dashboard from "./pages/Dashboard/Dashboard";
import LoginPage from "./pages/LoginPage/LoginPage";
import AgendamentoPage from "./pages/AgendamentoPage/AgendamentoPage";
import AgendamentoSucesso from "./pages/AgendamentoPage/AgendamentoSucesso";
import ForgetPasswordPage from "./pages/ForgetPasswordPage/ForgetPasswordPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/cadastro"
        element={
          <PublicRoute>
            <CadastroPage />
          </PublicRoute>
        }
      />
      {/* Protege a rota /login para não permitir acesso de usuários já autenticados */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/forgetpassword"
        element={<PublicRoute>
          <ForgetPasswordPage />
        </PublicRoute>}
      />

      <Route path="/:slug" element={<AgendamentoPage />} />
      <Route path="/agendamento/sucesso" element={<AgendamentoSucesso />} />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
