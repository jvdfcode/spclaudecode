# Pedro Valerio — Auditoria Process-Absolutist do PROD-001

> "Verde no CI ≠ verde em producao. Mostra a evidencia ou nao passa."

## Veredito

**NEEDS WORK** — Sprint plan tem estrutura solida e caminho critico correto, porem falha em 4 criterios absolutistas: nenhuma das 12 stories tem owner pessoa-fisica nomeada, DoD do sprint e mensuravel mas falta gate CI binario para rollback, PROD-001-7 ja esta parcialmente implementada (cron handler JA tem `CRON_SECRET` — story desatualizada), e 3 stories operacionais nao declaram procedimento de rollback.

## 3 Fortalezas (gates que estao de pe)

1. **Gate CI binario para types/react existe e e auditavel** — `ci.yml:38-39` executa `pnpm check:react-types-major` que bloqueia merge se majors divergirem. Pass/fail, sem opiniao subjetiva.
2. **Gate `db-types-drift` no CI e executavel** — `ci.yml:102-129` compara tipos gerados vs commitados com `diff -q` e falha com exit 1 se divergirem. Gate binario real.
3. **DoD do Sprint e mensuravel** — 6 criterios concretos com evidencia exigida (AC marcados `[x]`, typecheck verde, File List preenchido). Nao e subjetivo.

## 4 Vetos absolutos (gaps que travam execucao)

1. **[TODAS AS 12 STORIES]** — Owner pessoa-fisica AUSENTE
   - Evidencia: Todas as 12 stories declaram `Owner sugerido: [OWNER: ?]`. O Sprint Plan (SPRINT-2026-04-28.md:72-85) lista "Dev", "Pedro + Dev", "Pedro" — nenhum e owner pessoa-fisica com handoff explicito.
   - "Dev" nao e pessoa-fisica. "@dev" nao e pessoa-fisica. "Pedro + Dev" e ambiguo (quem responde se falhar?).
   - Veto: BLOQUEIA execucao ate cada story ter exatamente 1 owner nomeado (Pedro Emilio ou agente com handoff declarado em `.aiox/handoffs/`).

2. **[PROD-001-7]** — Story desatualizada: gate JA implementado no codigo
   - Evidencia: `src/app/api/cron/cleanup-ml-cache/route.ts:7-8` ja contem `const authHeader = req.headers.get('Authorization')` e `if (authHeader !== \`Bearer ${process.env.CRON_SECRET}\`)`. A story assume que essa validacao NAO existe.
   - Impacto: Executor vai implementar algo que ja existe. O AC `grep "CRON_SECRET" src/app/api/cron/cleanup-ml-cache/route.ts` ja passa HOJE. A story precisa ser reescrita — o unico deliverable real e `vercel env add CRON_SECRET` e atualizar `.env.example`.
   - Veto: BLOQUEIA ate story reescrita com AC correto (focar no provisionamento da env var, nao na implementacao do handler).

3. **[PROD-001-8, PROD-001-9, PROD-001-11]** — Rollback INDEFINIDO nas stories individuais
   - Evidencia: O EPIC-PROD-001 tem secao "Plano de rollback" (epic:92-97), mas as 3 stories operacionais mais criticas (deploy, DNS, smoke) nao referenciam nem declaram rollback proprio. Um executor seguindo APENAS a story nao sabe o que fazer se `vercel deploy --prod` resultar em 500, ou se DNS Cloudflare nao propagar.
   - O Sprint Plan (SPRINT-2026-04-28.md) tambem nao referencia rollback por story.
   - Veto: BLOQUEIA ate cada story critica ter campo `## Rollback` com procedimento declarado e binario.

4. **[PROD-001-2]** — DoD da story nao e executavel no CI como gate binario
   - Evidencia: O AC diz `grep "@types/react" pnpm-lock.yaml mostra exclusivamente versoes 18.x.x`. Isso e um comando manual, nao um gate CI. O CI ja tem `check:react-types-major` (ci.yml:38-39) que verifica majors — mas o AC da story nao referencia esse gate existente. Se o executor pinnar `18.3.12` mas o lock resolver para 19 num futuro `pnpm install`, o gate CI existente pega? Ou passa silencioso?
   - O script `scripts/check-react-types-major.mjs` existe mas a story nao verifica se ele cobre o cenario exato do fix (pin exato vs caret).
   - Veto: BLOQUEIA ate AC referenciar o gate CI existente e confirmar que `check:react-types-major` valida o cenario pos-fix.

## Matriz de auditoria das 12 stories

| Story | Owner pessoa-fisica? | DoD mensuravel? | Rollback declarado? | Gate CI executavel? | Veredito |
|-------|---------------------|-----------------|---------------------|---------------------|----------|
| PROD-001-1 | ❌ `[OWNER: ?]` | ✅ (decisao registrada, chaves anotadas) | N/A (decisao) | N/A | VETO (owner) |
| PROD-001-2 | ❌ `[OWNER: ?]` | ✅ (typecheck exit 0, grep lock) | ✅ (git revert trivial) | ⚠️ (gate existe mas AC nao referencia) | VETO (owner + gate) |
| PROD-001-3 | ❌ `[OWNER: ?]` | ✅ (migration list applied, grep tipos) | ❌ (epic menciona DROP CASCADE mas story nao) | ✅ (db-types-drift) | VETO (owner + rollback) |
| PROD-001-4 | ❌ `[OWNER: ?]` | ✅ (grep 0 linhas hardcoded) | ✅ (git revert) | ✅ (CI usa secret) | VETO (owner) |
| PROD-001-5 | ❌ `[OWNER: ?]` | ✅ (vercel whoami, project.json existe) | ❌ (nao declarado) | N/A (operacional) | VETO (owner) |
| PROD-001-6 | ❌ `[OWNER: ?]` | ✅ (vercel env ls lista 11 vars) | ❌ (nao declarado) | N/A (operacional) | VETO (owner) |
| PROD-001-7 | ❌ `[OWNER: ?]` | ❌ (AC ja satisfeito — story desatualizada) | ✅ (env var remove) | ✅ (curl 401 verificavel) | VETO (owner + AC desatualizado) |
| PROD-001-8 | ❌ `[OWNER: ?]` | ✅ (curl HTTP 200) | ❌ (nao declarado) | N/A (operacional) | VETO (owner + rollback) |
| PROD-001-9 | ❌ `[OWNER: ?]` | ✅ (dig, curl TLS) | ❌ (epic tem IPs AWS mas story nao) | N/A (operacional) | VETO (owner + rollback) |
| PROD-001-10 | ❌ `[OWNER: ?]` | ✅ (curl 200, SELECT leads > 0) | ❌ (nao declarado) | N/A (juridico) | VETO (owner) |
| PROD-001-11 | ❌ `[OWNER: ?]` | ✅ (Sentry evento, curl rotas, test passa) | N/A (gate final) | ✅ (pnpm test) | VETO (owner) |
| PROD-001-12 | ❌ `[OWNER: ?]` | ✅ (Lighthouse >= 90, grep classes) | ✅ (git revert) | ✅ (Lighthouse CI) | VETO (owner) |

**Resultado: 12/12 stories com VETO por owner ausente. 5/12 com rollback indefinido.**

## 3 Recomendacoes concretas

1. **NOMEAR OWNER pessoa-fisica em cada story** — Sprint Planning (Dia 1 manha) deve preencher `Owner sugerido` com "Pedro Emilio" para stories interativas (1, 5, 6, 9, 10) e "Pedro Emilio (executor: @dev Dex)" com handoff explicito para stories de codigo (2, 3, 4, 7, 8, 11, 12). Sem owner = sem accountability = nao e auditavel.

2. **ADICIONAR SECAO `## Rollback` em PROD-001-3, 5, 6, 8, 9** — O epic tem rollback generico, mas o executor le a story, nao o epic. Cada story operacional precisa declarar: "Se falhar: [comando exato]". Para PROD-001-9: "Se DNS nao propagar em 30min: reapontar A para 15.197.148.33 e 3.33.130.190 com proxy ON no Cloudflare". Para PROD-001-8: "Se build falhar: nao ha rollback — voltar para story dependente que falhou".

3. **REESCREVER PROD-001-7** — O handler ja implementa CRON_SECRET (verificado em `route.ts:7-8`). A story deve focar em: (a) gerar secret via `openssl rand -base64 32`, (b) `vercel env add CRON_SECRET production`, (c) atualizar `.env.example`, (d) verificar que o gate funciona pos-deploy. Remover tasks de implementacao do handler.
