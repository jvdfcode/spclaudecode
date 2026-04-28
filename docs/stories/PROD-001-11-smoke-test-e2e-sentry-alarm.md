# Story PROD-001-11 — Smoke test E2E em produção + Sentry alarm test

**Epic:** EPIC-PROD-001
**Status:** Draft
**Owner:** Pedro Emilio (executor: @dev Dex via handoff)
**Severidade origem:** H10, M8
**Esforço estimado:** 2 SP

---

## Contexto

Quinn (05-qa-quinn.md, problemas 4 e 5) e Aria (01-architect-aria.md) convergem: o Sentry pode estar morto-silencioso sem que ninguém saiba — `Sentry.init()` não emite exceção se o DSN estiver errado ou ausente. H10 documenta a ausência de validação de conectividade Sentry. M8 documenta a ausência total de E2E — o Playwright está instalado mas sem suite. Esta story fecha o loop de verificação pós-deploy: confirma que observabilidade está viva e que os fluxos críticos funcionam.

Depende de todas as stories anteriores (PROD-001-1 a PROD-001-10) — é o gate final do epic.

**v2 — M5 removido:** a criação de `tests/unit/middleware.test.ts` foi movida para o backlog pós-sprint. Esta story mantém apenas smoke test Sentry + curl rotas como gate final de produção. A scope de M5 (testes unitários de middleware) é melhor tratada em uma story dedicada pós-sprint, sem pressão de deploy. Input de Alan Nicolas (síntese trio, mudança #10).

> **Nota:** M5 movido para backlog pós-sprint. Criar story separada `PROD-001-14-middleware-unit-tests.md` após conclusão deste sprint para implementar `tests/unit/middleware.test.ts` cobrindo as 3 branches de auth.

---

## Acceptance Criteria

- [ ] Sentry recebe ao menos 1 evento de teste visível no dashboard (`Sentry.captureMessage("smoke-test-prod")` executado manualmente ou via script)
- [ ] `curl -sI https://smartpreco.app/calculadora-livre` retorna `HTTP 200` (sem auth)
- [ ] `curl -sI https://smartpreco.app/login` retorna `HTTP 200`
- [ ] `curl -sI https://smartpreco.app/cadastro` retorna `HTTP 200`
- [ ] Fluxo cadastro → login → redirect `/dashboard` funciona manualmente com user real
- [ ] LeadMagnetForm: preenchimento completo → submit → resposta sem erro 500
- [ ] `curl -sI https://smartpreco.app/api/cron/cleanup-ml-cache` sem Authorization retorna `HTTP 401`
- [ ] `curl -sI https://smartpreco.app/privacidade` retorna `HTTP 200`

---

## Tasks

- [ ] Executar smoke test manual nas rotas públicas: `/calculadora-livre`, `/login`, `/cadastro`, `/privacidade`, `/precos`
- [ ] Criar conta de teste real em `smartpreco.app` e verificar redirect para `/dashboard`
- [ ] Testar submissão do LeadMagnetForm com email de teste — verificar lead em Supabase
- [ ] Executar `Sentry.captureMessage("smoke-test-prod")` no console do browser e verificar no dashboard Sentry
- [ ] Verificar no Sentry dashboard que o evento chegou com o projeto e org corretos
- [ ] `curl -sI https://smartpreco.app/api/cron/cleanup-ml-cache` — confirmar 401 sem header
- [ ] Se Sentry não receber evento: verificar `SENTRY_DSN` e `NEXT_PUBLIC_SENTRY_DSN` no Vercel (voltar para PROD-001-6)
- [ ] Anotar resultado do smoke test como evidência no arquivo de story

---

## File List

(nenhum arquivo novo criado nesta story — apenas operacional)

---

## Notas técnicas

Para o teste do Sentry, via console do browser em `smartpreco.app`:
```javascript
// No DevTools console
import * as Sentry from '@sentry/nextjs';
Sentry.captureMessage('smoke-test-prod-2026-04-28');
```
Ou via script de teste:
```bash
# Usando Sentry API diretamente para verificar que DSN aceita eventos
curl https://sentry.io/api/0/projects/<org>/<project>/ \
  -H "Authorization: Bearer $SENTRY_TOKEN"
# retorna 200 se DSN/org/project corretos
```

M5 movido para backlog: `tests/unit/middleware.test.ts` (3 branches: pass-through `/calculadora-livre`, redirect `/login` para não autenticado, redirect `/dashboard` para autenticado em `/login`) será implementado em story pós-sprint dedicada. Ver Quinn recomendação 1 para padrão de mock de `NextRequest`.

---

## Riscos

1. Sentry DSN incorreto não gera erro visível — se nenhum evento chegar ao dashboard em 5 minutos após `captureMessage`, o DSN está errado. Voltar para PROD-001-6.
2. Fluxo de auth em produção pode diferir do dev se `SUPABASE_SERVICE_ROLE_KEY` estiver errada — verificar logs Vercel se cadastro/login falhar.
