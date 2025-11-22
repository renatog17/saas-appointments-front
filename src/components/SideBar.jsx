import { LayoutDashboard, ListOrdered, Settings, Bell } from "lucide-react";

export default function Sidebar({ activeTab, setActiveTab, setSidebarOpen }) {
  return (
    <>
      <h2 className="text-2xl font-bold text-indigo-600 mb-8">ZendaaVip</h2>

      <nav className="space-y-4 mt-4">
        <button
          onClick={() => {
            setActiveTab("dashboard");
            setSidebarOpen(false);
          }}
          className={`flex items-center gap-2 text-left w-full px-2 py-1 rounded ${
            activeTab === "dashboard"
              ? "text-indigo-600 font-semibold"
              : "text-gray-700 hover:text-indigo-600"
          } transition`}
        >
          <LayoutDashboard size={18} /> Dashboard
        </button>

        <button
          onClick={() => {
            setActiveTab("procedimentos");
            setSidebarOpen(false);
          }}
          className={`flex items-center gap-2 text-left w-full px-2 py-1 rounded ${
            activeTab === "procedimentos"
              ? "text-indigo-600 font-semibold"
              : "text-gray-700 hover:text-indigo-600"
          } transition`}
        >
          <ListOrdered size={18} /> Procedimentos
        </button>

        <button
          onClick={() => {
            setActiveTab("config");
            setSidebarOpen(false);
          }}
          className={`flex items-center gap-2 text-left w-full px-2 py-1 rounded ${
            activeTab === "config"
              ? "text-indigo-600 font-semibold"
              : "text-gray-700 hover:text-indigo-600"
          } transition`}
        >
          <Settings size={18} /> Disponibilidades
        </button>

        <button
          onClick={() => {
            setActiveTab("notificacoes");
            setSidebarOpen(false);
          }}
          className={`flex items-center gap-2 text-left w-full px-2 py-1 rounded ${
            activeTab === "notificacoes"
              ? "text-indigo-600 font-semibold"
              : "text-gray-700 hover:text-indigo-600"
          } transition`}
        >
          <Bell size={18} /> Notificações
        </button>
      </nav>
    </>
  );
}
