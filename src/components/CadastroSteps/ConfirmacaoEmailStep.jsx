import { useState } from "react";
import { confirmarEmail } from "../../services/apiService";

export default function ConfirmacaoEmailStep({ login, onSuccess }) {
  const [codigo, setCodigo] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirmar = async () => {
    setLoading(true);
    setMensagem("");

    try {
      await confirmarEmail({ codigo, login });
      setMensagem("Email confirmado com sucesso!");
      onSuccess();
    } catch (error) {
      setMensagem("Código inválido ou erro ao confirmar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Confirme seu email</h2>

      <input
        type="text"
        placeholder="Digite o código recebido"
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
        className="w-full border border-gray-300 rounded-xl p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {mensagem && (
        <p className={`text-sm mb-3 ${mensagem.includes("sucesso") ? "text-green-600" : "text-red-600"}`}>
          {mensagem}
        </p>
      )}

      <button
        onClick={handleConfirmar}
        disabled={loading}
        className={`w-full py-3 rounded-xl text-white transition ${
          loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Confirmando..." : "Confirmar"}
      </button>
    </div>
  );
}
