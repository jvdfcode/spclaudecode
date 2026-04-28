# Alex — Diagnóstico de Negócio para Produção

> "Produto sem ICP validado é aposta. Aposta sem timer é prejuízo."

**Data:** 2026-04-27
**Fase:** Pré-produção (smartpreco.app) — Bloco I em andamento
**Escopo:** Negócio, funil, observabilidade comercial, riscos regulatórios, custo de atraso

---

## Veredito (1 frase)

O SmartPreço pode ir para produção com o Lead Magnet hoje — mas o A/B test de pricing é inútil sem tráfego, as entrevistas ICP são zero, e a captura de email do funil tem risco LGPD concreto se a política de privacidade não estiver publicada antes do primeiro lead.

---

## 5 problemas-raiz no escopo de negócio

**1. ICP é declaração, não evidência**
— `docs/business/ICP-validation-2026-Q2.md` + `docs/business/interviews/ROTEIRO.md`
— Evidência: o documento ICP-validation é inteiramente template — campos `…` em todas as seções de WTP, dor confirmada e canal. Não há nenhuma entrevista em `docs/business/interviews/`. O roteiro PWR está pronto (Raduan + Nardon, 92 linhas, bem estruturado), mas nenhuma das 10 sessões foi executada. O posicionamento "Liderança em Produto" em `posicionamento.md` tem uma cláusula de reavaliação obrigatória explícita: a decisão só se confirma após as entrevistas. Ir para produção sem elas é anunciar uma tese que o produto ainda não sabe se é verdadeira.
— **Severidade: BLOQUEADOR para H2; não bloqueia ir ao ar, bloqueia iterar o roadmap.**

**2. A/B test de pricing roda sem nenhum dado de WTP real**
— `src/lib/pricing-experiment.ts` + `docs/business/ICP-validation-2026-Q2.md §3`
— Evidência: variantes A/B/C em R$ 39 / 49 / 59 estão implementadas via cookie (distribuição aleatória por `Math.random()` — sem hash de user-id, sem sticky por sessão de fato). O documento ICP-validation tem a tabela de WTP inteiramente em branco. Nenhuma das 10 entrevistas foi feita. Isso significa que os três preços são chute — não hipótese calibrada. Para um A/B test atingir significância estatística (p < 0.05, power 80%, diferença de 5 pontos percentuais de conversão entre variantes), com tráfego inicial de ~100 visitas/semana o experimento leva 8–12 semanas sem qualquer interferência. Com 0 leads hoje, a pergunta correta não é "qual variante ganhou" — é "quando teremos volume mínimo para a resposta importar". Risco concreto: fixar o preço cedo demais no ruído estatístico dos primeiros leads e queimar um sinal que levou meses para acumular.
— **Severidade: MÉDIO — não bloqueia produção, mas deve ter expectativa calibrada sobre prazo de dado útil.**

**3. Funil do Lead Magnet sem observabilidade de negócio**
— `docs/epics/EPIC-MKT-001-validacao-mercado.md §AC` + `docs/reports/TECHNICAL-DEBT-REPORT.md §8`
— Evidência: o epic exige explicitamente "CTA de captura de email funcional com LGPD opt-in" e "pelo menos 10 leads em 30 dias pós-publicação" como critério de aceite de MKT-001-1. O TECHNICAL-DEBT-REPORT §8.2 nomeia DEBT-H3 (Sentry Edge `tracesSampleRate: 0`) como **primeiro item obrigatório de H1** — sem ele, erros no funil de captura de leads são invisíveis. Vercel Analytics rastreia pageviews; não rastreia eventos de funil (cálculo iniciado → resultado exibido → CTA clicado → email submetido). Se o dashboard de KPIs de MKT-001-5 não instrumentar esses 4 eventos como eventos customizados, os "10 leads em 30 dias" viram métrica de vaidade sem contexto de onde o funil quebra.
— **Severidade: ALTO — cada semana de funil sem eventos rastreados é dado perdido permanentemente.**

**4. Risco LGPD: captura de PII sem política de privacidade publicada**
— `docs/epics/EPIC-MKT-001-validacao-mercado.md §Riscos` + `docs/reports/TECHNICAL-DEBT-REPORT.md §2 (DEBT-DB-M-LGPD)`
— Evidência: o critério de aceite de MKT-001-1 exige "LGPD opt-in" no CTA de captura de email. O roteiro de entrevistas (linha 80) prevê "opt-in LGPD explícito" ao final de cada sessão. O DEBT-DB-M-LGPD documenta que tokens ML associados a `auth.uid()` não têm mecanismo de exclusão explícito. O Lead Magnet captura email de usuário anônimo — isso é coleta de PII regulada pela LGPD (Lei 13.709/2018). Coletar PII sem política de privacidade publicada em URL acessível e sem base legal declarada (consentimento + finalidade) é infração imediata, independente do tamanho da base. Não é "preparar conteúdo de marca" — é pré-requisito legal antes do primeiro lead.
— **Severidade: ALTO (risco regulatório imediato ao capturar o primeiro email).**

**5. Concorrência é template vazio — diferencial competitivo não verificado**
— `docs/business/concorrencia-2026-Q2.md`
— Evidência: o documento inteiro é template — todos os concorrentes A, B, C com campos em branco. A matriz comparativa lista features do SmartPreço mas sem nenhum dado de nenhum concorrente real. O posicionamento declarado em `posicionamento.md` ("scraping de anúncios reais ML + cálculo de taxas por tipo de anúncio é vantagem que planilha de Excel não cobre") não foi verificado contra o mercado. O EPIC-MKT-001 reconhece o risco: "Concorrente avançar enquanto rodamos validação". Ir para produção com diferencial competitivo não auditado significa que o copywriting da landing, os CTAs e o posicionamento da pricing-page podem estar posicionando contra um problema que outra ferramenta já resolve. Isso não bloqueia ir ao ar, mas contamina toda a mensagem de aquisição.
— **Severidade: MÉDIO (não bloqueia ir ao ar; bloqueia ROI da mensagem de aquisição).**

---

## 3 dependências externas

**1. Depende de @dev**: DEBT-H3 (Sentry Edge `tracesSampleRate: 0.1`) precisa estar ativo antes de qualquer lead ser capturado — sem isso, erros no funil são invisíveis. Também depende de @dev para implementar eventos customizados no Vercel Analytics (ou ferramenta equivalente) para os 4 steps do funil do Lead Magnet antes de medir conversão.

**2. Depende do USUÁRIO (Pedro)**: (a) Executar as 10 entrevistas ICP — nenhuma ferramenta ou agente faz por você; o roteiro está pronto, o problema é agenda e acesso a vendedores ML reais. (b) Contratar ou redigir a política de privacidade publicada em `/privacidade` antes de ativar o CTA de captura de email — isso é decisão jurídica, não técnica. (c) Decidir se o posicionamento "Liderança em Produto" permanece como hipótese pública ou se a landing vai ao ar com linguagem mais neutra até as entrevistas confirmarem.

**3. Depende de @devops**: publicar `smartpreco.app` em produção com as variáveis de ambiente corretas (incluindo Sentry DSN em edge, não apenas client) e garantir que o cookie `sp_exp_pricing` persiste por sessão sem vazar entre usuários no cache do Vercel Edge.

---

## 3 recomendações

**1. Ir para produção com o Lead Magnet agora, mas só ativar CTA de email depois da política de privacidade publicada.**
O custo de não ir ao ar é real: cada semana sem `/calculadora-livre` pública é dado de funil que nunca volta. O Lead Magnet pode rodar em modo "calculadora sem captura" (resultado exibido, sem CTA de email) até a política de privacidade estar no ar. Isso zera o risco LGPD e mantém o produto gerando dados de uso. Ativar captura de email na semana seguinte após `/privacidade` publicada. Custo de atraso estimado por semana sem tráfego: ~20-50 cálculos perdidos como dado de funil, assumindo aquisição orgânica inicial baixa — mas o sinal é cumulativo e irreversível.

**2. Começar as entrevistas ICP na primeira semana de produção, não depois.**
O roteiro está pronto. A janela de H1.5 é 30 dias. Se as entrevistas começarem na semana 3 ou 4 (depois que o produto "estiver pronto"), o Bloco I não fecha no prazo e H2 fica congelado. Recomendação operacional: agendar 2 entrevistas por semana nas primeiras 2 semanas usando os grupos de WhatsApp/Facebook identificados no Bloco 3 do roteiro. Usar `/calculadora-livre` ao vivo no Bloco 5 da entrevista — o produto em produção é a melhor ferramenta de vendas e pesquisa ao mesmo tempo.

**3. Calibrar expectativa sobre o A/B test de pricing: ele só produz dado útil em 8+ semanas, não em dias.**
A decisão de preço não deve ser feita com base nos primeiros 20-30 conversões — o sinal estatístico não existe. Tratar as variantes A/B/C como hipóteses paralelas durante as entrevistas ICP (pergunta 17 do roteiro já cobre R$ 19 / 49 / 99) e usar o WTP modal das entrevistas para validar qual faixa é defensável antes de otimizar o A/B test em produção. Não fixar preço antes de 5 entrevistas com WTP declarado.
