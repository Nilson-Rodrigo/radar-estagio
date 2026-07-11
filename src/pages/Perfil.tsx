import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../entities/session/model/useAuth';
import { supabase } from '../shared/lib/supabase';
import Button from '../shared/ui/Button';

const perfilSchema = z.object({
  nome: z.string().trim().min(2, 'Informe seu nome completo.'),
  curso: z.string().trim().optional().or(z.literal('')),
  periodo: z
    .string()
    .trim()
    .optional()
    .or(z.literal(''))
    .refine((v) => v === undefined || v === '' || /^\d+$/.test(v), {
      message: 'Período inválido.',
    }),
});

type PerfilFormValues = z.infer<typeof perfilSchema>;

const Perfil: React.FC = () => {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PerfilFormValues>({
    resolver: zodResolver(perfilSchema),
    defaultValues: { nome: '', curso: '', periodo: '' },
  });

  // Preenche o formulário quando o usuário carrega
  useEffect(() => {
    if (!user) return;
    reset({
      nome: user.nome ?? '',
      curso: user.curso ?? '',
      periodo: user.periodo != null ? String(user.periodo) : '',
    });
  }, [user, reset]);

  const onSubmit = async (values: PerfilFormValues) => {
    if (!user) return;
    setFeedback(null);
    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('users')
        .update({
          nome: values.nome,
          curso: values.curso || null,
          periodo: values.periodo ? Number(values.periodo) : null,
        })
        .eq('id', user.id);

      if (error) {
        throw new Error(error.message);
      }

      setFeedback({ type: 'success', message: 'Perfil atualizado com sucesso!' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar perfil.';
      setFeedback({ type: 'error', message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Conta do estudante</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Meu Perfil
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Mantenha seus dados acadêmicos atualizados para personalizar sua experiência.
        </p>
      </div>

      {/* Card com e-mail (somente leitura) */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">E-mail</p>
        <p className="mt-1 text-sm font-medium text-slate-700">{user?.email ?? '—'}</p>
        <p className="mt-1 text-xs text-slate-400">O e-mail não pode ser alterado por aqui.</p>
      </div>

      <form
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5 sm:p-8"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700" htmlFor="nome">
            Nome completo
          </label>
          <input
            id="nome"
            autoComplete="name"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-radar-500 focus:ring-2 focus:ring-radar-500/20"
            placeholder="Seu nome"
            {...register('nome')}
          />
          {errors.nome && <p className="text-sm text-danger-600">{errors.nome.message}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700" htmlFor="curso">
              Curso <span className="font-normal text-slate-400">opcional</span>
            </label>
            <input
              id="curso"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-radar-500 focus:ring-2 focus:ring-radar-500/20"
              placeholder="Ex.: ADS"
              {...register('curso')}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700" htmlFor="periodo">
              Período <span className="font-normal text-slate-400">opcional</span>
            </label>
            <input
              id="periodo"
              inputMode="numeric"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-radar-500 focus:ring-2 focus:ring-radar-500/20"
              placeholder="Ex.: 3"
              {...register('periodo')}
            />
            {errors.periodo && <p className="text-sm text-danger-600">{errors.periodo.message}</p>}
          </div>
        </div>

        {feedback && (
          <div
            className={`rounded-xl border px-4 py-3 text-sm ${
              feedback.type === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-danger-200 bg-danger-50 text-danger-700'
            }`}
          >
            {feedback.message}
          </div>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting ? 'Salvando...' : 'Salvar alterações'}
        </Button>
      </form>
    </div>
  );
};

export default Perfil;
