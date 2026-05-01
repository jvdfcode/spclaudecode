# Plano v3 — Análise de Viabilidade SmartPreço (rota via @melidev-chief)

**Data:** 2026-05-01
**Versão:** v3 — substitui v2 após import da squad MeliDev
**Owner do relatório:** Pedro Emilio Ferreira (responsabilidade)
**Auditor:** Squad MeliDev (`squads/melidev/` — declarada e versionada)
**Origem:**
- Plano v2: `docs/reviews/viability-2026-04-30/00-plano-v2.md` (8 mudanças obrigatórias absorvidas + 3 tensões resolvidas pela mesa redonda de 7 personas)
- Squad MeliDev: commit `4eba5ef` em `squads/melidev/`

---

## Mudanças desde v2

| # | Mudança | Razão |
|---|---------|-------|
| 1 | Executor passa de **"spawn anônimo subagent_type=analyst"** para **chamada formal ao `@melidev-chief`** | Resolve definitivamente o veto Pedro Valério ("owner anônimo não é auditável"). Squad é declarada, versionada, com routing matrix oficial. |
| 2 | Cada ponto mapeia para **comando concreto** de specialist (em vez de prosa abstrata) | Auditável: o comando + output esperado vira gate binário. |
| 3 | Tags `[SOURCE:]` ou `[INFERRED]` **obrigatórias** por finding | Regra estrutural da squad MeliDev (linha 13 de `melidev.md`: "NEVER emit a heuristic, rule, or claim without `[SOURCE:]` or `[INFERRED]` tag"). |
| 4 | 4 pontos do Bloco M ficam **fora do escopo MeliDev** e roteiam para personas existentes (@alfredo-soares, @thiago-finch, @rony-meisler) | Squad MeliDev é Mercado Livre Brasil only — análise de SaaS B2B, headline test e ritual de marca não são domínio dela. Honestidade do escopo. |
| 5 | M7 (ritual de uso) **separa em 2 pontos**: M7a (ritual operacional ML) → strategist; M7b (ritual de marca) → Rony Meisler | Cobertura sem inflar prosa. |
| 6 | Pré-condição nova: `squads/melidev/data/ml-sources-registry.yaml` precisa ter fontes válidas com `last_verified` ≤ 90 dias | Sem fontes verificadas, `[SOURCE:]` vira `[INFERRED]` em massa — destrói o valor da auditoria. |

---

## Routing Matrix (11 pontos)

### Bloco F — FUNCIONAL (3 pontos, todos via @melidev-chief)

| # | Ponto v2 | Specialist | Comando MeliDev | Output esperado | Tag obrigatória |
|---|----------|-----------|-----------------|-----------------|-----------------|
| F1 | Regras de cálculo ML 2026 | `@melidev` | `*audit-integration` aplicado a `src/lib/calculations/costs.ts` + `src/lib/mercadolivre.config.ts` | Findings ranked com severidade; verificar comissão Free 0% / Classic 11% / Premium 17%, 26 categorias hardcoded, custo fixo <R$79, taxa parcelamento | `[ML-OFFICIAL]` por finding |
| F2 | Race condition refresh OAuth | `@melidev` | `*checklist OAuth-refresh-production` | Lista binária de checks: advisory lock, idempotência, retry, scope `offline_access`, multi-seller token isolation | `[ML-OFFICIAL]` ou `[INFERRED]` |
| F3 | Risco de plataforma (dependência API ML) | `@melidev` + `@meli-ops` | `@melidev *explain rate-limit-and-policy-volatility` + `@meli-ops *explain-policy mudancas-de-API` | Hipóteses de cenário (ML banir IP, mudar pricing API, lançar calculadora oficial); plano fallback para ≥1 cenário | `[ML-POLICY-CHANGES]` warning + `[INFERRED]` |

### Bloco M — MERCADOLÓGICA (8 pontos, distribuídos)

| # | Ponto v2 | Specialist | Comando | Output esperado | Tag |
|---|----------|-----------|---------|-----------------|-----|
| M1 | ICP defensável (vendedor 5+ SKUs com nome+sobrenome+canal) | `@meli-strategist` | `*audit-listing` em **modo proxy** — em vez de auditar anúncio, aplicar lente "vendedor real que usaria SmartPreço": qual perfil acessa Nubimetrics/Real Trends hoje? | Perfil de vendedor com faturamento, # SKUs, fonte de descoberta de ferramentas | `[GUSTAVO-LUCAS]`, `[PARROS-CASE]` ou `[INFERRED]` |
| M2 | Pricing R$39/49/59 vs Nubimetrics R$197 | `@meli-strategist` | `*compare-listings` em **modo proxy** — comparar SaaS pricing como se fossem anúncios concorrentes (mesma vibe de Buy Box) | Tabela posicional + faixa defensável | `[ML-CENTRAL]`, `[ML-ADS-DOC]` ou `[INFERRED]` |
| M3 | Concorrência ≥3 mapeados | `@meli-strategist` | `*audit-listing` (proxy) + **fallback WebFetch público** se `concorrencia-2026-Q2.md` vazio (ainda em estado TEMPLATE) | Lista de Nubimetrics, Real Trends, Olist Free, Hub2B + ≥1 mais; pricing público + diferencial | `[INFERRED]` (fontes externas) |
| M4 | Trial 14d vs Free tier | **`@alfredo-soares`** (NÃO-MeliDev — SaaS B2B é fora do escopo da squad) | `*pricing-fit free-vs-trial` (comando da persona Alfredo) | Análise comparativa free vs trial em SaaS B2B PME, com dados de Loja Integrada/G4 | (sem tag MeliDev — Alfredo cita seus próprios sources) |
| M5 | Loss Aversion calibrada vs concorrentes | `@meli-ops` | `*explain-policy custo-de-cancelamento-e-mediacao` | Custo R$/mês real do vendedor: cancelamento, mediação, reputação amarela; calibrar dor que SmartPreço evita | `[CDC]`, `[ML-CENTRAL]` ou `[INFERRED]` |
| M6 | Headline test | **`@thiago-finch`** (NÃO-MeliDev — funil/copy não é domínio MeliDev) | `*headline-test` na landing `/calculadora-livre`, `/precos`, home | ≥1 alternativa com Loss Aversion 2.5:1; comparar com headlines de concorrentes | (Finch usa OMIE) |
| M7a | Ritual de uso operacional (quando o vendedor mexe em preço?) | `@meli-strategist` | `*logistics-choice` em **modo proxy** — ritual de reajuste alinhado com janelas ML (ex: domingo à noite antes do ranqueamento de segunda) | Hipótese de ritual + plano de validação na entrevista | `[ML-CENTRAL]` ou `[INFERRED]` |
| M7b | Ritual de uso narrativo (marca + tribo) | **`@rony-meisler`** (NÃO-MeliDev — ritual de marca é domínio Brand-First) | `*ritual-design` | Ritual que transforma feature em hábito de marca; persona "Pedro do Méier" | (Rony usa narrativa concreta) |
| M8a | Comunidade interna (Mercado Ads como canal) | `@meli-strategist` | `*ads-strategy {budget}` | Estrutura de campanha Product Ads + Brand Ads para SmartPreço (ACOS target, palavras negativas, lance inicial) | `[ML-ADS-DOC]` |
| M8b | Comunidade externa (grupos WhatsApp/Facebook ML) | **`@alfredo-soares`** (NÃO-MeliDev — comunidade externa é domínio SaaS B2B PME) | `*community-strategy` | ≥3 grupos/comunidades nominalmente identificados (G4 Educação, Mercado Livre Experience, grupos de vendedor) | (Alfredo cita sources próprios) |

**Resumo:** 11 pontos / 7 dentro da squad MeliDev / 4 fora (M4, M6, M7b, M8b).

---

## Pré-condições

1. **Ler docs business existentes** (mesmas do v2):
   - `docs/business/posicionamento.md`
   - `docs/business/ICP-validation-2026-Q2.md` (estado TEMPLATE)
   - `docs/business/concorrencia-2026-Q2.md` (estado TEMPLATE)

2. **Ler diagnóstico Alex anterior** (não duplicar):
   - `docs/reviews/prod-roadmap-2026-04-28/06-analyst-alex.md`

3. **NOVA — verificar squad MeliDev:**
   - `squads/melidev/data/ml-sources-registry.yaml` precisa ter fontes com `last_verified` ≤ 90 dias
   - Se algum source estiver desatualizado, marcar como `[INFERRED]` em vez de `[SOURCE:]`

4. **Fallback para inputs vazios:**
   - Se `concorrencia-2026-Q2.md` ainda estiver em TEMPLATE, M3 usa WebFetch público para Nubimetrics, Real Trends, Olist Free, Hub2B (≥3 concorrentes citados)

---

## Rubric (mantida do v2 — 4 faixas binárias)

| Nota | Funcional (regras + sustentabilidade) | Mercadológica (ICP + pricing + GTM) |
|------|---------------------------------------|-------------------------------------|
| 9-10 | Regras corretas, validadas vs ML 2026, sem race condition, alinhado com rate limit, defensável vs ML lançar oficial | ICP defensável (nome+sobrenome+canal), pricing tem narrativa, ≥3 concorrentes mapeados, GTM com canal real, headline converte |
| 7-8 | Regras corretas mas algum gap menor (ex: 1 categoria desatualizada) | ICP em validação ativa (entrevistas em curso), pricing testado em A/B, narrativa em construção |
| 4-6 | Regras corretas mas com débitos críticos (race conditions, dependência total ML) | ICP é demografia genérica, pricing é chute, sem canal definido, sem narrativa |
| 1-3 | Regras erradas ou insustentáveis | Sem ICP, sem pricing defensável, sem GTM |

---

## Workflow de execução

> **NÃO disparado nesta sessão** — espera GO de Pedro Emilio.

```
1. Pedro Emilio invoca @melidev-chief *route "auditar viabilidade SmartPreço — Bloco F técnico"
   ↓
2. Chief rota para @melidev com 3 sub-tarefas (F1, F2, F3)
   - F1: *audit-integration em src/lib/calculations/costs.ts
   - F2: *checklist OAuth-refresh-production
   - F3: *explain rate-limit-and-policy-volatility
   ↓
3. Pedro Emilio invoca @melidev-chief *route "auditar viabilidade SmartPreço — Bloco M comercial"
   ↓
4. Chief rota:
   - M1, M2, M3, M7a, M8a → @meli-strategist
   - M5 → @meli-ops
   - F3 (parte policy) → @meli-ops
   ↓
5. Pedro Emilio invoca pontos fora-escopo MeliDev:
   - M4 → @alfredo-soares *pricing-fit
   - M6 → @thiago-finch *headline-test
   - M7b → @rony-meisler *ritual-design
   - M8b → @alfredo-soares *community-strategy
   ↓
6. Pedro Emilio (com Orion) consolida todos os outputs em:
   docs/reviews/viability-2026-04-30/01-meli-viability.md
   - Veredito: nota dupla X/10 funcional + Y/10 mercadológico
   - Top 5 fortalezas + top 5 fraquezas priorizadas
   - Risk matrix 3x3
   - 3 recomendações 30 dias
   - Apêndice (F4 OAuth scopes / F5 cache 1h / F6 busca 50 results — cortados do corpo)
   - Rollback documentado
```

---

## Critério de sucesso

- Cada finding tem `[SOURCE:]` ou `[INFERRED]` declarado (regra MeliDev)
- 11 pontos cobertos (não mais 10 — M7 separado em M7a + M7b)
- 4 pontos fora-MeliDev declarados explicitamente (M4, M6, M7b, M8b)
- Auditor declarado: squad MeliDev (não anônimo) — resolve veto Pedro Valério
- Owner: Pedro Emilio Ferreira (assina o relatório final)
- Veredito com nota dupla X/10 + Y/10 baseada na rubric
- Risk matrix 3x3 com top 5 riscos
- Rollback documentado no fim

---

## Riscos da execução

| Risco | Probabilidade | Mitigação |
|-------|---------------|-----------|
| Comandos de specialist não cobrirem exatamente o ponto v2 (ex: `*audit-listing` é para anúncios reais, não SaaS) | Alta | Documentação explícita de "modo proxy" por ponto (ver coluna "Comando" da matriz) |
| `data/ml-sources-registry.yaml` ter sources desatualizados | Média | Pré-condição #3 — verificar `last_verified` antes; sem source válido = `[INFERRED]` explícito |
| Spawn técnico não conseguir invocar formalmente `@melidev-chief` no Claude Code | Média | Workflow define comando formal; spawn pode citar squad explicitamente no prompt e ler `squads/melidev/agents/*.md` como contexto |
| Pontos fora-MeliDev ficarem órfãos | Baixa | Routing explícito para 3 personas existentes (Alfredo, Finch, Rony) |
| Análise duplicar Alex anterior | Baixa | Pré-condição #2 obriga ler Alex; orientação "citar e estender, não repetir" no workflow |

---

## Apêndice — itens cortados do corpo principal

Mantidos para auditoria histórica (decisão T1 da mesa redonda — Alan+Finch+Tallis aprovaram cortar):

- **F4 — OAuth scopes** (era F2 no plano original): scopes implícitos em `src/app/api/auth/ml/connect/route.ts:10-14`; bronze de troubleshooting
- **F5 — Cache 1h** (era F4): `SEARCH_CACHE_TTL` em `src/lib/mercadolivre.config.ts:126`; constante de performance, não viabilidade
- **F6 — Busca 50 resultados** (era F5): `SEARCH_LIMIT: 50` em `src/lib/mercadolivre.config.ts:9`; constante trivial

Esses 3 itens permanecem **não auditados** no v3 — decisão consciente da mesa redonda.

---

## Rollback

Se a execução do v3 produzir conclusão errada que leve a investimento de sprints:

1. **Detecção:** entrevista ICP (MKT-001-2) revela cliente paga com narrativa diferente da hipótese do v3
2. **Reverter ações:** parar features baseadas no diagnóstico errado; reabrir `00-plano-v3.md` com seção "errata"
3. **Re-rodar análise:** invocar squad MeliDev novamente com input novo (entrevistas reais)
4. **Histórico:** v2 e v3 preservados em git para auditoria de evolução do diagnóstico

---

## Próxima ação

Pedro Emilio dá GO → Orion dispara workflow (passos 1-5) → consolida em `01-meli-viability.md`.

Sem GO, o plano v3 fica documentado mas não executado.
