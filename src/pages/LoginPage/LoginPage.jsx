import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard"); // se já estiver logado, vai direto pro painel
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });

      if (response.status === 401) {
        setErro("Login ou senha inválidos.");
        return;
      }

      if (!response.ok) {
        setErro("Erro ao fazer login. Tente novamente mais tarde.");
        return;
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      setErro("Erro inesperado. Tente novamente.");
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
      </form>
    </div>
  );
}

export default LoginPage;
