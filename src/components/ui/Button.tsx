import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30',
  secondary:
    'bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200',
  ghost:
    'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  danger:
    'bg-danger-600 hover:bg-danger-700 text-white shadow-lg shadow-danger-500/20',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

/**
 * Button — único componente de botão do projeto.
 * Não criar `<button className="bg-...">` solto em nenhuma página;
 * sempre importar este componente para manter consistência visual.
 */
const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  return (
    <button
      className={`rounded-control font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
