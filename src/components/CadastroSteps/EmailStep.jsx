import { useState } from "react";
import { existUserByEmail } from "../../services/apiService";

export default function EmailStep({ onNext }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [checking, setChecking] = useState(false);

  async function handleNext() {
    if (!email) {
      setError("Por favor, informe um email.");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Por favor, informe um email válido.");
      return;
    }

    setChecking(true);
    setError(null);

    try {
      const response = await existUserByEmail(email);
      const disponivel = response.data; // seu endpoint retorna true ou false

      if (disponivel) {
        setError("Este email já está em uso.");
      } else {
        onNext(email);
      }
    } catch (err) {
      setError("Erro ao verificar email. Tente novamente.");
    } finally {
      setChecking(false);
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Informe seu email</h2>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="exemplo@dominio.com"
        className="w-full border border-gray-300 rounded-xl p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {error && (
        <p className="text-red-600 text-sm mb-3">
          {error}
        </p>
      )}

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
  )
}
