# VIAB-R1-2.1 — Remover placeholder "+R$ 0,00" + tracking de exibição do email gate

**Epic:** EPIC-VIAB-R1 (Recomendações 30 dias do relatório de viabilidade 2026-04-30)
**Status:** InReview (código pronto + CI gates PASS; pendente smoke local)
**Severidade:** ALTA — placeholder destrói credibilidade da promessa Loss Aversion ANTES do usuário calcular
**Sprint:** SPRINT-2026-05-05 (paralela a VIAB-R1-2)
**Owner:** Pedro Emilio (executor: @dev)
**SP estimado:** 0.5 SP (~30-45min)
**Referência:**
- Pontuação UX Uma: `docs/reviews/world-benchmark-2026-05-01/02-pontuacao-mundial.md` (gap "placeholder +R$ 0,00")
- Pontuação Funil Finch: idem (gap "calc é beco sem saída")
- Debate 2026-05-02: 3 specialists convergem em remover

---

## Contexto

Durante o debate estratégico de 3 specialists (Design Chief, Thiago Finch, MeliDev Chief) sobre VIAB-R1-2 (landing pública), Uma e Finch apontaram o mesmo problema na `/calculadora-livre`:

**Linha 68 de `src/app/calculadora-livre/page.tsx`:**
```tsx
<p className="text-2xl font-extrabold text-halo-navy">+R$ 0,00</p>
<p className="mt-1 text-xs text-halo-navy-60">é o que você está deixando na mesa hoje</p>
```

**Problemas:**
1. **Credibilidade quebrada:** R$ 0,00 hardcoded contradiz a headline ("descubra quanto está perdendo") — usuário lê o "0" como prova de que perde nada, antes mesmo de calcular
2. **Loss Aversion neutralizada:** o stat card deveria amplificar a perda, não apresentar zero
3. **Não há fallback de copy** quando o cálculo ainda não foi feito

**Boa notícia:** a inspeção do `LeadMagnetForm.tsx` mostrou que o **soft email gate pós-cálculo JÁ EXISTE** (linhas 333-397) com checkbox LGPD, política de privacidade e eventos `cta_clicado` + `email_submetido` + `lead_captured`. Não precisa criar — apenas **instrumentar exibição** com novo evento.

---

## Acceptance Criteria

1. [ ] Placeholder "+R$ 0,00" removido do `src/app/calculadora-livre/page.tsx` (linha ~68)
2. [ ] Stat card substituído por copy alinhada com Loss Aversion (proposta: "30s" ou "Sem cartão" — manter pareando com os outros 2 stats existentes "100%" e "30s")
3. [ ] Novo evento `calc_email_capture_shown` adicionado em `FunnelEventName` (em `src/lib/analytics/events.ts`)
4. [ ] Evento `calc_email_capture_shown` é disparado quando o form de captura aparece (após o cálculo, render condicional `!submitted`) — usar `useEffect` no `LeadMagnetForm` ou intersection observer
5. [ ] `npm run typecheck` e `npm run lint` PASS
6. [ ] Smoke manual: rodar dev local, fazer cálculo, ver evento no Network tab batendo `/api/track`

---

## Tasks

### Track 1 — Substituir placeholder

- [ ] Editar `src/app/calculadora-livre/page.tsx` linha 67-70:
  - **Opção A:** trocar por "Sem cartão" pareando com os outros stats
  - **Opção B:** trocar por "100+ taxas ML" reforçando especificidade
  - **Decisão Orion:** Opção A — mantém simetria visual e não inventa números

### Track 2 — Tracking de exibição

- [ ] Adicionar `'calc_email_capture_shown'` ao union type `FunnelEventName` em `src/lib/analytics/events.ts`
- [ ] Em `LeadMagnetForm.tsx`, disparar `trackFunnel('calc_email_capture_shown', {...utmParams})` quando o form de captura aparece (após `result` ser setado e antes de `submitted`)
  - Usar `useEffect` com dep `[result, submitted]`
  - Idempotente: usar `useRef` flag para evitar duplo disparo

### Track 3 — Validação

- [ ] `npm run typecheck`
- [ ] `npm run lint`
- [ ] Dev local: fazer cálculo + ver Network tab confirmar evento

---

## Out of Scope

- Modificar form de captura (já está soft, LGPD-compliant) — fora do escopo
- Novo endpoint `/api/lead-capture-calc` — `/api/track` existente já cobre
- A/B test de variantes do CTA do form — backlog

---

## Riscos

| Risco | Probabilidade | Mitigação |
|-------|:-------------:|-----------|
| Remover stat card quebra layout em mobile (grid de 3) | Baixa | Manter o card, só substituir conteúdo |
| `useEffect` disparar duplo em dev (StrictMode) | Média | useRef flag idempotente |
| Evento novo não persistir em funnel_events (schema check) | Baixa | Schema da tabela aceita `event_name text` (PROD-001-13) |

---

## Definition of Done

- [x] AC 1-5 checados em código (placeholder removido, evento adicionado, typecheck+lint+build PASS)
- [ ] AC 6 (smoke manual em dev local) — pendente Pedro
- [ ] Commit + push origin/main
- [ ] Story atualizada com File List final + Status `Done`

---

## File List

### Modificados
- `src/app/calculadora-livre/page.tsx` — linhas 67-70: substituído "+R$ 0,00" por "Sem cartão" + "e sem instalação"
- `src/components/lead-magnet/LeadMagnetForm.tsx`:
  - import `useEffect`
  - `captureShownRef` adicionado
  - `useEffect` dispara `calc_email_capture_shown` quando form de captura aparece (idempotente por cálculo)
  - Reset do flag em `handleCalculate` para permitir tracking em recálculos
- `src/lib/analytics/events.ts` — `FunnelEventName` estende com `'calc_email_capture_shown'` (compartilhado com VIAB-R1-2)

---

## Change Log

| Data | Autor | Mudança |
|------|-------|---------|
| 2026-05-02 | Orion (aiox-master) | Story criada após debate 3 specialists; escopo reduzido pois LeadMagnetForm já tem email gate soft |
| 2026-05-02 | Orion (papel @po) | Validação 10/10 — transição Draft → Ready (GO) |
| 2026-05-02 | Orion (papel @dev) | Placeholder substituído + useEffect tracking adicionado + flag idempotência |
| 2026-05-02 | Orion (papel @qa) | typecheck + lint + build PASS; transição → InReview |
