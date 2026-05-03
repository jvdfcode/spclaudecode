# Runbook — Apply Migrations + Promote Vercel para Prod

**Data:** 2026-05-03
**Owner:** Pedro Emilio Ferreira (executor)
**Tempo estimado:** 30-45 min wall-clock
**Pré-requisitos:** acesso Supabase Dashboard `jvdfcode` + Vercel Dashboard `smartpreco` + terminal local com Supabase CLI

---

## Por que este runbook existe

Sessão de 2026-05-02 implementou em código:
- **VIAB-R1-1** (race condition OAuth fix — `acquire_user_lock` GRANT)
- **VIAB-R1-2** (landing pública `/`)
- **VIAB-R1-2.1** (calc placeholder fix)
- **VIAB-R1-3** (backoff exponencial ML API)
- **VIAB-R3-1** (Trial 14d table + endpoint + UI)
- **VIAB-R3-2** (headline `/precos` reescrita)

Tudo está em `main` (commits `4939993`, `0079c93`, `8d413ba`, `d50ebf9`, `9a91671`, `0c16dc1`, `0057cf7`, `28d6669`, `1dd3735`).

**Mas em PROD:**
- ❌ Migration 012 não aplicada → race condition F2 ATIVA agora
- ❌ Migration 013 não aplicada → endpoint `/api/trial/status` falha em prod
- ❌ VIAB-R1-2/2.1/3 + R3-2 não promovidos (só preview Vercel automático)

Este runbook fecha o gap.

---

## Pré-checks (5 min)

### 1. Confirmar branch e estado
```bash
cd ~/AI/spclaudecode
git status                          # working tree clean
git log --oneline origin/main..HEAD # vazio (tudo pushed)
git pull origin main                # garantir que está atualizado
```

### 2. Confirmar acesso Supabase
```bash
supabase --version                  # deve retornar versão
supabase projects list              # deve listar jvdfcode
```

Se faltar:
```bash
brew install supabase/tap/supabase  # ou npm i -g supabase
supabase login                      # token via dashboard
```

### 3. Confirmar acesso Vercel (opcional — pode usar dashboard web)
```bash
vercel --version
vercel link                         # se ainda não linkado
```

---

## FASE A — Apply Migration 012 (race condition OAuth fix)

### Comando
```bash
cd ~/AI/spclaudecode
supabase link --project-ref ltpdqavqhraphoyusmdi
supabase db push
```

### O que esperar
- CLI lista migrations pendentes: `012_grant_advisory_lock_to_authenticated.sql` + `013_trials_table.sql`
- Confirma com `Y`
- Aplica em ordem (012 primeiro, 013 depois)
- Output: `Local database is up to date.`

### Verificação imediata (psql via Supabase Dashboard)
```sql
-- Confirma GRANT da migration 012
SELECT has_function_privilege('authenticated', 'acquire_user_lock(uuid, text)', 'EXECUTE');
-- Esperado: t (true)

-- Confirma tabela trials criada (migration 013)
SELECT count(*) FROM trials;
-- Esperado: 0 (tabela existe, vazia)
```

### Se algo der errado
- Rollback 012: `supabase/migrations/012_grant_advisory_lock_to_authenticated_rollback.sql`
- Rollback 013: `supabase/migrations/013_trials_table_rollback.sql`
- Aplicar via psql direto se CLI falhar:
  ```bash
  psql "$SUPABASE_DB_URL" -f supabase/migrations/012_*.sql
  ```

---

## FASE B — Regenerar tipos Supabase (recomendado, não-bloqueante)

```bash
supabase gen types typescript --project-id ltpdqavqhraphoyusmdi > src/types/database.ts
git diff src/types/database.ts          # verificar diff
git add src/types/database.ts && git commit -m "chore(types): regen Supabase types pós-013"
git push origin main
```

Se não houver diff significativo (apenas timestamps), pode pular.

---

## FASE C — Promote VIAB-R1-2/2.1/3 + R3-2 para Prod

### Opção 1 — Dashboard Vercel (recomendado para review visual)

1. Abrir https://vercel.com/jvdfcode/smartpreco
2. Aba **Deployments**
3. Localizar último deploy de preview (commit `1dd3735` ou superior)
4. Click no deploy → revisar:
   - https://smartpreco-{hash}.vercel.app/ — landing nova (Variante D MeliDev)
   - https://smartpreco-{hash}.vercel.app/precos — headline reescrita
   - https://smartpreco-{hash}.vercel.app/calculadora-livre — placeholder removido (deve mostrar "Sem cartão")
5. Click "**Promote to Production**"
6. Confirma promote

### Opção 2 — Vercel CLI
```bash
cd ~/AI/spclaudecode
vercel ls                                 # lista deploys
vercel promote {deployment-url}           # promote específico
# OU força build novo direto em prod:
vercel deploy --prod
```

### Verificação pós-promote
```bash
# Landing pública responde 200 (não 307)
curl -sI https://smartpreco.app/ | head -1
# Esperado: HTTP/2 200

# Pricing page tem headline nova
curl -s https://smartpreco.app/precos | grep -o "Pare de precificar no escuro" | head -1
# Esperado: "Pare de precificar no escuro"

# Endpoint trial responde (sem auth retorna 401, com auth retorna estado)
curl -sI https://smartpreco.app/api/trial/status | head -1
# Esperado: HTTP/2 401 (não-autenticado)
```

---

## FASE D — Smoke test manual (10 min)

### D.1 — Landing pública anônima
1. Abrir https://smartpreco.app/ em janela anônima
2. Verificar:
   - [ ] H1: "Sua reputação cai quando você precifica no escuro..."
   - [ ] Stat card hero "R$ 500 – R$ 1.500"
   - [ ] Sub-bloco "Mas o ML já não tem calculadora?"
   - [ ] CTA primário leva para `/calculadora-livre?utm_source=home...`
   - [ ] Footer com link `/privacidade`

### D.2 — Pricing reescrita
1. Abrir https://smartpreco.app/precos em janela anônima
2. Verificar:
   - [ ] H1: "Pare de precificar no escuro..."
   - [ ] **NÃO** existe badge "Posicionamento — Liderança em Produto"
   - [ ] 3 stat cards (R$39 / R$500-1.500 / 30s)
   - [ ] CTA "Começar trial 14d grátis"

### D.3 — Calculadora-livre placeholder fix
1. Abrir https://smartpreco.app/calculadora-livre
2. Scroll para os 3 stat cards no fim
3. Verificar:
   - [ ] **NÃO** existe "+R$ 0,00 é o que você está deixando na mesa hoje"
   - [ ] No lugar: "Sem cartão" + "e sem instalação"

### D.4 — Race condition F2 (validar fix em prod)
1. Logar com conta ML conectada
2. Abrir DevTools → Network
3. Forçar refresh do token (chamar endpoint que usa `getMlAccessToken`, ex: `/api/ml-search?q=teste`)
4. Verificar Sentry (https://sentry.io/organizations/{org}/issues/?query=tags.component:ml_token_refresh):
   - [ ] **ZERO eventos `lock_error` em 1h**
5. Em paralelo (2-3 abas simultâneas), forçar 5+ buscas → confirmar que apenas 1 chama `POST /oauth/token` (via Sentry breadcrumbs ou logs Vercel)

### D.5 — Trial 14d (validar VIAB-R3-1)
1. Criar conta nova de teste em https://smartpreco.app/cadastro?trial=14
2. Verificar:
   - [ ] Banner trial mostra "Trial Pro: 14 dias restantes"
   - [ ] Network tab mostra `POST /api/trial/status` retornando 200 com `active: true`
   - [ ] Sentry mostra evento `trial_started` (level: info)

---

## FASE E — Monitoramento 48h

### Sentry (https://sentry.io)
Salvar 3 queries:
```
tags.component:ml_token_refresh kind:lock_error    # esperado: 0
tags.component:ml_api_backoff kind:429_exhausted   # esperado: 0
tags.component:trial_status method:POST             # esperado: >0 (signups)
```

Configurar alerta:
- `ml_token_refresh lock_error` count > 0 em 5min → **Slack/email imediato**
- `ml_api_backoff exhausted` count > 5 em 1h → **alerta**

### Funnel events (dashboard via Supabase)
```sql
-- Verifica que os novos eventos estão chegando
SELECT name, count(*) FROM funnel_events
WHERE created_at > now() - interval '24 hours'
  AND name IN ('home_view', 'home_cta_primary_click', 'pricing_cta_trial_click', 'trial_started')
GROUP BY name ORDER BY count(*) DESC;
```

---

## Critério de fechamento (DoD do runbook)

- [ ] Migration 012 + 013 aplicadas em prod (`has_function_privilege` retorna `true`, tabela `trials` existe)
- [ ] VIAB-R1-2/2.1/3 + R3-2 promotidos (curl `/` retorna 200, headline /precos atualizada, calc sem +R$0,00)
- [ ] Smoke test D.1-D.5 todos checked
- [ ] Sentry 48h sem eventos `lock_error` ou `ml_api_exhausted`
- [ ] Funnel events `home_view` + `pricing_cta_*_click` chegando

Após DoD completo, atualizar status das stories:
- VIAB-R1-1 → **Done**
- VIAB-R1-2 → **Done**
- VIAB-R1-2.1 → **Done**
- VIAB-R1-3 → **Done**
- VIAB-R3-1 → **Done** (após primeiro signup trial real)
- VIAB-R3-2 → **Done**

**EPIC-VIAB-R1 fecha 4/4 Done.** **EPIC-VIAB-R3 fica 2/3 Done** (R3-3 ainda Draft).

---

## Rollback completo (se algo grave acontecer pós-promote)

```bash
# Reverter Vercel para deploy anterior
vercel rollback {previous-deployment-url}

# Reverter migrations (Supabase Dashboard → Database → Migrations → Rollback)
psql "$SUPABASE_DB_URL" -f supabase/migrations/013_trials_table_rollback.sql
psql "$SUPABASE_DB_URL" -f supabase/migrations/012_grant_advisory_lock_to_authenticated_rollback.sql
```

---

## Próximos passos pós-runbook completo

1. Atualizar `docs/STATUS.md` com 6 stories marcadas Done
2. Push para origin/main
3. Iniciar trilha **PROD-002** (Certificação App ML — `docs/stories/PROD-002-certificacao-app-ml.md`)
4. Reavaliar pontuação mundial em sessão dedicada (esperado: 4.2/10 → 5.5+/10)

---

*Runbook criado por Orion (@aiox-master) em 2026-05-03 como deliverable do "item 1" da sequência de 3 ações pós-painel-comparativo-Letzee.*
