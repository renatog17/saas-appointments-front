import { useState } from "react";
import UploadModal from "./UploadModal"; // ajuste o caminho conforme seu projeto
import { BASE_URL } from "../services/apiService";

export default function TenantInfo({ nome, slug, srcImg }) {
  const [imgError, setImgError] = useState(false);
  const [imgSrc, setImgSrc] = useState(srcImg);
  const [modalOpen, setModalOpen] = useState(false);

  const getInitials = (name) => {
    if (!name) return "";
    const words = name.trim().split(" ");
    if (words.length === 1) {
      return words[0].slice(0, 2).toUpperCase();
    }
    return (words[0][0] + words[1][0]).toUpperCase();
  };

  const handleImageClick = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSaveImage = (file) => {
    const url = URL.createObjectURL(file);
    setImgSrc(url);
    setImgError(false);
  };

  return (
    <>
      <div className="flex items-center space-x-6">
        {!imgError && imgSrc ? (
          <img
            src={`${BASE_URL}/uploads/${imgSrc}`}
            alt={`Logo de ${nome}`}
            className="w-20 h-20 rounded-full object-cover border-2 border-gray-300 cursor-pointer"
            onError={() => setImgError(true)}
            onClick={handleImageClick}
          />
        ) : (
          <div
            className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center border-2 border-gray-300 text-white text-3xl font-bold cursor-pointer select-none"
            onClick={handleImageClick}
          >
            {getInitials(nome)}
          </div>
        )}

        <div>
          <h1 className="text-3xl font-bold text-gray-900">{nome}</h1>
          <p className="text-indigo-600 text-lg">@{slug}</p>
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
