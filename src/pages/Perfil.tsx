import React from 'react';

const Perfil: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-2xl">
        <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
          Página de Perfil
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-6">
          Área de gerenciamento de dados acadêmicos e pessoais do estudante.
        </p>
        <div className="p-4 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 rounded-xl text-sm border border-amber-100 dark:border-amber-900/30">
          Componente temporário (Placeholder). Permite ao estudante visualizar e atualizar suas informações futuramente.
        </div>
      </div>
    </div>
  );
};

export default Perfil;
