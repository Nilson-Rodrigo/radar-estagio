import React from 'react';

const Admin: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-2xl">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
          Página de Administração
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-6">
          Painel de gerenciamento, cadastro e edição de vagas de estágio.
        </p>
        <div className="p-4 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300 rounded-xl text-sm border border-red-100 dark:border-red-900/30">
          Componente temporário (Placeholder). Proteção de rotas administrativa e RLS estarão configurados na entrega final.
        </div>
      </div>
    </div>
  );
};

export default Admin;
