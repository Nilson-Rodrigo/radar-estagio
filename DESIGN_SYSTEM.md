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
| `slate` (escala neutra do Tailwind) | Textos, bordas e superfícies neutras no tema claro |

Regra do projeto: o acento da marca vem sempre do token `radar`; cores semânticas de estado vêm de `success` (confirmações) e `danger` (erros/ações destrutivas); seções escuras usam a escala `ink`. Para textos, bordas e superfícies neutras usa-se a escala `slate` do Tailwind, de forma consistente em todo o app. Não se usam cores decorativas soltas fora desse conjunto (ex.: `purple-*`, `pink-*`, `blue-*`, `amber-*`, ou valores hex arbitrários como `bg-[#f9fcfa]`).

## Tipografia

- **Corpo:** Inter (`font-sans`) — legibilidade em textos longos e formulários.
- **Títulos e logo:** Space Grotesk (`font-display`) — grotesca técnica que
  remete a instrumento/painel, usada com moderação (só em títulos e no
  wordmark do logo, nunca no corpo de texto).

## Assinatura visual

O `RadarIcon` (`src/shared/ui/RadarIcon.tsx`) é o elemento único e
memorável do projeto: dois arcos concêntricos (alcance de varredura), uma
linha de varredura e dois pontos (o centro do radar e um "blip" — a vaga
detectada). Usado no logo do `Layout.tsx`; pode ser reaproveitado como
indicador de carregamento no lugar de um spinner genérico, se fizer sentido
futuramente.

**Restrição deliberada:** nenhuma animação de varredura contínua/piscando.
Excesso de movimento decorativo é, por si só, um dos sinais mais comuns de
interface "gerada por IA sem direção". O único movimento é sutil, em hover.

## Componentes reutilizáveis (`src/shared/ui/`)

| Componente | Uso |
|---|---|
| `RadarIcon.tsx` | Assinatura visual — logo e possíveis indicadores futuros |
| `Button.tsx` | Variantes: `primary` (fundo `radar-500`, texto `ink-900` — alto contraste, como um alerta luminoso de painel), `secondary`, `ghost`, `danger` |
| `Card.tsx` | Fundo `ink-800` no modo escuro, `rounded-card`, `shadow-card` |
| `Badge.tsx` | Variantes `brand` (mapeada para `radar`), `success`, `danger`, `neutral` |
| `PageHeader.tsx` | Cabeçalho padrão dos placeholders de página, título em `font-display` |
| `PasswordStrength.tsx` | Medidor visual de força de senha (usado em cadastro e redefinição de senha) |
| `ProtectedRoute.tsx` | Protege rotas que exigem autenticação/role (ex.: /admin, /perfil, /favoritos) |

## Correções acumuladas nesta padronização

- `Layout.tsx`: removida a classe inválida `bg-slate-550` (não existe na escala
  do Tailwind).
- `Vagas.tsx` (versão da Ana Rosa): removida a classe inválida
  `dark:text-slate-355` (mesmo tipo de erro).
- `JobCard.tsx`, `SearchBar.tsx`, `Filters.tsx`: cores soltas (`purple`,
  `emerald`, `amber`, `blue`, `pink`) substituídas pelos tokens `radar` e pelos
  componentes `Card`/`Badge`.
- Painel administrativo (`AdminPanel.tsx`, `VagasTable.tsx`, `NovaVagaModal.tsx`): removidos valores hex arbitrários (ex.: `#f9fcfa`, `#d8eadf`) e cores soltas `emerald-*`/`red-*`, substituídos pelos tokens `success`/`danger`, pela escala neutra `slate` e pelo botão primário `radar`.

## Como usar em novos componentes

1. Nunca escrever uma cor do Tailwind padrão direto num `className`. Se
   precisar de uma cor nova, adicionar como token em `tailwind.config.js`.
2. Reaproveitar `Button`, `Card`, `Badge` em vez de recriar
   `className="bg-... rounded-... shadow-..."` do zero.
3. Títulos usam `font-display`; texto de apoio/parágrafo usa a fonte padrão
   (`font-sans`, já aplicada globalmente pelo `body`).