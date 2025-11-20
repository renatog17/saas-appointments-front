import {
  getHorariosAgendamentos,
  cancelarAgendamento,
} from "../services/apiService";
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

        const agendamentosOrganizados = response.data.reduce(
          (acc, agendamento) => {
            const data = agendamento.dateTime.split("T")[0];
            if (!acc[data]) acc[data] = [];
            acc[data].push(agendamento);
            return acc;
          },
          {}
        );

        // Ordena horários dentro da data: mais cedo → mais tarde
        Object.keys(agendamentosOrganizados).forEach((data) => {
          agendamentosOrganizados[data].sort(
            (a, b) => new Date(a.dateTime) - new Date(b.dateTime)
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

  async function handleCancelar(id, data) {
    const confirmar = window.confirm(
      "Tem certeza que deseja cancelar este agendamento?"
    );
    if (!confirmar) return;

    try {
      await cancelarAgendamento(id);

      setAgendamentos((prev) => {
        const copia = { ...prev };
        copia[data] = copia[data].filter((item) => item.id !== id);
        if (copia[data].length === 0) delete copia[data];
        return copia;
      });
    } catch (err) {
      console.error("Erro ao cancelar agendamento:", err);
      alert("Erro ao cancelar agendamento.");
    }
  }

  return (
    <>
      {loading ? (
        <p style={{ fontStyle: "italic", color: "#555" }}>
          Carregando horários...
        </p>
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

          {Object.entries(agendamentos)
            // Ordena os dias: mais antigo → mais recente
            .sort(([dataA], [dataB]) => new Date(dataA) - new Date(dataB))
            .map(([data, listaAgendamentos]) => (
              <div
                key={data}
                style={{
                  marginBottom: "1rem",
                  padding: "0.5rem",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "6px",
                }}
              >
                <h4 style={{ margin: "0 0 0.5rem", color: "#0077cc" }}>
                  {data}
                </h4>

                <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                  {listaAgendamentos.map((agendamento) => (
                    <li
                      key={agendamento.id}
                      style={{
                        backgroundColor: "#e0f0ff",
                        padding: "0.6rem",
                        borderRadius: "4px",
                        marginBottom: "0.5rem",
                        position: "relative",
                        paddingBottom: "2.2rem",
                      }}
                    >
                      <strong>Hora:</strong>{" "}
                      {new Date(agendamento.dateTime).toLocaleTimeString(
                        "pt-BR",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                      <br />
                      <strong>Procedimento:</strong>{" "}
                      {agendamento.procedimento.nome} - R$
                      {agendamento.procedimento.valor.toFixed(2)}
                      <br />
                      <strong>Consumidor:</strong> {agendamento.consumidor.nome}
                      <br />
                      <strong>Telefone:</strong>{" "}
                      {agendamento.consumidor.telefone}
                      <br />
                      <strong>Email:</strong> {agendamento.consumidor.email}

                      <button
                        onClick={() => handleCancelar(agendamento.id, data)}
                        style={{
                          position: "absolute",
                          bottom: "6px",
                          right: "6px",
                          padding: "6px 10px",
                          backgroundColor: "#ff4d4d",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "0.80rem",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                        }}
                      >
                        Cancelar
                      </button>
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
