export default function TenantInfo({ nome, slug }) {

  function capitalizeWords(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

  return (
    <div>
      <h2 className="text-lg font-bold text-indigo-700">Bem-vindo {capitalizeWords(nome)}</h2>
      <p className="text-gray-600">@{slug}</p>
    </div>
  );
}