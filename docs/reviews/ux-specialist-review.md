# SmartPreço — Revisão Especialista de UX/UI

> Produzido por: @ux-design-expert / Uma (Brownfield Discovery — Fase 6)
> Data: 2026-04-23
> Revisando: technical-debt-DRAFT.md + frontend-spec.md

---

## Validação dos Achados do Draft

### Confirmados (alinhados com análise UX)

| ID | Item | Validação |
|----|------|-----------|
| TD-FEAT-02 | Sidebar mobile | ✅ Bloqueador crítico. App inutilizável em mobile sem isso. |
| TD-FEAT-03 | WelcomeTour | ✅ Confirmado. Componente existe, integração zero. |
| TD-FEAT-04 | DecisionPanel | ✅ Confirmado. Fase 5 da calculadora fica "no ar". |
| TD-A11Y-01 | prefers-reduced-motion | ✅ Confirmado. Todos os presets de motion ignoram preferência do usuário. |

### Avaliação do Design System Atual

#### POSITIVOS (não são débitos — são ativos)

✅ **Paleta de cores bem definida e semântica**
- ink/paper/gold/profit/warn/loss são tokens com significado claro
- Não há ambiguidade de "qual cor usar onde"

✅ **Hierarquia tipográfica clara**
- Manrope com 5 pesos disponíveis, tracking e sizes bem especificados no PageHeader
- `tracking[-0.03em]` nos títulos grandes é decisão correta para legibilidade premium

✅ **Micro-interações presentes**
- `interactive-panel` com spring animation
- `genie-button` com bouncy hover
- Motion presets padronizados e reutilizáveis

✅ **Consistência de componentes**
- StatusPill, ResultCard, ProfitabilityBadge formam sistema coeso
- WorkspaceNav com aba ativa legível e bem diferenciada

### Lacunas UX não cobertas no Draft

#### UX-GAP-01 — Feedback de loading insuficiente na busca ML
**Severidade:** ALTO  
**Detalhe:** Scraping do ML demora 3-8 segundos. `MarketSearch` tem loading state mas não há comunicação do progresso para o usuário.  
**Recomendação:** Adicionar skeleton animado de `ListingCard` enquanto aguarda, com mensagem "Buscando no Mercado Livre..." com ícone spin.  
**Esforço:** 4h

#### UX-GAP-02 — Sem sistema de toast/notificação
**Severidade:** MÉDIO  
**Detalhe:** Ação "Salvar como SKU" não tem feedback visual persistente após sucesso. Usuário não sabe se salvou.  
**Recomendação:** Integrar `sonner` (já disponível no ecossistema shadcn) para toasts de sucesso/erro.  
**Esforço:** 4h

#### UX-GAP-03 — ScenarioTable sem orientação do usuário
**Severidade:** MÉDIO  
**Detalhe:** Tabela de cenários de preço mostra dados mas não orienta o usuário sobre qual linha escolher.  
**Recomendação:** Destacar visualmente a linha com "preço recomendado" (onde margem = target) e adicionar label "Recomendado".

#### UX-GAP-04 — Empty state de SKUs sem fluxo de retorno
**Severidade:** BAIXO  
**Detalhe:** Empty state com filtro ativo tem CTA "Ajustar filtro" mas sem botão para limpar filtros diretamente.  
**Localização:** `src/app/(app)/skus/page.tsx:69`

#### UX-GAP-05 — TopBar sem indicação de usuário ativo contextual
**Severidade:** BAIXO  
**Detalhe:** Exibe email do usuário mas sem avatar com inicial gerada dinamicamente. Avatar está hardcoded com classe mas sem a letra inicial real.  
**Localização:** `src/components/layout/TopBar.tsx`

---

## Avaliação de Acessibilidade (WCAG 2.1 AA)

| Critério | Status | Nota |
|---------|--------|------|
| Contraste de texto normal (4.5:1) | ✅ Pass | ink-950 sobre paper-50: ~14:1 |
| Contraste de texto grande (3:1) | ✅ Pass | — |
| Contraste gold-400 sobre ink-950 | ✅ Pass | ~7:1 |
| Focus visible | ⚠️ Parcial | Shadcn/ui implementa, custom components não verificados |
| Skip navigation | 🔴 Ausente | — |
| Landmark regions | ✅ Presente | `<nav>`, `<main>` presentes via AppShell |
| Alt text em imagens | ✅ N/A | Sem imagens decorativas |
| prefers-reduced-motion | 🔴 Ausente | Motion presets não verificam |
| Keyboard navigation | ⚠️ Parcial | shadcn OK, WorkspaceNav Links OK, custom components não testados |

---

## Parecer Geral

O redesign foi bem executado: design system coeso, identidade visual forte, componentes atômicos reutilizáveis. A base é profissional e impressionante visualmente.

**Prioridade máxima UX:** Sidebar mobile (bloqueador de adoção real) + feedback de loading na busca ML.

**Veredicto:** Design system aprovado. Sem regressões visuais. Gaps são de completude de feature, não de qualidade do design.

**Score UX:** 7.5/10 (penalizando apenas pela ausência de mobile nav e feedback de loading)
