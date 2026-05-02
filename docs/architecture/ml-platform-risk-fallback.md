# ML Platform Risk — Plano de Fallback

**Versão:** v1
**Data:** 2026-05-02
**Owner:** Pedro Emilio Ferreira (executor: @architect Aria + @dev Dex)
**Origem:** `docs/reviews/viability-2026-04-30/findings/F3-risco-plataforma-ml.md` (Cenários A/B/C)
**Story relacionada:** [VIAB-R1-3](../../docs/stories/VIAB-R1-3-backoff-ml-api.md)

---

## Resumo executivo

SmartPreço tem **dependência crítica** da API do Mercado Livre Brasil:
- 100% das funcionalidades core dependem de OAuth ML + endpoints `/oauth/token` + `/sites/MLB/search`
- Falha de plataforma = produto inutilizável instantaneamente
- 3 cenários de risco mapeados em F3 da análise de viabilidade

Este documento descreve **estratégia de mitigação por cenário**, **sinais de alerta** e **checklist trimestral de revisão**.

---

## Cenário A — ML lança calculadora oficial

### Probabilidade
**MÉDIA** [INFERRED] — Marketplaces maduros (Amazon, Shopee) internalizam pricing tools; ML já oferece ferramentas no Central de Vendedores. Sem sinal público de lançamento até 2026-05.

### Impacto
**GRAVE.** Core value ("calcule margem real") replicado gratuitamente dentro do painel ML. Lead magnet `/calculadora-livre` perderia atratividade. Diferencial restante: pesquisa comparativa (mediana, P25, P75) — que ML provavelmente não incluiria por conflito de interesse.

### Estratégia de diferenciação ([implementação atual + futura])

**Estratégia 1 — Profundidade de simulação (não disponível na calc oficial):**
- **Cenários simultâneos** (Free vs Classic vs Premium na mesma tela)
- **Histórico de margem por SKU** (track de evolução temporal)
- **Simulador "se eu mudar X, margem vira Y"** — mecanismo causal explícito
- **Drill-down por componente** (taxa, frete, parcelamento, custo fixo)

**Estratégia 2 — Inteligência comparativa de mercado:**
- Comparar pricing do vendedor com mediana da categoria + percentis P25/P75
- Identificar SKUs com margem outlier (positivo ou negativo)
- Detectar oportunidades de aumento de preço sem perder Buy Box

**Estratégia 3 — Narrativa "calcular antes de anunciar" (vs ML "depois"):**
- Headline `/precos`: "A calculadora do ML te diz quanto custa vender. O SmartPreço te diz **se vale vender**."
- Posicionamento aprovado em ICP-validation v1 (Sub-âncora MeliDev)

### Sinais de alerta
- Anúncio público do ML sobre nova ferramenta nativa de pricing
- Posts em comunidades vendedor mencionando "calc oficial ML"
- Drop sustentado >30% no `home_view → calc_completed` por >7 dias

### Recomendação
**Investir em inteligência comparativa de mercado como core value.** Cálculo puro é commodity; análise competitiva não é. [INFERRED]

---

## Cenário B — ML muda rate limits ou política de API

### Probabilidade
**ALTA.** [ML-OFFICIAL] Rate limit atual: 1500 req/min/seller (VB006). Token expira em 21600s (6h). Ambos podem mudar sem aviso amplo.

### Impacto
**GRAVE a MÉDIO.**
- **Rate limit reduzido:** busca server-side parararia, fallback client-side (`MarketSearch.tsx:104`) ainda funcionaria com UX degradada
- **Token mais curto:** volume de refresh 6× maior — race condition F2 (já fixada em VIAB-R1-1) ficou crítica em escala
- **Scraping bloqueado:** `ml-proxy/route.ts` retorna 502 sem segundo fallback (atual)

### Estratégia de mitigação ([VIAB-R1-3 — implementada])

**1. Backoff exponencial (`src/lib/utils/exponential-backoff.ts`):**
- 5 tentativas em 429 (2s, 4s, 8s, 16s, 32s) + jitter ≤500ms
- 3 tentativas em 5xx
- Jitter previne thundering herd
- Total worst case ≈ 62s antes de exhaustion

**2. Sentry monitoring:**
- `ml_api_rate_limited` (warning) cada 429
- `ml_api_exhausted` (error) após 5 tentativas falham
- Dashboard Sentry: query `tags.component:ml_api_backoff`

**3. Cache TTL longo para queries populares:**
- `SEARCH_CACHE_TTL` em `src/lib/mercadolivre.config.ts:126`
- Reduz chamadas repetidas a queries idênticas

**4. Degradação graceful client-side:**
- `ml-search/route.ts:99` retorna `{ clientSide: true }` com 503 quando search server-side falha
- Frontend `MarketSearch.tsx:103` faz busca direta do navegador (IP residencial não bloqueado)

### Sinais de alerta
- Sentry: pico de eventos `ml_api_rate_limited` >10/min
- Sentry: qualquer evento `ml_api_exhausted` em 24h
- ML Central anuncia mudança de rate limit
- 5xx rate >5% em 1h

### Recomendação adicional (backlog)
- **Eliminar scraping HTML em `ml-proxy/route.ts`** (gap 3 de F3 — VIAB-R1-3.1)
- **Estender cache TTL** de 1h para 4h em queries populares
- **Health check endpoint** `GET /api/health/ml` para monitoramento externo

---

## Cenário C — ML bane IP do Vercel ou revoga app oficial

### Probabilidade
- **API oficial:** MÉDIA-BAIXA — ML autentica por OAuth, não IP; revogariam app, não baniriam IP
- **Scraping HTML:** MÉDIA-ALTA — requests sem auth, User-Agent falso, IP de cloud — pattern clássico de detecção anti-bot

### Impacto
**MÉDIO.**
- **Scraping bloqueado:** fallback client-side assume (mesmo do Cenário B)
- **App OAuth revogada:** todo fluxo autenticado morre — recovery manual no painel ML Developers
- **Ambos simultâneos:** resta apenas calculadora `/calculadora-livre` com taxas hardcoded (sem busca de produto real)

### Estratégia de mitigação

**1. Eliminar scraping HTML (backlog VIAB-R1-3.1):**
- `src/app/api/ml-proxy/route.ts` deve ser substituído por API oficial onde possível
- Análise técnica prerequisito: quais queries dependem do scraping vs API oficial

**2. Documentar degradação graceful como estratégia (esta seção):**
- Frontend já trata `{ clientSide: true }` (já implementado)
- Comunicar ao usuário banner de modo degradado

**3. Registrar app como oficial (não teste):**
- Verificar status atual da app ML Developers
- Solicitar review de aplicativo se ainda em modo teste

**4. Plano de recuperação (runbook):**
- Detecção: 5xx rate >50% por >5min OU 401 sustentado em /oauth/token
- Owner: Pedro Emilio (CPF + telefone no incident response)
- Comunicação: status page (não existe ainda — backlog)
- Recovery: re-registrar app + propagar nova client_id/secret via Vercel env

### Sinais de alerta
- 401 sustentado em `POST /oauth/token` (>10 min)
- 403 em queries autenticadas
- Drop >50% em `ml_search` server-side com aumento simultâneo de fallback client-side

---

## Comparação cenários × impacto × mitigação

| Cenário | Probabilidade | Impacto | Mitigação implementada | Mitigação backlog |
|---------|:------------:|:-------:|------------------------|-------------------|
| A — ML calc oficial | Média | Grave | Profundidade de simulação + narrativa | Inteligência comparativa de mercado |
| B — Rate limits | Alta | Grave/Médio | Backoff (VIAB-R1-3) + Sentry + cache + fallback client-side | Cache 4h + health check + eliminar scraping |
| C — IP ban / app revoke | Média | Médio | Fallback client-side | Eliminar scraping (R1-3.1) + status page + runbook formal |

---

## Checklist trimestral de revisão

A cada 3 meses (próxima revisão: 2026-08-02):

- [ ] Verificar `squads/melidev/data/ml-sources-registry.yaml` (`last_verified` ≤ 90 dias)
- [ ] Auditar Sentry: tags `component:ml_api_backoff` — número de eventos, padrões temporais
- [ ] Revisar comissão por categoria em `src/lib/mercadolivre.config.ts:29-56` vs Central ML
- [ ] Testar `acquire_user_lock` em prod com role `authenticated` (regressão VIAB-R1-1)
- [ ] Verificar status app ML Developers (oficial vs teste)
- [ ] Stress test: gerar 100 req simultâneas em `searchMlApi` e verificar comportamento backoff
- [ ] Atualizar este documento com novos sinais de alerta observados

---

## Referências

- Story origem: [VIAB-R1-3](../../docs/stories/VIAB-R1-3-backoff-ml-api.md)
- Finding F3 completo: `docs/reviews/viability-2026-04-30/findings/F3-risco-plataforma-ml.md`
- Implementação backoff: `src/lib/utils/exponential-backoff.ts`
- Caller modificado: `src/lib/ml-api.ts` (`searchMlApi`)
- Sentry config: `sentry.client.config.ts` + `sentry.server.config.ts`
- Tag policy: `[ML-OFFICIAL]`, `[ML-CENTRAL]`, `[ML-POLICY-CHANGES]`, `[INFERRED]`

---

*Documento v1 criado por Orion (@aiox-master) em 2026-05-02 como deliverable de VIAB-R1-3. Próxima revisão: 2026-08-02.*
