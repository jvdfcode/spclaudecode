# Aria — Diagnostico de Arquitetura para Producao

> "Ta ligado que arquitetura sem evidencia e desejo, nao engenharia."

---

## Veredito (1 frase)

O app tem um caminho viavel ate producao, mas esta bloqueado por cinco falhas concretas: duas variaveis de ambiente ausentes que quebram o build Sentry, um middleware rodando no Edge Runtime sem acesso a `cookies()`, um cron Vercel sem autorizacao configurada, e um mismatch de tipos React que explode em `tsc --noEmit` antes do `next build` terminar.

---

## 5 problemas-raiz no escopo de arquitetura

**1. Variaveis de ambiente Sentry nao provisionadas para producao**
`next.config.js:11-13` passa `process.env.SENTRY_ORG` e `process.env.SENTRY_PROJECT` para `withSentryConfig`. Se essas vars estiverem vazias no ambiente Vercel da conta `jvdfcode`, o `withSentryConfig` emite warnings e o upload de source maps falha silenciosamente — erros chegam ao Sentry sem stack trace legivel. Adicionalmente, `sentry.server.config.ts:4` e `sentry.edge.config.ts:3` usam `process.env.SENTRY_DSN` (server-side), enquanto `sentry.client.config.ts:4` usa `process.env.NEXT_PUBLIC_SENTRY_DSN` — sao duas vars distintas; se apenas uma for configurada no Vercel, um dos tres runtimes fica surdo. `.env.example` esta incompleto (DEBT-H5), entao nao ha lista canonica de quais vars precisam existir.
**Severidade: BLOCKER**

**2. Middleware no Edge Runtime chama `createServerClient` que depende de `cookies()` do Node.js**
`src/middleware.ts:1-9` importa `createServerClient` de `@supabase/ssr` e instancia um client com `request.cookies.getAll()` — isso esta correto para o Edge. O problema esta no `src/lib/supabase/server.ts:12-14`: `createServerSupabase` faz `await cookies()` (Next.js `next/headers`). Qualquer Route Handler ou Server Action que chame `createServerSupabase` dentro de um contexto que nao seja Node.js runtime vai falhar em producao com `Error: cookies() is only available in a Server Component`. O `instrumentation.ts` so importa configs Sentry (`nodejs` vs `edge` por `NEXT_RUNTIME`), mas nao ha separacao equivalente para o client Supabase. O risco e silencioso no dev (Node.js unico runtime), explode em producao se qualquer rota for migrada para Edge ou Streaming.
**Severidade: HIGH**

**3. Cron Vercel sem autorizacao — endpoint `/api/cron/cleanup-ml-cache` acessivel publicamente**
`vercel.json:3-7` define o cron mas nao ha header de autorizacao configurado. A Vercel injeta automaticamente o header `Authorization: Bearer <CRON_SECRET>` nas chamadas de cron, mas o handler precisa verificar esse header — caso contrario qualquer request HTTP anonimo aciona o cleanup e drena a cota do Mercado Livre ou corrompe o cache. Nao ha evidencia no repo de que o handler valida `Authorization`. Sem isso, o endpoint e um vetor de abuso trivial em producao.
**Severidade: HIGH**

**4. `@types/react@19` instalado com React 18 — `tsc --noEmit` falha antes do `next build`**
`package.json:28` mostra `"@types/react": "^18.3.12"`, mas o lock file pode resolver para `^19` dependendo do semver real (DEBT-C1 do technical-debt-assessment confirma o mismatch: `@types/react@19` x React 18). O comando `pnpm typecheck` (`tsc --noEmit`) quebra a pipeline de CI/CD da Vercel se o tsconfig nao estiver alinhado. Na Vercel, `next build` roda typechecking embutido — um erro de tipo de definicao em um componente que usa APIs mudadas entre tipos v18 e v19 (ex: `children: ReactNode` agora requerido explicitamente em v19) bloqueia o deploy completamente.
**Severidade: BLOCKER**

**5. `next.config.js` usa `instrumentationHook: true` como flag experimental — removida no Next 15**
`next.config.js:7` define `experimental.instrumentationHook: true`. No Next.js 14.x essa flag habilita `instrumentation.ts`. No Next 15+ a flag foi promovida a stable e o campo `experimental` foi removido — se o projeto for upgradado (ou se o Vercel build usa uma versao de Next que ignora a flag), o `register()` em `instrumentation.ts` simplesmente nao e chamado, e o Sentry nao inicializa no server nem no edge. O app vai para producao silenciosamente sem observabilidade. Como o `package.json` usa `"next": "^14.2.35"` com caret, qualquer `pnpm update` pode pular para 14.x mais recente onde o comportamento e estavel — mas a flag vai tornar-se ruido ou quebrar em upgrade futuro.
**Severidade: MEDIUM**

---

## 3 dependencias externas

1. **Depende do USUARIO (Pedro/jvdfcode)**: Provisionar as variaveis de ambiente no projeto Vercel da conta `jvdfcode` antes do primeiro deploy — lista minima: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT`, `ML_APP_ID`, `ML_CLIENT_SECRET`, `CRON_SECRET`. Sem isso nenhum build de producao pode ser considerado validado.

2. **Depende do USUARIO (DNS/Cloudflare)**: Apontar `smartpreco.app` no Cloudflare para os nameservers da Vercel (ou adicionar registro `A`/`CNAME` apontando para o IP do deployment Vercel). O DNS atual aponta para AWS antiga — producao nao e alcancavel ate essa mudanca ser feita. Exige acesso ao painel Cloudflare e decisao sobre manter Cloudflare como proxy (pode gerar conflito de SSL com a Vercel).

3. **Depende de @devops (Gage)**: Transferir o projeto Vercel do CLI `pedroemilio11` para a conta `jvdfcode` (ou re-linkar o repositorio via `vercel link` autenticado com `jvdfcode`), e validar que o cron `/api/cron/cleanup-ml-cache` esta visivel no dashboard Vercel com `CRON_SECRET` configurado como env var de producao.

---

## 3 recomendacoes

1. **Resolver os dois BLOCKERs antes de qualquer outro trabalho** — `package.json`: fixar `"@types/react": "^18.3.12"` e `"@types/react-dom": "^18.3.1"` com versoes exatas (18.x.x), rodar `pnpm install`, confirmar `pnpm typecheck` limpo. Em seguida, criar `.env.production` de referencia (nunca comitado) com todas as vars de Sentry e subir no Vercel via `vercel env add`. Ordem: types fix (30min) → env vars Vercel (1h) → build de staging valida.

2. **Adicionar validacao do `CRON_SECRET` no handler `/api/cron/cleanup-ml-cache`** — checar `request.headers.get('authorization') === \`Bearer ${process.env.CRON_SECRET}\`` e retornar 401 se falhar. Padrao oficial Vercel para crons autenticados. Executar antes de apontar DNS, pois o endpoint fica publico assim que o dominio estiver ativo.

3. **Documentar em `.env.example` todas as vars de runtime, separadas por contexto** (client/server/edge/build-time) — isso resolve DEBT-H5 e serve de checklist auditavel para o provisionamento em `jvdfcode`. Incluir comentario explicitando que `SENTRY_DSN` (server) e `NEXT_PUBLIC_SENTRY_DSN` (client) sao vars distintas e ambas obrigatorias. Fazer isso antes da transferencia de conta Vercel para evitar deploy surdo.

---

*Aria — @architect — prod-roadmap-2026-04-28 — Fase 1 de diagnostico*
