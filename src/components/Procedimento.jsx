import { useState } from "react";
import {
  excluirProcedimento,
  editarProcedimento,
} from "../services/apiService";

export default function Procedimento({ lista }) {
  const [procedimentos, setProcedimentos] = useState(lista);
  const [editandoId, setEditandoId] = useState(null);
  const [valoresEditados, setValoresEditados] = useState({});

  if (!procedimentos || procedimentos.length === 0) {
    return <p>Nenhum procedimento cadastrado.</p>;
  }

  const handleExcluir = async (id) => {
    try {
      await excluirProcedimento(id);
      setProcedimentos(procedimentos.filter((proc) => proc.id !== id));
    } catch (error) {
      alert(
        "Este procedimento não pode ser excluído pois possui agendamentos vinculados."
      );
    }
  };

  const handleEditar = async (proc) => {
    setEditandoId(proc.id);
    setValoresEditados({
      nome: proc.nome,
      descricao: proc.descricao,
      valor: proc.valor,
    });
  };

  const handleSalvar = async (id) => {
    try {
      await editarProcedimento(id, valoresEditados);

      setProcedimentos(
        procedimentos.map((proc) =>
          proc.id === id ? { ...proc, ...valoresEditados } : proc
        )
      );

      setEditandoId(null);
    } catch (error) {
      alert("Não foi possível editar o procedimento.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValoresEditados((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <ul className="space-y-2">
      {procedimentos.map((proc) => (
        <li key={proc.id} className="border p-4 rounded-lg shadow">
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
                  <label className="block text-sm text-gray-700">
                    Descrição:
                  </label>
                  <input
                    type="text"
                    name="descricao"
                    value={valoresEditados.descricao}
                    onChange={handleChange}
                    className="border rounded w-full p-1"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700">
                    Valor (R$):
                  </label>
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

              <button
                className="mt-3 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={() => handleSalvar(proc.id)}
              >
                Salvar
              </button>
            </>
          ) : (
            <>
              <h3 className="font-semibold text-indigo-600">
                Nome: {proc.nome}
              </h3>
              <p className="text-gray-700">Descrição: {proc.descricao}</p>
              <p className="text-gray-500">Valor: R$ {proc.valor.toFixed(2)}</p>

              <button
                className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={() => handleExcluir(proc.id)}
              >
                Excluir
              </button>
              <button
                className="mt-2 ml-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => handleEditar(proc)}
              >
                Editar
              </button>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
