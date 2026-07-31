# Automação de Vagas - Radar Estágio

## O que essa automação faz?

- Coleta vagas de **fontes funcionais**: CIEE, GitHub Issues, GitHub Search Issues e arquivo JSON local
- **Insere** vagas novas no Supabase
- **Atualiza** vagas que mudaram
- **Remove** vagas que não existem mais nas fontes
- Roda **todo dia às 08:00** automaticamente via GitHub Actions

## Fontes ativas

| Fonte | Tipo | Status |
|-------|------|--------|
| **CIEE** | Web Scraping | ✅ |
| **GitHub Issues** | API pública | ✅ |
| **GitHub Search Issues** | API pública | ✅ |
| **Arquivo JSON Local** | Arquivo | ✅ |

## Configuração

### 1. Variáveis de ambiente

Configure no arquivo `scripts/automation/.env`:

```env
SUPABASE_URL=https://SEU_PROJETO.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui
GITHUB_TOKEN=seu_token_github_aqui
```

### 2. Token do GitHub (recomendado)

Para evitar rate limit na API do GitHub:

1. Acesse https://github.com/settings/tokens
2. Clique em **Generate new token (classic)**
3. Marque apenas: `public_repo`
4. Copie o token e adicione no `.env` como `GITHUB_TOKEN`

Sem token: 60 requisições/hora
Com token: 5.000 requisições/hora

### 3. Secrets no GitHub

Configure em **Settings > Secrets and variables > Actions**:

| Nome | Valor | Obrigatório |
|------|-------|-------------|
| `SUPABASE_URL` | URL do seu projeto Supabase | Sim |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role do Supabase | Sim |
| `GITHUB_TOKEN` | Token do GitHub | Não |

## Como usar

### Adicionar vagas manualmente

Edite o arquivo `scripts/automation/jobs-feed.json`:

```json
[
  {
    "titulo": "Estágio em Desenvolvimento Web",
    "empresa": "Tech Company",
    "descricao": "Desenvolver aplicações web com React e Node.js",
    "cidade": "São Paulo",
    "modalidade": "Remoto",
    "area_atuacao": "Tecnologia",
    "link": "https://example.com/vaga/1",
    "data_expiracao": "2026-12-31"
  }
]
```

### Rodar localmente

```bash
cd scripts/automation
npm install
npm start
```

### Fazer deploy

```bash
git add scripts/automation .github/workflows/jobs-automation.yml
git commit -m "feat: adiciona automação de vagas via JSON"
git push origin main
```

## Como funciona a sincronização

```
1. Coleta vagas das fontes habilitadas
2. Compara com o que já existe no Supabase
3. Insere novas vagas
4. Atualiza vagas que mudaram
5. Remove vagas que não existem mais
```

### Identificação única

Usamos a **URL da vaga** como identificador único. Se a mesma URL aparecer em várias fontes, a vaga é considerada única.

## GitHub Issues

A automação usa duas fontes do GitHub:

1. **GitHub Issues** - Issues abertas em repositórios conhecidos:
   - backend-br/vagas
   - frontendbr/vagas
   - react-brasil/vagas
   - soujava/vagas-java
   - vuejs-br/vagas

2. **GitHub Search Issues** - Busca global por label:
   - `label:Estágio state:open type:issue`
   - `label:Trainee state:open type:issue`
   - `label:Júnior state:open type:issue estagio`
   - Repositórios BR conhecidos com label Estágio

## Observações

- O arquivo `jobs-feed.json` é a **fonte de verdade** para alimentação manual
- Se uma vaga for removida do JSON ou das fontes, ela será removida do Supabase na próxima execução
- Títulos longos são truncados para 255 caracteres para compatibilidade com o banco
