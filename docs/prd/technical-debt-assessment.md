# SmartPreço — Assessment de Débito Técnico (Final)

> Produzido por: @architect (Brownfield Discovery — Fase 8)
> Data: 2026-04-23
> Status: Aprovado pelo QA Gate (Fase 7)

---

## Estado do Sistema

O SmartPreço é um SaaS de precificação para vendedores do Mercado Livre Brasil, construído sobre Next.js 14 + Supabase + Tailwind v4. Após o redesign UI (fusão com design system Codex), o produto possui:

- **Motor de cálculo:** completo e testado
- **Design system:** profissional, coeso, com tokens semânticos
- **Scraping ML:** funcional, com cache
- **Portfólio de SKUs:** CRUD completo
- **Autenticação:** Supabase Auth com RLS

## Mapa Consolidado de Débitos

### Grupo 1 — Bloqueadores de Produção Real

| ID | Item | Esforço | Sprint |
|----|------|---------|--------|
| TD-FEAT-02 | Sidebar mobile (drawer) | 1 dia | Sprint 1 |
| TD-SEC-01 | Rate limiting endpoints ML | 1-2 dias | Sprint 1 |
| TD-OBS-01 | Logging/monitoring (Sentry) | 1-2 dias | Sprint 1 |
| TD-PERF-02 | Cleanup cache ML (pg_cron) | 2h | Sprint 1 |
| UX-GAP-01 | Feedback loading busca ML | 4h | Sprint 1 |

**Total Sprint 1:** ~5-7 dias de trabalho

### Grupo 2 — Qualidade e Completude

| ID | Item | Esforço | Sprint |
|----|------|---------|--------|
| TD-FEAT-03 | WelcomeTour integrado | 1 dia | Sprint 2 |
| TD-MAINT-01 | Tipos DB automáticos (CI) | 4h | Sprint 2 |
| TD-A11Y-01 | prefers-reduced-motion | 2h | Sprint 2 |
| TD-PERF-01 | listSkus otimizado (LATERAL) | 4h | Sprint 2 |
| UX-GAP-02 | Sistema de toast (sonner) | 4h | Sprint 2 |
| DB-GAP-01 | RLS sku_calculations (EXISTS) | 15min | Sprint 2 |
| DB-GAP-02 | Índice (user_id, updated_at) | 15min | Sprint 2 |
| UX-GAP-03 | ScenarioTable linha recomendada | 4h | Sprint 2 |

**Total Sprint 2:** ~4-5 dias de trabalho

### Grupo 3 — Features de Valor Completo

| ID | Item | Esforço | Sprint |
|----|------|---------|--------|
| TD-FEAT-01 | OAuth ML completo | 3-5 dias | Sprint 3 |
| TD-FEAT-04 | DecisionPanel integrado | 2-3 dias | Sprint 3 |
| TD-FEAT-05 | SKU detalhe completo | 2 dias | Sprint 3 |
| TD-MAINT-02 | Cobertura de testes | 3-5 dias | Sprint 3 |
| TD-MAINT-03 | Scraping ML com alerting | 2 dias | Sprint 3 |

**Total Sprint 3:** ~12-17 dias de trabalho

---

## Decisões Arquiteturais Recomendadas

### Manter (não mudar)
- Next.js App Router + Server Components — padrão correto
- Supabase — adequado para escala MVP
- Tailwind v4 + tokens CSS — design system funciona bem
- Estratégia de scraping ML — solução pragmática e funcional

### Evoluir
- Adicionar rate limiting antes de crescer base de usuários
- Migrar para `supabase gen types` no CI
- Formalizar cobertura de testes com threshold mínimo (70%)

### Considerar no futuro
- API oficial ML via OAuth (TD-FEAT-01) — quando necessário para features avançadas
- Edge Functions do Vercel para cache de ML no edge
- `@vercel/analytics` integrado por ser nativo na plataforma

---

## Pontuação Final por Área

| Área | Score | Justificativa |
|------|-------|---------------|
| Arquitetura | 8/10 | Padrões sólidos, Next.js + Supabase bem usados |
| Design System | 9/10 | Coeso, tokens semânticos, motion padronizado |
| Banco de Dados | 7/10 | RLS correto, alguns gaps de performance |
| Segurança | 5/10 | Sem rate limiting é risco real |
| Observabilidade | 3/10 | Praticamente zero logging |
| Mobile UX | 4/10 | Sem sidebar mobile é bloqueador |
| Features | 6/10 | Core completo, features secundárias incompletas |
| Testes | 5/10 | Motor testado, pouca cobertura de integração |

**Score médio: 5.9/10** — Pronto para MVP limitado, não para lançamento público irrestrito.
