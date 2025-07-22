import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cadastrarTenant, fazerLogin } from "../../services/apiService";
import EmailStep from "../../components/CadastroSteps/EmailStep";
import PasswordStep from "../../components/CadastroSteps/PasswordStep";
import NameAndTenantStep from "../../components/CadastroSteps/NameAndTenantStep";
import AddProcedureStep from "../../components/CadastroSteps/AddProcedureStep";

function CadastroPage() {
  const [step, setStep] = useState(0);
  const [cadastroData, setCadastroData] = useState({
    email: "",
    password: "",
    name: "",
    tenant: "",
    procedures: [],
  });

  useEffect(() => {
    if (step === 4) {
      handleSubmit();
    }
  }, [step]);

  const handleSubmit = async () =>{
    await cadastrarTenant(cadastroData)
    //eu parei aqui, eu estava no back end pensando como fazer a parte de salvar 
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-6 sm:p-10 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Cadastro
        </h1>

        {step === 0 && (
          <EmailStep
            onNext={(email) => {
              setCadastroData((prev) => ({ ...prev, email }));
              setStep(1);
            }}
          />
        )}

        {step === 1 && (
          <PasswordStep
            onNext={(password) => {
              setCadastroData((prev) => ({ ...prev, password }));
              setStep(2);
            }}
          />
        )}

        {step === 2 && (
          <NameAndTenantStep
            onNext={(name, tenant) => {
              setCadastroData((prev) => ({ ...prev, name, tenant }));
              setStep(3);
            }}
          />
        )}

        {step === 3 && (
          <AddProcedureStep
            onNext={(procedures) => {
              setCadastroData((prev) => ({ ...prev, procedures }));
              setStep(4);
            }}
          />
        )}

        {step === 4 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-center">
              Revisar Informações
            </h2>
            <div className="text-gray-700 space-y-2">
              <p>
                <strong>Email:</strong> {cadastroData.email}
              </p>
              <p>
                <strong>Senha:</strong> {cadastroData.password}
              </p>
              <p>
                <strong>Nome:</strong> {cadastroData.name}
              </p>
              <p>
                <strong>Tenant:</strong> {cadastroData.tenant}
              </p>
              <div>
                <strong>Procedimentos:</strong>
                <ul className="list-disc list-inside">
                  {cadastroData.procedures.map((procedure, index) => (
                    <li key={index}>
                      {procedure.nome} - {procedure.descricao} - R${" "}
                      {procedure.valor}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
              onClick={() => alert("Dados prontos para envio!")}
            >
              Confirmar Cadastro
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CadastroPage;
