# M2 — @meli-strategist: Pricing R$39/49/59 vs concorrentes

**Specialist:** @meli-strategist
**Comando:** *compare-listings (proxy: SaaS como anúncio)
**Data:** 2026-05-01

---

## Tabela comparativa

| Concorrente | Pricing público | ICP alvo | Diferencial declarado | URL | Tag |
|-------------|----------------|----------|----------------------|-----|-----|
| **SmartPreço** | R$0 (Free) / R$39-59 (Pro A/B/C) / R$149 (Agency) | Vendedor ML 5+ SKUs, PME R$5-50k/mês | Motor de decisão de preço mais preciso para ML Brasil; calculadora com taxas reais por categoria+tipo de anúncio | smartpreco.app | — |
| **Nubimetrics** | USD 54/mês Pack 360 (~R$310); módulo avulso USD 20/mês (~R$115); pro a partir de USD 100/mês (~R$575). Preços variam por país, sob consulta comercial. Free trial 14 dias. | Vendedor profissional ML, marcas, operações mid/enterprise | BI + big data para ML: análise de mercado, concorrência, meu negócio; 3 módulos integrados; parceiro oficial ML | nubimetrics.com/br | [INFERRED] — pricing não é público em BRL; valores extraídos de comparativo WooSync (jan/2021) + Tracxn (USD 100+/mo). Conversão USD/BRL estimada a R$5,75 (abr/2026). |
| **Real Trends** | R$69-445/mês conforme volume de vendas (0-10 vendas: R$115/mês ou R$69 anual; 2500+: R$445/mês ou R$267 anual). 40% off no anual. Free trial 30 dias. | Vendedor ML de todos os portes (escalona por volume); loja própria integrada | Precificação dinâmica automática, gestão multicanal, IA para respostas, análise de concorrência, loja própria com 0,75% por venda, certificação Platinum ML | real-trends.com/br | [INFERRED] — pricing público em real-trends.com/br/precos, verificado via WebFetch 2026-05-01. |
| **Hunter Hub** | R$97/mês (Explorador, 500 vendas) / R$197/mês (Caçador, 3000 vendas) / R$397/mês (Mestre, 15000 vendas). Anual: R$77/157/317. Trial 7 dias. | Vendedor ML que quer lucro real por venda; PME a grande operação | Cálculo de lucro real por venda (comissão+frete+imposto), recuperação de cobranças indevidas, monitor de Buy Box e catálogo, Hunter Spy (extensão Chrome) | hunterhub.com.br | [INFERRED] — pricing público na homepage, verificado via WebFetch 2026-05-01. |
| **JoomPulse** | A partir de R$137/mês. Planos mensais e anuais com garantia de satisfação. Trial grátis. | Vendedor ML iniciante a profissional; +30 mil sellers usam | Inteligência de mercado, monitor de vendedores com histórico, simulador de custos ML, extensão Chrome, análise de concorrência | joompulse.com | [INFERRED] — valor mínimo público na homepage, planos detalhados não acessíveis publicamente. |
| **Olist (Tiny ERP + Hub)** | R$49/mês (Avance) / R$129 (Construa) / R$279 (Impulsione) / R$679 (Domine). Anual: R$59/129/349/849. Trial 30 dias. | PME multicanal (ML + Amazon + Shopee); foco em gestão ERP e NF-e | ERP completo + hub de integração com marketplaces; calculadora de preços integrada (planos Impulsione+); emissão de NF-e; usuários ilimitados | olist.com/planos | [INFERRED] — pricing público em olist.com/planos, verificado via WebFetch 2026-05-01. Olist é ERP, não ferramenta de precificação pura. |
| **Hub2B** | Não público. Mensalidade + taxa por pedido. 5 planos (Inicial 1000 anúncios a Corporativo ilimitado). Referência de mercado para hubs: R$79-249/mês. Trial 7 dias. | PME a enterprise que vendem em múltiplos marketplaces (40+ integrações) | Hub de integração puro: sincronização de estoque/preço/pedido em 40+ marketplaces; preditor de categorias ML; +70 funcionalidades | hub2b.com.br | [INFERRED] — pricing sob consulta; faixa estimada de fontes terciárias. |

---

## Findings (7)

### F1 — SmartPreço é 3-5x mais barato que qualquer concorrente direto de inteligência ML

**Severidade:** ALTA (positiva)
**Heurística:** MS005 adaptada (pricing proxy)
**Evidência:** SmartPreço Pro varia de R$39-59/mês. O concorrente mais próximo em funcionalidade de precificação ML é Hunter Hub a R$97/mês (Explorador) — 2.5x mais caro que a variante A. Nubimetrics Pack 360 custa ~R$310/mês — 8x mais caro que variante A. Real Trends começa em R$69/mês (anual, 0-10 vendas) mas sobe para R$115-445/mês no mensal. JoomPulse começa em R$137/mês — 3.5x mais caro.
**Tag:** [INFERRED] — comparação direta de pricing público; SmartPreço resolve problema diferente (calculadora de viabilidade) dos concorrentes (BI/gestão completa).

### F2 — SmartPreço compete em categoria diferente dos concorrentes mapeados

**Severidade:** CRÍTICA (risco de posicionamento)
**Heurística:** MS007 (Categoria Correta = Visibilidade 5-10x)
**Evidência:** Os concorrentes diretos (Nubimetrics, Real Trends, Hunter Hub, JoomPulse) são plataformas de **inteligência de mercado e gestão completa** (análise de concorrência, monitoramento de vendas, BI, gestão de estoque, etc.). SmartPreço é uma **calculadora de viabilidade de preço** — ferramenta de nicho dentro do ecossistema. Isso é equivalente a comparar uma chave de fenda com uma caixa de ferramentas. O pricing mais baixo é coerente com o escopo mais estreito, mas o risco é que o ICP perceba que paga R$39-59 por UMA funcionalidade quando pode pagar R$97-197 por DEZENAS no Hunter Hub ou R$137+ no JoomPulse. A calculadora do Olist já está embutida nos planos Impulsione+ (R$279/mês). O próprio ML lançou precificação automática nativa grátis em 2026.
**Tag:** [ML-CENTRAL] — ML lançou ferramenta de precificação automática nativa em 2026. [INFERRED] — análise de sobreposição de escopo.

### F3 — Faixa R$39-59 é coerente com WTP de vendedor PME ML (R$5-50k/mês)

**Severidade:** MÉDIA (positiva com ressalva)
**Heurística:** MS005 (ACOS adaptada para SaaS)
**Evidência:** Para um vendedor ML com faturamento de R$10.000/mês e margem bruta de ~20% (R$2.000/mês), R$39-59 representa 2-3% da margem bruta — faixa aceitável para ferramenta de apoio. A estimativa Finch de perda invisível de R$800-1.500/mês por precificação errada (roundtable Finch, 02-finch.md) coloca o ROI do SmartPreço em 13-38x (R$800/R$59 a R$1.500/R$39). Porém, o WTP não está validado por entrevistas reais — ICP-validation-2026-Q2.md está em estado TEMPLATE.
**Tag:** [INFERRED] — WTP estimado; sem entrevistas reais validando. [GUSTAVO-LUCAS] — padrão de vendedor profissional ML que investe ~2-5% da margem em ferramentas.

### F4 — Variante A (R$39) corre risco de ancorar percepção de "ferramenta barata" vs "ferramenta premium"

**Severidade:** MÉDIA
**Heurística:** MS002 adaptada (posicionamento = título do anúncio)
**Evidência:** O posicionamento declarado é "Liderança em Produto" (posicionamento.md): "motor de decisão de preço mais preciso". Precificar a R$39/mês cria tensão com o posicionamento premium. Nubimetrics a ~R$310/mês e Hunter Hub a R$97/mês sinalizam "ferramenta profissional" pelo preço. R$39 pode sinalizar "ferramenta amadora" ou "planilha glorificada" para o ICP que já paga R$97-197 em outras ferramentas. Contraponto: R$39 pode ser isca de conversão irresistível se o free tier já demonstra valor (lead magnet via calculadora). A/B test deveria medir não só conversão de click, mas também **churn em 90 dias** e **perceived value** por variante.
**Tag:** [INFERRED] — heurística de psicologia de preço; sem dado empírico.

### F5 — Agency a R$149 está sub-precificado vs mercado

**Severidade:** MÉDIA
**Heurística:** MS005 (ACOS proxy)
**Evidência:** Agency (multi-conta ML até 10) a R$149/mês está abaixo do Hunter Hub Caçador (5 contas, R$197/mês) e muito abaixo do Nubimetrics (~R$310-575/mês) e Real Trends para volumes médios (R$215-445/mês). Vendedores com 10 contas ML tipicamente faturam R$100k+/mês — para eles R$149 é irrelevante (0.15% do faturamento). Isso sugere espaço para precificar Agency entre R$249-399/mês sem resistência significativa do ICP enterprise.
**Tag:** [INFERRED] — benchmarking de mercado; WTP enterprise não validado.

### F6 — Precificação automática nativa do ML é ameaça existencial ao módulo de precificação

**Severidade:** CRÍTICA (risco de plataforma)
**Heurística:** MS009 adaptada + F3 do plano v3 (risco de plataforma)
**Evidência:** Em 2026, o Mercado Livre lançou funcionalidade de precificação automática com IA direto no painel do vendedor (fonte: conectaads.com.br, blog.joompulse.com). Essa ferramenta é gratuita e ajusta preços automaticamente para manter competitividade. Porém, segundo análise da JoomPulse e ConnectaAds, a ferramenta nativa do ML "se concentra apenas em vender o máximo possível, sem considerar custos, margens ou lucros" — ou seja, pode levar a guerras de preço destrutivas. O SmartPreço se diferencia justamente por calcular viabilidade COM margens — mas precisa comunicar esse diferencial com clareza na landing, senão o vendedor pensa "ML já faz isso de graça".
**Tag:** [ML-CENTRAL] — ferramenta nativa ML lançada em 2026. [INFERRED] — análise de ameaça competitiva.

### F7 — Free tier do SmartPreço (5 SKUs) compete com calculadoras gratuitas abundantes

**Severidade:** MÉDIA
**Heurística:** MS009 (amplifica vs funda)
**Evidência:** Olist disponibiliza calculadora de preços ML gratuita em planilha Excel (olist.com/blog). O próprio ML tem simulador de custos. JoomPulse tem simulador de custos na extensão Chrome. Hunter Hub calcula lucro real integrado. O free tier do SmartPreço com 5 SKUs precisa ser **notavelmente superior** a essas alternativas gratuitas para funcionar como lead magnet eficaz. O diferencial potencial é: cálculo por categoria específica + tipo de anúncio (Free/Classic/Premium) + simulador de cenários — se isso estiver claro na experiência, o free tier converte; se não, compete com planilha de Excel.
**Tag:** [INFERRED] — mapeamento de alternativas gratuitas disponíveis.

---

## Posicionamento do SmartPreço

### Tier: BOTTOM-PRICE com posicionamento MID-VALUE

**Justificativa:**

O SmartPreço pratica o menor preço entre todas as ferramentas SaaS mapeadas para vendedores ML. A faixa R$39-59/mês (Pro) está abaixo de todos os concorrentes diretos:

| Faixa | Ferramentas | Preço mensal |
|-------|------------|-------------|
| Bottom | **SmartPreço** | R$39-59 |
| Low-mid | Olist Avance (ERP básico) | R$49 |
| Mid | Hunter Hub Explorador | R$97 |
| Mid-high | Real Trends (0-10 vendas), JoomPulse | R$115-137 |
| High | Hunter Hub Caçador, Nubimetrics Pack 360 | R$197-310 |
| Premium | Real Trends (2500+ vendas), Olist Domine, Nubimetrics Pro | R$445-679 |

Porém, o posicionamento declarado é "Liderança em Produto" — o que cria uma **tensão deliberada** entre preço bottom e valor percebido mid/high. Essa tensão pode ser resolvida de duas formas:

1. **Estratégia "Nubank":** preço agressivo + produto superior em nicho específico = disrupção. Viável se o motor de cálculo for comprovadamente mais preciso que as alternativas e se a comunicação deixar isso claro.
2. **Estratégia "planilha glorificada":** preço baixo = percebido como ferramenta simples. Risco real se o ICP não entender o diferencial.

### WTP esperado de PME ML R$5-50k/mês

Para vendedor PME ML com faturamento R$5-50k/mês:
- **R$39/mês (variante A):** <1% do faturamento mínimo. Compra impulsiva possível, mas pode sinalizar "ferramenta de iniciante". Conversão possivelmente maior, churn possivelmente maior (perceived value baixo).
- **R$49/mês (variante B):** ~1% do faturamento mínimo. Faixa psicológica "café por dia". Equilíbrio potencial entre conversão e perceived value.
- **R$59/mês (variante C):** ~1.2% do faturamento mínimo. Ainda acessível, mais próximo da "faixa profissional". Menor conversão esperada mas maior LTV potencial (filtro de seriedade).

### A/B R$39/49/59 — hipótese de conversão

**Hipótese @meli-strategist:** A variante B (R$49) provavelmente oferece o melhor equilíbrio entre conversão e LTV, baseado em:
1. R$49 é número redondo "familiar" no ecossistema de SaaS PME brasileiro
2. R$49 está abaixo do threshold psicológico de R$50/mês (barreira de decisão)
3. R$49 permite desconto para anual (~R$39/mês) que ancora na variante A sem desvalorizar
4. R$39 pode canibalizar a percepção de "produto profissional" do posicionamento Liderança em Produto
5. R$59 cria resistência desnecessária para MVP sem track record de marca [INFERRED]

**PORÉM:** essa hipótese só se valida com dados reais do A/B test + entrevistas ICP (MKT-001-2, ainda em TEMPLATE). Sem dados, qualquer previsão de variante vencedora é especulação. [INFERRED]

---

## Veredito

O pricing R$39/49/59 é **defensável como estratégia de entrada** no mercado, dado que:
1. Nenhum concorrente direto opera abaixo de R$97/mês para ferramenta de inteligência ML
2. O escopo do SmartPreço (calculadora de viabilidade) é deliberadamente mais estreito que os concorrentes (BI + gestão completa), justificando preço menor
3. O ROI teórico é atrativo (R$800-1.500 de perda evitada vs R$39-59 de custo)

Porém, há **3 riscos críticos** que impedem nota alta:
1. **Precificação nativa ML gratuita** pode erodir o diferencial percebido se o SmartPreço não comunicar claramente por que é superior
2. **Tensão preço-posicionamento:** "Liderança em Produto" com preço bottom cria dissonância cognitiva — precisa de narrativa forte ("Nubank da precificação ML") para resolver
3. **Agency sub-precificado:** R$149 para 10 contas ML está 25-50% abaixo do mercado comparável, deixando dinheiro na mesa

---

## Nota

**Nota:** 6/10

**Justificativa:** O pricing é competitivo e acessível para o ICP declarado, com ROI teórico forte. Perde pontos porque: (a) não há validação empírica do WTP via entrevistas reais (ICP-validation ainda TEMPLATE); (b) tensão não resolvida entre preço bottom e posicionamento premium; (c) ameaça existencial da precificação nativa ML gratuita não mitigada na proposta de valor; (d) Agency sub-precificado sem justificativa estratégica documentada. O A/B test é o instrumento correto, mas sem métricas de churn e perceived value além de click, o teste mede conversão de curto prazo, não sustentabilidade de pricing.

---

## Sources usadas (com URL e last_verified)

| Source | URL | last_verified | Tag |
|--------|-----|---------------|-----|
| Nubimetrics (produto BR) | https://www.nubimetrics.com/br/product | 2026-05-01 | [INFERRED] |
| Nubimetrics pricing (WooSync comparativo) | https://www.woosync.io/pt/blog/nubimetrics-vs-real-trends-analisis-completo/ | 2026-05-01 (dados originais de 2021) | [INFERRED] |
| Nubimetrics (Tracxn company profile) | https://tracxn.com/d/companies/nubimetrics/ | 2026-05-01 | [INFERRED] |
| Real Trends preços | https://www.real-trends.com/br/precos | 2026-05-01 | [INFERRED] |
| Real Trends ferramentas | https://www.real-trends.com/br/Ferramentas | 2026-05-01 | [INFERRED] |
| Olist planos | https://olist.com/planos/ | 2026-05-01 | [INFERRED] |
| Olist calculadora ML | https://olist.com/blog/pt/gestao-empresarial/gestao-financeira/planilha-gratis-como-calcular-preco-de-venda-no-mercado-livre/ | 2026-05-01 | [INFERRED] |
| Hub2B planos | https://hub2b.com.br/planos | 2026-05-01 | [INFERRED] |
| Hunter Hub homepage + pricing | https://hunterhub.com.br/ | 2026-05-01 | [INFERRED] |
| JoomPulse homepage | https://joompulse.com/ | 2026-05-01 | [INFERRED] |
| ML precificação automática nativa | https://www.conectaads.com.br/precificacao-automatica-no-mercado-livre/ | 2026-05-01 | [ML-CENTRAL] |
| ML custos 2026 (JoomPulse blog) | https://blog.joompulse.com/2026/02/12/custos-mercado-livre-o-que-muda-para-sellers-2026/ | 2026-05-01 | [ML-CENTRAL] |
| Estudo precificação 2026 (E-Commerce Brasil) | https://www.ecommercebrasil.com.br/artigos/estudo-de-precificacao-2026-o-efeito-pratico-das-mudancas-anunciadas-por-mercado-livre-e-shopee-na-vida-dos-vendedores | 2026-05-01 | [INFERRED] |
| SmartPreço pricing-experiment.ts | src/lib/pricing-experiment.ts (local) | 2026-05-01 | — |
| SmartPreço posicionamento.md | docs/business/posicionamento.md (local) | 2026-05-01 | — |
| Roundtable Finch (perda invisível R$800-1500) | docs/reviews/viability-2026-04-30/roundtable/02-finch.md (local) | 2026-05-01 | — |
