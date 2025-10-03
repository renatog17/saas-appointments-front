import { useState } from "react";
import { excluirProcedimento } from "../services/apiService";

export default function Procedimento({ lista }) {
  const [procedimentos, setProcedimentos] = useState(lista);

  if (!procedimentos || procedimentos.length === 0) {
    return <p>Nenhum procedimento cadastrado.</p>;
  }

  const handleExcluir = async (id) => {
    try {
      await excluirProcedimento(id);
      setProcedimentos(procedimentos.filter(proc => proc.id !== id));
    } catch (error) {
      console.error("Erro ao excluir procedimento:", error);
    }
  };

  return (
    <ul className="space-y-2">
      {procedimentos.map(proc => (
        <li key={proc.id} className="border p-4 rounded-lg shadow">
          <h3 className="font-semibold text-indigo-600">Nome: {proc.nome}</h3>
          <p className="text-gray-700">Descrição: {proc.descricao}</p>
          <p className="text-gray-500">Valor: R$ {proc.valor.toFixed(2)}</p>
         
           <button
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={() => handleExcluir(proc.id)}
          >
            Excluir 
          </button>
        </li>
      ))}
    </ul>
  );
}
