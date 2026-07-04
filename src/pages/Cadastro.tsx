import React from 'react';

const Cadastro: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-2xl">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
          Página de Cadastro
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-6">
          Criação de novas contas para estudantes acessarem a plataforma.
        </p>
        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 rounded-xl text-sm border border-blue-100 dark:border-blue-900/30">
          Componente temporário (Placeholder). A validação com Zod e a persistência via Supabase serão integrados no futuro.
        </div>
      </div>
    </div>
  );
};

export default Cadastro;
