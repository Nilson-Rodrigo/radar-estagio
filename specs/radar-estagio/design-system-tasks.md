# Tasks — Implementação do Design System (Radar Estágio)

> Instrução para o agente: crie/substitua CADA arquivo abaixo com o conteúdo EXATO
> fornecido no bloco de código correspondente. Não altere, resuma, reformate ou
> 'melhore' o conteúdo — apenas grave os arquivos nos caminhos indicados,
> criando as pastas que não existirem (ex: src/components/ui/).
> Depois de criar todos os arquivos, não execute nenhum outro passo além do
> que está listado aqui.

## Task 1 — Criar/substituir `tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Design System — Radar Estágio
      // Única paleta de marca usada em TODAS as páginas (não misturar com
      // purple/emerald/blue/amber soltos do Tailwind — sempre usar "brand" e "accent").
      colors: {
        brand: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed', // cor primária: botões, links ativos, ícones de destaque
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        // Cores semânticas — uso restrito a um significado específico,
        // nunca como "cor da página" (isso é o que causava a inconsistência).
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          600: '#059669', // vaga favoritada, confirmação de cadastro
          700: '#047857',
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          600: '#dc2626', // erro de validação, exclusão de vaga
          700: '#b91c1c',
        },
      },
      fontFamily: {
        // Fonte única do projeto (aplicada globalmente via index.css)
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '1rem',     // 16px — padrão para Card
        control: '0.75rem', // 12px — padrão para Button/Input
      },
      boxShadow: {
        card: '0 4px 6px -1px rgb(124 58 237 / 0.05), 0 2px 4px -2px rgb(124 58 237 / 0.05)',
        'card-hover': '0 10px 15px -3px rgb(124 58 237 / 0.1), 0 4px 6px -4px rgb(124 58 237 / 0.1)',
      },
    },
  },
  plugins: [],
}
```

## Task 2 — Criar/substituir `src/index.css`

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

/* Design System — Radar Estágio
   Regra: cor de destaque é SEMPRE `brand` (roxo). success/danger só para
   estados semânticos (confirmação/erro). Nunca usar purple/emerald/blue/amber
   direto do Tailwind em uma página — sempre brand/success/danger. */

body {
  margin: 0;
  font-family: 'Inter', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

## Task 3 — Criar/substituir `src/components/ui/Button.tsx`

```tsx
import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30',
  secondary:
    'bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200',
  ghost:
    'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  danger:
    'bg-danger-600 hover:bg-danger-700 text-white shadow-lg shadow-danger-500/20',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

/**
 * Button — único componente de botão do projeto.
 * Não criar `<button className="bg-...">` solto em nenhuma página;
 * sempre importar este componente para manter consistência visual.
 */
const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  return (
    <button
      className={`rounded-control font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
```

## Task 4 — Criar/substituir `src/components/ui/Card.tsx`

```tsx
import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

/**
 * Card — contêiner padrão para blocos de conteúdo (formulários, JobCard, etc).
 * Sempre usar este componente em vez de replicar
 * "bg-white dark:bg-slate-800 rounded-2xl shadow-xl..." manualmente.
 */
const Card: React.FC<CardProps> = ({ hoverable = false, className = '', children, ...props }) => {
  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-card shadow-card border border-slate-200 dark:border-slate-700 transition-all duration-300 ${
        hoverable ? 'hover:shadow-card-hover' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
```

## Task 5 — Criar/substituir `src/components/ui/Badge.tsx`

```tsx
import React from 'react';

type BadgeVariant = 'brand' | 'success' | 'danger' | 'neutral';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  brand: 'bg-brand-50 dark:bg-brand-950/20 text-brand-700 dark:text-brand-300 border-brand-100 dark:border-brand-900/30',
  success: 'bg-success-50 dark:bg-success-950/20 text-success-700 dark:text-success-300 border-success-100 dark:border-success-900/30',
  danger: 'bg-danger-50 dark:bg-danger-950/20 text-danger-700 dark:text-danger-300 border-danger-100 dark:border-danger-900/30',
  neutral: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700',
};

/**
 * Badge — usado para status, tags de modalidade (Remoto/Híbrido/Presencial),
 * e avisos inline (ex: "Componente temporário"). Substitui os
 * "p-4 bg-emerald-50 text-emerald-700..." que cada página inventava sozinha.
 */
const Badge: React.FC<BadgeProps> = ({ variant = 'neutral', className = '', children, ...props }) => {
  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm border font-medium ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
```

## Task 6 — Criar/substituir `src/components/ui/PageHeader.tsx`

```tsx
import React from 'react';
import Card from './Card';
import Badge from './Badge';

interface PageHeaderProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  note?: string;
  noteVariant?: 'brand' | 'success' | 'danger' | 'neutral';
  wide?: boolean;
}

/**
 * PageHeader — bloco padrão de cabeçalho para páginas ainda em construção
 * (ícone + título + descrição + aviso de status). Usado por Login, Cadastro,
 * Vagas, Perfil, Favoritos e Admin para manter o mesmo layout e as mesmas
 * cores em todas as páginas do projeto.
 */
const PageHeader: React.FC<PageHeaderProps> = ({
  icon,
  title,
  description,
  note,
  noteVariant = 'brand',
  wide = false,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
      <Card className={`${wide ? 'max-w-2xl' : 'max-w-md'} w-full p-8`} hoverable>
        <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-600 dark:text-brand-400">
          {icon}
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
          {title}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-6">{description}</p>
        {note && (
          <Badge variant={noteVariant} className="w-full justify-center py-3">
            {note}
          </Badge>
        )}
      </Card>
    </div>
  );
};

export default PageHeader;
```

## Task 7 — Criar/substituir `src/components/Layout.tsx`

```tsx
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Button from './ui/Button';
import Badge from './ui/Badge';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 flex flex-col font-sans">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/35">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-brand-600 to-brand-500 bg-clip-text text-transparent">
              Radar Estágio
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { path: '/vagas', label: 'Vagas' },
              { path: '/favoritos', label: 'Favoritos' },
              { path: '/perfil', label: 'Meu Perfil' },
              { path: '/admin', label: 'Painel Admin' },
            ].map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-control text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Auth Actions */}
          <div className="flex items-center gap-2">
            <NavLink to="/login">
              <Button variant="ghost" size="md">Entrar</Button>
            </NavLink>
            <NavLink to="/cadastro">
              <Button variant="primary" size="md">Cadastrar</Button>
            </NavLink>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-6 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} Radar Estágio. Todos os direitos reservados.
          </div>
          <div className="flex gap-4 items-center">
            <span className="hover:text-slate-800 dark:hover:text-white cursor-pointer transition-colors">Termos</span>
            <span className="hover:text-slate-800 dark:hover:text-white cursor-pointer transition-colors">Privacidade</span>
            <Badge variant="brand">Base Architecture</Badge>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
```

## Task 8 — Criar/substituir `src/pages/Login.tsx`

```tsx
import React from 'react';
import PageHeader from '../components/ui/PageHeader';

const Login: React.FC = () => {
  return (
    <PageHeader
      icon={
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        </svg>
      }
      title="Página de Login"
      description="Área de autenticação para estudantes e administradores."
      note="Componente temporário (Placeholder). A lógica de login e o formulário serão implementados na próxima etapa (UC02)."
    />
  );
};

export default Login;
```

## Task 9 — Criar/substituir `src/pages/Cadastro.tsx`

```tsx
import React from 'react';
import PageHeader from '../components/ui/PageHeader';

const Cadastro: React.FC = () => {
  return (
    <PageHeader
      icon={
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      }
      title="Página de Cadastro"
      description="Criação de novas contas para estudantes acessarem a plataforma."
      note="Componente temporário (Placeholder). A validação com Zod e a persistência via Supabase serão integradas na próxima etapa (UC01)."
    />
  );
};

export default Cadastro;
```

## Task 10 — Criar/substituir `src/pages/Vagas.tsx`

```tsx
import React from 'react';
import PageHeader from '../components/ui/PageHeader';

const Vagas: React.FC = () => {
  return (
    <PageHeader
      wide
      icon={
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      }
      title="Página de Vagas"
      description="Mural principal de oportunidades de estágio. Aqui os estudantes poderão pesquisar, filtrar por modalidade (Presencial, Remoto, Híbrido), área de atuação e favoritar suas vagas preferidas."
      note="Componente temporário (Placeholder). Os filtros e a integração com Supabase Database serão criados nas próximas etapas do projeto (UC03)."
    />
  );
};

export default Vagas;
```

## Task 11 — Criar/substituir `src/pages/Perfil.tsx`

```tsx
import React from 'react';
import PageHeader from '../components/ui/PageHeader';

const Perfil: React.FC = () => {
  return (
    <PageHeader
      icon={
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      }
      title="Página de Perfil"
      description="Área de gerenciamento de dados acadêmicos e pessoais do estudante."
      note="Componente temporário (Placeholder). Permitirá ao estudante visualizar e atualizar suas informações (RF03)."
    />
  );
};

export default Perfil;
```

## Task 12 — Criar/substituir `src/pages/Favoritos.tsx`

```tsx
import React from 'react';
import PageHeader from '../components/ui/PageHeader';

const Favoritos: React.FC = () => {
  return (
    <PageHeader
      icon={
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      }
      title="Página de Favoritos"
      description="Lista de vagas de estágio que o estudante salvou como interesse."
      note="Componente temporário (Placeholder). A relação N:M entre estudantes e vagas será mapeada na próxima etapa (UC04)."
    />
  );
};

export default Favoritos;
```

## Task 13 — Criar/substituir `src/pages/Admin.tsx`

```tsx
import React from 'react';
import PageHeader from '../components/ui/PageHeader';

const Admin: React.FC = () => {
  return (
    <PageHeader
      icon={
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      }
      title="Página de Administração"
      description="Painel de gerenciamento, cadastro e edição de vagas de estágio."
      note="Componente temporário (Placeholder). Proteção de rotas administrativa e RLS serão configuradas na entrega final (UC05)."
    />
  );
};

export default Admin;
```

## Task 14 — Criar/substituir `DESIGN_SYSTEM.md`

```md
# Design System — Radar Estágio

Este documento registra o Design System único do projeto, aplicado de forma consistente
em todas as páginas (exigência da disciplina Programação para Internet I).

## Problema identificado (antes desta padronização)

Cada página usava uma cor de destaque diferente, escolhida de forma aleatória:

| Página | Cor usada antes |
|---|---|
| Login | roxo (`purple`) |
| Vagas | verde-esmeralda (`emerald`) |
| Cadastro | azul (`blue`) |
| Perfil | âmbar (`amber`) |
| Favoritos | rosa (`pink`) |
| Administração | vermelho (`red`) |

Isso não é um Design System — é ausência de um. Um Design System exige que o mesmo
elemento (ex: "ícone de destaque de uma página") tenha sempre a mesma cor e o mesmo padrão
visual em todo o sistema.

## Paleta de cores (tokens em `tailwind.config.js`)

- **`brand`** (roxo, tons 50–900): cor primária única do projeto. Usada em botões
  primários, links ativos, ícones de destaque, badges informativos.
- **`success`** (verde): reservada para confirmações e estados positivos (ex: vaga
  favoritada com sucesso, cadastro concluído).
- **`danger`** (vermelho): reservada para erros de validação e ações destrutivas (ex:
  excluir vaga, erro de login).

Regra do projeto: **nenhuma página usa cores soltas do Tailwind** (`purple-600`,
`emerald-100`, `blue-50` etc. diretamente). Toda cor vem de `brand`, `success` ou `danger`.

## Tipografia

- Fonte única: **Inter** (importada via Google Fonts em `src/index.css`), aplicada
  globalmente pelo `fontFamily.sans` no `tailwind.config.js`.
- Hierarquia usada nos componentes: `text-3xl font-extrabold` para títulos de página,
  `text-sm` para texto de apoio, `font-semibold` para botões e links de navegação.

## Componentes reutilizáveis (`src/components/ui/`)

| Componente | Uso |
|---|---|
| `Button.tsx` | Único componente de botão do projeto. Variantes: `primary`, `secondary`, `ghost`, `danger`. Tamanhos: `sm`, `md`, `lg`. |
| `Card.tsx` | Contêiner padrão para blocos de conteúdo (formulários, cartões de vaga). |
| `Badge.tsx` | Tags de status/aviso. Variantes: `brand`, `success`, `danger`, `neutral`. |
| `PageHeader.tsx` | Cabeçalho padrão de página (ícone + título + descrição + aviso), usado pelos placeholders de Login, Cadastro, Vagas, Perfil, Favoritos e Admin. |

## Espaçamento e forma

- `borderRadius.card` (16px): usado em `Card`.
- `borderRadius.control` (12px): usado em `Button` e será usado em `Input`.
- `boxShadow.card` / `boxShadow.card-hover`: sombra padrão de card, com variação em hover.

## Correção de bug encontrada durante a padronização

O `Layout.tsx` usava a classe `bg-slate-550`, que não existe na escala padrão do Tailwind
(vai de 50 em 50 até 900, sem "550"). A classe não tinha efeito nenhum — foi corrigida
para `bg-slate-50`.

## Como usar em novos componentes

Ao criar uma nova página ou componente (ex: `JobCard.tsx`, `SearchBar.tsx`), sempre:
1. Importar `Button`, `Card` ou `Badge` de `src/components/ui/` em vez de escrever
   `className` com cores soltas.
2. Se precisar de uma cor que não existe nos tokens, adicionar ao `tailwind.config.js`
   (seção `theme.extend.colors`) em vez de usar uma cor do Tailwind padrão diretamente.
```

