import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../entities/session/model/useAuth';
import Button from '../shared/ui/Button';
import RadarIcon from '../shared/ui/RadarIcon';

const Home: React.FC = () => {
  const { user, loading, isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-slate-950 px-6 py-16 text-white sm:px-10 sm:py-24">
        {/* Anel de radar decorativo */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.06]">
          <svg viewBox="0 0 600 600" className="h-full w-full max-w-2xl" fill="none">
            <circle cx="300" cy="300" r="260" stroke="#6ef0a0" strokeWidth="1.5" />
            <circle cx="300" cy="300" r="190" stroke="#6ef0a0" strokeWidth="1.5" />
            <circle cx="300" cy="300" r="120" stroke="#6ef0a0" strokeWidth="1.5" />
            <circle cx="300" cy="300" r="55" stroke="#6ef0a0" strokeWidth="1.5" />
            <line x1="300" y1="300" x2="530" y2="130" stroke="#6ef0a0" strokeWidth="1.5" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-radar-500 text-ink-900 shadow-xl shadow-radar-500/30">
            <RadarIcon className="h-9 w-9" />
          </div>

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-radar-400">
            Radar Estágio
          </p>

          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Encontre seu estágio{' '}
            <span className="text-radar-400">sem perder tempo</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
            Vagas de estágio organizadas, filtradas por área e modalidade — tudo
            em um lugar pensado para estudantes acadêmicos iniciantes
            .
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {loading ? null : isAuthenticated && user ? (
              <>
                <Link to="/vagas">
                  <Button variant="primary" size="lg">
                    Ver vagas disponíveis
                  </Button>
                </Link>
                {user.role === 'estudante' && (
                  <Link to="/favoritos">
                    <Button
                      variant="ghost"
                      size="lg"
                      className="border border-white/10 text-white hover:bg-white/5"
                    >
                      Meus favoritos
                    </Button>
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="primary" size="lg">
                    Entrar na conta
                  </Button>
                </Link>
                <Link to="/vagas">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="border border-white/10 text-white hover:bg-white/5"
                  >
                    Explorar vagas
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="mt-16 grid gap-6 sm:grid-cols-3">
        {[
          {
            icon: (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            ),
            titulo: 'Busca inteligente',
            descricao:
              'Pesquise por cargo, empresa ou palavra-chave e filtre por cidade, modalidade e área de atuação.',
          },
          {
            icon: (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            ),
            titulo: 'Favoritos salvos',
            descricao:
              'Guarde as vagas que chamam atenção e acesse depois sem precisar buscar de novo.',
          },
          {
            icon: (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            ),
            titulo: 'Perfil do estudante',
            descricao:
              'Mantenha seu curso e período atualizados para personalizar sua experiência na plataforma.',
          },
        ].map((item) => (
          <div
            key={item.titulo}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-radar-500/20 hover:shadow-md"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-radar-500/10 text-radar-600">
              {item.icon}
            </div>
            <h3 className="mb-2 font-display text-lg font-bold text-slate-900">{item.titulo}</h3>
            <p className="text-sm leading-6 text-slate-500">{item.descricao}</p>
          </div>
        ))}
      </section>

      {/* CTA de cadastro — só para visitantes */}
      {!loading && !isAuthenticated && (
        <section className="mt-16 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-12 text-center">
          <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
            Crie sua conta gratuitamente
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
            Cadastro rápido, sem burocracia. Em menos de um minuto você já pode salvar vagas e
            personalizar sua busca.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/cadastro">
              <Button variant="primary" size="lg">
                Criar conta de estudante
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg">
                Já tenho conta
              </Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
