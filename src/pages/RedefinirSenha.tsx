import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { authService } from '../entities/session/api/auth.service';
import { cadastroSchema } from '../entities/session/model/auth.schemas';
import Button from '../shared/ui/Button';
import PasswordStrength from '../shared/ui/PasswordStrength';
import RadarIcon from '../shared/ui/RadarIcon';

const redefinirSchema = z.object({
  password: cadastroSchema.shape.password,
  confirm: z.string(),
}).refine((data) => data.password === data.confirm, {
  message: 'As senhas não coincidem.',
  path: ['confirm'],
});

type RedefinirFormValues = z.infer<typeof redefinirSchema>;

const RedefinirSenha: React.FC = () => {
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<RedefinirFormValues>({
    resolver: zodResolver(redefinirSchema),
    defaultValues: { password: '', confirm: '' },
  });

  useEffect(() => {
    let active = true;

    const verify = async () => {
      const user = await authService.getCurrentUser();
      if (active) {
        setCheckingSession(false);
        if (!user) {
          setFeedback({ type: 'error', message: 'Sessão de redefinição inválida ou expirada. Solicite um novo link.' });
        }
      }
    };

    void verify();

    return () => {
      active = false;
    };
  }, []);

  const onSubmit = async (values: RedefinirFormValues) => {
    setFeedback(null);
    setSubmitting(true);

    try {
      await authService.updatePassword(values.password);
      reset({ password: '', confirm: '' });
      setFeedback({ type: 'success', message: 'Senha redefinida com sucesso!' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro inesperado. Tente novamente.';
      setFeedback({ type: 'error', message });
    } finally {
      setSubmitting(false);
    }
  };

  if (checkingSession) {
    return (
      <section className="flex min-h-[calc(100vh-13rem)] items-center justify-center py-6">
        <div className="w-full max-w-xl text-center">
          <p className="text-sm text-slate-500">Verificando sessão de redefinição...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex min-h-[calc(100vh-13rem)] items-center justify-center py-6">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[0.92fr_1.08fr]">
        <aside className="hidden bg-slate-950 p-8 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-radar-500 text-ink-900 shadow-lg shadow-radar-500/20">
                <RadarIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-radar-300">Radar Est&aacute;gio</p>
                <p className="text-xs text-slate-400">Oportunidades para estudantes</p>
              </div>
            </div>
            <h1 className="max-w-sm font-display text-3xl font-bold leading-tight tracking-tight">
              Defina uma nova senha para sua conta.
            </h1>
            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-300">
              Crie uma senha segura e continue acompanhando suas vagas de est&aacute;gio.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <strong className="block text-lg text-radar-300">Segura</strong>
              <span className="text-xs text-slate-400">senha</span>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <strong className="block text-lg text-radar-300">Nova</strong>
              <span className="text-xs text-slate-400">credencial</span>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <strong className="block text-lg text-radar-300">Acesso</strong>
              <span className="text-xs text-slate-400">liberado</span>
            </div>
          </div>
        </aside>

        <div className="flex items-center justify-center px-4 py-8 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            <div className="mb-7 text-center lg:text-left">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-radar-500 text-ink-900 shadow-lg shadow-radar-500/20 lg:mx-0 lg:hidden">
                <RadarIcon className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-radar-600">Redefinição</p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900">Nova senha</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Informe sua nova senha abaixo.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700" htmlFor="password">
                  Nova senha
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-radar-500 focus:ring-2 focus:ring-radar-500/20"
                  placeholder="Crie uma senha"
                  {...register('password')}
                />
                {errors.password && <p className="text-sm text-danger-600">{errors.password.message}</p>}
                <PasswordStrength password={watch('password')} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700" htmlFor="confirm">
                  Confirmar senha
                </label>
                <input
                  id="confirm"
                  type="password"
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-radar-500 focus:ring-2 focus:ring-radar-500/20"
                  placeholder="Repita a senha"
                  {...register('confirm')}
                />
                {errors.confirm && <p className="text-sm text-danger-600">{errors.confirm.message}</p>}
              </div>

              {feedback && (
                <div className={`rounded-xl border px-4 py-3 text-sm ${feedback.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-danger-200 bg-danger-50 text-danger-700'}`}>
                  {feedback.message}
                </div>
              )}

              <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                {submitting ? 'Salvando...' : 'Redefinir senha'}
              </Button>

              <p className="text-center text-sm text-slate-500">
                <Link className="font-semibold text-radar-600 hover:text-radar-700" to="/login">
                  Voltar para o login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RedefinirSenha;
