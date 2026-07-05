import React from 'react';
import PageHeader from '../components/ui/PageHeader';

const Admin: React.FC = () => {
  return (
    <PageHeader
      icon={
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      }
      title="Página de Administração"
      description="Painel de gerenciamento, cadastro e edição de vagas de estágio."
      note="Componente temporário (Placeholder). Proteção de rotas administrativa e RLS serão configuradas na entrega final (UC05)."
    />
  );
};

export default Admin;
