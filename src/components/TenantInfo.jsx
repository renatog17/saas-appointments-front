import { useState, useRef } from "react";
import {
  uploadImagemTenant,
  uploadImagemTenantCover,
} from "../services/apiService";
import { BASE_URL } from "../services/apiService";

export default function TenantInfo({ nome, slug, srcImg, coverImg }) {
  const [imgError, setImgError] = useState(false);
  const [imgSrc, setImgSrc] = useState(srcImg);
  const [coverSrc, setCoverSrc] = useState(coverImg);
  const [previewCover, setPreviewCover] = useState(null);
  const [previewProfile, setPreviewProfile] = useState(null);

  const coverInputRef = useRef(null);
  const profileInputRef = useRef(null);

  const handleCoverClick = () => coverInputRef.current.click();
  const handleProfileClick = () => profileInputRef.current.click();

  const handleUploadCover = async (file) => {
    const urlPreview = URL.createObjectURL(file);
    setPreviewCover(urlPreview);
    setCoverSrc(urlPreview);

    try {
      await uploadImagemTenantCover(file);
    } catch (err) {
      console.error("Erro ao enviar a capa:", err);
    }
  };

  const handleUploadProfile = async (file) => {
    const urlPreview = URL.createObjectURL(file);
    setPreviewProfile(urlPreview);
    setImgSrc(urlPreview);
    setImgError(false);

    try {
      await uploadImagemTenant(file);
    } catch (err) {
      console.error("Erro ao enviar a imagem de perfil:", err);
    }
  };

  const capaURL = previewCover || (coverSrc ? `${BASE_URL}/uploads/${coverSrc}` : null);

  return (
    <div className="relative w-full">
      {/* Inputs escondidos */}
      <input
        type="file"
        ref={coverInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => handleUploadCover(e.target.files[0])}
      />
      <input
        type="file"
        ref={profileInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => handleUploadProfile(e.target.files[0])}
      />

      {/* ✅ CAPA COMO BACKGROUND — menor e com sobreposição */}
      <div
        className="w-full h-40 rounded-xl cursor-pointer bg-gray-200 border border-gray-300"
        onClick={handleCoverClick}
        style={{
          backgroundImage: capaURL ? `url(${capaURL})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {!capaURL && (
          <div className="flex items-center justify-center h-full text-gray-500">
            Clique para adicionar uma capa
          </div>
        )}
      </div>

      {/* ✅ CONTEÚDO QUE SE SOBREPÕE À CAPA */}
      <div className="flex items-center gap-6 px-2 -mt-12 relative">
        {/* Foto de perfil */}
        {!imgError && (imgSrc || previewProfile) ? (
          <img
            src={previewProfile || `${BASE_URL}/uploads/${imgSrc}`}
            alt={`Logo de ${nome}`}
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md cursor-pointer bg-white"
            onError={() => setImgError(true)}
            onClick={handleProfileClick}
          />
        ) : (
          <div
            className="w-24 h-24 rounded-full bg-gray-100 flex flex-col items-center justify-center border-2 border-dashed border-gray-400 text-gray-500 text-center text-xs cursor-pointer select-none p-2 hover:bg-gray-200 transition"
            onClick={handleProfileClick}
          >
            <span className="font-medium">Clique aqui</span>
            <span>para adicionar</span>
            <span>uma imagem</span>
          </div>
        )}

        {/* Texto */}
        <div className="mt-10">
          <h1 className="text-3xl font-bold text-gray-900">{nome}</h1>
          <p className="text-gray-700 text-lg mt-2">
            Seus clientes poderão agendar através do link: <br />
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
    </div>
  );
}
