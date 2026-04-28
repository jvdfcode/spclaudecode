# Story PROD-001-8 — Deploy production + smoke test do build

**Epic:** EPIC-PROD-001
**Status:** Draft
**Owner:** Pedro Emilio (executor: @dev Dex via handoff)
**Severidade origem:** B1, B2, B4
**Esforço estimado:** 1 SP

---

## Contexto

Esta story valida que os três bloqueadores de build (B1: types React, B2: env vars, B4: projeto linkado) foram resolvidos com sucesso antes de apontar o DNS de produção. Um deploy na Vercel confirma que o `next build` completa, que as env vars estão presentes no runtime e que as rotas críticas respondem. Gage (04-devops-gage.md, Bloco 4) documenta a sequência: `vercel deploy --prod` seguido de inspeção da URL de deployment.

Depende de PROD-001-2 (types fix), PROD-001-5 (projeto linkado) e PROD-001-6 (env vars).

**v2 — semântica clarificada:** o `vercel deploy --prod` desta story cria um deploy production na Vercel, mas o domínio `smartpreco.app` ainda aponta para a infraestrutura AWS anterior enquanto PROD-001-9 (DNS) não for executada. O smoke test é realizado na URL `*.vercel.app`, não em `smartpreco.app`. O deploy `--prod` em `smartpreco.app` só estará efetivo após PROD-001-9 estar com status PASS. Input de Alan Nicolas (síntese trio, mudança #8).

---

## Acceptance Criteria

- [ ] `vercel deploy --prod --scope jvdfcode` completa sem erros de build
- [ ] URL de deployment gerada (ex: `smartpreco-xxxxxxx.vercel.app`) retorna `HTTP 200` em `curl -sI`
- [ ] `curl -sI https://smartpreco-xxxxxxx.vercel.app/calculadora-livre` retorna `HTTP 200`
- [ ] `curl -sI https://smartpreco-xxxxxxx.vercel.app/login` retorna `HTTP 200`
- [ ] `curl -sI https://smartpreco-xxxxxxx.vercel.app/api/health` retorna `HTTP 200` (ou equivalente de healthcheck)
- [ ] URL de deployment anotada para uso em PROD-001-9
- [ ] **Nota:** `smartpreco.app` ainda aponta para AWS neste ponto — smoke test é exclusivamente na URL `*.vercel.app`; só após PROD-001-9 PASS o tráfego de `smartpreco.app` chega neste deploy

---

## Tasks

- [ ] Confirmar que PROD-001-2, PROD-001-5 e PROD-001-6 estão completas
- [ ] Confirmar que `CRON_SECRET` foi adicionado ao Vercel (PROD-001-7) para evitar 401 no cron
- [ ] `vercel deploy --prod --scope jvdfcode` (aguardar build completo)
- [ ] Anotar URL de deployment exata (ex: `smartpreco-xxxxxxx.vercel.app`)
- [ ] `vercel inspect <deployment-url>` — confirmar sucesso e variáveis presentes
- [ ] `curl -sI https://<deployment-url>/calculadora-livre` — verificar HTTP 200
- [ ] `curl -sI https://<deployment-url>/login` — verificar HTTP 200
- [ ] Verificar no Vercel dashboard que o build não tem warnings críticos de env vars
- [ ] Registrar URL de deployment em comentário da story para PROD-001-9

---

## File List

(nenhum arquivo de código modificado nesta story — é operacional)

---

## Notas técnicas

Sequência de Gage (Bloco 4):
```bash
# Deploy production
vercel deploy --prod --scope jvdfcode
# Aguardar: "Production: https://smartpreco-xxxxxxx.vercel.app [ready]"
# Anotar a URL de deployment (ex: smartpreco-xxxxxxx.vercel.app)
# ATENÇÃO: smartpreco.app ainda aponta para AWS neste ponto
# O smoke test é na URL *.vercel.app, não em smartpreco.app

# Inspecionar o deployment
vercel inspect <deployment-url>

# Smoke test na URL *.vercel.app
curl -sI https://smartpreco-xxxxxxx.vercel.app/calculadora-livre
curl -sI https://smartpreco-xxxxxxx.vercel.app/login
```

Se o build falhar com erros de tipagem (não de env vars), PROD-001-2 não foi concluída corretamente — não prosseguir para PROD-001-9.

Se o build falhar com `undefined NEXT_PUBLIC_SUPABASE_URL`, PROD-001-6 não foi concluída corretamente — verificar `vercel env ls --scope jvdfcode`.

---

## Rollback

```bash
# Reverter para deploy anterior se o novo deploy causar regressão
vercel rollback <previous-deployment-url> --scope jvdfcode
# Ou via dashboard: Vercel → Production → Previous deployment → Promote to Production
```

Neste ponto do sprint, `smartpreco.app` ainda aponta para AWS — o rollback Vercel só afeta o que está servido pela URL `*.vercel.app`. Após PROD-001-9, o rollback Vercel afetará `smartpreco.app` também.

---

## Riscos

1. Build pode levar 5-10 minutos na Vercel — não cancelar se demorar.
2. Se env vars foram adicionadas mas o deploy foi feito antes, é necessário um novo deploy para elas serem aplicadas — sempre deploy depois de adicionar vars.
