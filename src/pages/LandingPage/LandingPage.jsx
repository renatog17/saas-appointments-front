import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
      {/* Cabeçalho */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">Zendaa</h1>

        <div className="flex gap-2">
          <Link
            to="/login"
            className="bg-white text-indigo-600 border border-indigo-600 px-4 py-2 rounded hover:bg-indigo-100 transition"
          >
            Entrar
          </Link>
          <Link
            to="/cadastro"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
          >
            Cadastre-se
          </Link>
        </div>
      </header>

      {/* Hero / Slogan */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <h2 className="text-4xl font-extrabold mb-4">
          A solução ideal para o seu negócio
        </h2>
        <p className="text-lg mb-6 max-w-xl">
          Agendamentos simples e rápidos para você focar no que realmente
          importa.
        </p>
        <Link
          to="/cadastro"
          className="bg-indigo-600 text-white px-6 py-3 rounded text-lg hover:bg-indigo-700 transition"
        >
          Comece agora
        </Link>
      </section>

      {/* Benefícios */}
      <section className="bg-white py-12 px-4 text-center">
        <h3 className="text-2xl font-semibold mb-6">
          Por que escolher o Appoint?
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <div className="bg-gray-100 p-6 rounded shadow">
            ✅ Agendamento 24h
          </div>
          <div className="bg-gray-100 p-6 rounded shadow">
            ✅ Notificações por WhatsApp
          </div>
          <div className="bg-gray-100 p-6 rounded shadow">
            ✅ Painel intuitivo
          </div>
          <div className="bg-gray-100 p-6 rounded shadow">
            ✅ Ideal para pequenos negócios
          </div>
        </div>
      </section>

      {/* Planos */}
      <section className="bg-gray-100 py-12 px-4 text-center">
        <h3 className="text-2xl font-semibold mb-8">
          Planos para você crescer
        </h3>
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded shadow w-64">
            <h4 className="text-xl font-bold mb-2">Solo</h4>
            <p className="mb-2">1 profissional</p>
            <p className="text-indigo-600 text-2xl font-bold mb-4">R$ 19/mês</p>
            <Link
              to="/cadastro"
              className="block bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
            >
              Selecionar
            </Link>
          </div>

          <div className="bg-white p-6 rounded shadow w-64 border-2 border-indigo-600">
            <h4 className="text-xl font-bold mb-2">Equipe</h4>
            <p className="mb-2">2 a 5 profissionais</p>
            <p className="text-indigo-600 text-2xl font-bold mb-4">R$ 49/mês</p>
            <Link
              to="/cadastro"
              className="block bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
            >
              Selecionar
            </Link>
          </div>

          <div className="bg-white p-6 rounded shadow w-64">
            <h4 className="text-xl font-bold mb-2">Profissional+</h4>
            <p className="mb-2">2 profissionais</p>
            <p className="text-indigo-600 text-2xl font-bold mb-4">R$ 29/mês</p>
            <Link
              to="/cadastro"
              className="block bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
            >
              Selecionar
            </Link>
          </div>
        </div>
      </section>

      {/* Depoimentos (opcional) */}
      <section className="py-12 px-4 text-center">
        <h3 className="text-2xl font-semibold mb-6">
          O que dizem nossos clientes
        </h3>
        <div className="max-w-3xl mx-auto space-y-4">
          <blockquote className="italic">
            “Nunca mais perdi um agendamento! Simples e eficaz.” — Ana,
            cabeleireira
          </blockquote>
          <blockquote className="italic">
            “Facilitou muito o dia a dia do meu consultório.” — Dr. Marcos
          </blockquote>
        </div>
      </section>

      {/* Rodapé */}
      <footer className="bg-white p-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Appoint. Todos os direitos reservados.
      </footer>
    </div>
  );
}
export default LandingPage;
