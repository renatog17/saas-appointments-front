import { useState } from "react";
import { criarProcedimentos } from "../services/apiService";

function ProcedimentoForm({ onCriado }) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Monta o objeto no formato esperado pelo backend
    const novoProcedimento = {
      nome,
      descricao,
      valor: parseFloat(valor)
    };

    try {
      // O backend espera uma lista (array) de procedimentos
      await criarProcedimentos([novoProcedimento]);
      setSuccess("Procedimento criado com sucesso!");
      // Limpa campos
      setNome("");
      setDescricao("");
      setValor("");
      if (onCriado) onCriado();
    } catch (err) {
      console.error(err);
      setError("Erro ao criar procedimento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <label className="block font-semibold">Nome</label>
        <input
          type="text"
          value={nome}
          onChange={e => setNome(e.target.value)}
          required
          minLength={2}
          maxLength={100}
          className="w-full border rounded px-2 py-1"
        />
      </div>

      <div>
        <label className="block font-semibold">Descrição</label>
        <textarea
          value={descricao}
          onChange={e => setDescricao(e.target.value)}
          required
          maxLength={255}
          className="w-full border rounded px-2 py-1"
        />
      </div>

      <div>
        <label className="block font-semibold">Valor (R$)</label>
        <input
          type="number"
          step="0.01"
          value={valor}
          onChange={e => setValor(e.target.value)}
          required
          min="0.01"
          className="w-full border rounded px-2 py-1"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        {loading ? "Salvando..." : "Salvar Procedimento"}
      </button>

      {error && <p className="text-red-600 mt-2">{error}</p>}
      {success && <p className="text-green-600 mt-2">{success}</p>}
    </form>
  );
}

export default ProcedimentoForm;
