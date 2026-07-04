# Spec — Plataforma Agregadora de Vagas de Estágio

## 0. Problema e Objetivo

**Problema real:** estudantes enfrentam dificuldade de ingresso no mercado de estágio porque as vagas estão pulverizadas em múltiplos portais, redes sociais e sites de agentes de integração, causando perda de oportunidades e tempo desperdiçado.

**Objetivo geral:** plataforma web que centraliza a busca de vagas de estágio em uma única interface simples, rápida e intuitiva, permitindo ao estudante encontrar oportunidades compatíveis com seu perfil sem gerenciar contas em múltiplos sites.

**Objetivos específicos:**
- Centralizar oportunidades de múltiplas fontes.
- Facilitar a busca com filtros por curso, área, cidade e modalidade.
- Permitir organizar vagas favoritas.
- Reduzir o tempo de busca com navegação fluida.

## 1. Requisitos Funcionais

| Código | Nome | Prioridade | Ator | Objetivo |
|---|---|---|---|---|
| RF01 | Cadastro de Estudante | Essencial | Estudante | Cadastro com nome, e-mail, senha, curso, período |
| RF02 | Autenticação de Usuário | Essencial | Estudante/Admin | Login com e-mail e senha |
| RF03 | Gerenciamento de Perfil | Importante | Estudante | Visualizar/atualizar dados acadêmicos e pessoais |
| RF04 | Visualização de Vagas | Essencial | Estudante | Exibir oportunidades cadastradas |
| RF05 | Pesquisa de Vagas | Essencial | Estudante | Busca por palavras-chave |
| RF06 | Filtragem de Vagas | Importante | Estudante | Filtro por cidade, modalidade, empresa, área |
| RF07 | Detalhes da Vaga | Essencial | Estudante | Exibir informações detalhadas da vaga |
| RF08 | Favoritar Vagas | Importante | Estudante | Salvar vagas de interesse |
| RF09 | Listar Favoritos | Importante | Estudante | Ver todas as vagas favoritadas |
| RF10 | Cadastro de Vagas | Essencial | Administrador | Criar novas vagas |
| RF11 | Edição de Vagas | Essencial | Administrador | Atualizar vagas existentes |
| RF12 | Exclusão de Vagas | Essencial | Administrador | Remover vagas indisponíveis |

## 2. Requisitos Não Funcionais

(ver `constitution.md`, seção 3 — são critério de aceite fixo do projeto)

## 3. Módulos do Sistema

- **Autenticação**: cadastro, login e controle de acesso.
- **Perfil**: gerenciamento de dados acadêmicos.
- **Vagas**: listagem, pesquisa, filtragem, detalhes.
- **Favoritos**: salvar/gerenciar vagas salvas.
- **Administração**: cadastro, edição, exclusão de vagas.

## 4. Modelagem de Dados

**users**
- id: UUID (PK, gerado pelo Supabase Auth)
- nome: VARCHAR(255), obrigatório
- email: VARCHAR(255), obrigatório, único
- senha: VARCHAR(255), hash, obrigatório
- curso: VARCHAR(100), opcional (null para admin)
- periodo: INT, opcional (null para admin)
- role: VARCHAR(20), obrigatório ('estudante' | 'admin')
- created_at: TIMESTAMP

**jobs**
- id: UUID (PK)
- titulo: VARCHAR(255), obrigatório
- empresa: VARCHAR(255), obrigatório
- descricao: TEXT, obrigatório
- cidade: VARCHAR(100), obrigatório
- modalidade: VARCHAR(50), obrigatório ('Presencial' | 'Remoto' | 'Híbrido')
- area_atuacao: VARCHAR(100), obrigatório
- link: TEXT, obrigatório (URL válida com protocolo)
- created_at: TIMESTAMP

**favorites** (junção N:M entre users e jobs)
- id: UUID (PK)
- user_id: UUID (FK → users.id, ON DELETE CASCADE)
- job_id: UUID (FK → jobs.id, ON DELETE CASCADE)
- created_at: TIMESTAMP
- Constraint: unicidade composta em (user_id, job_id)

## 5. Casos de Uso

### UC01 — Cadastrar Usuário
**Ator:** Estudante. **Pré-condição:** não autenticado, na página `/cadastro`.

**Fluxo principal:**
1. Acessa `/cadastro`, preenche Nome, E-mail, Senha, Curso, Período.
2. Validação estrutural via Zod Schema no frontend.
3. Envio via `supabase.auth.signUp()`.
4. Supabase cria a conta, dispara trigger, persiste em `users` com `role = 'estudante'`.
5. Sistema armazena token JWT, exibe toast de sucesso, redireciona para `/vagas`.

**Alternativo (FA01):** Curso e Período podem ficar em branco → Zod aceita como `null` → segue fluxo normal.

**Exceções:**
- FE01: e-mail inválido ou senha < 6 caracteres → bloqueio no frontend, mensagens específicas.
- FE02: e-mail já existente (`AuthApiError: User already exists`) → limpa senha, exibe "Este e-mail já está associado a uma conta ativa".
- FE03: timeout/instabilidade de rede → aviso "Erro de comunicação com o servidor. Verifique sua conexão e tente novamente".

### UC02 — Realizar Login
**Ator:** Estudante ou Administrador. **Pré-condição:** cadastro prévio ativo.

**Fluxo principal:**
1. Acessa `/login`, insere e-mail e senha.
2. `supabase.auth.signInWithPassword()`.
3. Supabase valida hash e retorna JWT + objeto do usuário.
4. `useAuth` lê `role` da tabela `users`.
5. Redireciona: `estudante` → `/vagas`; `admin` → `/admin`.

**Alternativo (FA01):** se já existe JWT válido em cache, pula o formulário e redireciona direto.

**Exceções:**
- FE01: credenciais inválidas (`invalid_credentials`) → esvazia senha, "E-mail ou senha incorretos".
- FE02: rate limit por força bruta (`over_request_rate_limit`) → bloqueio de 2 min, aviso de muitas tentativas.

### UC03 — Pesquisar e Filtrar Vagas
**Ator:** Estudante. **Pré-condição:** autenticado, em `/vagas`.

**Fluxo principal:**
1. Sistema carrega listagem + `SearchBar` + `Filters`.
2. Estudante digita termo ou aplica filtros (cidade, modalidade, empresa, área).
3. `useJobs` monta query parametrizada.
4. Query usa `.ilike()` (texto) e `.eq()` (exato) no Supabase.
5. Banco retorna array JSON.
6. Estado atualizado, `JobCard`s redesenhados.

**Alternativo (FA01):** botão "Limpar Filtros" reseta `SearchBar`/`Filters` e recarrega listagem padrão.

**Exceções:**
- FE01: resultado vazio → esconde cards, exibe "Nenhuma vaga corresponde aos critérios selecionados...".
- FE02: JWT expirado (401 / JWT Expired) → limpa sessão, redireciona ao login com "Sessão expirada. Acesse novamente."

### UC04 — Favoritar Vagas
**Ator:** Estudante. **Pré-condição:** autenticado.

**Fluxo principal:**
1. Clica no ícone de coração do `JobCard`.
2. Envia `user_id` + `job_id` para `jobs.service.ts`.
3. Serviço checa se já existe linha em `favorites` com esse par.
4. `.insert()` de nova linha (UUID) em `favorites`.
5. Ícone muda de transparente para preenchido.

**Alternativo (FA01 — desfavoritar):** se o par já existe, executa `.delete().eq('user_id', ...).eq('job_id', ...)`, ícone volta a transparente.

**Exceções:**
- FE01: vaga excluída concorrentemente (`foreign_key_violation`) → remove o card fantasma, toast "Esta oportunidade de estágio não se encontra mais disponível no sistema."

### UC05 — Gerenciar Vagas (Administrativo)
**Ator:** Administrador. **Pré-condição:** autenticado e `role == 'admin'`.

**Fluxo principal (cadastro):**
1. Acessa `/admin`, clica "Publicar Nova Vaga".
2. Preenche Título, Empresa, Descrição, Cidade, Modalidade, Área, Link.
3. Validação Zod → `.insert()` na tabela `jobs`.
4. Supabase insere registro com UUID.
5. Formulário limpo, listagem recarregada, notificação de sucesso.

**Alternativo (FA01 — edição):** seleciona vaga existente, formulário pré-preenchido, `.update().eq('id', job_id)` ao salvar.

**Exceções:**
- FE01: usuário `estudante` tentando acessar `/admin` ou escrever direto no banco → bloqueio por `ProtectedRoute` + RLS, "403 - Acesso Negado...".
- FE02: link sem protocolo/formato inválido → Zod bloqueia no frontend, "Formato de link inválido. Certifique-se de inserir a URL completa da vaga de origem".

## 6. Stack e Justificativa (resumo)

- **React + TypeScript**: componentes puros/determinísticos, tipagem como "documentação viva" para a IA.
- **Tailwind CSS**: classes utilitárias inline reduzem risco de a IA perder correspondência entre arquivos de estilo e componente.
- **React Hook Form + Zod**: schema declarativo próximo da linguagem natural, traduz requisitos direto em validação sem ambiguidade.
- **Supabase**: Auth + PostgreSQL prontos, elimina necessidade de codar rotas/middlewares/JWT manualmente, permitindo à IA focar na lógica de negócio do frontend e nas queries de filtragem.