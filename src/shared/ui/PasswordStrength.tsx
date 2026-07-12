import React from 'react';
import { evaluatePasswordStrength } from '../../entities/session/model/auth.schemas';

interface PasswordStrengthProps {
  password: string;
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const { score, label, checks } = evaluatePasswordStrength(password);

  if (!password) {
    return null;
  }

  const percentage = Math.min(score * 20, 100);

  const colorClasses = {
    Fraca: 'bg-danger-600',
    Média: 'bg-amber-500',
    Forte: 'bg-emerald-500',
  };

  const textColorClasses = {
    Fraca: 'text-danger-600',
    Média: 'text-amber-600',
    Forte: 'text-emerald-600',
  };

  const checkLabels: Record<keyof typeof checks, string> = {
    length: 'Mínimo de 8 caracteres',
    lower: 'Letra minúscula',
    upper: 'Letra maiúscula',
    number: 'Número',
    special: 'Caractere especial',
  };

  return (
    <div className="mt-3 space-y-2">
      <div className="flex items-center gap-3">
        <div className="h-2 flex-1 rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full transition-all duration-300 ${colorClasses[label]}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className={`text-xs font-semibold ${textColorClasses[label]}`}>{label}</span>
      </div>
      <div className="grid gap-1">
        {(Object.keys(checks) as Array<keyof typeof checks>).map((key) => (
          <div key={key} className="flex items-center gap-2 text-xs text-slate-600">
            <span
              className={`inline-flex h-4 w-4 items-center justify-center rounded border ${
                checks[key]
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-slate-200 bg-slate-50 text-slate-400'
              }`}
            >
              {checks[key] ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3">
                  <path fillRule="evenodd" d="M10.22 10.22a.75.75 0 011.06 0L12 11.06l.72-.72a.75.75 0 111.06 1.06l-.72.72.72.72a.75.75 0 11-1.06 1.06l-.72-.72-.72.72a.75.75 0 01-1.06-1.06l.72-.72-.72-.72a.75.75 0 010-1.06zM12 8.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z" clipRule="evenodd" />
                </svg>
              )}
            </span>
            <span>{checkLabels[key]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrength;
