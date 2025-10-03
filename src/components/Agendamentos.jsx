import { getHorariosAgendamentos } from "../services/apiService";
import { useState, useEffect } from "react";

export default function Agendamentos({ tenantId }) {
  const [agendamentos, setAgendamentos] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tenantId) return;

    setLoading(true);
    const fetchAgendamentos = async () => {
      try {
        const response = await getHorariosAgendamentos(tenantId);
        console.log("Agendamentos:", response.data);

        // Agrupa por data e ordena por hora
        const agendamentosOrganizados = response.data.reduce((acc, agendamento) => {
          const data = agendamento.dateTime.split("T")[0]; // só a data

          if (!acc[data]) {
            acc[data] = [];
          }

          acc[data].push(agendamento);
          return acc;
        }, {});

        // Agora ordena os agendamentos de cada dia por horário
        Object.keys(agendamentosOrganizados).forEach((data) => {
          agendamentosOrganizados[data].sort((a, b) =>
            new Date(a.dateTime) - new Date(b.dateTime)
          );
        });

        setAgendamentos(agendamentosOrganizados);
      } catch (error) {
        console.error("Erro ao carregar agendamentos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgendamentos();
  }, [tenantId]);

  return (
    <>
      {loading ? (
        <p style={{ fontStyle: "italic", color: "#555" }}>Carregando horários...</p>
      ) : (
        <div
          style={{
            padding: "1rem",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        >
          <h3 style={{ marginBottom: "1rem", color: "#333" }}>
            Próximos agendamentos:
          </h3>

          {Object.entries(agendamentos).map(([data, listaAgendamentos]) => (
            <div
              key={data}
              style={{
                marginBottom: "1rem",
                padding: "0.5rem",
                backgroundColor: "#f9f9f9",
                borderRadius: "6px",
              }}
            >
              <h4 style={{ margin: "0 0 0.5rem", color: "#0077cc" }}>{data}</h4>
              <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                {listaAgendamentos.map((agendamento) => (
                  <li
                    key={agendamento.id}
                    style={{
                      backgroundColor: "#e0f0ff",
                      padding: "0.6rem",
                      borderRadius: "4px",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <strong>Hora:</strong>{" "}
                    {new Date(agendamento.dateTime).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    <br />
                    <strong>Procedimento:</strong> {agendamento.procedimento.nome} (
                    {agendamento.procedimento.descricao}) - R$
                    {agendamento.procedimento.valor.toFixed(2)}
                    <br />
                    <strong>Consumidor:</strong> {agendamento.consumidor.nome} (
                    {agendamento.consumidor.telefone})
                    <br />
                    <strong>Email:</strong> {agendamento.consumidor.email}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
