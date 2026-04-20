# PRD § 4 — Technical Assumptions

> SmartPreço PRD v1.0 — 2026-04-20 | Shard 4/8

## Repository Structure

**Monorepo** — frontend e backend na mesma estrutura, organizado por `packages/` se necessário separar futuramente.

## Service Architecture

**Monolith modular com Next.js App Router:**

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 14+ (App Router) + Tailwind CSS + shadcn/ui |
| Backend | API Routes do próprio Next.js (server actions + route handlers) |
| Banco | Supabase (PostgreSQL + Auth + RLS + Realtime) |
| Deploy | Vercel (frontend + API Routes) + Railway (serviços adicionais se necessário) |
| ML API | Calls server-side para evitar CORS e não expor credenciais |

## Testing Requirements

| Tipo | Ferramenta | Obrigatoriedade |
|------|-----------|----------------|
| Unit | Jest + Testing Library | Obrigatório — ≥70% cobertura em funções de cálculo financeiro |
| Integration | Testes de API Routes com mock Supabase | Recomendado |
| E2E | Cypress ou Playwright | Fluxos críticos (calculadora → simulador → decisão) |
| Manual | Checklist de QA | Obrigatório por story antes do merge |

## Additional Technical Assumptions

- Supabase para Auth, banco PostgreSQL e Storage (fotos de SKU)
- Taxas do ML mantidas em tabela no banco, atualizáveis sem deploy
- Cache de resultados de busca ML: 1 hora no banco para evitar rate limit
- Variáveis de ambiente sensíveis: nunca expostas no cliente, sempre server-side
- TypeScript obrigatório em todo o codebase
- ESLint + Prettier configurados no setup inicial
- GitHub Actions para CI (lint + test + typecheck) em cada PR

---

[← UI Design Goals](03-ui-design.md) | [→ Epic List](05-epic-list.md)
