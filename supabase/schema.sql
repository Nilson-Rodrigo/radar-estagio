-- ============================================================================
-- Radar Estágio — Modelagem e Persistência de Dados
-- Responsável: Eric  |  Branch: feature/database-e-servicos
-- Executar no SQL Editor do Supabase (uma vez por projeto).
-- ============================================================================

-- gen_random_uuid()
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- Tabela: users
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

create index if not exists jobs_cidade_idx       on public.jobs (cidade);
create index if not exists jobs_modalidade_idx   on public.jobs (modalidade);
create index if not exists jobs_empresa_idx      on public.jobs (empresa);
create index if not exists jobs_area_atuacao_idx on public.jobs (area_atuacao);

-- ----------------------------------------------------------------------------
-- Tabela: favorites
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
-- Row Level Security
-- ============================================================================

alter table public.users     enable row level security;
alter table public.jobs      enable row level security;
alter table public.favorites enable row level security;

-- ----------------------------------------------------------------------------
-- Políticas da tabela: users
-- Cada usuário lê e edita apenas o próprio perfil.
-- Service role (usado por funções internas) tem acesso total.
-- ----------------------------------------------------------------------------
create policy "users_self_select" on public.users
  for select using (auth.uid() = id);

create policy "users_self_insert" on public.users
  for insert with check (auth.uid() = id);

create policy "users_self_update" on public.users
  for update using (auth.uid() = id);

-- ----------------------------------------------------------------------------
-- Políticas da tabela: jobs
-- Leitura: qualquer pessoa (inclusive não autenticada) pode ver as vagas.
-- Escrita: somente usuários com role = 'admin' na tabela users.
-- ----------------------------------------------------------------------------
create policy "jobs_select_publico" on public.jobs
  for select using (true);

create policy "jobs_insert_admin" on public.jobs
  for insert with check (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "jobs_update_admin" on public.jobs
  for update using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "jobs_delete_admin" on public.jobs
  for delete using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

-- ----------------------------------------------------------------------------
-- Políticas da tabela: favorites
-- Cada estudante gerencia apenas os próprios favoritos.
-- ----------------------------------------------------------------------------
create policy "favorites_self_all" on public.favorites
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================================
-- Como criar o primeiro usuário administrador
-- ============================================================================
-- 1. Crie uma conta normalmente em /cadastro (ou direto via Supabase Auth).
-- 2. Copie o UUID do usuário em Authentication > Users no painel do Supabase.
-- 3. Execute o SQL abaixo substituindo o UUID e o e-mail corretos:
--
-- INSERT INTO public.users (id, nome, email, role)
-- VALUES (
--   '<UUID_DO_AUTH_AQUI>',
--   'Administrador',
--   '<SEU_EMAIL_AQUI>',
--   'admin'
-- )
-- ON CONFLICT (id) DO UPDATE SET role = 'admin';
--
-- Pronto. Agora esse e-mail pode logar em /admin-login e acessar /admin.
-- ============================================================================
