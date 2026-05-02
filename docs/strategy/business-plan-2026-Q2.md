# Business Plan executivo — SmartPreço (2026-Q2)

> ⚠️ **[v1 — strategist-swot-canvas]** Plano executivo gerado em 2026-05-02 com base em
> SWOT-2026-05-02.md + business-canvas-v1-2026-05-02.md + 6 inputs documentais. **Confirmar
> em campo:** projeções financeiras estão em ranges defensáveis ancorados em ICP-validation
> v1 sintética + benchmark mundial v2 — não substituem entrevistas reais nem KPIs de 30 dias
> pós-launch. Pricing definitivo + headline A/B aguardam ≥3 entrevistas reais com vendedor ML.
>
> Frameworks: **TAM/SAM/SOM** (mercado), **3 horizons** GTM (McKinsey-style), **Risk Matrix**
> 3x3, **CAC/LTV/Churn** ranges (não números únicos).

**Owner:** Pedro Emilio Ferreira · **Strategist:** strategist-swot-canvas (Libra ♎)
**Pré-requisitos:** SWOT v1 + Canvas v1 gerados · **Janela:** 12-24 meses antes de Pacvue/Helium 10 olhar para LATAM.

---

## Sumário executivo (3 frases)

**Problema:** vendedores Mercado Livre Brasil R$15-200k/mês perdem em média **R$760-2.300/mês** em margem invisível por não diferenciarem tipo de anúncio (Free/Classic/Premium) e custos ocultos (taxa fixa abaixo R$79, Full, regime tributário) — calculadora oficial ML mostra "quanto custa", não "se vale". [SOURCE: docs/business/ICP-validation-2026-Q2.md §2.1 Dor #1]

**Solução:** SmartPreço é o **único SaaS pago dedicado a calcular margem real ML BR ANTES de anunciar** (vs Letzee/Hunter Hub que monitoram pós-publicação), com pricing entry mais agressivo do mercado pago (~$8 USD vs Letzee $12 vs Hunter Hub $19), atualização automática quando ML muda regras, e lead magnet `/calculadora-livre` SEM cadastro como loop viral. [SOURCE: docs/reviews/world-benchmark-2026-05-01/01-benchmark-mundial.md §3.1 + §3.3]

**Oportunidade:** janela competitiva de 12-24 meses antes de Helium 10/Pacvue ($1B valuation, $20B+ ad spend gerenciado) entrar em LATAM, com WTP modal R$49/mês confirmado (consenso 3 métodos triangulação) e canal #1 orgânico identificado (FB "Vendedores ML BR" 60k+ membros, custo R$0). [SOURCE: docs/business/ICP-validation-2026-Q2.md §3 + §4.3; benchmark §3.4 Risco 1]

---

## 1. Mercado (TAM / SAM / SOM em ranges defensáveis)

### TAM — Total Addressable Market

**Definição:** todos os vendedores ativos no Mercado Livre Brasil (PJ + MEI) que precificam SKUs.

| Estimativa | Faixa | Fonte / Justificativa |
|-----------|------:|----------------------|
| Vendedores ativos ML Brasil 2025-2026 | **800k - 1.2M** | [INFERRED] ML reporta 1M+ sellers ativos LATAM; BR é ~70% [SOURCE: ML Investor Day pública; docs/reviews/world-benchmark-2026-05-01/01-benchmark-mundial.md §3.4 "ML crescendo 37% YoY"] |
| ARR potencial @ R$ 49/mês × 12 | **R$ 470M - R$ 706M** | TAM × ticket modal validado |

### SAM — Serviceable Addressable Market

**Definição:** vendedores ML BR R$10-200k/mês com 35-350 SKUs (ICP central) — **descarta** anti-ICP (<R$10k/mês com <20 SKUs e iniciantes <8m).

| Estimativa | Faixa | Fonte / Justificativa |
|-----------|------:|----------------------|
| Vendedores ICP-fit | **80k - 200k** | [INFERRED] 10-25% do TAM (proxy Sub-A → Sub-F na ICP-validation) [SOURCE: docs/business/ICP-validation-2026-Q2.md §1.1] |
| ARR potencial SAM @ R$49/mês | **R$ 47M - R$ 117M** | SAM × ticket modal |

### SOM — Serviceable Obtainable Market

**Definição:** 1-3% do SAM em 24 meses, condicional a ≥3 entrevistas reais validando + co-founder growth OU 20h+/sem founder.

| Cenário 24m | % SAM | Pagantes | MRR | ARR |
|-------------|------:|---------:|----:|----:|
| **Conservador** | 1% | 800-2.000 | R$ 39-98k | R$ 470-1.180k |
| **Base** | 2% | 1.600-4.000 | R$ 78-196k | R$ 940-2.350k |
| **Otimista** | 3% | 2.400-6.000 | R$ 118-294k | R$ 1.410-3.530k |

**Comparação realidade competitiva:**
- Letzee 500+ sellers ativos ~12-18m operação. [SOURCE: benchmark §1.11]
- Sellerboard chegou a 14k sellers em ~5 anos bootstrapped (referência mundial). [SOURCE: benchmark §1.3]
- SOM base 1.6-4k em 24m é **agressivo mas não absurdo** se canal #1 orgânico funcionar.

⚠️ **Risco hipótese SOM:** depende de canal Tier-1 (FB "Vendedores ML BR") converter ≥5% lead→pagante mês 1-3 → ≥10% mês 6+. Não validado em campo.

---

## 2. Produto

### Definição em 1 frase

**Calculadora de margem real Mercado Livre BR especializada — calcula ANTES de anunciar, atualiza automaticamente quando ML muda regras, e mostra simulador Free/Classic/Premium por SKU.**

### Ranges defensáveis (3 diferenciais — alinhados com SWOT S5)

1. **Calcular ANTES de anunciar** (vs Letzee/Hunter Hub que monitoram pós-publicação) — frase âncora *"A calculadora do ML te diz quanto custa vender. O SmartPreço te diz se vale vender."* [SOURCE: docs/business/posicionamento.md]

2. **Especialização pura em margem ML BR** — não tenta ser suite (vs GoSmarter Score IA + clonador + listing optimizer; vs Letzee DRE + ROAS + IA cliente). Cobre gaps validados: taxa fixa R$6,75 abaixo R$79, classificação Free/Classic/Premium por SKU, simulador "se mudar X margem vira Y". [SOURCE: docs/business/ICP-validation-2026-Q2.md §3]

3. **Atualização automática quando ML muda regras** (vs planilhas Olist estáticas; vs Letzee sem evidência pública) — resolve Dor #2 validada (R$200-1.200/mês perdidos em 1-3 semanas até notar). [SOURCE: docs/business/ICP-validation-2026-Q2.md §2.1 Dor #2]

### Estado atual (2026-05-02)

- ✅ Produção ativa em https://smartpreco.app (SSL emitido 2026-04-30 via PROD-001-14).
- 🟢 EPIC-VIAB-R1 InReview (4/4) — apply migration 012 + promote VIAB-R1-2 pendentes.
- 🟡 EPIC-VIAB-R3 Draft (3 stories) — Trial 14d + headline `/precos` + bloco concorrência.
- ⚠️ 4 P0 ativas em InReview: race condition OAuth (F2), home → dashboard (M6), ICP não validado (M1), scraping HTML (F3).

[SOURCE: docs/STATUS.md "Estado atual" + "4 Críticas P0 ativas"]

---

## 3. Estratégia GTM (3 horizons)

### Horizon 1 — 0-6 meses (validar canal Tier-1 + zerar P0)

**Objetivos:**
- Apply migration 012 + promote VIAB-R1-2 prod (próximas 24h).
- Plantar founder em FB "Vendedores ML BR" 60k → 4-6h/sem com lead magnet `/calculadora-livre`.
- Promover EPIC-VIAB-R3 (Trial 14d R$49 + headline /precos + bloco concorrência).
- ≥3 entrevistas ICP reais (mês 2-3).

**KPIs alvos H1 (mês 6):**
- Cálculos `/calculadora-livre`: **≥150-300/mês**
- Leads capturados: **≥30-60/mês**
- Conversão lead → pagante: **≥5%** (mês 1-3) → **≥10%** (mês 6)
- Pagantes acumulados: **30-80**
- MRR: **R$ 1.5-4k**
- Conversão e2e: 0.07% atual → **0.3-0.8%** (proxy benchmark Sellerboard early)

[SOURCE: docs/business/ICP-validation-2026-Q2.md §4.3 + §6; docs/reviews/painel-6-personas-2026-05-02/01-pontuacao-painel.md cenário "+ R3 Trial 14d"]

### Horizon 2 — 6-12 meses (escalar Tier-2 + co-founder growth)

**Objetivos:**
- Onboard co-founder de growth OU compromisso 20h+/sem do Pedro (Nardon: "volto em 6m se 20h+").
- Tier-2: Patrocínio Gustavo Lucas YouTube (R$ 3-8k/mês) + Meta Ads "interesse ML" 25-45 SE/S (R$ 1.5-2.5k/mês).
- Implementar feature de IA diferenciadora (Alan ação controversa) OU certificação App ML (precedente Letzee dez/2025).
- Aplicar Sebrae Spark Q3-2026 (precedente Letzee Spark+Start+Speed).

**KPIs alvos H2 (mês 12):**
- Pagantes: **200-500**
- MRR: **R$ 10-25k**
- CAC blended: **R$ 50-120**
- LTV: **R$ 600-1.500** (12-30m payback médio)
- LTV/CAC: **≥4:1** (target SaaS standard; Helium 10 reportado ~5:1 [INFERRED])
- Churn mensal: **6-10%** (target SaaS SMB; Sellerboard reporta <8% [INFERRED]) → meta 4-6%

[SOURCE: docs/reviews/painel-6-personas-2026-05-02/01-pontuacao-painel.md cenário "+ Co-founder growth = 7.0/10"; benchmark §1.3 Sellerboard]

### Horizon 3 — 12-24 meses (consolidar nicho + multicanal opcional)

**Objetivos:**
- Avaliar expansão Sub-F (multicanal ML+Shopify+Shopee) — mas só após 2k+ pagantes em ML puro (foco antes de escopo).
- Tier-3: Lenny's Newsletter / LinkedIn founders DTC após R$ 30k+ MRR.
- Avaliar Business tier (R$ 149-299) com feature "Replace Headcount" para Sub-E.
- Possível Series Seed quando ≥50 pagantes + 5 entrevistas ICP + 20h+/sem founder (gate Nardon).

**KPIs alvos H3 (mês 24):**
- Pagantes: **1.6k-4k** (SOM base 2% SAM)
- MRR: **R$ 78-196k** | ARR **R$ 940k-2.35M**
- LTV/CAC: **≥5:1**
- Churn mensal: **3-5%**
- Market share BR (12 ferramentas mapeadas): **3-8%**

[SOURCE: docs/business/ICP-validation-2026-Q2.md §1.1 Sub-F/G; benchmark §3.3 Gap 1]

---

## 4. Projeção financeira (ranges defensáveis, 24 meses)

> ⚠️ Ranges baseados em ICP-validation v1 sintética + benchmark mundial. **NÃO** projeção contábil — tese de tração para discussão estratégica/captação seed.

### MRR/ARR (3 cenários)

| Marco | Cenário Conservador | Cenário Base | Cenário Otimista |
|-------|--------------------:|-------------:|-----------------:|
| **Mês 3** (pós-R1+R3 prod) | R$ 500-1k MRR · 10-20 pagantes | R$ 1.5-2.5k · 30-50 | R$ 3-5k · 60-100 |
| **Mês 6** (canal Tier-1 maduro) | R$ 1.5-3k · 30-60 | R$ 4-8k · 80-160 | R$ 8-15k · 160-300 |
| **Mês 12** (Tier-2 + co-founder) | R$ 5-10k · 100-200 | R$ 12-20k · 240-400 | R$ 25-40k · 500-800 |
| **Mês 24** (consolidação) | R$ 25-50k · 500-1k | R$ **78-196k · 1.6-4k** | R$ 200-300k · 4k-6k |

Cenário base mês 24: **MRR R$ 78-196k → ARR R$ 940k-2.35M** (alinha SOM 2%).

### Unit economics

| KPI | Faixa H1 (mês 0-6) | Faixa H2 (mês 6-12) | Faixa H3 (mês 12-24) | Benchmark mundial |
|-----|:------------------:|:-------------------:|:--------------------:|:-----------------:|
| **Ticket médio** | R$ 39-49/mês | R$ 49/mês | R$ 49-59/mês (mix tiers) | Sellerboard $15-79 (~R$75-395) |
| **CAC blended** | R$ 0-30 (orgânico Tier-1) | R$ 50-120 (Tier-2 mix) | R$ 80-200 (Tier-2+3) | Helium 10 ~R$ 200 [INFERRED] |
| **LTV** | R$ 250-600 (15-25m churn 8%) | R$ 600-1.200 (25-40m, churn 6%) | R$ 1.200-2.500 (40-50m, churn 4%) | Sellerboard ~$1.5k [INFERRED] |
| **LTV/CAC** | ≥3:1 (target start) | **≥4:1** (saudável) | **≥5:1** (forte) | Standard SaaS ≥3:1 |
| **Churn mensal** | 8-12% (high early) | 6-8% | 3-5% | Sellerboard reportado <8% |
| **Payback** | 3-6m | 6-12m | 12-18m | <12m saudável SaaS |

[SOURCE: docs/reviews/world-benchmark-2026-05-01/01-benchmark-mundial.md §1.3 Sellerboard + §3.2 Lições; ICP-validation §3 WTP modal]

### Custo operacional (proxy 24m)

- **Fixo infra:** R$ 405-1.335/mês (Vercel + Supabase + Sentry + domínio) — escala devagar com tráfego.
- **Variável aquisição:** R$ 1.500-8.000/mês Tier-2 (Meta + influencer) + R$ 5-15k/menção Tier-3 pós-R$30k MRR.
- **People:** R$ 0 contábil hoje (founder solo) → R$ 8-15k/mês oportunidade. **Co-founder growth equity-only no H1**, salário H2.
- **Squad MeliDev:** R$ 0-500/mês manutenção.

[SOURCE: docs/strategy/business-canvas-v1-2026-05-02.md §9 Cost Structure]

### Break-even

- Custo fixo R$ 405-1.335/mês ÷ ticket R$49 = **8-27 pagantes para infra break-even** (sem contar tempo founder).
- Considerando custo oportunidade Pedro R$ 10k/mês: **200-220 pagantes** para break-even total.
- **Marco de "viabilidade financeira":** ≥220 pagantes = R$ ~10k MRR (cenário base mês 9-12).

---

## 5. Riscos top 5 + mitigação

> Top 5 destilado do painel 6 personas (3.85/10) + viability report + benchmark mundial. Cada risco com nota painel + ação de mitigação.

### Risco #1 — Founder solo 4-6h/semana é gargalo-mãe (W1 SWOT)
- **Severidade:** CRÍTICA
- **Painel:** 5/6 personas convergem (Alan, Pedro V, Raduan, Tallis, Nardon).
- **Quantificação:** sem 20h+/sem founder, conversão e2e fica em 0.07% (20-40x abaixo de Sellerboard); ad spend inviável (CAC:LTV 1:0.2-1:1.2).
- **Mitigação:**
  1. Onboard co-founder growth equity-only no H1 (target Q3-2026).
  2. Pedro 20h+/sem como gate hard para qualquer captação ou Tier-2 ad spend.
  3. Plano B: cap em 4-6h/sem com SOM conservador 1% e MRR R$5-10k/mês até mês 12.
- [SOURCE: docs/reviews/painel-6-personas-2026-05-02/01-pontuacao-painel.md Convergência #1]

### Risco #2 — Letzee captura narrativa "margem real ML" antes do SmartPreço escalar (T1 SWOT)
- **Severidade:** CRÍTICA
- **Quantificação:** Letzee R$59 entry + certificação App ML dez/2025 + Sebrae Spark+Start+Speed completo + 500+ sellers + Chrome Extension 5.0/5. Janela de 6-12 meses para SmartPreço diferenciar.
- **Mitigação:**
  1. Diferenciação narrativa "calcular ANTES de anunciar" (vs Letzee monitora pós) em headline `/precos` (VIAB-R3-2).
  2. Pricing entry agressivo R$39 (50% mais barato que Letzee) mantido até atingir 1k pagantes.
  3. Lead magnet `/calculadora-livre` SEM cadastro (Letzee exige login) como SEO trap.
  4. Buscar certificação App ML quando atingir critério mínimo (Q4-2026).
  5. Aplicar Sebrae Spark Q3-2026 (precedente Letzee).
- [SOURCE: docs/reviews/world-benchmark-2026-05-01/01-benchmark-mundial.md §1.11 + §3.4 Risco 3]

### Risco #3 — Mercado Livre lança/expande calculadora oficial (T2 SWOT)
- **Severidade:** CRÍTICA
- **Quantificação:** ML lançou calculadora oficial gratuita em 2026 — ameaça existencial à feature core do SmartPreço se aprofundar precisão.
- **Mitigação:**
  1. Diferenciar pela profundidade — cenários, simulação, comparativo Free/Classic/Premium, alerta proativo de mudança de taxa (gaps que calc oficial não cobre).
  2. Posicionar como "o que a calculadora ML NÃO mostra" (sub-âncora validada).
  3. Atualização automática como moat técnico (Risco #4 do benchmark mitigado por design).
  4. Lead magnet `/calculadora-livre` SEM cadastro como ângulo SEO defensável.
- [SOURCE: docs/reviews/viability-2026-04-30/01-meli-viability.md F3 + Top 5 fraquezas #4]

### Risco #4 — Helium 10/Pacvue ($1B valuation) entra em LATAM em 12-24m (T3 SWOT)
- **Severidade:** ALTA (futura)
- **Quantificação:** Pacvue gerencia $20B+ ad spend, cobre 13 marketplaces Amazon + Walmart + TikTok. ML crescendo 37% YoY torna entrada plausível mês 12-24.
- **Mitigação:**
  1. Construir comunidade + base de pagantes ANTES (target ≥1k pagantes mês 12).
  2. Defender com preço (SmartPreço $8 vs Helium 10 $99) + UX nativa ML (Helium 10 será generic-fit).
  3. Eliminar scraping HTML (R1-3.1) antes de 2027 — Pacvue exigirá robustez técnica de 1ª linha para escala.
  4. Possível conversa de aquisição se Pacvue entrar via M&A em vez de greenfield.
- [SOURCE: docs/reviews/world-benchmark-2026-05-01/01-benchmark-mundial.md §3.4 Risco 1]

### Risco #5 — Zero canal de aquisição validado em produção (W2 SWOT)
- **Severidade:** CRÍTICA imediata
- **Quantificação:** conversão e2e 0.07% (20-40x abaixo Sellerboard); painel 5/6 convergem (Pedro V, Finch, Raduan, Tallis, Nardon).
- **Mitigação:**
  1. Tier-1 FB "Vendedores ML BR" 60k orgânico — 30 dias para validar ≥150 cálculos + ≥30 leads + 5% conversão lead→pagante.
  2. Trial 14d híbrido (R3-1) — 4-6x MRR mês 1 [Alfredo M4].
  3. Sequência email day-1/3/7 nutrindo leads (4/6 personas convergem).
  4. Watermark de share na calculadora (Raduan ação controversa) — loop viral orgânico.
  5. **Gate hard:** se Tier-1 não converter em 60 dias, pivot canal antes de Tier-2 ad spend.
- [SOURCE: docs/reviews/painel-6-personas-2026-05-02/01-pontuacao-painel.md Convergência #2 + ações #3-4]

---

## 6. Pedido (capital? talento? parceria?)

### O que SmartPreço precisa nos próximos 12 meses

#### 1. **Talento** (PRIORIDADE ALTA)

- **Co-founder de growth** (equity-only Q3-2026, salário H2) — ou compromisso 20h+/sem do Pedro.
  - Perfil: experiência GTM SMB BR, comunidade-first, comfortable com 4-6h founder de produto.
  - Gate de captação seed (Nardon): "Volto em 6 meses se 5 entrevistas + 50 pagantes + 20h/sem founder."
- **Não precisa:** designer (Halo DS já entregue), ops (Squad MeliDev cobre), backend dev (stack maduro).

[SOURCE: docs/reviews/painel-6-personas-2026-05-02/01-pontuacao-painel.md Convergência #1; STATUS.md "EPIC-PROD-001 Done"]

#### 2. **Parceria estratégica** (PRIORIDADE MÉDIA-ALTA)

- **Sebrae aceleradora** Spark Q3-2026 — precedente Letzee Spark+Start+Speed (1ª startup a completar). Subsídio + brand + network.
- **Bling integração ERP** — 70%+ do mercado SMB ML, alta alavancagem destrava Sub-D/E.
- **Mercado Livre App Marketplace** (certificação) — Q4-2026 condicional a critério mínimo de uso (Letzee certificou em dez/2025).

[SOURCE: docs/strategy/business-canvas-v1-2026-05-02.md §8 Key Partnerships]

#### 3. **Capital** (PRIORIDADE MÉDIA — gate hard pós-validação)

- **NÃO seed agora** (Nardon: PASS hoje). Bootstrap até atingir gate.
- **Considerar seed R$ 500k-1.5M** (~$100-300k USD) quando atingir simultaneamente:
  - ≥50 pagantes
  - ≥5 entrevistas ICP reais
  - ≥20h/sem founder OU co-founder growth onboard
  - Tier-1 FB convertendo ≥5% lead→pagante
- **Uso projetado:** 60% growth (Tier-2 ad spend + co-founder salary), 30% produto (Sub-F multicanal opcional + R1-3.1 elimination scraping), 10% legal/compliance.

[SOURCE: docs/reviews/painel-6-personas-2026-05-02/01-pontuacao-painel.md Nardon "PASS no seed hoje"]

#### 4. **NÃO precisa** (anti-pedido)

- **Painéis adicionais multi-persona** (Tallis: "5 docs em 7 dias é fuga; mata o painel multi-agente").
- **Mídia paga Tier-2** antes de validar Tier-1 (CAC:LTV 1:0.2-1:1.2 atual = inviável).
- **Features fora do core de margem ML** (Raduan veto: "não amplia escopo sem aprofundar decisão de preço").
- **i18n / multicanal** antes de mês 12 (deferred no posicionamento).

[SOURCE: docs/reviews/painel-6-personas-2026-05-02/01-pontuacao-painel.md "Mensagem central Tallis"; docs/business/posicionamento.md "Anti-posicionamentos"]

---

## 7. Marcos críticos (priorização painel 6 personas)

### Próximas 24h
1. Apply migration 012 prod (race condition F2). [Pedro/devops]
2. Promote VIAB-R1-2 (landing pública). [Pedro]
3. Smoke 48h Sentry sem erros. [Pedro]

### Próxima semana (5 dias)
4. Plantar 1 post útil em FB "Vendedores ML BR" 60k. [Pedro]
5. Agendar 2-3 entrevistas ICP reais. [Pedro não delegável]

### Próximo mês
6. Promover EPIC-VIAB-R3 (Trial 14d + headline + concorrência). [@dev]
7. Eliminar scraping HTML (R1-3.1). [@dev]
8. Concluir 5 entrevistas ICP reais. [Pedro]

### Mês 3-6
9. Tier-1 maduro: ≥150 cálculos + ≥30 leads + 5% conversão.
10. Avaliar Sebrae Spark Q3-2026.
11. Decisão: co-founder growth ou Pedro 20h+/sem.

### Mês 12
12. ≥200-500 pagantes + R$ 10-25k MRR.
13. Aplicar certificação App Mercado Livre (precedente Letzee).
14. Gate Nardon: avaliar seed se ≥50 pagantes + 20h+/sem founder.

[SOURCE: docs/STATUS.md "Próximos passos imediatos"; docs/reviews/painel-6-personas-2026-05-02/01-pontuacao-painel.md Top 5 ações]

---

## 8. Mensagem central (Tallis condensa)

> **"SmartPreço escreveu mais sobre si mesmo nos últimos 30 dias do que vendeu. 5 docs de viabilidade/benchmark/pontuação em 7 dias é fuga. Janela de 12-24m antes do Pacvue não é tempo de planejamento — é tempo de queimar o telefone."**

Este Business Plan v1 é o **último deliverable de análise** antes de execução comercial. Próxima sessão deve ser **AÇÃO** (apply migration + promote landing + 1 post FB + 1 entrevista real), não relatório.

[SOURCE: docs/reviews/painel-6-personas-2026-05-02/01-pontuacao-painel.md "Mensagem central"]

---

## Próxima evolução (v2)

Este BP v1 evolui para **v2** quando:
1. ≥3 entrevistas reais validarem (ou refutarem) WTP R$49 + canal Tier-1 + hero feature.
2. 30 dias de KPIs reais pós-VIAB-R1-2 prod (cálculos, leads, conversão).
3. Marco de 50 pagantes + 20h+/sem founder atingido (gate Nardon).

Banner v2 substituirá "[v1 — strategist-swot-canvas]" por "[v2 — campo validado YYYY-MM-DD]" e cenários financeiros migrarão de ranges defensáveis para projeção operacional.

---

## Sources consolidadas

| Tag | Origem | Onde foi usada |
|-----|--------|----------------|
| `docs/STATUS.md` | Estado prod 2026-05-02 | §2 Produto, §7 Marcos |
| `docs/business/ICP-validation-2026-Q2.md` | ICP v1 sintética triangulação | §1 SAM/SOM, §2 Produto, §3 GTM, §4 Unit econ |
| `docs/business/concorrencia-2026-Q2.md` | OMIE concorrência 12 | §2 Produto diferenciais |
| `docs/business/posicionamento.md` | Liderança em Produto | §2 Produto, §6 Anti-pedido |
| `docs/reviews/world-benchmark-2026-05-01/01-benchmark-mundial.md` | Benchmark 12 concorrentes | §1 TAM, §4 Unit econ benchmark, §5 Risco #2/#3/#4 |
| `docs/reviews/viability-2026-04-30/01-meli-viability.md` | Viability 5+5/10 | §2 Produto P0, §5 Risco #3 |
| `docs/reviews/painel-6-personas-2026-05-02/01-pontuacao-painel.md` | Painel 3.85/10 | §3 GTM, §5 Riscos top 5, §6 Pedido (Nardon), §7 Marcos |
| `docs/strategy/SWOT-2026-05-02.md` | SWOT v1 | Cross-referência S/W/O/T |
| `docs/strategy/business-canvas-v1-2026-05-02.md` | Canvas v1 | §4 Custo, §6 Parcerias |
| `[INFERRED]` | Inferência de pattern com banner | TAM 800k-1.2M, LTV/CAC/Churn benchmark mundial |

---

🧭 *Strategy without data is fiction. Sources antes de quadrante. Canvas é hipótese — confirmar em campo via experimentos.*
*Strategist SWOT + Canvas — 2026-05-02. BP executivo Q2 concluído. Próximo passo: AÇÃO comercial, não mais relatório.*
