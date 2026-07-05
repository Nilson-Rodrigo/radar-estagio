import React from 'react';
import PageHeader from '../shared/ui/PageHeader';

const Vagas: React.FC = () => {
  return (
    <PageHeader
      wide
      icon={
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      }
      title="Página de Vagas"
      description="Mural principal de oportunidades de estágio. Aqui os estudantes poderão pesquisar, filtrar por modalidade (Presencial, Remoto, Híbrido), área de atuação e favoritar suas vagas preferidas."
      note="Componente temporário (Placeholder). Os filtros e a integração com Supabase Database serão criados nas próximas etapas do projeto (UC03)."
    />
  );
};

export default Vagas;
