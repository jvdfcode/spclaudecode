# Story PROD-001-1 — Decisão Supabase (D1) + criar projeto se novo

**Epic:** EPIC-PROD-001
**Status:** Draft
**Owner:** Pedro Emilio
**Severidade origem:** B3, H3, H4
**Esforço estimado:** 2-3 SP

---

## Contexto

Esta story resolve a pré-condição D1 do Sprint: qual projeto Supabase vai para produção — o existente (`jvdfcode`, project-id `ltpdqavqhraphoyusmdi`) ou um novo? Dara (02-data-engineer-dara.md) documenta que essa decisão bloqueia três consequências em cascata: migrations 009-011 não podem ser aplicadas sem saber o alvo, as env vars do Vercel não têm valor sem as chaves do projeto correto, e o CI continua gerando drift falso enquanto o project-id permanecer hardcoded. Sem essa decisão, PROD-001-3, PROD-001-4 e PROD-001-6 estão bloqueadas.

Se a decisão for por projeto novo, esta story inclui a criação do projeto no Supabase (via MCP ou dashboard), captura do `project-id`, `SUPABASE_URL`, `ANON_KEY` e `SERVICE_ROLE_KEY` novos.

**v2 — re-estimativa:** de 1 SP para 2-3 SP. Inclui decisão D1 + criação (se novo) + link + 4 chaves + migração 001-011 se projeto novo — total 2-3h. Input de Alan Nicolas (síntese trio, mudança #7).

---

## Acceptance Criteria

- [ ] Decisão D1 registrada em `.aiox/decisions/D1-supabase.md` com: projeto escolhido, project-id, URL, justificativa
- [ ] Se projeto novo: `supabase projects list` mostra o novo projeto ativo no org correto
- [ ] Project-id disponível para uso imediato nas stories PROD-001-3, PROD-001-4 e PROD-001-6
- [ ] As quatro chaves (`SUPABASE_URL`, `ANON_KEY`, `SERVICE_ROLE_KEY`, `ACCESS_TOKEN`) anotadas com segurança (não commitadas)

---

## Tasks

- [ ] Confirmar com Pedro qual projeto Supabase usar (jvdfcode existente vs. novo)
- [ ] Se novo: criar projeto via `supabase projects create smartpreco --org-id <ORG_ID>` ou via dashboard
- [ ] Anotar project-id, URL, anon_key, service_role_key
- [ ] Criar `.aiox/decisions/D1-supabase.md` com decisão registrada
- [ ] Passar project-id para as stories dependentes (PROD-001-3, PROD-001-4, PROD-001-6)

---

## File List

(preenchido durante execução)

---

## Notas técnicas

Se projeto existente: project-id atual é `ltpdqavqhraphoyusmdi` (confirmado em `ci.yml:116` e `package.json:14`). Verificar se migrations 001-008 já estão aplicadas com `supabase migration list --project-id ltpdqavqhraphoyusmdi`.

Se projeto novo: após criação, rodar `supabase link --project-ref <novo-id>` localmente para que o CLI aponte para o projeto certo.

Ver Dara Bloco recomendação 1 (sequência de `supabase migration list → supabase db push → pnpm generate:types`) — esta story é o passo zero dessa sequência.

---

## Riscos

1. Decisão de criar projeto novo adiciona ~30min de setup e requer todas as migrations do zero (001-011), não só 009-011.
2. Usar projeto existente com dados de desenvolvimento pode contaminar métricas de produção — avaliar com Pedro.
