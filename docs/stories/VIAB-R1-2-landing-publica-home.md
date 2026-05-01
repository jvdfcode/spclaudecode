# VIAB-R1-2 — Landing pública em `/` com headline Loss Aversion

**Epic:** EPIC-VIAB-R1 (Recomendações 30 dias do relatório de viabilidade 2026-04-30)
**Status:** Draft
**Severidade:** CRÍTICA — buraco fatal no funil de aquisição
**Sprint:** SPRINT-2026-05-05 (proposto)
**Owner:** Pedro Emilio (executor: @dev + @ux-design-expert para revisão de copy)
**SP estimado:** 3 SP (~4-6h)
**Referência:** `docs/reviews/viability-2026-04-30/findings/M6-finch-headline-test.md` (Finding 1 + Alternativas A/B/C)

---

## Contexto

A análise de viabilidade (@thiago-finch *headline-test) identificou que `src/app/page.tsx` faz `redirect('/dashboard')`, **descartando 100% do tráfego frio** que chega ao domínio raiz `smartpreco.app`. Qualquer SEO, ads ou link building no domínio raiz tem ROI zero.

```ts
// src/app/page.tsx (atual)
import { redirect } from 'next/navigation'

export default function Home() {
  redirect('/dashboard')
}
```

**Diagnóstico Finch (M6):**
- Headline `/precos` é feature-first ("motor de decisão de preço mais preciso") — Loss Aversion zero (nota 3/10)
- Headline `/calculadora-livre` é a única decente (7/10) mas falta número concreto
- Concorrentes (Hunter Hub, Real Trends, JoomPulse, Nubimetrics) majoritariamente usam copy fraca — oportunidade de mercado real para quem aplicar Loss Aversion calibrada (ratio 2.5:1)

**Headline alvo (Alternativa A do M6 — votada como mais forte):**
> "Vendedores ML perdem em média R$ 847/mês por erro de precificação. Você está entre eles?"

CTA primário → `/calculadora-livre` (lead magnet existente, já validado em PROD-001-10/PROD-001-13).

---

## Acceptance Criteria

1. [ ] `https://smartpreco.app/` retorna HTTP 200 com landing renderizada (não 307 redirect)
2. [ ] Headline H1 visível acima da dobra contém Loss Aversion explícita (número concreto de perda + pergunta retórica ou âncora temporal)
3. [ ] CTA primário (botão acima da dobra) leva para `/calculadora-livre` com `utm_source=home&utm_medium=cta_primary`
4. [ ] CTA secundário (link ou botão) leva para `/precos`
5. [ ] Página é responsiva (mobile-first; testar em 375px/768px/1280px)
6. [ ] Lighthouse score ≥ 90 em Performance, Accessibility, SEO (mobile)
7. [ ] Meta tags (`<title>`, `og:title`, `og:description`, `og:image`) consistentes com headline
8. [ ] Evento de funil registrado: `home_view` em `funnel_events` (consistente com instrumentação PROD-001-13)
9. [ ] Middleware de auth (`src/middleware.ts`) **não exige login para `/`** — manter comportamento atual de `/calculadora-livre`
10. [ ] Smoke test E2E (Playwright) cobre: load `/` → click CTA → arrive `/calculadora-livre`
11. [ ] Validação de copy por Pedro Emilio (owner) antes do deploy — número R$ 847 confirmado ou substituído por faixa defensável

---

## Tasks

### Track 1 — Conteúdo e copy (NÃO-implementação primeiro)

- [ ] Validar/escolher headline final entre Alternativas A/B/C de M6:
  - **A:** "Vendedores ML perdem em média R$ 847/mês por erro de precificação. Você está entre eles?"
  - **B:** "Em 30 segundos, descubra os R$ 500+ que você deixa na mesa todo mês no Mercado Livre"
  - **C:** "8 em 10 sellers ML não sabem que perdem R$ 600+ por mês em taxas mal calculadas. Calcule o seu em 30s."
- [ ] Confirmar número (R$ 847 vs R$ 500+ vs R$ 600+) com base em dados próprios ou citação `[INFERRED]` documentada
- [ ] Definir ≥3 sub-blocos abaixo da dobra:
  - Prova social (logos/depoimentos ou contagem de sellers que usaram a calculadora)
  - "Como funciona em 3 passos" (calcule → compare → decida)
  - Pricing teaser com link para `/precos`

### Track 2 — Implementação Next.js

- [ ] Substituir `src/app/page.tsx` por componente real (server component preferível, sem `redirect`)
- [ ] Reusar componentes Halo DS existentes — verificar `src/components/halo/` ou pacote design system
- [ ] Aplicar tokens Tailwind v4 via `@theme` (mesmo padrão de `f2185bd fix(halo): tokens Tailwind v4`)
- [ ] Adicionar metadata via `generateMetadata` ou export `metadata`
- [ ] Adicionar `og:image` (criar em `public/og-home.png` 1200x630 ou reutilizar de `/calculadora-livre`)
- [ ] Instrumentar `home_view` event (seguindo padrão `src/lib/analytics/funnel-events.ts` ou equivalente do PROD-001-13)

### Track 3 — Middleware e roteamento

- [ ] Verificar `src/middleware.ts` — confirmar que `/` está na allowlist pública (não exige auth)
- [ ] Se necessário, adicionar `/` ao matcher pattern já existente para `/calculadora-livre` e `/precos`

### Track 4 — Testes e validação

- [ ] Smoke test Playwright em `tests/e2e/home-landing.spec.ts` cobrindo AC 1, 3, 4, 10
- [ ] `npm run typecheck` e `npm run lint` passam
- [ ] Lighthouse via PageSpeed Insights (https://smartpreco.app/) — score documentado no PR
- [ ] Validar `og:image` via https://www.opengraph.xyz/ ou Facebook Debugger

### Track 5 — Deploy e verificação prod

- [ ] Preview Vercel revisado por Pedro Emilio
- [ ] Deploy prod
- [ ] Smoke manual: `curl -sI https://smartpreco.app/ | head -1` → `HTTP/2 200`
- [ ] Confirmar evento `home_view` registrando após acesso real

---

## Out of Scope

- Reescrita da headline `/precos` → VIAB-R1-2.1 (parte de R3 do roadmap)
- A/B test de variantes A/B/C → VIAB-R3 (sprint após R1+R2)
- SEO técnico avançado (sitemap, robots.txt) → backlog
- Tradução EN/ES → backlog

---

## Riscos

| Risco | Probabilidade | Mitigação |
|-------|---------------|-----------|
| Número R$ 847 não defensável → claim falsa | Média | Substituir por faixa "R$ 500-1.200/mês" ou tag `[estimativa]` no rodapé |
| Headline polariza muito (vendedor fica defensivo) | Média | Track 1 valida copy com owner antes do deploy |
| Lighthouse <90 por imagens grandes | Baixa | Usar `next/image` + AVIF/WebP; lazy-load abaixo da dobra |
| Quebra de regressão em rotas autenticadas | Baixa | Middleware allowlist é additive; smoke test cobre rotas existentes |

---

## Definition of Done

- [ ] AC 1-11 todos checados
- [ ] PR aberto para `main` com screenshots mobile + desktop
- [ ] Lighthouse score documentado no PR
- [ ] @qa gate PASS
- [ ] Story atualizada com File List final + Status `Done`
- [ ] Pedro Emilio confirma copy via review do PR

---

## Change Log

| Data | Autor | Mudança |
|------|-------|---------|
| 2026-05-01 | Orion (aiox-master) | Story criada a partir de M6 Finding 1 + Alternativa A |
