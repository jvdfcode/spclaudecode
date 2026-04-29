# Bruno Nardon — Análise de Growth & Escala

> "Zona de conforto é onde negócios morrem. Bora ver se o SmartPreço está confortável demais."

---

## Veredito (1 frase)

Produto tecnicamente competente pagando dívida de infra enquanto ignora as perguntas que realmente matam startups: quem compra, como chega até eles, e por quanto.

---

## 3 Fortalezas

1. **Produto resolve dor real e específica.** Vendedor ML com margem invisível é um problema de 1 milhão de pessoas no Brasil. Calculadora de custo real com simulador de cenários é proposta de valor clara — produto sem preguiça de resolver a dor. Isso é raro.

2. **Stack moderna escolhida com critério.** Next.js 14 App Router + Supabase + RLS extensivo + CI com gate de type-drift. Equipe pequena que entende que velocidade sustentável vem de base sólida. Não é luxo — é estratégia.

3. **Motor de cálculo financeiro testado.** NFR08 fala em 70% de cobertura nas funções de cálculo. A funcionalidade central do produto está protegida por testes. Se o MVP for pivot-testado, pelo menos a lógica que importa não regride. Dados > intuição — aqui funciona.

---

## 5 Fraquezas / Gaps de growth

1. **Canal de aquisição: campo em branco.** O PRD tem 20 FRs e 10 NFRs. Nenhum FR ou NFR fala de como o vendedor ML descobre o SmartPreço. Produto sem distribuição morre — e o discovery inteiro não tocou nisso.

2. **ICP não validado monetariamente.** O PRD define ICP como "vendedores ML pequenos e médios". Mas não existe uma linha nos 4 documentos que diga: "testamos com 10 sellers, 3 pagaram R$X/mês por isso". Intuição não é dado. Pivotar é sobreviver — mas é impossível pivotar sem saber de onde você saiu.

3. **Pessoas e processos: ausência total no discovery.** O brownfield cobriu 100% de tech. Zero sobre time (quantas pessoas, senioridade, capacidade de execução), zero sobre processo de vendas, zero sobre suporte ao cliente. A fórmula é Pessoas > Processos > Tecnologia. Aqui invertemos a pirâmide.

4. **1 sprint inteiro pagando débito técnico antes de validar receita.** 14 quick wins + Bloco H + Bloco E' = sprint atual. Isso é sensato para produto em produção com base de clientes pagantes. Mas se o ICP ainda não pagou, cada hora nesse sprint é hora que não foi para testar se alguém abre a carteira. Velocidade é vantagem competitiva — e estamos gastando ela no lugar errado se o ICP não está validado.

5. **IA: pré-condições não checadas.** O produto integra a API do ML para busca real de preços (Bloco Mercado). Isso é IA/dados em produção. As 3 perguntas obrigatórias antes de IA: dados organizados? processos documentados? equipe pronta? O discovery não responde nenhuma das três. DEBT-DB-H2 (N+1 em `listSkus`), DEBT-DB-C2 (cache sem alarme), DEBT-M3 (rateLimit sem JSDoc) sugerem que a resposta é "não" para todas. IA amplifica quem já é bom — e quem ainda está organizando a casa amplifica o caos.

---

## Diagnóstico 4 quadrantes (impacto dos débitos)

**Aquisição: 0 débitos diretos | impacto indireto ALTO**

Nenhum dos 54 débitos endereça aquisição porque o discovery não perguntou. Mas DEBT-FE-9 (metadata ausente nas rotas auth) e DEBT-FE-2 (i18n hardcoded pt-BR) têm impacto em SEO e expansão de mercado — os dois canais mais prováveis para um SaaS B2B small business. Canal ignorado = aquisição por acidente.

**Ativação: 8-10 débitos | impacto ALTO**

DEBT-FE-NEW-5 (WelcomeTour não integrado ao estado real), DEBT-FE-4 (MarketSearch sem loading visual), DEBT-FE-11 e DEBT-FE-12 (componentes monolíticos de 400+ LOC que dificultam UX iterativa), DEBT-FE-NEW-6 (empty states inconsistentes), DEBT-FE-NEW-7 (toast 3s para mensagens importantes), DEBT-M1 (Server Actions retornam error.message cru). Ativação é o momento em que o usuário entende o valor do produto — e o discovery encontrou pelo menos 8 débitos que tornam esse momento confuso ou quebrado.

**Retenção: 6-8 débitos | impacto CRÍTICO**

DEBT-DB-C3 (race condition OAuth ML quebra busca de preços de forma não determinística), DEBT-DB-H3 (rate limiting fail-open = indisponibilidade sob carga), DEBT-DB-H4 (rate_limit_log crescimento ilimitado = degradação progressiva), DEBT-H3 (Sentry Edge = 0 = falhas invisíveis em produção), DEBT-H6 (sem testes integration/e2e = regressões chegam ao usuário). Um produto que quebra de forma intermitente na funcionalidade central não retém ninguém. Churn por bug é o pior churn — o usuário não reclama, some.

**Monetização: 0 débitos | brecha ESTRATÉGICA**

Nenhum débito de monetização porque o produto não tem modelo de monetização documentado no discovery. Sem paywall, sem plano, sem pricing, sem experimento de conversão. O PRD não tem uma linha sobre pricing. Produto pronto, monetização: campo em branco. Isso não é débito técnico — é débito de produto.

---

## Bullseye Check

**Canal declarado: nenhum dos 19.**

O Bullseye Framework exige testar os 19 canais possíveis (SEM/SEO, content marketing, viral, sales, parcerias, etc.) para encontrar o canal principal. O discovery — 4 documentos, 54 débitos catalogados — não menciona uma única palavra sobre como o vendedor ML vai descobrir o SmartPreço.

Para um SaaS B2B small business voltado a vendedores ML, os canais mais prováveis seriam: (1) **SEO** com conteúdo sobre "como calcular taxa ML" e "calculadora Mercado Livre", (2) **Comunidades** — grupos de WhatsApp e Facebook de vendedores ML onde a dor é discussão diária, (3) **Parceria com agregadores** de ferramentas para sellers ML (Bling, Olist, Nuvemshop). Mas isso é hipótese, não dado. E o discovery não gerou nem a hipótese.

Produto sem canal declarado não escala — pivotar é sobreviver, mas sem canal você não sabe para onde pivotar.

---

## Pessoas > Processos > Tech

**O discovery cobriu 1 dos 3 pilares. Risco de inverter a pirâmide.**

| Pilar | Cobertura no discovery | Gaps identificados |
|-------|----------------------|-------------------|
| **Tecnologia** | 100% — 54 débitos, 4 camadas, roadmap de 6 sprints | Coberto em excesso |
| **Processos** | 0% | Processo de vendas, onboarding, suporte, feedback loop com usuário: nenhum |
| **Pessoas** | 0% | Tamanho do time, senioridade, capacidade de execução: nenhum |

O assessment assume "equipe pequena (1-3 devs)" (Seção 8, Suposição 3). Isso é a única menção ao pilar Pessoas em todo o discovery. Time A contrata Time A — mas o discovery não avaliou se o time atual tem capacidade de executar 6 sprints de paydown enquanto valida ICP e constrói canal. Esse é o risco real de execução.

---

## 3 Recomendações

1. **Antes do próximo sprint de tech, fazer 10 entrevistas de ICP.** Não é pesquisa — é validação. Perguntar: "você paga por ferramenta de gestão hoje?", "quanto?", "o que faria você pagar pelo SmartPreço?". Sem isso, cada sprint de tech é apostas no escuro. Dados > intuição — e agora a intuição está guiando o roadmap inteiro.

2. **Definir 1 canal de aquisição prioritário e medir em 30 dias.** SEO para "calculadora taxa Mercado Livre" é hipótese testável em 2 semanas com 3 posts de conteúdo. Comunidades de vendedores ML no Facebook/WhatsApp são testáveis esta semana com custo zero. Escolha um, meça, decida. Produto sem distribuição morre — e o relógio está rodando.

3. **Criar um "pricing page" antes de terminar o H1 técnico.** Não precisa ser o modelo definitivo. Precisa existir para você aprender. Um vendedor ML que usa a ferramenta e vê "R$29/mês para acesso completo" vai te dizer mais sobre ICP em 1 semana do que 6 sprints de tech discovery. Estágio é MBA grátis — mas só se você fizer os experimentos.

---

## Veto Nardon

**O roadmap atual é um sprint inteiro esquentando assento sem validar distribuição ou ICP.**

14 quick wins + Bloco H (race conditions) + Bloco E' (A11y) = sprint atual completo. Esses fixes são necessários para um produto em produção com usuários pagantes. Mas o discovery não prova que o SmartPreço tem usuários pagantes. Se não tem, esse sprint está pagando dívida técnica de um produto que ainda não validou se alguém abre a carteira por ele.

A ordem correta não é "corrige o tech, depois vai para o mercado". A ordem é "valida que alguém paga, depois escala com tech sólido". Zona de conforto para devs é refatorar em vez de ligar para o cliente. O roadmap atual cheira a zona de conforto.

**DEBT-FE-NEW-5** (WelcomeTour não integrado ao estado real) é o símbolo do problema: existe um tour de onboarding que não sabe se o usuário já usou o produto de verdade. Isso é metáfora perfeita — o produto ainda não tem dados reais de uso para guiar as próprias decisões.

Bora sair da zona de conforto.

---

*— Nardon, zona de conforto é onde negócios morrem 🚀*

---

*Gravação confirmada. Análise produzida em 2026-04-27 com base nos 4 documentos do Brownfield Discovery: `technical-debt-assessment.md` (Fase 8), `TECHNICAL-DEBT-REPORT.md` (Fase 9), `EPIC-TD-001-debt-paydown-h1.md` (Fase 10), `PRD §1-2` (metas, contexto, requisitos).*
