# Pedro Valério — Análise do Brownfield Discovery

> "Tá ligado que processo que permite erro é processo quebrado, né? Bora destrinchar."

---

## Veredito (1 frase)

Diagnóstico cirúrgico, remediação técnica sólida — mas o EPIC-TD-001 vai para produção sem DOD por story, sem veto condition explícita nos CRITICAL e com 14 quick wins voando soltos sem workflow comum, ou seja: o processo ainda permite erro, mano.

---

## 3 Fortalezas

1. **Gate de tipo-drift no CI (modernization tooling real)** — `technical-debt-assessment.md` Seção 3 e TECHNICAL-DEBT-REPORT.md Seção 1 confirmam `supabase.gen.ts` gerado + CI drift gate ativo. Axioma: automação que impede uma classe de bugs sem esforço por feature é o gate mais barato que existe. Aqui ele já está no repo. Pedro aprova sem ressalva.

2. **Mapa de dependências entre débitos (Seção 3 do assessment)** — O documento registra explicitamente que DEBT-DB-H4 é pré-requisito de performance de DEBT-DB-H3, que DEBT-DB-M2 (pg_cron) é compartilhado com DEBT-DB-C2 e DEBT-DB-H4, e que DEBT-FE-2 habilita DEBT-FE-1. Isso é sequenciamento real, não desejo. Pedro aprova porque sem grafo de dependências o paydown vira caos de bloqueio.

3. **QA Gate com discrepâncias formalizadas e obrigatórias (qa-review.md Seção 4)** — As 12 mudanças obrigatórias para Fase 8 não são "sugestões": o gate diz "DEVEM ser incorporadas". D1 a D5 têm evidência arquivo:linha, resolução determinística, contagem de summary atualizada. Esse é o nível mínimo de gate que Pedro exige — veredito com consequência, não com "fica a critério".

---

## 5 Fraquezas / Gaps

1. **14 quick wins sem workflow comum de paydown** — EPIC-TD-001 Story TD-001-4 lista 14 itens paralelos sem template de story individual, sem DOD explícito por item e sem owner atômico. TECHNICAL-DEBT-REPORT.md Seção 4 (H1 Quick Wins) apenas cita os IDs. Qual é o critério de done de DEBT-H4 (remover cheerio)? Remover o pacote? Documentar? Abrir issue? Processo que não define done permite que cada dev decida por conta — isso é broken. — **Severidade Pedro: MISSING_OWNER + LACK_OF_GATE**

2. **Veto conditions ausentes nos CRITICAL** — DEBT-DB-H3 e DEBT-DB-C3 são race conditions CRITICAL. O EPIC-TD-001 tem "critérios de aceitação do epic" (Seção de AC) mas não tem veto condition explícita: "merge bloqueado se teste de concorrência com 10 chamadas simultâneas não provar que checkRateLimit com limit=5 retorna no máximo 5 inserts". O AC diz "testes de concorrência provam" — mas não diz quem roda, quando, em qual ambiente, e o que acontece se falhar. Isso não é veto, é desejo de teste. — **Severidade Pedro: CRITICAL_NO_VETO**

3. **db-types-drift apenas em CI/PR, sem pre-commit (DEBT-DB-M4)** — assessment Seção 2.3 registra explicitamente: "`db-types-drift` apenas em CI/PR; sem pre-commit". Pedro veta: gate que só dispara em PR permite que dev comite código com drift por horas ou dias antes de alguém ver. O axioma é: gate mais cedo na pipeline = custo de correção menor. Um pre-commit hook com `supabase gen types` + diff é automação de 10 minutos. — **Severidade Pedro: NO_AUTOMATION**

4. **Owner dos quick wins é função (@dev), não pessoa** — TECHNICAL-DEBT-REPORT.md Seção 7 lista owners por bloco: "Quick Wins — @dev — sem suporte". @dev é função, não pessoa. Em equipe de 1-3 devs (Suposição 3 do assessment) isso pode funcionar na prática, mas no processo está errado. Se @dev está travado em Bloco H (race conditions, 2-3 dias), quem é o owner dos 14 quick wins naquele sprint? Processo sem owner inequívoco falha no gate de execução. — **Severidade Pedro: MISSING_OWNER**

5. **Sem lint rule automática para DEBT-C1 (React/types mismatch)** — DEBT-C1 é `@types/react@19` com React 18 instalado. O fix é mecânico (assessment Seção 5, item 1). Mas o processo não cria uma guarda automática pós-fix: não há regra de `package.json:engines` declarada, não há check no CI que valide que `@types/react` major == `react` major. Fix sem automação de guarda vira débito que retorna no próximo `pnpm add`. — **Severidade Pedro: NO_AUTOMATION**

---

## 3 Recomendações (alinhadas ao DNA Pedro)

1. **Criar template de paydown story com DOD atômico** — Aplicar a todos os 14 quick wins de TD-001-4 e aos blocos de H2/H3. Template mínimo: `ID | owner (pessoa) | definição de done | veto condition | tempo de verificação`. Para DEBT-H4 (cheerio): owner = dev A, done = `package.json` sem cheerio + `pnpm audit` limpo, veto = PR bloqueado se `grep -r "require.*cheerio"` retornar match. Para DEBT-C1: done = `pnpm typecheck` verde + CI lint verde, veto = PR bloqueado se `@types/react` major != `react` major em `package.json`. Referência: DEBT-C1, DEBT-H4, DEBT-H5, DEBT-M4, DEBT-M5 — todos quick wins sem DOD atual.

2. **Converter AC do EPIC-TD-001 em veto conditions executáveis no CI** — O AC atual (EPIC-TD-001 Seção "Critérios de aceitação") diz "testes de concorrência provam que 10 chamadas simultâneas a checkRateLimit com limit=5 nunca ultrapassam 5 inserções". Isso vira um teste Playwright ou script de concorrência que roda como job obrigatório no CI antes do merge de TD-001-1. Se o job falha, merge bloqueado — não "fica a critério do reviewer". Idem para Lighthouse A11y >= 90: vira `lighthouse-ci` com threshold configurado no `.lighthouserc.json`, falha = merge bloqueado. Referência: DEBT-DB-H3, DEBT-DB-C3, DEBT-FE-NEW-1, EPIC-TD-001 AC.

3. **Adicionar pre-commit hook para db-types-drift (DEBT-DB-M4) agora, não no H2** — O assessment classifica DEBT-DB-M4 como MEDIUM e o coloca fora de H1. Pedro veta essa priorização para o gate: o hook em si é automação de 10 minutos (`husky` + script `supabase gen types --check`), não interfere em nenhuma story de H1 e protege exatamente as migrations 009 e 010 que serão aplicadas em H1. Criar como task paralela de configuração dentro de TD-001-4. Referência: DEBT-DB-M4 (`technical-debt-assessment.md` Seção 2.3).

---

## Veto explícito

Pedro veta o roadmap atual nas seguintes condições — se não resolvidas antes de iniciar as stories:

1. **Veto: iniciar TD-001-1 sem rollback file `009_advisory_locks_and_jsonb_check_rollback.sql` commitado no mesmo PR da migration 009.** O EPIC-TD-001 menciona o rollback como "obrigatório" na seção de rollback, mas não coloca isso como critério de accept da story. Processo sem rollback commitado junto é processo que permite erro irreversível em produção.

2. **Veto: marcar TD-001-4 como Done sem owner individual por quick win.** 14 itens com um único "@dev" como owner não é processo — é lista de desejos. Cada item recebe um nome antes de começar o sprint.

3. **Veto: enviar EPIC-TD-001 sem checklist de DOD por story.** As 4 stories existem com esforço estimado e severidade, mas sem DOD explícito. Story sem DOD é story sem gate de saída — ela nunca está "feita", está "pareço que feita".

4. **Veto: executar Bloco H (migration 009) sem job de teste de concorrência automatizado no CI.** O AC do epic menciona teste de concorrência, mas o CI atual (`pnpm build`, `pnpm lint`, `pnpm typecheck`, `pnpm test`) não inclui esse job. Merge sem validação automatizada de race condition é exatamente o tipo de processo que permite o erro que estamos corrigindo.

---

*Pedro Valério — AI Head de OPS | Roundtable Review #01 | 2026-04-27*
*Referências: `technical-debt-assessment.md` (Fase 8), `TECHNICAL-DEBT-REPORT.md` (Fase 9), `qa-review.md` (Fase 7), `EPIC-TD-001-debt-paydown-h1.md` (Fase 10)*
