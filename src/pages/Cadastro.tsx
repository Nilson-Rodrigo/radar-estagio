import React from 'react';
import PageHeader from '../shared/ui/PageHeader';

const Cadastro: React.FC = () => {
  return (
    <PageHeader
      icon={
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      }
      title="Página de Cadastro"
      description="Criação de novas contas para estudantes acessarem a plataforma."
      note="Componente temporário (Placeholder). A validação com Zod e a persistência via Supabase serão integradas na próxima etapa (UC01)."
    />
  );
};

export default Cadastro;
