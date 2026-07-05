import React from 'react';

type BadgeVariant = 'brand' | 'success' | 'danger' | 'neutral';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  brand: 'bg-radar-500/10 dark:bg-radar-500/10 text-radar-600 dark:text-radar-400 border-radar-500/20',
  success: 'bg-success-50 dark:bg-success-950/20 text-success-700 dark:text-success-300 border-success-100 dark:border-success-900/30',
  danger: 'bg-danger-50 dark:bg-danger-950/20 text-danger-700 dark:text-danger-300 border-danger-100 dark:border-danger-900/30',
  neutral: 'bg-slate-100 dark:bg-ink-700/50 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-ink-700',
};

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