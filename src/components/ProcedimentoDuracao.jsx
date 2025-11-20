import { useState } from "react";
import { updateDuracaoEmMinutos } from "../services/apiService";

const ProcedimentoDuracao = ({ intervaloEmMinutos }) => {
    const [duracao, setDuracao] = useState(intervaloEmMinutos ?? "");
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        try {
            setLoading(true);
            await updateDuracaoEmMinutos(duracao);
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
                onChange={(e) => setDuracao(Number(e.target.value))}
                className="border p-2 rounded mb-3 w-full"
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
                className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
                {loading ? "Salvando..." : "Salvar"}
            </button>
        </div>
    );
};

export default ProcedimentoDuracao;
