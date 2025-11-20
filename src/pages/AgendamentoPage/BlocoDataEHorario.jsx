import { useEffect, useState } from "react";
import { getHorariosAgendamentos } from "../../services/apiService";
import Calendar from "react-calendar";
import "./SelecionarDataEHorario.css";
import { useMemo } from "react";

export default function SelecionarDataEHorario({
  tenantId,
  onSelecionar,
  disponibilidadeSemanal,
  intervaloEmMinutos,
}) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [agendamentos, setAgendamentos] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);

  const diasPermitidos = useMemo(() => {
    return new Set((disponibilidadeSemanal || []).map((d) => d.diaDaSemana));
  }, [disponibilidadeSemanal]);

  const diaSemanaSelecionado = selectedDate.getDay();

  const horariosDoDia = disponibilidadeSemanal.filter(
    (d) => d.diaDaSemana === diaSemanaSelecionado
  );

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

      // soma o intervalo em minutos
      minuto += intervaloEmMinutos;

      // se passar de 60, ajusta a hora
      while (minuto >= 60) {
        minuto -= 60;
        hora++;
      }
    }

    return horarios;
  };

  // Geramos todos os horários para cada intervalo
  const horariosDisponiveis =
    horariosDoDia.length > 0
      ? horariosDoDia
          .flatMap((d) => gerarHorarios(d.inicio, d.fim))
          .filter((hora) => {
            // Filtra os horários que já não estão agendados
            const dateStr = selectedDate.toISOString().split("T")[0]; // 'YYYY-MM-DD'
            return !agendamentos.some((a) => {
              const aDate = new Date(a.dateTime);
              const aDateStr = aDate.toISOString().split("T")[0];
              const aHour =
                String(aDate.getHours()).padStart(2, "0") +
                ":" +
                String(aDate.getMinutes()).padStart(2, "0");

              return dateStr === aDateStr && hora === aHour;
            });
          })
      : [];

  useEffect(() => {
    const fetchAgendamentos = async () => {
      try {
        const response = await getHorariosAgendamentos(tenantId);
        console.log(response.data);
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
      onSelecionar(corrigido.toISOString());
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
              const diaSemana = date.getDay();
              return !diasPermitidos.has(diaSemana);
            }
            return false;
          }}
          tileClassName={({ date, view }) => {
            if (view === "month") {
              const diaSemana = date.getDay();
              if (!diasPermitidos.has(diaSemana)) {
                return "dia-indisponivel"; // classe custom
              }
            }
            return "";
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
