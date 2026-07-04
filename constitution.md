# Constitution — Plataforma Agregadora de Vagas de Estágio

> Este documento define os princípios NÃO-NEGOCIÁVEIS do projeto.
> O agente do Antigravity deve validar todo Plano e toda Implementação contra estas regras.
> Se um plano contrariar algo aqui, ele deve ser rejeitado/ajustado antes do implement.

## 1. Stack obrigatória (não trocar sem discussão explícita)

**Frontend**
- React + TypeScript
- Tailwind CSS (classes utilitárias direto no componente, sem .css/.scss separados)
- React Hook Form + Zod (validação declarativa, schema como fonte de verdade)
- React Router DOM

**Backend / Persistência**
- Supabase Authentication (signUp / signInWithPassword)
- Supabase Database (PostgreSQL)

## 2. Estrutura de pastas obrigatória

```
src/
├── pages/        (Login, Cadastro, Vagas, Perfil, Favoritos, Admin)
├── components/   (Navbar, JobCard, SearchBar, Filters, ProtectedRoute)
├── services/     (supabase.ts, auth.service.ts, jobs.service.ts)
├── hooks/        (useAuth.ts, useJobs.ts)
├── types/        (User.ts, Job.ts, Favorite.ts)
├── utils/
└── routes/
```

Nenhuma lógica de negócio direto em componente de página — sempre via `services/` e `hooks/`.

## 3. Requisitos não funcionais (critério de aceite de qualquer implementação)

| Código | Regra |
|---|---|
| RNF01 | Responsivo em desktop, tablet e smartphone |
| RNF02 | Tempo de resposta < 3s nas operações principais |
| RNF03 | Credenciais armazenadas de forma segura (Supabase Auth, nunca senha em texto puro) |
| RNF04 | Persistência via Supabase Database |
| RNF05 | Compatível com Chrome, Edge e Firefox |
| RNF06 | Interface simples e intuitiva para estudante e administrador |

## 4. Regras de segurança (não-negociáveis)

- Rotas administrativas protegidas por `ProtectedRoute` no frontend **e** Row Level Security (RLS) no PostgreSQL — as duas camadas, nunca só uma.
- `role` do usuário (`estudante` | `admin`) sempre validado no backend antes de qualquer escrita.
- Relacionamentos com `ON DELETE CASCADE` em `favorites.user_id` e `favorites.job_id`.
- Constraint de unicidade composta em `(user_id, job_id)` na tabela `favorites`.

## 5. Governança do ciclo de IA (SDD)

- Nenhum código deve ser gerado sem uma spec/plano aprovado antes (ciclo specify → clarify → plan → tasks → implement).
- Em erro de compilação (TypeScript/Vite), adotar fail-fast: o erro bruto do terminal deve ser levado ao agente para análise de causa raiz antes de qualquer refatoração.
- Nenhuma tabela deve ser populada manualmente para testes de filtro — gerar scripts SQL de seed cobrindo cenários reais (remoto, híbrido, presencial, capital, interior).
- Toda alteração de requisito passa primeiro pela spec (`spec.md`), nunca direto no código.

## 6. Papéis do grupo (contexto, não regra de código)

Múltiplos integrantes contribuem para partes específicas da spec (requisitos, casos de uso, modelagem de dados, stack). O agente deve tratar `spec.md` como fonte única de verdade, independente de quem escreveu cada seção.