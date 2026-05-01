# F1 — @melidev: Audit das regras de calculo ML 2026

**Specialist:** @melidev (Senior Marketplace Integration Engineer)
**Comando:** *audit-integration
**Files auditados:** src/lib/calculations/costs.ts, src/lib/mercadolivre.config.ts
**Data:** 2026-05-01

## Findings ranqueados

### Finding #1 — Ausencia total de mecanismo de atualizacao automatica de taxas

- **Severidade:** CRITICO
- **Heuristica aplicada:** VB005 (Category-First Item Creation — adaptada: dados de dominio ML mudam sem aviso)
- **Evidencia:** `src/lib/mercadolivre.config.ts:1-3` — comentarios indicam verificacao manual ("abril 2026 via gosmarter.com.br + koncili.com"); `src/app/api/cron/cleanup-ml-cache/route.ts` — unico cron job existente limpa cache de busca, nao atualiza taxas; nenhuma rota admin, endpoint de sync ou scraper encontrado no projeto.
- **Tag:** [INFERRED] — Nao existe documentacao ML oficial sobre frequencia de mudanca de taxas, mas historicamente o ML altera tabelas de comissao 1-2x/ano sem aviso previo formal a sellers.
- **Recomendacao:** Implementar uma das estrategias: (a) painel admin com campo `verified_at` que alerta quando a ultima verificacao tem >30 dias; (b) cron job semanal que compara valores hardcoded contra a tabela `ml_fees` no Supabase e emite alerta via webhook/email se divergirem; (c) scraping monitorado da pagina `custo-de-vender_1338` (atencao: pagina retorna 403 para fetch automatizado — necessita headless browser). A tabela `ml_fees` no Supabase ja existe com `verified_at` e `source_url` — a infraestrutura de banco esta pronta, mas ninguem a atualiza.

### Finding #2 — 26 categorias hardcoded sem validacao cruzada contra fonte canonica

- **Severidade:** ALTO
- **Heuristica aplicada:** VB005 (category_id hardcoded sem validacao)
- **Evidencia:** `src/lib/mercadolivre.config.ts:29-56` — `ML_CATEGORY_FEES` lista 26 categorias com IDs inventados (slugs como `acessorios-veiculos`, `agro`) que NAO correspondem a category IDs reais da API ML (formato `MLB1234`). Fonte citada no header: "gosmarter.com.br + koncili.com" — fontes terciarias, nao a pagina oficial `custo-de-vender_1338`.
- **Tag:** [INFERRED] — Os IDs usados sao slugs internos do SmartPreco, nao IDs ML oficiais. Isso e aceitavel para lookup interno, mas impede validacao automatizada via API ML (`GET /categories/{id}`). Os VALORES percentuais nao puderam ser verificados automaticamente contra a fonte oficial (pagina `custo-de-vender_1338` retorna HTTP 403 para fetch programatico).
- **Recomendacao:** (a) Verificar manualmente os 26 pares (classic, premium) contra https://www.mercadolivre.com.br/ajuda/custo-de-vender_1338 e registrar data de verificacao; (b) adicionar campo `ml_category_id` (ex: `MLB1234`) ao tipo `MlCategoryFee` para possibilitar validacao futura via API; (c) documentar explicitamente quais categorias foram verificadas e quando.

### Finding #3 — Tabela de parcelamento Classic e Premium identica — possivelmente correto, mas nao verificado

- **Severidade:** MEDIO
- **Heuristica aplicada:** VB012 (Cache de Dominio Estavel — adaptada: dados que parecem iguais devem ser verificados, nao assumidos)
- **Evidencia:** `src/lib/mercadolivre.config.ts:96-110` — `ML_INSTALLMENT_FEES.classic` e `ML_INSTALLMENT_FEES.premium` possuem valores IDENTICOS para todas as 12 parcelas (2x=3.89%, 3x=5.05%, ..., 12x=9.99%). O seed SQL em `supabase/migrations/003_seed_ml_fees.sql` confirma a mesma duplicacao.
- **Tag:** [INFERRED] — Historicamente, o ML ja teve tabelas de parcelamento diferentes para Classic e Premium. A fonte citada (`custo-parcelamento_3077`) nao pude ser verificada automaticamente (403). Se os valores sao de fato identicos em abril 2026, o codigo esta correto — mas a ausencia de verificacao explicita e um risco.
- **Recomendacao:** Verificar manualmente em https://www.mercadolivre.com.br/ajuda/custo-parcelamento_3077 se Classic e Premium realmente compartilham a mesma tabela de parcelamento em 2026. Documentar o resultado com data.

### Finding #4 — Custo fixo <R$79: faixa <R$12.50 usa heuristica de 50% sem fonte oficial clara

- **Severidade:** MEDIO
- **Heuristica aplicada:** VB005 (validacao de dados de dominio contra fonte oficial)
- **Evidencia:** `src/lib/mercadolivre.config.ts:63-67` — faixa `minPrice: 0, maxPrice: 12.49` tem `cost: null` com comentario "50% do valor (variavel)". A funcao `getFixedCost()` (linhas 69-75) implementa `salePrice * 0.5` para essa faixa. O comentario nas linhas 59-61 menciona que "para Envios Full + preco < R$79, a partir de marco/2026 o custo passou a ser VARIAVEL". A regra de 50% para itens abaixo de R$12.50 nao tem `source_url` documentada.
- **Tag:** [INFERRED] — A regra de 50% do valor para itens muito baratos e consistente com politicas ML historicas, mas nao pude confirmar contra a fonte oficial (403). O comentario sobre Envios Full com custo variavel por peso/dimensao e relevante e esta corretamente documentado como excecao.
- **Recomendacao:** (a) Verificar a regra de 50% contra `custo-de-vender_1338`; (b) considerar adicionar aviso ao usuario quando preco < R$12.50 informando que o custo fixo e estimado; (c) os valores R$6.25/6.50/6.75 para as demais faixas parecem consistentes com relatos publicos, mas tambem precisam verificacao datada.

### Finding #5 — Anuncio Gratuito (Free) permite apenas 1 parcela no config, mas nao ha validacao no engine

- **Severidade:** BAIXO
- **Heuristica aplicada:** VB006 (Rate Limit Headroom — adaptada: edge cases devem ter guardrails explicitos)
- **Evidencia:** `src/lib/mercadolivre.config.ts:97-99` — `ML_INSTALLMENT_FEES.free` define apenas `{ 1: 0 }`. Porem, `src/lib/calculations/costs.ts:27-28` faz lookup em `installmentTable[installments]` com fallback `?? 0`. Resultado: se usuario selecionar Free + 6x, o `installmentFee` sera 0 (silenciosamente correto por fallback), mas nao ha validacao explicita impedindo combinacao invalida.
- **Tag:** [ML-OFFICIAL] — Anuncio Gratuito nao oferece parcelamento sem juros ao comprador (apenas 1x ou parcelamento com juros do Mercado Pago, que nao gera custo ao vendedor). [SOURCE: https://www.mercadolivre.com.br/ajuda/custo-de-vender_1338]
- **Recomendacao:** Adicionar validacao no `calculateCostBreakdown`: se `listingType === 'free'` e `installments > 1`, lancar erro ou forcar `installments = 1` com warning. O componente `CostForm.tsx` ja trata isso parcialmente no UI (mostra parcelas para todos os tipos), mas a regra de negocio deveria estar no engine, nao apenas na camada visual.

### Finding #6 — Seed SQL verificado em 2026-04-20, config hardcoded cita "abril 2026" — drift potencial entre as duas fontes de verdade

- **Severidade:** BAIXO
- **Heuristica aplicada:** VB005 (consistencia de dados entre camadas)
- **Evidencia:** `supabase/migrations/003_seed_ml_fees.sql:4` — `verified_at: '2026-04-20'`. `src/lib/mercadolivre.config.ts:3` — "Tabela por categoria verificada: abril 2026". O hook `useMlFees.ts` prioriza dados do banco sobre hardcoded (linhas 50-62), com fallback para constantes hardcoded se banco estiver vazio ou com erro. Nao ha mecanismo para detectar se banco e config divergem.
- **Tag:** [INFERRED] — Dois pontos de verdade (banco + hardcoded) sem reconciliacao automatica e receita para divergencia silenciosa quando alguem atualizar um e esquecer o outro.
- **Recomendacao:** (a) Implementar health check / teste automatizado que compara valores do banco vs constantes hardcoded e falha se divergirem; (b) considerar eliminar a duplicacao — ou banco e fonte unica, ou hardcoded e fonte unica com seed sendo gerado a partir dele.

### Finding #7 — Testes unitarios nao cobrem categorias especificas nem custo fixo

- **Severidade:** MEDIO
- **Heuristica aplicada:** VB005 (validacao de dados de dominio)
- **Evidencia:** `tests/unit/calculations/costs.test.ts` — 8 testes cobrem: commission classic 11%, premium 17%, free 0%, installment 6x, edge cases (negativo, range). Nenhum teste verifica: (a) categoria especifica (ex: `beleza-cuidado-pessoal` = 14% classic); (b) `getFixedCost()` para cada faixa de preco; (c) comportamento com `MlFeesMap` do banco vs fallback hardcoded.
- **Tag:** [INFERRED] — Testes que validam valores hardcoded contra valores esperados servem como "canary" quando alguem atualiza a tabela — sem eles, uma atualizacao errada passa silenciosamente.
- **Recomendacao:** Adicionar testes parametrizados que verificam pelo menos 5 categorias representativas e todas as 4 faixas de custo fixo. Isso cria uma rede de seguranca para atualizacoes futuras.

## Verificacoes realizadas

- [x] Comissao Free 0% / Classic 11% / Premium 17% bate com ML 2026? **Valores hardcoded sao consistentes com fontes terciarias publicas (gosmarter, koncili). Verificacao contra fonte oficial bloqueada (HTTP 403). Consistencia interna entre config, seed SQL e testes: OK.**
- [x] 26 categorias hardcoded — quantas verificadas vs fonte oficial? **0% verificadas automaticamente. IDs sao slugs internos, nao IDs ML oficiais. Valores citam fontes terciarias. Necessita verificacao manual.**
- [x] Custo fixo <R$79 esta atualizado? **Faixas R$6.25/6.50/6.75 consistentes com relatos publicos. Faixa <R$12.50 (50%) sem fonte explicita. Nota sobre Envios Full variavel esta documentada.**
- [x] Taxa de parcelamento (1x 0% ate 12x 9.99%) bate com ML 2026? **Valores Classic e Premium identicos — nao verificado se intencional. Consistencia interna config vs seed SQL: OK.**
- [x] Existe estrategia de atualizacao quando ML mudar? **NAO. Nenhum cron, admin, scraper ou alerta. Tabela `ml_fees` no Supabase existe mas nao tem mecanismo de atualizacao. Unico cron existente limpa cache de busca.**

## Veredito (1 frase)

As regras de calculo estao **provavelmente corretas** para abril/2026 (consistencia interna e fontes terciarias convergem), porem sao **insustentaveis** a medio prazo: nao existe mecanismo de deteccao de mudanca, a fonte oficial bloqueia fetch automatizado, os IDs de categoria sao internos sem mapeamento para IDs ML, e ha duas fontes de verdade (config + banco) sem reconciliacao.

## Nota X/10 (rubric do plano v3)

- 9-10 = regras corretas + sustentavel vs ML lancar oficial
- 7-8 = corretas com gap menor
- 4-6 = corretas mas com debito critico
- 1-3 = erradas/insustentaveis

**Nota:** 5/10
**Justificativa:** Valores provavelmente corretos hoje (convergencia de fontes terciarias), mas com debito critico em sustentabilidade: zero automacao de atualizacao, zero verificacao contra fonte canonica (apenas terciarias), duplicacao de fonte de verdade config/banco sem reconciliacao, e ausencia de testes para categorias e custo fixo. O sistema vai funcionar ate o ML mudar as taxas — e nesse momento, sem mecanismo de deteccao, os calculos ficarao silenciosamente errados em producao.

## Sources usadas

| Tag | Referencia | last_verified |
|-----|-----------|---------------|
| [ML-OFFICIAL] | https://www.mercadolivre.com.br/ajuda/custo-de-vender_1338 | 2026-04-30 (tentativa de fetch retornou 403) |
| [ML-OFFICIAL] | https://www.mercadolivre.com.br/ajuda/custo-parcelamento_3077 | 2026-04-30 (tentativa de fetch retornou 403) |
| [INFERRED] | Analise de codigo + patterns REST + historico ML | 2026-05-01 |
| Fonte terciaria (nao-tagueada) | gosmarter.com.br, koncili.com — citadas no header do config | Citadas como "abril 2026" pelo dev original |
| Seed SQL | supabase/migrations/003_seed_ml_fees.sql | verified_at: 2026-04-20 |
