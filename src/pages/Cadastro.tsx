import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../entities/session/model/useAuth';
import { authService } from '../services/auth.service';
import { cadastroSchema, type CadastroFormValues } from '../schemas/auth.schemas';
import Button from '../shared/ui/Button';
import PageHeader from '../shared/ui/PageHeader';

const Cadastro: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
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
      const createdUser = await authService.signUpWithEmail(values.email, values.password, {
        nome: values.nome,
        curso: values.curso || null,
        periodo: values.periodo ? Number(values.periodo) : null,
      });

      if (!createdUser) {
        setFeedback({ type: 'error', message: 'Não foi possível concluir o cadastro. Tente novamente.' });
        return;
      }

      reset({ nome: '', email: '', password: '', curso: '', periodo: '' });
      setFeedback({ type: 'success', message: 'Cadastro realizado com sucesso! Você já pode acessar o sistema.' });
      navigate('/vagas', { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro inesperado ao cadastrar usuário.';
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        }
        title="Página de Cadastro"
        description="Criação de novas contas para estudantes acessarem a plataforma."
        note="Curso e período podem ficar em branco, e a conta será criada normalmente."
      />

      <div className="max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700" htmlFor="nome">
              Nome completo
            </label>
            <input
              id="nome"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-radar-500 focus:ring-2 focus:ring-radar-500/20"
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
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-radar-500 focus:ring-2 focus:ring-radar-500/20"
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
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-radar-500 focus:ring-2 focus:ring-radar-500/20"
              placeholder="Crie uma senha"
              {...register('password')}
            />
            {errors.password && <p className="text-sm text-danger-600">{errors.password.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700" htmlFor="curso">
              Curso (opcional)
            </label>
            <input
              id="curso"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-radar-500 focus:ring-2 focus:ring-radar-500/20"
              placeholder="Ex.: ADS"
              {...register('curso')}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700" htmlFor="periodo">
              Período (opcional)
            </label>
            <input
              id="periodo"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-radar-500 focus:ring-2 focus:ring-radar-500/20"
              placeholder="Ex.: 3"
              {...register('periodo')}
            />
            {errors.periodo && <p className="text-sm text-danger-600">{errors.periodo.message}</p>}
          </div>

          {feedback && (
            <div className={`md:col-span-2 rounded-2xl border px-4 py-3 text-sm ${feedback.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-danger-200 bg-danger-50 text-danger-700'}`}>
              {feedback.message}
            </div>
          )}

          <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-500">Já possui conta? <a className="font-semibold text-radar-600" href="/login">Entrar</a></p>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Cadastrando...' : 'Criar conta'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Cadastro;
