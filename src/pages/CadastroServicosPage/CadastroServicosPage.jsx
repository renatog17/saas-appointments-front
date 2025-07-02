import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CadastroServicosPage() {
  const [procedimentos, setProcedimentos] = useState([
    { nome: "", descricao: "", valor: "" }
  ]);
  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();

  const handleChange = (index, field, value) => {
    const novosProcedimentos = [...procedimentos];
    novosProcedimentos[index][field] = value;
    setProcedimentos(novosProcedimentos);
  };

  const adicionarProcedimento = () => {
    setProcedimentos([...procedimentos, { nome: "", descricao: "", valor: "" }]);
  };

  const removerProcedimento = (index) => {
    const novos = procedimentos.filter((_, i) => i !== index);
    setProcedimentos(novos);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("");

    const token = localStorage.getItem("token");

    try {
      const resposta = await fetch("http://localhost:8080/procedimento", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(procedimentos)
      });

      if (resposta.ok) {
        setMensagem("Procedimentos cadastrados com sucesso!");
        localStorage.removeItem("isFirstLogin");
        navigate("/dashboard");
      } else {
        const erro = await resposta.json();
        setMensagem("Erro ao cadastrar: " + (erro.message || resposta.status));
      }
    } catch (err) {
      setMensagem("Erro na requisição: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">
          Cadastro de Serviços
        </h2>
        <form onSubmit={handleSubmit}>
          {procedimentos.map((p, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <input
                type="text"
                placeholder="Nome"
                value={p.nome}
                onChange={(e) => handleChange(index, "nome", e.target.value)}
                required
                className="border rounded p-2 w-full"
              />
              <input
                type="text"
                placeholder="Descrição"
                value={p.descricao}
                onChange={(e) => handleChange(index, "descricao", e.target.value)}
                required
                className="border rounded p-2 w-full"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Valor"
                value={p.valor}
                onChange={(e) => handleChange(index, "valor", e.target.value)}
                required
                className="border rounded p-2 w-full"
              />
              {procedimentos.length > 1 && (
                <div className="md:col-span-3 text-right">
                  <button
                    type="button"
                    onClick={() => removerProcedimento(index)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Remover
                  </button>
                </div>
              )}
            </div>
          ))}

          <div className="flex justify-between items-center mb-6">
            <button
              type="button"
              onClick={adicionarProcedimento}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
            >
              + Adicionar Serviço
            </button>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
            >
              Cadastrar
            </button>
          </div>
        </form>

        {mensagem && (
          <p className="mt-4 text-center text-sm text-gray-700 font-medium">
            {mensagem}
          </p>
        )}
      </div>
    </div>
  );
}

export default CadastroServicosPage;
