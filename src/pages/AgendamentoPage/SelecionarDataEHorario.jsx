import { useEffect, useState } from "react";
import { getHorariosAgendamentos } from "../../services/apiService";
import Calendar from "react-calendar";
import "./SelecionarDataEHorario.css";

export default function SelecionarDataEHorario({ tenantId, onSelecionar }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [agendamentos, setAgendamentos] = useState({});
  const [selectedTime, setSelectedTime] = useState(null);

  const HORARIOS_POSIVEIS = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
  ];

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

  const getDateKey = (date) => date.toISOString().split("T")[0];

  const horariosIndisponiveis = (
    agendamentos[getDateKey(selectedDate)] || []
  ).map((hora) => hora.slice(0, 5));

  const horariosDisponiveis = HORARIOS_POSIVEIS.filter(
    (hora) => !horariosIndisponiveis.includes(hora)
  );

  const handleSelectTime = (hora) => {
  setSelectedTime(hora);
  if (onSelecionar) {
    const dataStr = getDateKey(selectedDate); // YYYY-MM-DD
    const horarioCompleto = `${dataStr}T${hora}:00`;
    onSelecionar(horarioCompleto);
  }
};


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Agende um horário</h1>

      <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center w-full max-w-md">
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          minDate={new Date()}
          className="rounded-xl shadow-lg p-4 bg-white"
        />

        <div className="mt-6 w-full">
          <h2 className="text-lg font-semibold mb-2 text-center">
            {selectedDate.toDateString()}
          </h2>

          {horariosDisponiveis.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {HORARIOS_POSIVEIS.map((hora) => {
                const isIndisponivel = horariosIndisponiveis.includes(hora);
                return (
                  <button
                    key={hora}
                    disabled={isIndisponivel}
                    onClick={() => handleSelectTime(hora)}
                    className={`px-4 py-2 rounded border transition
                      ${
                        isIndisponivel
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : hora === selectedTime
                          ? "bg-blue-600 text-white cursor-pointer"
                          : "border-blue-500 text-blue-500 hover:bg-blue-100 cursor-pointer"
                      }
                    `}
                  >
                    {hora}
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-2">
              Nenhum horário disponível.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
