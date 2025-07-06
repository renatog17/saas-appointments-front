import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ClientePage = () => {
  const { slug } = useParams();
  const [tenant, setTenant] = useState(null);
  const [erro, setErro] = useState("");

  // Etapas
  const [etapa, setEtapa] = useState(1);
  const [procedimentoSelecionado, setProcedimentoSelecionado] = useState(null);
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [horarioSelecionado, setHorarioSelecionado] = useState("");
  const [email, setEmail] = useState("");

  const horariosDisponiveis = ["09:00", "10:30", "14:00", "15:30", "17:00"];

  useEffect(() => {
    fetch(`http://localhost:8080/tenant/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar dados do tenant.");
        return res.json();
      })
      .then(setTenant)
      .catch((err) => {
        console.error(err);
        setErro("Erro ao carregar dados. Tente novamente mais tarde.");
      });
  }, [slug]);

  const voltar = () => {
    if (etapa > 1) setEtapa(etapa - 1);
  };

  const avancarComProcedimento = (p) => {
    setProcedimentoSelecionado(p);
    setEtapa(2);
  };

  const avancarComData = () => {
    if (dataSelecionada) setEtapa(3);
  };

  const avancarComHorario = (h) => {
    setHorarioSelecionado(h);
    setEtapa(4);
  };

  const finalizarAgendamento = () => {
    alert(
      `Agendamento concluído!\nProcedimento: ${procedimentoSelecionado.nome}\nData: ${dataSelecionada}\nHorário: ${horarioSelecionado}\nEmail: ${email}`
    );
    // Resetar
    setEtapa(1);
    setProcedimentoSelecionado(null);
    setDataSelecionada("");
    setHorarioSelecionado("");
    setEmail("");
  };

  if (erro) return <div className="text-center text-red-500">{erro}</div>;
  if (!tenant) return <div className="text-center text-gray-500">Carregando...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Capa */}
      <div className="relative h-48 bg-blue-500 w-full rounded-b-xl shadow-md">
        <div className="absolute -bottom-10 left-6 w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-white">
          <div className="w-16 h-16 bg-blue-300 rounded-full" />
        </div>
      </div>

      <div className="mt-16 px-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-1">{tenant.nome}</h1>
        <p className="text-gray-500 mb-4">@{tenant.slug}</p>

        <div className="flex gap-4 mb-6">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition"
            onClick={() => setEtapa(1)}
          >
            Agendar
          </button>
          <button className="bg-gray-700 text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition">
            Área do Cliente
          </button>
        </div>

        {/* Etapas */}
        <div className="space-y-4">
          {etapa === 1 && (
            <>
              <h2 className="text-xl font-semibold">Escolha um procedimento</h2>
              <ul className="space-y-4">
                {tenant.procedimentos.map((p, i) => (
                  <li
                    key={i}
                    onClick={() => avancarComProcedimento(p)}
                    className="p-4 bg-white border rounded-xl shadow hover:bg-gray-50 cursor-pointer"
                  >
                    <h3 className="text-blue-600 font-semibold">{p.nome}</h3>
                    <p className="text-gray-600">{p.descricao}</p>
                    <p className="text-green-700 font-bold">R$ {p.valor.toFixed(2)}</p>
                  </li>
                ))}
              </ul>
            </>
          )}

          {etapa === 2 && (
            <>
              <h2 className="text-xl font-semibold">Escolha uma data</h2>
              <input
                type="date"
                className="border px-4 py-2 rounded-lg"
                value={dataSelecionada}
                onChange={(e) => setDataSelecionada(e.target.value)}
              />
              <div className="mt-4 flex gap-4">
                <button
                  onClick={avancarComData}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  disabled={!dataSelecionada}
                >
                  Avançar
                </button>
                <button
                  onClick={voltar}
                  className="text-gray-500 hover:underline self-center"
                >
                  ← Voltar
                </button>
              </div>
            </>
          )}

          {etapa === 3 && (
            <>
              <h2 className="text-xl font-semibold">Escolha um horário</h2>
              <div className="flex flex-wrap gap-4">
                {horariosDisponiveis.map((h, i) => (
                  <button
                    key={i}
                    onClick={() => avancarComHorario(h)}
                    className="px-4 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium"
                  >
                    {h}
                  </button>
                ))}
              </div>
              <button
                onClick={voltar}
                className="mt-4 text-gray-500 hover:underline text-sm"
              >
                ← Voltar
              </button>
            </>
          )}

          {etapa === 4 && (
            <>
              <h2 className="text-xl font-semibold">Informe seu e-mail</h2>
              <input
                type="email"
                className="w-full border px-4 py-2 rounded-lg"
                placeholder="seuemail@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="mt-4 flex gap-4">
                <button
                  onClick={finalizarAgendamento}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                  disabled={!email.includes("@")}
                >
                  Confirmar Agendamento
                </button>
                <button
                  onClick={voltar}
                  className="text-gray-500 hover:underline self-center"
                >
                  ← Voltar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientePage;   