# Story PROD-001-7 — Provisionar CRON_SECRET no Vercel (handler já implementado)

**Epic:** EPIC-PROD-001
**Status:** Draft
**Owner:** Pedro Emilio (executor: @dev Dex via handoff)
**Severidade origem:** H2
**Esforço estimado:** 0.5 SP

---

## Contexto

O handler `src/app/api/cron/cleanup-ml-cache/route.ts:7-8` **já implementa** a validação do `CRON_SECRET` — verifica o header `Authorization: Bearer <CRON_SECRET>` e retorna 401 se ausente ou incorreto. O código de validação está presente e funcional no repositório.

O que ainda falta é **provisionar o secret** no Vercel production para que a validação tenha um valor para comparar. Sem a env var, o handler retorna 401 para todas as chamadas (incluindo as da própria Vercel), quebrando o cron em silêncio.

Esta story é paralelizável — independente de D1 e pode ser executada enquanto PROD-001-1 e PROD-001-5 correm.

**v2 — reescrita completa:** story original previa implementar validação no handler. Essa validação já existe em `route.ts:7-8`. Story refocada exclusivamente em provisionamento. SP reduzido de 1 para 0.5. Input de Pedro Valério + Thiago Finch (síntese trio, mudança #7).

---

## Acceptance Criteria

- [ ] `openssl rand -base64 32` executado e valor anotado com segurança (não commitado)
- [ ] `vercel env add CRON_SECRET production --scope jvdfcode` executado com o valor gerado
- [ ] `.env.example` atualizado com entrada `CRON_SECRET=your-cron-secret-here` (placeholder, sem valor real)
- [ ] Pós-deploy: `curl -X POST https://smartpreco.app/api/cron/cleanup-ml-cache` sem header `Authorization` retorna `HTTP 401`

---

## Tasks

- [ ] Gerar o secret: `openssl rand -base64 32` — anotar o valor gerado
- [ ] `vercel env add CRON_SECRET production --scope jvdfcode` — inserir o valor gerado quando solicitado
- [ ] Atualizar `.env.example` com `CRON_SECRET=your-cron-secret-here` (comentário: "gerado com openssl rand -base64 32")
- [ ] Adicionar `CRON_SECRET=<valor>` ao `.env.local` (não commitado)
- [ ] Após deploy de produção (PROD-001-8): `curl -X POST https://smartpreco.app/api/cron/cleanup-ml-cache` — confirmar 401
- [ ] Commit: `docs: add CRON_SECRET placeholder to .env.example (H2)`

---

## File List

- `.env.example` (adicionar entry `CRON_SECRET`)

---

## Notas técnicas

O handler já está implementado em `src/app/api/cron/cleanup-ml-cache/route.ts:7-8`:
```typescript
const authHeader = request.headers.get('authorization');
if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  return new Response('Unauthorized', { status: 401 });
}
```

Não é necessário modificar este arquivo. A única ação de código é adicionar o placeholder ao `.env.example`.

Gerar secret:
```bash
openssl rand -base64 32
# exemplo de output: xK8mP3qR7wL2nJ5vA9cD0eF1gH4iB6oT==
```

---

## Riscos

1. Se o `CRON_SECRET` não estiver na env var do Vercel antes do deploy, o cron retornará 401 para as próprias chamadas da Vercel — adicionar a env var antes do deploy de PROD-001-8.
2. Plano Hobby suprime execuções de cron silenciosamente (M4) — confirmar plano Pro no team `jvdfcode` antes de considerar o cron funcional em produção.
