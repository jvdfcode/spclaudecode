# Story TD-001-5 — Veto Conditions Executáveis no CI

**Epic:** EPIC-TD-001
**Status:** Draft
**Owner sugerido:** [OWNER: ?] (preencher na sprint planning)
**Persona-origem do roundtable:** Pedro Valério + Alan Nicolas (rigor de gate)
**Esforço estimado:** 4–6 horas

---

## Contexto

Os 4 vetos do Pedro Valério no EPIC-TD-001 são declarações de processo, não gates automáticos. Um veto que depende de revisão humana subjetiva pode ser ignorado, mal interpretado ou esquecido em sprint subsequente. Para que os vetos sejam lei, cada um precisa virar um job de CI que bloqueia merge automaticamente se a condição não for atendida.

Pedro Valério (roundtable): "Converter AC do EPIC-TD-001 em veto conditions executáveis no CI — Lighthouse-CI, teste de concorrência como job, lint rule de tipos React/types compatíveis."

Alan Nicolas (roundtable): "Quick wins sem DOD atômico — axioma: automação que impede uma classe de bugs sem esforço por feature é o gate mais barato que existe."

Esta story converte os 4 vetos do Pedro em 4 gates de CI automatizados. Após esta story, nenhum dos vetos pode ser violado sem que o pipeline de CI falhe — o que torna o merge impossível sem aprovação explícita de bypass.

---

## Vetos cobertos (referência: EPIC-TD-001 Seção "Veto Conditions")

| Veto | Gate implementado |
|------|------------------|
| Veto 1: rollback junto com migration 009 | PR template check: migration sem rollback = merge bloqueado |
| Veto 2: owner pessoa-física por quick win | Lint rule custom: `[OWNER: ?]` em story ativa = aviso de CI |
| Veto 3: DOD por story antes de marcar Done | PR template checklist: DOD obrigatório em stories TD-001-x |
| Veto 4: Bloco H sem job de concorrência no CI | Job CI: script Node de 10 chamadas paralelas a `checkRateLimit` |

---

## Acceptance Criteria

- [ ] **AC1:** `lighthouse-ci` configurado em `.github/workflows/` com threshold `accessibility >= 90` e `performance >= 70`; merge bloqueado se qualquer threshold falhar em `/` ou `/(app)/dashboard`
- [ ] **AC2:** Job de concorrência implementado como script Node em `scripts/test-concorrencia.ts` (ou `.js`): faz 10 chamadas paralelas a `checkRateLimit` com `limit=5` para o mesmo `user_id` e valida que nunca há mais de 5 rows inseridos; job roda no CI via `pnpm test:concorrencia`; bloqueia merge se falhar
- [ ] **AC3:** Lint rule custom (`eslint-plugin-local` ou equivalente) que valida `@types/react` major == `react` major em `package.json`; lint falha = commit bloqueado
- [ ] **AC4:** PR template (`.github/pull_request_template.md`) atualizado com checklist obrigatório: "[ ] Migration inclui rollback file no mesmo PR" e "[ ] Owner pessoa-física definido para cada quick win desta story"
- [ ] **AC5:** Cada um dos 4 gates acima roda em CI (GitHub Actions ou equivalente) sem intervenção manual; gate falho = status check vermelha = merge impossível sem bypass explícito
- [ ] **AC6:** `pnpm typecheck`, `pnpm lint`, `pnpm test` passando após merge desta story

---

## Tasks

- [ ] **T1:** Instalar `@lhci/cli` como devDependency; criar `.lighthouserc.json` com `assertions.categories:accessibility >= 0.9` e `categories:performance >= 0.7`; criar workflow `.github/workflows/lighthouse-ci.yml` que roda em PR contra `main`/`master`
- [ ] **T2:** Criar `scripts/test-concorrencia.ts`: usa cliente Supabase de test com `user_id` fixo; dispara 10 chamadas `checkRateLimit` via `Promise.all`; verifica que contagem em `rate_limit_log` <= 5 para aquele user na janela de 1min; exit code 1 se falhar
- [ ] **T3:** Adicionar `"test:concorrencia": "tsx scripts/test-concorrencia.ts"` em `package.json`; incluir job em `.github/workflows/ci.yml` (ou arquivo dedicado) após build
- [ ] **T4:** Criar lint rule custom: `eslint-plugin-local/rules/types-react-major-match.js` — lê `package.json`, extrai major de `react` e `@types/react`, falha se divergem; adicionar ao `.eslintrc.json`
- [ ] **T5:** Criar/atualizar `.github/pull_request_template.md` com checklist:
  - `[ ] Esta PR inclui rollback file se contém migration SQL`
  - `[ ] Owner pessoa-física definido para cada quick win incluído nesta PR`
  - `[ ] DOD por story está documentado no arquivo da story`
- [ ] **T6:** Testar todos os 4 gates em branch de teste: forçar falha em cada um e confirmar que CI falha; forçar pass e confirmar que CI verde
- [ ] **T7:** Executar `pnpm typecheck && pnpm lint && pnpm test`; corrigir falhas

---

## Output esperado

- `.lighthouserc.json` + `.github/workflows/lighthouse-ci.yml`
- `scripts/test-concorrencia.ts` + entrada em `package.json`
- `eslint-plugin-local/rules/types-react-major-match.js` + config em `.eslintrc.json`
- `.github/pull_request_template.md` atualizado com checklist de veto

---

## Notas técnicas / referências

- **Recomendação 5 / Pedro + Alan:** "Converter AC do EPIC-TD-001 em veto conditions executáveis no CI — Lighthouse-CI, teste de concorrência como job, lint rule de tipos React/types compatíveis." (roundtable-personas-2026-04-27.md, Top 5 Recomendações)
- **Pedro Veto 4:** "Job de concorrência deve existir no CI ANTES de executar Bloco H (migration 009)." Portanto, esta story (TD-001-5) deve ser concluída antes ou em paralelo a TD-001-1.
- **DEBT-FE-NEW-1** (skip navigation): o Lighthouse CI vai pegar este débito se não estiver resolvido antes — a story TD-001-2 deve ser mergeada antes do primeiro run do Lighthouse CI em produção.
- **DEBT-C1** (React/types mismatch): a lint rule do T4 é exatamente a automação de guarda que Pedro recomenda em sua Fraqueza 5: "Fix sem automação de guarda vira débito que retorna no próximo `pnpm add`."
- Script de concorrência em T2 requer ambiente de test com Supabase local (`supabase start`) ou Supabase test project separado — não rodar contra banco de produção.

---

## Riscos

- Lighthouse CI em ambiente de CI sem servidor real pode dar leituras instáveis de performance (mitigação: threshold de performance em 70% é conservador; accessibility é mais estável)
- Script de concorrência pode criar dados de teste em banco real se não houver isolamento (mitigação: usar `user_id` de teste específico + cleanup automático no script; ou mock via jest)
- Lint rule custom pode conflitar com eslint versão atual do projeto (mitigação: verificar versão em `.eslintrc.json` antes de criar plugin local; alternativa: script separado em `package.json`)

---

*Story gerada por @pm (Morgan) — EPIC-TD-001 — Roundtable 2026-04-27*
