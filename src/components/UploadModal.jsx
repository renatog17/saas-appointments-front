import { useState } from "react";
import { uploadImagemTenant } from "../services/apiService";

export default function UploadModal({ isOpen, onClose, onSave }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file || null);
  };

  const handleSave = async () => {
  if (selectedFile) {
    try {
      await uploadImagemTenant(selectedFile);
      onSave(selectedFile); // se precisar atualizar algo no componente pai
      onClose();
      setSelectedFile(null);
    } catch (error) {
      console.error("Erro ao enviar imagem:", error);
      alert("Erro ao enviar a imagem");
    }
  }
};

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 w-80"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">Carregar nova imagem</h2>

        <input
          id="file-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <label
          htmlFor="file-upload"
          className="inline-block px-4 py-2 rounded bg-blue-600 text-white cursor-pointer hover:bg-blue-700 transition"
        >
          Selecionar imagem
        </label>
        {selectedFile && (
          <p className="mt-2">Arquivo selecionado: {selectedFile.name}</p>
        )}

        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!selectedFile}
            className={`px-4 py-2 rounded text-white ${
              selectedFile
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-indigo-300 cursor-not-allowed"
            }`}
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
