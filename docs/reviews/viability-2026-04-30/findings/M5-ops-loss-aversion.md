# M5 — @meli-ops: Loss Aversion calibrada

**Specialist:** @meli-ops
**Comando:** *explain-policy custo-de-cancelamento-e-mediacao
**Data:** 2026-05-01

[LEGAL-DISCLAIMER] Esta análise é informativa, baseada em política oficial ML + CDC + Marco Civil + jurisprudência STJ majoritária. NÃO substitui consulta a advogado em casos concretos. Para suspensão definitiva ou retenção de saldo >R$5k, consulte especialista (ex: [BIANCA-MURTA]) antes de agir.

[ML-POLICY-CHANGES] Política ML pode mudar sem aviso. Custos e penalidades abaixo refletem regras verificadas até 2026-04-30. Validar no Central de Vendedores no momento da decisão concreta.

## Premissas do perfil-alvo

| Parâmetro | Valor |
|-----------|-------|
| SKUs ativos | 50 |
| Faturamento ML/mês | R$20.000 |
| Ticket médio | R$400 (50 pedidos/mês) |
| Categoria predominante | Eletrônicos/Casa (comissão Classic ~11%) |
| Tipo de anúncio | Mix Classic (60%) + Premium (40%) |
| Margem bruta média s/ taxas ML | ~25% (R$100/pedido antes de taxas) |
| Reputação atual | Verde claro (baseline estável) |

**Nota:** Todos os parâmetros do perfil são [INFERRED] — nenhuma entrevista ICP foi realizada até esta data (MKT-001-2 tem zero sessões concluídas). Os números acima representam o perfil hipotético definido no Plano v3.

## Estrutura de custo (vendedor 50 SKUs, R$20k/mês)

| # | Risco | Custo R$/evento | Probabilidade mensal s/ ferramenta | Custo esperado R$/mês | Tag |
|---|-------|-----------------|-----------------------------------|----------------------|-----|
| 1 | Erro de pricing — vender no prejuízo | R$50-150/SKU afetado (margem negativa em 1-3 SKUs) | 15-25% (pelo menos 1 erro/mês em 50 SKUs sem cálculo sistemático) | **R$75-375** (ponto central R$200) | [INFERRED] |
| 2 | Cancelamento por preço errado ou falta de estoque pós-venda | R$80-120/cancelamento (reembolso + frete reverso + perda do produto em trânsito) | 5-10% dos pedidos mensais (2-5 cancelamentos/mês) | **R$160-600** (ponto central R$320) | [ML-CENTRAL] cancelamento + [INFERRED] prob. |
| 3 | Mediação aberta — claim de "valor cobrado errado" ou "produto diferente do anunciado" | R$200-500/mediação (custo de tempo ~4-8h de resposta/evidência + risco de reembolso forçado) | 3-5% (1-2 mediações/mês para vendedor sem controle de pricing) | **R$200-1.000** (ponto central R$450) | [CDC] art 18/49 + [ML-CENTRAL] mediação + [INFERRED] prob. |
| 4 | Reputação amarela — ranqueamento cai, Buy Box bloqueado | Queda de 15-30% no faturamento enquanto amarelo (R$3.000-6.000/mês perdido) | 10-20% de chance de cair para amarelo em um trimestre sem controle (converte para ~4-7%/mês) | **R$120-420** (ponto central R$250) | [ML-CENTRAL] reputação + [INFERRED] queda % |
| 5 | Reputação vermelha/suspensão temporária — faturamento parado N dias | 100% do faturamento parado por 7-30 dias (R$4.600-20.000 perdido por evento) | 1-3% mensal (raro, mas catastrófico quando ocorre) | **R$46-600** (ponto central R$200) | [ML-CENTRAL] suspensão + [BIANCA-MURTA] casos reais + [INFERRED] prob. |
| 6 | Bloqueio de saldo — ML retém R$ até resolução de disputa | R$2.000-5.000 retidos por 30-90 dias (custo financeiro: ~2-5% do valor retido/mês + custo de oportunidade) | 2-5% mensal (correlacionado com mediações abertas) | **R$40-250** (ponto central R$100) | [BIANCA-MURTA] + [ML-CENTRAL] + [INFERRED] prob. |
| **TOTAL ESPERADO** | | | | **R$641-3.245/mês** | |
| **PONTO CENTRAL** | | | | **R$1.520/mês** | |

### Notas metodológicas

1. **Custos não são plenamente aditivos.** Um cancelamento que gera mediação que gera reputação amarela é uma cascata — contei o custo em cada estágio mas reconheço sobreposição parcial. O custo real está entre o somatório linear (R$1.520) e ~70% dele (R$1.064) para evitar double-counting. **Faixa ajustada: R$1.064-1.520/mês.** [INFERRED]

2. **Probabilidades são para vendedor SEM nenhuma ferramenta sistemática de pricing ML.** Vendedor que usa planilha própria tem probabilidades menores (talvez 50-70% das acima). O SmartPreço não elimina todos os riscos — elimina primariamente #1 (erro de pricing) e reduz indiretamente #2-#4 ao reduzir a causa raiz. [INFERRED]

3. **Riscos #5 e #6 são eventos de cauda longa** — baixa probabilidade, alto impacto. O valor esperado mensal é moderado, mas um único evento pode custar mais que 1 ano de assinatura SmartPreço. [ML-CENTRAL] + [BIANCA-MURTA]

## Loss Aversion 2.5:1

| Métrica | Valor |
|---------|-------|
| **Custo de NÃO usar SmartPreço (ponto central ajustado)** | R$1.064-1.520/mês |
| **Custo de usar SmartPreço** | R$39-59/mês |
| **Ratio (ponto central / preço médio R$49)** | 21.7:1 a 31.0:1 |
| **Ratio (ponto central / preço máximo R$59)** | 18.0:1 a 25.8:1 |
| **Ratio conservador (70% do ponto central / R$59)** | 12.6:1 |
| **Threshold Loss Aversion 2.5:1 atingido?** | **SIM — mesmo no cenário mais conservador (12.6:1), o ratio ultrapassa 2.5:1 com larga folga** |

### Interpretação

O ratio é tão alto que levanta duas questões:

1. **Se o custo de não-usar é tão alto, por que os vendedores NÃO usam ferramentas de pricing hoje?** Possibilidades: (a) não percebem o custo porque é difuso e não contabilizado; (b) atribuem os problemas a "azar" e não a processo; (c) não sabem que ferramentas existem. Isso confirma que a narrativa de Loss Aversion deve **tornar o custo visível** — o vendedor não sente a dor como linha de custo única, sente como "mês ruim". [INFERRED]

2. **O ratio alto não significa conversão fácil.** Loss Aversion só funciona quando o cliente PERCEBE a perda. Se o vendedor não conecta "reputação amarela" com "erro de pricing de 2 semanas atrás", a narrativa cai. O funil precisa fazer essa conexão explícita. [INFERRED]

## Findings

### #1 — Custo invisível é o problema real, não o custo absoluto
- **Severidade:** ALTA
- **Heurística:** MO001 (Janela 60 Dias Rolling) + MO010 (Reputação Amarela = Stop em Volume)
- **Tag:** [ML-CENTRAL] + [INFERRED]
- **Descrição:** O vendedor ML não contabiliza o custo de erro de pricing porque os efeitos são atrasados (janela 60 dias rolling) e difusos (queda gradual de ranqueamento). O SmartPreço precisa NÃO apenas calcular corretamente, mas MOSTRAR ao vendedor o custo acumulado dos erros passados. Se o produto apenas calcula e não educa, a Loss Aversion não converte. A landing page e o onboarding devem incluir um "diagnóstico de custo oculto" que o vendedor possa rodar com seus próprios dados — transformar R$1.520/mês invisível em número visível é o unlock de conversão.

### #2 — Cascata cancelamento-mediação-reputação é o multiplicador de custo
- **Severidade:** ALTA
- **Heurística:** MO003 (Mediação: Não Admitir Culpa Antecipada) + MO008 (Cancelamento por Falta de Estoque é Grave)
- **Tag:** [ML-CENTRAL] + [CDC] art 49 + [INFERRED]
- **Descrição:** Um único erro de pricing pode cascatear: venda no prejuízo → vendedor tenta cancelar (MO008: infração grave) → comprador abre mediação (MO003: vendedor admite culpa por desespero) → ML decide contra vendedor → reputação cai → Buy Box bloqueado → faturamento cai 15-30%. O custo de um erro de R$50 vira R$3.000+ na cascata. O SmartPreço pode se posicionar como "seguro contra cascata" — prevenir o primeiro elo (erro de pricing) que dispara tudo.

### #3 — Dados de custo são 100% inferidos — nenhuma validação com vendedor real
- **Severidade:** CRÍTICA (para a confiabilidade desta análise, não para o produto)
- **Heurística:** MO000 (Não Substituo Advogado — analogia: não substituo dado real)
- **Tag:** [INFERRED]
- **Descrição:** Toda a estrutura de custo acima é inferência baseada em política ML + lógica econômica + prática pública de advogados especializados. Nenhuma das 10 entrevistas ICP foi realizada (MKT-001-2 = zero sessões). Nenhum vendedor real confirmou que erra pricing X vezes por mês ou que o custo de mediação é R$Y. O roteiro de entrevistas (ROTEIRO.md) não inclui perguntas específicas sobre frequência de erro de pricing nem custo percebido de mediação/cancelamento. **Recomendação:** adicionar ao roteiro de entrevistas (Bloco 5) as seguintes perguntas: (a) "Quantas vezes por mês você descobre que vendeu um produto no prejuízo?"; (b) "Quanto você estima que perde por mês com cancelamentos e mediações?"; (c) "Sua reputação já caiu de cor? Quanto tempo demorou para voltar?". Sem essas respostas, o ratio 12.6:1 a 31:1 é uma tese, não evidência.

### #4 — Saldo bloqueado como gatilho emocional desproporcional
- **Severidade:** MÉDIA
- **Heurística:** MO005 (Threshold de Judicialização >R$5k)
- **Tag:** [BIANCA-MURTA] + [INFERRED]
- **Descrição:** O bloqueio de saldo (risco #6) tem custo financeiro baixo na média (R$100/mês esperado), mas impacto emocional desproporcional — o vendedor sente que "ML roubou meu dinheiro". Bianca Murta documenta que saldo retido é o principal gatilho de procura por advogado. Para fins de Loss Aversion, este risco pode ser usado como alavanca emocional na comunicação ("já teve saldo bloqueado?") mesmo que o custo esperado mensal seja baixo, porque a percepção de perda é muito maior que o valor real.

## Veredito

A estrutura de custo, mesmo com premissas conservadoras e 100% inferidas, produz um ratio Loss Aversion que ultrapassa o threshold 2.5:1 por larga margem (mínimo 12.6:1 no cenário mais conservador). Isso significa que a **narrativa de Loss Aversion é viável como estratégia de posicionamento** — o custo de não-usar é ordens de magnitude maior que o custo de usar.

Porém, a análise tem uma fragilidade fundamental: **nenhum dado vem de vendedor real**. As probabilidades são inferências razoáveis mas não validadas. Se as entrevistas ICP (MKT-001-2) revelarem que vendedores com 50 SKUs erram pricing com frequência muito menor que o estimado (ex: 2% em vez de 15-25%), o ratio cai significativamente — embora provavelmente ainda ultrapasse 2.5:1.

**Recomendação forte:** usar os números desta análise como hipótese de partida para a landing page, mas tratar o ratio como **provisório** até que pelo menos 5 entrevistas confirmem a frequência de erro de pricing e o custo percebido de mediação/cancelamento.

## Nota 6/10
**Nota:** 6/10
**Justificativa:** A estrutura é completa (6 categorias de risco, custo + probabilidade + tag em cada uma), o ratio Loss Aversion é calculado de múltiplas formas (conservador, central, otimista), e os findings são acionáveis. Porém, 100% dos dados de probabilidade e custo são [INFERRED] — não há nenhuma entrevista ICP realizada, nenhum dado de vendedor real, e o roteiro de entrevistas atual não cobre as perguntas que validariam estes números. A análise é internamente consistente mas externamente não validada. Quando as entrevistas forem realizadas, esta nota pode subir para 8-9/10 se os dados confirmarem as premissas, ou cair para 3-4/10 se os vendedores revelarem que o problema de pricing é muito menor do que inferido.

## Sources

| Tag | Fonte | Uso nesta análise |
|-----|-------|-------------------|
| [ML-CENTRAL] | Central de Vendedores ML (last_verified: 2026-04-30) | Regras de reputação, cancelamento, mediação, suspensão |
| [CDC] | Lei 8.078/90 — Código de Defesa do Consumidor | Art 18 (vícios), Art 49 (arrependimento 7 dias) |
| [BIANCA-MURTA] | Adv. Bianca Murta (OAB-SP 483.460) | Prática de saldo bloqueado, threshold de judicialização |
| [TARCISIO] | Prof. Dr. Tarcisio Teixeira | Responsabilidade solidária do marketplace |
| [STJ-JURIS] | Jurisprudência STJ majoritária | Marketplace responde solidariamente |
| [INFERRED] | Inferência de pattern + lógica econômica | Todas as probabilidades e custos por evento |
| [ML-POLICY-CHANGES] | Aviso de volatilidade | Política ML pode mudar sem aviso |
