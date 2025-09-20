import { useState } from "react";
import { reenviarCodigoEmail } from "../services/apiService"; // sua função de API
import { confirmarEmail } from "../services/apiService"; // função para confirmar o código

export default function ConfirmacaoEmail({ tenantId }) {
  const [codigo, setCodigo] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);
  const [visivel, setVisivel] = useState(true);


  // Botão Reenviar Código
  const handleReenviarCodigo = async () => {
    try {
      setLoading(true);
      console.log("Reenviando código para tenantId:", tenantId);
      await reenviarCodigoEmail(tenantId); // envia para backend
      setMensagem("Código reenviado! Verifique seu e-mail.");
    } catch (err) {
      console.error(err);
      setMensagem("Erro ao reenviar código. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };
  
  // Botão Confirmar Código
  const handleConfirmarCodigo = async () => {
    try {
      setLoading(true);
      const login = tenantId;
      await confirmarEmail({ login, codigo }); // envia para backend
      setMensagem("E-mail confirmado com sucesso!");
      

      setTimeout(() => {
      setVisivel(false);
    }, 2000);
    } catch (err) {
      console.error(err);
      setMensagem("Código inválido. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
  visivel && (
    <div className="space-y-4">
      <p className="text-red-600 font-semibold">
        Você precisa confirmar seu email
      </p>

      <button
        onClick={handleReenviarCodigo}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        disabled={loading}
      >
        {loading ? "Enviando..." : "Reenviar Código"}
      </button>

      <div className="flex gap-2 items-center">
        <input
          type="text"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          placeholder="Digite o código"
          className="border px-2 py-1 rounded"
        />
        <button
          onClick={handleConfirmarCodigo}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          disabled={loading || !codigo}
        >
          Confirmar Email
        </button>
      </div>

      {mensagem && <p className="text-green-600 font-semibold">{mensagem}</p>}
    </div>
  )
);
}
