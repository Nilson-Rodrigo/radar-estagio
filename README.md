# RadarEstágio

Plataforma web agregadora de vagas de estágio, desenvolvida como Trabalho Final da disciplina **Programação para Internet I**, do curso de Tecnologia em Análise e Desenvolvimento de Sistemas — **Instituto Federal do Piauí (IFPI), Campus Piripiri**.

🔗 **Aplicação online:** [radar-estagio.vercel.app](https://radar-estagio.vercel.app)

## O problema

Estudantes de cursos técnicos e superiores enfrentam dificuldade para encontrar vagas de estágio porque as oportunidades estão pulverizadas em múltiplos portais, redes sociais de emprego e sites de agentes de integração. Isso exige que o estudante repita os mesmos filtros em vários lugares, gastando tempo que poderia ser dedicado aos estudos — e muitas vagas acabam sendo perdidas por falta de um canal centralizado.

## A solução

O **RadarEstágio** centraliza a busca de vagas de estágio em uma única interface, permitindo que o estudante se cadastre, pesquise e filtre oportunidades por cidade, modalidade, empresa e área de atuação, e salve vagas de interesse em uma lista de favoritos. Administradores da plataforma são responsáveis por cadastrar, editar e excluir as vagas disponíveis.

## Tecnologias utilizadas

**Frontend**
- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) (validação de formulários)
- [React Router DOM](https://reactrouter.com/)
- [Vite](https://vitejs.dev/) (build tool)

**Backend / BaaS**
- [Supabase](https://supabase.com/) — Authentication + Database (PostgreSQL)

## Funcionalidades

- Cadastro e login de estudantes e administradores (Supabase Auth)
- Recuperação e redefinição de senha
- Listagem, pesquisa e filtragem de vagas (por cidade, modalidade, empresa e área)
- Visualização de detalhes de cada vaga
- Favoritar / desfavoritar vagas
- Painel administrativo com CRUD completo de vagas (criar, editar, excluir)
- Proteção de rotas por papel de usuário (`estudante` / `admin`)
- Row Level Security (RLS) no banco de dados via Supabase

## Custom Hooks

O projeto isola regras de negócio e consumo de dados em hooks personalizados:

| Hook | Localização | Responsabilidade |
|---|---|---|
| `useAuth` | `src/entities/session/model/useAuth.ts` | Gerencia o estado de autenticação do usuário, sincronizando com o Supabase Auth. |
| `useJobs` | `src/widgets/job-board/model/useJobs.ts` | Centraliza busca, filtragem e favoritos na tela de vagas. |
| `useFavoritos` | `src/widgets/favorites-list/model/useFavoritos.ts` | Gerencia listagem e remoção de vagas favoritadas. |

## Estrutura de pastas

O projeto segue o padrão **Feature-Sliced Design (FSD)**:

```
src/
├── app/            # Configuração de rotas (router.tsx)
├── entities/       # Regras de negócio e acesso a dados (job, favorite, session)
├── features/       # Funcionalidades isoladas (job-search, job-filter)
├── widgets/        # Blocos compostos de UI com estado próprio (job-board, favorites-list, job-card, admin-panel, layout)
├── pages/          # Páginas da aplicação (Login, Cadastro, Vagas, Perfil, Favoritos, Admin, etc.)
├── shared/ui/      # Componentes de Design System reutilizáveis (Button, Card, Badge, PageHeader, RadarIcon, ProtectedRoute)
└── schemas/        # Esquemas de validação Zod
```

## Design System

O projeto tem identidade visual própria, documentada em [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md), seguindo o conceito de uma "tela de radar/sonar": fundo grafite escuro, acento em verde-fósforo e tipografia Inter (corpo) + Space Grotesk (títulos).

## Como rodar o projeto localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) 18 ou superior
- Uma conta e um projeto criado no [Supabase](https://supabase.com/)

### Passo a passo

1. Clone o repositório:
   ```bash
   git clone https://github.com/Nilson-Rodrigo/radar-estagio.git
   cd radar-estagio
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente. Copie o arquivo de exemplo:
   ```bash
   cp .env.example .env
   ```
   Abra o `.env` e preencha com as credenciais do seu projeto Supabase (disponíveis em **Project Settings > API** no painel do Supabase):
   ```
   VITE_SUPABASE_URL=https://SEU_PROJETO.supabase.co
   VITE_SUPABASE_ANON_KEY=sua_chave_anon_aqui
   ```

4. Aplique o schema do banco de dados: execute o conteúdo de [`supabase/schema.sql`](./supabase/schema.sql) no **SQL Editor** do seu projeto Supabase. Isso cria as tabelas `users`, `jobs` e `favorites`, além das políticas de Row Level Security (RLS).

5. Rode o projeto em modo de desenvolvimento:
   ```bash
   npm run dev
   ```
   A aplicação estará disponível em `http://localhost:5173`.

### Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera o build de produção |
| `npm run lint` | Executa o linter (ESLint) |
| `npm run preview` | Pré-visualiza o build de produção localmente |

## Documentação completa

A documentação oficial do projeto (Plano de Negócio, Requisitos Funcionais e Não Funcionais, Modelagem de Dados, Casos de Uso e Relato Metodológico sobre o uso de Inteligência Artificial no desenvolvimento) está disponível no arquivo assinado entregue junto ao trabalho final.

## Equipe

- Ana Rosa
- Eric Vinícius
- Moisés Bastos
- Nilson Rodrigo
- Wesley Tiago

---

Projeto acadêmico desenvolvido para a disciplina de Programação para Internet I — IFPI Campus Piripiri, 2026.