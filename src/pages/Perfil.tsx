import React from 'react';
import PageHeader from '../shared/ui/PageHeader';

const Perfil: React.FC = () => {
  return (
    <PageHeader
      icon={
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      }
      title="Página de Perfil"
      description="Área de gerenciamento de dados acadêmicos e pessoais do estudante."
      note="Componente temporário (Placeholder). Permitirá ao estudante visualizar e atualizar suas informações (RF03)."
    />
  );
};

export default Perfil;
