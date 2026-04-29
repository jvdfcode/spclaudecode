#!/usr/bin/env bash
# deploy-setup.sh — SmartPreço: preparação para deploy production
# Gerado por @devops Gage (PROD-001-5, PROD-001-6, PROD-001-7)
#
# ANTES DE RODAR:
#   1. Preencha as variáveis na seção "Valores" abaixo
#   2. Garanta que `vercel` e `gh` CLIs estão instalados e autenticados
#   3. Rode: bash deploy-setup.sh
#
# DEPOIS DE RODAR:
#   4. Execute: supabase db push --project-ref ltpdqavqhraphoyusmdi
#   5. Execute: git push origin main (dispara CI → deploy automático)

set -euo pipefail

# ─────────────────────────────────────────────────────────────────
# VALORES — preencha com os valores reais antes de executar
# ─────────────────────────────────────────────────────────────────
SUPABASE_URL="https://ltpdqavqhraphoyusmdi.supabase.co"
SUPABASE_ANON_KEY="<FILL: chave anon do painel Supabase → Settings → API>"
SUPABASE_SERVICE_ROLE_KEY="<FILL: service_role key — NUNCA expor no cliente>"
SUPABASE_ACCESS_TOKEN="<FILL: sbp_xxx — Settings → Access Tokens>"
SUPABASE_PROJECT_ID="ltpdqavqhraphoyusmdi"

NEXT_PUBLIC_SENTRY_DSN="<FILL: DSN público — Sentry Dashboard → Project → Settings → Client Keys>"
SENTRY_DSN="<FILL: mesmo DSN ou DSN server — pode ser igual ao público>"
SENTRY_ORG="jvdfcode"
SENTRY_PROJECT="smartpreco"

ML_APP_ID="7037497225011811"
ML_CLIENT_SECRET="<FILL: ML_CLIENT_SECRET do .env.local>"

NEXT_PUBLIC_APP_URL="https://smartpreco.app"

# CRON_SECRET: gere um valor aleatório seguro com:
#   openssl rand -hex 32
CRON_SECRET="<FILL: gere com 'openssl rand -hex 32'>"

# Vercel (retirar de vercel.com/account/tokens + project.json)
VERCEL_TOKEN="<FILL: gere em vercel.com/account/tokens>"
VERCEL_ORG_ID="team_pjrbmJIvU1htLGurYPatEri4"
VERCEL_PROJECT_ID="prj_H8Zx5YS7LbMpnI6MGpqs5OxOfDOU"

GITHUB_REPO="jvictorformiga/smartpreco"

# ─────────────────────────────────────────────────────────────────
# FASE 1: GitHub Actions secrets
# ─────────────────────────────────────────────────────────────────
echo ">>> [1/3] Configurando GitHub Actions secrets..."

gh secret set NEXT_PUBLIC_SUPABASE_URL    --body "$SUPABASE_URL"            --repo "$GITHUB_REPO"
gh secret set NEXT_PUBLIC_SUPABASE_ANON_KEY --body "$SUPABASE_ANON_KEY"    --repo "$GITHUB_REPO"
gh secret set SUPABASE_SERVICE_ROLE_KEY   --body "$SUPABASE_SERVICE_ROLE_KEY" --repo "$GITHUB_REPO"
gh secret set SUPABASE_ACCESS_TOKEN       --body "$SUPABASE_ACCESS_TOKEN"   --repo "$GITHUB_REPO"
gh secret set SUPABASE_PROJECT_ID         --body "$SUPABASE_PROJECT_ID"     --repo "$GITHUB_REPO"
gh secret set NEXT_PUBLIC_SENTRY_DSN      --body "$NEXT_PUBLIC_SENTRY_DSN"  --repo "$GITHUB_REPO"
gh secret set SENTRY_DSN                  --body "$SENTRY_DSN"              --repo "$GITHUB_REPO"
gh secret set SENTRY_ORG                  --body "$SENTRY_ORG"              --repo "$GITHUB_REPO"
gh secret set SENTRY_PROJECT              --body "$SENTRY_PROJECT"          --repo "$GITHUB_REPO"
gh secret set ML_APP_ID                   --body "$ML_APP_ID"               --repo "$GITHUB_REPO"
gh secret set ML_CLIENT_SECRET            --body "$ML_CLIENT_SECRET"        --repo "$GITHUB_REPO"
gh secret set CRON_SECRET                 --body "$CRON_SECRET"             --repo "$GITHUB_REPO"
gh secret set VERCEL_TOKEN                --body "$VERCEL_TOKEN"            --repo "$GITHUB_REPO"
gh secret set VERCEL_ORG_ID              --body "$VERCEL_ORG_ID"           --repo "$GITHUB_REPO"
gh secret set VERCEL_PROJECT_ID          --body "$VERCEL_PROJECT_ID"       --repo "$GITHUB_REPO"

echo ">>> GitHub secrets OK"

# ─────────────────────────────────────────────────────────────────
# FASE 2: Vercel env vars (production)
# ─────────────────────────────────────────────────────────────────
echo ""
echo ">>> [2/3] Provisionando env vars no Vercel (production)..."

add_env() {
  local key="$1"
  local value="$2"
  echo "$value" | vercel env add "$key" production --force 2>/dev/null || \
    echo "    [WARN] $key — verifique manualmente se já existe"
}

add_env "NEXT_PUBLIC_SUPABASE_URL"     "$SUPABASE_URL"
add_env "NEXT_PUBLIC_SUPABASE_ANON_KEY" "$SUPABASE_ANON_KEY"
add_env "SUPABASE_SERVICE_ROLE_KEY"    "$SUPABASE_SERVICE_ROLE_KEY"
add_env "SUPABASE_ACCESS_TOKEN"        "$SUPABASE_ACCESS_TOKEN"
add_env "NEXT_PUBLIC_SENTRY_DSN"       "$NEXT_PUBLIC_SENTRY_DSN"
add_env "SENTRY_DSN"                   "$SENTRY_DSN"
add_env "SENTRY_ORG"                   "$SENTRY_ORG"
add_env "SENTRY_PROJECT"               "$SENTRY_PROJECT"
add_env "ML_APP_ID"                    "$ML_APP_ID"
add_env "ML_CLIENT_SECRET"             "$ML_CLIENT_SECRET"
add_env "NEXT_PUBLIC_APP_URL"          "$NEXT_PUBLIC_APP_URL"
add_env "CRON_SECRET"                  "$CRON_SECRET"

echo ">>> Vercel env vars OK"
echo ""
echo ">>> [3/3] Verificando..."
vercel env ls --scope jvdfcode 2>/dev/null | grep -E "production" | wc -l | \
  xargs -I{} echo "    {} env vars em production"

echo ""
echo "─────────────────────────────────────────────────────────────────"
echo "PRÓXIMOS PASSOS:"
echo "  1. Aplicar migrations:"
echo "     supabase db push --project-ref ltpdqavqhraphoyusmdi"
echo ""
echo "  2. Health check (após migrations):"
echo "     curl -X POST https://smartpreco.app/api/track \\"
echo "       -H 'Content-Type: application/json' \\"
echo "       -d '{\"name\":\"smoke_test\",\"payload\":{},\"ts\":$(date +%s)000}'"
echo ""
echo "  3. Deploy:"
echo "     git push origin main"
echo "─────────────────────────────────────────────────────────────────"
