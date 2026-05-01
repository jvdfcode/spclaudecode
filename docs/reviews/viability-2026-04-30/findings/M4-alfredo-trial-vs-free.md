# M4 — @alfredo-soares: Trial 14 dias vs Free tier eterno

**Specialist:** @alfredo-soares (NÃO-MeliDev — SaaS B2B PME)
**Comando:** *pricing-fit free-vs-trial
**Data:** 2026-05-01

## Estado atual
- **SmartPreço:** free tier eterno (5 SKUs + 10 buscas/mês) + Pro R$39-59 A/B/C + Agency R$149
- **Mercado SaaS PME ML:** 100% dos concorrentes ML usam trial 7-30 dias (M2 mapping)
  - Nubimetrics: trial 14 dias
  - Real Trends: trial 30 dias
  - Hunter Hub: trial 7 dias
  - JoomPulse: trial grátis
  - Olist: trial 30 dias

**SmartPreço é o único do segmento operando free tier eterno.** Isso é decisão estratégica intencional ou herança de assumir que "free atrai mais"?

## Análise comparativa

### Free tier eterno — prós/contras

**Prós:**
- Zero fricção pra cadastro inicial — usuário não precisa "decidir" antes de testar
- Educação de mercado — usuário aprende o produto antes de pagar
- Lead magnet permanente — gera tráfego SEO ("calculadora ML grátis") indefinidamente
- Comunidade de não-pagantes vira advocates (caso Loja Integrada — usuários free recomendavam para amigos que viravam pagantes)

**Contras:**
- **Cria hábito de não pagar** — usuário se acostuma com versão limitada e racionaliza "está bom assim"
- **Conversão histórica free→paid em SaaS B2B PME = 1-3%** [INFERRED com base em Loja Integrada/G4]
- Custo operacional permanente (servidor, suporte free) sem retorno garantido
- 5 SKUs é generoso demais — vendedor PME ML típico tem 10-50 SKUs, e os 5 do free podem cobrir os SKUs de teste, deixando os reais "pra depois"

### Trial 14 dias — prós/contras

**Prós:**
- **Força ativação** — usuário sabe que precisa extrair valor antes do dia 14
- **Conversão histórica trial→paid = 15-30% se onboarding bom** [INFERRED com base em Loja Integrada/G4 + benchmarks SaaS Profitwell/Paddle]
- Cria urgência saudável — vendedor cadastra os SKUs reais (não os de teste)
- Filtro de seriedade — só assina trial quem tem intenção real de avaliar pra comprar

**Contras:**
- Fricção inicial — usuário precisa cadastrar cartão (ou aceitar que vai ter que decidir em 14 dias)
- Vendedor pode "esquecer" e abandonar antes de ver valor
- Sem feature pública grátis = sem lead magnet SEO permanente
- Vendedor casual (1-2 vezes/trimestre) é mal atendido pelo trial — ele precisa do produto sazonalmente

### Híbrido (proposta concreta)

**Modelo proposto:**
- **Calculadora pública grátis (sem login)** em `/calculadora-livre` — lead magnet SEO permanente; resolve necessidade casual
- **Trial 14 dias do Pro completo (com login)** — força ativação para quem quer mais que a calculadora pública
- **Fallback para Free 5 SKUs após trial** — não trava o usuário, mas perde os recursos Pro

Isso preserva o melhor dos dois mundos: SEO permanente + força de ativação.

## Comparação numérica (assumir 100 visitas/semana = 400/mês — baseline arbitrário [INFERRED])

| Modelo | Visit→cadastro | Cadastro→paid | Leads paid/mês | MRR mês 1 (R$49 médio) |
|--------|:---:|:---:|:---:|:---:|
| **Free atual** | 30% (120 cadastros) | 2% [INFERRED] | 2-3 paid | R$98-147 |
| **Trial 14d** | 15% (60 cadastros) | 22% [INFERRED] | 13 paid | R$637 |
| **Híbrido** | 30% public + 12% trial (48 trials) | 25% [INFERRED] | 12 paid | R$588 |

**Notas metodológicas:**
- 30% visit→cadastro no free assume que 70% saem na barreira do "cadastrar pra que se tem grátis sem login?"
- 15% visit→cadastro no trial assume fricção de cartão/decisão
- 22% trial→paid é benchmark B2B SaaS com onboarding decente; 30% é teto otimista
- Híbrido tem 2 funis: calculadora pública (SEO) + trial Pro (ativação real)
- **Trial 14d gera 4-6x mais MRR mês 1 que o free atual** com mesmo tráfego

[INFERRED] — todos os números são projeções, não dados reais. SmartPreço tem zero histórico de conversão paga.

## Findings

### #1 — Free tier eterno está deixando R$500-600/mês na mesa em MRR
**Severidade:** ALTA
**Evidência:** Cálculo da tabela acima mostra delta de R$490-540/mês entre Free e Trial 14d com 100 visitas/semana. Em 6 meses, isso é R$3.000-3.250 não-realizados. [INFERRED]
**Recomendação:** A/B testar Trial 14d como variante D do `pricing-experiment.ts`. Não retire o free imediatamente — teste primeiro.

### #2 — Calculadora pública (já existe em `/calculadora-livre`) deveria ser SEPARADA do free tier do Pro
**Severidade:** ALTA
**Evidência:** Hoje, a calculadora-livre é usada como "demo" do produto, mas o cadastro free dá 5 SKUs + 10 buscas — sobreposição de promessa. O modelo híbrido proposto resolve: calculadora pública sem login (SEO + lead magnet) + trial Pro com login (ativação real). [INFERRED + análise de `pricing-experiment.ts`]
**Recomendação:** Manter `/calculadora-livre` como ferramenta pública sem cadastro. Substituir o "Free 5 SKUs com cadastro" por "Trial 14 dias Pro com cadastro".

### #3 — 5 SKUs no free é generoso demais para o ICP
**Severidade:** MÉDIA
**Evidência:** O ICP declarado é "vendedor 5+ SKUs". Se o free dá 5 SKUs, ele atende exatamente o piso do ICP — então o usuário entra no free e fica satisfeito. Para forçar conversão, o free deveria atender abaixo do ICP (1-2 SKUs) ou simplesmente não existir como tier de cadastro. [INFERRED]
**Recomendação:** Se manter free, reduzir para 1-2 SKUs. Se mudar para trial, eliminar o tier free pago de cadastro.

### #4 — Vendedor sazonal (1-2 usos/trimestre) é mal atendido por ambos os modelos
**Severidade:** BAIXA
**Evidência:** Vendedor que reprecifica em janeiro e julho não cabe no trial 14d (timing errado) nem no free 5 SKUs (não suporta volume real). [INFERRED]
**Recomendação:** Considerar plano "pay-per-use" (R$X por cálculo avulso) como tier 4 — atende casual sem desvalorizar Pro mensal. Não obrigatório agora, mas notar para sprint futuro.

## Recomendação

**Migrar para HÍBRIDO:**
1. Manter `/calculadora-livre` pública (SEO + lead magnet permanente)
2. Substituir "Free 5 SKUs com cadastro" por "Trial 14 dias Pro com cadastro"
3. Após trial expirar, fallback para versão limitadíssima (1 SKU + sem buscas) ou lockout total — testar ambos
4. Adicionar variante D no `pricing-experiment.ts` cobrindo Trial 14d

**Não retirar o free imediatamente.** A/B test primeiro. Migração disruptiva sem dado é tiro no escuro — o ratio 4-6x do MRR é hipótese, não evidência.

## Veredito

O modelo atual (free tier eterno) é **inadequado para o segmento** — viola padrão de mercado (100% dos concorrentes ML usam trial), cria hábito de não-pagamento, e sub-precifica WTP do ICP. A migração para Trial 14d (ou híbrido) é tese forte com benchmark histórico (Loja Integrada). Mas sem dados primários do SmartPreço, é decisão baseada em evidência indireta.

## Nota 5/10

**Justificativa:** A análise tem direção clara (trial > free para B2B PME ML), benchmark de mercado (5 concorrentes usam trial), e proposta acionável (modelo híbrido + variante D no A/B test). Perde pontos porque: (a) 100% dos números são [INFERRED]; (b) zero dados de conversão real do SmartPreço; (c) decisão de migrar pode prejudicar SEO se mal executada. A nota sobe para 8/10 quando A/B test rodar 90 dias e gerar dado real.

## Sources

| Tag | Fonte | Uso |
|-----|-------|-----|
| [INFERRED com base em Loja Integrada/G4] | Experiência Alfredo Soares (founder Loja Integrada, sócio G4) | Ratio 3-5x trial vs free; conversão 1-3% free vs 15-30% trial |
| [INFERRED] | Benchmarks SaaS B2B (Profitwell, Paddle, ChartMogul) | Faixas de conversão trial→paid para B2B SaaS |
| [M2 Concorrência] | docs/reviews/viability-2026-04-30/findings/M2-strategist-pricing-vs-concorrentes.md | 5 concorrentes ML usam trial |
| [Roundtable Alfredo] | docs/reviews/viability-2026-04-30/roundtable/07-alfredo.md | Posição prévia: free cria hábito de não pagar |
| [Code] | src/lib/pricing-experiment.ts | Estado atual do A/B test (Free + Pro A/B/C + Agency) |

— Alfredo Soares, SaaS B2B | Comunidade > Feature.
