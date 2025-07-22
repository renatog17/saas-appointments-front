import "./App.css";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import CadastroPage from "./pages/CadastroPage/CadastroPage";
import NegocioPage from "./pages/NegocioPage/NegocioPage";
import CadastroServicosPage from "./pages/CadastroServicosPage/CadastroServicosPage";
import PrivateRoute from "./privateroute/PrivateRoute";
import FirstAccessRoute from "./privateroute/FirstAccessRoute";
import Dashboard from "./pages/Dashboard/Dashboard"
import LoginPage from "./pages/LoginPage/LoginPage";
import AgendamentoPage from "./pages/AgendamentoPage/AgendamentoPage";
import AgendamentoSucesso from "./pages/AgendamentoPage/AgendamentoSucesso";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/cadastro" element={<CadastroPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/:slug" element={<AgendamentoPage/>} />
      <Route path="/agendamento/sucesso" element={<AgendamentoSucesso />} />

      {/* Apenas no primeiro acesso após cadastro */}
      <Route
        path="/negocio"
        element={
          <FirstAccessRoute>
            <NegocioPage />
          </FirstAccessRoute>
        }
      />
      <Route
        path="/servicos"
        element={
          <FirstAccessRoute>
            <CadastroServicosPage />
          </FirstAccessRoute>
        }
      />

      {/* Rotas normais depois da configuração */}
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
