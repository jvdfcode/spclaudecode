# Gage — Diagnóstico de Deploy + DNS para Produção

> "Deploy sem gate é tomara que dê certo."

## Veredito (1 frase)

O pipeline está funcionalmente completo no código, mas bloqueado por três gaps operacionais sequenciais e não-automáticos: o projeto nunca foi linkado ao team `jvdfcode` nesta máquina, as env vars de produção não existem no Vercel, e o DNS do Cloudflare ainda aponta para AWS — qualquer um dos três, sozinho, é suficiente para impedir que `smartpreco.app` sirva o app deployado.

---

## 5 problemas-raiz no escopo de DevOps

1. **Projeto não linkado ao team `jvdfcode`** — ausência de `.vercel/project.json` — sem este arquivo, todo comando `vercel` roda no contexto pessoal `pedroemilio11`, não no team; o deploy vai para o projeto errado ou cria um novo orphan — **BLOQUEADOR CRÍTICO**

2. **Env vars de produção inexistentes no Vercel** — `vercel.json` + `next.config.js` consomem `SUPABASE_SERVICE_ROLE_KEY`, `SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT`, `ML_APP_ID`, `ML_CLIENT_SECRET` e `NEXT_PUBLIC_APP_URL` em runtime; o build do CI passa `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` como secrets mas nenhuma var foi adicionada via `vercel env add` ao projeto no team `jvdfcode`; sem elas o build da Vercel falha silenciosamente ou o app quebra em produção — **BLOQUEADOR CRÍTICO**

3. **DNS do Cloudflare aponta para AWS, não para Vercel** — registros A `15.197.148.33` e `3.33.130.190` com proxy ON estão ativos; enquanto esses registros existirem, `smartpreco.app` serve a infra AWS anterior, não o deploy Vercel; a troca precisa ser feita APÓS o custom domain ser verificado e propagado no Vercel para evitar downtime — **BLOQUEADOR CRÍTICO**

4. **Proxy Cloudflare (orange cloud) ON incompatível com SSL Vercel em apex** — Vercel requer que o registro A do apex aponte direto para IPs Vercel (`76.76.21.21`) com proxy OFF (DNS-only/grey cloud) para emitir e renovar o certificado TLS via ACME; proxy ON no apex faz o Cloudflare terminar TLS antes de chegar na Vercel, o que quebra a validação do certificado e pode gerar erros de SSL intermitentes; o `www` CNAME com proxy ON é aceitável pois o Cloudflare faz forward correto, mas o apex precisa ser grey cloud — **SEVERIDADE ALTA**

5. **Cron job requer plano Pro para execução confiável** — `vercel.json` define `crons[0]` com schedule `0 3 * * *` para `/api/cron/cleanup-ml-cache`; no plano Hobby os crons são executados em best-effort e podem ser suprimidos sem aviso; para garantia de execução em produção o projeto no team `jvdfcode` precisa estar no plano Pro — **SEVERIDADE MÉDIA** (funcional só no Pro)

---

## Sequência canônica de deploy (passo-a-passo)

> Ordem importa. Não pule etapas. Cada passo depende do anterior.

**PRE-REQUISITO:** Estar no diretório `/Users/pedroemilioferreira/AI/spclaudecode` em todos os comandos abaixo.

### Bloco 1 — Autenticação e contexto de team

```
1. Verificar conta atual:
   vercel whoami

2. Se não estiver em jvdfcode, trocar de team:
   vercel teams switch jvdfcode

3. Confirmar que o switch funcionou:
   vercel whoami
   # Deve exibir: jvdfcode
```

### Bloco 2 — Link do projeto ao team

```
4. Linkar o repositório ao team (interativo — responder prompts):
   vercel link --scope jvdfcode --cwd /Users/pedroemilioferreira/AI/spclaudecode
   # Prompts esperados:
   #   - "Set up ~/AI/spclaudecode?" → Y
   #   - "Which scope?" → jvdfcode
   #   - "Link to existing project?" → Y (se já existe) ou N (cria novo)
   #   - "What's your project's name?" → smartpreco (se criando novo)
   #   - "In which directory is your code?" → ./

5. Verificar que .vercel/project.json foi criado e contém orgId de jvdfcode:
   cat /Users/pedroemilioferreira/AI/spclaudecode/.vercel/project.json
   # Deve ter: { "orgId": "...", "projectId": "..." }
```

### Bloco 3 — Env vars de produção

```
6. Adicionar cada env var no ambiente production (interativo, valor via stdin):
   vercel env add NEXT_PUBLIC_SUPABASE_URL production --scope jvdfcode
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production --scope jvdfcode
   vercel env add SUPABASE_SERVICE_ROLE_KEY production --scope jvdfcode
   vercel env add SUPABASE_ACCESS_TOKEN production --scope jvdfcode
   vercel env add NEXT_PUBLIC_SENTRY_DSN production --scope jvdfcode
   vercel env add SENTRY_DSN production --scope jvdfcode
   vercel env add SENTRY_ORG production --scope jvdfcode
   vercel env add SENTRY_PROJECT production --scope jvdfcode
   vercel env add ML_APP_ID production --scope jvdfcode
   vercel env add ML_CLIENT_SECRET production --scope jvdfcode
   vercel env add NEXT_PUBLIC_APP_URL production --scope jvdfcode
   # valor: https://smartpreco.app

7. Verificar que todas foram registradas:
   vercel env ls --scope jvdfcode
   # Confirmar 11 variáveis listadas com target "Production"
```

### Bloco 4 — Deploy de produção e captura de URL de verificação

```
8. Primeiro deploy de produção (build remoto na Vercel):
   vercel deploy --prod --scope jvdfcode
   # Aguardar até aparecer: "Production: https://smartpreco.app [ready]"
   # Anotar a URL de deployment (ex: smartpreco-xxxxxxx.vercel.app)

9. Inspecionar o deployment para confirmar sucesso e variáveis:
   vercel inspect <deployment-url-do-passo-8>
```

### Bloco 5 — Custom domain no Vercel

```
10. Adicionar apex domain ao projeto:
    vercel domains add smartpreco.app --scope jvdfcode

11. Adicionar www:
    vercel domains add www.smartpreco.app --scope jvdfcode

12. Verificar instruções de DNS geradas pela Vercel:
    vercel domains inspect smartpreco.app --scope jvdfcode
    # Vercel vai exibir: IPs para registro A do apex + CNAME para www
    # Anotar: o IP Vercel para apex é 76.76.21.21
```

### Bloco 6 — Troca de DNS no Cloudflare (acao operacional no painel)

```
13. No painel Cloudflare (smartpreco.app → DNS):
    a. DELETAR os dois registros A atuais (15.197.148.33 e 3.33.130.190)
    b. CRIAR registro A:
       - Name: @
       - IPv4 address: 76.76.21.21
       - Proxy status: DNS only (grey cloud)  ← OBRIGATORIO para SSL Vercel
    c. VERIFICAR registro CNAME www:
       - Name: www
       - Target: cname.vercel-dns.com  (ou o valor que a Vercel indicou no passo 12)
       - Proxy status: DNS only (grey cloud)  ← recomendado para evitar double-proxy
    d. Manter intactos: TXT _dmarc, CNAME _domainco... (validação de domínio)

14. Aguardar propagação DNS (tipicamente 2-10 min com Cloudflare; máx 24h globalmente).
    Verificar propagação:
    dig +short smartpreco.app A
    # Deve retornar 76.76.21.21
```

### Bloco 7 — Verificação final

```
15. Confirmar certificado TLS emitido pela Vercel:
    curl -Iv https://smartpreco.app 2>&1 | grep -E "SSL|issuer|subject|HTTP/"

16. Verificar cron registrado (requer plano Pro ativo no team jvdfcode):
    vercel inspect <deployment-url> | grep -i cron

17. Adicionar secrets do CI no repositório GitHub (Settings → Secrets → Actions):
    VERCEL_TOKEN         ← token pessoal ou de team com scope jvdfcode
    VERCEL_ORG_ID        ← orgId do .vercel/project.json
    VERCEL_PROJECT_ID    ← projectId do .vercel/project.json
    # Os secrets NEXT_PUBLIC_SUPABASE_* já existem no CI (ci.yml linha 52-53)
    # Confirmar SUPABASE_ACCESS_TOKEN e LHCI_GITHUB_APP_TOKEN também configurados
```

---

## 3 dependências externas

1. **Depende de @dev**: Os scripts `check:react-types-major` e `check:rate-limit-concurrency` referenciados nos gates TD-001-5 do `ci.yml` precisam existir em `scripts/` e estar funcionais; se falharem no runner do CI após o projeto ser linkado ao GitHub Actions com o novo `VERCEL_TOKEN`, o pipeline de deploy automatizado via `vercel deploy --prebuilt --prod` não executa.

2. **Depende do USUÁRIO**: O `vercel link` (passo 4) e todos os `vercel env add` (passo 6) são interativos e requerem input manual — não podem ser automatizados sem um token pré-criado e o arquivo `.vercel/project.json` já commitado (o que não é recomendável para `project.json` com `orgId` sensível); o usuário também precisa fornecer os valores reais das 11 env vars, especialmente `SUPABASE_SERVICE_ROLE_KEY`, `ML_CLIENT_SECRET` e os tokens Sentry.

3. **Depende do CLOUDFLARE**: A troca dos registros A (passo 13) é uma ação manual no painel da Cloudflare — não há API call automatizada aqui; adicionalmente, o botão "Continuar para ativação" visível no painel do Cloudflare **não deve ser clicado** antes de o DNS Vercel estar propagado, pois ativar o modo full do Cloudflare antes da verificação Vercel pode invalidar o processo de emissão de certificado ACME.

---

## 3 recomendações

1. **Commitar `.vercel/project.json` no repositório após o link** — isso elimina a dependência de `vercel link` interativo em qualquer máquina nova ou no runner do CI; o arquivo contém apenas `orgId` e `projectId` (não secrets), é seguro commitar, e é o padrão esperado pelo workflow `vercel pull → vercel build → vercel deploy --prebuilt` documentado para GitHub Actions; sem ele o `vercel pull --yes` no CI falha ou cria um projeto fantasma.

2. **Configurar o GitHub Actions para deploy automatizado via `--prebuilt`** — o `ci.yml` atual faz build (`pnpm build`) mas não chama `vercel deploy`; após o link, adicionar um job `deploy` que execute `vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}` seguido de `vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }} --scope jvdfcode` garante que o mesmo artefato validado pelos gates de lint/typecheck/test seja o que vai para produção — nunca um rebuild remoto sem os gates.

3. **Mover o Lighthouse CI para rodar contra a preview URL do Vercel, não contra `localhost`** — atualmente `lighthouserc.json` inicia `pnpm start` localmente e audita `http://localhost:3000/*`; isso significa que o Lighthouse roda contra um servidor local sem as variáveis de produção reais e sem o edge network da Vercel; o correto para PR gates é capturar a URL do preview deploy gerado pelo passo de `vercel deploy --prebuilt` e passar como `url` para o `@lhci/cli autorun`, garantindo que o score de acessibilidade `>= 0.9` reflita o ambiente real onde o usuário vai navegar.
