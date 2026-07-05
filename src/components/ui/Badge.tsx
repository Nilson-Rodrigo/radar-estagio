import React from 'react';

type BadgeVariant = 'brand' | 'success' | 'danger' | 'neutral';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  brand: 'bg-brand-50 dark:bg-brand-950/20 text-brand-700 dark:text-brand-300 border-brand-100 dark:border-brand-900/30',
  success: 'bg-success-50 dark:bg-success-950/20 text-success-700 dark:text-success-300 border-success-100 dark:border-success-900/30',
  danger: 'bg-danger-50 dark:bg-danger-950/20 text-danger-700 dark:text-danger-300 border-danger-100 dark:border-danger-900/30',
  neutral: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700',
};

/**
 * Badge — usado para status, tags de modalidade (Remoto/Híbrido/Presencial),
 * e avisos inline (ex: "Componente temporário"). Substitui os
 * "p-4 bg-emerald-50 text-emerald-700..." que cada página inventava sozinha.
 */
const Badge: React.FC<BadgeProps> = ({ variant = 'neutral', className = '', children, ...props }) => {
  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm border font-medium ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
