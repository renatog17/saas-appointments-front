import { useState } from "react";
import { existTenantBySlug } from "../../services/apiService";

export default function NameAndTenantStep({ onNext }) {
  const [name, setName] = useState("");
  const [tenant, setTenant] = useState("");
  const [error, setError] = useState(null);
  const [checking, setChecking] = useState(false);

  async function handleNext() {
    if (!name || !tenant) {
      setError("Preencha todos os campos.");
      return;
    }

    setChecking(true);
    setError(null);

    try {
      const response = await existTenantBySlug(tenant);
      const disponivel = response.data;

      if (disponivel) {
        setError("Este slug já está em uso.");
      } else {
        onNext(name, tenant);
      }
    } catch (err) {
      setError("Erro ao verificar slug. Tente novamente.");
    } finally {
      setChecking(false);
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Nome e slug da empresa
      </h2>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Seu nome"
        className="w-full border border-gray-300 rounded-xl p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="text"
        value={tenant}
        onChange={(e) => {
         const cleanValue = e.target.value.replace(/[^a-zA-Z0-9\-]/g, "");
         setTenant(cleanValue)}
        }
        placeholder="Nome da empresa (slug)"
        className="w-full border border-gray-300 rounded-xl p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

      <button
        onClick={handleNext}
        disabled={checking}
        className={`w-full py-3 rounded-xl text-white transition ${
          checking
            ? "bg-blue-300 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {checking ? "Verificando..." : "Próximo"}
      </button>
    </div>
  );
}
