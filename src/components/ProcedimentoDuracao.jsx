import { useState, useEffect } from "react";
import { updateDuracaoEmMinutos } from "../services/apiService";

const ProcedimentoDuracao = ({ intervaloEmMinutos }) => {
    const [duracao, setDuracao] = useState(intervaloEmMinutos ?? "");
    const [loading, setLoading] = useState(false);
    const [sucesso, setSucesso] = useState(false);
    const [erro, setErro] = useState(null);

    // Sincroniza quando o backend mudar o valor
    useEffect(() => {
        setDuracao(intervaloEmMinutos ?? "");
    }, [intervaloEmMinutos]);

    const handleUpdate = async () => {
        try {
            setLoading(true);
            setErro(null);
            setSucesso(false);

            await updateDuracaoEmMinutos(duracao);

            setSucesso(true);
            setTimeout(() => setSucesso(false), 1200);

        } catch (err) {
            let msg = "Erro ao atualizar.";

            // Axios devolve mensagens em err.response.data
            /*if (err.response?.data?.message) {
                msg = err.response.data.message;
            } else if (err.response?.data) {
                msg = JSON.stringify(err.response.data);
            }*/

            setErro(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Duração Padrão dos Procedimentos</h2>

            <p className="text-gray-700 mb-2">
                A duração padrão dos procedimentos é de{" "}
                <span className="font-bold">{duracao || "—"}</span> minutos.
            </p>

            <select
                value={duracao}
                disabled={loading}
                onChange={(e) => setDuracao(Number(e.target.value))}
                className="border p-2 rounded mb-3 w-full disabled:opacity-50"
            >
                <option value="">Selecione...</option>
                <option value={15}>15 minutos</option>
                <option value={30}>30 minutos</option>
                <option value={45}>45 minutos</option>
                <option value={60}>1 hora</option>
                <option value={75}>1 hora e 15 minutos</option>
                <option value={90}>1 hora e 30 minutos</option>
            </select>

            <button
                onClick={handleUpdate}
                disabled={loading || duracao === ""}
                className={`px-4 py-2 rounded text-white 
                    ${loading ? "bg-blue-300" : "bg-blue-500"} 
                    disabled:opacity-50 flex items-center gap-2`}
            >
                {loading && (
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                )}
                {loading ? "Salvando..." : "Salvar"}
            </button>

            {sucesso && (
                <p className="text-green-600 mt-2">Duração atualizada.</p>
            )}

            {erro && (
                <p className="text-red-600 mt-2">{erro}</p>
            )}
        </div>
    );
};

export default ProcedimentoDuracao;
