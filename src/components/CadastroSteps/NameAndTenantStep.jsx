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
        setError("Este identificador já está em uso.");
      } else {
        onNext(name, tenant);
      }
    } catch (err) {
      setError("Erro ao verificar identificador. Tente novamente.");
    } finally {
      setChecking(false);
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Nome e identificador da empresa
      </h2>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Seu nome ou nome da empresa"
        className="w-full border border-gray-300 rounded-xl p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="text"
        value={tenant}
        onChange={(e) => {
          const cleanValue = e.target.value.replace(/[^a-zA-Z0-9\-]/g, "");
          setTenant(cleanValue);
        }}
        placeholder="Identificador"
        className="w-full border border-gray-300 rounded-xl p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {tenant && (
        <p className="text-gray-500 text-sm mb-3">
          Seus clientes poderão fazer agendamento em:{" "}
          <span className="font-medium text-blue-600">
            zendaavip.com.br/{tenant}
          </span>
        </p>
      )}
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
