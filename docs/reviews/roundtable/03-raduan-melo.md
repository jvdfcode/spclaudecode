# Raduan Melo — Análise Estratégica & Comercial

> "Que cirurgia o SmartPreço faz? Antes de pagar débito técnico, quero ver a falha de mercado."

---

## Veredito (1 frase)

O SmartPreço tem uma faquinha cirúrgica afiada — calcular custo real para vendedor de ML — mas o discovery só abriu o paciente pela barriga técnica; ninguém examinou o coração do negócio.

---

## 3 Fortalezas (lendo do discovery)

1. **Cirurgia específica e repetível.** O PRD define com precisão o que o produto faz: parte do custo real, simula cenários, compara mercado, entrega decisão de preço. Não é uma calculadora genérica — é um sistema de decisão comercial para um ICP estreito (PME no Mercado Livre Brasil). Cirurgia estreita é difícil de copiar e fácil de cobrar por overdelivery.

2. **Motor de cálculo testado é ativo estratégico.** O discovery confirma: "Motor de cálculo de viabilidade testado — lógica de negócio central validada e coberta por testes." Isso significa que a proposta de valor central não é promessa — é entregável. Em B2B SaaS de nicho, credibilidade vale mais que patrimônio: quem entrega o cálculo certo primeiro, define o benchmark do mercado.

3. **Stack moderna com custo operacional baixo.** Next.js 14 + Supabase + Vercel = time de 1-3 devs operando com infraestrutura de scale-up. Margem operacional preservada para frentes comerciais. Excelência operacional aqui é real: o produto pode crescer sem crescer o time proporcionalmente — antifragilidade estrutural.

---

## 5 Fraquezas / Gaps comerciais

1. **A falha de mercado não está documentada.** O discovery catalogou 54 débitos técnicos e zero evidências de validação comercial. Por que o vendedor de ML não é atendido pela planilha Excel, pela calculadora do ML ou por um concorrente direto? Qual é a dor urgente — o paciente está sangrando agora ou apenas desconfortável? Sem isso, pagar débito técnico é cirurgia eletiva em paciente que talvez não precise operar.

2. **ICP não está qualificado por urgência e willingness to pay.** O PRD descreve o perfil (PME no ML Brasil), mas o discovery não traz: qual o tamanho do portfólio médio do ICP, qual a frequência de precificação, quanto ele paga hoje por ferramentas similares, qual a dor que o faz trocar de ferramenta agora. Sem as 7 perguntas respondidas — ICP, dor, urgência, concorrência, TAM, valor, timing — a estratégia comercial é suposição.

3. **Posicionamento não está declarado.** Pelo discovery, o SmartPreço não escolheu explicitamente entre os três posicionamentos de Treacy & Wiersema. Age como Liderança em Produto (motor de cálculo, decisão integrada), mas o backlog tem i18n (DEBT-FE-2), expansão internacional, e decomposição de monolíticos — sinais de quem tenta ser tudo para todos. Estrutura segue estratégia: se o posicionamento não está claro, o backlog vira fila de desejo.

4. **Race conditions em produção são risco de receita direto, não só técnico.** DEBT-DB-H3 + DEBT-DB-C3 não são problema de engenharia — são problema comercial. Rate limiting ineficaz = custos de API ML fora de controle = margem destruída. OAuth quebrado = busca de preços falha de forma não determinística = churn do cliente que pagou para ver o mercado e não viu. Nenhum argumento comercial justifica adiar o Bloco H. ROI convexo: custo fixo de 2-3 dias, proteção de receita e margem indefinida.

5. **Governança e estratégia de go-to-market invisíveis.** O discovery cobriu exclusivamente a dimensão Processos/Tech do PWR Auditing. Não há dado sobre modelo de pricing (assinatura? freemium? por SKU?), canal de aquisição, ciclo de venda, métricas de retenção ou estrutura societária. Para um produto em estágio MVP com débito técnico material, a pergunta que falta é: existe tração comercial que justifique pagar 6-7 sprints de débito técnico agora?

---

## Diagnóstico das 7 dimensões PWR

| Dimensão | Cobertura no discovery | Gap identificado |
|----------|----------------------|-----------------|
| **Financeiro** | Não coberto | Sem dados de MRR, CAC, LTV, burn rate ou model de pricing. Impossível calcular ROI do paydown sem esse número. |
| **Comercial** | Não coberto | ICP descrito mas não validado por urgência e WTP. Concorrência não mapeada com profundidade. Canal de aquisição ausente. |
| **Pessoas** | Parcialmente implícito | "Equipe 1-3 devs" é suposição do assessment (Seção 8, Suposição 3). Não há dado sobre senioridade, velocidade real de entrega ou capacidade de absorver 6-7 sprints de débito. |
| **Processos** | Coberto (única dimensão) | 54 débitos catalogados com evidência arquivo:linha. Roadmap H1/H2/H3 estruturado. Esta é a dimensão mais madura do discovery. |
| **Cultura** | Não coberto | Sem dado sobre ritmo de tomada de decisão, tolerância a risco ou velocidade de execução do fundador. Cultura come estratégia no café da manhã — se o time não tem disciplina de sprint, o Bloco H vira wishlist. |
| **Estratégia** | Ausente | Posicionamento não declarado. Horizonte de produto não declarado (quando sair do MVP? qual o evento de maturidade?). Bloco G (i18n) está no backlog sem validação estratégica — o PM mesmo anotou "validar com business". |
| **Governança** | Não coberto | Sociedade, cap table, decisões de priorização (quem aprova o roadmap?) e processo de alinhamento entre produto e negócio não foram capturados. |

---

## 3 Recomendações (ROI comercial)

1. **Execute o Bloco H antes de qualquer outra coisa — é risco convexo puro.** Custo fixo: 2-3 dias de dev. Upside: protege margem contra DDoS e custos de API ML sem teto, e elimina churn por falha não determinística no fluxo central do produto. Downside de adiar: o primeiro incidente de custo ML fora de controle ou OAuth quebrado em produção custa mais em dano reputacional e investigação do que os 2-3 dias de fix. DEBT-DB-H3 + DEBT-DB-C3 não são dívida técnica — são passivo financeiro latente.

2. **Antes do H2, faça o discovery comercial que o brownfield não fez.** Entrevistar 10 vendedores do ICP com as 7 perguntas: qual a dor hoje (urgência), qual a solução atual (concorrência), quanto pagaria (WTP), qual o portfólio médio (TAM individual), o que faria trocar de ferramenta agora (timing). Com esse dado em mãos, o Bloco G (i18n, 2-3 sprints) ou confirma ou some do roadmap. Sem validação, i18n é invenção de produto sem cliente.

3. **Declare o posicionamento e use-o como filtro de backlog.** Se o SmartPreço é Liderança em Produto (o melhor motor de decisão de preço para ML Brasil), então cada item do backlog passa pelo teste: "isso torna nossa cirurgia mais precisa ou mais ampla?" Decomposição de monolíticos (Bloco D) passa — habilita velocidade de entrega. i18n sem validação (Bloco G) não passa — amplia escopo sem aprofundar posicionamento. Mediocridade é o inimigo: produto que tenta ser tudo para todos não faz nenhuma cirurgia bem.

---

## Veto Raduan

O discovery é impecável na dimensão técnica e completamente cego nas outras seis. Pagar 6-7 sprints de débito técnico — incluindo blocos médios e longos — sem antes confirmar que existe tração comercial e willingness to pay no ICP é jogar dinheiro fora. O Bloco H (race conditions) e os quick wins de um dia: execute agora, sem hesitar, ROI imediato e claro. O resto do roadmap H2/H3? Condicione à resposta de três perguntas que o discovery não fez: o cliente está sangrando? ele paga para parar de sangrar? quantos clientes assim existem no Brasil? Se a resposta for sim, sim, e grande o suficiente — aí a estrutura técnica segue a estratégia e o paydown faz todo sentido. Sem essa resposta, o Bloco D, F e G são elegância técnica em produto sem mercado confirmado.

---

*Raduan Melo — PWR Gestao — Roundtable SmartPreco — 2026-04-27*
