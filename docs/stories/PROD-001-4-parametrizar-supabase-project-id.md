# Story PROD-001-4 — Parametrizar SUPABASE_PROJECT_ID

**Epic:** EPIC-PROD-001
**Status:** Ready for Review
**Owner:** Pedro Emilio (executor: @dev Dex via handoff)
**Severidade origem:** H4
**Esforço estimado:** 1 SP

---

## Contexto

Dara (02-data-engineer-dara.md, problema 3) documenta que o project-id Supabase está hardcoded em dois lugares: `ci.yml:116` (`--project-id ltpdqavqhraphoyusmdi`) e `package.json` script `generate:types`. Se a decisão D1 for por um projeto novo, o CI continuará gerando tipos do projeto antigo — falso positivo ou falso negativo garantido no gate `db-types-drift`. Mesmo mantendo o projeto existente, hardcoded IDs bloqueiam qualquer mudança futura e violam o princípio de configuração via variável de ambiente.

Depende de PROD-001-1 (project-id correto definido).

**v2 — mantida no sprint:** Alan Nicolas e Thiago Finch sugerem depriorizar (PRATA / higiene sem ROI imediato). Mantida porque débito de hardcode cresce com o tempo e custo é baixo (1 SP). Ver `docs/epics/EPIC-PROD-001-caminho-producao.md` seção "Recomendações não absorvidas".

---

## Acceptance Criteria

- [x] `grep "ltpdqavqhraphoyusmdi" ci.yml` retorna 0 linhas (ID hardcoded removido)
- [x] `grep "ltpdqavqhraphoyusmdi" package.json` retorna 0 linhas (ID hardcoded removido)
- [x] `ci.yml` usa `${{ secrets.SUPABASE_PROJECT_ID }}` na linha do `gen types`
- [x] `package.json` script `generate:types` usa `$SUPABASE_PROJECT_ID` como variável de ambiente
- [x] `SUPABASE_PROJECT_ID` adicionado ao `.env.example` com comentário e valor placeholder
- [ ] CI passa após a mudança (verificar com `gh run list --branch main --limit 1`) — pendente: requer push + secret configurado no GitHub

---

## Tasks

- [x] Editar `ci.yml:116`: substituir `--project-id ltpdqavqhraphoyusmdi` por `--project-id ${{ secrets.SUPABASE_PROJECT_ID }}`
- [x] Editar `package.json` script `generate:types`: substituir project-id hardcoded por `$SUPABASE_PROJECT_ID`
- [x] Editar `package.json` script `check:types-drift`: substituir project-id hardcoded por `$SUPABASE_PROJECT_ID` (também hardcoded, corrigido junto)
- [x] Adicionar `SUPABASE_PROJECT_ID=<seu-project-id>` ao `.env.example` (com comentário explicativo)
- [ ] Adicionar `SUPABASE_PROJECT_ID` aos GitHub Actions secrets (Settings → Secrets → Actions) — ação manual do Owner
- [ ] Adicionar `SUPABASE_PROJECT_ID` ao `.env.local` com o valor real (não commitado) — ação manual do Owner
- [ ] Commit: `fix: parametrize SUPABASE_PROJECT_ID — remove hardcoded project ref (H4)` — aguarda @devops

---

## File List

- `.github/workflows/ci.yml` (linha 116) — modificado
- `package.json` (scripts `generate:types` e `check:types-drift`) — modificado
- `.env.example` (entrada `SUPABASE_PROJECT_ID` adicionada) — modificado

---

## Notas técnicas

Snippet exato de Dara (recomendação 2):
```yaml
# ci.yml linha 116 — antes
run: supabase gen types typescript --project-id ltpdqavqhraphoyusmdi > /tmp/supabase.gen.ts
# depois
run: supabase gen types typescript --project-id ${{ secrets.SUPABASE_PROJECT_ID }} > /tmp/supabase.gen.ts
```
```json
// package.json — antes
"generate:types": "supabase gen types typescript --project-id ltpdqavqhraphoyusmdi > src/types/supabase.gen.ts"
// depois
"generate:types": "supabase gen types typescript --project-id $SUPABASE_PROJECT_ID > src/types/supabase.gen.ts"
```

---

## Riscos

1. Se o secret `SUPABASE_PROJECT_ID` não estiver configurado no GitHub antes do push, o job `db-types-drift` falhará — configurar antes do commit.
2. `.env.example` com o project-id real expõe o ID publicamente se o repositório for público — usar placeholder `your-supabase-project-id` no `.env.example`.
