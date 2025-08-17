import { getHorariosAgendamentos } from "../services/apiService";
import { useState, useEffect } from "react";

export default function Agendamentos({ tenantId }) {
  const [horarios, setHorarios] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tenantId) return;

    setLoading(true);
    getHorariosAgendamentos(tenantId)
      .then(response => {
        setHorarios(response.data);
      })
      .catch(error => {
        console.error("Erro ao buscar agendamentos:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [tenantId]);

  return (
  <>
    {loading ? (
      <p style={{ fontStyle: "italic", color: "#555" }}>Carregando horários...</p>
    ) : (
      <div style={{ padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
        <h3 style={{ marginBottom: "1rem", color: "#333" }}>Próximos agendamentos:</h3>
        {Object.entries(horarios).map(([data, listaHorarios]) => (
          <div
            key={data}
            style={{
              marginBottom: "1rem",
              padding: "0.5rem",
              backgroundColor: "#f9f9f9",
              borderRadius: "6px"
            }}
          >
            <h4 style={{ margin: "0 0 0.5rem", color: "#0077cc" }}>{data}</h4>
            <ul style={{ listStyle: "none", paddingLeft: 0 }}>
              {listaHorarios.map((hora, i) => (
                <li
                  key={i}
                  style={{
                    backgroundColor: "#e0f0ff",
                    padding: "0.3rem 0.6rem",
                    borderRadius: "4px",
                    marginBottom: "0.3rem",
                    display: "inline-block",
                    marginRight: "0.5rem"
                  }}
                >
                  {hora}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    )}
  </>
)

}