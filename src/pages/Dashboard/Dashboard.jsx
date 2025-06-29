import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isFirstLogin");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-indigo-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Painel do Usuário</h1>
        <button
          onClick={handleLogout}
          className="bg-white text-indigo-600 px-4 py-2 rounded hover:bg-gray-100 transition"
        >
          Logout
        </button>
      </header>

      <main className="flex-grow p-6 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Bem-vindo ao Dashboard!</h2>
        <p className="mb-6 text-gray-700">
          Aqui será o DashBoard bem bonito com opções de cadastro, serviços, frequências e blá blá blás.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded shadow hover:shadow-lg transition cursor-pointer">
            <h3 className="text-lg font-bold mb-2">Cadastro</h3>
            <p className="text-gray-600">Gerencie seus cadastros aqui.</p>
          </div>
          <div className="bg-white p-6 rounded shadow hover:shadow-lg transition cursor-pointer">
            <h3 className="text-lg font-bold mb-2">Serviços</h3>
            <p className="text-gray-600">Adicione e edite seus serviços.</p>
          </div>
          <div className="bg-white p-6 rounded shadow hover:shadow-lg transition cursor-pointer">
            <h3 className="text-lg font-bold mb-2">Frequências</h3>
            <p className="text-gray-600">Controle de frequências dos clientes.</p>
          </div>
          <div className="bg-white p-6 rounded shadow hover:shadow-lg transition cursor-pointer">
            <h3 className="text-lg font-bold mb-2">Mais opções</h3>
            <p className="text-gray-600">E muito mais funcionalidades!</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
