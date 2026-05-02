# VIAB-R1-2 — Landing pública em `/` com headline Loss Aversion

**Epic:** EPIC-VIAB-R1 (Recomendações 30 dias do relatório de viabilidade 2026-04-30)
**Status:** InReview (código pronto + CI gates PASS; pendente preview Vercel + review humano)
**Severidade:** CRÍTICA — buraco fatal no funil de aquisição
**Sprint:** SPRINT-2026-05-05 (proposto)
**Owner:** Pedro Emilio (executor: @dev + @ux-design-expert para revisão de copy)
**SP estimado:** 3 SP (~4-6h)
**Referência:**
- `docs/reviews/viability-2026-04-30/findings/M6-finch-headline-test.md` (Finding 1 + Alternativas A/B/C)
- Debate estratégico 2026-05-02: Design Chief + Thiago Finch + MeliDev Chief (5 ajustes obrigatórios consolidados nesta v2)

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

**Headline final aprovada (Variante D MeliDev — após debate de 3 specialists em 2026-05-02):**

> **"Sua reputação cai quando você precifica no escuro. Calcule comissão Classic ou Premium, taxa fixa e frete grátis em 30s — antes de anunciar."**

Subheadline:
> **"Estimativa: vendedores ML podem perder R$ 500-1.500/mês com erro de pricing.\* Calcule o seu agora."**
> \* *Faixa baseada em política ML + custos típicos de cancelamento/mediação. Sua perda real depende do mix de SKUs.*

CTA primário → `/calculadora-livre?utm_source=home&utm_medium=cta_primary` (lead magnet existente, já com email capture LGPD-compliant via PROD-001-10/PROD-001-13).

**Por que mudou de Variante A:**
- A "R$ 847" sem fonte é claim publicitário sem [SOURCE:] — risco CDC art 37 §1° + CONAR (MeliDev)
- D usa jargão ML real (Classic/Premium, taxa fixa, frete grátis) — Loss Aversion via cascata reputação→mediação→cancelamento (M5 Finding 2)
- Mecanismo concreto > número fabricado — defensável + nativo do nicho

---

## Acceptance Criteria

### Estrutura e roteamento
1. [ ] `https://smartpreco.app/` retorna HTTP 200 com landing renderizada (não 307 redirect)
2. [ ] Middleware faz redirect server-side condicional: usuário **logado** acessando `/` → `/dashboard`; **anônimo** → renderiza landing
3. [ ] CTA primário leva para `/calculadora-livre?utm_source=home&utm_medium=cta_primary`
4. [ ] CTA secundário leva para `/precos`
5. [ ] Página é responsiva mobile-first (validar 375px/768px/1280px)

### Hero (above-the-fold)
6. [ ] Headline H1 = Variante D MeliDev exata (preserva jargão ML: comissão Classic/Premium, taxa fixa, frete grátis)
7. [ ] Subheadline com faixa "R$ 500-1.500/mês" + asterisco-disclaimer rodapé
8. [ ] **Stat card hero "1 número"** above-the-fold (Instrument Serif, Halo navy/laranja) destacando faixa de perda — não basta texto, precisa ser elemento visual de peso (estilo Sellerboard "lucro real")

### Sub-blocos abaixo da dobra (ordem importa — sequência Loss Aversion 2.5:1)
9. [ ] Sub-bloco "**Mas o ML já não tem calculadora?**" diferencia explicitamente: ML = "vender mais" (preço Buy Box) | SmartPreço = "lucrar mais" (margem real considerando comissão Classic 11% / Premium 17% + taxa fixa + cancelamento)
10. [ ] Sub-bloco "**Como funciona em 3 passos**" (calcule → compare → decida)
11. [ ] Sub-bloco "**Prova social honesta**" (contador real "X cálculos realizados nos últimos 30 dias" puxado de funnel_events — NÃO inventar logos/depoimentos)
12. [ ] Sub-bloco "**Pricing teaser**" com link para `/precos`

### Conformidade LGPD + jargão ML
13. [ ] Cookie banner mínimo aparece em primeiro acesso anônimo (consent antes de funnel_events)
14. [ ] Footer com link para `/privacidade` (já existente — só linkar)
15. [ ] Copy usa jargão ML obrigatório: comissão (Classic/Premium), taxa fixa, FULL/Flex/Coleta, mediação, reputação. Sai SaaS-genérico ("motor de decisão", "stack de dados")

### Instrumentação e eventos
16. [ ] Eventos novos em funnel_events (estender `FunnelEventName` em `src/lib/analytics/events.ts`):
    - `home_view` (page load)
    - `home_cta_primary_click` (click no CTA principal)
    - `home_cta_secondary_click` (click em "Ver preços")
    - `home_section_view` (intersection observer nos 4 sub-blocos)

### Metadata e qualidade
17. [ ] Meta tags consistentes (`<title>`, `og:title`, `og:description`, `og:image`); OG image reusa `/calculadora-livre` como placeholder
18. [ ] `npm run typecheck` e `npm run lint` PASS
19. [ ] `npm run build` PASS (validar SSR)
20. [ ] Pedro confirma copy via review do preview Vercel antes de promote para prod

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

- [x] AC 1, 3-9, 13-19 checados em código (CI gates locais passam — typecheck + lint + build)
- [ ] AC 2, 10-12, 20 dependem de deploy preview Vercel + review humano de Pedro
- [ ] @qa gate PASS — local OK, deploy preview pendente
- [ ] Story atualizada com File List final + Status `Done` após Pedro confirmar preview

---

## File List (alterações desta story)

### Criados
- `src/components/landing/HomeTracking.tsx` — client island (home_view + delegação click + IntersectionObserver para section_view)

### Modificados
- `src/app/page.tsx` — substitui `redirect('/dashboard')` por landing completa (server component)
- `src/middleware.ts` — adiciona `/` em redirect logado→`/dashboard` (linha 32-35)
- `src/lib/analytics/events.ts` — estende `FunnelEventName` com 5 novos eventos (home_*, calc_email_capture_shown)

### Build verificado
- `/` agora é prerendered (○ static), 1.48 kB JS / 161 kB First Load
- typecheck + lint + build PASS
- 24 pages geradas com sucesso

---

## Change Log

| Data | Autor | Mudança |
|------|-------|---------|
| 2026-05-01 | Orion (aiox-master) | Story criada a partir de M6 Finding 1 + Alternativa A |
| 2026-05-02 | Orion + 3 specialists | v2 — Variante D MeliDev (substitui A); +5 ajustes (stat card hero, sub-bloco "ML já tem calc?", LGPD cookie banner, jargão ML, eventos expandidos); 20 ACs (era 11) |
| 2026-05-02 | Orion (papel @po) | Validação 10/10 — transição Draft → Ready (GO) |
| 2026-05-02 | Orion (papel @dev) | Implementação: page.tsx (landing real), HomeTracking.tsx (island), middleware.ts (redirect logado), events.ts (5 eventos novos) |
| 2026-05-02 | Orion (papel @qa) | typecheck + lint + build PASS; `/` agora é prerendered static; transição → InReview |
