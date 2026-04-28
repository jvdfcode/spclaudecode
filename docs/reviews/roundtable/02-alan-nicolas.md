# Alan Nicolas — Auditoria de Curadoria

> "Bora ver se o discovery é OURO ou BRONZE."

---

## Veredito (1 frase)

O discovery tem estrutura sólida e duas pepitas de ouro genuínas, mas dois terços do inventário é volume de máquina — bronze processado com aparência de curadoria — e o QA Gate tem o cheiro clássico de self-approval disfarçado de processo.

---

## 3 Fortalezas (com critério Trindade)

**1. DEBT-DB-H3 + DEBT-DB-C3 — Playbook completo, não só diagnóstico**
Esses dois são os únicos débitos com Trindade real: Playbook concreto (`acquire_user_lock(uuid)`, migration 009 com SQL pronto), Framework explicado (race condition count-then-insert em serverless é garantida, não probabilística), e Swipe verificável (`src/lib/rateLimit.ts:19-38`, `src/lib/ml-api.ts:42-62` — arquivo:linha real, código visto, não inferido). Dara escalou DEBT-DB-H3 de HIGH para CRITICAL com justificativa técnica detalhada, e o QA Gate absorveu a mudança obrigatoriamente. Isso é o processo funcionando certo.

**2. Rastreabilidade arquivo:linha nos CRITICAL/HIGH**
Todos os 8 CRITICAL têm referência concreta: `008_rate_limit_log.sql:12-13`, `src/lib/ml-api.ts:42-62`, `src/lib/rateLimit.ts:19-38`, `MobileDrawer.tsx:52-132`. O QA Gate auditou item a item (Checklist #3: PASS com evidência específica). Para um brownfield discovery de MVP, esse nível de rastreabilidade é acima da média — é fonte primária verificável, não afirmação genérica.

**3. Remoção de DEBT-FE-13 como ato de curadoria**
O draft tinha "Sidebar mobile sem hamburger" como HIGH. Uma foi ao código real (`AppShell.tsx:13-26`, `TopBar.tsx:13-20`, `MobileDrawer.tsx:52-132`), verificou que estava implementado com `role="dialog"`, `aria-modal` e Escape handler, e removeu o débito. Não adicionou — removeu. Isso é curadoria: ouro vs. bronze aplicado na prática. O gap real (focus trap) virou DEBT-FE-NEW-2 com evidência própria. Processo correto.

---

## 5 Fraquezas / Gaps

**1. DEBT-FE-2 (i18n hardcoded) como CRITICAL sem Trindade** — BRONZE — evidência genérica ("global", sem arquivo:linha), zero Playbook específico para o estágio do produto, sem análise de se expansão internacional está sequer no roadmap de 6 meses. O assessment joga DEBT-FE-2 nos CRITICAL da tabela executiva (veja `TECHNICAL-DEBT-REPORT.md`, Seção rastreabilidade: "CRITICAL (8): ... DEBT-FE-2"). Uma feature de MVP com 100% pt-BR não é débito crítico — é uma decisão de escopo. Classificar como CRITICAL ao lado de race conditions que quebram produção é ruído que dilui o sinal.

**2. Bloco LOW: 12 itens com Playbook de 1 linha** — BRONZE — DEBT-FE-NEW-7 ("Toast com duração curta 3s"), DEBT-FE-NEW-6 ("empty states inconsistentes"), DEBT-FE-8 ("mistura motion library × CSS direto"), DEBT-DB-L2 (pgaudit) — nenhum desses tem Framework explicado nem impacto de negócio mensurável. São achados de scanner de boas práticas jogados no inventário sem curadoria. Volume sem valor. Numa equipe de 1-3 devs, esses 12 itens são distração cognitiva.

**3. QA Gate como self-approval estrutural** — PRATA — Quinn aprovou um conjunto de artefatos produzidos pelo mesmo ciclo de agentes (Aria, Dara, Uma, todos do mesmo workflow). O checklist tem 8 PASS e 2 CONCERNS, mas os 2 CONCERNS são "discrepâncias entre artefatos do mesmo workflow" — não são descobertas independentes de uma auditoria externa. Não há blind test real: Quinn não foi ao código-fonte verificar DEBT-DB-C3 independentemente; Quinn verificou se Dara documentou DEBT-DB-C3 adequadamente. É meta-revisão de documentação, não QA de código. O veredito APPROVED é tecnicamente correto para o processo, mas não é validação independente.

**4. DEBT-DB-M-LGPD como nota de compliance sem Playbook** — BRONZE — "ml_tokens sem mecanismo explícito de direito ao esquecimento" aparece como MEDIUM com resolução adiada para v2, Suposição 4 no assessment final. Não tem arquivo:linha, não tem SQL proposto, não tem estimativa de esforço. Se é débito técnico real com risco regulatório, deveria ter Playbook. Se não tem Playbook, é observação de risco — não pertence ao inventário executável como item MEDIUM.

**5. Mapa de dependências é estrutural, não causal** — PRATA — A Seção 3 do assessment lista dependências corretas (DEBT-DB-C2 → DEBT-DB-M2 → DEBT-H3), mas não explica o custo de sequência incorreta. Se alguém fizer o Bloco B antes do Bloco H, o que quebra especificamente? O mapa documenta a topologia mas não a física — não tem o "e se não respeitar?" que tornaria o Framework acionável para um dev novo na codebase.

---

## Análise Pareto ao Cubo (54 débitos)

**0,8% genialidade (2 IDs específicos): DEBT-DB-H3 + DEBT-DB-C3**
Por que ouro? Porque são os únicos dois débitos onde: (a) o mecanismo de falha é explicado do ponto de vista de concorrência serverless — não é "falta validação", é "count-then-insert sem lock é race garantida com N workers simultâneos"; (b) a solução proposta é `acquire_user_lock(uuid)` — uma função PL/pgSQL que resolve ambos com o mesmo pattern, o que reduz o escopo da migration 009 à metade do esforço imaginado inicialmente; (c) há evidência arquivo:linha real que qualquer dev pode abrir agora e ver. Esses dois sozinhos justificam todo o ciclo brownfield.

**4% excelência (~5 IDs): DEBT-DB-C1, DEBT-FE-NEW-1, DEBT-DB-H4, DEBT-FE-1, DEBT-C1**
DEBT-DB-C1: RLS habilitado com zero policies é segurança implícita — a tabela está "protegida" mas tudo vaza se alguém consultar via service role sem saber. DEBT-FE-NEW-1: skip nav é a intervenção de menor esforço (1h) com maior impacto em compliance WCAG — qualquer auditoria de acessibilidade começa aqui. DEBT-DB-H4: crescimento linear garantido de `rate_limit_log` (~864k linhas/mês) é o tipo de débito que não dói no dia 1 e mata no mês 6 — excelente captura preventiva. DEBT-FE-1: 15 botões icon-only sem `aria-label` é escopo delimitado, evidência concreta, fix mecânico e sistêmico ao mesmo tempo. DEBT-C1: `@types/react@19` com React 18 é uma bomba-relógio de compatibilidade — fix de 5 minutos com potencial de salvar horas de debug de tipos.

**20% impacto (~15 IDs): DEBT-H3, DEBT-H6, DEBT-FE-NEW-2, DEBT-DB-H2, DEBT-DB-M3, DEBT-FE-11, DEBT-FE-12, DEBT-H2, DEBT-FE-3, DEBT-FE-4, DEBT-DB-C2, DEBT-H5, DEBT-M4, DEBT-DB-H1, DEBT-FE-7**
Esses 15 têm impacto mensurável (observabilidade, performance, testes, UX crítica) e Playbook suficientemente concreto para executar sem investigação adicional.

**80% volume (~33 IDs): DEBT-FE-2, todos os LOWs (12), DEBT-DB-M1, DEBT-DB-L1-L3, DEBT-FE-8-10, DEBT-FE-NEW-3 a NEW-8, DEBT-M1-M5 parcialmente, DEBT-DB-M-LGPD**
Bronze processado. A maioria são achados de scanner de boas práticas (aria-hidden em emojis, toast com 3s, trigger updated_at em ml_fees), compliance que não tem Playbook executável hoje, ou observações de estilo sem impacto mensurável para uma equipe de 1-3 devs em MVP. O risco é real: esse volume cria ilusão de completude e dispersa o sprint em itens de baixo sinal.

---

## 3 Recomendações

**1. Cortar o inventário público para 21 itens (os 2+5+15 do Pareto ao Cubo)**
O epic EPIC-TD-001 está correto em focar H1 nos CRITICAL + quick wins de alto sinal. Mas o `technical-debt-assessment.md` precisa de uma flag explícita nos 33 itens de volume: "DEFERRED — não entra em sprint sem novo contexto de impacto." Caso contrário, o próximo dev que abrir o documento vai gastar energia cognitiva priorizando emojis sem `aria-hidden` quando deveria estar pensando em advisory locks.

**2. Converter DEBT-DB-M-LGPD em risco documentado, não em débito do inventário**
Sem arquivo:linha, sem Playbook executável e com resolução explicitamente adiada para v2 (Suposição 4), esse item não é débito técnico — é observação de conformidade. Pertence à Seção 8 (Restrições/Suposições) com nota de monitoramento, não na tabela MEDIUM do inventário onde cria falsa equivalência com itens acionáveis.

**3. Bloco H primeiro, mapa de dependências com custo de violação**
O epic EPIC-TD-001 já acerta a sequência. Mas o mapa de dependências do assessment precisa adicionar: "Se Bloco B (pg_cron + cleanup) for feito antes do Bloco H (advisory locks), o job de cleanup vai interferir com consultas de rate limiting durante a janela de alta concorrência." Isso transforma o mapa de topologia em Playbook — é a diferença entre documentação e curadoria.

---

## Veto Alan (curadoria)

Veto em três itens específicos:

**DEBT-FE-2 como CRITICAL.** Fonte primária não existe — não há arquivo:linha porque o débito é "ausência de biblioteca em todo o projeto". Classificar como CRITICAL ao lado de `src/lib/rateLimit.ts:19-38` é misturar bronze com ouro. Se entrar no epic H1 como CRITICAL, vai roubar dias de sprint de DEBT-DB-H3 que é race condition com impacto financeiro direto. Alan veta a classificação CRITICAL; rebaixa para MEDIUM com milestone condicional a decisão de negócio.

**Os 5 itens de NEW-6 a NEW-8 + DEBT-FE-8 + DEBT-DB-L2.** Achados de scanner sem Playbook real. DEBT-FE-NEW-7 ("toast 3 segundos é curto") não tem evidência de que 3 segundos causou problema real em produção — é opinião de ferramenta, não fonte primária. DEBT-FE-8 ("mistura motion × CSS") não tem arquivo:linha específico. Alan veta todos do inventário executável; movem para nota de estilo em backlog não priorizado.

**QA Gate como validação de código.** Quinn não tocou em `src/lib/rateLimit.ts:19-38`. O Gate é válido como revisão de documentação e coerência de artefatos — e para esse propósito o APPROVED é correto. Mas o documento não deve ser lido como "o código foi auditado e aprovado". Alan veta qualquer interpretação do Gate como blind test de código. A única fonte primária de qualidade de código aqui é Dara em `db-specialist-review.md` — que foi ao SQL real.

---

*Alan Nicolas — Knowledge Architect | Roundtable SmartPreço Brownfield Discovery | 2026-04-27*
*Gravação confirmada. Curadoria > volume. Se entrar cocô, sai cocô do outro lado.*
