import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

export default function DisponibilidadeStep({ onNext }) {
  const [disponibilidades, setDisponibilidades] = useState([]);
  const [dia, setDia] = useState("");
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");
  const [error, setError] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);

  /** Adiciona ou atualiza disponibilidade */
  function handleAddDisponibilidade() {
    if (!dia || !inicio || !fim) {
      setError("Preencha todos os campos da disponibilidade.");
      return;
    }

    const novo = { dia, inicio, fim };

    if (editingIndex !== null) {
      setDisponibilidades(prev =>
        prev.map((disp, index) => index === editingIndex ? novo : disp)
      );
      setEditingIndex(null);
    } else {
      setDisponibilidades(prev => [...prev, novo]);
    }

    // Limpa campos
    setDia("");
    setInicio("");
    setFim("");
    setError(null);
  }

  /** Editar uma disponibilidade existente */
  function handleEdit(index) {
    const disp = disponibilidades[index];
    setDia(disp.dia);
    setInicio(disp.inicio);
    setFim(disp.fim);
    setEditingIndex(index);
  }

  /** Remover disponibilidade */
  function handleRemove(indexToRemove) {
    setDisponibilidades(prev => prev.filter((_, index) => index !== indexToRemove));
  }

  /** Finalizar cadastro */
  function handleFinish() {
    if (disponibilidades.length === 0) {
      setError("Adicione pelo menos uma disponibilidade.");
      return;
    }

    onNext(disponibilidades);
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Disponibilidades</h2>

      {/* Campos do formulário */}
      <input
        type="number"
        placeholder="Dia da semana (1-7)"
        value={dia}
        onChange={(e) => setDia(e.target.value)}
        className="w-full border border-gray-300 rounded-xl p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="time"
        placeholder="Início"
        value={inicio}
        onChange={(e) => setInicio(e.target.value)}
        className="w-full border border-gray-300 rounded-xl p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="time"
        placeholder="Fim"
        value={fim}
        onChange={(e) => setFim(e.target.value)}
        className="w-full border border-gray-300 rounded-xl p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

      <button
        onClick={handleAddDisponibilidade}
        className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition mb-6"
      >
        Adicionar disponibilidade
      </button>

      {/* Lista de disponibilidades */}
      {disponibilidades.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Disponibilidades adicionadas:
          </h3>
          <ul className="space-y-2 max-h-60 overflow-y-auto">
            {disponibilidades.map((disp, index) => (
              <li
                key={index}
                className="border border-gray-200 p-3 rounded-xl bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">Dia: {disp.dia}</p>
                    <p className="text-sm text-gray-600">Início: {disp.inicio}</p>
                    <p className="text-sm text-gray-600">Fim: {disp.fim}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(index)}
                      className="p-2 rounded-full hover:bg-gray-200 text-gray-600 transition"
                      title="Editar disponibilidade"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => handleRemove(index)}
                      className="p-2 rounded-full hover:bg-gray-200 text-gray-600 transition"
                      title="Excluir disponibilidade"
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
        Finalizar cadastro
      </button>
    </div>
  );
}
