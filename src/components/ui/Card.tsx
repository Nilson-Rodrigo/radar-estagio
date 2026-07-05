import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

/**
 * Card — contêiner padrão para blocos de conteúdo (formulários, JobCard, etc).
 * Sempre usar este componente em vez de replicar
 * "bg-white dark:bg-slate-800 rounded-2xl shadow-xl..." manualmente.
 */
const Card: React.FC<CardProps> = ({ hoverable = false, className = '', children, ...props }) => {
  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-card shadow-card border border-slate-200 dark:border-slate-700 transition-all duration-300 ${
        hoverable ? 'hover:shadow-card-hover' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
