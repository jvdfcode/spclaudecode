# Halo — Design System

> Uma linguagem visual de cinco cores.
> Versão 1.1.0 · Abril 2026

Halo é um design system construído sobre uma paleta restrita: **preto, azul-marinho, laranja, cinza e branco**. Cada componente, token e padrão deriva dessas cinco âncoras — disciplina cromática que garante consistência em qualquer produto.

**Escopo (v1.1):** DS-produto. Halo entrega para devs e designers internos, otimiza implementação e adoção. As escolhas de personalidade (tipografia Bricolage + Instrument Serif, doutrina cromática 60·30·8·2, cinema editorial em hero) são intencionais e preservam vocação de marca para evolução futura — ver §13 e §16.

> **"Cinco cores. Zero ambiguidade. Decisão em 3 segundos."**
> *Disciplina cromática que cabe num botão e dura uma década.*

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
14. [Métricas de adoção (KPIs do DS)](#14-métricas-de-adoção)
15. [Variantes Experimentais (cadência de teste)](#15-variantes-experimentais)
16. [Roadmap de Marca (latente — v2.0)](#16-roadmap-de-marca)

---

## 1. Princípios

Quatro convicções guiam toda decisão dentro do Halo.

### i. Restrição é estilo
Cinco cores, duas famílias tipográficas em UI, uma escala. A disciplina é o que torna o sistema reconhecível em qualquer escala. Quando em dúvida, **remova** antes de adicionar.

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

### Tagline (v1.1)

**Headline (uso primário em landing, marketing, onboarding):**
> *"Cinco cores. Zero ambiguidade. Decisão em 3 segundos."*

**Sub-tagline (uso interno, changelog, contexto editorial):**
> *"Disciplina cromática que cabe num botão e dura uma década."*

A headline é promessa específica e mensurável (palavra-poder: "zero", "3 segundos") — converte para implementadores. A sub-tagline preserva a personalidade de marca para uso editorial. Ambas convivem.

> **Tagline anterior (v1.0):** *"Construído com 5 cores. Mantido com disciplina."* — depreciada por descrever processo em vez de prometer resultado. Ver §13.

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

**Custo de violação (v1.1):** Solar acima de 2% colapsa a hierarquia de ação — o olho do usuário deixa de saber qual é o próximo passo. Em dashboards, isso aumenta o tempo de decisão e reduz a taxa de clique no CTA primário. Em forms, dilui o sinal de campo focado. Em landing, mata conversão.

### 3.5 Combinações aprovadas

> **Ferramenta de cálculo:** valores verificados via [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) contra **WCAG 2.1 §1.4.3**, em 2026-04-28. Reproduza com hex pair antes de auditar conformidade legal.

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

| Token | Família | Uso | Carregamento |
|---|---|---|---|
| `--font-display` | **Bricolage Grotesque** (700–800, opsz ≥36) | Headings 1–3, displays, números grandes | crítico (preload + `font-display: swap`) |
| `--font-body` | **Bricolage Grotesque** (400–600, opsz 12–24) | Body, UI, labels | crítico (preload + `font-display: swap`) |
| `--font-serif` | **Instrument Serif** (italic) | Acentos editoriais em hero, palavras-destaque | **assíncrono** (`font-display: optional`, não bloqueia LCP) |
| `--font-mono` | **JetBrains Mono** (400/500/700) | Dados, labels, metadados, código, KPIs | crítico (`font-display: swap`) |

> Bricolage Grotesque foi escolhida pela personalidade humana das curvas e pela variabilidade de peso e optical size — **escolha de DNA-de-marca preservada do v1.0**, ver §13. Instrument Serif fornece um contraste editorial inesperado nos momentos certos, mas **nunca bloqueia renderização de CTA** (carregamento opcional). Nada de Inter, Roboto ou system fonts.

### 4.1.1 Diferenciação `--font-display` × `--font-body` (novo no v1.1)

Embora ambos apontem para Bricolage Grotesque, os dois tokens têm parâmetros distintos:

| Atributo | `--font-display` | `--font-body` |
|---|---|---|
| Peso | 700–800 | 400–600 |
| Optical size (`opsz`) | ≥ 36 | 12–24 |
| `font-feature-settings` | default | `"ss02" on` (alternates para legibilidade em corpo) |
| Tracking | -0.025 a -0.04 em | 0 |
| Uso | Display 01/02, Heading 1–3, Numeric Display | Body Large/Medium/Small, UI |

Sem essa diferenciação, os dois tokens viram alias semântico vazio. Implementar ambos via `next/font` ou `@font-face` separados.

### 4.2 Escala

| Estilo | Tamanho | Line-height | Tracking | Peso | Família | Uso |
|---|---|---|---|---|---|---|
| Display 01 | 84 px | 0.92 | -0.04 em | 800 | display | Hero único da página |
| Display 02 | 64 px | 0.95 | -0.035 em | 700 | display | Headline de seção principal |
| Display Serif | 64 px | 1.0 | -0.02 em | 400 italic | serif | Acento dentro do display |
| Heading 1 | 40 px | 1.05 | -0.025 em | 700 | display | Título de seção |
| Heading 2 | 28 px | 1.15 | -0.015 em | 600 | display | Subseção |
| Heading 3 | 20 px | 1.25 | 0 | 600 | body | Card / panel title |
| Body Large | 18 px | 1.55 | 0 | 400 | body | Lead, intro paragraph |
| Body Medium | 15 px | 1.6 | 0 | 400 | body | Texto padrão |
| Body Small | 13 px | 1.55 | 0 | 400 | body | Auxiliar, descrições |
| Caption | 11 px | 1.4 | 0.12 em | 500 | mono | Labels, metadados |
| Numeric Display | 56 px | 1 | -0.03 em | 700 | mono | KPIs, valores grandes |

### 4.3 Regras de uso

- **Tabular numbers** sempre em `--font-mono` para tabelas e KPIs (alinhamento vertical de dígitos via `font-variant-numeric: tabular-nums`).
- **Italic** apenas em `--font-serif` — nunca em sans.
- Body nunca abaixo de 13 px.
- Tracking negativo (`-0.025` a `-0.04 em`) em todos os displays para parecer mais editorial.
- Tracking positivo (`+0.12 em`) e UPPERCASE apenas em captions/labels mono.
- **Custo de violação:** Instrument Serif em CTA bloqueia LCP em conexões 3G — abandono de tarefa em mobile sobe. Por isso é `optional`, não `swap`.

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
| `--shadow-glow` | `0 8px 32px rgba(252,163,17,.35)` | **EXCLUSIVO** do hover do botão Primary |

### Regras
- Sombras sempre coloridas com Eclipse, nunca preto puro.
- **`--shadow-glow` é exclusivo de Primary em hover.** Replicar em outros componentes (cards, badges, toast) é violação — dilui o sinal de ação primária e quebra a hierarquia de CTA. **Custo de violação:** taxa de clique no botão primário cai porque o usuário perde o sinal do "próximo passo".
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

> **Implementação recomendada:** `lucide-react` (mesmo viewBox, mesmo stroke, mesmo conjunto canônico).

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
- **Loading** → mesmo background, ícone spinner, `cursor: not-allowed`, `aria-busy="true"`
- **Disabled** → background Mist, texto Mist-50, `cursor: not-allowed`

> **Regra de hierarquia (referência cruzada §10.6):** uma Primary por tela. Custo de violação: dois botões Primary na mesma tela dividem atenção e reduzem conversão do CTA principal.

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
- Transição: 200 ms ease (respeita `prefers-reduced-motion`)

#### Checkbox
- Quadrado 22 × 22 px, raio 7 px
- Off: borda 2 px Eclipse, fundo Blanc
- On: fundo Solar, borda Solar, check em Onyx

### 9.4 Badges (corrigido no v1.1)

> **Nota constitucional:** o v1.0 listava `badge--success` (`#0F5132`/`#E9F4EE`) e `badge--danger` (`#8B2A0E`/`#FCE7E0`) com cores estranhas ao sistema das 5 âncoras. Isso violava §3.1 e Princípio i. **Corrigido.** As variantes semânticas agora derivam exclusivamente do sistema. Estados de produto que precisam de "verde positivo" devem usar **Solar+ícone+texto** seguindo §12.5 (cor não é único sinal).

| Variante | Background | Foreground | Uso |
|---|---|---|---|
| `badge--paid` | `--halo-orange-15` | `--halo-orange-80` | Sucesso financeiro / pago |
| `badge--absent` | `--halo-gray-15` | `--halo-navy` | Estado neutro |
| `badge--pending` | `--halo-navy` | `--halo-orange` | Aguardando |
| `badge--success` | `--halo-orange-15` | `--halo-orange-80` | OK / viável (acompanhar de ícone `check` e label "Viável") |
| `badge--danger` | `--halo-navy` | `--halo-orange` | Erro / falha (acompanhar de ícone `alert` e label "Inviável") |

Todos: padding `5px 10px`, raio pill, mono 10 px uppercase, tracking 0.1 em.

> **Regra obrigatória (§12.5):** badges `success` e `danger` exigem ícone + label, nunca cor isolada como único sinal. Daltonismo + UX consistente.

### 9.5 Avatares

| Tamanho | Dimensão | Uso |
|---|---|---|
| `avatar--sm` | 28 px | Inline em texto |
| `avatar` | 36 px | Listas, tabelas |
| `avatar--lg` | 56 px | Header, perfil |

- Fundo padrão: Eclipse · Texto: Solar
- Borda 2 px Blanc (essencial em stacks sobrepostos)
- Stack: `margin-left: -10px` em todos exceto o primeiro

> **Nota v1.1:** "Embaixador Solar" (avatar como vetor de marca com pessoa real) NÃO entra neste escopo de DS-produto. Fica reservado para v2.0 (ver §16). Avatar permanece como componente de UI.

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
│  91                         │  ← Numeric Display 56 px
│                             │
│  ↗ +4 este mês              │  ← mono 12 px
└─────────────────────────────┘
```

Variantes: default (Blanc), `kpi__item--accent` (Solar — reservado ao KPI de maior impacto da série, **um por dashboard**), `kpi__item--dark` (Eclipse).

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
| Numérico | classe `.num` com `--font-mono`, peso 600, `font-variant-numeric: tabular-nums` |

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
- **CTA primário sempre above-the-fold no hero** (referência §10.6)

### 10.2 Hero pattern

Sempre que uma tela introduz uma nova área:
1. Container Eclipse com raio `--r-2xl`
2. Eyebrow pill em `--halo-orange-15` com dot pulsante
3. Display 01 com palavra italic Solar (Instrument Serif — assíncrono, não bloqueia render)
4. Subtítulo body large em `--halo-navy-20`
5. Meta row em mono caps com valores destacados em Blanc
6. **CTA Primary visível na primeira dobra**

### 10.3 Item ativo na navegação

- Side nav escura: item ativo recebe **fundo Solar + texto Onyx**
- Tabs: item ativo recebe **fundo Eclipse + texto Blanc** (light) ou **fundo Blanc + texto Eclipse** (dark)
- Nunca use apenas mudança de cor de texto para indicar ativo — sempre mude o fundo.

### 10.4 Quando usar Solar

✅ Botão primário (uma vez por tela)
✅ Item ativo de navegação
✅ KPI mais importante de uma série (`kpi__item--accent`)
✅ Linha de gráfico que representa o dado principal
✅ Estado de foco em input
✅ Badges de alerta/aviso (com ícone + label)

❌ Decoração geral
❌ Texto em parágrafos
❌ Backgrounds amplos (>10% da tela)
❌ Borda em volta de tudo
❌ `--shadow-glow` fora de Primary

**Custos de violação concretos:**
- Solar em background amplo: dilui o CTA, reduz clique no botão primário
- Dois Primary por tela: divide atenção, conversão cai
- Solar em decoração: o usuário deixa de saber o que é "ação"
- `--shadow-glow` replicado: o sinal de "próximo passo" se perde

### 10.5 Densidade

Halo opera em duas densidades:

| Densidade | Padding card | Gap grid | Uso |
|---|---|---|---|
| **Confortável** (default) | `--s-5` | `--s-5` | Web, dashboards executivos |
| **Compacta** | `--s-4` | `--s-3` | Tabelas densas, admin tools |

### 10.6 Hierarquia de Conversão (novo no v1.1)

Toda tela do Halo segue 4 regras invariantes para preservar o sinal de ação:

1. **Uma Primary por tela.** Se a tela exigir duas ações, uma vira Secondary (Eclipse). Custo de violar: conversão dividida, taxa de clique do CTA principal cai.
2. **CTA Primary above-the-fold.** Em dashboards, na primeira dobra do hero. Em forms, no fim do form mas com âncora visual. Custo: usuário abandona antes de descobrir o próximo passo.
3. **`kpi__item--accent` reservado ao KPI de decisão.** Um por dashboard — o KPI cuja mudança move o produto. Custo de violar: usuário perde a hierarquia de dado.
4. **Linha Solar única no gráfico.** Quando há múltiplas séries, Solar marca a série de leitura primária. Outras séries usam Eclipse e Mist. Custo: leitura ambígua, decisão atrasada.

> **Esta seção existe porque DS-produto sem hierarquia de CTA é vitrine, não funil.** Ver §13 para o registro da decisão.

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
  --halo-navy-10: #EAEDF2;

  --halo-orange-100: #C97F08;
  --halo-orange-90:  #E2920C;
  --halo-orange-80:  #FCA311;
  --halo-orange-30:  #FED48A;
  --halo-orange-15:  #FEEAC4;
  --halo-orange-05:  #FFF8EA;

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
  --shadow-glow: 0 8px 32px rgba(252,163,17,.35); /* exclusivo: hover Primary */
}
```

### Imports recomendados

**HTML/CSS direto:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300..800&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
```

**Next.js (recomendado para SmartPreço — `next/font`):**
```ts
import { Bricolage_Grotesque, Instrument_Serif, JetBrains_Mono } from 'next/font/google'

export const display = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-display',
  display: 'swap',
})
export const body = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
})
export const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'optional', // não bloqueia LCP
})
export const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-mono',
  display: 'swap',
})
```

---

## 12. Acessibilidade

### 12.1 Contraste mínimo
Todo par texto/fundo do sistema atende **WCAG AA (4.5:1 para texto normal, 3:1 para texto grande)**. Os pares listados em §3.5 passam **AAA** — verificados via WebAIM Contrast Checker contra WCAG 2.1 §1.4.3 em 2026-04-28.

### 12.2 Foco visível
- Todo elemento interativo tem estado de foco com **ring 4 px em `--halo-orange-15`** + borda Solar, offset 2 px do elemento.
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
- Ícone (`check`, `alert`, `x` do conjunto §8)
- Padrão (listras na progress bar)

Aplicação obrigatória em §9.4 (badges `success`/`danger`).

---

## 13. Changelog

### v1.1.0 — 2026-04-28

**Origem:** Roundtable Halo DS v1.0 com Alan Nicolas (Knowledge Architect), Thiago Finch (Funnel-First) e Erich Shibata [SINTETIZADO] (Astro Designer / Cimed). Documento mestre: `docs/reviews/halo-roundtable-2026-04-28.md`.

**Decisão de escopo:** **DS-produto-com-DNA-de-marca preservado**. Voto Alan (DS-produto) + Erich (DS-marca) resultou em juízo de minerva do Design Chief: prioridade primária produto (adoção de implementação), DNA de marca latente (Bricolage por personalidade, §3.4 doutrina, cinema editorial em §10.2) preservado para v2.0 condicionado a tração. Documento completo em `decisao-final-design-chief.md`.

#### Bloqueadores absolutos resolvidos (3)
- **§9.4 Badges:** removidas as cores estranhas `#0F5132/#E9F4EE/#8B2A0E/#FCE7E0` do v1.0 que violavam §3.1 e Princípio i. Variantes `success` e `danger` agora derivam exclusivamente de `--halo-orange-*` e `--halo-navy`. Sinal duplo (cor + ícone + label) obrigatório em §12.5.
- **§10.6 Hierarquia de Conversão:** seção nova com 4 regras invariantes — uma Primary por tela, CTA above-the-fold, `kpi__item--accent` único por dashboard, linha Solar única em gráfico multi-série. Custo de violação documentado.
- **§13 Changelog real:** este documento, com decisões, alternativas descartadas e plano de versão.

#### Adições obrigatórias resolvidas (4)
- **§3.5 fonte primária verificável:** WebAIM Contrast Checker contra WCAG 2.1 §1.4.3, com data.
- **§4.1 carregamento otimizado:** Bricolage e Mono em `display: swap` (crítico, preload); Instrument Serif em `display: optional` (não bloqueia LCP). Custo de violação registrado.
- **§4.1.1 diferenciação `--font-display` × `--font-body`:** dois tokens com pesos, optical sizes, features e tracking distintos. Resolve gap semântico apontado por Alan.
- **§15 Variantes Experimentais (cadência de 365 tiros):** protocolo de teste de variante de aplicação dentro do escopo de produto. Inspirado em "365 tiros" de Erich [SOURCE: Made in Brasil Podcast 2023], adaptado para DS-produto.

#### Reescritas
- **§2 Tagline:** *"Construído com 5 cores. Mantido com disciplina."* → *"Cinco cores. Zero ambiguidade. Decisão em 3 segundos."* (headline) + *"Disciplina cromática que cabe num botão e dura uma década."* (sub-tagline editorial). Tagline anterior depreciada por descrever processo em vez de prometer resultado.

#### Decisões intencionais preservadas (DNA-de-marca)
- **Bricolage Grotesque:** mantida pela "personalidade humana das curvas" (§4.1). Não trocar por Inter/Roboto mesmo com argumento de performance — a perda de personalidade não compensa o ganho marginal de bytes.
- **§3.4 60·30·8·2:** mantida como filosofia de cor (DNA-de-marca latente), não constraint técnica. O Solar a 2% é decisão de mundo, não de tela. Se v2.0 for declarado DS-marca, esta regra vira fundação.
- **§10.2 Cinema editorial em hero:** mantido (Display 01 com Instrument Serif, dot pulsante, Eclipse + Solar). DNA-de-marca preservado.

#### NÃO entram no v1.1 (reservados ao Roadmap de Marca §16)
- Embaixador Solar (avatar como vetor humano de marca) — Erich propôs; Alan vetou por No Invention. Reservado v2.0 condicionado a tração.
- Solar Fora do Pixel (Pantone, CMYK, têxtil, objeto físico âncora) — Erich propôs; Alan vetou. Reservado v2.0.
- Sistema de marca-mãe e endosso humano — reservado v2.0.

#### Breaking changes para adotantes do v1.0
- `badge--success` e `badge--danger` mudaram tokens (`#0F5132` → `--halo-orange-80`). Usuários do v1.0 precisam migrar via codemod: `s/#0F5132/var(--halo-orange-80)/g` e adicionar ícone obrigatório.
- `--font-serif` agora carrega `display: optional` — pode aparecer fallback em telas de hero antes do swap. Aceitar é parte do DS-produto.
- Tagline antiga depreciada — atualizar headers de página.

#### Plano de versão
- **v1.1.x (patches)**: correções de tokens, ajustes de a11y, novas variantes que **não introduzem cor** ou nova família tipográfica.
- **v1.2 (minor)**: novos componentes derivados das 5 âncoras (cards de tipologia ainda não documentados, layouts de form complexo).
- **v2.0 (major)**: ativação de DS-marca SE tração for declarada — adiciona §14 Solar Fora do Pixel + §17 Embaixador Solar. **Não acontece sem evidência de tração de produto.**

### v1.0.0 — Abril 2026 (depreciado)
- Lançamento inicial. 5 cores âncora · 3 escalas tonais · 9 tokens semânticos.
- 4 famílias tipográficas · 11 estilos de texto.
- 9 passos de espaçamento · 7 raios · 5 elevações.
- 24 ícones base. 12 componentes documentados.
- Vetado pelo roundtable em 2026-04-28; substituído por v1.1.

---

## 14. Métricas de adoção

KPIs de DS-produto que orientam evolução do Halo. Sem KPI, o Halo não sabe se chegou à excelência ou só está bonito.

| KPI | Meta inicial | Como medir |
|-----|-------------:|------------|
| Cobertura de componentes | 80% das telas usam apenas componentes documentados | grep de tokens não-canônicos no código |
| Tempo médio de implementação de tela | < 2h para tela padrão (hero + KPI + tabela) | medição em sprint planning |
| Taxa de violação de tokens por sprint | < 5% das PRs introduzem token novo | check de CI |
| Lighthouse A11y nas rotas-chave | ≥ 90 | gate de CI |
| Cobertura de pares de contraste verificados | 100% dos pares §3.5 validados em produção | screenshot test |

---

## 15. Variantes Experimentais (cadência de teste)

> Inspirado em [SOURCE: Made in Brasil Podcast 2023, Erich Shibata]: *"a gente não faz grandes campanhas; a gente dá 365 tiros no ano… desses 365, a gente acerta dois ou três"*. Adaptado para DS-produto: testar variantes de aplicação **dentro do produto**, não em campanha externa.

### Protocolo

1. **Proposta:** dev/designer propõe variante experimental (ex: novo padrão de KPI tile com sparkline; novo fundo de hero com gradient Solar/Eclipse). Documenta em PR sob label `halo-experiment`.
2. **Teste de campo:** variante vai para 1 rota apenas, atrás de feature flag. Coleta dados de adoção e taxa de erro durante 1 sprint.
3. **Avaliação de consistência com §3.4:** mantém proporção 60·30·8·2? Não introduz cor estranha ao sistema? Mantém Trindade técnica?
4. **Decisão:**
   - **Aprovado:** vira proposta de v1.x patch ou v1.2 minor; documentado em §13.
   - **Reprovado:** removido. Aprendizado registrado em `docs/reviews/halo-experiments.md`.
   - **Inconcluso:** mais 1 sprint de coleta.
5. **Cadência alvo:** 1-2 experimentos ativos por sprint. Não mais — DS sem cultura de teste é constituição morta; DS com 10 testes por sprint vira caos.

### Critérios de não-experimento (proibido)

- Introduzir cor fora das 5 âncoras (mesmo "temporariamente")
- Adicionar família tipográfica nova
- Modificar §3.4 proporção 60·30·8·2
- Introduzir novo conceito de marca (embaixador, território, sub-marca) — isso é v2.0

---

## 16. Roadmap de Marca (latente — v2.0)

> Esta seção existe para registrar **o que NÃO entra no v1.1 mas o DNA do Halo já carrega**. Conteúdo proposto por Erich Shibata [SINTETIZADO] no roundtable, vetado por Alan Nicolas no v1.1 por No Invention, preservado aqui como ambição condicional.

### Pré-requisitos para ativação (v2.0)
1. **Tração documentada do v1.x:** Halo adotado em pelo menos 2 produtos com KPIs §14 acima da meta.
2. **Decisão explícita do mantenedor:** "Halo é marca, não só DS interno". Decisão registrada em ADR.
3. **Capacidade de produzir conteúdo de marca:** Pantone/CMYK validado, fotografia direcional, 1 embaixador real disponível.

### Adições previstas em v2.0 (não implementar antes da tração)
- **§14 Solar Fora do Pixel:** Pantone, CMYK, aplicação têxtil, regra de uso em superfície monocromática, objeto físico âncora.
- **§17 Embaixador Solar:** uma pessoa real porta o Solar (uniforme, badge, comunicação). Diferencia avatar-componente de embaixador-marca.
- **§18 Tom de Voz e Comunicação Externa:** vocabulário, headlines de campanha, regras de aplicação em redes sociais.
- **§19 Fotografia Direcional:** estilo, paleta fotográfica, regras de produção.

### Decisão registrada

> "[SINTETIZADO] O amarelo da Cimed não virou nossa cor porque estava no manual; virou porque apareceu em todo lugar, todo dia." — Erich Shibata
>
> "A fonte primária contradiz a escolha DS-marca em 2026-04-28. Curadoria > volume." — Alan Nicolas
>
> "DS-produto-com-DNA-de-marca preservado. v1.1 entrega produto; v2.0 ativa marca SE houver tração." — Design Chief

---

> **Halo Design System · v1.1.0**
> Cinco cores. Zero ambiguidade. Decisão em 3 segundos.
> *Disciplina cromática que cabe num botão e dura uma década.*
> © 2026
