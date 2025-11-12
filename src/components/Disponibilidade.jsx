import { useState, useEffect } from "react";
import { atualizarDisponibilidade } from "../services/apiService";

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

export default function Disponibilidade({ lista, onUpdated }) {

  const [diasSelecionados, setDiasSelecionados] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    if (lista) {
      const inicial = {};
      lista.forEach(({ diaDaSemana, inicio, fim }) => {
        if (!inicial[diaDaSemana]) inicial[diaDaSemana] = [];
        // remove os segundos
        const inicioFormatado = inicio.slice(0, 5);
        const fimFormatado = fim.slice(0, 5);
        inicial[diaDaSemana].push({ inicio: inicioFormatado, fim: fimFormatado });
      });
      setDiasSelecionados(inicial);
    }
  }, [lista]);

  /** Marca/desmarca um dia */
  function toggleDia(dia) {
    setDiasSelecionados((prev) => {
      const atualizado = { ...prev };
      if (atualizado[dia]) {
        delete atualizado[dia]; // desmarca o dia
      } else {
        atualizado[dia] = [{ inicio: "", fim: "" }]; // cria primeiro intervalo vazio
      }
      return atualizado;
    });
  }

  /** Atualiza um campo de um intervalo específico */
  function updateHorarioDia(dia, index, field, value) {
    setDiasSelecionados((prev) => {
      const atualizado = { ...prev };
      atualizado[dia][index][field] = value;
      return atualizado;
    });
  }

  /** Adiciona um novo intervalo para um dia */
  function addIntervalo(dia) {
    setDiasSelecionados((prev) => {
      const atualizado = { ...prev };
      atualizado[dia] = [...atualizado[dia], { inicio: "", fim: "" }];
      return atualizado;
    });
  }

  /** Remove um intervalo específico */
  function removeIntervalo(dia, index) {
    setDiasSelecionados((prev) => {
      const atualizado = { ...prev };
      atualizado[dia] = atualizado[dia].filter((_, i) => i !== index);
      if (atualizado[dia].length === 0) delete atualizado[dia];
      return atualizado;
    });
  }

  /**
   * Função auxiliar para validar sobreposição
   * Retorna TRUE se houver conflito
   */
  function hasOverlap(intervalos) {
    const sorted = [...intervalos].sort((a, b) =>
      a.inicio.localeCompare(b.inicio)
    );
    for (let i = 0; i < sorted.length - 1; i++) {
      if (sorted[i].fim > sorted[i + 1].inicio) {
        return true; // sobreposição detectada
      }
    }
    return false;
  }

  function handleFinish() {
    alert("disponibilidades atualizadas!");
    setError(null);

    const diasFinal = [];

    for (const [dia, intervalos] of Object.entries(diasSelecionados)) {
      // 1. Validar se cada intervalo tem início < fim
      for (const intervalo of intervalos) {
        if (!intervalo.inicio || !intervalo.fim) {
          setError("Todos os intervalos devem ter horário inicial e final definidos.");
          return;
        }
        if (intervalo.inicio >= intervalo.fim) {
          setError("A hora final deve ser maior que a hora inicial em todos os intervalos.");
          return;
        }
      }

      // 2. Validar sobreposição entre intervalos do mesmo dia
      if (hasOverlap(intervalos)) {
        setError(`Os intervalos do dia ${diasDaSemana.find(d => d.value === Number(dia)).label} estão sobrepostos.`);
        return;
      }

      // 3. Montar resultado final
      intervalos.forEach((intervalo) => {
        diasFinal.push({
          dia: Number(dia),
          inicio: intervalo.inicio,
          fim: intervalo.fim,
        });
      });

    }
    atualizarDisponibilidade(diasFinal).then(() => {
      if (onUpdated) onUpdated(); 
    }).catch(() => {
      setError("Erro ao atualizar disponibilidades. Tente novamente.");
    });

    console.log(diasFinal);
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Disponibilidades
      </h2>

      {/* Lista de dias */}
      <div className="space-y-3 mb-6">
        {diasDaSemana.map((dia) => {
          const intervalos = diasSelecionados[dia.value];
          return (
            <div
              key={dia.value}
              className={`border p-3 rounded-xl flex flex-col gap-3 ${
                intervalos
                  ? "bg-green-50 border-green-300"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={!!intervalos}
                  onChange={() => toggleDia(dia.value)}
                  className="w-5 h-5"
                />
                <span className="font-medium text-gray-700">{dia.label}</span>
              </div>

              {/* Lista de intervalos */}
              {intervalos &&
                intervalos.map((intervalo, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    <select
                      value={intervalo.inicio}
                      onChange={(e) =>
                        updateHorarioDia(
                          dia.value,
                          index,
                          "inicio",
                          e.target.value
                        )
                      }
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
                      value={intervalo.fim}
                      onChange={(e) =>
                        updateHorarioDia(
                          dia.value,
                          index,
                          "fim",
                          e.target.value
                        )
                      }
                      className="border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Fim</option>
                      {horas.map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => removeIntervalo(dia.value, index)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Remover
                    </button>
                  </div>
                ))}

              {/* Botão para adicionar novo intervalo */}
              {intervalos && (
                <button
                  onClick={() => addIntervalo(dia.value)}
                  className="text-blue-600 hover:underline text-sm mt-2 self-start"
                >
                  + Adicionar intervalo
                </button>
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
        Atualizar
      </button>
    </div>
  );
}
