export default function SelecionarProcedimento({
  procedimentos,
  onSelecionar,
}) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-bold mb-4">Selecione um procedimento:</h2>

      <div className="space-y-3">
        {procedimentos.map((proc) => (
          <label
            key={proc.id}
            className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition shadow-sm"
          >
            <input
              type="radio"
              name="procedimento"
              value={proc.id}
              className="mt-1 h-4 w-4"
              onChange={() => onSelecionar(proc.id)}
            />

            {/* IMAGEM */}
            {proc.image && (
              <img
                src={`http://localhost:8080/uploads/${proc.image}`}
                alt={proc.nome}
                className="w-16 h-16 object-cover rounded-md"
              />
            )}

            {/* Nome + Descrição */}
            <div className="flex-1">
              <p className="font-semibold text-gray-800">{proc.nome}</p>

              {proc.descricao && (
                <p className="text-gray-600 text-sm mt-1">{proc.descricao}</p>
              )}
            </div>

            {/* Valor */}
            {proc.valor && (
              <div className="text-right font-semibold text-blue-600 whitespace-nowrap">
                R$ {Number(proc.valor).toFixed(2).replace(".", ",")}
              </div>
            )}
          </label>
        ))}
      </div>
    </div>
  );
}
