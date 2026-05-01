# Análise de Viabilidade SmartPreço — Relatório Consolidado

**Data:** 2026-05-01
**Owner:** Pedro Emilio Ferreira (responsabilidade)
**Auditor:** Squad MeliDev + 3 personas externas (Alfredo Soares, Thiago Finch, Rony Meisler)
**Plano executado:** `docs/reviews/viability-2026-04-30/00-plano-v3.md`
**Findings detalhados:** `docs/reviews/viability-2026-04-30/findings/F1..F3, M1..M8b`

---

## Veredito (1 frase)

**SmartPreço é tecnicamente funcional (5.0/10 funcional) e mercadologicamente promissor mas não validado (5.0/10 mercadológico) — produto entrega o que promete hoje, mas tem 1 race condition crítica em produção, ICP não-defensável (zero entrevistas), ameaça existencial da precificação nativa do ML, e zero ritual de uso ou narrativa de marca que sustente categoria nova.**

| Dimensão | Nota | Faixa rubric |
|----------|:----:|--------------|
| **Funcional** (regras + sustentabilidade) | **5.0/10** | "corretas mas com débito crítico" |
| **Mercadológica** (ICP + pricing + GTM) | **5.0/10** | "demografia genérica, sem narrativa, GTM não testado" |
| **Média geral** | **5.0/10** | Vai ao ar, mas precisa de 30 dias de execução pra subir pra 7+/10 |

---

## Notas individuais por ponto

### Bloco F — FUNCIONAL

| # | Ponto | Specialist | Nota | Achado central |
|---|-------|-----------|:----:|----------------|
| F1 | Regras de cálculo ML 2026 | @melidev | 5/10 | Valores prováveis OK; **débito crítico em sustentabilidade** — zero mecanismo de atualização automática quando ML mudar taxas |
| F2 | OAuth refresh production | @melidev | 5/10 | **Advisory lock inacessível por permissão quebrada** — race condition ATIVA em produção; falta state CSRF; refresh token texto plano |
| F3 | Risco de plataforma (API ML) | @melidev + @meli-ops | 4/10 | **Scraping HTML em `ml-proxy/route.ts` é bomba-relógio**; sem backoff em 429; sem health check; ML lançou calculadora oficial em 2026 (ameaça existencial) |

**Média Bloco F: 4.7/10**

### Bloco M — MERCADOLÓGICA

| # | Ponto | Specialist | Nota | Achado central |
|---|-------|-----------|:----:|----------------|
| M1 | ICP defensável | @meli-strategist | **3/10** ⚠️ | **ICP é demografia genérica**; zero entrevistas; perfil PROXY "Ricardo Tavares" é hipótese sem nome real |
| M2 | Pricing R$39/49/59 vs concorrentes | @meli-strategist | 6/10 | R$39-59 defensável de entrada (3-5x mais barato que concorrentes); **tensão preço-posicionamento "Liderança em Produto"**; Agency R$149 sub-precificado |
| M3 | Concorrência ≥3 mapeados | @meli-strategist | 6/10 | 5 concorrentes (Nubimetrics R$310, Real Trends R$115-445, Hunter Hub R$97-397, JoomPulse R$137+, Olist R$49-679); "scraping ML" **NÃO é único** (commodity); diferencial workflow é parcialmente único |
| M4 | Trial 14d vs Free tier | @alfredo-soares | 5/10 | Free tier eterno **viola padrão de mercado** (100% concorrentes usam trial); modelo híbrido proposto pode 4-6x MRR mês 1 |
| M5 | Loss Aversion calibrada | @meli-ops | 6/10 | Ratio mínimo **12.6:1** (passa threshold 2.5:1 com folga); custo NÃO usar = R$1.064-1.520/mês [INFERRED] |
| M6 | Headline test | @thiago-finch | **3.3/10** ⚠️ | **Home `/` redireciona pra `/dashboard` — buraco fatal no funil**; headline `/precos` é feature claim sem Loss Aversion; headline `/calculadora-livre` é a única decente (7/10) |
| M7b | Ritual de uso narrativo | @rony-meisler | 5/10 | Ritual proposto: domingo à noite (Marlene da Penha, 41, vendedora capinha celular zona norte RJ); tribo é hipótese forte mas [INFERRED]; anti-comoditização exige narrativa, não feature |
| M8b | Comunidade externa como canal | @alfredo-soares | 5/10 | **Mercado Ads inviável** (CAC:LTV 1:0.2-1:1.2); comunidade é único canal viável; founder solo tem 4-6h/semana realisticamente |

**Média Bloco M: 4.9/10**

---

## Top 5 fortalezas

1. **Loss Aversion estruturalmente forte** — ratio 12.6:1 a 31:1 [M5] significa que SE a narrativa for clara, conversão é fácil. Custo de NÃO usar (R$1.064-1.520/mês) é 18-31x maior que custo de usar (R$49). Apenas precisa **tornar visível** ao vendedor.

2. **Pricing 3-5x mais barato que concorrentes diretos** — Hunter Hub R$97 (mínimo), Nubimetrics R$310, JoomPulse R$137. SmartPreço a R$39-59 cria pressão competitiva real se posicionamento for "Nubank da precificação ML" [M2].

3. **Diferencial de workflow parcialmente único** — nenhum concorrente une "cálculo por tipo de anúncio + categoria específica + simulador de cenários" no mesmo lugar [M3]. Cada peça é commodity mas a combinação ainda não foi feita.

4. **Squad MeliDev importada gera vantagem operacional** — 4 specialists ortogonais (chief + integration + strategist + ops) com fontes ancoradas `[SOURCE:]` substitui sessão única de "spawn anônimo". Auditável, reusable em sprints futuros.

5. **Headline `/calculadora-livre` está a um número de virar conversão alta** — "Descubra em 30s quanto você está perdendo em cada venda no ML" tem Loss Aversion parcial + promessa específica. Falta apenas o número concreto (R$847 ou R$500+) [M6].

---

## Top 5 fraquezas priorizadas

### #1 — Race condition OAuth ML ATIVA em produção [F2 — CRÍTICA]
Advisory lock `acquire_user_lock()` está **inacessível por permissão quebrada** — função aceita só `service_role`, mas client é `authenticated`. Lock nunca executa; fallback silencioso na linha 77 mascara o problema. Refresh paralelo em produção pode resultar em token corrompido por usuário, perdendo conta ML conectada.

**Custo se não corrigir:** próximos 100 vendedores conectarem em paralelo → 1-3 perdem conexão silenciosamente → suporte em fogo.

**Ação 30 dias:** trocar permissão pra `authenticated` ou mover chamada pra service_role context.

### #2 — Home `/` redireciona pra `/dashboard` sem landing pública [M6 — CRÍTICA]
**Não existe landing pública.** `redirect('/dashboard')` descarta 100% do tráfego frio. Qualquer SEO, ads ou link building no domínio raiz tem ROI zero.

**Custo se não corrigir:** todo investimento em aquisição volta vazio. Concorrentes têm landing decente.

**Ação 30 dias:** criar `/` pública com headline Loss Aversion + CTA para `/calculadora-livre`.

### #3 — ICP é demografia genérica, zero entrevistas validando [M1 — CRÍTICA]
Perfil ICP atual ("vendedor 5+ SKUs, R$5-100k/mês") é demografia, não tribo. Zero entrevistas das 10 planejadas em MKT-001-2 foram feitas. Perfil PROXY "Ricardo Tavares" é projeção sem rosto real. M7b propõe alternativa "Marlene da Penha" mas também é hipótese.

**Custo se não corrigir:** todo argumento mercadológico (pricing, headline, ritual, GTM) é construído em areia. Primeira entrevista pode invalidar tudo.

**Ação 30 dias:** rodar 5 entrevistas seguindo ROTEIRO.md + adicionar 3 perguntas (frequência erro pricing, custo percebido mediação, comunidades onde participa).

### #4 — Risco de plataforma alto: scraping HTML + ML calculadora oficial [F3 — CRÍTICA]
`src/app/api/ml-proxy/route.ts` faz scraping HTML com Cheerio + User-Agent falso — frágil a qualquer mudança de layout ou ban de IP. Sem backoff em 429. **ML lançou calculadora oficial nativa em 2026** (gratuita) que pode erodir percepção de valor da feature core.

**Custo se não corrigir:** uma mudança de página ML quebra o produto sem aviso. Ou ML migrar usuários pra calculadora oficial torna SmartPreço irrelevante.

**Ação 30 dias:** (a) adicionar backoff exponencial em 429 (cumpre VB006 [ML-OFFICIAL]); (b) documentar plano fallback escrito para 1 dos 3 cenários; (c) atualizar narrativa landing pra diferenciar do "ML oficial faz preço sem considerar margem".

### #5 — Zero ritual de uso + zero narrativa de marca [M6 + M7b — ALTA]
Headline `/precos` é feature claim ("motor de decisão mais preciso") sem Loss Aversion. Ritual de uso não documentado. Tribo indefinida. Anti-comoditização inexistente.

**Custo se não corrigir:** primeiro concorrente que construir marca neste espaço (mesmo com motor pior) ganha categoria. Quem chega depois compete em preço.

**Ação 30 dias:** (a) reescrever headline `/precos` com Loss Aversion (Alternativa proposta M6); (b) adicionar ao posicionamento.md seção "Quando ML lança oficial, sobrevivemos porque ___"; (c) entrevistas validam tribo (Ricardo? Marlene? outro?).

---

## Risk Matrix 3x3

|  | Impacto BAIXO | Impacto MÉDIO | Impacto ALTO |
|--|---|---|---|
| **Prob ALTA** | — | Vendedor casual sazonal mal atendido | **#1 Race condition OAuth ATIVA** |
| **Prob MÉDIA** | Agency sub-precificado | **#5 Zero ritual + zero narrativa** | **#2 Home sem landing**, **#3 ICP não validado**, **#4 Scraping HTML frágil** |
| **Prob BAIXA** | Free tier educar comunidade | ML mudar taxas sem aviso (F1) | ML banir IP do Vercel |

**Quadrante PROB ALTA × IMPACTO ALTO:** 1 risco (race condition). **Mitigação imediata.**

**Quadrante PROB MÉDIA × IMPACTO ALTO:** 3 riscos (home, ICP, scraping). **Sprint atual.**

---

## 3 Recomendações 30 dias

### R1 — Fix race condition + criar landing pública [Sprint imediato]
1. **F2 fix:** trocar permissão de `acquire_user_lock` pra `authenticated` ou refatorar chamada pra service_role
2. **M6 fix:** criar `/` pública com headline "Vendedores ML perdem em média R$847/mês por erro de precificação. Você está entre eles?" + CTA `/calculadora-livre`
3. **F3 fix mínimo:** adicionar backoff exponencial em `searchMlApi` (429 retry com 2^n delay até 5 tentativas)

**Estimativa:** 1-2 sprints. **Owner:** Pedro Emilio (executor: @dev). **Gate:** typecheck + smoke E2E.

### R2 — Rodar 5 entrevistas ICP + atualizar ROTEIRO [Próximas 2 semanas]
1. Adicionar ao ROTEIRO.md (Bloco 5):
   - "Quantas vezes/mês você descobre que vendeu produto no prejuízo?"
   - "Quanto estima perder/mês com cancelamentos e mediações?"
   - "Em quais grupos WhatsApp/Facebook ou eventos você participa como vendedor ML?"
   - "Me conta a última vez que sentiu vergonha do seu negócio ML"
2. Agendar 5 entrevistas via network próprio do founder (Estratégia 1 de M8b)
3. Após 5 entrevistas: atualizar ICP-validation-2026-Q2.md com nome+sobrenome+canal de cada entrevistado

**Estimativa:** 5 entrevistas × 30min + 5h síntese = 7.5h em 14 dias. **Owner:** Pedro Emilio (não delegável). **Gate:** ICP-validation tem 5 entradas reais, não TEMPLATE.

### R3 — A/B test Trial 14d + reescrever headline /precos [Sprint após R1+R2]
1. Adicionar variante D no `pricing-experiment.ts`: Trial 14 dias do Pro completo + fallback para Free 1 SKU após expirar
2. Reescrever headline `/precos`: "Pare de precificar no escuro. Veja exatamente onde sua margem está vazando — e corrija hoje."
3. Manter `/calculadora-livre` pública sem cadastro (lead magnet SEO permanente)

**Estimativa:** 1 sprint após R1+R2 entregarem. **Owner:** Pedro Emilio (executor: @dev). **Gate:** A/B test rodando 30 dias com ≥100 conversões coletadas por variante.

---

## Apêndice — Itens cortados do Bloco F

Decisão T1 da mesa redonda v2 (Alan+Finch+Tallis aprovaram cortar):

- **OAuth scopes** (`src/app/api/auth/ml/connect/route.ts`) — scope `offline_access` ausente; bronze de troubleshooting
- **Cache 1h** (`SEARCH_CACHE_TTL` em `src/lib/mercadolivre.config.ts:126`) — constante de performance, não viabilidade
- **Busca 50 resultados** (`SEARCH_LIMIT: 50`) — constante trivial

Esses itens permanecem **não auditados** neste relatório por decisão consciente. Endereçáveis em sprint operacional separado.

---

## Rollback documentado

Se este relatório produzir conclusão errada que leve a investimento de sprints:

1. **Detecção:** entrevistas ICP (R2) revelam tribo/dor diferente do diagnosticado (ex: vendedor não é Marlene, é Ricardo profissional masculino → narrativa Rony cai)
2. **Reverter R3:** parar A/B test do Trial 14d; voltar para free tier eterno como default
3. **Reverter R1 (parcial):** manter fix de race condition + backoff (são correções técnicas independentes da estratégia mercadológica)
4. **Re-rodar análise:** invocar squad MeliDev novamente com input das entrevistas reais; v3 vira v4 com tribo corrigida
5. **Histórico:** todos os findings v1 ficam preservados em `docs/reviews/viability-2026-04-30/findings/` para auditoria de evolução

---

## Open Questions consolidadas (10 itens críticos)

Cada finding flagrou questões abertas. Lista priorizada para entrevistas + decisões do founder:

1. SmartPreço previne erros proativamente (alerta antes de publicar) ou só calcula corretamente quando solicitado? [M5]
2. Existe algum dado de telemetria/analytics atual? Quantos beta users? Conversões? [M4]
3. Pedro Emilio é vendedor ML ativo ou só developer do produto? [M8b]
4. Pedro Emilio tem relação com sócio do G4 Educação? [M8b]
5. Qual budget mensal disponível para community marketing? [M8b]
6. ICP canônico: Ricardo Tavares (M1) ou Marlene da Penha (M7b)? [M1+M7b]
7. WTP real validado vs hipótese R$39-59 — entrevista resolve [M2]
8. Frequência de erro de pricing no ICP real (assumido 15-25%, pode ser 2%) [M5]
9. Política Vercel sobre scraping HTML — está OK ou rasga ToS? [F3]
10. Categorias ML hardcoded — atualizar agora ou esperar pg_cron? [F1]

---

## Sources consolidadas

| Tag | Origem | Fontes |
|-----|--------|--------|
| `[ML-OFFICIAL]` | developers.mercadolivre.com.br | F1, F2, F3 |
| `[ML-CENTRAL]` | Central de Vendedores ML | F3, M2, M5, M8b |
| `[CDC]` | Lei 8.078/90 | M5 |
| `[BIANCA-MURTA]` | Adv. especialista marketplace | M5 |
| `[GUSTAVO-LUCAS]` `[PARROS-CASE]` | Influenciadores ML | M1, M3, M8b |
| `[INFERRED]` | Inferências de pattern | TODOS findings |
| `[Loja Integrada/G4]` | Experiência Alfredo Soares | M4, M8b |
| `[DNA Reserva]` | Voice DNA Rony Meisler | M7b |

Sources detalhadas com URL e `last_verified` em cada finding individual em `findings/`.

---

*Relatório consolidado por Orion (orquestrador) em 2026-05-01. Owner: Pedro Emilio Ferreira. Auditor: Squad MeliDev (`squads/melidev/`) + Alfredo Soares + Thiago Finch + Rony Meisler.*
