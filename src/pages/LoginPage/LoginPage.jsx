import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fazerLogin } from "../../services/apiService";
import { useAuth } from "../../context/AuthContext";

function LoginPage() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();
  const { setAuthenticated } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");
    try {
      const response = await fazerLogin({ login, password });
      console.log(response)
      setAuthenticated(true);
      navigate("/dashboard");
    } catch (err) {
      console.error("Erro no login:", err);
      setErro("Usuário ou senha inválidos");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-2xl font-bold mb-4">Entrar</h1>
      <form className="w-full max-w-sm" onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Email"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          className="w-full border p-2 mb-2 rounded"
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 mb-2 rounded"
        />
        {erro && <div className="text-red-500 mb-2">{erro}</div>}
        <button
          type="submit"
          className="bg-indigo-600 text-white w-full p-2 rounded hover:bg-indigo-700 transition"
        >
          Entrar
        </button>

        {/* Botão de Voltar */}
        <button
          onClick={() => navigate("/")}
          className="mt-4 text-indigo-600 hover:underline"
        >
          Voltar para a página inicial
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
