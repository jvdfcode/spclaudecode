# SmartPreço — Auditoria de Banco de Dados

> Produzido por: @data-engineer (Brownfield Discovery — Fase 2)
> Data: 2026-04-23

---

## Resumo Executivo

| Categoria | Status | Itens |
|-----------|--------|-------|
| Segurança (RLS) | ✅ Adequado | Todas as tabelas de usuário protegidas |
| Performance | ⚠️ Atenção | 3 gaps de índice identificados |
| Integridade | ✅ Adequado | Constraints bem definidas |
| Manutenibilidade | ⚠️ Atenção | Tipos gerados manualmente |
| Feature Gaps | 🔴 Crítico | OAuth ML não implementado |
| Observabilidade | 🔴 Crítico | Sem cleanup automático de cache |

---

## Achados por Severidade

### 🔴 ALTO

**A1 — OAuth ML sem implementação**
- Tabela `ml_tokens` existe com estrutura correta
- Nenhuma rota, hook ou componente usa esta tabela
- Impacto: feature de integração com API oficial ML completamente bloqueada
- Recomendação: implementar flow OAuth ou remover tabela do MVP (reduzir escopo)

**A2 — Sem cleanup de `ml_search_cache`**
- Cache nunca é purgado — crescimento ilimitado
- Queries com `expires_at < now()` ficam no banco indefinidamente
- Recomendação: Supabase pg_cron job ou Edge Function programada para `DELETE WHERE expires_at < now()`

**A3 — Sem rate limiting no scraping**
- `api/ml-proxy` e `api/ml-search` não têm rate limiting por usuário
- Qualquer usuário autenticado pode disparar N requisições ao ML
- Risco: ban de IP do servidor no ML, custo de compute
- Recomendação: middleware de rate limiting (ex: upstash/ratelimit) ou Supabase row-count-per-minute

---

### ⚠️ MÉDIO

**M1 — `listSkus` retorna todos os cálculos históricos**
- Query: `SELECT *, sku_calculations (*)` para cada SKU
- Apenas o mais recente é usado (sorted in-memory)
- Ineficiente com histórico grande
- Recomendação: usar DISTINCT ON ou window function para pegar apenas o último cálculo

```sql
-- Alternativa eficiente:
SELECT s.*, c.*
FROM skus s
LEFT JOIN LATERAL (
  SELECT * FROM sku_calculations
  WHERE sku_id = s.id
  ORDER BY created_at DESC
  LIMIT 1
) c ON true
WHERE s.user_id = auth.uid()
ORDER BY s.updated_at DESC;
```

**M2 — Sem índice em `skus.status`**
- Filtro por status é feito in-memory no servidor (não no banco)
- Com portfólio grande, a query retorna todos os SKUs e filtra depois
- Recomendação: `CREATE INDEX idx_skus_status ON skus(user_id, status)`

**M3 — Tipos DB gerados manualmente**
- `src/types/database.ts` foi escrito à mão
- Risco de divergência entre tipos e schema real
- Recomendação: `npx supabase gen types typescript --local > src/types/database.ts` no CI

**M4 — `updated_at` sem índice para ordenação**
- `ORDER BY updated_at DESC` em `listSkus` sem índice dedicado
- Supabase usa seq scan para tabelas pequenas (OK para MVP)
- Recomendação para produção: `CREATE INDEX idx_skus_updated_at ON skus(user_id, updated_at DESC)`

---

### ℹ️ BAIXO

**B1 — `ml_fees` sem taxas por categoria**
- Estrutura suporta `category_id` mas apenas taxas gerais estão seeded
- Vendedores de categorias com taxas diferenciadas (ex: autos, imóveis) recebem cálculo incorreto
- Recomendação: expandir seed com categorias relevantes

**B2 — `ml_tokens.updated_at` sem trigger**
- Diferente de `skus`, `ml_tokens` não tem trigger `updated_at`
- Consistência: adicionar trigger ou remover a coluna

**B3 — `cost_data`/`result_data` sem schema JSONB**
- Colunas JSONB sem validação de estrutura
- Mutações no formato `ViabilityInput`/`ViabilityResult` podem corromper dados históricos silenciosamente
- Recomendação: adicionar `CHECK (jsonb_typeof(cost_data) = 'object')` mínimo + considerar versionamento de schema

---

## Avaliação de RLS

| Tabela | Política | Avaliação |
|--------|---------|-----------|
| `skus` | `user_id = auth.uid()` ALL | ✅ Correto |
| `sku_calculations` | via sku_id subquery | ✅ Correto, mas subquery pode ser lenta com escala |
| `ml_fees` | SELECT público | ✅ Correto (dados de referência) |
| `ml_search_cache` | SELECT público, INSERT/UPDATE autenticado | ✅ Correto |
| `ml_tokens` | `user_id = auth.uid()` ALL | ✅ Correto |

**Observação em `sku_calculations` RLS:**
```sql
-- Atual (funcional mas potencialmente lento)
USING (sku_id IN (SELECT id FROM skus WHERE user_id = auth.uid()))

-- Mais performático:
USING (EXISTS (SELECT 1 FROM skus WHERE id = sku_calculations.sku_id AND user_id = auth.uid()))
```

---

## Estado das Migrações

| # | Arquivo | Idempotente | Status |
|---|---------|-------------|--------|
| 001 | `rls_setup.sql` | ✅ (IF NOT EXISTS) | Aplicada |
| 002 | `ml_fees_table.sql` | ✅ (IF NOT EXISTS) | Aplicada |
| 003 | `seed_ml_fees.sql` | ✅ (ON CONFLICT DO UPDATE) | Aplicada |
| 004 | `skus_table.sql` | ✅ (IF NOT EXISTS) | Aplicada |
| 005 | `ml_search_cache.sql` | ✅ (IF NOT EXISTS) | Aplicada |
| 006 | `ml_tokens.sql` | ✅ (IF NOT EXISTS) | Aplicada |

---

## Recomendações Prioritárias

1. **[ALTO]** Implementar cleanup de `ml_search_cache` via pg_cron
2. **[ALTO]** Definir escopo do OAuth ML — implementar ou remover da tabela atual
3. **[ALTO]** Adicionar rate limiting nos endpoints de scraping
4. **[MÉDIO]** Otimizar `listSkus` com LATERAL JOIN
5. **[MÉDIO]** Adicionar índice composto `(user_id, status)` em `skus`
6. **[MÉDIO]** Integrar `supabase gen types` no processo de CI/CD
