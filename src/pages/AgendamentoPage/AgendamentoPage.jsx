import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getHorariosAgendamentos,
  getTenantPublic,
  criarAgendamento,
  BASE_URL,
} from "../../services/apiService";
import SelecionarDataEHorario from "./SelecionarDataEHorario";
import SelecionarProcedimento from "./SeleceionarProcedimento";

const AgendamentoPage = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [tenant, setTenant] = useState(null);
  const [procedimentoSelecionado, setProcedimentoSelecionado] = useState(null);
  const [horarioSelecionado, setHorarioSelecionado] = useState(null);
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro404, setErro404] = useState(false);

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const response = await getTenantPublic(slug);
        setTenant(response.data);
      } catch (erro) {
        console.error(erro);
        if (erro.response && erro.response.status === 404) {
          setErro404(true);
        }
      }
    };

    fetchTenant();
  }, [slug]);

  const podeAgendar = procedimentoSelecionado && horarioSelecionado && email;

  const handleAgendar = async () => {
    if (!podeAgendar) return;

    setEnviando(true);
    setMensagem("");

    try {
      await criarAgendamento({
        procedimentoId: procedimentoSelecionado,
        dateTime: horarioSelecionado,
        email,
        tenantId: tenant.id,
        nome
      });
      console.log(horarioSelecionado);
      setMensagem("Agendamento realizado com sucesso!");
      // Resetar os dados, se quiser
      setProcedimentoSelecionado(null);
      setHorarioSelecionado(null);
      setEmail("");
      navigate("/agendamento/sucesso");
    } catch (erro) {
      setMensagem("Erro ao agendar. Tente novamente.");
      console.error(erro);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {erro404 ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-red-600 mb-4">Erro 404</h1>
            <p className="text-gray-600">Página não encontrada.</p>
          </div>
        </div>
        ) : tenant ? (
        <>
          <div className="bg-blue-600 h-48 w-full"></div>

          <div className="relative flex flex-col items-center -mt-16 px-4">
            {tenant.img ? (
              <img
                src={`${BASE_URL}/uploads/${tenant.img}`}
                alt={`Logo de ${tenant.nome}`}
                className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-300 border-4 border-white shadow-md flex items-center justify-center text-gray-500 text-sm">
                Sem imagem
              </div>
            )}

            <h1 className="text-2xl font-bold text-gray-800 mt-4">
              {tenant.nome}
            </h1>
            <p className="text-gray-500">@{tenant.slug}</p>
          </div>

          <div className="max-w-2xl mx-auto mt-8 px-4 space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <SelecionarProcedimento
                procedimentos={tenant.procedimentos}
                onSelecionar={(idSelecionado) =>
                  setProcedimentoSelecionado(idSelecionado)
                }
              />
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <SelecionarDataEHorario
                tenantId={tenant.id}
                onSelecionar={(horarioCompleto) =>
                  setHorarioSelecionado(horarioCompleto)
                }
              />
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <label className="block text-gray-700 mb-2">Como deseja ser chamado(a)</label>
              <input
                type="txt"
                className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
              <label className="block text-gray-700 mb-2">Seu e-mail:</label>
              <input
                type="email"
                className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@email.com"
              />
            </div>

            <div className="text-center">
              <button
                onClick={handleAgendar}
                disabled={!podeAgendar || enviando}
                className={`w-full py-3 rounded text-white font-semibold transition ${
                  podeAgendar && !enviando
                    ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {enviando ? "Enviando..." : "Confirmar Agendamento"}
              </button>

              {mensagem && (
                <p className="mt-4 text-center text-sm text-gray-600">
                  {mensagem}
                </p>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-gray-600 text-lg">Carregando...</p>
        </div>
      )}
    </div>
  );
};

export default AgendamentoPage;
