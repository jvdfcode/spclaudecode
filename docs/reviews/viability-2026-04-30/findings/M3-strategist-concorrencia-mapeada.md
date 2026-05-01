# M3 --- @meli-strategist: Concorrencia mapeada

**Specialist:** @meli-strategist
**Comando:** *audit-listing (proxy) + WebFetch fallback (concorrencia-2026-Q2.md em estado TEMPLATE)
**Data:** 2026-05-01

---

## Concorrentes mapeados (5 com feature list)

### 1. Nubimetrics

- **Posicionamento declarado:** "Plataforma de BI e Big Data para e-commerce" --- processa 10 TB/dia em 18 paises, 200M+ produtos analisados. Parceiro certificado ML. [SOURCE: nubimetrics.com/br/product]
- **Pricing:** Pack 360 a partir de ~US$100/mes (~R$520/mes ao cambio atual). Plano Corporativo sob consulta. Trial gratuito de 14 dias. Pagamento via PayPal. [SOURCE: WebSearch --- CBInsights + landing Nubimetrics]
- **Features principais (8):**
  1. Deteccao de oportunidades (categorias com alta demanda e baixa saturacao)
  2. Analise de palavras-chave mais buscadas por categoria
  3. Otimizacao de titulos de anuncios
  4. Analise de oferta (concorrentes, preco medio, posicionamento)
  5. Visao global do mercado (vendas por categoria, crescimento mensal)
  6. Ranking de vendedores (posicionamento vs concorrentes mes a mes)
  7. Analise de tendencias e sazonalidade
  8. Controle de precos com monitoramento e comparacao
- **Diferencial declarado vs real:** Declara ser "BI completo para marketplace." Real: foco e em inteligencia de mercado e pesquisa de produtos --- NAO tem calculadora de custo real com taxas ML por tipo de anuncio. Nao calcula margem liquida com comissao + parcelamento + frete. [INFERRED]
- **O que NAO faz:** Nao calcula viabilidade financeira de SKU individual. Nao simula cenarios de preco com margem-alvo. Nao tem motor de decisao de preco.

### 2. Real Trends

- **Posicionamento declarado:** "O unico que voce precisa para vender no Mercado Livre" --- gestao operacional completa + analise de mercado. Certificacao Platinum ML. [SOURCE: real-trends.com/br]
- **Pricing:** Baseado em volume de vendas/mes. De R$69/mes (0-10 vendas, anual) ate R$445/mes (2500+ vendas, mensal). Trial gratuito 30 dias sem cartao. Loja online 100% gratis (0,75% por venda). [SOURCE: real-trends.com/br/precos]
- **Features principais (10):**
  1. Precos automaticos (repricing baseado em concorrentes --- ate 20 anuncios comparados)
  2. Monitoramento de concorrentes em tempo real (preco, estoque, publicacoes)
  3. Analise de mercado (40 palavras mais buscadas, rankings, tendencias)
  4. Gestao em massa (publicacoes, precos, estoque via Excel)
  5. Envios Flex (configuracao, mapa, operadores logisticos)
  6. Loja online propria com sincronizacao ML
  7. Multi-conta ML
  8. App mobile (iOS e Android)
  9. Mensagens automaticas (pos-venda, compra, envio, entrega)
  10. Respostas rapidas com IA para perguntas
- **Diferencial declarado vs real:** Declara ser "tudo em um." Real: forte em gestao operacional (publicacoes, respostas, envios) e repricing automatico. NAO tem calculadora de custo real por tipo de anuncio. O repricing e reativo (copia concorrente), nao proativo (baseado em margem real). [INFERRED]
- **O que NAO faz:** Nao calcula custo total da operacao (CMV + taxa ML + parcelamento + frete + impostos). Nao tem simulador de cenarios de preco. Nao tem Central de SKUs com status de viabilidade.

### 3. Olist Tiny ERP

- **Posicionamento declarado:** "Sistema de gestao completo para e-commerce" --- ERP com hub de integracao para 100+ plataformas. Parceiro Platinum ML. [SOURCE: tiny.com.br]
- **Pricing:** De R$49/mes (Avance, MEIs) ate R$679/mes (Domine). Plano Protagonize sob consulta. 20% desconto no plano anual. [SOURCE: tiny.com.br]
- **Features principais (8):**
  1. Calculadora de precos com regras por integracao (margem, impostos, custos do canal)
  2. Emissao automatica de NF-e, NFC-e, NFS-e
  3. Gestao de estoque sincronizado com ML
  4. Importacao automatica de pedidos (OMS)
  5. Conciliacao bancaria e financeiro
  6. Hub de integracao com 100+ plataformas
  7. Arredondamento inteligente de precos
  8. Controle de expedicao e logistica
- **Diferencial declarado vs real:** Declara ser "gestao completa." Real: e ERP generalista com modulo de pricing EXCLUSIVO para ML (Calculadora de Precos). O calculo de preco usa regras de comissao e frete, MAS e voltado para atualizacao em lote de anuncios, nao para decisao de preco individual com simulacao. Disponivel apenas nos planos Essencial+ (nao nos basicos). [SOURCE: ajuda.tiny.com.br/kb/articles]
- **O que NAO faz:** Nao tem busca de mercado (scraping de anuncios reais). Nao tem simulador de cenarios de preco. Nao tem motor de decisao de preco. Nao tem Central de SKUs com indicador de viabilidade financeira.

### 4. JoomPulse

- **Posicionamento declarado:** "Plataforma de inteligencia de mercado para vendedores do Mercado Livre" --- analise de milhoes de anuncios ativos com metricas visuais. [SOURCE: joompulse.com]
- **Pricing:** A partir de R$137/mes. Planos Free (limitado), Premium e Diamond. Garantia de 7 dias. [SOURCE: joompulse.com + gefersonalencar.com.br review]
- **Features principais (8):**
  1. Monitor de vendedores (rastreamento de precos, estoque, anuncios de concorrentes)
  2. Busca avancada de produtos (filtro por historico de venda, avaliacao, concorrencia)
  3. Calculadora de margem (taxas ML, frete, custos operacionais)
  4. Analise de categorias (subcategorias em crescimento, ticket medio, saturacao)
  5. Extensao Chrome para analise in-page no ML
  6. Insights de avaliacoes para melhorar anuncios
  7. Analise de sazonalidade
  8. Validacao de produto por imagem (IA)
- **Diferencial declarado vs real:** Declara ser "inteligencia de mercado completa." Real: forte em pesquisa de produtos e monitoramento de concorrentes. TEM calculadora de margem que considera taxas ML e frete --- concorrente mais proximo do SmartPreco no calculo de margem. Porem, o foco e em descoberta de produto, nao em decisao de preco com cenarios. [INFERRED]
- **O que NAO faz:** Nao tem simulador de cenarios de preco com zonas visuais. Nao tem Central de SKUs com gestao de portfolio. Nao tem motor de decisao integrado (custo + mercado = preco recomendado). Nao diferencia calculo por tipo de anuncio especifico (Classico 11% vs Premium 17% por categoria).

### 5. Calculadoras Gratuitas (Sobra Quanto / Toolspace / Marketfacil / CalcMarket)

- **Posicionamento declarado:** Ferramentas gratuitas e sem cadastro para calculo rapido de margem no ML. [SOURCE: sobraquanto.com.br + toolspace.com.br]
- **Pricing:** 100% gratuitas, sem login, sem dados persistidos. Modelo de negocio: trafego organico + ads no site.
- **Features principais (5):**
  1. Calculo de comissao ML (Classico/Premium)
  2. Calculo de lucro liquido por unidade
  3. Simulacao basica de frete
  4. Input de custo do produto
  5. Processamento offline no navegador (Toolspace)
- **Diferencial declarado vs real:** Simples e rapidas para calculo unico. NAO persistem dados. NAO tem historico. NAO diferenciam por categoria (usam taxa generica). NAO tem busca de mercado. NAO tem simulador de cenarios. [SOURCE: toolspace.com.br]
- **Relevancia competitiva:** Sao o baseline --- qualquer vendedor pode calcular margem de graca. SmartPreco precisa entregar valor ACIMA desse baseline para justificar cobranca.

---

## Matriz de feature parity

| Feature | SmartPreco | Nubimetrics | Real Trends | Olist Tiny | JoomPulse | Calc. Gratis |
|---------|:---------:|:-----------:|:-----------:|:----------:|:---------:|:------------:|
| Calculo de taxa por tipo anuncio (Gratis/Classico/Premium) | SIM | NAO | NAO | PARCIAL | PARCIAL | PARCIAL |
| Calculo por categoria (26 categorias com taxa diferente) | SIM | NAO | NAO | SIM | NAO | NAO |
| Custo total real (CMV+taxa+parcelamento+frete+impostos) | SIM | NAO | NAO | SIM | PARCIAL | PARCIAL |
| Simulador de cenarios de preco (zonas visuais) | SIM | NAO | NAO | NAO | NAO | NAO |
| Busca de anuncios reais ML (scraping/API) | SIM | SIM | SIM | NAO | SIM | NAO |
| Motor de decisao (custo + mercado = preco recomendado) | SIM | NAO | NAO | NAO | NAO | NAO |
| Central de SKUs com status de viabilidade | SIM | NAO | NAO | NAO | NAO | NAO |
| OAuth ML (acesso a dados do vendedor) | SIM (fase 2) | SIM | SIM | SIM | NAO | NAO |
| Lead Magnet publico (calculadora gratis) | SIM | NAO | SIM (trial 30d) | NAO | SIM (trial 7d) | SIM (100% gratis) |
| Mobile-first / App nativo | NAO (web responsive) | SIM | SIM | SIM | SIM (Chrome ext) | SIM (web) |
| Repricing automatico (altera preco no ML) | NAO | SIM | SIM | SIM | NAO | NAO |
| Multi-conta ML | NAO (Agency futuro) | SIM | SIM | SIM | NAO | NAO |
| Gestao de estoque / pedidos | NAO | NAO | SIM | SIM | NAO | NAO |
| Emissao de NF-e | NAO | NAO | NAO | SIM | NAO | NAO |
| Analise de tendencias / sazonalidade | NAO | SIM | SIM | NAO | SIM | NAO |

---

## Findings (7)

**F1 --- O diferencial "calculo por tipo de anuncio + categoria" e parcialmente unico.** [INFERRED]
Nenhum concorrente oferece a combinacao completa de calculo de taxa ML por tipo de anuncio (Gratis/Classico/Premium) COM diferenciacao por categoria (26 categorias com taxas diferentes de 11% a 20%) COM simulador de cenarios COM busca de mercado. Olist Tiny tem calculo por regra de comissao, mas nao tem simulacao nem busca de mercado. JoomPulse tem calculadora de margem, mas nao diferencia por categoria. Calculadoras gratuitas usam taxa generica. O SmartPreco e o unico que une custo real granular + simulacao + mercado em um unico fluxo.

**F2 --- O "scraping de anuncios reais ML" NAO e unico.** [INFERRED]
Nubimetrics, Real Trends e JoomPulse fazem analise de anuncios reais do ML com dados de preco, vendas, reputacao. A diferenca e que eles usam esses dados para pesquisa de produtos e monitoramento de concorrentes, nao para posicionamento de preco baseado em custo real. O scraping em si e commodity --- o diferencial esta no que se faz com os dados (integrar com calculo de custo para decisao de preco).

**F3 --- O mercado e fragmentado entre "BI de mercado" e "ERP operacional" --- SmartPreco ocupa um gap.** [INFERRED]
Nubimetrics e JoomPulse fazem BI de mercado (o que vender, quanto vendem os concorrentes). Real Trends e Olist Tiny fazem gestao operacional (publicar, atualizar preco, emitir NF). NENHUM faz "decisao de preco baseada em custo real + mercado" como workflow principal. SmartPreco ocupa esse gap intermediario. Porem, esse gap pode indicar que o mercado nao demanda essa funcao como produto standalone --- pode ser que vendedores resolvam com planilha + ferramenta de BI.

**F4 --- Real Trends com repricing automatico e ameaca futura, nao presente.** [SOURCE: real-trends.com/br]
Real Trends ja oferece "Precos automaticos" que ajustam preco com base em concorrentes. Se adicionarem calculo de custo/margem ao repricing (preco minimo por margem), poderiam replicar o core do SmartPreco como feature adicional. Tradeoff: RT foca em automacao, SmartPreco foca em decisao --- sao filosofias diferentes, mas a fronteira pode borrar.

**F5 --- Calculadoras gratuitas sao o verdadeiro concorrente do Lead Magnet.** [INFERRED]
Sobra Quanto, Toolspace, Marketfacil e CalcMarket oferecem calculo de margem ML 100% gratis, sem cadastro, sem friccao. O Lead Magnet do SmartPreco (/calculadora-livre) compete diretamente com essas ferramentas. Se o Lead Magnet nao entregar valor visivelmente superior (ex: calculo por categoria, simulacao de cenarios), o vendedor nao tem motivo para criar conta.

**F6 --- Pricing do SmartPreco (R$39-59/mes) e agressivo vs concorrentes.** [SOURCE: posicionamento.md + WebSearch pricing]
Nubimetrics: ~R$520/mes. Real Trends: R$69-445/mes. Olist Tiny: R$49-679/mes. JoomPulse: R$137+/mes. SmartPreco a R$39-59/mes e significativamente mais barato que todos exceto calculadoras gratuitas. Risco: preco muito baixo pode sinalizar "ferramenta simples" em vez de "plataforma de decisao" --- tensao com posicionamento de Lideranca em Produto.

**F7 --- App mobile e ponto fraco: 4 de 5 concorrentes pagos tem.** [INFERRED]
Nubimetrics, Real Trends, Olist Tiny e JoomPulse (via extensao Chrome) oferecem experiencia mobile ou in-browser. SmartPreco no MVP e web responsive apenas. Vendedores ML consultam precos no celular --- mobile-first pode ser necessario para retencao pos-MVP.

---

## Defensibilidade do diferencial

### "Scraping ML real" e unico?
**NAO.** Scraping de anuncios ML e praticado por Nubimetrics, Real Trends, JoomPulse e ate ferramentas open-source no GitHub (MercadoScraper, Apify). E tecnica commoditizada. O diferencial nao esta no scraping, mas na integracao do dado de mercado com o calculo de custo real para gerar decisao de preco. [INFERRED]

### "Calculo por tipo de anuncio" --- concorrente pode replicar em quanto tempo?
**2-4 semanas de desenvolvimento.** A tabela de taxas ML por tipo de anuncio e publica (Central do Vendedor). Qualquer concorrente com equipe de dev pode implementar essa logica. O que e mais dificil de replicar e o fluxo completo: entrada de custo -> calculo com taxa granular -> simulacao de cenarios -> busca de mercado -> decisao integrada. Esse workflow como produto e o diferencial real, nao a formula isolada. [INFERRED]

### Se ML lancar API oficial de pricing, SmartPreco perde diferencial?
**PARCIALMENTE.** Se o ML lancar uma calculadora oficial de custos (ja tem um "Simulador de Custos" basico no painel do vendedor), isso valida a demanda mas nao cobre: (a) simulacao de cenarios com margem-alvo, (b) Central de SKUs com portfolio, (c) motor de decisao integrando custo + mercado. O risco e real se o ML decidir expandir a ferramenta oficial --- mas historicamente o ML nao investe em ferramentas de gestao para vendedores (delega para parceiros certificados). [SOURCE: ML-CENTRAL --- simulador de custos oficial existe] [INFERRED --- analise de risco]

---

## Veredito

O SmartPreco ocupa um gap real e verificavel no mercado: nenhum concorrente mapeado une calculo de custo real granular (por tipo de anuncio + categoria) COM simulacao de cenarios COM busca de mercado COM motor de decisao em um unico fluxo orientado a decisao de preco.

Porem, esse gap tem fragilidades:
1. O diferencial tecnico isolado (formula de calculo) e replicavel em semanas
2. O scraping de anuncios e commodity
3. O gap pode existir porque vendedores resolvem com planilha + Nubimetrics (hipotese nao validada)
4. Calculadoras gratuitas commoditizam o calculo basico --- Lead Magnet precisa ser superior

A defensibilidade real esta no WORKFLOW INTEGRADO (5 camadas) e na EXPERIENCIA de decisao, nao em nenhuma feature isolada. O posicionamento de "Lideranca em Produto" precisa ancorar no fluxo completo, nao na formula.

---

## Nota 6/10
**Nota:** 6/10
**Justificativa:** O diferencial competitivo existe (gap de workflow verificado em 5 concorrentes), mas e mais fragil do que o posicionamento declara. "Scraping ML real" e commodity. "Calculo por tipo de anuncio" e replicavel. A defensibilidade real depende de execucao superior do fluxo integrado + validacao de que vendedores pagam por decisao de preco (e nao so por BI de mercado ou ERP). Sem as entrevistas ICP (MKT-001-2), a tese de que esse gap e monetizavel permanece hipotese. Eleva-se de 5 para 6 porque o pricing agressivo (R$39-59 vs R$137-520 dos concorrentes) da espaco para testar a tese com risco financeiro baixo para o cliente.

---

## Sources usadas (URL + last_verified)

| Source | URL | Last Verified | Tag |
|--------|-----|---------------|-----|
| Nubimetrics - Produto | https://www.nubimetrics.com/br/product/mercado | 2026-05-01 | [SOURCE] |
| Nubimetrics - CBInsights | https://www.cbinsights.com/company/nubimetrics | 2026-05-01 | [SOURCE] |
| Real Trends - Ferramentas | https://www.real-trends.com/br/Ferramentas | 2026-05-01 | [SOURCE] |
| Real Trends - Precos | https://www.real-trends.com/br/precos | 2026-05-01 | [SOURCE] |
| Olist Tiny - Home | https://tiny.com.br/ | 2026-05-01 | [SOURCE] |
| Olist Tiny - Calculadora | https://ajuda.tiny.com.br/kb/articles/erp/integracoes/gestao-de-integracoes/calculadora-de-precos | 2026-05-01 | [SOURCE] |
| JoomPulse - Home | https://joompulse.com/ | 2026-05-01 | [SOURCE] |
| JoomPulse - Review | https://gefersonalencar.com.br/2026/01/21/joompulse-funciona-vale-a-pena/ | 2026-05-01 | [SOURCE] |
| Sobra Quanto | https://www.sobraquanto.com.br/calculadora-mercado-livre | 2026-05-01 | [SOURCE] |
| Toolspace | https://www.toolspace.com.br/tools/mercado-livre-tax-calculator | 2026-05-01 | [SOURCE] |
| Posicionamento SmartPreco | docs/business/posicionamento.md | 2026-05-01 | [SOURCE] |
| PRD SmartPreco | docs/prd.md | 2026-05-01 | [SOURCE] |
| Nubimetrics vs Real Trends | https://www.woosync.io/pt/blog/nubimetrics-vs-real-trends-analisis-completo/ | 2026-05-01 | [SOURCE] |
| ML Central Vendedor | https://www.mercadolivre.com.br/ajuda | 2026-05-01 | [ML-CENTRAL] |
