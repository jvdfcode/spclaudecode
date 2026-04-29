# Story PROD-001-3 — Aplicar migrations 009-011 no Supabase + regen tipos

**Epic:** EPIC-PROD-001
**Status:** Draft
**Owner:** Pedro Emilio (executor: @dev Dex via handoff)
**Severidade origem:** B3, H3
**Esforço estimado:** 2 SP

---

## Contexto

Dara (02-data-engineer-dara.md, problemas 1 e 2) documenta que as migrations `009_advisory_locks_and_jsonb_check.sql`, `010_leads_lead_magnet.sql` e `011_funnel_events.sql` nunca foram aplicadas ao Supabase remoto. Sem elas, as tabelas `leads` e `funnel_events` não existem em produção — qualquer chamada ao `/api/track` ou ao lead-magnet retorna erro 500 imediato. Adicionalmente, `src/types/supabase.gen.ts` foi gerado contra as migrations 001-008: a seção `Functions` está vazia e as tabelas `leads`/`funnel_events` estão ausentes, causando drift de tipagem.

Depende de PROD-001-1 (project-id do Supabase correto definido).

---

## Acceptance Criteria

- [ ] `supabase migration list --project-id <PROJECT_ID>` mostra migrations 009, 010 e 011 com status `applied`
- [ ] `grep -c "leads\|funnel_events" src/types/supabase.gen.ts` retorna > 0 (tabelas presentes nos tipos)
- [ ] `grep "rate_limit_check_and_insert" src/types/supabase.gen.ts` encontra a função (não mais seção vazia)
- [ ] `pnpm typecheck` retorna exit code 0 após a regen (sem erros de tipo em imports de `leads` ou `funnel_events`)
- [ ] Commit de `src/types/supabase.gen.ts` atualizado presente no histórico git

---

## Tasks

- [ ] Confirmar project-id (de PROD-001-1)
- [ ] Executar `supabase migration list --project-id <PROJECT_ID>` — verificar estado atual
- [ ] Executar `supabase db push --project-id <PROJECT_ID>` para aplicar as 3 migrations pendentes
- [ ] Executar `pnpm generate:types` (ou `supabase gen types typescript --project-id <PROJECT_ID> > src/types/supabase.gen.ts`)
- [ ] Verificar que `leads`, `funnel_events` e `rate_limit_check_and_insert` aparecem em `supabase.gen.ts`
- [ ] Rodar `pnpm typecheck` — confirmar 0 erros
- [ ] Commit: `chore: apply migrations 009-011 and regenerate supabase types (B3, H3)`

---

## File List

- `src/types/supabase.gen.ts` (regenerado via CLI)

---

## Notas técnicas

Sequência canônica de Dara (recomendação 1):
```bash
supabase migration list --project-id <PROJECT_ID>
supabase db push --project-id <PROJECT_ID>
pnpm generate:types
# verificar leads, funnel_events e functions no arquivo gerado
git add src/types/supabase.gen.ts
git commit -m "chore: regenerate db types after migrations 009-011"
```

O script `generate:types` em `package.json:14` usa project-id hardcoded — PROD-001-4 resolve isso. Para esta story, usar o flag `--project-id <PROJECT_ID>` diretamente no CLI para garantir o alvo correto independente do package.json.

Ver Dara recomendação 1 para o snippet completo.

---

## Rollback

**Procedimento binário (aplicar se migrations causarem problema em produção):**

```sql
-- ATENÇÃO: destrói todos os dados de leads e funil capturados
DROP TABLE IF EXISTS funnel_events CASCADE;
DROP TABLE IF EXISTS leads CASCADE;
-- Se 009 também aplicada e precisa reverter:
-- DROP FUNCTION IF EXISTS rate_limit_check_and_insert CASCADE;
```

Execute via Supabase SQL Editor ou CLI com credenciais de service_role. **Dados serão perdidos permanentemente.** Usar apenas se as tabelas foram criadas sem dados de produção. Se houver dados, exportar antes via `pg_dump` ou Supabase dashboard → Table Editor → Export.

---

## Riscos

1. Migrations com foreign key constraints podem falhar se tabelas dependentes não existirem — inspecionar cabeçalho de cada migration antes do push.
2. Se for projeto novo (decisão D1), aplicar todas as migrations 001-011 em sequência, não só 009-011.
