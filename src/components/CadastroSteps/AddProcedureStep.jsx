import { useState } from "react";
import { Pencil, Trash2} from "lucide-react";

export default function AddProcedureStep({ onNext }) {
  const [procedures, setProcedures] = useState([]);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [error, setError] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);


  /** Adiciona ou atualiza procedimento */
  function handleAddProcedure() {
    if (!nome || !descricao || !valor) {
      setError("Preencha todos os campos do procedimento.");
      return;
    }

    const novo = {
      nome,
      descricao,
      valor: parseFloat(valor),
    };

    if (editingIndex !== null) {
      setProcedures((prev) =>
        prev.map((proc, index) => (index === editingIndex ? novo : proc))
      );
      setEditingIndex(null);
    } else {
      setProcedures((prev) => [...prev, novo]);
    }

    // Limpa campos
    setNome("");
    setDescricao("");
    setValor("");
    setError(null);
  }

  /** Editar um procedimento existente */
  function handleEdit(index) {
    const proc = procedures[index];
    setNome(proc.nome);
    setDescricao(proc.descricao);
    setValor(proc.valor);
    setEditingIndex(index);
  }

  /** Finalizar cadastro */
  function handleFinish() {
    if (procedures.length === 0) {
      setError("Adicione pelo menos um procedimento.");
      return;
    }

    onNext(procedures);
  }

  /** Remover procedimento */
  function handleRemoveProcedure(indexToRemove) {
    setProcedures((prev) => prev.filter((_, index) => index !== indexToRemove));
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Procedimentos</h2>

      {/* Campos do procedimento */}
      <input
        type="text"
        placeholder="Nome do procedimento"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        className="w-full border border-gray-300 rounded-xl p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <textarea
        placeholder="Descrição"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        className="w-full border border-gray-300 rounded-xl p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={3}
      />

      <input
        type="number"
        placeholder="Valor (R$)"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        className="w-full border border-gray-300 rounded-xl p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />


      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

      <button
        onClick={handleAddProcedure}
        className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition mb-6"
      >
        Adicionar procedimento
      </button>

      {/* Lista de procedimentos */}
      {procedures.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Procedimentos adicionados:
          </h3>
          <ul className="space-y-2 max-h-60 overflow-y-auto">
            {procedures.map((proc, index) => (
              <li
                key={index}
                className="border border-gray-200 p-3 rounded-xl bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{proc.nome}</p>
                    <p className="text-sm text-gray-600">{proc.descricao}</p>
                    <p className="text-sm text-gray-800">
                      R$ {proc.valor.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(index)}
                      className="p-2 rounded-full hover:bg-gray-200 text-gray-600 transition"
                      title="Editar procedimento"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => handleRemoveProcedure(index)}
                      className="p-2 rounded-full hover:bg-gray-200 text-gray-600 transition"
                      title="Excluir procedimento"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={handleFinish}
        className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
      >
        Próxima Etapa
      </button>
    </div>
  );
}
