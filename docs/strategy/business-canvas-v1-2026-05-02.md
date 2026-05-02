# Business Model Canvas v1 — SmartPreço (2026-05-02)

> ⚠️ **[v1 — strategist-swot-canvas]** Canvas é hipótese — confirmar em campo via experimentos.
>
> Cada um dos 9 blocos Osterwalder está ancorado em ≥1 finding documental ([SOURCE:]) ou
> [INFERRED] com justificativa. **Nenhum bloco foi inventado.** Os blocos com maior risco de
> hipótese frágil (Customer Segments, Revenue Streams, Channels) estão marcados explicitamente.
>
> **Validação obrigatória:** ≥3 entrevistas reais com vendedores ML antes de comprometer
> capital ou tempo significativo em qualquer bloco crítico.
>
> Framework: **Business Model Canvas (Osterwalder, 2010)** — 9 blocos.

**Owner:** Pedro Emilio Ferreira · **Strategist:** strategist-swot-canvas (Libra ♎)
**Pré-requisito:** SWOT-2026-05-02.md gerado · **Próxima evolução:** v2 pós-entrevistas reais.

---

## Visão geral (1 página)

```
┌──────────────────┬──────────────────┬──────────────────┬──────────────────┬──────────────────┐
│  KEY PARTNERS    │ KEY ACTIVITIES   │  VALUE PROPS     │ CUSTOMER RELS    │ CUSTOMER SEGS    │
│ • Mercado Livre  │ • Dev produto    │ • Calc ANTES de  │ • Self-service   │ • Vendedor ML BR │
│   (App cert.)    │ • Content mkt    │   anunciar       │   PLG            │   R$15-200k/mês  │
│ • Bling (70%     │ • Comunidade     │ • Especialização │ • Lead magnet    │ • 35-350 SKUs    │
│   ERP SMB)       │ • Atualização    │   pura ML        │   nutrição       │ • Sub-A a Sub-G  │
│ • Sebrae         │   regras ML      │ • Atualização    │ • Comunidade     │   (7 sub-perfis) │
│ • Vercel/Supab   │                  │   automática     │   peer-to-peer   │                  │
│                  ├──────────────────┤                  ├──────────────────┤                  │
│                  │ KEY RESOURCES    │                  │ CHANNELS         │                  │
│                  │ • Squad MeliDev  │                  │ • Tier-1: FB ML  │                  │
│                  │ • Halo DS        │                  │   60k orgânico   │                  │
│                  │ • Stack Next/    │                  │ • Tier-2: G.Lucas│                  │
│                  │   Supabase       │                  │   Meta Ads       │                  │
│                  │ • Lead magnet    │                  │ • Tier-3: Lenny's│                  │
│                  │   /calc-livre    │                  │                  │                  │
├──────────────────┴──────────────────┴──────────────────┴──────────────────┴──────────────────┤
│                       COST STRUCTURE                       │              REVENUE STREAMS    │
│ • Vercel (~$20-100/mês) • Supabase (~$25/mês)              │ • R$39 entry / R$49 modal /     │
│ • Sentry (~$26/mês)     • Tempo founder 4-6h/sem [BOTTLE]  │   R$59 mid / R$149 agency       │
│ • Ad spend mínimo (R$1.5-2.5k/mês ICP-validation Tier-2)   │ • Trial 14d híbrido (R3-1)      │
│ • Squad MeliDev (one-time + manutenção)                    │ • [INFERRED] futuro: API/SLA    │
└────────────────────────────────────────────────────────────┴─────────────────────────────────┘
```

---

## 1. Customer Segments — para quem criamos valor?

**Hipótese central (★ alto):** vendedores Mercado Livre Brasil consolidados — R$15-200k/mês de faturamento ML, 35-350 SKUs ativos, 2-8 anos de operação, mix Classic+Premium, reputação verde claro a Mercado Líder Pleno.

### 7 sub-perfis identificados (Método A — 10 entrevistas sintéticas)

| Sub-perfil | Faturamento | Time | WTP modal | Hero feature destrava | Status validação |
|------------|:-----------:|------|:---------:|----------------------|:----------------:|
| **Sub-A: solo amador** (Marlene-RJ) | R$ 5-10k | sozinho | R$ 19 | "share WhatsApp" loop viral | ✓ sintético |
| **Sub-B: solo ambicioso** (Diego-PR) | R$ 10-15k | sozinho | R$ 49 | simulador Free/Classic/Premium | ✓ sintético |
| **Sub-C: solo profissional** (Patricia-GO) | R$ 14-22k | sozinha + 1 freela | R$ 19→49 | alerta de mudança de taxa | ✓ sintético |
| **Sub-D: sócio + small team** (Ricardo-SP) | R$ 35k | sócio + 1 CLT | R$ 49-149 | integração Bling + cenário | **★ ICP central** |
| **Sub-E: time formal** (Carlos-CE, Rodrigo-RS) | R$ 60-130k | esposa + 2-4 CLT | R$ 49-299 | "Replace Headcount" | ✓ sintético |
| **Sub-F: brand-driven multicanal** (Julia-SC) | R$ 80k | sócia + 2 PJ | R$ 49-149 | multicanal ML+Shopify+Shopee | ✓ sintético |
| **Sub-G: enterprise data-driven** (Bruno-SP) | R$ 180k | 6 CLT | R$ 499-999 | API + SLA + SSO | ⏳ fora MVP |

[SOURCE: docs/business/ICP-validation-2026-Q2.md §1.1 + §3]

### Anti-ICP (não atendemos)

- Vendedores **<R$10k/mês com <20 SKUs** (Sub-Anti) — competem com info-produto Hotmart pelo orçamento. [SOURCE: docs/business/ICP-validation-2026-Q2.md §1.2 — Felipe ✗]
- Iniciantes **<8 meses ML** sem CNPJ. [SOURCE: idem]
- Enterprise **>R$500k/mês** com time >10 (precisam de Ano-2 features API/SLA/SSO/RBAC). [SOURCE: idem]

### Header qualificador validado

> **"Para vendedores R$10k+/mês"** filtra anti-ICP do funil sem fricção. [SOURCE: docs/business/ICP-validation-2026-Q2.md §1.2]

**Risco hipótese:** Sub-A "Marlene" (Rony Meisler) vs Sub-D "Ricardo" (MeliDev) — duas tribos válidas, escolha de tribo dominante depende de entrevistas reais. [SOURCE: docs/reviews/viability-2026-04-30/01-meli-viability.md "Open Q #6 — Ricardo ou Marlene?"]

---

## 2. Value Propositions — que valor entregamos?

### 3 diferenciais defensáveis (alinhados com SWOT-2026-05-02 S5)

#### VP1 — "Calcular ANTES de anunciar"
- **Frase âncora:** *"A calculadora do ML te diz quanto custa vender. O SmartPreço te diz se vale vender."* [SOURCE: docs/business/posicionamento.md + docs/business/ICP-validation-2026-Q2.md §5]
- **Diferencial vs Letzee/Hunter Hub** (monitoram pós-publicação) — SmartPreço valida margem ANTES do seller subir o anúncio.
- [SOURCE: docs/business/concorrencia-2026-Q2.md §3 Diferencial #1]

#### VP2 — Especialização pura em margem ML BR
- **Frase âncora:** *"O cálculo de margem real do Mercado Livre que sua planilha não faz e a calculadora oficial do ML não mostra — por R$ 49/mês."* [SOURCE: docs/business/ICP-validation-2026-Q2.md §5]
- **Diferencial vs GoSmarter** (suite Score IA + clonador + remoção fundo) e **vs Letzee** (DRE + ROAS + IA cliente) — uma coisa só, feita bem.
- Cobre gaps validados: taxa fixa R$6,75 abaixo R$79, classificação Free/Classic/Premium por SKU, diferenciação por categoria ML real, simulador "se mudar X margem vira Y".
- [SOURCE: docs/business/ICP-validation-2026-Q2.md §3 "features mínimas que destravam WTP R$49"]

#### VP3 — Atualização automática quando ML muda regras
- Tabela de comissões centralizada — quando ML muda (cosméticos 17,5%→19%), atualiza para todos os usuários.
- Resolve **Dor #2** validada (Patrícia 1 semana, Julia 3 semanas até notar mudança de taxa = R$200-1.200/mês perdidos).
- Diferencial vs planilhas estáticas Olist/Excel + vs Letzee (sem evidência pública).
- [SOURCE: docs/business/ICP-validation-2026-Q2.md §2.1 Dor #2; docs/business/concorrencia-2026-Q2.md §3 Diferencial #3]

### Sub-âncoras anti-objeção

- **vs Hunter Hub R$97:** *"Não é mais um Bling. É a primeira tela onde você decide se um SKU vai dar lucro — antes de subir o anúncio."* [SOURCE: docs/business/ICP-validation-2026-Q2.md §5]
- **vs calc oficial ML gratuita:** *"A calculadora do ML te diz quanto custa vender. O SmartPreço te diz se vale vender."* [idem]

---

## 3. Channels — como entregamos a proposta de valor?

### Canal #1 confirmado pela tripla triangulação

**Comunidades FB/WhatsApp/Telegram peer-to-peer** — 7/10 entrevistas sintéticas mencionam grupo específico como canal principal de descoberta de ferramentas. [SOURCE: docs/business/ICP-validation-2026-Q2.md §4.1]

### Estrutura Tier-1/2/3 (ICP-validation §4.3)

| Tier | Canal | Custo | Velocidade | Status | Métrica 30d |
|:----:|-------|-------|:----------:|:------:|-------------|
| **Tier-1** | FB "Vendedores do ML BR" (60k membros) — 4-6h/sem founder + lead magnet `/calculadora-livre` | R$ 0 | médio | ⏳ aguarda VIAB-R1-2 prod | ≥150 cálculos + ≥30 leads + 5% conv lead→pago |
| **Tier-2** | Patrocínio Gustavo Lucas (YouTube) + Meta Ads "interesse Mercado Livre" 25-45 SE/S | R$ 1.500-8.000/mês | rápido | 📋 mês 2-3 pós-validação Tier-1 | CAC ≤ R$ 80 (target Sub-D) |
| **Tier-3** | Lenny's Newsletter / LinkedIn founders DTC (Sub-F/Sub-G) | R$ 5-15k/menção | médio | 📋 após R$ 30k+ MRR | CAC ≤ R$ 200 (target Sub-F+) |

### 14+ comunidades nominalmente identificadas (mapa completo)

- **Multi-segmento:** "Vendedores ML BR" FB ~60k (★ #1), "Mercado Livre — Dicas" FB ~35k, GFV multi-plataforma desde 2017, Comunidade JoomPulse WhatsApp.
- **Verticais:** Sellers Brinquedo BR (~80, Carlos), Suplementos ML BR Telegram (~400, Diego), Importadores ML Telegram (~140, Vanessa), Encontro Autopeças do Sul (~85, Rodrigo).
- **Regionais:** Vendedoras ML RJ WhatsApp (~80, Marlene), Vendedores RJ MEI (~180), Mulheres Empreendedoras ML BR FB (~2k, Patricia), Sellers Mulheres ML (~50, Vanessa).
- **Curados:** Sellers ML Avançado SP (~80, Ricardo), DTC Brasil WhatsApp (~120, Julia), Slack DTC Brasil (~340, Bruno).

[SOURCE: docs/business/ICP-validation-2026-Q2.md §4.2; docs/business/concorrencia-2026-Q2.md §1]

### Canal complementar — Lead magnet `/calculadora-livre`

- SEM cadastro, com loop viral via "Compartilhar resultado WhatsApp" (R3-2 backlog).
- SEO trap para "calculadora mercado livre grátis" (concorre com GoSmarter free).
- [SOURCE: docs/business/concorrencia-2026-Q2.md §3 Diferencial #4; docs/reviews/world-benchmark-2026-05-01/01-benchmark-mundial.md §3.4 Risco 4]

---

## 4. Customer Relationships — como nos relacionamos?

### Modelo dominante: **Self-service + Product-Led Growth (PLG)**

Founder solo com 4-6h/semana **NÃO comporta** customer success dedicado nem SDR. Modelo de relacionamento é estruturalmente PLG. [SOURCE: docs/reviews/viability-2026-04-30/01-meli-viability.md M8b "founder solo 4-6h/sem"]

### 4 modos de relacionamento por estágio do funil

1. **Anônimo (top of funnel)** — `/calculadora-livre` SEM login, conversão emocional via Loss Aversion ("Você está perdendo R$847/mês"). [SOURCE: docs/reviews/viability-2026-04-30/01-meli-viability.md M5 ratio 12.6:1; M6]

2. **Lead capturado (mid-funnel)** — sequência email day-1/3/7 nutrindo via casos reais ("Maria Santos: antes 15% margem, real era 6%"). [SOURCE: docs/reviews/painel-6-personas-2026-05-02/01-pontuacao-painel.md ação #4 "sequência email day-1/3/7"]

3. **Trial 14d (decision)** — Pro completo + fallback Free 1 SKU após expirar (variante D MeliDev). [SOURCE: docs/reviews/viability-2026-04-30/01-meli-viability.md R3 + M4]

4. **Pagante (retain)** — comunidade peer-to-peer (não atendimento 1:1) + alertas proativos de mudança de taxa ML por categoria como ritual de uso. [SOURCE: docs/business/ICP-validation-2026-Q2.md §2.1 Dor #2 hero feature]

### Anti-modelo (Raduan veto)

- **NÃO** consultoria 1:1 (GoSmarter R$ 500-15k/mês mistura SaaS+serviço, dilui posicionamento). [SOURCE: docs/business/concorrencia-2026-Q2.md §4 "Anti-lições"]
- **NÃO** Intimidade com Cliente como disciplina dominante no MVP (Raduan + Treacy & Wiersema). [SOURCE: docs/business/posicionamento.md "Anti-posicionamentos"]

---

## 5. Revenue Streams — como capturamos valor?

### Pricing tier (variantes A/B/C/D em teste)

| Tier | Preço | WTP confirmado | Sub-perfil-alvo | Hero feature | Status |
|------|:-----:|:--------------:|-----------------|--------------|:------:|
| **Free / Lead magnet** | R$ 0 | n/a | Sub-A + anti-ICP | `/calculadora-livre` SEM login | ✅ ativo |
| **Entry (variante A)** | R$ 39/mês | "tá no limite" (Felipe) | Sub-A/B | calc 1 SKU + dashboard básico | ✅ ativo |
| **Modal (variante B/D)** | **R$ 49/mês** | **★ MODAL 7/10 entrevistas** | Sub-B/C/D | simulador Free/Classic/Premium + alerta taxa | 🟢 Trial 14d em VIAB-R3-1 Draft |
| **Mid (variante C)** | R$ 59/mês | aceito com integração Bling | Sub-D/E | + integração Bling + cenários | ⏳ pós-validação real |
| **Business** | R$ 149-299/mês | "Replace Headcount" (Rodrigo) | Sub-E/F | multicanal + regra margem mínima | ⏳ Q3-2026 |
| **Enterprise** | R$ 499-999/mês | aceito com 7 condições (Bruno) | Sub-G | API + SLA + SSO + RBAC | ⏳ Ano-2 (fora MVP) |

[SOURCE: docs/business/ICP-validation-2026-Q2.md §3 + §1.1 sub-perfis]

### Modelo de cobrança

- **Trial 14 dias** do Pro completo + fallback Free 1 SKU após expirar (variante D MeliDev — ratificada como hero do A/B test). [SOURCE: docs/reviews/viability-2026-04-30/01-meli-viability.md R3 + M4 "modelo híbrido pode 4-6x MRR mês 1"]
- **Mensal recorrente** + desconto anual (não confirmado em v1; padrão SaaS).

### Sinais críticos de pricing

- **R$ 19 = sinal negativo** — 8 confirmações sintéticas de "ferramenta séria não cobra R$19". [SOURCE: docs/business/ICP-validation-2026-Q2.md §3 "Reação ★"]
- **R$ 49 acima do piso de seriedade R$ 29 + abaixo do piso psicológico R$ 50** — janela perfeita validada por Método B (Letzee R$59, Olist R$49) e Método C (MeliDev). [SOURCE: docs/business/ICP-validation-2026-Q2.md §3]

### Risco hipótese pricing

⚠️ Pricing definitivo R$39 vs R$49 vs R$59 **AGUARDA ≥3 entrevistas reais** — gate pivot documentado em ICP-validation §7. [SOURCE: idem §7 "Veredito"]

---

## 6. Key Resources — quais recursos nossa proposta exige?

### 6 recursos operacionais validados

| # | Recurso | Tipo | Status | [SOURCE:] |
|:-:|---------|------|:------:|-----------|
| 1 | **Squad MeliDev** (4 specialists ML BR — chief + integration + strategist + ops) | Intelectual | ✅ ativo | docs/STATUS.md "squad importada"; docs/reviews/viability-2026-04-30/01-meli-viability.md Top 5 fortalezas #4 |
| 2 | **Halo Design System** | Intelectual | ✅ ativo | docs/STATUS.md "EPIC-PROD-001 Done" |
| 3 | **Stack Next.js 16 + Supabase** (CI maduro, SSL emitido) | Físico/digital | ✅ prod desde 30/04 | docs/STATUS.md "produção ativa https://smartpreco.app"; docs/reviews/painel-6-personas-2026-05-02/01-pontuacao-painel.md "stack/CI campeonato mundial" |
| 4 | **Lead magnet `/calculadora-livre`** (SEM cadastro + loop viral) | Intelectual | 🟡 implementado, pendente prod | docs/business/concorrencia-2026-Q2.md §3 Diferencial #4 |
| 5 | **Pedro Emilio (founder)** 4-6h/sem | Humano | ⚠️ gargalo W1 | docs/reviews/painel-6-personas-2026-05-02/01-pontuacao-painel.md Convergência #1 |
| 6 | **Tabela de comissões ML centralizada** | Intelectual | ⏳ a evoluir (R1-3.1) | docs/business/concorrencia-2026-Q2.md §3 Diferencial #3 |

### Recurso ausente crítico

⚠️ **Co-founder de growth ou Pedro 20h+/sem** — Nardon: "PASS no seed; volto em 6 meses se 20h+/sem founder". [SOURCE: docs/reviews/painel-6-personas-2026-05-02/01-pontuacao-painel.md cenário "+ Co-founder growth = 7.0/10"]

---

## 7. Key Activities — quais atividades a proposta exige?

### 4 atividades principais

#### KA1 — Desenvolvimento de produto (manutenção + features)
- Sprints atuais: EPIC-VIAB-R1 InReview (4/4) + EPIC-VIAB-R3 Draft (3 stories).
- Próximas: VIAB-R3-1 Trial 14d, R3-2 headline `/precos`, R1-3.1 eliminação scraping HTML.
- Owner: Pedro Emilio + agentes @dev/@qa/@architect.
- [SOURCE: docs/STATUS.md "Epics ativos"]

#### KA2 — Content marketing + comunidade peer-to-peer
- Tier-1: Pedro 4-6h/sem em FB "Vendedores ML BR" 60k respondendo dúvidas reais com link calc.
- Loss Aversion como gatilho: "Quanto você está perdendo em cada venda?".
- [SOURCE: docs/business/ICP-validation-2026-Q2.md §4.3 Tier-1; docs/reviews/painel-6-personas-2026-05-02/01-pontuacao-painel.md ação #3]

#### KA3 — Atualização de regras ML (moat técnico)
- Monitorar mudanças de taxa por categoria ML; atualizar tabela centralizada; alertar usuários por email/in-app.
- Frequência: ML muda taxas ~1-3x/ano por categoria sem aviso amplo. [SOURCE: docs/business/ICP-validation-2026-Q2.md §2.1 Dor #2]
- Resolve diretamente Dor #2 validada (Patrícia/Julia).

#### KA4 — Validação contínua de ICP (entrevistas + KPIs)
- Próximo gate: ≥3 entrevistas reais (mês 2-3) para destravar pricing definitivo + headline A/B.
- Após VIAB-R1-2 em prod: 30 dias de KPIs (cálculos, leads, conversão lead→pago).
- [SOURCE: docs/business/ICP-validation-2026-Q2.md §6 + §8]

---

## 8. Key Partnerships — com quem aliamos?

### 5 parcerias estratégicas (mix existentes + hipóteses)

| # | Parceiro | Tipo | Status | Justificativa |
|:-:|----------|------|:------:|---------------|
| 1 | **Mercado Livre — App Marketplace** (certificação) | Estratégica | ⏳ hipótese mês 12-24 | Letzee certificou em dez/2025; precedente claro [SOURCE: docs/reviews/world-benchmark-2026-05-01/01-benchmark-mundial.md §1.11] |
| 2 | **Bling** (integração ERP) | Operacional | ⏳ hipótese | 70%+ do mercado SMB ML; alta alavancagem destrava Sub-D/E [SOURCE: docs/business/ICP-validation-2026-Q2.md §1.1 + §4.1] |
| 3 | **Sebrae** (aceleradora Spark+Start+Speed) | Capital + brand | ⏳ hipótese Q3-2026 | Letzee é precedente; mesmo programa mesmo perfil [SOURCE: docs/reviews/world-benchmark-2026-05-01/01-benchmark-mundial.md §1.11] |
| 4 | **Vercel + Supabase** (infra) | Operacional | ✅ ativo | Stack atual produção [SOURCE: docs/STATUS.md] |
| 5 | **Influenciadores ML BR** (Gustavo Lucas, Tiago Tessmann) | Distribuição | ⏳ Tier-2 mês 2-3 | Audiência R$30-50k confirmada como ICP central [SOURCE: docs/business/ICP-validation-2026-Q2.md §4.3 Tier-2; squad MeliDev [GUSTAVO-LUCAS]] |

### Anti-parceria

- **NÃO** white-label de SaaS pricing genérico (dilui especialização ML, viola posicionamento Liderança em Produto). [SOURCE: docs/business/posicionamento.md "Anti-posicionamentos"]

---

## 9. Cost Structure — quais são os custos?

### Custos fixos mensais estimados (proxy v1)

| Categoria | Faixa estimada | [SOURCE] / Justificativa |
|-----------|---------------:|--------------------------|
| **Vercel (hosting + analytics + image opt)** | R$ 100-500/mês | [INFERRED] tier hobby→pro escalando com tráfego; consistente com produção ativa em STATUS.md |
| **Supabase (DB + Auth + Edge Functions)** | R$ 125/mês | [INFERRED — $25/mês plano Pro] confirmado pela presença do projeto `jvdfcode` em STATUS.md |
| **Sentry (observability)** | R$ 130/mês | [INFERRED — $26/mês plano Team] consistente com instrumentação Finch 6.5/10 |
| **Domínio + SSL** | R$ 50-80/mês | [INFERRED — smartpreco.app] |
| **Tempo founder (custo oportunidade)** | R$ 0 contábil / **R$ 8-15k/mês oportunidade** | [INFERRED] 4-6h/sem × valor founder; gargalo W1 do SWOT |
| **Squad MeliDev (manutenção)** | R$ 0-500/mês | [INFERRED] custo zero estrutural; manutenção ocasional de fontes ML |
| **Subtotal infra fixa** | **R$ 405-1.335/mês** | |

### Custos variáveis (em ranges)

| Categoria | Faixa | Justificativa |
|-----------|------:|---------------|
| **Ad spend Tier-2** (Meta Ads + influencer Gustavo Lucas) | R$ 1.500-8.000/mês | [SOURCE: docs/business/ICP-validation-2026-Q2.md §4.3 Tier-2] — começa após validação Tier-1 |
| **Sebrae aceleração** (se aprovado) | R$ 0 (subsidiado) | [SOURCE: precedente Letzee §1.11 benchmark] |
| **Tier-3 Lenny's / DTC** | R$ 5-15k/menção | [INFERRED] após R$ 30k+ MRR conforme §4.3 ICP-validation |

### Estrutura de custos: **value-driven** (Osterwalder)

- Não é cost-driven (não competimos em low-cost de infra commoditizada).
- É **value-driven com infraestrutura enxuta** — Vercel/Supabase são commodities e o ativo é Squad MeliDev + atualização ML + lead magnet.
- [SOURCE: docs/business/posicionamento.md "Liderança em Produto"; docs/reviews/world-benchmark-2026-05-01/01-benchmark-mundial.md "Sellerboard bootstrapped + nicho"]

### Bottleneck explícito

⚠️ **Tempo founder é o custo "invisível"** mais caro — 4-6h/sem é o gargalo-mãe (W1 do SWOT). Resolução requer co-founder de growth OU compromisso 20h+/sem do Pedro. [SOURCE: docs/reviews/painel-6-personas-2026-05-02/01-pontuacao-painel.md Convergência #1]

---

## Validação — quais blocos têm hipótese mais frágil?

| Bloco | Risco hipótese | Como validar |
|-------|----------------|--------------|
| **1. Customer Segments** | Sub-A "Marlene" vs Sub-D "Ricardo" como tribo dominante | ≥3 entrevistas reais (R2 ICP) |
| **3. Channels** | Tier-1 FB orgânico realmente converte ≥5% lead→pago? | 30 dias pós-VIAB-R1-2 prod |
| **5. Revenue Streams** | R$39 vs R$49 vs R$59 — qual maximiza ARR? | A/B test variantes B/C/D + 100 conversões |
| **8. Key Partnerships** | Sebrae aprovaria? ML certificaria? | Submeter aplicação Q3-2026 |

**Banner v1 reforçado:** Canvas é hipótese — confirmar em campo via experimentos antes de comprometer capital ou tempo significativo.

---

## Próxima evolução (v2)

Esta Canvas v1 evolui para **v2** quando:
1. ≥3 entrevistas reais validarem (ou refutarem) Customer Segments + Revenue Streams + Channels.
2. Após 30 dias de KPIs reais pós-VIAB-R1-2 em prod (cálculos, leads, conversão).
3. Após resposta de Sebrae + ML sobre certificação/aceleração (se aplicado).

Banner v2 substituirá "[v1 — strategist-swot-canvas]" por "[v2 — campo validado YYYY-MM-DD]".

---

## Sources consolidadas

| Tag | Origem | Onde foi usada |
|-----|--------|----------------|
| `docs/STATUS.md` | Estado prod 2026-05-02 | KR3, KP4, KA1 |
| `docs/business/ICP-validation-2026-Q2.md` | ICP v1 sintética | CS, VP, CH, RS, KA, KP |
| `docs/business/concorrencia-2026-Q2.md` | OMIE concorrência | VP, CH, KR4 |
| `docs/business/posicionamento.md` | Liderança em Produto | VP, CR, CS-anti |
| `docs/reviews/world-benchmark-2026-05-01/01-benchmark-mundial.md` | Benchmark 12 | KP1, KP3, RS |
| `docs/reviews/viability-2026-04-30/01-meli-viability.md` | Viability 5+5/10 | VP2, CR, RS, KR1 |
| `docs/reviews/painel-6-personas-2026-05-02/01-pontuacao-painel.md` | Painel 3.85/10 | KR5 (W1), CS |
| `docs/strategy/SWOT-2026-05-02.md` | SWOT v1 | Cross-referência S/W/O/T |
| `[INFERRED]` | Inferência de pattern com banner | Custos infra (Vercel/Supabase/Sentry pricing público) |

---

🧭 *Canvas é hipótese — confirmar em campo via experimentos.*
*Strategist SWOT + Canvas — 2026-05-02. Próximo deliverable: business-plan-2026-Q2.md.*
