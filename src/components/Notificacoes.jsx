import { useState } from "react";
import { updateReceberAgendaDiariaPorEmail } from "../services/apiService";

export default function Notificacoes({ tenant, onUpdated }) {
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(
    tenant?.receberAgendaDiariaPorEmail ?? false
  );
  const [mensagem, setMensagem] = useState("");

  async function handleToggle() {
    try {
      setLoading(true);
      const novoValor = !checked;

      await updateReceberAgendaDiariaPorEmail(novoValor);
      setChecked(novoValor);

      setMensagem("Configuração salva com sucesso!");

      // mantém 3 segundos na tela
      setTimeout(() => setMensagem(""), 3000);

      if (onUpdated) onUpdated();
    } catch (err) {
      console.error("Erro ao atualizar:", err);
      setMensagem("Erro ao salvar.");
      setTimeout(() => setMensagem(""), 3000);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow text-gray-700 space-y-6">
      

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">
          Receber agenda diária por e-mail
        </span>

        <button
          onClick={handleToggle}
          disabled={loading}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
            checked ? "bg-indigo-600" : "bg-gray-300"
          } ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
              checked ? "translate-x-5" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {loading && <p className="text-sm text-gray-500">Salvando...</p>}
      {mensagem && <p className="text-sm text-green-600">{mensagem}</p>}
    </div>
  );
}
