import React from 'react';
import Card from './Card';
import Badge from './Badge';

interface PageHeaderProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  note?: string;
  noteVariant?: 'brand' | 'success' | 'danger' | 'neutral';
  wide?: boolean;
}

/**
 * PageHeader — bloco padrão de cabeçalho para páginas ainda em construção
 * (ícone + título + descrição + aviso de status). Usado por Login, Cadastro,
 * Vagas, Perfil, Favoritos e Admin para manter o mesmo layout e as mesmas
 * cores em todas as páginas do projeto.
 */
const PageHeader: React.FC<PageHeaderProps> = ({
  icon,
  title,
  description,
  note,
  noteVariant = 'brand',
  wide = false,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
      <Card className={`${wide ? 'max-w-2xl' : 'max-w-md'} w-full p-8`} hoverable>
        <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-600 dark:text-brand-400">
          {icon}
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
          {title}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-6">{description}</p>
        {note && (
          <Badge variant={noteVariant} className="w-full justify-center py-3">
            {note}
          </Badge>
        )}
      </Card>
    </div>
  );
};

export default PageHeader;
