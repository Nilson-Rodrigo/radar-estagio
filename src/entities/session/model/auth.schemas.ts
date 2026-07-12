import { z } from 'zod';

export const PASSWORD_MIN_LENGTH = 8;

export const passwordRules = {
  minLength: PASSWORD_MIN_LENGTH,
  hasLower: /[a-z]/,
  hasUpper: /[A-Z]/,
  hasNumber: /\d/,
  hasSpecial: /[^A-Za-z0-9]/,
};

export const loginSchema = z.object({
  email: z.string().trim().email('Informe um e-mail válido.'),
  password: z.string().min(1, 'Informe sua senha.'),
});

export const cadastroSchema = z.object({
  nome: z.string().trim().min(2, 'Informe seu nome completo.'),
  email: z.string().trim().email('Informe um e-mail válido.'),
  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH, `A senha deve ter ao menos ${PASSWORD_MIN_LENGTH} caracteres.`)
    .regex(passwordRules.hasLower, 'Inclua ao menos uma letra minúscula.')
    .regex(passwordRules.hasUpper, 'Inclua ao menos uma letra maiúscula.')
    .regex(passwordRules.hasNumber, 'Inclua ao menos um número.')
    .regex(passwordRules.hasSpecial, 'Inclua ao menos um caractere especial (ex.: !@#$%).'),
  curso: z.string().trim().optional().or(z.literal('')),
  periodo: z
    .string()
    .trim()
    .optional()
    .or(z.literal(''))
    .refine((value) => value === undefined || value === '' || /^\d+$/.test(value), {
      message: 'Período inválido.',
    }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type CadastroFormValues = z.infer<typeof cadastroSchema>;

export interface PasswordStrength {
  score: number;
  label: string;
  checks: {
    length: boolean;
    lower: boolean;
    upper: boolean;
    number: boolean;
    special: boolean;
  };
}

export function evaluatePasswordStrength(value: string): PasswordStrength {
  const checks = {
    length: value.length >= PASSWORD_MIN_LENGTH,
    lower: passwordRules.hasLower.test(value),
    upper: passwordRules.hasUpper.test(value),
    number: passwordRules.hasNumber.test(value),
    special: passwordRules.hasSpecial.test(value),
  };

  const score = Object.values(checks).filter(Boolean).length;

  const label = score <= 2 ? 'Fraca' : score <= 4 ? 'Média' : 'Forte';

  return { score, label, checks };
}
