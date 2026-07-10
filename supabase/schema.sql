-- ============================================================================
-- Radar Estágio — Modelagem e Persistência de Dados
-- Responsável: Eric  |  Branch: feature/database-e-servicos
-- Executar no SQL Editor do Supabase (uma vez por projeto).
--
-- Cobre a seção 6.2 (Dicionário de Dados) e 6.3 (Integridade Referencial)
-- do documento Trabalho_Final: tabelas users, jobs e favorites, com PK, FKs
-- com ON DELETE CASCADE e restrição de unicidade composta em favorites.
-- ============================================================================

-- gen_random_uuid()
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- Tabela: users
-- Perfil das contas (estudantes e administradores). O id espelha o id do
-- Supabase Auth (auth.users), conforme dicionário de dados ("integrada
-- nativamente ao Supabase Auth").
--
-- OBS. sobre "senha": o dicionário lista uma coluna senha, mas no Supabase a
-- senha é armazenada com hash pela própria camada Auth (auth.users) e NUNCA
-- deve ser duplicada/trafegada aqui. Por isso ela é intencionalmente omitida
-- desta tabela de perfil — o auth.service.ts do Wesley também faz upsert sem
-- senha. (Se o professor exigir a coluna literal, dá para adicioná-la, mas
-- não como NOT NULL, senão quebra o cadastro.)
-- ----------------------------------------------------------------------------
create table if not exists public.users (
  id         uuid         primary key references auth.users (id) on delete cascade,
  nome       varchar(255) not null,
  email      varchar(255) not null unique,
  curso      varchar(100),
  periodo    integer,
  role       varchar(20)  not null default 'estudante'
                          check (role in ('estudante', 'admin')),
  created_at timestamptz  not null default now()
);

-- ----------------------------------------------------------------------------
-- Tabela: jobs
-- Vagas de estágio agregadas / cadastradas pelo administrador.
-- ----------------------------------------------------------------------------
create table if not exists public.jobs (
  id           uuid         primary key default gen_random_uuid(),
  titulo       varchar(255) not null,
  empresa      varchar(255) not null,
  descricao    text         not null,
  cidade       varchar(100) not null,
  modalidade   varchar(50)  not null
                            check (modalidade in ('Presencial', 'Remoto', 'Híbrido')),
  area_atuacao varchar(100) not null,
  link         text         not null,
  created_at   timestamptz  not null default now()
);

-- Índices para acelerar os filtros do módulo do estudante (UC03).
create index if not exists jobs_cidade_idx       on public.jobs (cidade);
create index if not exists jobs_modalidade_idx   on public.jobs (modalidade);
create index if not exists jobs_empresa_idx      on public.jobs (empresa);
create index if not exists jobs_area_atuacao_idx on public.jobs (area_atuacao);

-- ----------------------------------------------------------------------------
-- Tabela: favorites (associativa N:M entre users e jobs)
-- FKs com ON DELETE CASCADE + unicidade composta (user_id, job_id) para
-- impedir favoritar a mesma vaga duas vezes (UC04).
-- ----------------------------------------------------------------------------
create table if not exists public.favorites (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references public.users (id) on delete cascade,
  job_id     uuid        not null references public.jobs  (id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint favorites_user_job_unique unique (user_id, job_id)
);

create index if not exists favorites_user_id_idx on public.favorites (user_id);

-- ============================================================================
-- (OPCIONAL) Row Level Security — recomendado, mas formalmente é tema de
-- segurança (Wesley/Moisés). Deixado comentado para não bloquear o acesso via
-- chave anon antes de o time alinhar as políticas. Descomente em conjunto.
-- ============================================================================
-- alter table public.users     enable row level security;
-- alter table public.jobs      enable row level security;
-- alter table public.favorites enable row level security;
--
-- -- jobs: leitura liberada para qualquer usuário autenticado (UC03/UC04)
-- create policy "jobs_select_todos" on public.jobs
--   for select using (true);
--
-- -- users: cada um enxerga e edita apenas o próprio perfil
-- create policy "users_self_select" on public.users
--   for select using (auth.uid() = id);
-- create policy "users_self_upsert" on public.users
--   for insert with check (auth.uid() = id);
-- create policy "users_self_update" on public.users
--   for update using (auth.uid() = id);
--
-- -- favorites: cada estudante gerencia apenas os próprios favoritos
-- create policy "favorites_self_all" on public.favorites
--   for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
