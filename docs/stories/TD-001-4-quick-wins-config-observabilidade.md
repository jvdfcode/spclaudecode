# Story TD-001-4 — Quick wins de configuração e observabilidade

**Epic:** EPIC-TD-001
**Status:** Draft
**Owner:** @dev (sugerido)
**Severidade débito:** CRITICAL a LOW
**Esforço estimado:** 2–3 dias (itens paralelos; ~1h cada)

---

## Contexto

Os 14 quick wins mapeados no `technical-debt-assessment.md` Seção 5 são fixes mecânicos de baixo risco e alto impacto, executáveis de forma independente — preferencialmente em commits atômicos separados para facilitar revisão e rollback seletivo. Nenhum item exige alteração de arquitetura ou testes complexos.

Agrupados por tema:

**Tipos e dependências (DEBT-C1, DEBT-H4):**
- `@types/react@19` instalado num projeto React 18 causa mismatch de tipos em todo o TSX. Downgrade para `@types/react@^18.2` resolve silently com `pnpm install`.
- `cheerio` instalado mas não importado em nenhum arquivo — dependência fantasma que aumenta bundle de CI.

**Observabilidade Sentry (DEBT-H3, DEBT-M5, DEBT-L1):**
- `sentry.edge.config.ts:6` tem `tracesSampleRate: 0` — zero telemetria no Edge; falhas em rotas Edge são completamente invisíveis.
- `beforeSend` de filtragem de PII duplicado entre `sentry.client.config.ts` e `sentry.server.config.ts` — divergência silenciosa se um for atualizado sem o outro.
- `app/error.tsx` captura o erro visualmente mas não chama `Sentry.captureException(error)` — erros de boundary não chegam ao Sentry.

**Configuração de ambiente (DEBT-H5, DEBT-M4):**
- `.env.example` incompleto: variáveis de Sentry DSN, ML API key, Supabase access token ausentes — novo dev leva horas para descobrir o que precisa.
- `package.json:14-15` tem Project ID do Supabase hardcoded — deve vir de `SUPABASE_PROJECT_ID` env var.

**Database (DEBT-DB-C1 parcial, DB-EXTRA-04):**
- `rate_limit_log` tem RLS habilitado mas zero policies documentadas. `COMMENT ON TABLE` e policy explícita (a policy de INSERT foi para a migration 009 da story TD-001-1; esta story adiciona `COMMENT` e policy de SELECT se ausente).
- `ml_fees` não tem trigger `set_updated_at` — a coluna `updated_at` nunca é atualizada automaticamente por updates. Migration 010 simples (trigger nativo, sem `pg_cron`).

**Frontend (DEBT-FE-9, DEBT-FE-NEW-3, DEBT-FE-NEW-4):**
- `(auth)/layout.tsx` não exporta `metadata` — páginas de login/signup aparecem sem título no browser e em SEO.
- `EmptyState.tsx:14-25` sem `role` semântico — leitores de tela não sabem que é uma região de status.
- `CostForm.tsx:148-154` — inputs numéricos sem `inputMode="decimal"` — mobile exibe teclado alfabético em vez do numérico com ponto decimal.

---

## Débitos cobertos

- **DEBT-C1** (CRITICAL) — `@types/react@19` mismatch em projeto React 18 — `package.json:28,38`
- **DEBT-H3** (HIGH) — Sentry edge `tracesSampleRate: 0` — `sentry.edge.config.ts:6`
- **DEBT-H4** (HIGH) — `cheerio` instalado, não importado — `package.json:22`
- **DEBT-H5** (HIGH) — `.env.example` incompleto — `.env.example`
- **DEBT-M4** (MEDIUM) — Project ID Supabase hardcoded — `package.json:14-15`
- **DEBT-M5** (MEDIUM) — `beforeSend` PII duplicado entre client e server Sentry — `sentry.client.config.ts`, `sentry.server.config.ts`
- **DEBT-L1** (LOW) — `error.tsx` sem `Sentry.captureException` — `app/error.tsx`
- **DEBT-DB-C1** (CRITICAL parcial) — `COMMENT ON TABLE rate_limit_log` + policy explícita — `008_rate_limit_log.sql` (complemento à migration 009 da TD-001-1)
- **DEBT-FE-9** (LOW) — Metadata ausente nas rotas `(auth)` — `src/app/(auth)/layout.tsx`
- **DEBT-FE-NEW-3** (MEDIUM) — `EmptyState` sem `role` semântico — `src/components/EmptyState.tsx:14-25`
- **DEBT-FE-NEW-4** (MEDIUM) — Inputs numéricos sem `inputMode="decimal"` — `src/components/CostForm.tsx:148-154`
- **DB-EXTRA-04** (LOW) — `ml_fees` sem trigger `updated_at` — migration 010

---

## Acceptance Criteria

Cada item tem seu critério de verificação:

- [ ] **AC-C1:** `pnpm typecheck` passa sem erros após downgrade; `package.json` mostra `"@types/react": "^18.2"` e `"@types/react-dom": "^18.2"`
- [ ] **AC-H3:** `sentry.edge.config.ts:6` tem `tracesSampleRate: 0.1`; build passa
- [ ] **AC-H4:** `cheerio` não aparece em `package.json` após `pnpm remove cheerio`; `pnpm install` sem erros
- [ ] **AC-H5:** `.env.example` contém todas as variáveis necessárias com comentários: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_PROJECT_ID`, `SENTRY_DSN`, `SENTRY_AUTH_TOKEN`, `ML_API_KEY` (ou equivalentes do projeto)
- [ ] **AC-M4:** `package.json` não contém Project ID do Supabase em valor literal; código que usava lê de `process.env.SUPABASE_PROJECT_ID`
- [ ] **AC-M5:** Arquivo `src/lib/sentry.shared.ts` (ou caminho equivalente) exporta `beforeSend` handler; `sentry.client.config.ts` e `sentry.server.config.ts` importam de lá — sem duplicação
- [ ] **AC-L1:** `app/error.tsx` chama `Sentry.captureException(error)` no corpo do componente ou em `useEffect`
- [ ] **AC-DB-C1:** `SELECT obj_description('rate_limit_log'::regclass)` retorna texto descritivo não nulo; policy explícita presente em `pg_policies` para `rate_limit_log`
- [ ] **AC-FE-9:** `src/app/(auth)/layout.tsx` exporta `metadata` com `title` e `description` adequados (ex: `"SmartPreço — Acesso"`)
- [ ] **AC-FE-NEW-3:** `EmptyState.tsx` tem `role="status"` no elemento raiz
- [ ] **AC-FE-NEW-4:** Inputs numéricos em `CostForm.tsx:148-154` têm `inputMode="decimal"`
- [ ] **AC-DB-EXTRA-04:** Migration 010 aplicada; trigger `set_updated_at` existe em `ml_fees`; UPDATE em `ml_fees` atualiza `updated_at` automaticamente
- [ ] **AC-GERAL:** `pnpm build`, `pnpm lint`, `pnpm typecheck`, `pnpm test` passando após todos os itens

---

## Tasks

_(Um commit por item recomendado. Prefixo de commit: `fix(debt): `)_

- [ ] **T1 [DEBT-C1]:** `pnpm remove @types/react @types/react-dom && pnpm add -D @types/react@^18.2 @types/react-dom@^18.2`; verificar `pnpm typecheck`
- [ ] **T2 [DEBT-H3]:** Editar `sentry.edge.config.ts:6` — `tracesSampleRate: 0` → `tracesSampleRate: 0.1`
- [ ] **T3 [DEBT-H4]:** `pnpm remove cheerio`; verificar `pnpm build`
- [ ] **T4 [DEBT-H5]:** Abrir `.env.example`; adicionar variáveis faltantes com comentários explicativos; não adicionar valores reais
- [ ] **T5 [DEBT-M4]:** Localizar onde `package.json:14-15` usa Project ID via `grep -n "SUPABASE_PROJECT" package.json` ou similar; refatorar para `process.env.SUPABASE_PROJECT_ID`; adicionar ao `.env.example` (já feito no T4)
- [ ] **T6 [DEBT-M5]:** Criar `src/lib/sentry.shared.ts` com função `beforeSend` de filtragem de PII; importar em `sentry.client.config.ts` e `sentry.server.config.ts`; remover implementação duplicada de ambos
- [ ] **T7 [DEBT-L1]:** Editar `app/error.tsx` — adicionar `Sentry.captureException(error)` (em `useEffect([error])` se componente é cliente, ou diretamente se servidor)
- [ ] **T8 [DEBT-DB-C1]:** Criar `supabase/migrations/010_ml_fees_trigger_and_comments.sql` com:
  - `COMMENT ON TABLE rate_limit_log IS 'Registra requests por usuário para rate limiting. RLS habilitado — apenas owner pode INSERT. Sem TTL nativo — limpeza via pg_cron (H2).'`
  - Policy SELECT explícita em `rate_limit_log` se ausente
  - Trigger `set_updated_at` em `ml_fees`
  - Criar arquivo de rollback correspondente
- [ ] **T9 [DB-EXTRA-04]:** Incluído em T8 — trigger `set_updated_at` em `ml_fees` na mesma migration 010
- [ ] **T10 [DEBT-FE-9]:** Editar `src/app/(auth)/layout.tsx` — exportar `export const metadata: Metadata = { title: 'SmartPreço — Acesso', description: 'Faça login ou crie sua conta no SmartPreço' }`
- [ ] **T11 [DEBT-FE-NEW-3]:** Editar `src/components/EmptyState.tsx:14-25` — adicionar `role="status"` no elemento raiz do componente
- [ ] **T12 [DEBT-FE-NEW-4]:** Editar `src/components/CostForm.tsx:148-154` — adicionar `inputMode="decimal"` nos inputs numéricos identificados
- [ ] **T13:** Aplicar migration 010 via `supabase db push`; verificar `supabase migration list`
- [ ] **T14:** Executar `pnpm build && pnpm lint && pnpm typecheck && pnpm test`; resolver qualquer falha antes de marcar done

---

## File List

_(preenchido durante implementação)_

- `package.json` — modificado (T1, T3, T5)
- `sentry.edge.config.ts` — modificado (T2)
- `.env.example` — modificado (T4)
- `src/lib/sentry.shared.ts` — criado (T6)
- `sentry.client.config.ts` — modificado (T6)
- `sentry.server.config.ts` — modificado (T6)
- `src/app/error.tsx` — modificado (T7)
- `supabase/migrations/010_ml_fees_trigger_and_comments.sql` — criado (T8, T9)
- `supabase/migrations/010_ml_fees_trigger_and_comments_rollback.sql` — criado (T8)
- `src/app/(auth)/layout.tsx` — modificado (T10)
- `src/components/EmptyState.tsx` — modificado (T11)
- `src/components/CostForm.tsx` — modificado (T12)

---

## Notas técnicas

**DEBT-C1 — por que downgrade e não upgrade do React?**
A Suposição 1 do `technical-debt-assessment.md` (Seção 8) congela a stack em Next.js 14 + React 18. `@types/react@19` foi instalado por engano ou por dependência transitória; o correto é alinhar com React 18.

**DEBT-H3 — por que 0.1 e não 1.0?**
`tracesSampleRate: 1.0` em produção captura 100% das transações — custo de Sentry performance cresce linearmente. 0.1 (10%) é o padrão recomendado para produção; garante visibilidade sem custo excessivo. Pode ser aumentado temporariamente para investigações.

**DEBT-M5 — sentry.shared.ts — exemplo mínimo:**
```ts
// src/lib/sentry.shared.ts
import type { Event } from '@sentry/nextjs';

export function beforeSendFilter(event: Event): Event | null {
  // Remover dados pessoais do payload
  if (event.request?.cookies) delete event.request.cookies;
  if (event.user?.email) event.user.email = '[redacted]';
  return event;
}
```

**DEBT-L1 — `error.tsx` em App Router:**
Em Next.js App Router, `error.tsx` é um Client Component (`'use client'`). Usar `useEffect`:
```tsx
'use client';
import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function ErrorBoundary({ error }: { error: Error }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);
  // ... resto do componente
}
```

**Migration 010 — trigger `set_updated_at` em `ml_fees`:**
```sql
-- 010_ml_fees_trigger_and_comments.sql
CREATE OR REPLACE TRIGGER set_ml_fees_updated_at
  BEFORE UPDATE ON ml_fees
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at(); -- função genérica já existe se M007 foi aplicada
```
Verificar se `set_updated_at()` já existe no schema antes de criar — a migration M007 provavelmente já a criou para outras tabelas.

**Referências:**
- `technical-debt-assessment.md` Seção 5 — lista completa dos 14 quick wins
- `technical-debt-assessment.md` Seção 9 — migration 010 proposta
- `docs/reviews/db-specialist-review.md` — SQL da migration 010 (Dara, Fase 5)
- `sentry.edge.config.ts:6` — linha exata do tracesSampleRate
- `src/components/CostForm.tsx:148-154` — linhas dos inputs numéricos
- `src/components/EmptyState.tsx:14-25` — elemento raiz sem role

---

## Riscos / Plano de rollback

**Risco principal (DEBT-C1):** Downgrade de `@types/react` pode expor incompatibilidades de tipo em componentes que inadvertidamente usavam tipos da v19.

**Mitigação:** `pnpm typecheck` imediatamente após o downgrade (T1) — corrigir eventuais falhas antes de continuar outros itens.

**Rollback por item:** Cada item é commit atômico — reverter com `git revert <commit-hash>` seletivamente. Para migrations (T8/T13): aplicar arquivo rollback correspondente via `supabase db push`.

---

*Story gerada por @pm (Morgan) — EPIC-TD-001 — Brownfield Discovery Fase 10 — 2026-04-27*
