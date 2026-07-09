import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../entities/session/model/useAuth';
import { authService } from '../services/auth.service';
import { loginSchema, type LoginFormValues } from '../schemas/auth.schemas';
import Button from '../shared/ui/Button';
import RadarIcon from '../shared/ui/RadarIcon';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const isRedirectingRef = useRef(false);

  const from = useMemo(() => {
    const state = location.state as { from?: { pathname?: string } } | null;
    return state?.from?.pathname ?? '/vagas';
  }, [location.state]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    if (!authLoading && user && !isRedirectingRef.current) {
      navigate(user.role === 'admin' ? '/admin' : from, { replace: true });
    }
  }, [authLoading, from, navigate, user]);

  const onSubmit = async (values: LoginFormValues) => {
    setFeedback(null);
    setSubmitting(true);

    try {
      const loggedUser = await authService.signInWithPassword(values.email, values.password);
      if (!loggedUser) {
        setFeedback({ type: 'error', message: 'Nao foi possivel concluir o login. Tente novamente.' });
        return;
      }

      reset({ email: values.email, password: '' });
      setFeedback({ type: 'success', message: 'Login realizado com sucesso!' });
      isRedirectingRef.current = true;
      navigate(loggedUser.role === 'admin' ? '/admin' : from, { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro inesperado ao fazer login.';
      setFeedback({ type: 'error', message });
      reset((current) => ({ ...current, password: '' }));
    } finally {
      setSubmitting(false);
    }
  };

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
              Entre para acompanhar vagas que combinam com seu momento.
            </h1>
            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-300">
              Salve oportunidades, mantenha seus dados atualizados e encontre est&aacute;gios com uma busca mais simples.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <strong className="block text-lg text-radar-300">Filtro</strong>
              <span className="text-xs text-slate-400">por &aacute;rea</span>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <strong className="block text-lg text-radar-300">Perfil</strong>
              <span className="text-xs text-slate-400">do aluno</span>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <strong className="block text-lg text-radar-300">Vagas</strong>
              <span className="text-xs text-slate-400">favoritas</span>
            </div>
          </div>
        </aside>

        <div className="flex items-center justify-center px-4 py-8 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            <div className="mb-7 text-center lg:text-left">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-radar-500 text-ink-900 shadow-lg shadow-radar-500/20 lg:mx-0 lg:hidden">
                <RadarIcon className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-radar-600">Acesso do estudante</p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900">Entrar na conta</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Use seu e-mail e senha para voltar para suas vagas e favoritos.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
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

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700" htmlFor="password">
                  Senha
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-radar-500 focus:ring-2 focus:ring-radar-500/20"
                  placeholder="Digite sua senha"
                  {...register('password')}
                />
                {errors.password && <p className="text-sm text-danger-600">{errors.password.message}</p>}
              </div>

              {feedback && (
                <div className={`rounded-xl border px-4 py-3 text-sm ${feedback.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-danger-200 bg-danger-50 text-danger-700'}`}>
                  {feedback.message}
                </div>
              )}

              <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                {submitting ? 'Entrando...' : 'Entrar'}
              </Button>

              <p className="text-center text-sm text-slate-500">
                Ainda n&atilde;o possui conta?{' '}
                <Link className="font-semibold text-radar-600 hover:text-radar-700" to="/cadastro">
                  Crie agora
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
