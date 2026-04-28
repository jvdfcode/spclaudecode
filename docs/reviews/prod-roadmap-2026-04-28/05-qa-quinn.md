# Quinn — Diagnóstico de QA para Produção

> "Verde no CI ≠ verde em produção. Mostra a evidência."

## Veredito (1 frase)

O pipeline CI bloqueia corretamente defeitos de build e invariantes de concorrência, mas deixa passar regressão visual silenciosa, falha de autenticação real, drift de schema em push direto e ausência total de observabilidade de Sentry em produção — quatro vetores de bug que não aparecem em `pnpm test:coverage`.

---

## 5 problemas-raiz no escopo de QA

**1. Middleware sem cobertura de teste após fix crítico (commit 683e538)**
— Arquivo: `src/middleware.ts` — Teste deveria existir em: `tests/unit/middleware.test.ts` (arquivo inexistente)
— Evidência: o fix que tornou `/calculadora-livre` pública é lógica de roteamento com três branches (`user+login/cadastro → redirect /dashboard`, `!user+protected → redirect /login`, `pass-through`). A invariante `/calculadora-livre` nunca redireciona para `/login` não tem asserção em nenhum arquivo de teste. O `vitest.config.ts` inclui `src/**/*.test.ts` mas nenhum colocado ao lado de `middleware.ts`; `tests/unit/` não tem subpasta para middleware.
— Severidade: **CRÍTICA** — regressão silenciosa neste arquivo trava o fluxo de aquisição (lead magnet inacessível) ou expõe rotas protegidas.

**2. Gate `db-types-drift` cego a push direto em `main`**
— Arquivo: `.github/workflows/ci.yml` — Gate: job `db-types-drift` (linha 103)
— Evidência: `if: github.event_name == 'pull_request'` — o job não executa em push direto a `main` ou `feature/**`. O CI principal (`ci`) roda em `push` e em `pull_request`, mas drift de schema só é verificado via PR. Um push direto com `supabase.gen.ts` desatualizado passa todos os gates e vai para produção gerando erros de runtime nas queries tipadas.
— Severidade: **ALTA** — o contrato de dados entre app e banco pode silenciosamente divergir sem nenhum alarme.

**3. Cobertura de testes restrita a `src/lib/**` — componentes Halo Onda 4 sem snapshot**
— Arquivo: `vitest.config.ts` (linha 16: `include: ['src/lib/**']`) — Testes deveriam existir em: `tests/unit/components/StatusPill.test.tsx`, `ProfitabilityBadge.test.tsx`, `ResultCard.test.tsx`, `LeadMagnetForm.test.tsx` (nenhum existe)
— Evidência: 379 substituições do Halo DS + reescrita completa de 4 componentes na Onda 4 não têm snapshot nem teste comportamental. O coverage report do CI mostra apenas `src/lib/**`; `src/components/**` está fora do escopo de cobertura por configuração. Uma regressão visual nos tokens Tailwind v4 (`@theme` em `globals.css`) não será detectada até o Lighthouse ou até usuário reportar.
— Severidade: **ALTA** — visual regression passaria por todas as 6 etapas do CI sem alarme.

**4. Sentry sem validação de conectividade — `tracesSampleRate: 0.1` pode ser silencioso**
— Arquivo: `sentry.edge.config.ts`, `sentry.server.config.ts`, `sentry.client.config.ts` — Teste deveria existir em: `tests/unit/lib/sentry.test.ts` (arquivo inexistente)
— Evidência: `SENTRY_DSN` é lido de `process.env` sem fallback e sem verificação. Em produção, se a variável não estiver configurada no Vercel ou estiver errada, `Sentry.init()` é silencioso — nenhuma exceção, nenhum log, zero alertas. O CI não tem step que valide que o DSN existe nos secrets ou que um evento de teste chega ao Sentry. `tracesSampleRate: 0.1` significa que 90% das transações edge não geram trace mesmo quando Sentry está ativo.
— Severidade: **ALTA** — a camada de observabilidade de produção pode estar morta sem que ninguém saiba.

**5. Ausência total de E2E — fluxo cadastro+login+lead magnet sem cobertura automatizada**
— Arquivo: nenhum — Testes deveriam existir em: `tests/e2e/auth-flow.spec.ts`, `tests/e2e/lead-magnet.spec.ts`, `tests/e2e/ml-proxy.spec.ts` (nenhum existe; `playwright` está instalado como devDependency mas sem suite)
— Evidência: `package.json` lista `"playwright": "^1.59.1"` sem nenhum script `test:e2e`. O diretório `tests/` contém apenas `unit/` e `output/`. Os fluxos críticos de produção — criar conta, fazer login, acessar calculadora-livre sem autenticação, submeter LeadMagnetForm, receber resposta 200 do ML proxy — não têm nenhum teste automatizado end-to-end. O `smoke.test.ts` detectado em `tests/unit/` cobre apenas utilitários, não fluxos HTTP reais.
— Severidade: **ALTA** — um bug de integração nos fluxos de aquisição e autenticação chega a produção sem alarme.

---

## 3 dependências externas

**1. Depende de @devops (Gage)**: configurar `SENTRY_DSN` como secret no Vercel (environments: Production, Preview) e adicionar step de smoke no CI que valide `curl https://sentry.io/api/0/projects/... -H "Authorization: Bearer $SENTRY_TOKEN"` para confirmar que o DSN está ativo antes do deploy. Também é @devops quem pode adicionar branch protection rule no GitHub para bloquear push direto a `main` sem PR — solução definitiva para o gap do `db-types-drift`.

**2. Depende do USUÁRIO**: fornecer credenciais de teste (email/senha de conta de staging) para que os testes E2E de autenticação possam rodar em CI sem expor dados reais. O Lighthouse CI roda `pnpm start` em build local contra rotas públicas (`/calculadora-livre`, `/login`, `/cadastro`) — não precisa de credenciais para essas. Rotas autenticadas (`/dashboard`) precisariam de sessão injetada via `storageState` do Playwright, o que requer uma conta de teste dedicada.

**3. Depende de @devops + decisão de produto**: o job Lighthouse roda apenas em PR (`if: github.event_name == 'pull_request'`) e constrói o app com `pnpm build` + `pnpm start` sem variáveis de ambiente reais de banco. Se o build falhar silenciosamente por ausência de `NEXT_PUBLIC_SUPABASE_URL` no contexto do Lighthouse, o job passa sem ter auditado nada — é necessário confirmar se o `startServerReadyPattern: "Ready in"` realmente aparece nesse build parcial, ou se o Lighthouse step nunca executa os audits.

---

## 3 recomendações

**1. Criar `tests/unit/middleware.test.ts` — teste novo, prioridade imediata**
Cobrir as três branches do `middleware.ts` com mocks de `NextRequest` e `NextResponse`: (a) usuário autenticado em `/login` → redirect `/dashboard`; (b) usuário não autenticado em `/dashboard` → redirect `/login`; (c) qualquer usuário em `/calculadora-livre` → pass-through sem redirect. Este é o único arquivo com fix recente crítico e zero cobertura — deve ser o primeiro teste adicionado antes do deploy.

**2. Criar `tests/e2e/` com três specs mínimos usando Playwright já instalado — testes novos**
Adicionar script `"test:e2e": "playwright test"` no `package.json` e três arquivos: `auth-flow.spec.ts` (cadastro → login → redirect dashboard), `lead-magnet.spec.ts` (acesso `/calculadora-livre` sem auth → formulário renderiza → submit → resposta), `ml-proxy.spec.ts` (request ao endpoint ML retorna status 200 com payload válido). Adicionar step `test:e2e` no CI após o step `Test` existente, condicionado a `push` em `main` para evitar custo em todo PR.

**3. Mover `db-types-drift` para o job `ci` principal — ajuste em workflow existente**
No `.github/workflows/ci.yml`, remover `if: github.event_name == 'pull_request'` do job `db-types-drift` e transformá-lo em step dentro do job `ci` (ou manter como job paralelo mas sem a condicional). Isso garante que drift de schema seja detectado também em push direto a `main` ou `feature/**`. Custo: o step requer `SUPABASE_ACCESS_TOKEN` nos secrets — confirmar com @devops que o secret já existe no contexto de push, não só de PR.
