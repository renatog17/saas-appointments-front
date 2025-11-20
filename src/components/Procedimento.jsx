import { useState, useRef, useEffect } from "react";
import {
  excluirProcedimento,
  editarProcedimento,
  BASE_URL,
  // uploadImagemProcedimento já exportado no seu serviço
} from "../services/apiService";
import { uploadImagemProcedimento } from "../services/apiService";

export default function Procedimento({ lista }) {
  const [procedimentos, setProcedimentos] = useState(lista || []);
  const [editandoId, setEditandoId] = useState(null);
  const [valoresEditados, setValoresEditados] = useState({});
  const [previews, setPreviews] = useState({}); // id -> objectURL
  const [imageInfo, setImageInfo] = useState({}); // id -> {width,height,size}

  const fileInputs = useRef({});

  // LIMPAR objectURLs quando componente desmontar ou quando previews mudarem
  useEffect(() => {
    return () => {
      Object.values(previews).forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch {}
      });
    };
  }, [previews]);

  const handleExcluir = async (id) => {
    if (!confirm("Tem certeza que deseja excluir este procedimento?")) return;

    try {
      await excluirProcedimento(id);
      setProcedimentos((prev) => prev.filter((p) => p.id !== id));
      // remover possíveis previews/imageInfo
      setPreviews((prev) => {
        const { [id]: removed, ...rest } = prev;
        if (removed) URL.revokeObjectURL(removed);
        return rest;
      });
      setImageInfo((prev) => {
        const { [id]: removed, ...rest } = prev;
        return rest;
      });
    } catch (error) {
      console.error(error);
      alert(
        "Este procedimento não pode ser excluído (provavelmente há agendamentos vinculados)."
      );
    }
  };

  const handleEditar = (proc) => {
    setEditandoId(proc.id);
    setValoresEditados({
      nome: proc.nome ?? "",
      descricao: proc.descricao ?? "",
      valor: proc.valor ?? 0,
    });
  };

  const handleSalvar = async (id) => {
    try {
      // Validação básica
      if (!valoresEditados.nome) {
        alert("Informe um nome.");
        return;
      }

      await editarProcedimento(id, valoresEditados);

      setProcedimentos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...valoresEditados } : p))
      );
      setEditandoId(null);
    } catch (error) {
      console.error(error);
      alert("Não foi possível editar o procedimento.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValoresEditados((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadImagem = async (id, file) => {
    if (!file) return;
    try {
      // enviar para backend
      await uploadImagemProcedimento(file, id);

      // criar preview local
      const url = URL.createObjectURL(file);
      // revogar preview antigo, se existir
      setPreviews((prev) => {
        if (prev[id]) {
          try {
            URL.revokeObjectURL(prev[id]);
          } catch {}
        }
        return { ...prev, [id]: url };
      });

      // calcular size e resolução
      const sizeKB = (file.size / 1024).toFixed(1);
      const img = new Image();
      img.onload = () => {
        setImageInfo((prev) => ({
          ...prev,
          [id]: { width: img.width, height: img.height, size: sizeKB },
        }));
      };
      img.src = url;
    } catch (err) {
      console.error(err);
      alert("Erro ao enviar imagem.");
    }
  };

  // helper para mostrar URL (preview primeiro, senão proc.image)
  const getImageURL = (proc) =>
    previews[proc.id] || (proc.image ? `${BASE_URL}/uploads/${proc.image}` : null);

  if (!procedimentos || procedimentos.length === 0) {
    return <p>Nenhum procedimento cadastrado.</p>;
  }

  return (
    <ul className="space-y-2">
      {procedimentos.map((proc) => {
        const imageURL = getImageURL(proc);
        const hasImage = !!imageURL;

        return (
          <li key={proc.id} className="border p-4 rounded-lg shadow flex gap-4 items-start">
            {/* Imagem à esquerda */}
            <div
              className="w-32 h-32 border rounded-lg flex items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 flex-shrink-0"
              onClick={() => fileInputs.current[proc.id]?.click()}
            >
              {hasImage ? (
                <img
                  src={imageURL}
                  alt={`Imagem do procedimento ${proc.nome}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <span className="text-gray-500 text-sm text-center px-2">
                  Clique aqui para adicionar imagem
                </span>
              )}
            </div>

            {/* input oculto */}
            <input
              type="file"
              accept="image/*"
              ref={(el) => (fileInputs.current[proc.id] = el)}
              className="hidden"
              onChange={(e) => handleUploadImagem(proc.id, e.target.files[0])}
            />

            {/* Conteúdo de texto */}
            <div className="flex-1">
              {imageInfo[proc.id] && (
                <p className="text-xs text-gray-500 mb-1">
                  {imageInfo[proc.id].width}x{imageInfo[proc.id].height}px —{" "}
                  {imageInfo[proc.id].size} KB
                </p>
              )}

              {editandoId === proc.id ? (
                <>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-sm text-gray-700">Nome:</label>
                      <input
                        type="text"
                        name="nome"
                        value={valoresEditados.nome}
                        onChange={handleChange}
                        className="border rounded w-full p-1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700">Descrição:</label>
                      <input
                        type="text"
                        name="descricao"
                        value={valoresEditados.descricao}
                        onChange={handleChange}
                        className="border rounded w-full p-1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700">Valor (R$):</label>
                      <input
                        type="number"
                        step="0.01"
                        name="valor"
                        value={valoresEditados.valor}
                        onChange={handleChange}
                        className="border rounded w-full p-1"
                      />
                    </div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      onClick={() => handleSalvar(proc.id)}
                    >
                      Salvar
                    </button>
                    <button
                      className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                      onClick={() => setEditandoId(null)}
                    >
                      Cancelar
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="font-semibold text-indigo-600">Nome: {proc.nome}</h3>
                  <p className="text-gray-700">Descrição: {proc.descricao}</p>
                  <p className="text-gray-500">Valor: R$ {Number(proc.valor).toFixed(2)}</p>

                  <div className="mt-3 flex gap-2">
                    <button
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      onClick={() => handleExcluir(proc.id)}
                    >
                      Excluir
                    </button>
                    <button
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      onClick={() => handleEditar(proc)}
                    >
                      Editar
                    </button>
                  </div>
                </>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
