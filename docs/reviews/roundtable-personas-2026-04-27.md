# Roundtable — 6 perspectivas sobre o Brownfield Discovery do SmartPreço

**Data:** 2026-04-27
**Curador:** Orion (AIOX Master Orchestrator)
**Documento base:** `docs/architecture/technical-debt-assessment.md` (Fase 8) + `docs/reports/TECHNICAL-DEBT-REPORT.md` (Fase 9) + `docs/qa/qa-review.md` (Fase 7) + `docs/epics/EPIC-TD-001-debt-paydown-h1.md` (Fase 10)
**Análises individuais:** `docs/reviews/roundtable/01..06-*.md`

---

## Sumário executivo (1 parágrafo)

As 6 personas convergem em um diagnóstico inesperado: o **brownfield-discovery é tecnicamente impecável** (Pedro reconhece processo, Alan reconhece duas pepitas de ouro genuínas, Raduan reconhece cirurgia bem definida) **mas é comercialmente cego** — Raduan, Nardon, Finch e Tallis (4 das 6) **vetam o roadmap H2/H3** porque nenhum dos 54 débitos endereça canal de aquisição, ICP validado por willingness to pay, ou modelo de monetização. Há **consenso unânime em executar o Bloco H (race conditions críticas) imediatamente** — risco convexo puro: 2-3 dias de custo, proteção indefinida de margem e churn. As **divergências reais** são entre Pedro/Alan (querem reforçar processo e cortar volume do inventário) e o trio Raduan/Nardon/Finch (querem pausar o paydown depois do Bloco H e fazer 10 entrevistas de ICP antes de seguir). Tallis amarra os dois lados: instrumente o produto agora para gerar dados de mercado real enquanto o time vende.

---

## Rodada 1 — Análises individuais

> Cada persona fez sua leitura sem ver as outras. Documentos completos em `docs/reviews/roundtable/01..06-*.md`. Resumo abaixo.

### 01 — Pedro Valério (Process Absolutist)
**Veredito:** "Diagnóstico cirúrgico, remediação técnica sólida — mas o EPIC vai para produção sem DOD, sem veto condition explícita nos CRITICAL e com 14 quick wins voando soltos. Processo ainda permite erro."
**Aplaude:** gate type-drift no CI; mapa de dependências entre débitos; QA Gate com 12 mudanças obrigatórias.
**Critica:** quick wins sem DOD atômico nem owner pessoa-física; AC do epic não vira veto executável no CI; pre-commit hook de drift atrasado para H2.
**4 vetos explícitos:** rollback junto com migration 009 obrigatório; owner por quick win; DOD por story; teste de concorrência como job CI obrigatório.

### 02 — Alan Nicolas (Knowledge Architect)
**Veredito:** "Estrutura sólida com duas pepitas de ouro, mas dois terços do inventário é volume de máquina. QA Gate cheira a self-approval estrutural."
**Aplaude:** DEBT-DB-H3 + DEBT-DB-C3 com Trindade real (Playbook+Framework+Swipe); rastreabilidade arquivo:linha; remoção de DEBT-FE-13 como ato de curadoria.
**Critica:** DEBT-FE-2 (i18n) classificado CRITICAL sem evidência arquivo:linha; 33 itens de volume sem Playbook real; QA Gate é meta-revisão de documentação, não blind test de código.
**Pareto ao Cubo:** 0,8% genialidade = DEBT-DB-H3 + DEBT-DB-C3. 4% excelência = +5 IDs. 80% volume = ~33 itens.
**3 vetos:** DEBT-FE-2 como CRITICAL; 5 NEW-* sem Playbook; leitura do QA Gate como auditoria de código.

### 03 — Raduan Melo (Estrategista Comercial PWR)
**Veredito:** "O SmartPreço tem faquinha cirúrgica afiada — mas o discovery só abriu o paciente pela barriga técnica. Ninguém examinou o coração do negócio."
**Aplaude:** cirurgia específica e repetível (sistema de decisão para PME ML BR); motor de cálculo testado como ativo estratégico; stack moderna com margem operacional preservada.
**Critica:** falha de mercado não documentada; ICP não qualificado por urgência/WTP; posicionamento entre 3 portas (Treacy & Wiersema) não declarado; race conditions são passivo financeiro latente.
**Diagnóstico PWR (7 dimensões):** apenas Processos coberto. Financeiro/Comercial/Pessoas/Cultura/Estratégia/Governança = ausentes.
**Veto:** pagar 6-7 sprints de débito sem confirmar tração comercial é jogar dinheiro fora. Bloco H sim. Resto, condicione.

### 04 — Bruno Nardon (Growth & Escala G4)
**Veredito:** "Produto tecnicamente competente pagando dívida de infra enquanto ignora as perguntas que matam startups: quem compra, como chega, por quanto."
**Aplaude:** produto resolve dor real (vendedor ML com margem invisível); stack moderna escolhida com critério; motor de cálculo testado.
**Critica:** canal de aquisição = campo em branco; ICP não validado monetariamente; pessoas/processos = 0% no discovery; 1 sprint inteiro em débito antes de validar receita.
**4 quadrantes growth:** Aquisição = 0 débitos diretos / impacto indireto ALTO; Ativação = 8-10 com impacto ALTO; Retenção = 6-8 com impacto CRÍTICO; Monetização = 0 (porque pricing nem existe).
**Bullseye:** zero canal declarado nos 19 do framework. SEO/comunidades/parceria com agregadores = sequer hipóteses no discovery.
**Veto:** roadmap atual é zona de conforto técnica. Antes do próximo sprint: 10 entrevistas ICP, 1 canal de aquisição testado em 30 dias, página de pricing.

### 05 — Thiago Finch (Funnel-First)
**Veredito:** "SmartPreço tem motor de decisão real — mas zero funil de aquisição, zero pesquisa de concorrência, e um roadmap inteiro otimizando produto antes de provar que alguém chega até ele."
**Aplaude:** promessa funcional clara (substituir Excel); ICP definido implicitamente; diferencial técnico legítimo (scraping + cálculo de taxas).
**Critica:** funil de aquisição = zero; concorrência não modelada (OMIE não começa em Observar — saltou direto para construir); promessa fraca no nome ("SmartPreço" é nome, não promessa); WelcomeTour quebrado = funil interno quebrado; monetização ausente.
**Loss Aversion 2.5:1:** o discovery documenta a dor mas não quantifica. Sem "vendedor com 50 SKUs perde R$X/mês" não há urgência.
**Veto absoluto:** Bloco G (i18n) antes de funil = morte certa.

### 06 — Tallis Gomes [SINTETIZADO]
**Veredito:** "Tese forte e base técnica decente, mas está jogando defesa quando o campeonato exige ataque. 54 débitos catalogados, zero linhas sobre quem paga pelo produto."
**Aplaude:** tese validada na dor real (pricing ML é confuso por natureza); stack como ativo (8/10 arquitetura); cultura de execução incremental (M007, sonner, MobileDrawer resolvidos sem sprint formal).
**Critica:** ICP ausente em 100% do discovery; roadmap 100% defensivo, zero ofensivo; 6-7 sprints = momentum perdido para concorrente; observabilidade zero em produção (DEBT-H3, DEBT-DB-C2).
**Comparativo:** Easy Taxi/Singu validaram mercado primeiro, refinaram produto depois. SmartPreço inverteu.
**Provocação:** "O maior débito técnico do SmartPreço não está em nenhuma tabela — está na ausência de operação comercial rodando enquanto o time arruma o código."

---

## Rodada 2 — Réplicas cruzadas (matriz quem-comenta-quem)

> Para cada par, registramos onde concordam e onde divergem. 3+ contestações genuínas marcadas com 🔥.

### Pedro Valério ↔ Alan Nicolas
- **Concorda:** ambos veem o QA Gate como insuficiente. Pedro reclama da falta de veto executável; Alan reclama que é meta-revisão sem blind test de código. Soma: o gate aprovou um produto-de-documentação, não um produto-de-código.
- **Diverge 🔥:** Pedro quer **mais processo** (DOD, owner pessoa-física, lint rule, pre-commit) e trataria os 33 itens de volume com workflow padronizado. Alan quer **menos volume**: corta 33 itens do inventário público antes mesmo de criar processo. Tensão: processo bem aplicado em volume baixo de qualidade vs. processo bem aplicado em volume tóxico continua produzindo lixo.

### Pedro Valério ↔ Raduan Melo
- **Concorda:** ambos rejeitam cegamente seguir o roadmap como escrito. Pedro veta por falta de gates; Raduan veta por falta de validação comercial. Convergem em "pare, ajeite o que precisa, depois siga".
- **Diverge 🔥:** Pedro acredita que o problema é **execucional** (processo sem DOD permite erro); Raduan acredita que o problema é **estratégico** (estrutura sem estratégia produz coisa errada com perfeição). Pedro arrumaria os gates do paydown atual; Raduan questionaria se o paydown deveria existir nesta forma. Quem está certo depende de onde está a maior fonte de erro — implementação ou priorização.

### Alan Nicolas ↔ Thiago Finch
- **Concorda:** ambos identificam ausência de fonte primária. Alan diz "DEBT-FE-2 não tem arquivo:linha"; Finch diz "concorrência não modelada, OMIE não começou em Observar". Soma: o discovery acreditou em afirmações sem ir até a evidência.
- **Diverge 🔥:** Alan defende **rigor de curadoria do que JÁ está no inventário** (cortar bronze, manter ouro). Finch defende **mudar o que se cura** (parar de auditar produto, começar a auditar funil). Tensão: melhorar o método dentro do mesmo escopo vs. trocar o escopo. Para Finch, o discovery inteiro está perguntando errado.

### Raduan Melo ↔ Bruno Nardon
- **Concorda:** ambos diagnosticam ausência das 6 dimensões PWR equivalentes (Raduan) ou dos pilares Pessoas/Processos (Nardon). Convergem em "discovery cobriu tech, deixou tudo o resto pra trás". Concordam ainda que Bloco H é não-negociável.
- **Diverge:** Raduan pensa em **estrutura segue estratégia** (declare posicionamento, depois priorize backlog). Nardon pensa em **dados > intuição** (faça 10 entrevistas, depois decida). Diferença de ordem causal: Raduan quer decisão de cima para baixo; Nardon quer experimento que gera decisão. Convergem na ação prática (entrevistar ICP), divergem na sequência mental.

### Bruno Nardon ↔ Tallis Gomes
- **Concorda:** **convergência mais forte do roundtable.** Mesma escola (G4), praticamente o mesmo veredito: roadmap defensivo, zona de conforto, sem ICP, sem canal. Os dois citam Easy Taxi como contra-exemplo.
- **Diverge:** Nardon prega "**Pessoas > Processos > Tech**, faça entrevistas, defina canal, depois mexa em código". Tallis prega "**instrumente primeiro, vá pra rua simultaneamente, dados de produção valem mais que entrevistas**". Tensão sutil: Nardon faz pesquisa qualitativa antes; Tallis prefere instrumento quantitativo de produção.

### Thiago Finch ↔ Tallis Gomes
- **Concorda:** ambos identificam roadmap 100% para dentro, zero para fora. Finch quantificaria com Loss Aversion (R$ X/mês perdidos); Tallis quantificaria com dado de produção real. Convergem na crítica: produto sem instrumento de mercado é demo.
- **Diverge:** Finch foca em **funil de entrada** (Lead Magnet, headline, oferta perpétua antes de qualquer outra coisa). Tallis foca em **operação comercial em paralelo** (SDR ligando enquanto o produto roda). Os dois concordam que vender é prioridade — divergem se o vetor é marketing (Finch) ou vendas (Tallis).

### Pedro Valério ↔ Tallis Gomes
- **Concorda:** ambos rejeitam o discovery como "produto-de-documentação" — Pedro porque falta DOD executável; Tallis porque falta dado de produção real. Soma: documentação bonita não é evidência.
- **Diverge 🔥:** Pedro acredita no **processo absolutista** (todo erro é falha de processo). Tallis acredita na **execução absolutista** (todo processo bonito é desculpa para não vender). Tensão clássica: processo como condição vs. processo como muleta. Em time de 1-3 devs Pedro pode estar otimizando para o errado; em time de 50+ Tallis pode estar negligenciando coordenação.

---

## Rodada 3 — Síntese

### Consensos (todos concordam)

1. **Bloco H é não-negociável e prioridade absoluta.** DEBT-DB-H3 + DEBT-DB-C3 (race conditions) são CRITICAL real, têm Playbook concreto (migration 009 com `acquire_user_lock`), e bloqueiam confiabilidade do produto. Custo 2-3 dias, ROI imediato.
2. **O discovery cobriu apenas a dimensão técnica.** Comercial/produto/pessoas/canal/monetização ficaram fora do escopo. Não é defeito metodológico do brownfield-discovery — é defeito de escopo do esforço.
3. **Há volume tóxico no inventário.** 33 itens (Alan), classificações infladas (DEBT-FE-2 como CRITICAL), itens sem Playbook (NEW-6 a NEW-8) — todos concordam que parte do inventário precisa ser desinflada.
4. **Quick wins precisam de DOD/owner antes de iniciar.** Mesmo em time pequeno, 14 itens com "@dev" como owner único é receita de erro e deslizamento de escopo.
5. **Observabilidade em produção é prerequisite.** Sentry Edge `tracesSampleRate: 0` (DEBT-H3) é o que torna todo o resto debugável. Tem que sair do quick wins e virar prioridade.

### Divergências marcadas

| Tema | Pólo A | Pólo B |
|------|--------|--------|
| **Onde está o maior risco** | Execução (Pedro): processo permite erro mesmo no Bloco H | Estratégia (Raduan/Nardon/Finch/Tallis): pagar débito de produto sem cliente confirmado |
| **O que fazer depois do Bloco H** | Continuar paydown com gates reforçados (Pedro/Alan) | Pausar paydown, fazer 10 entrevistas ICP + página de pricing (Nardon/Tallis) ou Lead Magnet + OMIE concorrência (Finch) |
| **Como reduzir volume tóxico** | Cortar 33 itens do inventário público (Alan) | Manter inventário, mas adicionar workflow de paydown padronizado (Pedro) |
| **Funil vs Vendas como vetor de tração** | Marketing/funil — Lead Magnet, headline, oferta (Finch) | Vendas — SDR, operação comercial em paralelo (Tallis) |
| **Sequência ICP** | Decisão estratégica primeiro, dados confirmam (Raduan) | Dados primeiro, decisão sai dos dados (Nardon/Tallis) |
| **i18n (Bloco G)** | CRITICAL no draft / MEDIUM no final (status atual) | Veto absoluto até funil estar validado (Finch); rebaixar para MEDIUM com gate condicional (Alan) |

### Top 5 recomendações priorizadas (votadas por mérito de argumento)

| # | Recomendação | Apoio (personas) | Justificativa |
|---|--------------|------------------|---------------|
| **1** | **Executar Bloco H + DEBT-H3 (Sentry Edge) imediatamente** — race conditions + observabilidade são pré-requisito de qualquer decisão futura. | Todos os 6 | Risco convexo puro. Sem isso, o resto é cego. |
| **2** | **Fazer 10 entrevistas de ICP antes de iniciar H2** — perguntas das 7 dimensões PWR + WTP + canais hoje + objeções. | Raduan, Nardon, Finch, Tallis (4) | Sem ICP validado por dados, o roadmap H2/H3 é elegância técnica em produto sem mercado confirmado. |
| **3** | **Cortar inventário público para os ~21 itens do Pareto ao Cubo (2+5+15)** + adicionar flag DEFERRED nos 33 itens de volume. | Alan + Pedro (alinha com DOD atômico) | Reduz dispersão cognitiva, libera ciclos para o que importa, melhora governança do paydown. |
| **4** | **Criar `pricing-page` + Lead Magnet (calculadora pública gratuita) em paralelo ao Bloco H** — não esperar paydown terminar. | Finch + Nardon + Tallis (3) | "Quanto você cobra?" e "qual o canal?" são perguntas que só geram resposta sendo testadas no mercado. Custo: 1 sprint paralelo. |
| **5** | **Converter AC do EPIC-TD-001 em veto conditions executáveis no CI** — Lighthouse-CI, teste de concorrência como job, lint rule de tipos React/types compatíveis. | Pedro + Alan (rigor de gate) | Garante que o que foi diagnosticado realmente é fixado. Custo: 4-6 horas de configuração. |

### Adições propostas ao roadmap

#### H1 (sprint atual) — ajustes
- **Adicionar DEBT-H3 (Sentry Edge `tracesSampleRate`) como primeiro item, não como quick win comum** (Tallis + Nardon).
- **Adicionar pre-commit hook db-types-drift** (Pedro) — 10 minutos de configuração, protege migrations 009 e 010.
- **Adicionar conversão de AC em veto CI** (lighthouse-ci, job de concorrência) — Pedro + Alan.
- **Adicionar pricing-page-v0** + Lead Magnet "calculadora ML pública gratuita sem cadastro" como entrega paralela (Finch + Nardon + Tallis).

#### H1.5 — bloco novo proposto (entre H1 e H2)
**Bloco I — Validação de mercado (1 sprint)**
- 10 entrevistas com ICP (Raduan, Nardon, Tallis).
- OMIE concorrência: 3 grupos de Facebook/WhatsApp + 3 ferramentas concorrentes mapeadas (Finch).
- Definição explícita do posicionamento entre 3 portas Treacy & Wiersema (Raduan).
- KPIs comerciais baseline: CAC hipótese, LTV hipótese, taxa de ativação (% que salva primeiro SKU), NPS de teste piloto (Finch).
- Output: documento `docs/business/ICP-validation-2026-Q2.md` que vira pré-requisito do H2.

#### H2 — condicionado ao output de H1.5
- Blocos B/A/C **só executam se** o output de H1.5 confirmar tração e ICP. Caso contrário, pivot precede paydown.

#### H3 — reclassificado
- **Bloco G (i18n) — DOWNGRADE para "deferred sem prazo"**. Veto absoluto de Finch + recomendação de Alan + alinhamento com Raduan (estrutura segue estratégia: i18n só faz sentido com decisão de expansão geográfica documentada). Sai do roadmap até existir caso comercial.

### Adendo do curador (Orion)

A síntese mais inesperada é que **5 das 6 personas convergem que o brownfield-discovery, por mais bem feito que esteja, otimizou para a pergunta errada**. O escopo do esforço foi "qual o débito técnico?" e foi respondido com excelência. A pergunta que ninguém fez (e que todas as personas comerciais identificaram em 5 minutos) foi: **"esse débito técnico está em qual produto, atendendo qual cliente, gerando qual receita?"** Sem essas três respostas, qualquer roadmap de paydown é uma aposta sobre a relevância do produto — não sobre a qualidade do código.

**Pedro e Alan defendem o discovery como artefato técnico** — e estão certos no escopo deles. **Raduan, Nardon, Finch e Tallis defendem que o artefato técnico, sozinho, é insuficiente para dirigir 6-7 sprints de trabalho** — e estão certos no escopo deles. A tensão é real e produtiva: o roadmap precisa de **ambos os reforços** (rigor de gate + validação comercial), não de um ou outro.

A recomendação que sintetiza tudo: **fazer H1 com Bloco H + observabilidade + Lead Magnet + pricing-page em paralelo** (1 sprint), depois **forçar Bloco I de validação de mercado antes de qualquer H2** (1 sprint). Em 4 semanas, o time tem race conditions resolvidas, observabilidade ligada, primeiro lead/conversão como dado real, e ICP validado. Aí sim o paydown técnico de H2 acontece sobre solo firme.

---

## Procedência das personas (arquivos-fonte)

| Persona | Arquivo-fonte | Tipo |
|---------|---------------|------|
| **Pedro Valério** | `/Users/pedroemilioferreira/AI/smartpreço/squads/squad-creator-pro/agents/pedro-valerio.md` | Agente formal |
| **Alan Nicolas** | `/Users/pedroemilioferreira/AI/smartpreço/squads/squad-creator-pro/agents/oalanicolas.md` | Agente formal |
| **Raduan Melo** | `/Users/pedroemilioferreira/AI/AIOX/.aiox-core/development/agents/raduan-melo.md` | Agente formal (clone público) |
| **Bruno Nardon** | `/Users/pedroemilioferreira/AI/AIOX/.aiox-core/development/agents/bruno-nardon.md` | Agente formal (clone público) |
| **Thiago Finch** | `/Users/pedroemilioferreira/AI/smartpreço/squads/squad-creator-pro/agents/thiago_finch.md` | Agente formal |
| **Tallis Gomes** | `/Users/pedroemilioferreira/Downloads/tallis_gomes_relatorio.md` | **[SINTETIZADO]** — dossier público (LinkedIn, G4, transcrições YouTube). Citação textual no documento individual com fonte exata; tudo mais marcado como `[SINTETIZADO]`. |

> ⚠️ **Disclaimer ético:** as personas são representações inferenciais a partir de fontes públicas e/ou agentes formalmente definidos no AIOX. Não são as pessoas reais nem manifestações oficiais. As análises foram produzidas sob a voz de cada uma para gerar tensão produtiva no roundtable.

---

*Roundtable curado por Orion (AIOX Master) — Brownfield Discovery SmartPreço — 2026-04-27*
*Análises individuais: `docs/reviews/roundtable/01..06-*.md` | Discovery base: `docs/architecture/technical-debt-assessment.md`*
