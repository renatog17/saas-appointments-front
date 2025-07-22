import { useState } from "react";

export default function PasswordStep({ onNext }) {
  const [password, setPassword] = useState("");

  function handleNext() {
    onNext(password);
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Crie uma senha</h2>

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Digite sua senha"
        className="w-full border border-gray-300 rounded-xl p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        onClick={handleNext}
        className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
      >
        Próximo
      </button>
    </div>
  );
}
