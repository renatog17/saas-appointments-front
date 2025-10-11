import { useState, useRef } from "react";
import TenantInfo from "../../components/TenantInfo";
import Procedimento from "../../components/Procedimento";
import Disponibilidade from "../../components/Disponibilidade";
import {
  LayoutDashboard,
  ListOrdered,
  Settings,
  ChevronDown,
  LogOut,
  User,
} from "lucide-react";
import { getTenant } from "../../services/apiService";
import { useEffect } from "react";
import ProcedimentoForm from "../../components/ProcedimentoForm";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Agendamentos from "../../components/Agendamentos";
import ConfirmacaoEmail from "../../components/ConfirmacaoEmail";

export default function DashBoard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { realizarLogout } = useAuth();

  async function handleLogout() {
    try {
      const response = await realizarLogout();
      navigate("/login"); // ou rota de login
    } catch (err) {
      console.error("Erro ao fazer logout", err);
    }
  }

  async function carregarTenant() {
    try {
      setLoading(true);
      const res = await getTenant();
      setTenant(res.data);
    } catch (err) {
      console.error("Erro ao carregar tenant:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarTenant();
  }, []);
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md border-r hidden md:flex flex-col p-6">
        <h2 className="text-2xl font-bold text-indigo-600 mb-8">
          ZendaaVip + {}
        </h2>
        <nav className="space-y-4 mt-4">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-2 text-left w-full px-2 py-1 rounded 
              ${
                activeTab === "dashboard"
                  ? "text-indigo-600 font-semibold"
                  : "text-gray-700 hover:text-indigo-600"
              }
              transition`}
          >
            <LayoutDashboard size={18} /> Dashboard
          </button>

          <button
            onClick={() => setActiveTab("procedimentos")}
            className={`flex items-center gap-2 text-left w-full px-2 py-1 rounded 
              ${
                activeTab === "procedimentos"
                  ? "text-indigo-600 font-semibold"
                  : "text-gray-700 hover:text-indigo-600"
              }
              transition`}
          >
            <ListOrdered size={18} /> Procedimentos
          </button>

          <button
            onClick={() => setActiveTab("config")}
            className={`flex items-center gap-2 text-left w-full px-2 py-1 rounded 
              ${
                activeTab === "config"
                  ? "text-indigo-600 font-semibold"
                  : "text-gray-700 hover:text-indigo-600"
              }
              transition`}
          >
            <Settings size={18} /> Disponibilidades
          </button>
        </nav>
      </aside>

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="bg-white shadow px-6 py-4 flex justify-between items-center relative">
          <h1 className="text-xl font-semibold text-gray-800 capitalize">
            {activeTab}
          </h1>

          {/* Dropdown Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-indigo-600"
            >
              Meu Perfil <ChevronDown size={16} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border rounded shadow-lg z-50">
                <button
                  onClick={() => {
                    navigate("/editar-perfil");
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <User size={16} />
                  Editar Perfil
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  <LogOut size={16} />
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Conteúdo dinâmico */}
        <main className="p-6 space-y-8 overflow-y-auto flex-1">
          {loading && <p>Carregando...</p>}
          {tenant && !tenant.emailConfirmado && (
            <ConfirmacaoEmail tenantId={tenant.id} />
          )}

          {!loading && tenant && activeTab === "dashboard" && (
            <section className="bg-white p-6 rounded-xl shadow">
              <TenantInfo
                nome={tenant.nome}
                slug={tenant.slug}
                srcImg={tenant.img}
              />
              <Agendamentos tenantId={tenant.id}></Agendamentos>
            </section>
          )}

          {!loading && tenant && activeTab === "procedimentos" && (
            <section className="bg-white p-6 rounded-xl shadow">
              <Procedimento lista={tenant.procedimentos} />
              <ProcedimentoForm onCriado={carregarTenant} />
            </section>
          )}

          {activeTab === "config" && (
            <section className="bg-white p-6 rounded-xl shadow text-gray-600">
              
              <Disponibilidade lista={tenant.disponibilidades} />
              
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
