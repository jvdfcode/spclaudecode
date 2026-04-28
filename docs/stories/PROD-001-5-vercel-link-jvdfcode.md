# Story PROD-001-5 — Vercel login jvdfcode + link projeto + commit project.json

**Epic:** EPIC-PROD-001
**Status:** Draft
**Owner:** Pedro Emilio
**Severidade origem:** B4, L7
**Esforço estimado:** 1 SP

---

## Contexto

Gage (04-devops-gage.md, problema 1) documenta que o projeto nunca foi linkado ao team `jvdfcode` nesta máquina. A ausência de `.vercel/project.json` faz com que todo comando `vercel` rode no contexto pessoal `pedroemilio11`, não no team — o deploy vai para o projeto errado ou cria um novo orphan. L7 da matriz (síntese Orion) documenta que `.vercel/project.json` deveria ser commitado para que o CI funcione: sem ele, `vercel pull --yes` no CI falha ou cria um projeto fantasma.

Esta story é independente de D1 e pode ser executada em paralelo com PROD-001-1.

---

## Acceptance Criteria

- [ ] `vercel whoami` retorna `jvdfcode` (ou confirma que o contexto de team é `jvdfcode`)
- [ ] `.vercel/project.json` existe e contém `orgId` e `projectId` do team `jvdfcode`
- [ ] `cat /Users/pedroemilioferreira/AI/spclaudecode/.vercel/project.json` mostra JSON válido com campos `orgId` e `projectId`
- [ ] `.vercel/project.json` commitado no repositório git
- [ ] `vercel ls --scope jvdfcode` lista o projeto `smartpreco` (ou equivalente)

---

## Tasks

- [ ] `vercel whoami` — verificar conta atual
- [ ] Se não estiver em jvdfcode: `vercel teams switch jvdfcode`
- [ ] `vercel link --scope jvdfcode --cwd /Users/pedroemilioferreira/AI/spclaudecode` (responder prompts interativos)
- [ ] `cat .vercel/project.json` — confirmar `orgId` e `projectId` corretos
- [ ] `git add .vercel/project.json && git commit -m "chore: commit vercel project.json for jvdfcode team (B4, L7)"`

---

## File List

- `.vercel/project.json` (criado pelo `vercel link`, commitado)

---

## Notas técnicas

Sequência canônica de Gage (Bloco 1 e 2):
```
1. vercel whoami
2. vercel teams switch jvdfcode  (se necessário)
3. vercel whoami  (confirmar)
4. vercel link --scope jvdfcode --cwd /Users/pedroemilioferreira/AI/spclaudecode
   Prompts esperados:
   - "Set up ~/AI/spclaudecode?" → Y
   - "Which scope?" → jvdfcode
   - "Link to existing project?" → Y (se já existe) ou N (cria novo)
   - "What's your project's name?" → smartpreco (se criando novo)
   - "In which directory is your code?" → ./
5. cat .vercel/project.json
   # deve ter: { "orgId": "...", "projectId": "..." }
```

`.vercel/project.json` contém apenas `orgId` e `projectId` — não secrets. É seguro e necessário commitar, conforme Gage recomendação 1.

Após commitar, adicionar `VERCEL_ORG_ID` e `VERCEL_PROJECT_ID` como GitHub Actions secrets para o CI funcionar via `--prebuilt`.

---

## Rollback

```bash
# Deslinkar o projeto Vercel e remover artefatos locais
vercel unlink
rm -rf .vercel
# Após isso, vercel link pode ser executado novamente com o scope correto
```

Use este rollback se o link foi feito no scope errado (ex: `pedroemilio11` em vez de `jvdfcode`). O CI ficará inoperante até que o link seja refeito corretamente.

---

## Riscos

1. `vercel link` é interativo — não pode ser automatizado sem `--yes`; executar manualmente nesta story.
2. Se o projeto `smartpreco` já existir em `jvdfcode` de uma sessão anterior, confirmar que é o mesmo projeto (checar `projectId` vs dashboard Vercel).
