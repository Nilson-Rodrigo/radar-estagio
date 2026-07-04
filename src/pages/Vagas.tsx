import React from 'react';

const Vagas: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
      <div className="max-w-2xl w-full bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-2xl">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
          Página de Vagas
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-6 font-medium">
          Mural Principal de Oportunidades de Estágio.
        </p>
        <p className="text-slate-600 dark:text-slate-355 text-sm mb-6 max-w-md mx-auto">
          Aqui os estudantes poderão pesquisar, filtrar por modalidade (Presencial, Remoto, Híbrido), área de atuação e favoritar suas vagas preferidas.
        </p>
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 rounded-xl text-sm border border-emerald-100 dark:border-emerald-900/30">
          Componente temporário (Placeholder). Os filtros e a integração com Supabase Database serão criados nas próximas etapas do projeto.
        </div>
      </div>
    </div>
  );
};

export default Vagas;
