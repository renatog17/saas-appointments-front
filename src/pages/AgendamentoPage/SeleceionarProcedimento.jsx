export default function SelecionarProcedimento({ procedimentos, onSelecionar }) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-bold mb-2">Selecione um procedimento:</h2>
      <select
        className="w-full border border-gray-300 p-2 rounded cursor-pointer"
        onChange={(e) => onSelecionar(e.target.value)}
      >
        <option value="">-- Escolha um procedimento --</option>
        {procedimentos.map((proc) => (
          <option key={proc.id} value={proc.id}>
            {proc.nome}
          </option>
        ))}
      </select>
    </div>
  );
}