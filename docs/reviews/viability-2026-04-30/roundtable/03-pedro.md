# Pedro Valério — Auditoria Process-Absolutist do plano de análise

> "Verde no terminal ≠ verde em produção. Plano sem gate binário é opinião disfarçada."

## Veredito

**VETO** — O plano de análise de viabilidade possui 4 gaps absolutos que impedem execução auditável: owner anônimo sem pessoa-física, rubric das notas X/10 inexistente, gates binários substituídos por prosa narrativa, e rollback zero para decisões tomadas com base em conclusões erradas. Nenhum desses gaps é estilo — são falhas estruturais de processo.

## 3 Fortalezas (gates de pé)

1. **Estrutura em dois blocos (F + M) com escopo declarado.** Separar viabilidade financeira (Bloco F) de viabilidade de mercado (Bloco M) com 5 pontos cada é segmentação auditável. Permite avaliação independente e evita contaminação de nota — o motor de cálculo pode ser sólido (F alto) mesmo que posicionamento competitivo seja frágil (M baixo). Isso é pass.

2. **Nota dupla X/10 em vez de nota única.** Duas notas forçam granularidade mínima. Um plano com nota única 7/10 esconde se o problema é técnico ou de mercado. Duas notas expõem a assimetria. Como gate de design de avaliação, Pedro aprova a decisão.

3. **Output determinístico em path fixo.** O artefato de saída é `docs/reviews/viability-2026-04-30/01-meli-viability.md` — path declarado, versionado por data, rastreável no repositório. Sem ambiguidade sobre onde o resultado vive. Isso é auditável.

## 4 Vetos absolutos

### VETO 1 — Owner pessoa-física do analista anônimo AUSENTE

**Gap:** O plano define "1 analista anônimo" como executor da análise de ~2000 palavras com notas que influenciam decisões de negócio. "Especialista anônimo", "@analyst" ou "analista simulado" não é owner auditável. Quem assina o relatório? Se a conclusão estiver errada — nota F 8/10 quando deveria ser 4/10 porque as taxas do ML mudaram — quem responde?

O próprio projeto já tem precedente: no `brief.md`, o autor é declarado ("Atlas (Analyst) — AIOX SmartPreço Squad"). No roundtable anterior, cada review tem assinatura: "Pedro Valério — AI Head de OPS". Analista anônimo quebra esse padrão sem justificativa.

**Condição de desbloqueio:** Declarar binariamente: "Owner da análise: Pedro Emilio Ferreira (validação final)" ou "Owner: simulação inline por agente @analyst — resultado NÃO constitui decisão de negócio sem validação humana". Sem owner, o artefato não tem accountability — e decisão sem accountability é processo quebrado.

### VETO 2 — Rubric das notas X/10 AUSENTE

**Gap:** O plano prevê nota dupla X/10 para Bloco F e Bloco M, mas não declara rubric. Como o analista distingue 7/10 de 6/10 no Bloco F? Qual é o critério para 8/10 no Bloco M? Sem rubric declarada, dois analistas distintos dariam notas diferentes para o mesmo cenário — isso é opinião travestida de número.

Exemplo concreto: o `brief.md` lista rate limit da API ML como "1 req/seg sem auth". Isso impacta Bloco F (viabilidade técnica) ou Bloco M (qualidade dos dados de mercado)? Com qual peso? A nota reflete isso como -1 ponto ou -0.5? Sem rubric, é arbitrário.

**Condição de desbloqueio:** Declarar rubric com faixas e critérios binários. Mínimo:
- `9-10`: Todos os 5 pontos do bloco são pass, sem ressalva material
- `7-8`: 4 de 5 pass, 1 com ressalva mitigável
- `5-6`: 3 de 5 pass, gaps conhecidos com workaround documentado
- `3-4`: Maioria fail, viabilidade comprometida sem mudança estrutural
- `1-2`: Inviável no formato atual

Cada ponto dos 5 por bloco deve ter critério pass/fail explícito.

### VETO 3 — Gates binários ausentes nos 10 pontos (Bloco F + Bloco M)

**Gap:** O plano define 5 pontos no Bloco F e 5 no Bloco M, mas não especifica se cada ponto tem gate binário (pass/fail) ou se é prosa qualitativa. Se Bloco F ponto 3 é "taxas do ML estão corretas no motor de cálculo" — qual é o check? `npm test -- --grep "taxa"` retorna verde? Ou é parágrafo descritivo dizendo "as taxas parecem corretas"?

Gate binário = comando ou critério com resultado pass/fail reproduzível. Prosa narrativa = opinião. O plano prevê ~2000 palavras — isso sugere prosa, não gates. Pedro veta análise de viabilidade onde cada ponto não tem pelo menos 1 critério verificável.

**Condição de desbloqueio:** Para cada um dos 10 pontos, declarar: (a) o que está sendo avaliado, (b) critério pass/fail, (c) evidência aceita. Exemplo Bloco F: "Ponto 2 — Precisão das taxas ML: PASS se taxas no `prd.md` Seção 'Estrutura de Taxas' coincidem com painel ML atual (±1pp). FAIL se divergência >1pp em qualquer categoria."

### VETO 4 — Rollback não declarado

**Gap:** Se a análise produzir conclusão errada — por exemplo, nota F 8/10 leva a decisão de investir 3 sprints no Bloco Mercado, mas a API pública do ML tem rate limit que inviabiliza o modelo — como reverter ações tomadas com base nessa conclusão? O plano não declara rollback.

O projeto já sofre com isso: `brief.md` lista "Rate limits reais" como "Areas Needing Further Research" e `prd.md` reconhece risco "API ML bloqueada por IP". Uma nota alta no Bloco F sem gate de rate limit verificado é bomba-relógio. Se explodir, qual é o procedimento? Pivotar? Pausar sprint? Reverter stories já em execução?

**Condição de desbloqueio:** Declarar: "Se análise for invalidada pós-publicação (fato novo contradiz premissa), o owner executa: (1) atualizar `01-meli-viability.md` com seção INVALIDAÇÃO + motivo, (2) notificar @pm para pausar stories dependentes, (3) abrir issue de reavaliação com prazo de 48h." Sem rollback declarado, erro de análise vira erro de execução — e esse é o tipo de processo que permite o erro.

## Matriz auditoria do plano

| Dimensão | Pass/Fail | Justificativa |
|----------|-----------|---------------|
| Owner pessoa-física | ❌ | "Analista anônimo" não é auditável. Sem nome, sem accountability. |
| Rubric notas X/10 | ❌ | Nenhuma rubric declarada. Notas são opinião sem critério reproduzível. |
| Gates binários (Bloco F) | ❌ | 5 pontos sem critério pass/fail. Formato ~2000 palavras sugere prosa, não gates. |
| Gates binários (Bloco M) | ❌ | Idem Bloco F. Nenhum comando ou check verificável por ponto. |
| Rollback declarado | ❌ | Zero procedimento para reverter decisões baseadas em conclusão errada. |

## 3 Mudanças concretas (input pra plano v2)

1. **NOMEAR owner:** Declarar pessoa-física ou, se simulação por agente, explicitar: "Resultado é artefato consultivo, não decisão. Decisão requer validação de Pedro Emilio com evidência independente." Owner assina o documento no footer com data.

2. **DECLARAR rubric:** Criar tabela com 5 pontos Bloco F + 5 pontos Bloco M, cada um com: nome do ponto, critério pass/fail, fonte de evidência aceita, peso na nota final. A nota X/10 vira soma ponderada de gates binários — reproduzível por qualquer revisor.

3. **EXIGIR rollback + gates binários:** Cada ponto dos 10 deve ter check executável (link, comando, comparação com fonte primária). O plano deve incluir seção "Rollback" com procedimento auditável para invalidação pós-publicação. Sem esses dois, o artefato é prosa consultiva — não análise de viabilidade.

## Conclusão executiva

O plano tem design de avaliação correto (dois blocos, nota dupla, path fixo) mas falha em todas as dimensões de processo auditável: sem owner, sem rubric, sem gates binários, sem rollback. Isso transforma uma análise de viabilidade em opinião formatada como relatório — e decisão de negócio baseada em opinião sem accountability é exatamente o tipo de processo que o Pedro veta. Corrija os 4 gaps antes de executar.

---

*Pedro Valério — Process-Absolutist | Roundtable Viability Review #03 | 2026-04-30*
*Referências: `docs/brief.md`, `docs/prd.md`, `docs/business/posicionamento.md`, `docs/business/concorrencia-2026-Q2.md`*
