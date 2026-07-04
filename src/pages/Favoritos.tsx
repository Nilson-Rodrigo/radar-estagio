import React from 'react';

const Favoritos: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-2xl">
        <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
          Página de Favoritos
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-6">
          Lista de vagas de estágio que o estudante salvou como interesse.
        </p>
        <div className="p-4 bg-pink-50 dark:bg-pink-950/20 text-pink-700 dark:text-pink-300 rounded-xl text-sm border border-pink-100 dark:border-pink-900/30">
          Componente temporário (Placeholder). A relação N:M entre estudantes e vagas será mapeada futuramente.
        </div>
      </div>
    </div>
  );
};

export default Favoritos;
