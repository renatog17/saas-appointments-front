import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CadastroSucessoStep() {
  const [contador, setContador] = useState(4);
  const navigate = useNavigate();

  useEffect(() => {
    const intervalo = setInterval(() => {
      setContador((prev) => prev - 1);
    }, 1000);

    if (contador === 0) {
      navigate("/login");
    }

    return () => clearInterval(intervalo);
  }, [contador, navigate]);

  return (
    <div>
      <h2>Cadastro concluído com sucesso!</h2>
      <p>Redirecionando para a tela de login em {contador}...</p>
    </div>
  );
}
