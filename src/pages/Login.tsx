import React from 'react';

const Login: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-2xl">
        <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
          Página de Login
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-6">
          Área de autenticação para estudantes e administradores.
        </p>
        <div className="p-4 bg-purple-50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-300 rounded-xl text-sm border border-purple-100 dark:border-purple-900/30">
          Componente temporário (Placeholder). A lógica de login e o formulário serão implementados na próxima etapa.
        </div>
      </div>
    </div>
  );
};

export default Login;
