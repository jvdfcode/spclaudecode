# SmartPreço — Débito Técnico (Draft)

> Produzido por: @architect (Brownfield Discovery — Fase 4)
> Data: 2026-04-23
> Base: system-architecture.md + SCHEMA.md + DB-AUDIT.md + frontend-spec.md

---

## Resumo Executivo

O SmartPreço tem uma base técnica sólida e bem estruturada para um MVP. O maior risco não é débito de código — é **incompletude de features críticas** (OAuth ML, mobile nav) e **ausência de resiliência operacional** (sem rate limiting, sem observabilidade, sem cache cleanup). O design system está em excelente estado após o redesign.

**Score de débito por área:**

| Área | Severidade | Score (1-5) |
|------|-----------|-------------|
| Segurança (rate limiting) | 🔴 ALTO | 4 |
| Observabilidade | 🔴 ALTO | 4 |
| Mobile UX (sidebar) | 🔴 ALTO | 4 |
| Feature gaps (OAuth ML) | 🔴 ALTO | 4 |
| Performance DB | ⚠️ MÉDIO | 3 |
| Qualidade de código | ✅ BAIXO | 2 |
| Design system | ✅ BAIXO | 1 |

---

## Débitos por Categoria

### SEGURANÇA

#### TD-SEC-01 — Sem rate limiting nos endpoints ML
**Severidade:** ALTO  
**Impacto:** Usuário malicioso pode disparar scraping massivo causando ban de IP e aumento de custo de compute  
**Localização:** `src/app/api/ml-proxy/route.ts`, `src/app/api/ml-search/route.ts`  
**Correção sugerida:** Implementar `@upstash/ratelimit` ou middleware Next.js com sliding window de 10 req/min por usuário  
**Esforço:** 1-2 dias

#### TD-SEC-02 — Headers de scraping ML hardcoded
**Severidade:** BAIXO  
**Impacto:** User-Agent fixo facilita detecção de bot pelo ML  
**Localização:** `src/app/api/ml-proxy/route.ts:8`  
**Correção sugerida:** Rotacionar User-Agents de uma lista  
**Esforço:** 4h

---

### OBSERVABILIDADE

#### TD-OBS-01 — Sem logging estruturado
**Severidade:** ALTO  
**Impacto:** Impossível diagnosticar erros em produção sem logs  
**Localização:** Global — nenhum endpoint tem logging  
**Correção sugerida:** Integrar Sentry ou Axiom para erro + performance monitoring  
**Esforço:** 1-2 dias

#### TD-OBS-02 — Sem métricas de uso
**Severidade:** MÉDIO  
**Impacto:** Sem dados sobre conversão calculadora→salvar SKU, taxa de busca ML, etc.  
**Correção sugerida:** Mixpanel ou Plausible Analytics com eventos customizados  
**Esforço:** 1 dia

---

### FEATURES INCOMPLETAS

#### TD-FEAT-01 — OAuth Mercado Livre não implementado
**Severidade:** ALTO  
**Impacto:** Integração com API oficial ML (anúncios, reputação, vendas) bloqueada. Scraping é solução temporária.  
**Localização:** `supabase/migrations/006_ml_tokens.sql` (estrutura OK), nenhuma implementação  
**Correção sugerida:** Implementar flow OAuth 2.0 completo: botão "Conectar ML" → callback → salvar tokens → refresh automático  
**Esforço:** 3-5 dias

#### TD-FEAT-02 — Sidebar mobile ausente
**Severidade:** ALTO  
**Impacto:** Aplicação inutilizável em smartphones sem menu de navegação  
**Localização:** `src/components/layout/AppShell.tsx`, `Sidebar.tsx`  
**Correção sugerida:** Drawer/Sheet component do shadcn/ui com botão hamburguer no TopBar  
**Esforço:** 1 dia

#### TD-FEAT-03 — WelcomeTour sem integração
**Severidade:** MÉDIO  
**Impacto:** Onboarding guiado não funciona — componente existe mas não é chamado  
**Localização:** `src/components/onboarding/WelcomeTour.tsx`  
**Correção sugerida:** Integrar no dashboard com check de `localStorage` para novos usuários  
**Esforço:** 1 dia

#### TD-FEAT-04 — DecisionPanel/PositionOptions sem integração clara
**Severidade:** MÉDIO  
**Impacto:** Fase final da calculadora (decisão de precificação) sem fluxo definido  
**Localização:** `src/components/decisao/`  
**Esforço:** Análise + 2 dias implementação

#### TD-FEAT-05 — SKU detalhe (`/skus/[id]`) incompleto
**Severidade:** BAIXO  
**Impacto:** Estrutura de rota existe mas conteúdo da página detalhada não foi finalizado  
**Localização:** `src/app/(app)/skus/[id]/page.tsx`  
**Esforço:** 2 dias

---

### PERFORMANCE

#### TD-PERF-01 — `listSkus` query ineficiente
**Severidade:** MÉDIO  
**Impacto:** Retorna TODOS os cálculos históricos por SKU para exibir apenas o mais recente  
**Localização:** `src/lib/supabase/skus.ts:161`  
**Correção:** LATERAL JOIN — ver DB-AUDIT.md M1  
**Esforço:** 4h

#### TD-PERF-02 — `ml_search_cache` sem cleanup
**Severidade:** ALTO  
**Impacto:** Banco cresce indefinidamente com registros expirados  
**Correção:** pg_cron job — ver DB-AUDIT.md A2  
**Esforço:** 2h

#### TD-PERF-03 — Filtro de SKUs in-memory
**Severidade:** BAIXO  
**Impacto:** Server fetches todos os SKUs e filtra no Node; sem query params reativos  
**Localização:** `src/app/(app)/skus/page.tsx`  
**Esforço:** 4h

---

### MANUTENIBILIDADE

#### TD-MAINT-01 — Tipos DB gerados manualmente
**Severidade:** MÉDIO  
**Impacto:** Risco de divergência entre TypeScript e schema real  
**Localização:** `src/types/database.ts`  
**Correção:** CI step com `supabase gen types`  
**Esforço:** 4h

#### TD-MAINT-02 — Cobertura de testes insuficiente
**Severidade:** MÉDIO  
**Impacto:** Motor de cálculo tem testes unitários, mas sem cobertura de Server Actions, API routes, componentes  
**Localização:** `tests/`  
**Esforço:** 3-5 dias para cobertura completa

#### TD-MAINT-03 — Scraping ML frágil
**Severidade:** MÉDIO  
**Impacto:** Mudança no HTML do ML quebrará silenciosamente a busca de mercado  
**Localização:** `src/app/api/ml-proxy/route.ts:48`  
**Correção sugerida:** Adicionar testes de snapshot HTML + alerting quando resultado_count = 0  
**Esforço:** 2 dias

---

### ACESSIBILIDADE

#### TD-A11Y-01 — `prefers-reduced-motion` não tratado
**Severidade:** MÉDIO  
**Impacto:** Usuários com sensibilidade a movimento receberão todas as animações  
**Localização:** `src/lib/motion/presets.ts`  
**Correção:** Adicionar `useReducedMotion()` do `motion/react` nos presets  
**Esforço:** 2h

#### TD-A11Y-02 — Skip navigation link ausente
**Severidade:** BAIXO  
**Localização:** `src/app/layout.tsx`  
**Esforço:** 1h

---

## Priorização (MoSCoW)

### Must Have (bloqueiam uso real)
1. TD-FEAT-02 — Sidebar mobile
2. TD-SEC-01 — Rate limiting ML endpoints
3. TD-OBS-01 — Logging/monitoring básico

### Should Have (qualidade de produção)
4. TD-PERF-02 — Cleanup cache ML
5. TD-MAINT-01 — Tipos DB automáticos
6. TD-A11Y-01 — prefers-reduced-motion
7. TD-PERF-01 — listSkus otimizado
8. TD-FEAT-03 — WelcomeTour ativo

### Could Have (features de valor)
9. TD-FEAT-01 — OAuth ML completo
10. TD-FEAT-04 — DecisionPanel integrado
11. TD-FEAT-05 — SKU detalhe completo
12. TD-MAINT-02 — Cobertura de testes

### Won't Have (próximo ciclo)
13. TD-SEC-02 — User-Agent rotation
14. TD-OBS-02 — Métricas de uso
15. TD-PERF-03 — Filtro DB-side
16. TD-A11Y-02 — Skip nav link

---

*Documento draft — sujeito a revisão nas Fases 5-7.*
