import { useState } from "react";
import api, { BASE_URL } from "../services/apiService";

export default function TenantInfo({ nome, slug, srcImg }) {
  const [imgErro, setImgErro] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  function capitalizeWords(str) {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  function getInitials(str) {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2); // até 2 iniciais
  }

  const imgUrl = `${BASE_URL}/uploads/${srcImg}`;
  const shouldShowImage = srcImg && !imgErro;

  const handleImageClick = () => {
    setShowModal(true);
  };
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile); // nome do campo deve ser "file"

    try {
      const response = await api.post("/image/tenant", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Imagem enviada com sucesso:", response.data);

      // Após upload bem-sucedido:
      setShowModal(false);
      setSelectedFile(null);
      setImgErro(false); // reativa a imagem
      window.location.reload(); // ou refaça o fetch da imagem se for o caso
    } catch (error) {
      console.error("Erro ao enviar imagem:", error);
      alert("Erro ao enviar imagem. Tente novamente.");
    }
  };
  return (
    <div>
      <h2 className="text-lg font-bold text-indigo-700">
        Bem-vindo {capitalizeWords(nome)}
      </h2>
      <p className="text-gray-600">@{slug}</p>

      <div
        className="mt-2 w-40 h-40 rounded shadow-md border border-gray-300 bg-gray-100 flex items-center justify-center cursor-pointer relative"
        onClick={handleImageClick}
        title="Clique para alterar a imagem"
      >
        {shouldShowImage ? (
          <img
            src={imgUrl}
            alt="Imagem do tenant"
            onError={() => setImgErro(true)}
            className="w-full h-full object-cover rounded"
          />
        ) : (
          <span className="text-gray-600 text-3xl font-bold">
            {getInitials(nome)}
          </span>
        )}
        <div className="absolute bottom-1 right-1 bg-white bg-opacity-70 px-2 py-0.5 text-xs rounded text-indigo-600 shadow-sm">
          Editar
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold mb-4">Enviar nova imagem</h3>

            {/* Botão estilizado para escolher imagem */}
            <label className="block border rounded px-4 py-2 cursor-pointer bg-gray-100 hover:bg-gray-200 text-center text-gray-700">
              {selectedFile ? selectedFile.name : "Escolher imagem"}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            <div className="mt-4 flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => {
                  setShowModal(false);
                  setSelectedFile(null);
                }}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                onClick={handleUpload}
                disabled={!selectedFile}
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
