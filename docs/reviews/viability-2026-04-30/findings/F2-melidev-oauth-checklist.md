# F2 — @melidev: Checklist OAuth refresh production

**Specialist:** @melidev
**Comando:** *checklist OAuth-refresh-production
**Data:** 2026-05-01

## Checklist binario (14 items)

| # | Item | PASS/FAIL | Evidencia (file:line) | Heuristica | Tag |
|---|------|-----------|----------------------|------------|-----|
| 1 | client_secret nunca em frontend | PASS | `ml-api.ts:27`, `callback/route.ts:27` — `process.env.ML_CLIENT_SECRET` em Route Handlers. Sem `NEXT_PUBLIC_`. | VB008 | [ML-OFFICIAL] |
| 2 | refresh_token criptografado em repouso | FAIL | `006_ml_tokens.sql:8` — `refresh_token text NOT NULL`, texto plano. Sem `pgsodium`/`pgcrypto`. | VB008 | [INFERRED] |
| 3 | Advisory lock protege race de refresh | FAIL | `ml-api.ts:64` chama `acquire_user_lock` via anon key (role `authenticated`), mas `009*.sql:120-121` faz GRANT apenas para `service_role`. Permissao negada em producao. | VB001 | [ML-OFFICIAL] |
| 4 | Parametro `state` anti-CSRF no OAuth | FAIL | `connect/route.ts:10-14` — sem `state`. Callback tambem nao valida. Vulneravel a CSRF. | VB010 | [ML-OFFICIAL] |
| 5 | Scope `offline_access` explicito | FAIL | `connect/route.ts:10-14` — sem `.searchParams.set('scope', ...)`. ML pode nao emitir refresh_token. | VB001 | [ML-OFFICIAL] |
| 6 | Refresh proativo (antes de expirar) | PASS | `ml-api.ts:59` — verifica `expires_at > now + 5min`. Headroom de 5 minutos. | VB001 | [ML-OFFICIAL] |
| 7 | Retry com backoff em falha de refresh | FAIL | `ml-api.ts:19-36` — `refreshToken()` retorna `null` em qualquer falha, sem retry. | VB006 | [INFERRED] |
| 8 | Token particionado por user_id | PASS | `006_ml_tokens.sql:4` — `user_id uuid UNIQUE`. Cada vendedor tem row propria. | VB004 | [ML-OFFICIAL] |
| 9 | RLS impede leak entre tenants | PASS | `006_ml_tokens.sql:14-17` — `USING (auth.uid() = user_id)`. Isolamento correto. | VB004 | [ML-OFFICIAL] |
| 10 | Disconnect revoga token no ML | FAIL | `disconnect/route.ts:9` — apenas `delete()` local. Token valido no ML por ate 6h. | VB008 | [INFERRED] |
| 11 | redirect_uri consistente connect/callback | PASS | Ambos usam `${NEXT_PUBLIC_APP_URL}/api/auth/ml/callback`. Identicos. | VB010 | [ML-OFFICIAL] |
| 12 | Callback valida erro do ML | PASS | `callback/route.ts:9-11` — verifica `error` query param. | VB010 | [ML-OFFICIAL] |
| 13 | expires_at calculado com expires_in ML | PASS | `callback/route.ts:43`, `ml-api.ts:103` — `Date.now() + expires_in * 1000`. | VB001 | [ML-OFFICIAL] |
| 14 | Status endpoint nao expoe tokens | PASS | `status/route.ts:13` — `select('expires_at')` apenas. | VB008 | [ML-OFFICIAL] |

**Resultado: 8 PASS / 6 FAIL**

## Findings criticos (race condition + multi-seller)

### Finding 1 — CRITICAL: Advisory lock inacessivel (permissao quebrada)

`getMlAccessToken()` recebe client `createServerSupabase()` (anon key, role `authenticated`). O RPC `acquire_user_lock` so tem GRANT para `service_role`. A chamada `supabase.rpc('acquire_user_lock')` retorna permission denied; o codigo faz fallback silencioso (linha 77), mas o lock **nunca funciona**. Duas requests simultaneas podem ambas chamar `POST /oauth/token` com o mesmo `refresh_token` — ML invalida o primeiro, a segunda recebe `invalid_grant`, vendedor perde conexao. **VB001** [ML-OFFICIAL] + [INFERRED]

**Fix:** (a) `GRANT EXECUTE TO authenticated`, ou (b) usar `createServiceSupabase()` no `getMlAccessToken`, ou (c) wrapper `SECURITY DEFINER` que encapsula lock + refresh.

### Finding 2 — HIGH: Sem parametro `state` anti-CSRF

O fluxo OAuth nao inclui `state`. Atacante pode forjar callback com authorization code de sua propria conta ML, vinculando conta ML do atacante ao perfil do usuario vitima. Permite ver dados de pricing ou contaminar dados. **VB010** [ML-OFFICIAL]

**Fix:** Gerar UUID como `state`, armazenar em cookie HttpOnly, validar no callback antes de trocar code.

### Finding 3 — HIGH: Refresh token em texto plano

`refresh_token` armazenado como `text NOT NULL` sem criptografia. Breach no banco expoe tokens de todos os vendedores. Com 100+ vendedores, impacto amplificado. **VB008** [INFERRED] — best practice OAuth 2.0 (RFC 6819 Section 5.1.4.1).

**Fix:** `pgsodium` (nativo Supabase) ou AES-256-GCM aplicacional antes do INSERT.

### Finding 4 — MEDIUM: Sem retry em falha transiente de refresh

`refreshToken()` faz unica tentativa. Timeout de rede ou 500 do ML = token nao renovado, busca falha. Com 100+ vendedores e tokens expirando a cada 6h, falhas transientes sao certas estatisticamente. **VB006** [INFERRED]

**Fix:** Retry max 2 tentativas, backoff 1s/2s.

### Finding 5 — MEDIUM: Disconnect nao revoga no ML

Endpoint deleta row local mas token continua valido no ML por ate 6h. Se vendedor desconectou por suspeita de comprometimento, atacante ainda usa token. **VB008** [INFERRED]

## Veredito (1 frase)

O fluxo OAuth tem isolamento multi-seller correto e refresh proativo, mas o advisory lock nunca executa por falta de permissao (race condition ativa), ausencia de `state` permite account hijacking, e tokens em texto plano amplificam impacto de breach — producao real com 100+ vendedores exige correcao dos 3 findings CRITICAL/HIGH antes de go-live.

## Nota 5/10 (rubric)

**Nota:** 5/10
**Justificativa:** Fundacao solida (RLS, refresh proativo, secrets server-only, redirect_uri correto), mas advisory lock quebrado, sem `state` anti-CSRF, e tokens sem criptografia tornam o sistema inseguro para producao multi-seller. Corrigir CRITICAL + HIGH eleva para 7-8/10.

## Sources usadas

| Tag | Fonte | Uso |
|-----|-------|-----|
| [ML-OFFICIAL] | Documentacao oficial ML Developers | OAuth flow, expires_in=21600, state, offline_access |
| [INFERRED] | Best practices OAuth 2.0 (RFC 6749/6819) | Criptografia, retry, revogacao |
| [ICARO-EBOOK] | Icaro Jobs — Dominando a API do ML | Multi-seller token isolation |
| [FIAMON-S3] | Julio Fiamoncini — refresh strategy | Refresh proativo |
