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