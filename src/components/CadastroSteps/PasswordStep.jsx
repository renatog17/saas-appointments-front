import { useState } from "react";

export default function PasswordStep({ onNext }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  function handleNext() {
    // validações
    if (password.length < 8) {
      setError("A senha deve ter no mínimo 8 caracteres.");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError("A senha deve conter pelo menos uma letra maiúscula.");
      return;
    }

    if (!/[a-z]/.test(password)) {
      setError("A senha deve conter pelo menos uma letra minúscula.");
      return;
    }

    if (!/[0-9]/.test(password)) {
      setError("A senha deve conter pelo menos um número.");
      return;
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      setError("A senha deve conter pelo menos um caractere especial.");
      return;
    }

    setError(null);
    onNext(password);
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Crie uma senha
      </h2>

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Digite sua senha"
        className="w-full border border-gray-300 rounded-xl p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

      <button
        onClick={handleNext}
        className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
      >
        Próximo
      </button>
    </div>
  );
}
