import { useState } from "react";
import { confirmarEmail } from "../../services/apiService";

export default function ConfirmacaoEmailStep({ login, onSuccess }) {
  const [codigo, setCodigo] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleConfirmar = async () => {
    try {
    alert(codigo)
    alert(login)
      await confirmarEmail({ codigo, login });
      setMensagem("Email confirmado com sucesso!");
      onSuccess(); // avança para o próximo passo, se necessário
    } catch (error) {
      setMensagem("Código inválido ou erro ao confirmar.");
    }
  };

  return (
    <div>
      <h2>Confirme seu email</h2>
      <input
        type="text"
        placeholder="Digite o código recebido"
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
      />
      <button onClick={handleConfirmar}>Confirmar</button>
      {mensagem && <p>{mensagem}</p>}
    </div>
  );
}
