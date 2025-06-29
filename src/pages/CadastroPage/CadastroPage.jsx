import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CadastroPage() {
  const navigate = useNavigate();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
   
    if (!login.includes("@")) {
      setErro("Digite um email válido.");
      return;
    }
    if (password.length < 6) {
      setErro("A senha deve ter no mínimo 6 caracteres.");
      return;
    }
    setErro("");
    try {
      // Primeiro: cadastro
      const registerResponse = await fetch(
        "http://localhost:8080/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ login, password }),
        }
      );

      if (!registerResponse.ok) {
        const data = await registerResponse.json();
        throw new Error(data.message || "Erro ao cadastrar.");
      }

      console.log("Usuário cadastrado com sucesso");

      // Segundo: login automático
      const loginResponse = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login, password }),
      });

      if (!loginResponse.ok) {
        const data = await loginResponse.json();
        throw new Error(data.message || "Erro ao fazer login automático.");
      }

      const loginData = await loginResponse.json();

      // Armazenar o token/localStorage conforme sua lógica
      localStorage.setItem("token", loginData.token);
      localStorage.setItem("isFirstLogin", "true");

      navigate("/negocio");
    } catch (err) {
      console.error("Erro:", err);
      setErro(err.message || "Erro inesperado. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Cadastro</h2>

        {erro && <p className="text-red-600 mb-4">{erro}</p>}

        <div className="mb-4">
          <label htmlFor="login" className="block mb-1 font-medium">
            Email:
          </label>
          <input
            id="login"
            type="email"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            placeholder="Digite seu email"
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block mb-1 font-medium">
            Senha:
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Crie uma senha"
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
        >
          Cadastrar
        </button>
      </form>
    </div>
  );
}

export default CadastroPage;
