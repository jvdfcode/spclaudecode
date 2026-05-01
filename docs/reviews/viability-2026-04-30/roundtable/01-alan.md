# Alan Nicolas — Curadoria do plano de analise de viabilidade

> "Pareto ao Cubo: 1% do diagnostico define 50% da decisao. O resto e bronze."

## Veredito
**NEEDS WORK**

O plano tem 2 itens de ouro puro (Bloco F1 e F3), 3 de prata que justificam existir, e pelo menos 3 que sao bronze travestido de analise — ruido de troubleshooting disfarçado de diagnostico estrategico. O bloco M e surpreendentemente forte, mas o plano inteiro sofre de uma omissao critica: ignora o unico ativo de conhecimento que define viabilidade real — a dependencia regulatoria da API do Mercado Livre. Sem curadoria, o analista vai gastar palavras em pontos que o Alex ja diagnosticou e perder o 1% que muda tudo.

## 3 Fortalezas (o OURO do plano)

1. **Bloco M com 5 pontos e ouro inegociavel.** ICP defensavel, pricing vs concorrentes com ancora em Nubimetrics R$197, free tier como porta de entrada, GTM, comoditizacao — sao exatamente as 5 perguntas que definem se o produto sobrevive 6 meses. Curadoria aprovada sem reservas.

2. **Formato compacto (1500-2000 palavras) com veredito de 1 frase e 2 notas.** Isso e essencia pura. Força o analista a comprimir em vez de inflar. Se o relatorio sai com 4000 palavras, ja e sinal de bronze infiltrado.

3. **Risk matrix 3x3 com top 5 riscos.** Força priorizacao visual. Combinado com as 5 fraquezas priorizadas e as 3 recomendacoes de 30 dias, o output tem forma de ativo de conhecimento — nao de documento que ninguem relê.

## 3-5 Fraquezas (o BRONZE travestido)

1. **[Bloco F, ponto F2: "OAuth scopes"]** — O diagnostico do Alex (`06-analyst-alex.md`) ja cobriu OAuth em profundidade. O `ml-api.ts` mostra que o connect nao declara scopes explicitos (linhas 10-15 de `connect/route.ts`), e o advisory lock ja esta implementado (`ml-api.ts:64`). Pedir ao analista para "avaliar OAuth scopes" e bronze: e troubleshooting tecnico, nao diagnostico de viabilidade. O que importa para viabilidade e: "se o ML revogar acesso a `/sites/MLB/search`, o produto morre?" — isso sim e ouro.

2. **[Bloco F, ponto F4: "cache 1h"]** — O TTL de 1 hora esta em `mercadolivre.config.ts:126` (`ML_CACHE.TTL_MS: 60*60*1000`). Cache e decisao de performance, nao de viabilidade de produto. Nenhum vendedor ML cancela assinatura porque o cache e de 1h em vez de 30min. Isso e bronze que ocupa espaço de algo essencial.

3. **[Bloco F, ponto F5: "busca 50 results"]** — O `SEARCH_LIMIT: 50` esta em `mercadolivre.config.ts:9`. E uma constante de configuracao trivial. Avaliar se 50 resultados sao suficientes e ruido — o ponto de viabilidade real e: "a busca via API oficial do ML retorna dados suficientes para que a analise de mercado tenha valor estatistico para o vendedor?" — essa e a pergunta de ouro, nao o numero 50.

4. **[Inputs: concorrencia-2026-Q2.md]** — O plano lista esse documento como input, mas ele e um TEMPLATE VAZIO (todos os campos com `...`). O analista vai receber um template sem dados e nao vai ter como comparar pricing real. Isso contamina o Bloco M inteiro. O plano deveria declarar explicitamente: "se concorrencia estiver vazia, usar dados publicos de Nubimetrics, Bling, e Real Trends como proxy."

5. **[Ausencia: dependencia regulatoria da API ML]** — Nenhum dos 10 pontos cobre o risco mais existencial do produto: o SmartPreco depende 100% da API publica do Mercado Livre. Se o ML restringir acesso (como fez com scraping em 2024), mudar termos de uso, ou exigir certificacao de parceiro, o produto inteiro para. Isso nao e risco tecnico — e risco de viabilidade comercial. E o 1% que define 50% da decisao, e o plano ignora completamente.

## 3 Mudancas que devem entrar no plano antes de executar

1. **CORTAR:** Pontos F2 (OAuth scopes), F4 (cache 1h) e F5 (busca 50 results). Sao bronze. O analista Alex ja diagnosticou OAuth; cache e search limit sao parametros de config, nao diagnostico de viabilidade. Libera espaço para o que falta.

2. **ELEVAR:** Transformar F1 (regras de calculo ML hardcoded) no ponto central do Bloco F. O `mercadolivre.config.ts` tem 26 categorias hardcoded (`ML_CATEGORY_FEES`, linhas 29-56) com custos fixos por faixa de preco (`ML_FIXED_COST`, linhas 62-67) e taxas de parcelamento por tipo de anuncio (`ML_INSTALLMENT_FEES`, linhas 96-110). A pergunta de ouro nao e "estao hardcoded?" — e "qual o custo operacional de manter essas tabelas atualizadas quando o ML muda taxas (historicamente 2-3x por ano), e existe API oficial que substitua o hardcoding?" Essa e a unica pergunta funcional que determina viabilidade de longo prazo.

3. **ADICIONAR:** Ponto F-novo: "Risco de plataforma — dependencia da API do Mercado Livre." O produto usa `api.mercadolibre.com` para busca autenticada, OAuth para tokens, e dados de mercado em tempo real. Se o ML restringir, mudar pricing da API, ou exigir status de parceiro certificado, o SmartPreco perde sua funcionalidade central. Este e o risco existencial que o plano deve cobrir — nao como item tecnico, mas como item de viabilidade comercial. Incluir: historico de mudancas de API do ML, programa de parceiros, alternativas (scraping vs API oficial vs dados agregados de terceiros).

## Curadoria dos 10 pontos do plano (Bloco F + Bloco M)

| # | Ponto | OURO/PRATA/BRONZE | Justificativa |
|---|-------|-------------------|---------------|
| F1 | Regras de calculo ML hardcoded em `costs.ts` | OURO | Core do produto. 26 categorias + custos fixos + parcelamento = ativo estrategico. Pergunta certa: sustentabilidade da manutencao manual vs API. |
| F2 | OAuth scopes | BRONZE | Troubleshooting tecnico, ja coberto pelo Alex. Nao define viabilidade. O connect nem declara scopes — e um detalhe de implementacao. |
| F3 | Race condition refresh ML | PRATA | Ja resolvido com advisory lock (`ml-api.ts:64`), mas validar que a solucao funciona em producao e legítimo. Seria ouro se nao estivesse ja endereçado. |
| F4 | Cache 1h | BRONZE | Parametro de config (`ML_CACHE.TTL_MS`). Nenhum vendedor cancela por causa de TTL de cache. Nao e diagnostico de viabilidade. |
| F5 | Busca 50 results | BRONZE | Constante trivial (`SEARCH_LIMIT: 50`). A pergunta certa e sobre valor estatistico da amostra, nao sobre o numero. |
| M1 | ICP defensavel | OURO | Existencial. `ICP-validation-2026-Q2.md` e template vazio — o analista precisa declarar se o ICP e defensavel COM ou SEM dados de entrevista. |
| M2 | Pricing R$39/49/59 vs Nubimetrics R$197 | OURO | Ancora de valor. A/B test implementado (`pricing-experiment.ts`) mas sem dados de WTP. O spread 4-5x vs Nubimetrics e narrativa forte se sustentada. |
| M3 | Free tier 5 SKUs + GTM | OURO | Porta de entrada do funil. Lead Magnet (`/calculadora-livre`) ja existe. A pergunta e se 5 SKUs sao suficientes para gerar upgrade natural. |
| M4 | Vendabilidade | PRATA | Relevante mas depende do output de M1 e M2. Se ICP e WTP nao se sustentam, vendabilidade e academica. |
| M5 | Comoditizacao | OURO | Risco defensivo. Se o ML lançar calculadora propria ou Nubimetrics copiar, qual e o moat? Essencia pura de analise de viabilidade. |

## Conclusao executiva (2-3 frases)

O plano tem a estrutura certa e o Bloco M e ouro quase puro. Mas o Bloco F esta 60% contaminado por bronze — itens de troubleshooting tecnico que ja foram diagnosticados ou que nao definem viabilidade. A omissao fatal e o risco de plataforma (dependencia da API ML): sem esse ponto, o relatorio vai dizer se o motor calcula certo e se o mercado existe, mas vai ignorar o cenario em que o ML desliga a torneira e o produto desaparece. Corte o bronze, eleve F1 ao centro do bloco funcional, adicione o risco de plataforma, e o plano vira um ativo de conhecimento com curadoria de verdade.
