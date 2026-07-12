import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../entities/session/model/useAuth';
import { authService } from '../entities/session/api/auth.service';
import { cadastroSchema, type CadastroFormValues } from '../entities/session/model/auth.schemas';
import PasswordStrength from '../shared/ui/PasswordStrength';
import Button from '../shared/ui/Button';
import RadarIcon from '../shared/ui/RadarIcon';

const Cadastro: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<CadastroFormValues>({
    resolver: zodResolver(cadastroSchema),
    defaultValues: { nome: '', email: '', password: '', curso: '', periodo: '' },
  });

  useEffect(() => {
    if (!authLoading && user) {
      navigate(user.role === 'admin' ? '/admin' : '/vagas', { replace: true });
    }
  }, [authLoading, navigate, user]);

  const onSubmit = async (values: CadastroFormValues) => {
    setFeedback(null);
    setSubmitting(true);

    try {
      const { needsEmailConfirmation } = await authService.signUpWithEmail(values.email, values.password, {
        nome: values.nome,
        curso: values.curso || null,
        periodo: values.periodo ? Number(values.periodo) : null,
      });

      reset({ nome: '', email: '', password: '', curso: '', periodo: '' });

      if (needsEmailConfirmation) {
        setFeedback({ type: 'success', message: 'Cadastro recebido! Enviamos um e-mail de confirmação. Confirme para acessar.' });
        return;
      }

      setFeedback({ type: 'success', message: 'Cadastro realizado com sucesso! Voce ja pode acessar o sistema.' });
      navigate('/vagas', { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro inesperado ao cadastrar usuario.';
      setFeedback({ type: 'error', message });
      reset((current) => ({ ...current, password: '' }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="flex min-h-[calc(100vh-13rem)] items-center justify-center py-6">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="hidden bg-slate-950 p-8 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-radar-500 text-ink-900 shadow-lg shadow-radar-500/20">
                <RadarIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-radar-300">Radar Est&aacute;gio</p>
                <p className="text-xs text-slate-400">Cadastro para estudantes</p>
              </div>
            </div>
            <h1 className="max-w-sm font-display text-3xl font-bold leading-tight tracking-tight">
              Crie sua conta para organizar suas oportunidades de est&aacute;gio.
            </h1>
            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-300">
              Informe seus dados principais uma vez e use a plataforma para acompanhar vagas, favoritos e seu perfil.
            </p>
          </div>

          <div className="space-y-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <strong className="block text-sm text-radar-300">Conta de estudante</strong>
              <span className="mt-1 block text-xs leading-5 text-slate-400">O cadastro publico cria acesso comum, sem exibir ferramentas administrativas.</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <strong className="block text-lg text-radar-300">Curso</strong>
                <span className="text-xs text-slate-400">opcional</span>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <strong className="block text-lg text-radar-300">Per&iacute;odo</strong>
                <span className="text-xs text-slate-400">opcional</span>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex items-center justify-center px-4 py-8 sm:px-8 lg:px-12">
          <div className="w-full max-w-xl">
            <div className="mb-7 text-center lg:text-left">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-radar-500 text-ink-900 shadow-lg shadow-radar-500/20 lg:mx-0 lg:hidden">
                <RadarIcon className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-radar-600">Novo cadastro</p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900">Criar conta</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Preencha seus dados para salvar vagas e personalizar sua busca por est&aacute;gios.
              </p>
            </div>

            <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2 md:col-span-2">
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

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-slate-700" htmlFor="email">
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-radar-500 focus:ring-2 focus:ring-radar-500/20"
                  placeholder="seu.email@aluno.ifpi.edu.br"
                  {...register('email')}
                />
                {errors.email && <p className="text-sm text-danger-600">{errors.email.message}</p>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-slate-700" htmlFor="password">
                  Senha
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
                  Per&iacute;odo <span className="font-normal text-slate-400">opcional</span>
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

              {feedback && (
                <div className={`md:col-span-2 rounded-xl border px-4 py-3 text-sm ${feedback.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-danger-200 bg-danger-50 text-danger-700'}`}>
                  {feedback.message}
                </div>
              )}

              <div className="md:col-span-2 space-y-4">
                <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                  {submitting ? 'Cadastrando...' : 'Criar conta'}
                </Button>
                <p className="text-center text-sm text-slate-500">
                  J&aacute; possui conta?{' '}
                  <Link className="font-semibold text-radar-600 hover:text-radar-700" to="/login">
                    Entrar
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cadastro;
