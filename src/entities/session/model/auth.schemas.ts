import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().email('Informe um e-mail válido.'),
  password: z.string().min(1, 'Informe sua senha.'),
});

export const cadastroSchema = z.object({
  nome: z.string().trim().min(2, 'Informe seu nome completo.'),
  email: z.string().trim().email('Informe um e-mail válido.'),
  password: z.string().min(6, 'A senha deve ter ao menos 6 caracteres.'),
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
