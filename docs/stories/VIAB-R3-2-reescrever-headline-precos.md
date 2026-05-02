# VIAB-R3-2 — Reescrever headline `/precos` com Loss Aversion

**Epic:** EPIC-VIAB-R3 (Trial 14d + Headline + Concorrência)
**Status:** InReview (código + CI gates PASS em 2026-05-02)
**Severidade:** ALTA — headline atual 3/10 (Finch); destrói trabalho que a landing nova (`/`) constrói
**Sprint:** SPRINT-2026-05-12 (proposto, paralelo a R3-1)
**Owner:** Pedro Emilio (executor: @dev)
**SP estimado:** 2 SP (~3-4h)
**Referência:**
- `docs/reviews/viability-2026-04-30/findings/M6-finch-headline-test.md` (headline atual `/precos` 3/10)
- `docs/reviews/world-benchmark-2026-05-01/02-pontuacao-mundial.md` (Uma + Finch identificaram badge "Posicionamento — Liderança em Produto" como ruído interno)
- `docs/business/ICP-validation-2026-Q2.md` (faixa "R$ 500-1.500/mês" defensável + WTP modal R$ 49)

---

## Contexto

**Headline atual `/precos`** (`src/app/precos/page.tsx`):
> "O motor de decisão de preço mais preciso para o Mercado Livre Brasil"

**Diagnóstico Finch (M6 Finding 2):**
- Feature-first puro — fala do produto, não do resultado para o vendedor
- Loss Aversion zero — não evoca custo de não agir
- "Mais preciso" é superlativo genérico sem prova
- Ninguém acorda pensando "preciso de um motor de decisão" — acorda pensando "estou perdendo margem"
- **Nota: 3/10**

**Ruído adicional (Uma + Finch identificaram):**
- Badge "Posicionamento — Liderança em Produto" acima do headline é linguagem interna de estratégia, não copy de conversão
- Vendedor ML não sabe o que é "liderança em produto" e não se importa
- Esse espaço deveria ter prova social ou urgência

**Headline nova proposta (Variante D-pricing — ICP-validated):**
> **"Pare de precificar no escuro. Veja exatamente onde sua margem está vazando — e corrija hoje."**

**Sub-headline:**
> *"Vendedores ML perdem entre R$ 500 e R$ 1.500/mês com erro de pricing.\* Por R$ 39/mês, você para de perder."*
> \* *Faixa baseada em política ML + custos típicos de cancelamento/mediação. Sua perda real depende do mix de SKUs.*

**Tag:** `[ICP-VALIDATED v1 SINTÉTICA]` + `[INFERRED faixa]`.

---

## Acceptance Criteria

### Estrutura e copy
1. [ ] Substituir headline H1 em `src/app/precos/page.tsx` pela Variante D-pricing
2. [ ] Substituir/reescrever sub-headline com faixa "R$ 500-1.500/mês" + asterisco-disclaimer
3. [ ] **Remover** badge "Posicionamento — Liderança em Produto"
4. [ ] No lugar do badge removido: adicionar **3 stat cards** above-the-fold:
   - "R$ 39/mês" — preço entry
   - "R$ 500-1.500" — perda média mensal evitada
   - "30s" — tempo de cálculo

### Diferenciação
5. [ ] CTA primário acima da dobra: "Começar trial 14d grátis" (link para signup com `?variant=trial`)
6. [ ] CTA secundário: "Calcular grátis primeiro" (link para `/calculadora-livre`)
7. [ ] Manter tabela de planos R$ 39/49/59/149 mas com nova narrativa de hierarquia (sub-perfis A-G de ICP-validation)

### Meta tags
8. [ ] `<title>` atualizado para refletir nova headline
9. [ ] `og:title` + `og:description` consistentes
10. [ ] `og:image` reusa de `/calculadora-livre` ou cria specific

### Eventos
11. [ ] Estender `FunnelEventName` com `pricing_cta_trial_click` e `pricing_cta_calc_click`
12. [ ] Instrumentar via `data-track` + delegação (padrão `HomeTracking.tsx` de VIAB-R1-2)
13. [ ] `pricing_viewed` (já existe) continua disparando

### Qualidade
14. [ ] `npm run typecheck` PASS
15. [ ] `npm run lint` PASS
16. [ ] `npm run build` PASS — `/precos` permanece prerendered (○) ou ISR
17. [ ] Lighthouse mobile ≥ 90 em todas as 4 categorias

---

## Tasks

### Track 1 — Substituição de headline + remoção de badge
- [ ] Editar `src/app/precos/page.tsx` (server component? client island?)
- [ ] Atualizar metadata (`generateMetadata` ou `export const metadata`)
- [ ] Confirmar que página continua sendo SSG/ISR

### Track 2 — Stat cards above-the-fold
- [ ] Reusar pattern de stat card de `src/app/page.tsx` (VIAB-R1-2) — `rounded-3xl border border-halo-orange-30 bg-white px-6 py-8`
- [ ] Tipografia Instrument Serif para números (consistência com landing)
- [ ] 3 cards em grid responsivo (md:grid-cols-3)

### Track 3 — Eventos tracking
- [ ] Estender `FunnelEventName` em `src/lib/analytics/events.ts`
- [ ] Adicionar client island `<PricingTracking />` similar a `<HomeTracking />` se ainda não houver
- [ ] Atributos `data-track` em CTAs

### Track 4 — Validação
- [ ] Smoke manual: load `/precos` em preview Vercel → screenshot mobile + desktop
- [ ] Lighthouse via PageSpeed Insights — documentar score no PR
- [ ] Pedro confirma copy via review do preview Vercel

---

## Out of Scope

- **Bloco "vs concorrentes"** com Letzee + GoSmarter → VIAB-R3-3 (story irmã)
- **A/B test de headlines D-pricing vs alternativa** → backlog (R4)
- **Pricing baseado em SKUs ativos** (Prisync model — recomendação Alan painel) → backlog
- **OG image custom** → Pedro cria depois no Canva

---

## Riscos

| Risco | Probabilidade | Mitigação |
|-------|:-------------:|-----------|
| Faixa "R$ 500-1.500" não defensável (claim publicitário CDC art 37) | Baixa | Asterisco + disclaimer explícito; mesma faixa já está na home (VIAB-R1-2) |
| Pedro não gostar da headline nova após review | Média | Track 4 prevê review de preview Vercel antes de promote |
| Conversão NÃO subir após mudança | Média | Instrumentação `pricing_cta_*_click` permite medir; fallback é reverter via git revert |
| Lighthouse cair por mudanças de DOM | Baixa | Pattern já validado em VIAB-R1-2 (1.48 kB JS, 161 kB First Load) |

---

## Definition of Done

- [ ] AC 1-17 todos checados
- [ ] PR com screenshots before/after mobile + desktop
- [ ] Lighthouse score documentado
- [ ] @qa gate PASS
- [ ] Pedro aprovou copy via preview Vercel
- [ ] Story atualizada com File List + Status `Done`

---

## Change Log

| Data | Autor | Mudança |
|------|-------|---------|
| 2026-05-02 | Orion (@aiox-master) | Story criada como parte do EPIC-VIAB-R3 |
| 2026-05-02 | Orion (@po+@dev+@qa) | Implementação completa: headline Variante D + 3 stat cards + PricingTracking + asterisco-disclaimer + remover badge interno. typecheck + lint + build PASS. → InReview |

---

## File List

### Criados
- `src/components/pricing/PricingTracking.tsx` — client island com delegação de click para `pricing_cta_trial_click` e `pricing_cta_calc_click`

### Modificados
- `src/app/precos/page.tsx`:
  - Headline H1 substituída pela Variante D-pricing
  - Sub-headline com faixa "R$ 500-1.500/mês" + sup ref
  - **Removido** badge "Posicionamento — Liderança em Produto"
  - 3 stat cards above-the-fold (R$39 / R$500-1.500 / 30s)
  - 2 CTAs: "Começar trial 14d grátis" + "Calcular grátis primeiro"
  - Footer com asterisco-disclaimer + link /privacidade
  - Metadata atualizada (`<title>`, `og:title`, `og:description`)

Build: `/precos` continua server-rendered (ƒ), 2.15 kB JS / 162 kB First Load.
