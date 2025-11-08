// HeaderTenant.jsx
import { BASE_URL } from "../../services/apiService";

const HeaderTenant = ({ tenant }) => {
  return (
    <>
      <div
        className="h-48 w-full rounded-b-xl"
        style={{
          backgroundColor: tenant.coverImg ? "transparent" : "#2563eb",
          backgroundImage: tenant.coverImg
            ? `url(${BASE_URL}/uploads/${tenant.coverImg})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>

      <div className="relative flex flex-col items-center -mt-16 px-4">
        {tenant.img ? (
          <img
            src={`${BASE_URL}/uploads/${tenant.img}`}
            alt={`Logo de ${tenant.nome}`}
            className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-300 border-4 border-white shadow-md flex items-center justify-center text-gray-500 text-sm">
            Sem imagem
          </div>
        )}

        <h1 className="text-2xl font-bold text-gray-800 mt-4">
          {tenant.nome}
        </h1>
        <p className="text-gray-500">@{tenant.slug}</p>
      </div>
    </>
  );
};

export default HeaderTenant;
