import React from 'react';
import PageHeader from '../components/ui/PageHeader';

const Login: React.FC = () => {
  return (
    <PageHeader
      icon={
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        </svg>
      }
      title="Página de Login"
      description="Área de autenticação para estudantes e administradores."
      note="Componente temporário (Placeholder). A lógica de login e o formulário serão implementados na próxima etapa (UC02)."
    />
  );
};

export default Login;
