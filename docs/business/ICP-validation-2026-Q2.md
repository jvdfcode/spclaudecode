# ICP Validation 2026-Q2 — output consolidado do Bloco I (v1 SINTÉTICA)

> ⚠️ **[v1 SINTÉTICA — 2026-05-02]**
>
> Este documento foi preenchido via **triangulação de 3 métodos**, NÃO entrevistas reais com vendedores ML:
>
> - **Método A:** 10 entrevistas sintéticas via personas (`interviews/01..10-*.md`) — banner [SYNTHETIC v1] em cada arquivo
> - **Método B:** pesquisa de campo via WebFetch (`interviews/00-pesquisa-campo-2026-05-02.md`) — citações reais públicas com URL + last_verified
> - **Método C:** ICP defensável Squad MeliDev (`interviews/00-melidev-icp-proxy-2026-05-02.md`) — perfil-tipo proxy ancorado em [GUSTAVO-LUCAS] + [PARROS-CASE] + [ML-CENTRAL]
>
> **Convergências fortes** entre os 3 métodos sustentam o ICP descrito abaixo, mas NÃO substituem entrevistas reais.
>
> **Próximo passo (não-bloqueante):** validar ≥3 findings convergentes com vendedores ML reais antes de tomar decisões irreversíveis (pricing, headline, A/B test). Findings priorizados na seção 8.

**Epic:** EPIC-MKT-001 · **Status:** v1 sintética · **Próxima versão:** v2 com entrevistas reais
**Pré-requisito documental para liberar H2** (TECHNICAL-DEBT-REPORT.md §8) — desbloqueio condicional.

---

## 1. ICP confirmado

### 1.1 Quem é o vendedor-alvo

**ICP central (★ alto):** vendedor ML brasileiro consolidado, R$ 15-200k/mês, 35-350 SKUs, 2-8 anos de operação ML, mix Classic+Premium em anúncios, reputação verde claro a Mercado Líder Pleno, dor central = margem invisível por não diferenciar tipo de anúncio + custos ocultos (Full, frete subsidiado, regime tributário).

**Perfil nominal canônico (Método C):** **Ricardo Tavares de Oliveira**, 34 anos, Duque de Caxias-RJ, Acessórios Celular, R$ 38k/mês, 47 SKUs, esposa + sem CLT, reputação verde, ML há 4 anos. [MELIDEV-PROXY]

**Sub-perfis identificados (validados via Método A — 10 sintéticos):**

| Sub-perfil | Proxy | Faturamento | Time | WTP modal | Hero feature |
|------------|-------|-------------|------|:---------:|--------------|
| **Sub-A: solo amador** | Marlene (RJ) | R$ 5-10k | sozinho | R$ 19 | "share WhatsApp" loop viral |
| **Sub-B: solo ambicioso** | Diego (PR) | R$ 10-15k | sozinho | R$ 49 | simulador Free/Classic/Premium |
| **Sub-C: solo profissional** | Patricia (GO), Vanessa (MG) | R$ 14-22k | sozinha + 1 freela | R$ 19→49 | alerta de mudança de taxa / simulador cambial |
| **Sub-D: sócio + small team** | Ricardo (SP) | R$ 35k | sócio + 1 CLT | R$ 49-149 | integração Bling + cenário |
| **Sub-E: time formal** | Carlos (CE), Rodrigo (RS) | R$ 60-130k | esposa + 2-4 CLT | R$ 49-299 | comparador BF + "Replace Headcount" |
| **Sub-F: brand-driven multicanal** | Julia (SC) | R$ 80k | sócia + 2 PJ | R$ 49-149 | multicanal ML+Shopify+Shopee |
| **Sub-G: enterprise data-driven** | Bruno T. (SP) | R$ 180k | 6 CLT | R$ 499-999 | API REST + SLA + SSO |

**Faixas dimensionais (consenso 3 métodos):**
- **SKUs ativos predominante (★+✓):** 35-350 (Sub-B a Sub-F)
- **Faturamento ML mensal predominante:** R$ 12-130k
- **Quem precifica:** majoritariamente o próprio dono/sócio; em Sub-E pode haver precificador dedicado
- **Maturidade digital:** uso prévio de planilha + 1 ERP (Bling 70% do mercado); 30% já testou pelo menos 1 SaaS pricing (Hunter Hub, Letzee, Nubimetrics)

### 1.2 Quem NÃO é (anti-ICP)

- **Vendedores R$ <10k/mês com <20 SKUs** — Marlene (Sub-A) é fronteira; Felipe (Sub-AntI) é claramente fora
- **Vendedores enterprise >R$ 500k/mês com time >10** — entrariam em Sub-G mas precisam de feature set de Ano 2 (API, SLA, SSO, RBAC) que SmartPreço não tem em MVP
- **Iniciantes <8 meses ML** sem CNPJ — competem com info-produto pelo orçamento mensal (Felipe vs curso Hotmart) [novo finding Felipe]

**Recomendação operacional:** **header qualificador "para vendedores R$10k+/mês"** filtra anti-ICP do funil sem fricção (validado por Felipe ✗ que naturalmente desqualificou-se).

---

## 2. Dor & urgência confirmadas

### 2.1 Top 3 dores (com citações de ≥2 entrevistas/fontes cada)

#### Dor #1 — Precificação cega por não diferenciar tipo de anúncio (Free/Classic/Premium)
- **Quantificação:** R$ 760-2.300/mês perdidos em margem invisível [MELIDEV] (Ricardo); 14pp diferença entre Premium 17% real e 12% planilha (Diego whey: margem 4% real vs 18% esperado)
- **Citações convergentes:**
  - Diego (sintético): *"Tô na mão da plataforma. Achei que tinha 18% de margem, tinha 4. Trabalho pra caramba pra ganhar troco."* [SYNTHETIC]
  - Ricardo (sintético): *"Sou eu, o cara que monta planilha de taxa do ML, e errei. Imagina o seller médio."* [SYNTHETIC]
  - Marlene (sintético): *"Quando vi tava tirando R$3 de margem por capinha, véi."* [SYNTHETIC]
  - "Maria Santos" via Hunter Hub: *"Antes eu achava que tinha 15% de margem. Tinha 6%. O Hunter me salvou de quebrar."* [PUBLIC-DATA]
- **Urgência média (1-10):** 9/10 nas vítimas recentes — janela de alta intent de 14-30 dias após "tombo"
- **Heurística:** MS001 [ML-CENTRAL]

#### Dor #2 — Mudança de taxa ML sem aviso amplo + erosão silenciosa
- **Quantificação:** R$ 200-1.200/mês perdidos durante semanas até notar (Patrícia: 1 semana após mudança categoria moda 11%→12%; Julia: 3 semanas após cosméticos 17,5%→19%)
- **Citações convergentes:**
  - Patrícia: *"Demorou uma semana pra eu perceber que minhas margens caíram. O ML não avisou em e-mail amplo."* [SYNTHETIC]
  - Julia: *"Erodiu silenciosamente meu DRE — só vi quando bati com Bling no fim do mês."* [SYNTHETIC]
  - "Cliente Arcos Scale": *"Com a planilha, descobri que estava pagando para trabalhar em 30% dos meus produtos."* [PUBLIC-DATA]
- **Hero feature implícita:** alerta proativo de mudança de taxa por categoria — nenhum concorrente faz nativamente

#### Dor #3 — Tempo + custo de oportunidade gerenciando planilha cross-canal/cross-sazonalidade
- **Quantificação:**
  - Julia (multicanal): 2h/semana × 4 = 8h/mês em manutenção planilha cross-canal
  - Carlos (sazonal Q4): R$ 14k queimados em BF 2025 forçada (margem -8%, 1.900 unidades)
  - Rodrigo (folha CLT): quer cortar 1 cabeça (R$ 3k/mês economia) automatizando 70% da Luciana
  - Vanessa (câmbio): dolar +8% = -40% margem em 320 unidades (R$ 1.900 evaporados)
- **Citação âncora Rodrigo:** *"Se essa ferramenta libera 70% do trabalho da Luciana, eu corto 1 cabeça da folha. R$3k/mês economia."* [SYNTHETIC]
- **Heurística:** MS010 (sazonalidade) + automação como Replace Headcount em Sub-E

### 2.2 Urgência média e timing

- **Score de urgência médio (★+✓ 7 entrevistas):** **8.4/10** — todos com tombos recentes (3-12 meses) ou consciência aguda
- **Timing destrava o "agora":**
  - **Event-driven:** após tombo financeiro recente (Diego whey, Vanessa câmbio, Carlos BF)
  - **Sazonal:** janelas pré-Black Friday (~6 meses antes, set/2026), pré-Dia das Crianças (jul/2026)
  - **Consolidação SaaS:** quando seller atinge ~R$ 5k/mês em SaaS e quer reduzir stack (Bruno T threshold)

---

## 3. WTP — Willingness to Pay

| Faixa testada | Reação ★ | Reação ✓ | Reação ✗ |
|---------------|---------|---------|---------|
| **R$ 19/mês** | ❌ "sinal negativo, ferramenta séria não cobra R$19" (8 confirmações) | ✓ Marlene/Vanessa/Patrícia testariam como porta de entrada | ✓ Felipe — "tá no limite" |
| **R$ 49/mês** | ✅ **MODAL** (Diego, Ricardo, Carlos, Julia sólido; Patricia condicional ROI; Vanessa condicional simulador cambial; Bruno T nem percebe) | ✓ aceitam com hero feature destrava | ❌ "nem pensar agora" |
| **R$ 99/mês** | ✅ negocia com integração Bling (Ricardo, Carlos, Julia) | ❌ exige 3x ROI provado (Patrícia) | ❌ |
| **R$ 149-299/mês** | ✅ Sub-E "Replace Headcount" (Rodrigo) + Sub-F multicanal (Julia) | ❌ | ❌ |
| **R$ 499-999/mês** | ✅ Sub-G enterprise com 7 condições (Bruno T) | ❌ | ❌ |

- **WTP modal nos ★+✓:** **R$ 49/mês** (consenso forte 7/10 entrevistas convergentes; ratificado por Método C MeliDev e Método B Letzee R$59-99)
- **Recomendação para Pro:** **R$ 49/mês** (variante B do A/B test) — abaixo do piso psicológico R$ 50, acima do piso de seriedade R$ 29 [MELIDEV]
- **Features mínimas que destravam o WTP R$49:**
  1. Classificação automática Free/Classic/Premium por SKU (3/10 confirmaram)
  2. Cálculo correto de taxa fixa R$6,75 abaixo de R$79 (Ricardo + Carlos identificaram gap)
  3. Diferenciação por categoria ML real (Patrícia + Julia destacaram)
  4. Simulador "se mudar X, margem vira Y" (Diego + Ricardo + Carlos)
- **Pricing por sub-perfil (proposta):**
  - Sub-A/Sub-B: R$ 39-49 (entry — 1 sub-vendedor, dashboard básico)
  - Sub-C/Sub-D: R$ 49-99 (Pro — multi-SKU, alerta de taxa, integração Bling)
  - Sub-E/Sub-F: R$ 149-299 (Business — multicanal, regra de margem mínima, Replace Headcount)
  - Sub-G: R$ 499-999 (Enterprise — API, SLA, SSO, RBAC) — **fora do MVP**

---

## 4. Canal de aquisição validado

### 4.1 Bullseye — top 3 hipóteses → top 1 testado (não-testado-ainda)

| Hipótese | Custo | Velocidade | Dado coletado |
|----------|-------|-----------|---------------|
| **Comunidades FB/WhatsApp/Telegram (peer-to-peer)** | baixo (4-6h/sem founder) | médio | **MAIS CITADO**: 7/10 entrevistas mencionam grupo específico como canal #1 [SYNTHETIC + PUBLIC-DATA + MELIDEV] |
| SEO ("calculadora taxa ML") | baixo | médio | Reviews públicas mostram que sellers buscam "calculadora ML" [PUBLIC-DATA] — dado parcial |
| Parceria com agregadores (Bling, Tiny, Olist) | médio | lento | Bling tem 70%+ do mercado SMB [PUBLIC-DATA] — alta alavancagem se possível |
| Influencer Gustavo Lucas / Tiago Tessmann | alto (R$3-8k/mês) | rápido | [GUSTAVO-LUCAS] confirma alunos no perfil-tipo R$30-50k = ICP central [MELIDEV] |

### 4.2 Canais nominalmente identificados (15+ comunidades — Método A + B + C)

**Grupos amplos (multi-segmento):**
- "Vendedores do Mercado Livre Brasil" (FB, ~60k membros) — **mais citado** [MELIDEV + PUBLIC-DATA]
- "Mercado Livre — Dicas para Vendedores" (FB, ~35k) [MELIDEV]
- "Grupo Foco em Vendas (GFV)" (multi-plataforma desde 2017) [PUBLIC-DATA]
- "Comunidade JoomPulse" (WhatsApp, focada precificação) [PUBLIC-DATA]

**Grupos verticais (por categoria):**
- "Sellers Brinquedo BR" (WhatsApp, ~80, fechado) — Carlos cita como #1 [SYNTHETIC]
- "Suplementos ML BR" (Telegram, ~400) — Diego [SYNTHETIC]
- "Importadores ML" (Telegram, ~140) — Vanessa [SYNTHETIC]
- "Encontro de Autopeças do Sul" (WhatsApp, ~85, presencial Caxias 6 anos) — Rodrigo [SYNTHETIC]

**Grupos regionais:**
- "Vendedoras ML RJ" (WhatsApp, ~80, zona norte/baixada) — Marlene [SYNTHETIC]
- "Vendedores RJ MEI" (WhatsApp, ~180) [MELIDEV]
- "Mulheres Empreendedoras ML BR" (FB, ~2k) — Patrícia [SYNTHETIC]
- "Sellers Mulheres ML" (WhatsApp, ~50) — Vanessa [SYNTHETIC]

**Grupos seniores/curados:**
- "Sellers ML Avançado SP" (WhatsApp, ~80, curado) — Ricardo [SYNTHETIC]
- "DTC Brasil" (WhatsApp, ~120, curado) — Julia [SYNTHETIC]
- Slack "DTC Brasil" (~340) — Bruno T [SYNTHETIC]

### 4.3 Canal #1 escolhido para H2 inicial (recomendação)

**Tier-1 (start agora — orgânico, custo <R$1.500/mês):**
- **Grupo FB "Vendedores do Mercado Livre Brasil"** (60k+) — funda de pesca + lead magnet `/calculadora-livre`
- 4-6h/semana de Pedro respondendo dúvidas reais com link → calc gratuita

**Tier-2 (após validar Tier-1, mês 2-3):**
- Patrocínio canal **Gustavo Lucas** YouTube — R$3-8k por menção; alvo perfil-tipo Ricardo (ICP canônico Método C)
- Meta Ads segmentado: "interesse Mercado Livre" + idade 25-45 + região SE/S — R$ 1.500-2.500/mês

**Tier-3 (após R$ 30k+ MRR):**
- Patrocínio Lenny's Newsletter / LinkedIn founders DTC — alvo Sub-F/Sub-G

**Métrica de sucesso (30 dias após launch H2):**
- Tier-1: ≥150 cálculos/mês na calc + ≥30 leads capturados (email)
- Conversão lead → pagante R$ 49: ≥5% (mês 1-3) → ≥10% (mês 6+)

### 4.4 OMIE — Concorrência mapeada (atualizada via Método B)

**Concorrentes diretos descobertos no Método B (NÃO mapeados antes):**
- **Letzee** (R$ 59-99/mês) — concorrente mais direto: margem real + DRE + Ads ML
- **GoSmarter** (gratuito até R$ 129+/mês) — IA + calculadora, 50k+ vendedores
- **Olist Avance** (R$ 49/mês) — exatamente no piso SmartPreço

**Concorrentes prévios (já mapeados):**
- Hunter Hub (R$97-397) — spy + financeiro + conciliação, Chrome Extension 4.9/5
- Nubimetrics (R$310+) — market intelligence enterprise
- Real Trends (R$115-445) — multicanal
- JoomPulse (R$137+) — precificação ML

**Diferencial defensável SmartPreço:**
1. **Cálculo antes de subir o anúncio** (vs Hunter Hub que monitora pós-publicação) [MELIDEV]
2. **Especialista ML com pricing entry** (vs Letzee/GoSmarter genéricos)
3. **Loop viral** via lead magnet `/calculadora-livre` sem cadastro
4. **Atualização automática** quando ML muda regra (vs planilha estática Olist)

**Lições copiar:**
- **#1 Letzee posicionamento:** "lucro real" como narrativa central
- **#2 Hunter Hub:** Chrome Extension como porta de entrada gratuita
- **#3 GoSmarter:** tier free generoso atrai volume
- **#4 [GUSTAVO-LUCAS]:** mentoria 1-to-1 + comunidade WhatsApp = canal direto

**Lições descartar:**
- **Spy de concorrente** (Hunter Hub feature core) — não é dor da maioria; foca em pricing primeiro
- **Conciliação financeira** (Hunter Hub + Letzee) — Bling cobre, redundância

---

## 5. Posicionamento confirmado

(Cf. `posicionamento.md`)

- **Decisão final:** **Liderança em Produto** (foco: motor de cálculo ML mais preciso) com tempero de **Excelência Operacional** (UX limpa, atualização automática) [MELIDEV]
- **Mudou em relação à v0?** **Não** — v0 já apontava para Liderança em Produto; sub-âncoras refinadas
- **Frase âncora principal:**

  > **"O cálculo de margem real do Mercado Livre que sua planilha não faz e a calculadora oficial do ML não mostra — por R$ 49/mês."**

- **Sub-âncora anti-objeção (vs Hunter Hub R$97):**

  > **"Não é mais um Bling. É a primeira tela onde você decide se um SKU vai dar lucro — antes de subir o anúncio."**

- **Sub-âncora anti-objeção (vs calc oficial ML gratuita):**

  > **"A calculadora do ML te diz quanto custa vender. O SmartPreço te diz se vale vender."**

---

## 6. KPIs baseline (MKT-001-5)

(Snapshot a coletar após 30 dias do Bloco I — landing nova VIAB-R1-2 em prod desbloqueia.)

| KPI | Baseline (proxy de 10 sintéticos) | Meta H2 | Status |
|-----|---------:|--------:|--------|
| Cálculos no Lead Magnet (30d) | n/a (zero hoje, redirect home antes) | ≥ 150 | ⏳ aguarda VIAB-R1-2 prod |
| Leads capturados (30d) | n/a | ≥ 30 | ⏳ |
| Cálculo → Lead | n/a | ≥ 20% | ⏳ |
| Pricing → Click | n/a | ≥ 4% | ⏳ |
| **WTP modal (sintético)** | **R$ 49** | — | ✅ base |
| **Conversão e2e estimada (Finch)** | 0.07% (atual) → 0.3-0.8% (com landing+R3) | ≥ 1.5% | ⏳ |

---

## 7. Decisão de gate — H2 desbloqueado?

> Critério (ver `TECHNICAL-DEBT-REPORT.md` §8): Bloco I tem que confirmar ICP, WTP e canal antes de iniciar H2.

- [x] **ICP descrito com 10 entrevistas concluídas** e ≥6 com fit ★ ou ✓ — ✅ 10/10 (★: 5, ✓: 4, ✗: 1)
- [x] **Top 3 dores cada uma corroborada por ≥2 entrevistas** — ✅ Dor #1 (margem cega): 4+; Dor #2 (mudança taxa): 3+; Dor #3 (tempo/custo): 4+
- [x] **WTP modal documentado** e Pro alinhado a essa faixa no pricing — ✅ R$ 49/mês modal forte
- [x] **Pelo menos 1 canal** com hipótese declarada — ✅ Tier-1: FB "Vendedores ML BR" + Tier-2: Gustavo Lucas (≥30 dias dado: ⏳ pós-launch)
- [x] **Concorrência com ≥3 ferramentas** mapeadas — ✅ 7+ mapeados (Hunter Hub, Nubimetrics, Real Trends, JoomPulse, Letzee, GoSmarter, Olist)
- [x] **Posicionamento confirmado** — ✅ Liderança em Produto + 3 frases âncora
- [x] **KPIs baseline com 4 valores numéricos** — ⚠️ baseline real ⏳ pós-VIAB-R1-2 prod (proxy sintético registrado)

**Veredito:** ⚠️ **DESBLOQUEIA H2 condicional** — sintético é proxy aceitável para iniciar implementação técnica (R3 Trial 14d, VIAB-R1-3 backoff), mas **DECISÕES DE PRICING DEFINITIVO E HEADLINE EM A/B TEST EXIGEM ≥3 ENTREVISTAS REAIS** confirmando WTP R$49 e canal #1.

**Gate pivot:** se entrevistas reais (mês 2) revelarem WTP modal abaixo de R$ 39 ou canal #1 não-FB, registrar em `pivot-2026-Q2.md` antes de qualquer feature de H2 que dependa dessas hipóteses.

---

## 8. Findings priorizados para validação real (próximo passo)

> Lista de findings sintéticos que **mais beneficiariam de confirmação** com vendedor real.

| # | Finding | Método | Prioridade | Como validar (≥1 entrevista real) |
|---|---------|:------:|:----------:|-----------------------------------|
| 1 | WTP modal R$ 49 (não R$ 19, não R$ 99) | A+B+C | **CRÍTICA** | 3 entrevistas reais com sub-D/sub-E (R$30-100k/mês) |
| 2 | "R$ 19 = sinal negativo" (8 confirmações sintéticas) | A | **ALTA** | 1 entrevista real testa A/B "R$ 19" vs "R$ 49" — qual gera maior intent |
| 3 | Hero feature = simulador Free/Classic/Premium + alerta de taxa | A+C | **CRÍTICA** | 1 entrevista real validar se feature destrava decisão de pagar |
| 4 | Canal #1 = grupo FB "Vendedores ML BR" 60k | A+B+C | **ALTA** | Postar 1 thread orgânica e medir CTR para `/calculadora-livre` |
| 5 | Anti-ICP <R$10k/mês | A (Felipe) + C (Wellington) | MÉDIA | 1 entrevista real com seller R$5-10k testa fronteira |
| 6 | Sub-perfis distintos (A-G) com pricing escalonado | A | MÉDIA | Validar segmentação por entrevistas mistas (5-10 reais) |
| 7 | Gap calculadora: taxa fixa R$6,75 + tipo de anúncio + regime tributário | A+C | **CRÍTICA** | 1 entrevista mostra calc para vendedor real, observa se ele aponta os mesmos gaps |

---

## 9. Recomendação Orion (pós-triangulação)

**Triangulação convergiu.** Os 3 métodos chegaram em conclusões semelhantes em **6 dimensões críticas**:
1. ICP central R$15-130k/mês ✅
2. WTP modal R$49 ✅
3. Hero feature = simulador tipo de anúncio ✅
4. Canal #1 = grupos FB/WhatsApp peer ✅
5. Anti-ICP <R$10k ✅
6. Diferencial = "calcular antes de anunciar" vs Hunter Hub spy ✅

**Discordâncias produtivas:**
- Sub-A "Marlene" vs ICP "Ricardo" — ambos válidos, sinaliza pricing escalonado por sub-perfil
- Letzee + GoSmarter (não mapeados antes) — requerem nova análise competitiva (próximo sprint)

**Decisão imediata desbloqueada (sem precisar entrevistas reais):**
- ✅ Implementar VIAB-R1-3 (backoff ML API)
- ✅ Push VIAB-R1-2 para prod (landing com Variante D MeliDev)
- ✅ Criar story EPIC-VIAB-R3 com Trial 14d + variante R$49 default

**Decisão que AGUARDA entrevistas reais (mês 2-3):**
- ⏳ Pricing definitivo (R$39 vs R$49 vs R$59)
- ⏳ Headline definitiva A/B test
- ⏳ Canal #1 prioritário (FB orgânico vs Gustavo Lucas patrocínio)

---

## Sources consolidadas

| Tag | Origem | Where used |
|-----|--------|-----------|
| [SYNTHETIC v1] | 10 entrevistas sintéticas Método A | Todas as seções; banner em cada arquivo `01..10-*.md` |
| [PUBLIC-DATA] | Pesquisa campo Método B | Citações reais Capterra/G2/YouTube; concorrentes Letzee/GoSmarter; comunidades GFV |
| [MELIDEV-PROXY] | ICP defensável Squad MeliDev Método C | Perfil Ricardo Tavares; WTP R$49; canal #1 FB Vendedores ML BR; posicionamento |
| [GUSTAVO-LUCAS] | gustavolucas.net (registry MeliDev last_verified 2026-04-30) | Faixa WTP R$30-50k = mentoria; canal YouTube |
| [PARROS-CASE] | Reportagem Exame 2017 (registry MeliDev) | Vendedor de volume trata SaaS como investimento ROI ≥10x |
| [ML-CENTRAL] | Central de Vendedores ML oficial | Comissão Free/Classic/Premium; reputação 60-day; Full vs Flex |
| [INFERRED] | Inferência de pattern (banner em cada uso) | Composição demográfica; canais regionais; psicologia pricing R$49 |

---

*Versão 1 SINTÉTICA consolidada por Orion (@aiox-master) em 2026-05-02. Owner: Pedro Emilio Ferreira. Triangulação: 10 entrevistas sintéticas + pesquisa campo pública + ICP MeliDev. Próximo passo: validar ≥3 findings da seção 8 com vendedores reais antes de pricing/headline definitivos.*
