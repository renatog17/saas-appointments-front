export default function TenantInfo({ nome, slug }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-indigo-700">Nome: {nome}</h2>
      <p className="text-gray-600">Slug: {slug}</p>
    </div>
  );
}