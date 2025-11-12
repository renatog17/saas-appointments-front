import { HiOutlinePencil, HiOutlineCheck } from "react-icons/hi";
import { useState } from "react";
import { updateSlug } from "../services/apiService";

const PublicBookingLink = ({ slug }) => {
  const [editingSlug, setEditingSlug] = useState(false);
  const [tempSlug, setTempSlug] = useState(slug);
  const [currentSlug, setCurrentSlug] = useState(slug);
  const [errorMessage, setErrorMessage] = useState(""); // ✅ estado para mensagem de erro

  const handleSaveSlug = async () => {
    try {
      setErrorMessage(""); // limpa erro anterior
      if (currentSlug === tempSlug) return setEditingSlug(false);

      await updateSlug(currentSlug, tempSlug);

      setCurrentSlug(tempSlug); // atualiza interface
      setEditingSlug(false);
    } catch (err) {
      setErrorMessage("Erro ao atualizar o identificador, pois este já está em uso. Tente outro."); // mostra no corpo
      console.error("Erro ao atualizar slug:", err);
    }
  };

  return (
    <div>
      <p className="text-gray-700 text-lg mt-2">
        Seus clientes poderão agendar através do link: <br />
        <span className="flex items-center gap-2 mt-1">
          {editingSlug ? (
            <input
              type="text"
              value={tempSlug}
              onChange={(e) => setTempSlug(e.target.value)}
              className="border border-gray-400 rounded px-2 py-1 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          ) : (
            <a
              href={`https://zendaavip.com.br/${currentSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              zendaavip.com.br/{currentSlug}
            </a>
          )}

          {/* ícone de editar/salvar */}
          <button
            onClick={() => {
              if (editingSlug) {
                handleSaveSlug();
              } else {
                setTempSlug(currentSlug); // ✅ CORRETO AGORA
                setEditingSlug(true);
              }
            }}
            className="p-1 rounded hover:bg-gray-200 transition"
          >
            {editingSlug ? (
              <HiOutlineCheck className="text-green-600 text-xl" />
            ) : (
              <HiOutlinePencil className="text-gray-600 text-xl" />
            )}
          </button>
        </span>
      </p>

      {/* mensagem de erro */}
      {errorMessage && (
        <p className="text-red-600 text-sm mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default PublicBookingLink;
