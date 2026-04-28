# Thiago Finch — Análise Funnel-First

> "Funil > Produto. Sempre. O discovery todo é sobre produto. Cadê o funil?"

---

## Veredito (1 frase)

SmartPreço tem motor de decisão comercial real — mas zero funil de aquisição, zero pesquisa de concorrência, e um roadmap inteiro que otimiza produto antes de provar que alguém chega até ele.

---

## 3 Fortalezas

1. **Promessa funcional existe.** "Substituir Excel e intuição" é uma big idea com perda clara. Isso não é commodity — é dor real. FR01–FR17 provam que o produto resolve o problema se o vendedor chegar até ele.
2. **ICP definido implicitamente.** Pequenos e médios operadores ML Brasil. Dor documentada: "precificação por imitação, margens invisíveis". Loss Aversion tem ancoragem real aqui — o vendedor que perde dinheiro sem saber é o lead perfeito.
3. **Diferencial técnico legítimo.** Scraping de anúncios reais ML + cálculo de taxas por tipo de anúncio (FR02–FR03) = vantagem funcional sobre calculadora de Excel. Isso é um ângulo de funil se alguém souber usar.

---

## 5 Fraquezas / Gaps de funil

1. **Funil de aquisição: zero.** PRD inteiro, 8 shards, arquitetura completa — nenhuma linha sobre como vendedor ML descobre o SmartPreço. Sem canal. Sem Lead Magnet. Sem VSL. Sem headline de entrada. O produto existe em vácuo.
2. **Concorrência: não modelada.** Nenhum documento menciona Olist, SellerPro, ferramentas de precificação ML existentes ou planilhas compartilhadas em grupos de Facebook/WhatsApp de vendedores. OMIE começa em Observar. Não observaram.
3. **Promessa fraca no nome.** "SmartPreço" é nome de produto. Não é promessa. Não há tagline de funil. Sem "Descubra se você está perdendo dinheiro em cada venda no ML". Sem headline que dispara Loss Aversion.
4. **Onboarding sem funil interno.** WelcomeTour existe mas não está integrado ao estado real (DEBT-FE-NEW-5). Isso significa que o funil interno — do cadastro até o primeiro cálculo salvo — está quebrado. Conversão pós-cadastro é funil também.
5. **Monetização ausente do discovery.** Sem freemium, sem plano, sem upsell. O discovery decidiu construir um produto completo antes de definir como ele converte em receita. Produto sem oferta não é produto — é demo.

---

## Diagnóstico OMIE

- **Observar (concorrência):** Não coberto. Zero menção a ferramentas concorrentes, benchmarks de mercado, grupos de vendedores ML, planilhas virais. O discovery saltou direto para construir sem observar o que existe.
- **Modelar (best practices ML calculator):** Não modelado. Nenhuma análise de "o que uma calculadora ML de sucesso faz hoje". Sem análise de Olist, SellerApp, ExcelDeVendedor.xlsx que circula em grupos. O que converte? O que retém? Não sabemos.
- **Melhorar (versão SmartPreço):** Prematuro. O produto foi melhorado sem ter modelado o baseline. O resultado é um sistema tecnicamente sofisticado que pode não ter diferencial percebido pelo ICP.
- **Excelência (KPIs):** NFR07 (1.000 usuários simultâneos) é KPI de infra, não de funil. Cadê CAC, LTV, churn, taxa de ativação (% que salva primeiro SKU), NPS de vendedores ML? Inexistentes no discovery.

---

## Loss Aversion 2.5:1

O discovery documenta a dor: "margens invisíveis", "produtos que parecem lucrativos mas geram prejuízo". Mas não quantifica. Sem quantificação, Loss Aversion não funciona como gatilho de funil.

**O que o discovery não responde:**
- Quanto um vendedor ML de ticket médio perde por mês precificando no chute? (sem esse número, sem urgência)
- Quantos vendedores ML Brasil existem? (TAM, SAM, SOM — zero)
- Qual a dor de usar Excel por mais 1 sprint? (análise de downside inexistente)

**Estimativa de impacto não feita pelo discovery:**
Um vendedor com 50 SKUs ativos perdendo 2% de margem por precificação errada = R$ X/mês. Esse número é o funil. Sem ele, o produto é solução sem urgência.

Cada sprint de desenvolvimento sem funil validado = crescimento zero em paralelo. O roadmap prioriza débito técnico (DEBT-DB-C3, DEBT-FE-NEW-1) enquanto a pergunta "quem vai pagar por isso e por que agora" não tem resposta documentada.

---

## 3 Recomendações

1. **Lead Magnet antes do próximo sprint.** Criar uma calculadora pública gratuita (sem cadastro) que mostra ao vendedor ML quanto ele provavelmente está perdendo. Isso é funil de entrada. Captura email, prova valor, gera urgência. Custo: 1 componente. Retorno: lista qualificada.

2. **OMIE agora: mapear concorrência em 2 horas.** Entrar em 3 grupos de vendedores ML no Facebook/WhatsApp. Perguntar "o que você usa para calcular preço?". Registrar. Isso é Observar. Sem isso, o Modelar é invenção. E invenção viola o Artigo IV da Constitution.

3. **Definir a oferta perpétua antes do Bloco G (i18n).** Freemium com limite de SKUs, plano básico R$ X/mês, plano pro com MarketSearch ilimitado. Sem oferta definida, o funil não tem destino. Nota: Bloco G (i18n, 2-3 sprints) é otimização de produto sem funil validado — Death Zone.

---

## Veto Finch

**Bloco G (i18n) antes de funil = morte certa.** 2-3 sprints para suportar múltiplos idiomas quando não existe funil de aquisição documentado para o mercado BR original é a definição de otimizar produto antes do funil. Veto absoluto.

**Quick wins de A11y (DEBT-FE-NEW-1, DEBT-FE-NEW-2)** antes de converter o primeiro lead pago também são candidatos ao veto — não porque A11y não importe, mas porque são semanas de dev sem impacto em funil de aquisição. Prioridade máxima deveria ser: **provar que alguém paga**.

Autenticidade > posicionamento: o produto tem voz genuína na dor do vendedor ML. Mas voz sem canal é monólogo. Funil primeiro.

---

*Análise: Thiago Finch — Business Strategy & Marketing Architect*
*Referências: DEBT-FE-NEW-5, DEBT-FE-2 (Bloco G), DEBT-H6, PRD §1 (goals-context), PRD §2 (requirements FR01–FR20)*
