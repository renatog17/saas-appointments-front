import React from "react";

const AgendamentoSucesso = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-4">
          Agendamento realizado com sucesso! ✅
        </h1>
        <p className="text-gray-700">
          Demais informações foram enviadas para o seu e-mail.
        </p>
      </div>
    </div>
  );
};

export default AgendamentoSucesso;
