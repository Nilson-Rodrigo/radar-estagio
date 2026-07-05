import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

/**
 * Card — contêiner padrão. Fundo `ink-800` (grafite), não slate/navy —
 * mantém a coerência com a tela de radar mesmo em componentes de conteúdo.
 */
const Card: React.FC<CardProps> = ({ hoverable = false, className = '', children, ...props }) => {
  return (
    <div
      className={`bg-white dark:bg-ink-800 rounded-card shadow-card border border-slate-200 dark:border-ink-700 transition-all duration-300 ${
        hoverable ? 'hover:shadow-card-hover hover:border-radar-500/20' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
