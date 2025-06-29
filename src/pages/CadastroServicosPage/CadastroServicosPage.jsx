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

    const token = localStorage.getItem("token"); // deve estar salvo após login

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
        navigate("/dashboard"); // ou qualquer rota após o cadastro
      } else {
        const erro = await resposta.json();
        setMensagem("Erro ao cadastrar: " + (erro.message || resposta.status));
      }
    } catch (err) {
      setMensagem("Erro na requisição: " + err.message);
    }
  };

  return (
    <div>
      <h2>Cadastro de Serviços</h2>
      <form onSubmit={handleSubmit}>
        {procedimentos.map((p, index) => (
          <div key={index} style={{ marginBottom: "1rem" }}>
            <input
              type="text"
              placeholder="Nome"
              value={p.nome}
              onChange={(e) => handleChange(index, "nome", e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Descrição"
              value={p.descricao}
              onChange={(e) => handleChange(index, "descricao", e.target.value)}
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Valor"
              value={p.valor}
              onChange={(e) => handleChange(index, "valor", e.target.value)}
              required
            />
            {procedimentos.length > 1 && (
              <button type="button" onClick={() => removerProcedimento(index)}>Remover</button>
            )}
          </div>
        ))}

        <button type="button" onClick={adicionarProcedimento}>Adicionar Serviço</button>
        <br /><br />
        <button type="submit">Cadastrar</button>
      </form>

      {mensagem && <p>{mensagem}</p>}
    </div>
  );
}

export default CadastroServicosPage;
