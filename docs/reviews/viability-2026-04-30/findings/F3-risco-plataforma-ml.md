# F3 — @melidev + @meli-ops: Risco de plataforma (dependencia API ML)

**Specialists:** @melidev (tecnico) + @meli-ops (policy)
**Comandos:** *explain rate-limit-and-policy-volatility + *explain-policy mudancas-de-API
**Data:** 2026-05-01

## 3 Cenarios de risco

### Cenario A — ML lanca calculadora oficial

- **Probabilidade:** MEDIA
- **Justificativa probabilidade:** [INFERRED] ML ja oferece ferramentas internas (Central de Vendedores, relatorios). Marketplaces maduros (Amazon, Shopee) internalizam pricing tools. ML publica tabelas de comissao no Help Center. Porem, ML prioriza logistica e ads sobre ferramentas de pricing — sem sinais publicos de lancamento ate abril 2026. [ML-CENTRAL]
- **Impacto SmartPreco:** GRAVE. Core value ("calcule margem real") seria replicado gratis dentro do painel ML. Lead magnet (`/calculadora-livre`) perderia atratividade. Diferencial restante: pesquisa comparativa (mediana, P25, P75) — que ML provavelmente nao incluiria (conflito de interesse). [INFERRED]
- **Fallback documentado?** Nao. Sem plano de contingencia.
- **Recomendacao:** Investir em inteligencia comparativa de mercado como core value — calculo puro e commodity, analise competitiva nao e. [INFERRED]
- **Tags:** [ML-CENTRAL], [ML-POLICY-CHANGES], [INFERRED]

### Cenario B — ML muda rate limits

- **Probabilidade:** ALTA
- **Justificativa probabilidade:** [ML-OFFICIAL] Rate limit atual: 1500 req/min/seller (VB006). Token expira em 21600s (6h). Ambos podem mudar sem aviso. SmartPreco e conservador (10 req/min/usuario, `limit=50`), mas o **ml-proxy** (scraping HTML com Cheerio e User-Agent falso em `ml-proxy/route.ts:15-27`) e vetor de risco maior — ML pode mudar HTML ou bloquear requests de server sem aviso. [INFERRED]
- **Impacto SmartPreco:** GRAVE a MEDIO. Rate limit reduzido: busca server-side pararia, fallback client-side (`MarketSearch.tsx:104`) ainda funcionaria com UX degradada. Token mais curto: volume de refresh 6x maior. Scraping bloqueado: `ml-proxy` retorna 502 sem segundo fallback. [ML-OFFICIAL] [INFERRED]
- **Fallback documentado?** Parcial. Client-side search existe mas: (1) `searchMlApi` faz `throw new Error` em qualquer nao-200 sem retry nem backoff (viola VB006), (2) sem monitoramento de 429, (3) scraping sem fallback proprio. [ML-OFFICIAL]
- **Recomendacao:** Remover scraping HTML. Implementar backoff exponencial. Monitorar 429 via Sentry (ja integrado). Estender cache TTL para queries populares. [INFERRED]
- **Tags:** [ML-OFFICIAL], [ML-POLICY-CHANGES], [INFERRED]

### Cenario C — ML bane IP do Vercel

- **Probabilidade:** MEDIA-BAIXA (API oficial) / MEDIA-ALTA (scraping)
- **Justificativa probabilidade:** [ML-OFFICIAL] API oficial autentica por OAuth, nao IP — ML revogaria app, nao baniria IP. Scraping HTML e outro caso: requests sem auth, User-Agent falso, headers fabricados, de IP de cloud provider — pattern classico de deteccao anti-bot. [INFERRED]
- **Impacto SmartPreco:** MEDIO. Se scraping bloqueado: fallback client-side assume. Se app OAuth revogada: todo fluxo autenticado morre. Se ambos: resta apenas calculadora com taxas hardcoded.
- **Fallback documentado?** Parcial. `ml-search/route.ts:99` retorna `{ clientSide: true }` com 503, frontend trata em `MarketSearch.tsx:103`. Funcional mas nao documentado como estrategia.
- **Recomendacao:** Eliminar scraping HTML. Documentar degradacao graceful. Registrar app como oficial (nao teste). [ML-OFFICIAL] [INFERRED]
- **Tags:** [ML-OFFICIAL], [ML-POLICY-CHANGES], [INFERRED]

## Plano fallback geral

Existe? **Parcialmente, implicito no codigo, sem documentacao estrategica.**

- [ ] Cenario A: NAO existe. Sem diferenciacao alem do calculo de margem.
- [x] Cenario B: Parcial. Client-side search funciona. Sem backoff, sem retry, sem monitoramento.
- [x] Cenario C: Parcial. Mesmo mecanismo. Se app revogada, recovery manual.

**4 gaps criticos:**
1. Scraping HTML (`ml-proxy`) com seletores CSS frageis — quebra silenciosamente. [INFERRED]
2. Sem backoff exponencial em 429 — viola VB006. [ML-OFFICIAL]
3. Taxas hardcoded (26 categorias) sem validacao runtime — margem errada silenciosa. [INFERRED]
4. Sem health check de integracao ML. [INFERRED]

## Veredito (1 frase)

SmartPreco tem dependencia **critica e parcialmente mitigada** da API ML: fallback client-side existe mas scraping HTML e bomba-relogio, taxas hardcoded desatualizam silenciosamente, e nao ha diferenciacao que sobreviva a uma calculadora oficial do ML.

## Nota X/10

**Nota:** 4/10
**Justificativa:** Dependencia total de plataforma unica com mitigacao parcial. Positivos: fallback client-side funcional, advisory lock robusto, rate limit conservador. Negativos: scraping com headers falsos (fragil + viola boas praticas), taxas hardcoded sem validacao, sem backoff em 429, sem health check, sem diferenciacao estrategica documentada contra calculadora oficial ML.

## Sources usadas

| Tag | Fonte | Uso |
|-----|-------|-----|
| [ML-OFFICIAL] | `developers.mercadolivre.com.br` | Rate limit, OAuth, endpoints |
| [ML-CENTRAL] | `mercadolivre.com.br/ajuda` | Comissoes, ferramentas seller |
| [ML-POLICY-CHANGES] | Warning @meli-ops | Volatilidade de politica |
| [INFERRED] | Boas praticas REST + mercado | Probabilidades, WAF, tendencias |
| [SOURCE: codigo] | Codebase SmartPreco | `ml-api.ts`, `ml-proxy/route.ts`, `mercadolivre.config.ts`, `MarketSearch.tsx` |

[ML-POLICY-CHANGES] Analise reflete estado abril-maio 2026. Revalidar antes de decisoes.
