import { useState, useEffect } from "react";
import { postTenant} from "../../services/apiService";
import EmailStep from "../../components/CadastroSteps/EmailStep";
import PasswordStep from "../../components/CadastroSteps/PasswordStep";
import NameAndTenantStep from "../../components/CadastroSteps/NameAndTenantStep";
import AddProcedureStep from "../../components/CadastroSteps/AddProcedureStep";
import ConfirmacaoEmailStep from "../../components/CadastroSteps/ConfirmacaoEmailStep";
import CadastroSucessoStep from "../../components/CadastroSteps/CadastroSucessoStep";

function CadastroPage() {
  const [step, setStep] = useState(0);
  const [cadastroData, setCadastroData] = useState({
    nome: "",
    slug: "",
    procedimentos: [],
    register: {
      login: "",
      password: "",
    },
  });

  useEffect(() => {
    console.log("Cadastro atualizado:", cadastroData);
  }, [cadastroData]);

  useEffect(() => {
    if (step === 4) {
      handleSubmit();
    }
  }, [step]);

  const handleSubmit = async () => {
    const response = await postTenant(cadastroData);
    if (response.ok) {
      alert("Cadastro realizado com sucesso! Verifique seu e-mail.");
    }
    //eu parei aqui, eu estava no back end pensando como fazer a parte de salvar
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-6 sm:p-10 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Cadastro
        </h1>

        {step === 0 && (
          <EmailStep
            onNext={(login) => {
              setCadastroData((prev) => ({
                ...prev,
                register: {
                  ...prev.register,
                  login,
                },
              }));
              setStep(1);
            }}
          />
        )}

        {step === 1 && (
          <PasswordStep
            onNext={(password) => {
              setCadastroData((prev) => ({
                ...prev,
                register: {
                  ...prev.register,
                  password,
                },
              }));
              setStep(2);
            }}
          />
        )}

        {step === 2 && (
          <NameAndTenantStep
            onNext={(nome, slug) => {
              setCadastroData((prev) => ({
                ...prev,
                nome,
                slug,
              }));
              setStep(3);
            }}
          />
        )}

        {step === 3 && (
          <AddProcedureStep
            onNext={(procedimentos) => {
              setCadastroData((prev) => ({
                ...prev,
                procedimentos,
              }));
              setStep(4);
            }}
          />
        )}

        {step === 4 && (
          <ConfirmacaoEmailStep
            login={cadastroData.register.login}
            onSuccess={() => setStep(5)} 
          />
        )}

        {step === 5 && <CadastroSucessoStep />}

      </div>
    </div>
  );
}

export default CadastroPage;
