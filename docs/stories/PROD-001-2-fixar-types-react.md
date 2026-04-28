# Story PROD-001-2 — Fixar @types/react@18 + pnpm install + tsc verde

**Epic:** EPIC-PROD-001
**Status:** Ready for Review
**Owner:** Pedro Emilio (executor: @dev Dex via handoff)
**Severidade origem:** B1
**Esforço estimado:** 1 SP

---

## Contexto

Aria (01-architect-aria.md, problema 4) documenta que `@types/react` no lock file pode estar resolvendo para a versão 19 enquanto o React runtime é 18. O mismatch causa falha em `tsc --noEmit` antes que o `next build` termine — bloqueando o deploy na Vercel completamente. O `package.json:28` declara `"@types/react": "^18.3.12"` mas o caret permite que o pnpm resolva para `^19` dependendo do lock file atual. APIs mudadas entre v18 e v19 (ex: `children: ReactNode` agora explícito em v19) podem quebrar componentes que funcionam em dev (Node.js) mas explodem na tipagem.

Esta story é independente de D1 e pode ser executada em paralelo com PROD-001-1.

**v2 — gate CI vinculado:** AC adicionado referenciando o gate `check:react-types-major` em `ci.yml:38-39`. Input de Pedro Valério (síntese trio, mudança #9).

---

## Acceptance Criteria

- [x] `pnpm typecheck` (`tsc --noEmit`) retorna exit code 0 sem erros de tipo
- [x] `grep "@types/react" pnpm-lock.yaml` mostra exclusivamente versões `18.x.x` (nenhuma `19.x.x`)
- [ ] `pnpm build` completa localmente sem erros de tipagem (pode falhar por vars de ambiente ausentes — isso é esperado e resolvido em PROD-001-6)
- [x] `git diff package.json` mostra `@types/react` e `@types/react-dom` fixados em versão exata `18.x.x`
- [x] Gate CI `check:react-types-major` (`ci.yml:38-39`) passa após o fix; se o script `scripts/check-react-types-major.mjs` não cobrir o cenário de pin exato, atualizar o script para validar o lock file corretamente

---

## Tasks

- [x] Editar `package.json`: fixar `"@types/react": "18.3.12"` e `"@types/react-dom": "18.3.1"` (versões exatas, sem caret)
- [x] Rodar `pnpm install` para regen lock file
- [x] Rodar `pnpm typecheck` e corrigir qualquer erro de tipo emergente
- [x] Verificar `pnpm-lock.yaml` — grep por `@types/react` confirma 18.x.x
- [x] Verificar `ci.yml:38-39` — confirmar que `check:react-types-major` cobre o cenário de pin exato; se necessário, atualizar `scripts/check-react-types-major.mjs`
- [ ] Commit: `fix: pin @types/react@18.3.12 to resolve tsc mismatch (B1)` (pendente — não commitar nesta execução)

---

## File List

- `package.json` (editado: `@types/react` `^18.3.12` → `18.3.12`, `@types/react-dom` `^18.3.1` → `18.3.1`)
- `pnpm-lock.yaml` (regenerado: `@types/react` `18.3.28` → `18.3.12`, `@types/react-dom` `18.3.7` → `18.3.1`)
- `scripts/check-react-types-major.mjs` (sem alteração — script já cobre cenário de pin exato via `major()` function)

---

## Notas técnicas

Versões exatas recomendadas por Aria: `@types/react@18.3.12`, `@types/react-dom@18.3.1`. Usar pin exato (sem `^` ou `~`) para garantir que pnpm não resolva para 19.x.x em instalações futuras.

Se `pnpm typecheck` mostrar erros além do types mismatch (ex: erros de lógica de negócio existentes), documentá-los mas não corrigi-los nesta story — o escopo é apenas o B1.

Ver Aria recomendação 1: "types fix (30min) → env vars Vercel (1h) → build de staging valida" — esta story é o primeiro passo dessa sequência.

Gate CI referenciado: `ci.yml:38-39` — job `check:react-types-major` garante que nenhum install futuro resolva para v19.

---

## Riscos

1. `pnpm typecheck` pode revelar erros de tipo legítimos mascarados pela versão incorreta — registrar e criar story separada se fora do escopo de B1.
2. Após fix, algum componente pode requerer `children` explícito como prop — corrigir inline se < 5 arquivos, caso contrário criar story específica.
3. Script `check-react-types-major.mjs` pode não cobrir o cenário de pin exato — inspecionar antes de marcar AC concluído.
