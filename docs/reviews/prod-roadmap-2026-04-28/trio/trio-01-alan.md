# Alan Nicolas — Curadoria do Sprint Plan PROD-001

> "Pareto ao Cubo: 1% das stories gera 50% do resultado. O resto é bronze que finge ser ouro."

## Veredito

**APPROVE** — O plano tem sequenciamento correto, stories rastreadas a problemas-raiz reais, e scope controlado. A curadoria identifica ruido nas bordas, mas o nucleo e OURO puro: sem esse sprint, o app nao existe.

## 3 Fortalezas (o OURO do plano)

1. **Caminho critico sequencial impecavel.** A dependencia PROD-001-1 → 3/4/6 → 5 → 8 → 9 → 10 respeita a realidade fisica: sem Supabase, nao ha migrations; sem migrations, nao ha tipos; sem deploy, nao ha DNS. Zero invencao de ordem — e a essencia de um plano que funciona.

2. **Tracks paralelas bem exploradas.** PROD-001-2, 7 e 12 rodam em paralelo desde o Dia 1 sem depender da decisao D1. Isso maximiza a capacity de 30h com um unico dev — Pareto aplicado ao tempo ocioso.

3. **Gates de entrada explicitamente separados de tasks.** D1/D2/D3 como pre-requisitos e nao como stories executaveis evita a armadilha classica de tratar decisao de negocio como trabalho tecnico. O plano sabe que sem D1 o sprint nao comeca — isso e ouro de maturidade operacional.

## 3-5 Fraquezas (o BRONZE travestido de OURO)

1. **PROD-001-11 tenta ser 3 stories numa so.** Smoke test manual, criacao de `middleware.test.ts` (M5), e validacao Sentry sao 3 atividades com owners, skills e tempos diferentes. Misturar teste unitario (M5) com smoke test operacional dilui o foco. O ativo de conhecimento real aqui e: "Sentry esta vivo, sim ou nao?" — o teste de middleware e bronze disfarçado de gate final.

2. **PROD-001-12 (a11y) classificada como "should-have" quando o diagnostico diz HIGH.** H5, H6, H8 afetam o unico funil de conversao do produto (mobile-first). Marcar como deferrable contradiz a propria premissa de Alex: "cada lead perdido e dado que nunca volta." Se o touch target e 30px num produto mobile-first, abandono e garantido — isso nao e bronze, e ouro de conversao.

3. **PROD-001-1 (decisao Supabase) com 1 SP superestima a simplicidade.** Se D1 e "criar projeto novo", a story inclui criacao + link + captura de 4 chaves + migracao total 001-011. Isso nao e 1h — e 2-3h com risco de cascade. O plano trata uma decisao de alto impacto como trivial.

4. **PROD-001-8 faz `vercel deploy --prod` como "smoke test preview".** O AC diz "deploy preview" mas o comando e `--prod`. Se o DNS ainda nao foi apontado, isso e um production deploy para `*.vercel.app` — confuso semanticamente e perigoso se executado antes de PROD-001-6 estar 100% validada. O ruido semantico pode confundir o executor.

## 3 Recomendacoes concretas

1. **CORTAR de PROD-001-11:** Remover a criacao de `middleware.test.ts` (M5) desta story. M5 e medium-severity, nao gate de producao. Criar story separada pos-sprint ou aceitar como debito consciente. O smoke test de Sentry e de rotas e o ouro; o teste unitario e bronze que atrasa o gate final.

2. **ELEVAR PROD-001-12:** Promover de "should-have/deferrable" para "must-have paralelo". O diagnostico e claro: H5+H6+H8 afetam WCAG em rota de conversao mobile-first. Se o produto vai ao ar com touch targets de 30px, o proprio funil que justifica o sprint esta comprometido. Executar no Dia 1-2 em paralelo, sem condicional de deferral.

3. **ADICIONAR: health-check endpoint explicito.** PROD-001-8 AC menciona `/api/health` mas nenhuma story cria esse endpoint. Se nao existe, o AC falha e o executor para. Ou remover do AC de PROD-001-8, ou adicionar 1 task de 30min para criar um `route.ts` minimalista que retorna 200. Sem isso, e um gap silencioso no plano.

## Ranking das 12 stories — OURO/PRATA/BRONZE

| Story | Classificacao | Justificativa |
|-------|---------------|---------------|
| PROD-001-1 | OURO | Gate zero. Sem decisao Supabase, 4 stories travadas. E o 1% que desbloqueia 50%. |
| PROD-001-2 | OURO | B1 — build nao compila sem isso. Bloqueador absoluto, fix cirurgico, alto ROI. |
| PROD-001-3 | OURO | B3 — sem migrations, erro 500 no primeiro lead. Essencia do produto. |
| PROD-001-5 | OURO | B4 — sem link Vercel, deploy impossivel. Operacional mas inegociavel. |
| PROD-001-6 | OURO | B2 — sem env vars, runtime quebra. Curadoria: as 11 vars sao o sangue do app. |
| PROD-001-9 | OURO | H9 — DNS e o que faz `smartpreco.app` existir para o mundo. Ativo definitivo. |
| PROD-001-10 | OURO | B5 — LGPD. Sem /privacidade, capturar email e infração. Risco juridico real. |
| PROD-001-8 | PRATA | Validacao importante mas derivada — se 2, 5 e 6 estao Done, 8 e consequencia natural. |
| PROD-001-12 | PRATA | Deveria ser OURO (funil mobile), mas o plano a trata como deferrable. Elevo para Prata no minimo. |
| PROD-001-4 | PRATA | H4 — bom hygiene de CI, mas nao bloqueia deploy imediato. Pode ser pos-GO sem risco. |
| PROD-001-7 | PRATA | H2 — endpoint publico e risco, mas o cron em si nao e critico para o primeiro dia. Seguranca e relevante, nao urgente. |
| PROD-001-11 | BRONZE/PRATA | Smoke test Sentry e ouro. Teste middleware.test.ts e bronze empacotado junto. Split necessario. |

---

*Curadoria realizada por Alan Nicolas — Knowledge Architect — 2026-04-28*
*Principio aplicado: Pareto ao Cubo. Das 12 stories, 7 sao ouro inegociavel, 3 sao prata com valor real, e 2 tem ruido interno que dilui o resultado.*
