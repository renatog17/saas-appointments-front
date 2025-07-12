import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { criarTenant } from "../../services/apiService";

function NegocioPage() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [slug, setSlug] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const validarSlug = (valor) => {
    // Apenas letras, números e hífens
    const regex = /^[a-z0-9-]+$/;
    return regex.test(valor);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (!nome.trim() || !slug.trim()) {
      setErro("Preencha todos os campos.");
      return;
    }

    if (!validarSlug(slug)) {
      setErro("O slug deve conter apenas letras minúsculas, números e hífens.");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await criarTenant(
        { nome, slug },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSucesso("Negócio cadastrado com sucesso!");
      console.log("Negócio cadastrado:", response.data);
      navigate("/servicos");
    } catch (err) {
      if (err.response?.status === 409) {
        setErro("Esse slug já está em uso. Tente outro.");
      } else {
        console.error("Erro ao cadastrar o negócio:", err);
        setErro(
          err.response?.data?.message || "Erro inesperado. Tente novamente."
        );
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Cadastro do Negócio
        </h2>

        {erro && <p className="text-red-600 mb-4">{erro}</p>}
        {sucesso && <p className="text-green-600 mb-4">{sucesso}</p>}

        <div className="mb-4">
          <label htmlFor="nome" className="block mb-1 font-medium">
            Nome do negócio:
          </label>
          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Studio da Ana"
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="slug" className="block mb-1 font-medium">
            Endereço personalizado (slug):
          </label>
          <input
            id="slug"
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase())}
            placeholder="ex: studio-da-ana"
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          <p className="text-sm text-gray-500 mt-1">
            Exemplo de endereço:{" "}
            <strong>
              appoint.com.br/
              <span className="text-gray-700">{slug || "seu-negocio"}</span>
            </strong>
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
        >
          Salvar
        </button>
      </form>
    </div>
  );
}

export default NegocioPage;
