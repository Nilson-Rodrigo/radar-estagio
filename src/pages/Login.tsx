import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../entities/session/model/useAuth';
import { authService } from '../services/auth.service';
import { loginSchema, type LoginFormValues } from '../schemas/auth.schemas';
import Button from '../shared/ui/Button';
import PageHeader from '../shared/ui/PageHeader';

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
        setFeedback({ type: 'error', message: 'Não foi possível concluir o login. Tente novamente.' });
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
    <div className="space-y-8">
      <PageHeader
        icon={
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
        }
        title="Página de Login"
        description="Área de autenticação para estudantes e administradores."
        note="Use suas credenciais cadastradas para acessar o sistema."
      />

      <div className="max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700" htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-radar-500 focus:ring-2 focus:ring-radar-500/20"
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
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-radar-500 focus:ring-2 focus:ring-radar-500/20"
              placeholder="Digite sua senha"
              {...register('password')}
            />
            {errors.password && <p className="text-sm text-danger-600">{errors.password.message}</p>}
          </div>

          {feedback && (
            <div className={`rounded-2xl border px-4 py-3 text-sm ${feedback.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-danger-200 bg-danger-50 text-danger-700'}`}>
              {feedback.message}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-500">
              Ainda não possui conta?{' '}
              <Link className="font-semibold text-radar-600" to="/cadastro">
                Crie agora
              </Link>
            </p>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Entrando...' : 'Entrar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
