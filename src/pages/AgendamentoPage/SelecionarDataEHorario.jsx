import { useEffect, useState } from "react";
import { getHorariosAgendamentos } from "../../services/apiService";
import Calendar from "react-calendar";
import "./SelecionarDataEHorario.css";
import { useMemo } from "react";

export default function SelecionarDataEHorario({
  tenantId,
  onSelecionar,
  disponibilidadeSemanal,
}) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [agendamentos, setAgendamentos] = useState({});
  const [selectedTime, setSelectedTime] = useState(null);

  const diasPermitidos = useMemo(() => {
    return new Set((disponibilidadeSemanal || []).map((d) => d.diaDaSemana));
  }, [disponibilidadeSemanal]);

  // Pegamos o dia da semana do selectedDate
  const diaSemanaSelecionado = selectedDate.getDay();

  // Buscamos no JSON a disponibilidade desse dia
  const horariosDoDia = disponibilidadeSemanal.find(
    (d) => d.diaDaSemana === diaSemanaSelecionado
  );

  // horariosDoDia terá algo como { id, diaDaSemana, inicio, fim } ou undefined

  const gerarHorarios = (inicio, fim) => {
    const horarios = [];
    const [horaInicio, minInicio] = inicio.split(":").map(Number);
    const [horaFim, minFim] = fim.split(":").map(Number);

    let hora = horaInicio;
    let minuto = minInicio;

    while (hora < horaFim || (hora === horaFim && minuto < minFim)) {
      horarios.push(
        `${String(hora).padStart(2, "0")}:${String(minuto).padStart(2, "0")}`
      );
      hora += 1; // intervalo de 1 hora
    }

    return horarios;
  };

  const horariosDisponiveis = horariosDoDia
    ? gerarHorarios(horariosDoDia.inicio, horariosDoDia.fim)
    : [];

  useEffect(() => {
    const fetchAgendamentos = async () => {
      try {
        const response = await getHorariosAgendamentos(tenantId);
        setAgendamentos(response.data);
      } catch (erro) {
        console.error(erro);
      }
    };

    fetchAgendamentos();
  }, [tenantId]);

  useEffect(() => {
    if (selectedTime) {
      // selectedTime é "HH:mm"
      const [hora, minuto] = selectedTime.split(":").map(Number);
      const dateTimeCompleto = new Date(selectedDate);
      dateTimeCompleto.setHours(hora, minuto, 0, 0);
      // Remove o deslocamento local (gambiarra provisória permanente)
      const corrigido = new Date(
        dateTimeCompleto.getTime() -
          dateTimeCompleto.getTimezoneOffset() * 60000
      );

      console.log(corrigido.toISOString())
      onSelecionar(corrigido.toISOString())
    }
  }, [selectedDate, selectedTime, onSelecionar]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Agende um horário</h1>

      <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center w-full max-w-md">
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          minDate={new Date()}
          className="rounded-xl shadow-lg p-4 bg-white"
          tileDisabled={({ date, view }) => {
            if (view === "month") {
              const diaSemana = date.getDay(); // 0 = domingo, 6 = sábado
              return !diasPermitidos.has(diaSemana);
            }
            return false;
          }}
        />
        <div className="mt-4 w-full max-w-md">
          <h2 className="text-lg font-semibold mb-2">Horários disponíveis:</h2>
          {horariosDisponiveis.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {horariosDisponiveis.map((hora) => (
                <button
                  key={hora}
                  className={`p-2 rounded-xl border ${
                    selectedTime === hora
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                  onClick={() => setSelectedTime(hora)}
                >
                  {hora}
                </button>
              ))}
            </div>
          ) : (
            <p>Não há horários disponíveis neste dia.</p>
          )}
        </div>
      </div>
    </div>
  );
}
