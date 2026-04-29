# Story TD-001-3 — Forms a11y (aria-describedby + aria-busy + zod email)

**Epic:** EPIC-TD-001
**Status:** Draft
**Owner:** @dev (sugerido)
**Severidade débito:** HIGH / MEDIUM
**Esforço estimado:** 1–2 dias

---

## Contexto

Complementa a TD-001-2 completando o baseline WCAG 2.1 nos formulários de autenticação e no componente de loading global. Três gaps distintos agrupados por coesão de escopo (todos tocam formulários e feedback de estado ao usuário):

**DEBT-FE-3 — Forms sem `aria-describedby` ligando erro→input (HIGH)**
`LoginForm`, `SignupForm` e `RecoverForm` exibem mensagens de validação visualmente próximas aos inputs, mas sem associação programática via `aria-describedby`. Leitores de tela anunciam o erro como texto solto, sem vinculá-lo ao campo que causou o erro — o usuário não sabe qual campo corrigir. WCAG 2.1 SC 1.3.1 (Info and Relationships).

**DEBT-FE-5 — GenieButton sem `aria-busy={loading}` (MEDIUM)**
`GenieButton` tem estado de loading visual (spinner/animação), mas não comunica esse estado via `aria-busy`. Leitores de tela não sabem que a ação está em andamento — usuário pode acionar o botão novamente desnecessariamente ou não saber que o sistema está processando.

**DEBT-FE-7 — Validação de email frouxa, sem zod (MEDIUM)**
Formulários de autenticação usam validação de email por regex simples ou `type="email"` do browser, que aceita strings inválidas como "a@b". Adotar `zod` para schema de validação unifica o pattern com o resto do codebase (Supabase RPC já usa zod em outros lugares) e garante validação rigorosa client-side antes de dispatch de Server Action.

Os três débitos são agrupados nesta story porque todos impactam os mesmos arquivos (`LoginForm`, `SignupForm`, `RecoverForm`, `GenieButton`) e podem ser entregues no mesmo PR sem conflito com TD-001-2.

---

## Débitos cobertos

- **DEBT-FE-3** (HIGH) — Forms sem `aria-describedby` ligando erro→input — `LoginForm`, `SignupForm`, `RecoverForm`
- **DEBT-FE-5** (MEDIUM) — `GenieButton` sem `aria-busy={loading}` — localização a confirmar (buscar `GenieButton` no codebase)
- **DEBT-FE-7** (MEDIUM) — Validação de email frouxa; sem `zod` — forms de autenticação

---

## Acceptance Criteria

- [ ] **AC1:** Em `LoginForm`, `SignupForm` e `RecoverForm`: cada mensagem de erro possui `id` único e o input correspondente tem `aria-describedby` apontando para esse `id`; quando há erro, screen reader anuncia o nome do campo + o texto do erro ao focar no input
- [ ] **AC2:** `GenieButton` tem `aria-busy={isLoading}` aplicado no elemento `<button>` raiz; quando `isLoading=true`, `aria-busy="true"` está presente no DOM
- [ ] **AC3:** Schema zod para email importado e usado em `LoginForm`, `SignupForm` e `RecoverForm` antes de submeter Server Action; email inválido (ex: "a@b", "teste", "") é rejeitado client-side com mensagem de erro acessível (coberta por AC1)
- [ ] **AC4:** Teste unitário do schema zod em `tests/unit/authSchemas.test.ts` — pelo menos 5 casos: email válido, sem @, domínio inválido, string vazia, undefined
- [ ] **AC5:** axe-core (run manual em dev) sem violations CRITICAL em `/login`, `/signup`, `/recover` após esta story
- [ ] **AC6:** `pnpm typecheck`, `pnpm lint`, `pnpm test` passando

---

## Tasks

- [ ] **T1:** Localizar `GenieButton` no codebase — `grep -r "GenieButton" src/ --include="*.tsx" -l`; identificar o arquivo e a prop `loading`/`isLoading`
- [ ] **T2:** Localizar `LoginForm`, `SignupForm`, `RecoverForm` — `grep -r "LoginForm\|SignupForm\|RecoverForm" src/ --include="*.tsx" -l`; identificar estrutura de exibição de erros em cada um
- [ ] **T3:** Adicionar `aria-busy={isLoading}` em `GenieButton` no elemento `<button>` raiz
- [ ] **T4:** Para cada form de autenticação (`LoginForm`, `SignupForm`, `RecoverForm`):
  - Atribuir `id` único para cada mensagem de erro (ex: `id="email-error"`, `id="password-error"`)
  - Adicionar `aria-describedby="email-error"` no `<input>` de email correspondente
  - Adicionar `aria-describedby="password-error"` no `<input>` de senha
  - Garantir que o elemento de erro seja renderizado (mesmo vazio com `aria-live="polite"`) para que o `aria-describedby` seja válido mesmo antes do primeiro submit
- [ ] **T5:** Instalar `zod` se não estiver no `package.json`: `pnpm add zod` (verificar primeiro — pode já estar presente)
- [ ] **T6:** Criar `src/lib/validations/authSchemas.ts` com schema zod:
  ```ts
  import { z } from 'zod';
  export const emailSchema = z.string().email('E-mail inválido').min(1, 'E-mail obrigatório');
  export const loginSchema = z.object({ email: emailSchema, password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres') });
  ```
- [ ] **T7:** Integrar `loginSchema.safeParse()` (ou equivalente com `react-hook-form` se já usado) nos três formulários — validar antes de dispatch da Server Action
- [ ] **T8:** Escrever `tests/unit/authSchemas.test.ts` com pelo menos 5 casos para `emailSchema` — cobrir AC4
- [ ] **T9:** Executar `pnpm typecheck && pnpm lint && pnpm test`
- [ ] **T10:** Run axe-core em dev em `/login` para verificar AC5 — registrar resultado no PR

---

## File List

_(preenchido durante implementação)_

- `src/lib/validations/authSchemas.ts` — criado (T6)
- `src/components/GenieButton.tsx` (ou caminho equivalente) — modificado (T3)
- `src/components/auth/LoginForm.tsx` (ou caminho equivalente) — modificado (T4, T7)
- `src/components/auth/SignupForm.tsx` (ou caminho equivalente) — modificado (T4, T7)
- `src/components/auth/RecoverForm.tsx` (ou caminho equivalente) — modificado (T4, T7)
- `tests/unit/authSchemas.test.ts` — criado (T8)

---

## Notas técnicas

**Padrão aria-describedby para erros de formulário:**
```tsx
// Elemento de erro — sempre renderizado, conteúdo muda
<p id="email-error" aria-live="polite" className="text-sm text-red-600 min-h-[1.25rem]">
  {errors.email?.message ?? ''}
</p>

// Input com referência
<input
  id="email"
  type="email"
  aria-describedby="email-error"
  aria-invalid={!!errors.email}
  ...
/>
```
`aria-live="polite"` garante que o screen reader anuncia a mensagem quando ela aparece. `aria-invalid` adiciona sinalização semântica de estado de erro.

**GenieButton — padrão aria-busy:**
```tsx
<button
  aria-busy={isLoading}
  disabled={isLoading}
  ...
>
  {isLoading ? <Spinner /> : children}
</button>
```
`disabled={isLoading}` previne duplo-submit; `aria-busy` comunica estado para leitores de tela.

**Zod — verificar se já instalado:**
`cat /Users/pedroemilioferreira/AI/spclaudecode/package.json | grep zod` antes de instalar.

**Se `react-hook-form` já está no projeto:** integrar com `zodResolver` do pacote `@hookform/resolvers/zod` em vez de `safeParse` manual — verificar padrão existente nos formulários antes de decidir.

**Referências:**
- `docs/reviews/ux-specialist-review.md` — review Uma (Fase 6), seção Forms A11y
- `technical-debt-assessment.md` Seção 2.2 — DEBT-FE-3
- `technical-debt-assessment.md` Seção 2.3 — DEBT-FE-5, DEBT-FE-7
- WCAG 2.1 SC 1.3.1 (Info and Relationships) — https://www.w3.org/TR/WCAG21/#info-and-relationships

---

## Riscos / Plano de rollback

**Risco:** Se `react-hook-form` não estiver no projeto, integrar zod manualmente pode ser mais verboso — avaliar durante T2 se o esforço cabe em 1 dia.

**Mitigação:** Schema zod pode ser usado apenas com `safeParse` sem precisar de `react-hook-form` — abordagem imperativa funciona mas é mais verbosa. Se ultrapassar escopo, criar subtask na story TD-001-3b para completar a integração zod.

**Rollback:** Todas as alterações são aditivas (novos atributos HTML, novo arquivo de schema). `git revert` é seguro sem efeito em dados ou contratos de API.

---

*Story gerada por @pm (Morgan) — EPIC-TD-001 — Brownfield Discovery Fase 10 — 2026-04-27*
