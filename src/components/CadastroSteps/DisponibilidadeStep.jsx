import { useState } from "react";
import { Trash2 } from "lucide-react";

const diasDaSemana = [
  { label: "Domingo", value: 0 },
  { label: "Segunda-feira", value: 1 },
  { label: "Terça-feira", value: 2 },
  { label: "Quarta-feira", value: 3 },
  { label: "Quinta-feira", value: 4 },
  { label: "Sexta-feira", value: 5 },
  { label: "Sábado", value: 6 },
];

const horas = Array.from({ length: 24 }, (_, i) => {
  const h = i.toString().padStart(2, "0");
  return `${h}:00`;
});

export default function DisponibilidadeStep({ onNext }) {
  const [diasSelecionados, setDiasSelecionados] = useState({});
  const [horarioGlobal, setHorarioGlobal] = useState({ inicio: "", fim: "" });
  const [error, setError] = useState(null);

  /** Marca/desmarca um dia */
  function toggleDia(dia) {
    setDiasSelecionados((prev) => {
      const atualizado = { ...prev };
      if (atualizado[dia]) {
        delete atualizado[dia];
      } else {
        atualizado[dia] = { inicio: horarioGlobal.inicio, fim: horarioGlobal.fim };
      }
      return atualizado;
    });
  }

  /** Atualiza horário de um dia específico */
  function updateHorarioDia(dia, field, value) {
    setDiasSelecionados((prev) => ({
      ...prev,
      [dia]: { ...prev[dia], [field]: value },
    }));
  }

  /** Atualiza horário global */
  function updateHorarioGlobal(field, value) {
    setHorarioGlobal((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Propaga para todos os dias já selecionados
    setDiasSelecionados((prev) => {
      const atualizado = { ...prev };
      Object.keys(atualizado).forEach((dia) => {
        atualizado[dia][field] = value;
      });
      return atualizado;
    });
  }

  /** Finaliza cadastro */
  function handleFinish() {
    const diasFinal = Object.entries(diasSelecionados)
      .map(([dia, horarios]) => ({
        dia: Number(dia),
        inicio: horarios.inicio,
        fim: horarios.fim,
      }));

    if (diasFinal.length === 0) {
      setError("Selecione pelo menos um dia e defina os horários.");
      return;
    }

    onNext(diasFinal);
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Disponibilidades</h2>

      {/* Horário global */}
      <div className="mb-4">
        <p className="font-medium text-gray-700 mb-2">Definir horário padrão:</p>
        <div className="grid grid-cols-2 gap-3">
          <select
            value={horarioGlobal.inicio}
            onChange={(e) => updateHorarioGlobal("inicio", e.target.value)}
            className="border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Início</option>
            {horas.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>

          <select
            value={horarioGlobal.fim}
            onChange={(e) => updateHorarioGlobal("fim", e.target.value)}
            className="border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Fim</option>
            {horas.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de dias */}
      <div className="space-y-3 mb-6">
        {diasDaSemana.map((dia) => {
          const selecionado = diasSelecionados[dia.value];
          return (
            <div
              key={dia.value}
              className={`border p-3 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between ${
                selecionado ? "bg-green-50 border-green-300" : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={!!selecionado}
                  onChange={() => toggleDia(dia.value)}
                  className="w-5 h-5"
                />
                <span className="font-medium text-gray-700">{dia.label}</span>
              </div>

              {selecionado && (
                <div className="mt-3 sm:mt-0 flex gap-3">
                  <select
                    value={selecionado.inicio}
                    onChange={(e) => updateHorarioDia(dia.value, "inicio", e.target.value)}
                    className="border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Início</option>
                    {horas.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selecionado.fim}
                    onChange={(e) => updateHorarioDia(dia.value, "fim", e.target.value)}
                    className="border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Fim</option>
                    {horas.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

      <button
        onClick={handleFinish}
        className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
      >
        Finalizar cadastro
      </button>
    </div>
  );
}
