import { useState } from "react";
import UploadModal from "./UploadModal"; // ajuste o caminho conforme seu projeto
import { BASE_URL } from "../services/apiService";

export default function TenantInfo({ nome, slug, srcImg }) {
  const [imgError, setImgError] = useState(false);
  const [imgSrc, setImgSrc] = useState(srcImg);
  const [modalOpen, setModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

 

  const handleImageClick = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSaveImage = (file) => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url); // usa apenas para preview
    setImgSrc(url);
    setImgError(false);
  };

  return (
    <>
      <div className="flex items-center space-x-6">
        {!imgError && imgSrc ? (
          <img
            src={previewUrl ? previewUrl : `${BASE_URL}/uploads/${imgSrc}`}
            alt={`Logo de ${nome}`}
            className="w-20 h-20 rounded-full object-cover border-2 border-gray-300 cursor-pointer"
            onError={() => setImgError(true)}
            onClick={handleImageClick}
          />
        ) : (
          <div
            className="w-20 h-20 rounded-full bg-gray-100 flex flex-col items-center justify-center border-2 border-dashed border-gray-400 text-gray-500 text-center text-xs cursor-pointer select-none p-2 hover:bg-gray-200 transition"
            onClick={handleImageClick}
          >
            <span className="font-medium">Clique aqui</span>
            <span>para adicionar</span>
            <span>uma imagem</span>
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{nome}</h1>
          <p className="text-gray-700 text-lg mt-2">
            Seus clientes poderão agendar procedimentos através do link:{" "}
            <br></br>
            <a
              href={`https://zendaavip.com.br/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              zendaavip.com.br/{slug}
            </a>
          </p>
        </div>
      </div>

      <UploadModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveImage}
      />
    </>
  );
}
