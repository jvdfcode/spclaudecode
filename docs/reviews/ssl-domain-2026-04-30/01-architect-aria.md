# Aria — Diagnóstico Root Cause: SSL não emitido em smartpreco.app

**Versão:** v3 — absorve Pedro Valério (v2) + Alan Nicolas (curadoria) + Thiago Finch (HSTS preload + loss aversion) — 2026-04-30

> "Evidência > opinião. Convergência > impaciência."

## Mudanças desde v1

**v2 (Pedro Valério — 4 vetos):** (1) GoDaddy confirmado como DNS autoritativo. (2) Owner pessoa-física em cada recomendação. (3) Rollback com procedimentos exatos. (4) Classificação PROVÁVEL/POSSÍVEL/DESCARTADO com contagem de evidências.

**v3 (Alan Nicolas — curadoria):** (5) Checklist de 4 passos no topo. (6) H3 e R3 no apêndice. (7) Evidências commodity em subseção.

**v3 (Thiago Finch — HSTS + loss aversion):** (8) Alerta HSTS preload. (9) Custo de atraso calibrado. (10) R0 workaround funnel-first.

## Veredito (1 frase)

O domínio `smartpreco.app` não possui registro TXT `_vercel.smartpreco.app` no DNS GoDaddy, impedindo a Vercel de verificar ownership no team `jvdfcode` — sem verificação, o ACME HTTP-01 não inicia; **com `.app` em HSTS preload, o site está 100% inacessível para browsers reais (não apenas degradado), tornando o atraso muito mais caro do que sugerido pelo HTTP funcional via curl**.

---

> **ALERTA HSTS PRELOAD — URGÊNCIA ALTA:** TLD `.app` está na lista HSTS preload de Chromium, Firefox e Safari. Browsers fazem upgrade forçado HTTP→HTTPS antes do request. Sem cert, browser exibe `ERR_SSL_PROTOCOL_ERROR`. `curl` HTTP funciona; nenhum browser funciona. Site **100% inacessível**.

---

## Essência (TL;DR — checklist de 4 passos)

1. Acessar dashboard Vercel: `https://vercel.com/jvdfcode/smartpreco/settings/domains`
2. Copiar valor do TXT challenge em "Pending Verification"
3. GoDaddy DNS Manager: criar TXT — Name: `_vercel`, Value: challenge copiado
4. Aguardar 2-5 min, clicar "Verify" no dashboard

**Gate:** `openssl s_client -connect smartpreco.app:443 -servername smartpreco.app 2>/dev/null | openssl x509 -noout -subject -issuer | grep -q "Let's Encrypt" && echo "PASS" || echo "FAIL"`

**Owner:** Pedro Emilio. Pré-requisito se sem acesso: jvictorformiga conceder Member.

## Custo de atraso (loss aversion calibrado)

| Período | Impacto |
|---------|---------|
| 1h | 100% tráfego bloqueado. Link WhatsApp/email → erro. Zero conversão. |
| 1 dia | ~14 visitas perdidas (base: ~100/semana). Reconquistar early adopter custa 5-10x. |
| 1 semana | ~100 visitas, 0 leads. Meta MKT-001 "10 leads/30 dias" inviável. |

**SEO:** Googlebot tenta HTTPS em `.app`; sem cert = sem indexação. **Shares:** WhatsApp/Slack fetch HTTPS para OG; sem cert = sem thumbnail, CTR cai ~60-80%. **Instrumentação:** PROD-001-13 (`trackFunnel()`) registra zero — analytics não carrega sem HTTPS.

## Esclarecimento: registrar e DNS

DNS autoritativo na **GoDaddy** (nameservers: `ns39/ns40.domaincontrol.com`). TXT `_vercel` deve ser criado no GoDaddy DNS Manager.

Docs Cloudflare desatualizadas (estado planejado nunca concretizado):
- `PROD-001-9-custom-domain-dns-cloudflare.md:31-37`
- `04-devops-gage.md:3-4`

## Estado capturado (7 evidências essenciais)

1. DNS resolve `76.76.21.21` em 3 resolvers — propagado
2. CAA vazio — não bloqueia Let's Encrypt
3. HTTP `307`, `Server: Vercel` — routing funciona
4. TLS `0 bytes`, `no peer certificate` — sem cert
5. ACME path retorna `404 Server: Vercel` — infra acessível
6. Team `jvdfcode`: 403 Forbidden via API
7. `dig TXT _vercel.smartpreco.app`: **NXDOMAIN**

### Evidências secundárias (commodity)

8. SOA serial `2026043000` — mudança DNS em 30/04
9. www CNAME aponta para `smartpreco.app` (não `cname.vercel-dns.com`)
10. Endpoint `POST /v9/projects/{id}/domains/{domain}/verify` existe

## 2 Hipóteses competidoras

### H1 — Domínio não verificado — PROVÁVEL

**A favor (5):** NXDOMAIN no TXT; docs Vercel exigem TXT para ownership cross-team; TLS 0 bytes é padrão de não verificado; www CNAME incompleto; API de verificação explícita.
**Contra (1):** sem acesso ao team (403), sem confirmação direta.
**Confirmar:** dashboard mostra "Pending Verification". **Descartar:** `verified: true`.

### H2 — ACME em fila / timing — POSSÍVEL

**A favor (2):** SOA serial do dia; header `Age` sugere deploy pré-correção.
**Contra (3):** Vercel intercepta automaticamente; >15 min sem tentativa é incomum; ausência do TXT sugere bloqueio.
**Confirmar:** cert em 30 min. **Descartar:** não emitir em 1h.

## 3 Dependências externas

1. Acesso ao dashboard Vercel team `jvdfcode`
2. Criação de TXT `_vercel.smartpreco.app` no GoDaddy
3. Rate limits Let's Encrypt (verificável via crt.sh)

## 4 Recomendações ordenadas por urgência

### R0 (workaround funnel-first) — URL Vercel imediata

- **Owner:** Pedro Emilio
- **Ação:** usar URL `smartpreco-[hash].vercel.app` (cert válido) como link compartilhável. Dashboard → Deployments → Production. Documentado em `SPRINT-2026-04-28.md` e `PROD-001-8`.
- **Custo:** 0 min | **Risco:** zero

### R1 (read-only) — Verificar estado do domínio

- **Owner:** Pedro Emilio
- **Ação:** dashboard Vercel, confirmar `verified: true/false` e TXT challenge pendente.
- **Custo:** 2 min | **Risco:** zero
- **Gate:** binário verified/unverified

### R2 (parcialmente reversível) — Adicionar TXT no GoDaddy

- **Owner:** Pedro Emilio
- **Ação:** copiar TXT do dashboard, criar registro no GoDaddy (Name: `_vercel`, Value: challenge), aguardar 2-5 min, clicar "Verify".
- **Custo:** 5-10 min | **Gate:** comando `openssl` do checklist retorna PASS

#### Rollback
1. Deletar TXT `_vercel` no GoDaddy
2. `dig TXT _vercel.smartpreco.app` retorna NXDOMAIN
3. Re-copiar valor correto e repetir

## Recomendação executiva final

Começar com R0 (URL `*.vercel.app` — zero custo, tração imediata). Em paralelo, R1+R2 sequencial (owner: Pedro Emilio). Convergência de 5 evidências aponta para domínio não verificado (H1 — PROVÁVEL): DNS propagado, HTTP funcional, CAA limpo, TLS fecha com zero bytes — padrão clássico de ownership não comprovada. SE pendente, adicionar TXT (R2). SE `verified: true`, aguardar 30 min (H2). SE persistir, apêndice (R3).

## Trade-offs

| Opção | Prós | Contras |
|-------|------|---------|
| R0 (URL Vercel) | Tração imediata, zero risco | URL não-branded, temporário |
| R1+R2 (verificar + TXT) | Resolve H1 definitivamente | Requer acesso dashboard jvdfcode |
| Esperar 30-60 min | Zero risco | Não resolve H1; HSTS = inacessibilidade total |

---

## Apêndice — Hipóteses descartadas e ações de último caso

### H3 — Middleware interceptando ACME — DESCARTADO

**A favor (0).** **Contra (4):** Vercel intercepta `/.well-known` na infra; matcher (`src/middleware.ts:56-58`) não inclui path; 404 da infra, não do Next.js.

### R3 (último caso) — Remover e re-adicionar domínio

- **Owner:** Pedro Emilio (sessão jvdfcode)
- **Ação:** remover `smartpreco.app` no dashboard, aguardar 30s, re-adicionar.
- **Custo:** 10-15 min + downtime HTTP | **Gate:** cert em até 15 min

#### Rollback
1. Captura de tela antes de remover
2. `vercel domains add smartpreco.app --scope jvdfcode`
3. `dig +short smartpreco.app A` = `76.76.21.21`
4. Se não restaurar em 10 min, verificar associação ao projeto

---

**Referências:**
- `src/middleware.ts:56-58` — matcher do middleware
- `deploy-setup.sh:41-42` — IDs team jvdfcode
- `PROD-001-9-custom-domain-dns-cloudflare.md:31-37` — terminologia desatualizada
- `04-devops-gage.md:3-4` — terminologia desatualizada
- Vercel docs: `https://vercel.com/docs/projects/domains/troubleshooting`
- HSTS preload: `https://hstspreload.org` — `.app` TLD incluído
