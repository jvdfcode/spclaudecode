# Dara — Diagnóstico de DB para Produção

> "Migration que não roda em produção é só arquivo decorativo."

## Veredito (1 frase)

Três migrations novas (009-011) nunca chegaram ao Supabase remoto, `supabase.gen.ts` não conhece `leads` nem `funnel_events`, e o drift automático do CI está apontando para um project-id fixo que pode não ser o projeto que irá para produção — resolver esses três pontos antes de qualquer deploy.

---

## 5 problemas-raiz no escopo de DB

1. **Migrations 009-011 não aplicadas em produção** — `009_advisory_locks_and_jsonb_check.sql`, `010_leads_lead_magnet.sql`, `011_funnel_events.sql` — sem aplicação no Supabase remoto, as tabelas `leads` e `funnel_events` não existem, a função `rate_limit_check_and_insert` não existe, e os CHECKs de JSONB em `sku_calculations` também estão ausentes; qualquer chamada ao `/api/track` ou ao lead-magnet retorna erro 500 imediato — **Severidade: BLOQUEADOR de produção**

2. **Drift de tipos TypeScript** — `src/types/supabase.gen.ts` — o arquivo foi gerado contra o estado das migrations 001-008: tabelas `leads` e `funnel_events` estão ausentes, e a seção `Functions` está vazia (`[_ in never]: never`) — significa que o código que usa `supabase.from('leads')` ou `supabase.from('funnel_events')` não tem tipagem, e o CI `db-types-drift` vai falhar no próximo PR porque o schema remoto (após aplicar 009-011) vai divergir do arquivo commitado — **Severidade: ALTO**

3. **Project-id hardcoded no CI e em package.json** — `ci.yml:116` e `package.json:generate:types` usam `--project-id ltpdqavqhraphoyusmdi`; se o usuário optar por um projeto Supabase novo (decisão ainda em aberto), o job `db-types-drift` vai gerar tipos do projeto antigo e validar contra o novo — falso positivo ou falso negativo garantido; a variável deveria ser `${{ secrets.SUPABASE_PROJECT_ID }}` — **Severidade: ALTO**

4. **`ml_search_cache` RLS semanticamente incorreta para o caller real** — `005_ml_search_cache.sql:22-27` — as políticas de INSERT e UPDATE exigem `auth.role() = 'authenticated'`; porém o único caller de escrita é `createServiceSupabase()` (service_role), que bypassa RLS completamente — a policy nunca é avaliada no fluxo real, mas documenta uma intenção errada; se em algum momento o cache for escrito via `createServerSupabase()` (anon key + cookie), o INSERT vai ser bloqueado silenciosamente — **Severidade: MÉDIO**

5. **Sem cleanup automático de `ml_search_cache` e risco de crescimento de `funnel_events`** — `007_performance_indexes.sql:24-27` — o cron de purge está comentado (`-- SELECT cron.schedule(...)`); pg_cron precisa ser habilitado manualmente no dashboard do Supabase; `funnel_events` não tem nenhum mecanismo de retenção (cada pageview, cada cálculo gera uma linha); com o lead-magnet ativo, o volume cresce sem floor — estimar: 1.000 visitas/dia × 3 eventos = ~90k linhas/mês, sem janela de cleanup — **Severidade: MÉDIO**

---

## 3 dependências externas

1. **Depende de @devops (Gage)**: executar `supabase db push` contra o projeto correto para aplicar as migrations 009, 010 e 011 no Supabase remoto; @devops é o único autorizado a operações de infra/deploy — inclui verificar `supabase migration list` antes do push para confirmar quais estão pendentes

2. **Depende do USUÁRIO**: decidir qual projeto Supabase vai para produção (jvdfcode existente vs. projeto novo); essa decisão determina o project-id a ser usado em `package.json:generate:types`, `ci.yml:116`, e nas variáveis de ambiente do Vercel (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ACCESS_TOKEN`) — sem essa decisão não é possível aplicar migrations nem regenerar tipos corretamente

3. **Depende do USUÁRIO / @devops**: habilitar pg_cron no Supabase dashboard (Extensions → pg_cron) antes de descomentar o schedule de purge em `007_performance_indexes.sql:24-27`; pg_cron não pode ser habilitado via migration SQL — requer ação manual no dashboard ou via Supabase CLI (`supabase extensions enable pg_cron`)

---

## 3 recomendações

1. **Aplicar migrations pendentes e regenerar tipos** (ordem: primeiro) — após decidir o projeto de produção, executar em sequência:
   ```bash
   # Confirmar estado atual
   supabase migration list --project-id <PROJECT_ID>

   # Aplicar as 3 migrations pendentes
   supabase db push --project-id <PROJECT_ID>

   # Regenerar supabase.gen.ts e commitar
   pnpm generate:types
   # verificar que leads, funnel_events e as funções aparecem no arquivo
   git add src/types/supabase.gen.ts && git commit -m "chore: regenerate db types after migrations 009-011"
   ```
   Após isso o CI `db-types-drift` volta a ser verde.

2. **Parametrizar project-id no CI** (ordem: junto com item 1) — substituir o valor hardcoded em `ci.yml:116` e `package.json:generate:types`:
   ```yaml
   # ci.yml linha 116 — antes
   run: supabase gen types typescript --project-id ltpdqavqhraphoyusmdi > /tmp/supabase.gen.ts
   # depois
   run: supabase gen types typescript --project-id ${{ secrets.SUPABASE_PROJECT_ID }} > /tmp/supabase.gen.ts
   ```
   ```json
   // package.json — antes
   "generate:types": "supabase gen types typescript --project-id ltpdqavqhraphoyusmdi > src/types/supabase.gen.ts"
   // depois
   "generate:types": "supabase gen types typescript --project-id $SUPABASE_PROJECT_ID > src/types/supabase.gen.ts"
   ```
   Adicionar `SUPABASE_PROJECT_ID` nos secrets do GitHub e no `.env.local`.

3. **Habilitar pg_cron e ativar cleanup de cache** (ordem: após deploy) — no Supabase dashboard habilitar a extensão pg_cron, depois executar o schedule que já está escrito e comentado em `007_performance_indexes.sql:24-27`:
   ```sql
   SELECT cron.schedule(
     'purge-ml-search-cache',
     '0 * * * *',
     $$DELETE FROM ml_search_cache WHERE expires_at < now()$$
   );
   -- Para funnel_events (retenção de 90 dias):
   SELECT cron.schedule(
     'purge-funnel-events-90d',
     '0 3 * * *',
     $$DELETE FROM funnel_events WHERE created_at < now() - interval '90 days'$$
   );
   ```
   Executar via `supabase db execute` ou SQL Editor do dashboard — não via migration, pois cron.schedule é estado de runtime, não DDL.

---

*Gravado em: `/Users/pedroemilioferreira/AI/spclaudecode/docs/reviews/prod-roadmap-2026-04-28/02-data-engineer-dara.md`*
*Escopo: migrations 001-011, supabase.gen.ts, server.ts, ci.yml, package.json*
*Data: 2026-04-27*
