import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getTenantPublic,
  criarAgendamento,
  BASE_URL,
} from "../../services/apiService";
import BlocoDataEHorario from "./BlocoDataEHorario";
import BlocoProcedimento from "./BlocoProcedimento";
import BlocoContato from "./BlocoContato";
import HeaderTenant from "./HeaderTenant";
import ContainerEtapa from "./ContainerEtapa";

const AgendamentoPage = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [tenant, setTenant] = useState(null);
  const [procedimentoSelecionado, setProcedimentoSelecionado] = useState(null);
  const [horarioSelecionado, setHorarioSelecionado] = useState(null);
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro404, setErro404] = useState(false);
  const [passo, setPasso] = useState(1);

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

  const podeAgendar =
    nome && procedimentoSelecionado && horarioSelecionado && email;

  const handleAgendar = async () => {
    if (!podeAgendar) return;

    setEnviando(true);
    setMensagem("");

    try {
      await criarAgendamento({
        procedimentoId: procedimentoSelecionado,
        dateTime: horarioSelecionado,
        email,
        telefone,
        tenantId: tenant.id,
        nome,
      });

      // limpar estado
      setProcedimentoSelecionado(null);
      setHorarioSelecionado(null);
      setEmail("");
      setTelefone("");
      setNome("");

      navigate("/agendamento/sucesso");
    } catch (erro) {
      let msg =
        "Erro ao agendar, pois o horário escolhido pode não estar mais disponível. Atualize a página para tentar novamente.";

      const data = erro.response?.data;

      if (data) {
        // Se já for array de objetos
        if (Array.isArray(data)) {
          msg = data.map((e) => e.mensagem).join(", ");
        }
        // Se for string JSON (como no seu caso)
        else if (typeof data === "string") {
          try {
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed)) {
              msg = parsed.map((e) => e.mensagem).join(", ");
            }
          } catch (e) {
            // fallback permanece
          }
        }
      }

      setMensagem(msg);
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
          <HeaderTenant tenant={tenant} />

          <div className="max-w-2xl mx-auto mt-8 px-4">
            <ContainerEtapa>
              {passo === 1 && (
                <BlocoProcedimento
                  procedimentos={tenant.procedimentos}
                  onSelecionar={setProcedimentoSelecionado}
                />
              )}

              {passo === 2 && (
                <BlocoDataEHorario
                  tenantId={tenant.id}
                  disponibilidadeSemanal={tenant.disponibilidades}
                  intervaloEmMinutos={tenant.intervaloEmMinutos}
                  onSelecionar={setHorarioSelecionado}
                />
              )}

              {passo === 3 && (
                <BlocoContato
                  nome={nome}
                  setNome={setNome}
                  email={email}
                  setEmail={setEmail}
                  telefone={telefone}
                  setTelefone={setTelefone}
                />
              )}
            </ContainerEtapa>
            {mensagem && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded">
                {mensagem}
              </div>
            )}

            <div className="flex justify-between mt-6">
              {passo > 1 ? (
                <button
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={() => setPasso(passo - 1)}
                >
                  Voltar
                </button>
              ) : (
                <div />
              )}

              {passo < 3 ? (
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={() => setPasso(passo + 1)}
                  disabled={
                    (passo === 1 && !procedimentoSelecionado) ||
                    (passo === 2 && !horarioSelecionado)
                  }
                >
                  Próximo
                </button>
              ) : (
                <button
                  onClick={handleAgendar}
                  disabled={!podeAgendar || enviando}
                  className={`px-4 py-2 rounded text-white font-semibold transition ${
                    podeAgendar && !enviando
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  {enviando ? "Enviando..." : "Confirmar Agendamento"}
                </button>
              )}
            </div>
          </div>

          {/* Rodapé */}
          <footer className="bg-gray-200 text-gray-700 text-center py-4 mt-6">
            © {new Date().getFullYear()} ZendaaVip. Todos os direitos
            reservados.
          </footer>
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
