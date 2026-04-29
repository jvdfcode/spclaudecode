# Halo — Design System

> Uma linguagem visual de cinco cores.
> Versão 1.0.0 · Abril 2026

Halo é um design system construído sobre uma paleta restrita: **preto, azul-marinho, laranja, cinza e branco**. Cada componente, token e padrão deriva dessas cinco âncoras — disciplina cromática que garante consistência em qualquer produto.

---

## Sumário

1. [Princípios](#1-princípios)
2. [Marca](#2-marca)
3. [Cor](#3-cor)
4. [Tipografia](#4-tipografia)
5. [Espaçamento](#5-espaçamento)
6. [Raios](#6-raios)
7. [Elevação & Sombras](#7-elevação--sombras)
8. [Iconografia](#8-iconografia)
9. [Componentes](#9-componentes)
10. [Padrões de aplicação](#10-padrões-de-aplicação)
11. [Tokens (referência completa)](#11-tokens-referência-completa)
12. [Acessibilidade](#12-acessibilidade)
13. [Changelog](#13-changelog)

---

## 1. Princípios

Quatro convicções guiam toda decisão dentro do Halo.

### i. Restrição é estilo
Cinco cores, duas famílias tipográficas, uma escala. A disciplina é o que torna o sistema reconhecível em qualquer escala. Quando em dúvida, **remova** antes de adicionar.

### ii. Hierarquia por contraste
Laranja é sempre um sinal — nunca decoração. O navy ancora; o cinza respira; o branco descansa. Uso intencional, sempre.

### iii. Geometria amável
Cantos generosos (16–32 px), círculos perfeitos para ações, linhas finas. Forma que **convida** em vez de instruir.

### iv. Dado em primeiro lugar
Componentes são feitos para mostrar números, gráficos e listas com clareza editorial — não para enfeitar a interface.

---

## 2. Marca

### Nome
**Halo** — referência ao halo de luz que destaca um elemento focal contra um fundo escuro. É a metáfora do nosso uso do laranja.

### Logo
- Marca-símbolo: caractere `H` em **Bricolage Grotesque 800**, dentro de um quadrado com raio `r-sm` (10 px).
- Cor da marca-símbolo: **Solar (#FCA311)** sobre **Onyx (#000000)** ou **Eclipse (#14213D)**.
- Espaço de respiro mínimo: equivalente à altura do `H`.

### Tagline
> *"Construído com 5 cores. Mantido com disciplina."*

---

## 3. Cor

### 3.1 Cinco âncoras

A paleta inteira do Halo é construída a partir destas cinco cores. Toda variação tonal é derivação matemática delas — nunca cores estranhas ao sistema.

| Token | Hex | Nome | Papel |
|---|---|---|---|
| `--halo-black` | `#000000` | **Onyx** | Tipografia primária, ações destrutivas |
| `--halo-navy` | `#14213D` | **Eclipse** | Marca, superfícies escuras, hierarquia |
| `--halo-orange` | `#FCA311` | **Solar** | Acento, sinal, ação principal |
| `--halo-gray` | `#E5E5E5` | **Mist** | Linhas, divisores, fundos neutros |
| `--halo-white` | `#FFFFFF` | **Blanc** | Canvas base, superfícies elevadas |

### 3.2 Escalas tonais

Geradas a partir das âncoras para cobrir estados, hover, fundos suaves e texto secundário.

#### Eclipse (`--halo-navy-*`)
| Step | Hex | Uso |
|---|---|---|
| 100 | `#14213D` | Cor base |
| 90  | `#1E2B4D` | Hover sobre Eclipse |
| 80  | `#2A3A5E` | Bordas internas, divisores em superfícies escuras |
| 60  | `#5A6680` | Texto secundário inverso |
| 40  | `#8C95A8` | Caption inverso, metadados |
| 20  | `#C5CAD4` | Texto desabilitado inverso |
| 10  | `#EAEDF2` | Apenas como fundo decorativo |

#### Solar (`--halo-orange-*`)
| Step | Hex | Uso |
|---|---|---|
| 100 | `#C97F08` | Pressed / ativa |
| 90  | `#E2920C` | Hover do botão primário |
| 80  | `#FCA311` | Cor base — ação primária |
| 30  | `#FED48A` | Bordas de foco |
| 15  | `#FEEAC4` | Anel de foco, fundo de badge |
| 05  | `#FFF8EA` | Fundo de toast / card |

#### Mist (`--halo-gray-*`)
| Step | Hex | Uso |
|---|---|---|
| 90  | `#6E6E6E` | Texto secundário |
| 70  | `#B5B5B5` | Texto em estado disabled |
| 50  | `#9A9A9A` | Borda em estado disabled |
| 30  | `#D0D0D0` | Hover de borda |
| 20  | `#E5E5E5` | Borda padrão (`--line`) |
| 15  | `#F2F2F2` | Hover de linha em tabela |
| 05  | `#FAFAFA` | Background da página |

### 3.3 Tokens semânticos

Use estes em código — nunca referencie cor crua.

```css
--bg:           var(--halo-gray-05);   /* fundo da página */
--bg-elevated:  var(--halo-white);     /* cards, modais   */
--bg-inverse:   var(--halo-navy);      /* superfície escura */
--bg-accent:    var(--halo-orange);    /* destaque        */
--ink:          var(--halo-black);     /* texto principal */
--ink-soft:     var(--halo-navy-60);   /* texto secundário*/
--ink-inverse:  var(--halo-white);     /* texto sobre escuro */
--line:         var(--halo-gray);      /* divisor padrão  */
--line-soft:    var(--halo-gray-15);   /* divisor sutil   */
```

### 3.4 Proporção 60·30·8·2

Em qualquer tela do Halo:

- **60%** Blanc & Mist — neutralidade, respiro
- **30%** Mist — linhas, fundos secundários
- **8%** Eclipse — hierarquia, marca, superfícies escuras
- **2%** Solar — sinais e ações primárias

> Se você está usando mais de 2% de laranja, provavelmente está usando **errado**.

### 3.5 Combinações aprovadas

| Fundo | Texto | Contraste | Status |
|---|---|---|---|
| Blanc | Onyx | 21.0 | ✅ AAA |
| Blanc | Eclipse | 13.7 | ✅ AAA |
| Eclipse | Blanc | 13.7 | ✅ AAA |
| Eclipse | Solar | 8.4 | ✅ AAA |
| Solar | Onyx | 11.2 | ✅ AAA |
| Mist | Eclipse | 11.5 | ✅ AAA |

### 3.6 Combinações proibidas

| Fundo | Texto | Contraste | Por quê |
|---|---|---|---|
| Solar | Blanc | 1.9 | ❌ Falha em qualquer tamanho |
| Mist | Blanc | 1.4 | ❌ Ilegível |
| Eclipse | Mist | 4.0 | ⚠️ Apenas body ≥18 px |
| Solar | Mist | 1.5 | ❌ Ilegível |

---

## 4. Tipografia

### 4.1 Famílias

| Token | Família | Uso |
|---|---|---|
| `--font-display` | **Bricolage Grotesque** (300–800) | Títulos, heroes, números grandes |
| `--font-body` | **Bricolage Grotesque** (400–600) | Corpo de texto, UI |
| `--font-serif` | **Instrument Serif** (italic) | Acentos editoriais, palavras-destaque |
| `--font-mono` | **JetBrains Mono** (400/500/700) | Dados, labels, metadados, código |

> Bricolage Grotesque foi escolhida pela personalidade humana das curvas e pela variabilidade de peso. Instrument Serif fornece um contraste editorial inesperado nos momentos certos. Nada de Inter, Roboto ou system fonts.

### 4.2 Escala

| Estilo | Tamanho | Line-height | Tracking | Peso | Uso |
|---|---|---|---|---|---|
| Display 01 | 84 px | 0.92 | -0.04 em | 800 | Hero único da página |
| Display 02 | 64 px | 0.95 | -0.035 em | 700 | Headline de seção principal |
| Display Serif | 64 px | 1.0 | -0.02 em | 400 italic | Acento dentro do display |
| Heading 1 | 40 px | 1.05 | -0.025 em | 700 | Título de seção |
| Heading 2 | 28 px | 1.15 | -0.015 em | 600 | Subseção |
| Heading 3 | 20 px | 1.25 | 0 | 600 | Card / panel title |
| Body Large | 18 px | 1.55 | 0 | 400 | Lead, intro paragraph |
| Body Medium | 15 px | 1.6 | 0 | 400 | Texto padrão |
| Body Small | 13 px | 1.55 | 0 | 400 | Auxiliar, descrições |
| Caption | 11 px | 1.4 | 0.12 em | 500 | Labels, metadados (mono) |
| Numeric Display | 56 px | 1 | -0.03 em | 700 | KPIs, valores grandes |

### 4.3 Regras de uso

- **Tabular numbers** sempre em `--font-mono` para tabelas e KPIs (alinhamento vertical de dígitos).
- **Italic** apenas em `--font-serif` — nunca em sans.
- Body nunca abaixo de 13 px.
- Tracking negativo (`-0.025` a `-0.04 em`) em todos os displays para parecer mais editorial.
- Tracking positivo (`+0.12 em`) e UPPERCASE apenas em captions/labels mono.

---

## 5. Espaçamento

Escala baseada em **4 px**. Nove passos cobrem do micro-detalhe ao layout de página.

| Token | Valor | Uso típico |
|---|---|---|
| `--s-1` | 4 px | Gap entre ícone e dot |
| `--s-2` | 8 px | Gap entre ícone e label |
| `--s-3` | 12 px | Padding interno de chips, gap em row |
| `--s-4` | 16 px | Padding de card pequeno, gap entre campos |
| `--s-5` | 24 px | Padding de panel, gap entre cards |
| `--s-6` | 32 px | Margin entre seções de card |
| `--s-7` | 48 px | Padding de hero, margem entre seções |
| `--s-8` | 64 px | Padding vertical de hero |
| `--s-9` | 96 px | Margem entre grandes blocos de página |

### Regras
- Sempre múltiplos de 4.
- Em layouts: prefira `--s-5` (24 px) como gap padrão de grid.
- Em forms: `--s-4` (16 px) entre campos.
- Em hero: `--s-7` ou `--s-8`.

---

## 6. Raios

Halo prefere cantos generosos. Forma que convida.

| Token | Valor | Uso |
|---|---|---|
| `--r-xs` | 6 px | Chip mono pequeno, indicadores |
| `--r-sm` | 10 px | Tag, badge retangular |
| `--r-md` | 16 px | Input, file row, toast |
| `--r-lg` | 24 px | Card, panel padrão |
| `--r-xl` | 32 px | Card de destaque, dashboard root |
| `--r-2xl` | 48 px | Hero, container externo |
| `--r-pill` | 999 px | Botões, badges arredondados, search |

### Regras
- Botões são **sempre** `--r-pill`.
- Cards padrão usam `--r-lg`.
- Modais e drawers usam `--r-xl`.
- Nunca raio zero — Halo não tem cantos vivos.

---

## 7. Elevação & Sombras

Sombras existem apenas para **criar foco**, nunca decoração.

| Token | Valor | Uso |
|---|---|---|
| `--shadow-sm` | `0 1px 2px rgba(20,33,61,.06), 0 1px 1px rgba(20,33,61,.04)` | Cards rasos, linhas |
| `--shadow-md` | `0 4px 12px rgba(20,33,61,.08), 0 2px 4px rgba(20,33,61,.04)` | Botão hover, toast |
| `--shadow-lg` | `0 12px 32px rgba(20,33,61,.10), 0 4px 8px rgba(20,33,61,.05)` | Menu, popover, dropdown |
| `--shadow-xl` | `0 28px 64px rgba(20,33,61,.18), 0 8px 16px rgba(20,33,61,.08)` | Modal, drawer |
| `--shadow-glow` | `0 8px 32px rgba(252,163,17,.35)` | **Apenas** no hover do botão primário |

### Regras
- Sombras sempre coloridas com Eclipse, nunca preto puro.
- `--shadow-glow` é exclusivo do botão primário em hover.
- Em dark surfaces: nunca use sombra. Use borda em `--halo-navy-90`.

---

## 8. Iconografia

### Especificação técnica
- **Tamanho base**: 24 × 24 px
- **Stroke width**: 1.75 px
- **Cantos**: arredondados (`stroke-linecap: round`, `stroke-linejoin: round`)
- **Estilo**: outline / linear, nunca preenchido
- **Cor padrão**: Eclipse sobre fundo claro · Solar sobre fundo escuro
- **Cor em hover**: Onyx sobre fundo Solar

### Convenções
- Sempre exportados como SVG inline (sem fonte de ícones).
- `viewBox="0 0 24 24"` obrigatório.
- Sem fill em paths — apenas stroke.
- Geometria simples: prefira poucas linhas a detalhes.

### Conjunto base (24 ícones)
search · bell · user · settings · grid · chart · folder · clock · check · plus · arrow-right · filter · download · upload · heart · star · mail · message · link · calendar · play · trash · edit · globe

---

## 9. Componentes

### 9.1 Botões

#### Variantes
| Variante | Fundo | Texto | Borda | Uso |
|---|---|---|---|---|
| **Primary** | Solar | Onyx | — | Ação principal da tela (uma por vez) |
| **Secondary** | Eclipse | Blanc | — | Ação secundária |
| **Ghost** | Transparent | Onyx | Mist | Ação terciária, "Cancelar" |
| **Danger** | Onyx | Solar | Solar | Ação destrutiva |

#### Tamanhos
| Tamanho | Padding | Font |
|---|---|---|
| `btn--sm` | 8 × 14 px | 12 px |
| `btn` (default) | 12 × 20 px | 14 px |
| `btn--lg` | 16 × 28 px | 16 px |
| `btn--icon` | 12 × 12 px | quadrado |

#### Estados
- **Default** → cor base
- **Hover** → background-90 + `--shadow-glow` (apenas primary)
- **Active** → background-100, translateY(1px)
- **Loading** → mesmo background, ícone spinner, `cursor: not-allowed`
- **Disabled** → background Mist, texto Mist-50, `cursor: not-allowed`

### 9.2 Inputs

| Propriedade | Valor |
|---|---|
| Altura | 48 px (`14px 16px` padding) |
| Borda | 1 px Mist |
| Raio | `--r-md` (16 px) |
| Foco | borda Solar + ring `--halo-orange-15` (4 px) |
| Label | mono 10 px, uppercase, tracking 0.12 em |

#### Variantes
- `input` — padrão
- `input--search` — pill, ícone interno, fundo `--halo-gray-05`
- `textarea` — mesma definição, altura livre
- `select` — mesma definição, chevron à direita

### 9.3 Toggle / Checkbox / Radio

#### Toggle
- Trilho: 44 × 24 px, raio pill
- Off: fundo Mist · On: fundo Solar
- Knob: círculo 18 px Blanc, sombra `--shadow-sm`
- Transição: 200 ms ease

#### Checkbox
- Quadrado 22 × 22 px, raio 7 px
- Off: borda 2 px Eclipse, fundo Blanc
- On: fundo Solar, borda Solar, check em Onyx

### 9.4 Badges

| Variante | Background | Foreground | Uso |
|---|---|---|---|
| `badge--paid` | `--halo-orange-15` | `--halo-orange-80` | Sucesso financeiro |
| `badge--absent` | `--halo-gray` | `--halo-navy` | Estado neutro |
| `badge--pending` | `--halo-navy` | `--halo-orange` | Aguardando |
| `badge--success` | `#E9F4EE` | `#0F5132` | OK genérico |
| `badge--danger` | `#FCE7E0` | `#8B2A0E` | Erro / falha |

Todos: padding `5px 10px`, raio pill, mono 10 px uppercase, tracking 0.1 em.

### 9.5 Avatares

| Tamanho | Dimensão | Uso |
|---|---|---|
| `avatar--sm` | 28 px | Inline em texto |
| `avatar` | 36 px | Listas, tabelas |
| `avatar--lg` | 56 px | Header, perfil |

- Fundo padrão: Eclipse · Texto: Solar
- Borda 2 px Blanc (essencial em stacks sobrepostos)
- Stack: `margin-left: -10px` em todos exceto o primeiro

### 9.6 Tabs

#### Light (`tabs`)
- Container: fundo `--halo-gray-15`, raio pill, padding 4 px
- Tab ativa: fundo Eclipse, texto Blanc
- Tab inativa: texto `--ink-soft`

#### Dark (`seg-dark`)
- Container: fundo `--halo-navy-90`, raio pill
- Tab ativa: fundo Blanc, texto Eclipse
- Tab inativa: texto `--halo-navy-20`

### 9.7 KPI tile

```
┌─────────────────────────────┐
│ LABEL (mono 10 caps)    [↗] │
│                             │
│  91                         │  ← display 56 px
│                             │
│  ↗ +4 este mês              │  ← mono 12 px
└─────────────────────────────┘
```

Variantes: default (Blanc), `kpi__item--accent` (Solar), `kpi__item--dark` (Eclipse).

### 9.8 Progress bar

- Trilho: 8 px de altura, fundo Mist, raio pill
- Fill: Solar — ou listrado (`prog--striped`) com gradient diagonal Solar/Solar-90
- Uso de fill Eclipse: para representar dados secundários

### 9.9 Toast

- Container: 1 px borda, raio `--r-md`, padding `14px 16px`, sombra `--shadow-md`
- Ícone: 32 × 32 px, raio 10 px, fundo `--halo-orange-15`
- Variantes: light (default), dark (Eclipse), accent (borda Solar + bg `--halo-orange-05`)

### 9.10 Tabela

| Elemento | Estilo |
|---|---|
| `<th>` | mono 10 px caps, tracking 0.12, fundo `--halo-gray-05` |
| `<td>` | 14 px regular, padding `14px 12px` |
| Borda | bottom 1 px `--line-soft` |
| Hover row | fundo `--halo-gray-05` |
| Numérico | classe `.num` com `--font-mono`, peso 600 |

### 9.11 Calendário compacto

- Linha de 7 dias, cada célula com raio `--r-md`, padding `12px 6px`
- Dia atual: fundo Solar, texto Onyx
- Nome do dia: mono 10 px caps tracking 0.12
- Número do dia: display 22 px peso 600

### 9.12 Timeline

- Linha vertical 2 px Mist em `left: 8px`
- Item: card padrão com ponto à esquerda
- Ponto: 12 px círculo, borda 2 px Solar
- Item ativo: ponto preenchido Solar + ring `--halo-orange-15`

---

## 10. Padrões de aplicação

### 10.1 Layout dashboard

```
┌──────────┬──────────────────────────────────────┐
│          │  Hero / Saudação                     │
│          ├──────────────────────────────────────┤
│   Side   │  KPI · KPI · KPI                     │
│   Nav    ├─────────────────┬────────────────────┤
│          │  Line chart     │  Donut             │
│ (Eclipse)│                 │                    │
│          ├─────────────────┴────────────────────┤
│          │  Tabela completa                     │
└──────────┴──────────────────────────────────────┘
```

- Side nav: 260 px largura fixa, fundo Eclipse, sticky
- Main: max 1280 px, padding `--s-7`
- Grid de 12 colunas, gap `--s-5`

### 10.2 Hero pattern

Sempre que uma tela introduz uma nova área:
1. Container Eclipse com raio `--r-2xl`
2. Eyebrow pill em `--halo-orange-15` com dot pulsante
3. Display 01 com palavra italic Solar (Instrument Serif)
4. Subtítulo body large em `--halo-navy-20`
5. Meta row em mono caps com valores destacados em Blanc

### 10.3 Item ativo na navegação

- Side nav escura: item ativo recebe **fundo Solar + texto Onyx**
- Tabs: item ativo recebe **fundo Eclipse + texto Blanc** (light) ou **fundo Blanc + texto Eclipse** (dark)
- Nunca use apenas mudança de cor de texto para indicar ativo — sempre mude o fundo.

### 10.4 Quando usar Solar

✅ Botão primário (uma vez por tela)
✅ Item ativo de navegação
✅ KPI mais importante de uma série
✅ Linha de gráfico que representa o dado principal
✅ Estado de foco em input
✅ Badges de alerta/aviso

❌ Decoração geral
❌ Texto em parágrafos
❌ Backgrounds amplos (>10% da tela)
❌ Borda em volta de tudo

### 10.5 Densidade

Halo opera em duas densidades:

| Densidade | Padding card | Gap grid | Uso |
|---|---|---|---|
| **Confortável** (default) | `--s-5` | `--s-5` | Web, dashboards executivos |
| **Compacta** | `--s-4` | `--s-3` | Tabelas densas, admin tools |

---

## 11. Tokens (referência completa)

```css
:root {
  /* ========== CORES — 5 ÂNCORAS ========== */
  --halo-black:   #000000;
  --halo-navy:    #14213D;
  --halo-orange:  #FCA311;
  --halo-gray:    #E5E5E5;
  --halo-white:   #FFFFFF;

  /* ========== ESCALAS TONAIS ========== */
  --halo-navy-90: #1E2B4D;
  --halo-navy-80: #2A3A5E;
  --halo-navy-60: #5A6680;
  --halo-navy-40: #8C95A8;
  --halo-navy-20: #C5CAD4;

  --halo-orange-90: #E2920C;
  --halo-orange-80: #C97F08;
  --halo-orange-30: #FED48A;
  --halo-orange-15: #FEEAC4;
  --halo-orange-05: #FFF8EA;

  --halo-gray-90: #D0D0D0;
  --halo-gray-70: #B5B5B5;
  --halo-gray-50: #9A9A9A;
  --halo-gray-30: #6E6E6E;
  --halo-gray-15: #F2F2F2;
  --halo-gray-05: #FAFAFA;

  /* ========== SEMÂNTICOS ========== */
  --bg:           var(--halo-gray-05);
  --bg-elevated:  var(--halo-white);
  --bg-inverse:   var(--halo-navy);
  --bg-accent:    var(--halo-orange);
  --ink:          var(--halo-black);
  --ink-soft:     var(--halo-navy-60);
  --ink-inverse:  var(--halo-white);
  --line:         var(--halo-gray);
  --line-soft:    var(--halo-gray-15);

  /* ========== TIPOGRAFIA ========== */
  --font-display: "Bricolage Grotesque", sans-serif;
  --font-body:    "Bricolage Grotesque", sans-serif;
  --font-serif:   "Instrument Serif", serif;
  --font-mono:    "JetBrains Mono", ui-monospace, monospace;

  /* ========== RAIOS ========== */
  --r-xs:  6px;
  --r-sm:  10px;
  --r-md:  16px;
  --r-lg:  24px;
  --r-xl:  32px;
  --r-2xl: 48px;
  --r-pill: 999px;

  /* ========== ESPAÇAMENTO ========== */
  --s-1: 4px;
  --s-2: 8px;
  --s-3: 12px;
  --s-4: 16px;
  --s-5: 24px;
  --s-6: 32px;
  --s-7: 48px;
  --s-8: 64px;
  --s-9: 96px;

  /* ========== ELEVAÇÃO ========== */
  --shadow-sm:   0 1px 2px rgba(20,33,61,.06), 0 1px 1px rgba(20,33,61,.04);
  --shadow-md:   0 4px 12px rgba(20,33,61,.08), 0 2px 4px rgba(20,33,61,.04);
  --shadow-lg:   0 12px 32px rgba(20,33,61,.10), 0 4px 8px rgba(20,33,61,.05);
  --shadow-xl:   0 28px 64px rgba(20,33,61,.18), 0 8px 16px rgba(20,33,61,.08);
  --shadow-glow: 0 8px 32px rgba(252,163,17,.35);
}
```

### Imports recomendados

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300..800&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
```

---

## 12. Acessibilidade

### 12.1 Contraste mínimo
Todo par texto/fundo do sistema atende **WCAG AA (4.5:1 para texto normal, 3:1 para texto grande)**. Os pares listados em §3.5 passam **AAA**.

### 12.2 Foco visível
- Todo elemento interativo tem estado de foco com **ring 4 px em `--halo-orange-15`** + borda Solar.
- Nunca remover `:focus-visible`.
- Tab order deve seguir a ordem visual do conteúdo.

### 12.3 Tamanho de toque
- Alvos de toque: mínimo **44 × 44 px** em mobile.
- Botões `btn--sm` só são permitidos em desktop ou dentro de tabelas densas.

### 12.4 Movimento
- Animações nunca passam de **300 ms**.
- Respeitar `prefers-reduced-motion: reduce` desativando `ping`, `spin` e transições > 100 ms.

### 12.5 Cor não é o único sinal
Nunca comunique estado **apenas** por cor. Sempre acompanhe de:
- Texto (label, badge)
- Ícone (✓, !, ⚠)
- Padrão (listras na progress bar)

---

## 13. Changelog

### v1.0.0 — Abril 2026
- Lançamento inicial.
- 5 cores âncora · 3 escalas tonais · 9 tokens semânticos.
- 4 famílias tipográficas · 11 estilos de texto.
- 9 passos de espaçamento · 7 raios · 5 elevações.
- 24 ícones base.
- 12 componentes documentados.
- Dashboard de aplicação completo.

---

> **Halo Design System · v1.0.0**
> Construído com 5 cores. Mantido com disciplina.
> © 2026
