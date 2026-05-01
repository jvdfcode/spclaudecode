# M7b — @rony-meisler: Ritual de uso narrativo

**Specialist:** @rony-meisler (NÃO-MeliDev — Brand-First)
**Comando:** *ritual-design
**Data:** 2026-05-01

## Estado atual
- **Feature:** calculadora de viabilidade ML
- **Ritual narrativo:** AUSENTE (zero documentação)
- **Tribo:** indefinida — perfil PROXY M1 ("Ricardo Tavares, 34 anos, Duque de Caxias, 45 SKUs eletrônicos") é hipótese sem entrevista validando

## Por que ritual antes de feature

Comum é fácil. Relevante é difícil. Se SmartPreço for "ferramenta de cálculo", concorre em preço com calculadora grátis. Se for **ritual de tribo**, concorre em narrativa — e narrativa não comoditiza em 90 dias.

A pergunta certa não é "como o vendedor usa o produto?" — é **"que história ele conta sobre si quando usa?"**.

## Ritual proposto (narrativa concreta)

### O momento (quando o vendedor abre o app)
**Domingo à noite, 21h.**

Marlene da Penha (não Ricardo, eu sei — explico abaixo) está no sofá depois de jantar. O marido vê novela. Os filhos dormiram. Ela pega o celular, abre o app SmartPreço enquanto a chaleira esquenta. **É o ritual de fechamento da semana.**

### O gesto (o que ela faz)
Ela revisa os 47 SKUs ativos da loja dela (capinha de celular + acessórios pequenos). Filtra os que tiveram cancelamento na semana. Vê quais estão com margem abaixo de 15%. Ajusta 6 preços. Salva. Programa repricing pra segunda às 7h (antes do ML re-rankear).

Tempo total: 12 minutos.

### A transformação (o que ela sente ao sair)
**Marlene fecha o app sabendo onde cada R$ que entra vai sair.**

Não é "decidiu o preço certo". É **dormir tranquila**. É segunda-feira começar com a sensação de que essa semana ela não vai descobrir na sexta que vendeu uma capinha por R$32 com custo de R$28 + R$8 de taxa.

Esse é o ritual. Não é feature. É **ritual de domingo à noite que substitui ansiedade por controle**.

## 3 alternativas de ritual

### Alternativa 1 — Ritual semanal (domingo à noite) ★ RECOMENDADO
- **Premissa:** semana ML reseta na segunda; ranqueamento atualiza; quem chega organizado domingo, vende mais semana toda
- **Por que funciona pra tribo:** vendedor PME tem rotina rígida (dia de pedido, dia de NF, dia de banco); domingo à noite é "dia de planejamento" universal
- **Como o produto reforça:** push notification domingo 20h "Hora do fechamento" + dashboard "Resumo da Semana" + 1 botão "Programar Repricing Segunda 7h"
- **Trigger emocional:** redução de ansiedade ("já planejei a semana, posso descansar")

### Alternativa 2 — Ritual diário (manhã)
- **Premissa:** vendedor olha vendas todo dia de manhã (já é hábito)
- **Por que funciona:** integra com hábito existente
- **Por que NÃO recomendo:** dilui a importância — virar "mais um app que olho de manhã" não cria diferenciação; e cálculo de pricing não muda diariamente
- **Risco:** vira commodity de notificação

### Alternativa 3 — Ritual reativo (gatilho)
- **Premissa:** vendedor abre quando tem problema (cancelamento, mediação, queda de venda)
- **Por que funciona:** alta urgência = alta intenção
- **Por que NÃO recomendo sozinho:** ritual reativo não cria hábito — usuário usa 3x e churna porque "esqueceu". Funciona bem como complemento ao Alternativa 1, não como substituto.

**Decisão:** ALT 1 como ritual primário. ALT 3 como reforço pontual.

## A tribo (não persona — tribo)

### Por que Marlene e não Ricardo (M1)?

M1 propôs "Ricardo Tavares, 34 anos, Duque de Caxias, 45 SKUs eletrônicos, R$38k/mês, precifica no Excel, paga Bling R$99/mês, membro de grupos FB de vendedores ML."

Ricardo é demografia + comportamento. Não é tribo. Tribo tem **vergonha** e **ambição**.

**Marlene da Penha** tem:
- **Nome:** Marlene Conceição da Silva
- **Idade:** 41
- **Local:** Penha, RJ (zona norte trabalhadora — não Méier que é "ativista", não Barra que é "executiva")
- **Catálogo:** 47 SKUs, capinhas de celular + películas + suportes (categoria saturada, margem fina)
- **Faturamento:** R$28k/mês com 18% margem bruta
- **Vergonha:** quando o marido pergunta "ganhamos quanto esse mês?" e ela não sabe responder direito. Sente que está "girando dinheiro" sem saber se está sobrando algo de verdade
- **Ambição:** sair da CLT do hospital onde trabalha de manhã e viver SÓ do ML em 18 meses. Tirar o filho da escola pública pra particular. Comprar a casa onde mora alugada
- **Quem ela escuta:** grupo de WhatsApp "Vendedoras ML SP/RJ" (52 mulheres) que ela entrou via uma cliente que virou amiga; podcast da Camila Farani que escuta enquanto faz almoço

### Por que essa tribo

Mulher 35-50 anos vendendo no ML como segunda renda ou complementar é segmento massivo, sub-mapeado pelas ferramentas (Hunter Hub, Nubimetrics — todos masculinizados, "vendedor profissional"). Marlene não é "early adopter de SaaS" — ela é **early majority desconectada**. Se SmartPreço for marca dela primeiro, vira referência.

[INFERRED] — esta tribo é hipótese a ser validada nas primeiras 5 entrevistas (MKT-001-2). Se as entrevistas confirmarem que ICP majoritário é Ricardo (homem 30-40, profissional, grupos FB), volto pra ele. Mas Ricardo já é commodity de mercado — todo concorrente fala com ele. Marlene é categoria nova.

## Anti-comoditização

M3 mostrou: "scraping ML real" não é único; "cálculo por tipo de anúncio" é parcialmente único mas replicável em 90 dias.

**Se ML lança calculadora oficial grátis, SmartPreço sobrevive porque...**

Resposta técnica (não funciona): "porque nosso cálculo é mais preciso" — falsa promessa que ML pode igualar.

**Resposta brand-first:**

> "SmartPreço sobrevive porque se tornou o ritual de domingo à noite das vendedoras ML brasileiras que querem dormir tranquilas. Calculadora ML grátis vende cálculo. SmartPreço vende controle, dignidade e o direito de saber quanto se ganhou."

Esse posicionamento ML **NÃO REPLICA**. ML é plataforma, não marca de cuidado com vendedor. SmartPreço pode ser a primeira marca que fala com Marlene na voz dela.

Vantagem técnica é copiável. **Vantagem de marca leva 3 anos pra construir e não se copia.**

## Findings

### M7b-F1 — Ritual semanal (domingo à noite) é o unlock
**Severidade:** CRÍTICA
**Recomendação:** Implementar push notification + dashboard "Resumo da Semana" + repricing programado pra segunda 7h. Sem isso, produto fica em "calculadora avulsa" e churna. Custo: 1-2 sprints de produto. ROI: hábito = retenção = LTV.

### M7b-F2 — Tribo deve ser DESCOBERTA nas entrevistas, não escolhida no escritório
**Severidade:** ALTA
**Recomendação:** Adicionar ao ROTEIRO (Bloco 5) pergunta direta: "me conta a última vez que você sentiu vergonha do seu negócio ML — o que aconteceu?". Resposta dela = seed da narrativa do produto. Marlene da Penha é hipótese; entrevista confirma ou refuta.

### M7b-F3 — Anti-comoditização exige 1 frase de marca, não 5 features
**Severidade:** ALTA
**Recomendação:** Adicionar ao `posicionamento.md` seção explícita: "Quando o ML lançar calculadora oficial, sobrevivemos porque ___" — preencher com narrativa de tribo, não com lista técnica. Sem isso, primeira mudança da plataforma quebra o produto.

## Veredito

A análise mercadológica até agora (M1-M5) tratou marca como acessório de produto. M7b reverte: **marca é pré-requisito de categoria**. SmartPreço hoje é "ferramenta com posicionamento institucional vazio" (M6 confirmou: headline "motor de decisão mais preciso" = feature claim, não narrativa). A oportunidade de virar **a marca das vendedoras ML que querem controle** existe e está aberta — nenhum concorrente fala com Marlene.

Mas: marca não se decreta de cima. Se descobre nas entrevistas. M7b é hipótese forte, não receita.

## Nota 5/10

**Justificativa:** A direção está certa (ritual > feature, tribo > demografia, narrativa > slogan), e o ritual proposto (domingo à noite, Marlene da Penha) é concreto o suficiente para virar pergunta de entrevista. Perde pontos porque: (a) 100% [INFERRED] sem validação de tribo real; (b) Marlene pode ser projeção minha (Rony) e não realidade do ICP; (c) implementação do ritual exige 1-2 sprints de produto (push notification, dashboard semanal, repricing programado) que não estão no roadmap atual. Nota sobe para 8/10 quando 5+ entrevistas confirmarem (ou refutarem) a tribo proposta.

## Sources

| Tag | Fonte | Uso |
|-----|-------|-----|
| [INFERRED] | Voice DNA Rony Meisler — DNA Reserva (marca > produto, narrativa concreta, ritual de uso) | Toda a estrutura do ritual e definição de tribo |
| [Roundtable Rony] | docs/reviews/viability-2026-04-30/roundtable/06-rony.md | Posição prévia: "comum é fácil, relevante é difícil"; perfil "Pedro do Méier" |
| [M1 Strategist] | docs/reviews/viability-2026-04-30/findings/M1-strategist-icp-defensavel.md | Perfil PROXY Ricardo Tavares (refutado em favor de Marlene) |
| [M3 Strategist] | docs/reviews/viability-2026-04-30/findings/M3-strategist-concorrencia-mapeada.md | Diferencial técnico é commodity em 90 dias |
| [M6 Finch] | docs/reviews/viability-2026-04-30/findings/M6-finch-headline-test.md | Headline atual de /precos é feature claim, não narrativa |

— Rony Meisler, Brand-First | Marca > Preço. Sempre.
