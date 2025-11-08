// BlocoContato.jsx
const BlocoContato = ({ nome, setNome, email, setEmail, telefone, setTelefone }) => (
  <div className="bg-white rounded-xl shadow-md p-6">
    <label className="block text-gray-700 mb-2">Como deseja ser chamado(a)</label>
    <input
      type="text"
      className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={nome}
      onChange={(e) => setNome(e.target.value)}
    />

    <label className="block text-gray-700 mb-2 mt-4">E-mail:</label>
    <input
      type="email"
      className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="voce@email.com"
    />

    <label className="block text-gray-700 mb-2 mt-4">Telefone/Whatsapp:</label>
    <input
      type="tel"
      className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={telefone}
      onChange={(e) => setTelefone(e.target.value)}
      placeholder="(99) 99999-9999"
    />
  </div>
);

export default BlocoContato;
