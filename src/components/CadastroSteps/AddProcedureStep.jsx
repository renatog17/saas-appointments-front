import { useState } from "react";
import { Pencil, Trash2, Plus, X } from "lucide-react";

const diasSemana = [
  { label: "Domingo", value: 0 },
  { label: "Segunda-feira", value: 1 },
  { label: "Terça-feira", value: 2 },
  { label: "Quarta-feira", value: 3 },
  { label: "Quinta-feira", value: 4 },
  { label: "Sexta-feira", value: 5 },
  { label: "Sábado", value: 6 },
];

export default function AddProcedureStep({ onNext }) {
  const [procedures, setProcedures] = useState([]);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [error, setError] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);

  // Estados para disponibilidade
  const [selectedDay, setSelectedDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [availabilityList, setAvailabilityList] = useState([]);

  /** Adiciona uma nova disponibilidade */
  function handleAddAvailability() {
    if (selectedDay === "" || !startTime || !endTime) {
      setError("Selecione o dia e os horários.");
      return;
    }

    const novaDisponibilidade = {
      dia: parseInt(selectedDay, 10), // garante que será número
      inicio: startTime,
      fim: endTime,
    };

    setAvailabilityList((prev) => [...prev, novaDisponibilidade]);

    // Limpa campos
    setSelectedDay("");
    setStartTime("");
    setEndTime("");
    setError(null);
  }

  /** Remove uma disponibilidade */
  function handleRemoveAvailability(indexToRemove) {
    setAvailabilityList((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  }

  /** Adiciona ou atualiza procedimento */
  function handleAddProcedure() {
    if (!nome || !descricao || !valor) {
      setError("Preencha todos os campos do procedimento.");
      return;
    }

    if (availabilityList.length === 0) {
      setError("Adicione pelo menos uma disponibilidade.");
      return;
    }

    const novo = {
      nome,
      descricao,
      valor: parseFloat(valor),
      disponibilidades: availabilityList,
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
    setAvailabilityList([]);
    setError(null);
  }

  /** Editar um procedimento existente */
  function handleEdit(index) {
    const proc = procedures[index];
    setNome(proc.nome);
    setDescricao(proc.descricao);
    setValor(proc.valor);
    setAvailabilityList(proc.disponibilidades);
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

  /** Helper para exibir nome do dia */
  function getDayLabel(value) {
    return diasSemana.find((dia) => dia.value === value)?.label || value;
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

      {/* Disponibilidades */}
      <div className="mb-4 p-4 border border-gray-200 rounded-xl bg-gray-50">
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          Disponibilidades
        </h3>

        <div className="flex flex-col md:flex-row gap-2">
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="border border-gray-300 rounded-xl p-2 flex-1"
          >
            <option value="">Selecione o dia</option>
            {diasSemana.map((dia) => (
              <option key={dia.value} value={dia.value}>
                {dia.label}
              </option>
            ))}
          </select>

          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="border border-gray-300 rounded-xl p-2 flex-1"
          />
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="border border-gray-300 rounded-xl p-2 flex-1"
          />

          <button
            type="button"
            onClick={handleAddAvailability}
            className="bg-green-600 text-white px-4 rounded-xl hover:bg-green-700 transition flex items-center justify-center"
          >
            <Plus size={20} />
          </button>
        </div>

        {/* Lista de disponibilidades */}
        {availabilityList.length > 0 && (
          <ul className="mt-3 space-y-2">
            {availabilityList.map((disp, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-white border border-gray-200 p-2 rounded-xl"
              >
                <span>
                  {getDayLabel(disp.dia)} ({disp.dia}): {disp.inicio} - {disp.fim}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveAvailability(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X size={18} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

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
                    <ul className="mt-2 space-y-1 text-sm">
                      {proc.disponibilidades.map((disp, i) => (
                        <li key={i}>
                          {getDayLabel(disp.dia)} ({disp.dia}): {disp.inicio} - {disp.fim}
                        </li>
                      ))}
                    </ul>
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
        Finalizar cadastro
      </button>
    </div>
  );
}
