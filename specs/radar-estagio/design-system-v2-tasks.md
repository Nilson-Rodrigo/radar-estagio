# Tasks — Nova Identidade Visual "Radar" (v2 do Design System)

> Instrução para o agente: crie/substitua CADA arquivo abaixo com o conteúdo
> EXATO fornecido no bloco de código correspondente. Não altere, resuma ou
> 'melhore' o conteúdo — apenas grave os arquivos nos caminhos indicados,
> criando pastas que não existirem. Um arquivo é novo (RadarIcon.tsx) —
> os demais substituem versões já existentes no projeto.

## Criar/substituir `tailwind.config.js`

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
      // Identidade: tela de radar/sonar. Fundo grafite quase-preto (não azul-marinho
      // genérico), acento único verde-fósforo (não roxo — evita o clichê visual de IA).
      colors: {
        // Verde-fósforo — cor primária: botões, links ativos, ícones de destaque,
        // e o "blip" (ponto detectado) do logo.
        radar: {
          50: '#EAFBF4',
          100: '#CDF3E1',
          200: '#9CE7C3',
          300: '#64D5A0',
          400: '#3ABF85',
          500: '#22D48A',
          600: '#17A86C',
          700: '#127F54',
          800: '#0D5C3D',
          900: '#083D29',
        },
        // Fundo/superfície — grafite com leve matiz esverdeado, no lugar do
        // slate/navy padrão de qualquer template de IA.
        ink: {
          900: '#0B0F0D', // fundo geral (header, footer, body)
          800: '#121712', // superfície de cards
          700: '#1B221C', // bordas/divisórias sutis
        },
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          600: '#059669',
          700: '#047857',
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          600: '#dc2626',
          700: '#b91c1c',
        },
      },
      fontFamily: {
        // Corpo de texto: legibilidade.
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        // Títulos/logo: grotesca técnica, remete a painel/instrumento (radar),
        // usada com moderação — não em todo o texto.
        display: ['"Space Grotesk"', '"Inter"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '1rem',
        control: '0.75rem',
      },
      boxShadow: {
        card: '0 4px 6px -1px rgb(34 212 138 / 0.06), 0 2px 4px -2px rgb(34 212 138 / 0.06)',
        'card-hover': '0 10px 15px -3px rgb(34 212 138 / 0.12), 0 4px 6px -4px rgb(34 212 138 / 0.1)',
      },
    },
  },
  plugins: [],
}
```

## Criar/substituir `src/index.css`

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

/* Design System — Radar Estágio (identidade "tela de radar")
   Regra: acento é SEMPRE `radar` (verde-fósforo). success/danger só para
   estados semânticos. Fundo escuro usa `ink`, não slate/navy genérico.
   Nunca usar purple/emerald/blue/amber/pink direto do Tailwind. */

body {
  margin: 0;
  font-family: 'Inter', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

## Criar/substituir `src/components/ui/RadarIcon.tsx`

```tsx
import React from 'react';

interface RadarIconProps {
  className?: string;
}

/**
 * RadarIcon — assinatura visual do produto: arcos concêntricos (o "alcance"
 * de varredura), uma linha de varredura e um blip (ponto detectado = uma
 * vaga encontrada). Substitui qualquer ícone genérico (olho, lupa, etc.)
 * que não tenha relação com o conceito de "radar".
 */
const RadarIcon: React.FC<RadarIconProps> = ({ className = 'w-5 h-5' }) => {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Arcos concêntricos — alcance do radar */}
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="5.5" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.5" />
      {/* Linha de varredura */}
      <path d="M12 12L18.5 7.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      {/* Centro do radar */}
      <circle cx="12" cy="12" r="1.4" fill="currentColor" />
      {/* Blip — vaga detectada */}
      <circle cx="16" cy="9" r="1.3" fill="currentColor" />
    </svg>
  );
};

export default RadarIcon;
```

## Criar/substituir `src/components/ui/Button.tsx`

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
    'bg-radar-500 hover:bg-radar-600 text-ink-900 font-bold shadow-lg shadow-radar-500/20 hover:shadow-radar-500/30',
  secondary:
    'bg-radar-500/10 hover:bg-radar-500/20 text-radar-500 border border-radar-500/30',
  ghost:
    'text-slate-300 hover:bg-white/5 hover:text-white',
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
 * variant="primary" usa texto escuro sobre verde-fósforo (contraste alto,
 * como um alerta luminoso de painel), nunca texto branco sobre a cor de acento.
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

## Criar/substituir `src/components/ui/Card.tsx`

```tsx
import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

/**
 * Card — contêiner padrão. Fundo `ink-800` (grafite), não slate/navy —
 * mantém a coerência com a tela de radar mesmo em componentes de conteúdo.
 */
const Card: React.FC<CardProps> = ({ hoverable = false, className = '', children, ...props }) => {
  return (
    <div
      className={`bg-white dark:bg-ink-800 rounded-card shadow-card border border-slate-200 dark:border-ink-700 transition-all duration-300 ${
        hoverable ? 'hover:shadow-card-hover hover:border-radar-500/20' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
```

## Criar/substituir `src/components/ui/Badge.tsx`

```tsx
import React from 'react';

type BadgeVariant = 'brand' | 'success' | 'danger' | 'neutral';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

// Nome da variante "brand" mantido por compatibilidade com o código já
// existente (JobCard, PageHeader) — internamente usa os tokens "radar".
const variantStyles: Record<BadgeVariant, string> = {
  brand: 'bg-radar-500/10 dark:bg-radar-500/10 text-radar-600 dark:text-radar-400 border-radar-500/20',
  success: 'bg-success-50 dark:bg-success-950/20 text-success-700 dark:text-success-300 border-success-100 dark:border-success-900/30',
  danger: 'bg-danger-50 dark:bg-danger-950/20 text-danger-700 dark:text-danger-300 border-danger-100 dark:border-danger-900/30',
  neutral: 'bg-slate-100 dark:bg-ink-700/50 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-ink-700',
};

/** Badge — status, tags de modalidade, avisos inline. */
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

## Criar/substituir `src/components/ui/PageHeader.tsx`

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
        <div className="w-16 h-16 bg-radar-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-radar-500">
          {icon}
        </div>
        <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
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

## Criar/substituir `src/components/Layout.tsx`

```tsx
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Button from './ui/Button';
import Badge from './ui/Badge';
import RadarIcon from './ui/RadarIcon';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-ink-900 text-slate-800 dark:text-slate-200 flex flex-col font-sans">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-ink-900/80 backdrop-blur-md border-b border-slate-200 dark:border-ink-700 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-radar-500 rounded-xl flex items-center justify-center shadow-lg shadow-radar-500/25">
              <RadarIcon className="w-5 h-5 text-ink-900" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-slate-900 dark:text-white">
              Radar<span className="text-radar-500">Estágio</span>
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
                      ? 'bg-radar-500/10 text-radar-600 dark:text-radar-400'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
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
      <footer className="border-t border-slate-200 dark:border-ink-700 bg-white dark:bg-ink-900 py-6 transition-all duration-300">
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

## Criar/substituir `src/components/JobCard.tsx`

```tsx
import React from 'react';
import type { Job } from '../types/Job';
import Card from './ui/Card';
import Badge from './ui/Badge';

interface JobCardProps {
  job: Job;
  favoritado: boolean;
  onToggleFavorito: (jobId: string) => void;
}

const variantePorModalidade: Record<Job['modalidade'], 'success' | 'brand' | 'neutral'> = {
  Remoto: 'success',
  Híbrido: 'brand',
  Presencial: 'neutral',
};

/** Cartão individual de vaga (RF07 - Visualização de Detalhes / UC04 - Favoritar). */
const JobCard: React.FC<JobCardProps> = ({ job, favoritado, onToggleFavorito }) => {
  return (
    <Card hoverable className="p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{job.titulo}</h3>
          <p className="text-sm font-semibold text-radar-600 dark:text-radar-400">{job.empresa}</p>
        </div>
        <button
          onClick={() => onToggleFavorito(job.id)}
          aria-label={favoritado ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full hover:bg-radar-500/10 transition-all duration-200"
        >
          <svg
            className={`w-6 h-6 transition-all duration-200 ${favoritado ? 'fill-radar-500 text-radar-500' : 'fill-none text-slate-400'}`}
            stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 line-clamp-2">{job.descricao}</p>
      <div className="flex flex-wrap items-center gap-2 mt-4">
        <Badge variant="neutral">{job.cidade}</Badge>
        <Badge variant={variantePorModalidade[job.modalidade]}>{job.modalidade}</Badge>
        <Badge variant="neutral">{job.area_atuacao}</Badge>
      </div>
      <a
        href={job.link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-4 text-sm font-semibold text-radar-600 dark:text-radar-400 hover:underline"
      >
        Ver vaga original →
      </a>
    </Card>
  );
};

export default JobCard;
```

## Criar/substituir `src/components/SearchBar.tsx`

```tsx
import React from 'react';

interface SearchBarProps {
  valor: string;
  onChange: (valor: string) => void;
}

/**
 * Barra de busca textual (UC03, fluxo principal). Componente puramente
 * visual — toda a lógica de filtragem fica no hook useJobs.
 */
const SearchBar: React.FC<SearchBarProps> = ({ valor, onChange }) => {
  return (
    <div className="relative w-full">
      <svg
        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
        fill="none" stroke="currentColor" viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar por cargo, empresa ou palavra-chave..."
        className="w-full pl-12 pr-4 py-3 rounded-control bg-white dark:bg-ink-800 border border-slate-200 dark:border-ink-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-radar-500 transition-all duration-200"
      />
    </div>
  );
};

export default SearchBar;
```

## Criar/substituir `src/components/Filters.tsx`

```tsx
import React from 'react';
import type { JobFilters } from '../services/jobs.service';
import type { FilterOptions } from '../services/jobs.service';

interface FiltersProps {
  filters: JobFilters;
  opcoes: FilterOptions;
  onAlterarFiltro: (campo: keyof JobFilters, valor: string) => void;
  onLimparFiltros: () => void;
}

/**
 * Filtros combinados por cidade, modalidade, empresa e área (UC03/RF06).
 * O botão "Limpar Filtros" implementa o Fluxo Alternativo FA01 do UC03.
 */
const Filters: React.FC<FiltersProps> = ({ filters, opcoes, onAlterarFiltro, onLimparFiltros }) => {
  const baseSelect =
    'px-4 py-2 rounded-control bg-white dark:bg-ink-800 border border-slate-200 dark:border-ink-700 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-radar-500 transition-all duration-200';

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select className={baseSelect} value={filters.cidade} onChange={(e) => onAlterarFiltro('cidade', e.target.value)}>
        <option value="">Todas as cidades</option>
        {opcoes.cidades.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <select className={baseSelect} value={filters.modalidade} onChange={(e) => onAlterarFiltro('modalidade', e.target.value)}>
        <option value="">Todas as modalidades</option>
        {opcoes.modalidades.map((m) => <option key={m} value={m}>{m}</option>)}
      </select>
      <select className={baseSelect} value={filters.empresa} onChange={(e) => onAlterarFiltro('empresa', e.target.value)}>
        <option value="">Todas as empresas</option>
        {opcoes.empresas.map((e) => <option key={e} value={e}>{e}</option>)}
      </select>
      <select className={baseSelect} value={filters.areaAtuacao} onChange={(e) => onAlterarFiltro('areaAtuacao', e.target.value)}>
        <option value="">Todas as áreas</option>
        {opcoes.areasAtuacao.map((a) => <option key={a} value={a}>{a}</option>)}
      </select>
      <button
        onClick={onLimparFiltros}
        className="px-4 py-2 rounded-control text-sm font-semibold text-radar-600 dark:text-radar-400 hover:bg-radar-500/10 transition-all duration-200"
      >
        Limpar Filtros
      </button>
    </div>
  );
};

export default Filters;
```

## Criar/substituir `DESIGN_SYSTEM.md`

```md
# Design System — Radar Estágio

## Por que mudamos de identidade

A primeira versão deste Design System (roxo sobre fundo escuro, ícone de olho no
logo) resolvia a inconsistência entre páginas, mas tinha um problema mais de fundo:
era visualmente genérica — roxo/violeta sobre navy escuro é hoje a paleta mais
repetida em qualquer interface gerada por IA, e o ícone de olho não tinha nenhuma
relação com o conceito de "radar". Não bastava corrigir a inconsistência; faltava
uma identidade que realmente fosse deste projeto.

## Conceito

**Radar Estágio detecta oportunidades — então a interface parece uma tela de
radar/sonar.** Fundo grafite quase-preto (não azul-marinho genérico), um único
acento em verde-fósforo (a cor clássica de tela de radar), e um logo que é
literalmente um radar: arcos concêntricos, linha de varredura e um "blip"
representando uma vaga detectada.

## Paleta de cores (tokens em `tailwind.config.js`)

| Token | Uso |
|---|---|
| `radar` (50–900, fósforo verde, primária em `500`) | Botões, links ativos, ícones de destaque, o "blip" do logo |
| `ink` (`900` fundo, `800` superfície de card, `700` bordas) | Substitui slate/navy no modo escuro — dá o tom "grafite de painel" |
| `success` (verde) | Confirmações (ex: vaga favoritada) |
| `danger` (vermelho) | Erros e ações destrutivas |

Regra do projeto: nenhuma página usa cores soltas do Tailwind (`purple-*`,
`emerald-*`, `pink-*`, `blue-*`, `amber-*`). Toda cor vem de `radar`, `ink`,
`success` ou `danger`.

## Tipografia

- **Corpo:** Inter (`font-sans`) — legibilidade em textos longos e formulários.
- **Títulos e logo:** Space Grotesk (`font-display`) — grotesca técnica que
  remete a instrumento/painel, usada com moderação (só em títulos e no
  wordmark do logo, nunca no corpo de texto).

## Assinatura visual

O `RadarIcon` (`src/components/ui/RadarIcon.tsx`) é o elemento único e
memorável do projeto: dois arcos concêntricos (alcance de varredura), uma
linha de varredura e dois pontos (o centro do radar e um "blip" — a vaga
detectada). Usado no logo do `Layout.tsx`; pode ser reaproveitado como
indicador de carregamento no lugar de um spinner genérico, se fizer sentido
futuramente.

**Restrição deliberada:** nenhuma animação de varredura contínua/piscando.
Excesso de movimento decorativo é, por si só, um dos sinais mais comuns de
interface "gerada por IA sem direção". O único movimento é sutil, em hover.

## Componentes reutilizáveis (`src/components/ui/`)

| Componente | Uso |
|---|---|
| `RadarIcon.tsx` | Assinatura visual — logo e possíveis indicadores futuros |
| `Button.tsx` | Variantes: `primary` (fundo `radar-500`, texto `ink-900` — alto contraste, como um alerta luminoso de painel), `secondary`, `ghost`, `danger` |
| `Card.tsx` | Fundo `ink-800` no modo escuro, `rounded-card`, `shadow-card` |
| `Badge.tsx` | Variantes `brand` (mapeada para `radar`), `success`, `danger`, `neutral` |
| `PageHeader.tsx` | Cabeçalho padrão dos placeholders de página, título em `font-display` |

## Correções acumuladas nesta padronização

- `Layout.tsx`: removida a classe inválida `bg-slate-550` (não existe na escala
  do Tailwind).
- `Vagas.tsx` (versão da Ana Rosa): removida a classe inválida
  `dark:text-slate-355` (mesmo tipo de erro).
- `JobCard.tsx`, `SearchBar.tsx`, `Filters.tsx`: cores soltas (`purple`,
  `emerald`, `amber`, `blue`, `pink`) substituídas pelos tokens `radar` e pelos
  componentes `Card`/`Badge`.

## Como usar em novos componentes

1. Nunca escrever uma cor do Tailwind padrão direto num `className`. Se
   precisar de uma cor nova, adicionar como token em `tailwind.config.js`.
2. Reaproveitar `Button`, `Card`, `Badge` em vez de recriar
   `className="bg-... rounded-... shadow-..."` do zero.
3. Títulos usam `font-display`; texto de apoio/parágrafo usa a fonte padrão
   (`font-sans`, já aplicada globalmente pelo `body`).
```

