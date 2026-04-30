# Story PROD-001-13 — Instrumentar 4 eventos de funil + UTM

**Epic:** EPIC-PROD-001
**Status:** Done
**Owner:** Pedro Emilio (executor: @dev Dex via handoff)
**Severidade origem:** — (nova story v2, input Thiago Finch)
**Esforço estimado:** 2-3 SP
**Bloqueia:** PROD-001-10 (CTA Lead Magnet ativa eventos — não ativar antes de instrumentação pronta)

---

## Contexto

Thiago Finch (síntese trio, tensão #2): "sprint vai ao ar mas lança cego — sem 4 eventos de funil básicos, é loja sem caixa registradora. A meta de 10 leads em 30 dias do MKT-001 vira métrica de vaidade se não soubermos onde o funil quebra."

Os 4 eventos do funil de conversão principal precisam estar instrumentados **antes** de ativar o CTA Lead Magnet (PROD-001-10). Sem esses eventos, não é possível saber em qual etapa os usuários abandonam o funil: ao iniciar o cálculo? Ao ver o resultado? Ao ver o CTA? Ao submeter o email?

Esta story implementa o mínimo viável de instrumentação: 4 eventos de funil básicos + UTM persistence. Dashboard rico de analytics fica no epic MKT-001-5.

Depende de PROD-001-3 (tabela `funnel_events` deve estar criada no Supabase com migrations 009-011 aplicadas).

---

## Acceptance Criteria

- [ ] Evento `calculo_iniciado` é disparado quando o usuário clica em "Calcular viabilidade" no LeadMagnetForm
- [ ] Evento `resultado_exibido` é disparado quando o resultado do cálculo é renderizado para o usuário
- [ ] Evento `cta_clicado` é disparado quando o usuário interage com o CTA de captura de email
- [ ] Evento `email_submetido` é disparado quando o LeadMagnetForm é submetido com sucesso
- [ ] UTM params (`utm_source`, `utm_medium`, `utm_campaign`) são lidos de `searchParams` e persistidos em `funnel_events` junto com cada evento
- [ ] Vercel Analytics `track()` é chamado para cada evento (além do insert em `funnel_events`)
- [ ] `SELECT count(*) FROM funnel_events WHERE event_name IN ('calculo_iniciado', 'resultado_exibido', 'cta_clicado', 'email_submetido') > 0` após smoke test manual
- [ ] `pnpm typecheck` retorna 0 erros após implementação
- [ ] `pnpm lint` retorna 0 erros

---

## Tasks

**Setup UTM:**
- [ ] Criar ou localizar hook/utility de leitura de UTM params de `searchParams` (ou `useSearchParams` no client)
- [ ] Confirmar que `funnel_events` tem colunas `utm_source`, `utm_medium`, `utm_campaign` (validar schema de migration 011)

**Evento calculo_iniciado:**
- [ ] Em `LeadMagnetForm.tsx`: no handler do clique/submit do botão "Calcular viabilidade", disparar `track('calculo_iniciado', { utm_source, utm_medium, utm_campaign })`
- [ ] Insert em `funnel_events`: `{ event_name: 'calculo_iniciado', utm_source, utm_medium, utm_campaign, page: '/calculadora-livre' }`

**Evento resultado_exibido:**
- [ ] No `useEffect` ou callback que renderiza o resultado do cálculo, disparar `track('resultado_exibido', { ... })`
- [ ] Insert em `funnel_events`: `{ event_name: 'resultado_exibido', utm_source, utm_medium, utm_campaign }`

**Evento cta_clicado:**
- [ ] No handler de clique no CTA de email (expansão do form ou botão de captura), disparar `track('cta_clicado', { ... })`
- [ ] Insert em `funnel_events`: `{ event_name: 'cta_clicado', utm_source, utm_medium, utm_campaign }`

**Evento email_submetido:**
- [ ] No Server Action de captura de lead, após insert bem-sucedido em `leads`, disparar `track('email_submetido', { ... })`
- [ ] Insert em `funnel_events`: `{ event_name: 'email_submetido', utm_source, utm_medium, utm_campaign }`

**Validação:**
- [ ] `pnpm typecheck` — 0 erros
- [ ] `pnpm lint` — 0 erros
- [ ] Smoke test manual: percorrer o funil completo e verificar 4 rows em `funnel_events`
- [ ] Verificar Vercel Analytics dashboard que os 4 eventos aparecem
- [ ] Commit: `feat: instrument funnel events calculo_iniciado/resultado_exibido/cta_clicado/email_submetido + UTM`

---

## File List

- `src/components/LeadMagnetForm.tsx` (disparar 4 eventos com Vercel Analytics `track()`)
- `src/app/actions/lead-capture.ts` (ou equivalente — insert em `funnel_events` no Server Action)
- `src/hooks/useUtmParams.ts` (novo — leitura de UTM de searchParams, se não existir)

---

## Notas técnicas

**Vercel Analytics `track()`:**
```typescript
import { track } from '@vercel/analytics';

// Exemplo para calculo_iniciado
track('calculo_iniciado', {
  utm_source: utmParams.utm_source ?? null,
  utm_medium: utmParams.utm_medium ?? null,
  utm_campaign: utmParams.utm_campaign ?? null,
});
```

**Insert em funnel_events (Server Action ou client via supabase-js):**
```typescript
await supabase.from('funnel_events').insert({
  event_name: 'calculo_iniciado',
  utm_source: utmParams.utm_source ?? null,
  utm_medium: utmParams.utm_medium ?? null,
  utm_campaign: utmParams.utm_campaign ?? null,
  page: '/calculadora-livre',
  created_at: new Date().toISOString(),
});
```

**Leitura de UTM params:**
```typescript
// Hook client-side
const searchParams = useSearchParams();
const utmParams = {
  utm_source: searchParams.get('utm_source'),
  utm_medium: searchParams.get('utm_medium'),
  utm_campaign: searchParams.get('utm_campaign'),
};
```

UTM params devem ser persistidos na sessão (ex: `sessionStorage`) para que eventos posteriores (como `email_submetido`, que ocorre via Server Action) ainda tenham acesso aos valores capturados no landing.

**Verificação SQL pós smoke test:**
```sql
SELECT event_name, count(*), utm_source, utm_medium, utm_campaign
FROM funnel_events
WHERE event_name IN ('calculo_iniciado', 'resultado_exibido', 'cta_clicado', 'email_submetido')
GROUP BY event_name, utm_source, utm_medium, utm_campaign
ORDER BY count(*) DESC;
```

---

## Dependências

| Story | Tipo | Detalhe |
|-------|------|---------|
| PROD-001-3 | Bloqueia entrada | Tabela `funnel_events` deve existir (migration 011) |
| PROD-001-10 | Esta story bloqueia | CTA Lead Magnet só ativado após instrumentação pronta |

---

## Riscos

1. Se `funnel_events` não tiver colunas UTM (migration 011 incompleta), adaptar o insert para omitir os campos UTM nesta sprint e criar migration adicional — não bloquear o evento básico por ausência de UTM.
2. `useSearchParams` requer Suspense boundary em Next.js App Router — verificar se o componente pai já tem `<Suspense>` ou adicionar wrapper.
3. Server Action não tem acesso direto a `searchParams` do cliente — usar `sessionStorage` para passar UTM do client para o Server Action via hidden field ou incluir no payload do form.
