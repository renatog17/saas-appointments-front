import { useEffect, useState } from "react";
import { confirmarLogin, enviarCodigoRecuperacao } from "../../services/apiService";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ForgetPasswordPage() {
  
  const { setAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || "");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [codigo, setCodigo] = useState("");

  useEffect(() => {
    if (!email) {
      navigate("/login");
      return;
    }
    const enviarCodigoPorEmail = async () => {
      try {
        setEnviando(true);
        await enviarCodigoRecuperacao({ email }); // ✅ envia como objeto
        setMensagem("Código enviado para seu e-mail.");
      } catch (err) {
        console.error("Erro ao enviar código:", err);
        setErro("Erro ao enviar código. Tente novamente.");
      } finally {
        setEnviando(false);
      }
    };
    enviarCodigoPorEmail(); // ✅ envia automaticamente ao carregar a página
  }, [email, navigate]);

 const handleVerificarCodigo = async (e) => {
  e.preventDefault();
  setErro("");
  setMensagem("");
  try {
    const response = await confirmarLogin({ login: email, codigo });

    if (response.status === 200) {
      setMensagem("Código verificado com sucesso!");
      setAuthenticated(true);
      navigate("/dashboard");
      // Aqui você pode navegar para a próxima tela:
      // ex: navigate("/reset-password", { state: { email } });
    } else {
      setErro("Código inválido ou expirado.");
    }
  } catch (err) {
    console.error("Erro ao verificar código:", err);
    setErro("Código inválido ou expirado.");
  }
};


  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-2xl font-bold mb-4">Recuperar senha</h1>
      <p className="mb-4 text-center">
        Enviamos um código de verificação para o e-mail abaixo:
      </p>

      <input
        type="text"
        value={email}
        disabled
        className="w-full max-w-sm border p-2 mb-4 rounded bg-gray-100 text-gray-600"
      />

      {mensagem && <div className="text-green-600 mb-2">{mensagem}</div>}
      {erro && <div className="text-red-500 mb-2">{erro}</div>}

      <form onSubmit={handleVerificarCodigo} className="w-full max-w-sm">
        <input
          type="text"
          placeholder="Digite o código recebido"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          className="w-full border p-2 mb-2 rounded"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white w-full p-2 rounded hover:bg-indigo-700 transition"
        >
          Verificar código
        </button>
      </form>

      <button
        disabled={enviando}
        onClick={() => enviarCodigoRecuperacao({ email })} // ✅ envia como objeto
        className="mt-4 text-indigo-600 hover:underline disabled:opacity-50"
      >
        {enviando ? "Enviando..." : "Reenviar código"}
      </button>
    </div>
  );
}
