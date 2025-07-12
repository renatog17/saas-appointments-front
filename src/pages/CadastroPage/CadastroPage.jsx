import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cadastrarTenant, fazerLogin } from "../../services/apiService";


function CadastroPage() {
  const navigate = useNavigate();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
  e.preventDefault();
  setErrors({});

  try {
    // 1. Cadastrar o tenant
    await cadastrarTenant({ login, password });
  } catch (error) {
    const response = error.response;
    const fieldErrors = {};
    
    if (response && response.status === 400 && Array.isArray(response.data)) {
      response.data.forEach((err) => {
        if (!fieldErrors[err.campo]) {
          fieldErrors[err.campo] = [];
        }
        fieldErrors[err.campo].push(err.mensagem);
      });
    } else {
      fieldErrors.login = [
        "Não é possível cadastrar esse email. Caso já tenha se cadastrado, recupere a senha.",
      ];
    }
    
    setErrors(fieldErrors);
    return;
  }
  
  try {
    // 2. Fazer login automático
    const loginResponse = await fazerLogin({ login, password });
    const { token } = loginResponse.data;
    
    localStorage.setItem("token", token);
    localStorage.setItem("isFirstLogin", "true");
    
    navigate("/negocio");
  } catch (error) {
    console.error("Erro completo:", error);
    console.error("Erro ao fazer login automaticamente após cadastro.");
    // Aqui você pode exibir um erro genérico se quiser
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Cadastro</h2>

        <div className="mb-4">
          <label htmlFor="login" className="block mb-1 font-medium">
            Email:
          </label>
          <input
            id="login"
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            placeholder="Digite seu email"
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          {errors.login &&
            errors.login.map((msg, idx) => (
              <p key={idx} className="text-red-500 text-sm mt-1">
                {msg}
              </p>
            ))}
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
          {errors.password &&
            errors.password.map((msg, idx) => (
              <p key={idx} className="text-red-500 text-sm mt-1">
                {msg}
              </p>
            ))}
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
