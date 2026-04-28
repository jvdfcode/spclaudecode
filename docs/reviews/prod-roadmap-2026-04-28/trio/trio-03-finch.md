# Thiago Finch — Auditoria Funnel-First do PROD-001

> "Engenharia que não move o funil é hobby caro. Mostra o lead que entra ou não passa."

## Veredito

**NEEDS WORK** — O sprint coloca o app no ar mas NÃO instrumenta os 4 eventos de funil que tornam os "10 leads em 30 dias" do MKT-001 mensuráveis. Sem essa instrumentação, você vai ao ar cego: sabe que alguém entrou mas não sabe onde abandonou. É como abrir loja sem caixa registradora.

## Custo de NÃO ir ao ar (loss aversion calibrado)

Alex estima 20-50 cálculos/dia em aquisição orgânica inicial conservadora:

- **1 semana sem produção** = 140-350 eventos de funil perdidos permanentemente; ~7-15 leads potenciais (assumindo 5% de conversão cálculo→email) que nunca voltam
- **1 mês sem produção** = 600-1.500 eventos perdidos; ~30-75 leads que alimentariam ICP-validation e calibrariam o A/B test de pricing
- **Custo de atraso por hora de sprint gasta em non-funnel work** = R$ 0 de ROI por hora. Cada hora gasta em story que não move topo/meio/fundo tem custo de oportunidade de ~2-3 leads/semana que seriam capturados se o time priorizasse instrumentação

O loss aversion está corretamente calibrado no epic — o custo de NÃO ir ao ar é real e cumulativo. O problema não é "ir ou não ir" — é ir SEM dado de funil.

## 3 Fortalezas (o que move funil)

1. **PROD-001-10 (/privacidade + CTA Lead Magnet)** — Move fundo de funil diretamente. Sem ela, zero leads. Com ela, o primeiro lead entra. Conversão habilitada. ROI por hora altíssimo.
2. **PROD-001-3 (migrations leads + funnel_events)** — Sem as tabelas `leads` e `funnel_events`, o funil não persiste dado nenhum. É infraestrutura de conversão, não débito técnico.
3. **PROD-001-9 (DNS + domínio real)** — `smartpreco.app` no ar com SSL = topo de funil habilitado. Sem domínio, zero visitas orgânicas, zero tração. Cada dia sem domínio apontado é dia sem indexação Google.

## 3-5 Fraquezas (engenharia que não move ponteiro)

1. **PROD-001-4 (Parametrizar SUPABASE_PROJECT_ID)** — Higiene de CI. Não move topo, meio ou fundo. O hardcoded funciona hoje. É débito técnico legítimo travestido de "bloqueador de produção". Poderia ser backlog pós-GO sem impacto no funil.
2. **PROD-001-7 (CRON_SECRET)** — Protege endpoint de cleanup de cache ML. Correto, mas o cache ML não é o funil. Se alguém abusar do cron, o impacto é em cota ML, não em conversão. Prioridade BAIXA vs. instrumentação de eventos.
3. **PROD-001-12 (A11y fixes)** — Marcada como "deferred" mas está no sprint. Move conversão? Parcialmente (touch targets em mobile afetam tap no CTA). Mas sem instrumentação de funil para medir abandono, você não sabe se o fix muda algo. Coloque a instrumentação ANTES do fix para ter baseline.
4. **PROD-001-2 (types fix)** — Necessário para build, OK. Mas é pré-condição técnica, não move funil por si só. Custo de 1h justificado apenas porque sem build não há deploy. Tração zero direta.

## Mapa funil x stories

| Story | Topo (visita) | Meio (lead) | Fundo (paid) | Move funil? |
|-------|:---:|:---:|:---:|:---:|
| PROD-001-1 (Decisão Supabase) | — | — | — | NÃO — gate técnico |
| PROD-001-2 (types fix) | — | — | — | NÃO — pré-condição build |
| PROD-001-3 (migrations) | — | SIM | — | SIM — habilita persistência de leads |
| PROD-001-4 (parametrizar ID) | — | — | — | NÃO — higiene CI |
| PROD-001-5 (Vercel link) | SIM | — | — | SIM — habilita deploy = visita possível |
| PROD-001-6 (env vars) | — | — | — | NÃO — pré-condição runtime |
| PROD-001-7 (CRON_SECRET) | — | — | — | NÃO — segurança de endpoint interno |
| PROD-001-8 (deploy preview) | SIM | — | — | SIM — valida que topo funciona |
| PROD-001-9 (DNS domínio) | SIM | — | — | SIM — topo de funil ativado |
| PROD-001-10 (/privacidade + CTA) | — | SIM | — | SIM — meio de funil ativado |
| PROD-001-11 (smoke test + Sentry) | — | — | — | NÃO — observabilidade (importante mas não é conversão) |
| PROD-001-12 (a11y fixes) | — | SIM | — | PARCIAL — touch target melhora tap no CTA mobile |

**Resultado: 5 de 12 stories movem funil diretamente. 7 são infraestrutura/pré-condição.** O ratio é aceitável para um sprint de "ir ao ar" — MAS falta a story que conecta tudo: instrumentação dos 4 eventos de funil.

## OMIE check

- [x] Concorrência observada antes do lançamento? **NÃO.** `concorrencia-2026-Q2.md` é 100% template vazio. Zero concorrentes mapeados. Zero pricing de mercado verificado. O sprint inteiro vai ao ar com posicionamento e copywriting baseado em HIPÓTESE não verificada. O diferencial "scraping ML + cálculo de taxas" nunca foi comparado com o que já existe. Estamos lançando cego.
- [ ] Pricing calibrado contra mercado real? **NÃO.** A/B test com variantes R$39/49/59 é chute declarado (Alex confirma: WTP em branco, zero entrevistas). Sem OMIE, pricing é loteria.
- [ ] Mensagem de aquisição testada? **NÃO.** Nenhum teste de copy, nenhum teste de CTA, nenhum dado de qual mensagem ressoa com o ICP (que também é template vazio).

## 3 Recomendações concretas (Funnel-First)

1. **PRIORIZAR (ADICIONAR): Story de instrumentação dos 4 eventos de funil** — `calculo_iniciado → resultado_exibido → cta_clicado → email_submetido`. Sem esses 4 eventos rastreados (Vercel Analytics custom events ou equivalente), os "10 leads em 30 dias" do MKT-001 são métrica de vaidade. Você saberá QUANTOS leads mas não ONDE o funil quebra. Alex (problema 3) classifica isso como ALTO: "cada semana de funil sem eventos rastreados é dado perdido permanentemente." Esforço: 2-3h. ROI por hora: o mais alto do sprint inteiro.

2. **DEPRIORIZAR: PROD-001-4 (parametrizar project-id) e PROD-001-7 (CRON_SECRET)** — Ambas são higiene técnica que pode ir para sprint seguinte sem impacto em conversão. O hardcoded funciona, o cron sem secret não mata leads. Isso libera 2h para a instrumentação de funil acima.

3. **ADICIONAR: Evento de atribuição UTM no topo** — Se o sprint não rastrear de ONDE vem a visita (utm_source, utm_medium, utm_campaign persistidos em `funnel_events`), você não sabe qual canal de aquisição funciona. O MKT-001 exige "pelo menos 1 canal testado com métrica de conversão". Sem UTM persistido, essa métrica não existe. Custo: 30min (ler query params e persistir junto ao evento). Loss aversion: sem isso, 30 dias de tráfego orgânico sem saber a origem = impossível decidir canal de H2.

---

**Resumo Finch:** O sprint está 70% correto — coloca o app no ar, resolve LGPD, habilita leads. Mas comete o erro clássico de "lançar sem caixa registradora": o funil existe mas não é instrumentado. O custo de atraso de 1 semana sem instrumentação é irreversível — são 140-350 eventos sem diagnóstico de onde o funil quebra. OMIE zero (concorrência não observada) é risco de posicionamento mas não bloqueia ir ao ar. A instrumentação de funil SIM bloqueia qualquer decisão inteligente pós-lançamento. Adicione a story de eventos, depriorize higiene técnica, e o sprint vira máquina de tração.
