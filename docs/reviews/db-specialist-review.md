# SmartPreço — Revisão Especialista de Banco de Dados

> Produzido por: @data-engineer (Brownfield Discovery — Fase 5)
> Data: 2026-04-23
> Revisando: technical-debt-DRAFT.md

---

## Validação dos Achados do Draft

### Confirmados (alinhados com análise DB)

| ID | Item | Validação |
|----|------|-----------|
| TD-PERF-01 | listSkus ineficiente | ✅ Confirmado. Impacto real com >20 SKUs por usuário. |
| TD-PERF-02 | Cache sem cleanup | ✅ Confirmado. Adicionar pg_cron. |
| TD-MAINT-01 | Tipos manuais | ✅ Confirmado. Risco alto em migrations futuras. |
| TD-SEC-01 | Sem rate limiting | ✅ Confirmado sob perspectiva DB — abuso pode lotar ml_search_cache. |

### Lacunas não cobertas no Draft

#### DB-GAP-01 — RLS em `sku_calculations` usa subquery cara
**Severidade:** MÉDIO  
**Detalhe:** `USING (sku_id IN (SELECT id FROM skus WHERE user_id = auth.uid()))` executa subquery por row. Com muitos cálculos, pode ser lento.  
**Recomendação:** Migrar para `EXISTS`:
```sql
USING (EXISTS (
  SELECT 1 FROM skus 
  WHERE id = sku_calculations.sku_id AND user_id = auth.uid()
))
```
**Esforço:** 15min (migration simples)

#### DB-GAP-02 — Sem índice `(user_id, updated_at DESC)` em `skus`
**Severidade:** BAIXO-MÉDIO  
**Detalhe:** `ORDER BY updated_at DESC` sem índice. Postgreq faz seq scan em tabelas pequenas mas degradará com escala.  
**Recomendação:** `CREATE INDEX idx_skus_user_updated ON skus(user_id, updated_at DESC);`  
**Esforço:** 15min

#### DB-GAP-03 — `ml_tokens.updated_at` sem trigger
**Severidade:** BAIXO  
**Detalhe:** `skus` tem trigger para `updated_at`, mas `ml_tokens` não. Inconsistência.  
**Recomendação:** Adicionar o mesmo trigger `set_updated_at()` em `ml_tokens`.

#### DB-GAP-04 — JSONB sem schema validation
**Severidade:** MÉDIO  
**Detalhe:** `cost_data` e `result_data` aceitam qualquer JSONB. Sem versionamento de schema interno, histórico quebra silenciosamente em mudanças do motor.  
**Recomendação:** Adicionar campo `schema_version` nas próximas colunas JSONB. Curto prazo: CHECK de tipo mínimo.

---

## Parecer Geral

A arquitetura de dados está **sólida para MVP**. As decisões de RLS são corretas e as constraints de integridade são bem definidas. Os gaps são de otimização e resiliência, não de correção. 

**Prioridade máxima do DB:** Implementar cleanup automático de `ml_search_cache` (pg_cron) antes de qualquer deploy em produção com usuários reais.

**Veredicto:** Sem bloqueios para produção, com as ressalvas TD-PERF-02 e DB-GAP-01 como ações imediatas pós-deploy.
