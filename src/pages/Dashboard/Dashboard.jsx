import { useState } from "react";
import TenantInfo from "../../components/TenantInfo";
import Procedimento from "../../components/Procedimento";
import { LayoutDashboard, ListOrdered, Settings } from "lucide-react";
import { getTenant } from "../../services/apiService";
import { useEffect } from "react";

export default function DashBoard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTenant()
      .then((res) => {
        setTenant(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar tenant:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md border-r hidden md:flex flex-col p-6">
        <h2 className="text-2xl font-bold text-indigo-600 mb-8">Zendaavip</h2>
        <nav className="space-y-4">
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
            <Settings size={18} /> Configurações
          </button>
        </nav>
      </aside>

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800 capitalize">
            {activeTab}
          </h1>
        </div>

        {/* Conteúdo dinâmico */}
        <main className="p-6 space-y-8 overflow-y-auto flex-1">
          {loading && <p>Carregando...</p>}

          {!loading && tenant && activeTab === "dashboard" && (
            <section className="bg-white p-6 rounded-xl shadow">
              <TenantInfo nome={tenant.nome} slug={tenant.slug} />
              {/*
              Aqui o usuário poderá escolher um layout;
              Ver a foto do perfil que o usuário pode ver;
              Ver capa;
              Definir cores;
              */}
            </section>
          )}

          {!loading && tenant && activeTab === "procedimentos" && (
            <section className="bg-white p-6 rounded-xl shadow">
              <Procedimento lista={tenant.procedimentos} />
            </section>
          )}

          {activeTab === "config" && (
            <section className="bg-white p-6 rounded-xl shadow text-gray-600">
              <p>Configurações futuras aqui ⚙️</p>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
