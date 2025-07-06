import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isFirstLogin");
    navigate("/");
  };
  return (
    <header className=" text-white p-4 flex justify-between items-center">
      <button
        onClick={handleLogout}
        className="bg-white text-indigo-600 px-4 py-2 rounded hover:bg-gray-100 transition"
      >
        Logout
      </button>
    </header>
  );
}
