import ProcedimentoForm from "./ProcedimentoForm";
import ProcedimentoItem from "./ProcedimentoItem";

export default function Procedimento({ lista }) {
  if (!lista || lista.length === 0) {
    return <p>Nenhum procedimento cadastrado.</p>;
  }

  return (
    <ul className="space-y-2">
      {lista.map(proc => (
        <li key={proc.id} className="border p-4 rounded-lg shadow">
          <h3 className="font-semibold text-indigo-600">{proc.nome}</h3>
          <p className="text-gray-700">{proc.descricao}</p>
          <p className="text-gray-500">Valor: R$ {proc.valor.toFixed(2)}</p>
        </li>
      ))}
    </ul>
  );
}