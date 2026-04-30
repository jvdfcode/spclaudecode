# Changelog Sprint Plan v2 → v3

**Data:** 2026-04-30
**Trigger:** descoberta tardia de que cert SSL não foi emitido após DNS GoDaddy resolver. Análise adversarial dos 4 reviewers (Aria + Pedro Valério + Alan Nicolas + Thiago Finch) revelou que o problema é estrutural (domínio em `verified: false` no Vercel) e crítico (HSTS preload torna site inacessível para browsers reais).
**Síntese diagnóstico:** `docs/reviews/ssl-domain-2026-04-30/01-architect-aria.md` (v3)
**Síntese trio:** Pedro Valério (NEEDS WORK → resolvido em Aria v2), Alan Nicolas (APPROVE com curadoria), Thiago Finch (NEEDS WORK → absorvido em v3 com HSTS preload + R0 workaround)

---

## Mudança principal

**1 story nova adicionada — PROD-001-14: Emissão de certificado SSL para smartpreco.app** (1 SP, BLOQUEADOR)

---

## Por que esta mudança

- **Site 100% inacessível para browsers reais (HSTS preload .app).** TLD `.app` está em HSTS preload de Chrome/Firefox/Safari. Browsers fazem upgrade forçado HTTP→HTTPS antes do request — sem cert, exibem `ERR_SSL_PROTOCOL_ERROR`. `curl` HTTP funciona e mascarava o problema; nenhum usuário real acessa.
- **DNS estava correto mas verificação Vercel travada (TXT `_vercel` ausente).** Aria v3 diagnóstica: DNS resolve `76.76.21.61` (propagado), HTTP retorna 307 via Vercel, mas `dig TXT _vercel.smartpreco.app` retorna NXDOMAIN — Vercel não verificou ownership no team `jvdfcode`, logo ACME HTTP-01 nunca iniciou.
- **Custo de atraso calibrado (Finch).** 1h = 100% tráfego bloqueado. 1 dia = ~14 visitas perdidas; reconquistar early adopter que viu erro SSL custa 5-10x. 1 semana = meta MKT-001 "10 leads/30 dias" inviável. SEO: Googlebot tenta HTTPS em `.app`; sem cert = sem indexação. Shares WhatsApp/Slack: sem cert = sem OG thumbnail, CTR cai ~60-80%.
- **Workaround imediato disponível (Track 0).** URL `*.vercel.app` já tem cert válido emitido automaticamente — zero custo, tração imediata para early adopters enquanto domínio custom resolve.
- **Solução cirúrgica em 30 min wall-clock.** R1+R2 (Aria v3): confirmar status no dashboard Vercel → criar TXT `_vercel` no GoDaddy DNS Manager → aguardar propagação ACME. Apenas 5-10 min de ação direta; 5-15 min de espera passiva.

---

## Mudanças aplicadas (v2 → v3)

### Mudanças globais

1. **Versão atualizada** para v3 (2026-04-30) com referência ao quarteto de reviewers (Aria + Pedro Valério + Alan Nicolas + Thiago Finch).

2. **Nota de URGÊNCIA no topo** — bloco explícito sinalizando que `.app` HSTS preload = site 100% inacessível para browsers reais; workaround imediato (Track 0) disponível; PROD-001-14 é BLOQUEADOR crítico do go-live oficial.

3. **Sprint Goal atualizado** — adicionado "cert SSL emitido" como objetivo do sprint.

4. **Capacity e SP:** v2 era ~30 SP / 13 stories → v3 é ~31 SP / 14 stories (+1 SP de PROD-001-14). Justificativa de não estourar: 1 SP reflete tempo wall-clock incluindo propagação ACME (espera passiva), não esforço humano; ação direta é 5-10 min.

5. **DoR atualizado** — `acesso GoDaddy DNS Manager` e `acesso dashboard Vercel team jvdfcode` adicionados como inputs externos obrigatórios.

6. **DoD atualizado** — 3 novos critérios adicionados:
   - Gate SSL binário (`openssl s_client` → `grep "Let's Encrypt"` → PASS)
   - Browser real sem warning de SSL
   - Pelo menos 1 evento `calculo_iniciado` em `funnel_events` após smoke test manual

7. **Cerimônias** — referência a "DNS Cloudflare" substituída por "DNS GoDaddy" (terminologia atualizada).

### Mudanças por story

8. **PROD-001-14 CRIADA** (1 SP, Status: Ready, Owner: Pedro Emilio) — story operacional sem código com 4 tracks:
   - Track 0: URL `*.vercel.app` como workaround funnel-first (0 min, zero risco)
   - Track 1: verificar status do domínio no dashboard Vercel (2 min, read-only)
   - Track 2: criar TXT `_vercel` no GoDaddy DNS Manager (5-10 min + 5-15 min propagação ACME)
   - Track 3: validação E2E com gate binário `openssl s_client`
   - Rollback declarado in-line (Track 2)
   - Pré-requisito: acesso Member/Collaborator de Pedro Emilio ao team `jvdfcode` (escalar com `jvictorformiga` se 403)

9. **PROD-001-9 no backlog** — status atualizado para `Done` (DNS GoDaddy já resolvido — apex `smartpreco.app` → `76.76.21.21`). Título mantido por integridade histórica (ver N1 abaixo).

10. **Caminho crítico** — PROD-001-14 inserida entre PROD-001-9 (Done) e PROD-001-10/11:
    ```
    PROD-001-9 ✅ Done
        ↓
    PROD-001-14 ← BLOQUEADOR (emissão SSL)
        ↓
    PROD-001-10 / PROD-001-11
    ```

11. **Nota de estimativa** — linha de 1 SP atualizada para refletir semântica wall-clock (operacional sem código).

### Riscos adicionados

12. **R9 — HSTS preload do `.app` torna site inacessível para browsers reais** (CRITICA) — mitigação: Track 0 (URL `*.vercel.app`) como workaround imediato enquanto Track 1+2 resolvem.

13. **R10 — Pedro Emilio sem acesso Member ao Vercel team `jvdfcode`** (ALTA) — mitigação: escalação imediata com `jvictorformiga`; sem acesso, story bloqueia indefinidamente; Track 0 mantém tração mínima.

### Critério GO/NO-GO

14. **Gate SSL adicionado como primeiro item verificado** no Sprint Review — PROD-001-14 é GO obrigatório antes do smoke E2E final. Sem cert SSL, todo o sprint perde ponto de aterrissagem.

### Itens DEFERRED

15. **DNS-www adicionado ao deferred** — redirect `www` → apex + CNAME correto (evidência 7 de Aria, mencionado por Finch): problema secundário que não bloqueia cert do domínio raiz; story separada pós-GO.

---

## Mudanças NÃO absorvidas (decisão consciente)

### N1 — Renomear PROD-001-9 para refletir GoDaddy (Aria v3 + Pedro Valério mencionaram)

- **Sugestão:** renomear título de PROD-001-9 de "DNS Cloudflare" para "DNS GoDaddy" e atualizar `04-devops-gage.md` para clarificar que o DNS autoritativo é GoDaddy (nameservers `ns39/ns40.domaincontrol.com`), não Cloudflare.
- **Decisão:** NÃO ABSORVIDA agora.
- **Justificativa:** story PROD-001-9 já está Done e foi commitada. Renomear retroativamente cria churn no histórico git sem benefício prático. O diagnóstico Aria v3 já marca a discrepância explicitamente como artefato histórico ("docs Cloudflare desatualizadas: estado planejado nunca concretizado"). PROD-001-14 declara a situação real (GoDaddy) in-line no contexto e nos tasks. Consistência histórica > cosmética.

### N2 — Criar EPIC-SSL-001 separado

- **Sugestão alternativa considerada:** criar epic dedicado para gestão de SSL/TLS como infraestrutura recorrente.
- **Decisão:** NÃO — story dentro do sprint PROD-001 existente.
- **Justificativa:** escopo é 1 SP operacional sem código, não justifica overhead de epic. Emissão de cert é gate de go-live, não funcionalidade recorrente que justifique rastreamento separado.

---

## Impacto na capacity

| Métrica | v2 | v3 |
|---------|----|----|
| Total stories | 13 | 14 |
| Total SP | ~30 | ~31 |
| Capacity (1 dev / 1 semana) | 30h | 30h |
| Folga | 0h | -1 SP (operacional, cabe) |

**Justificativa de não estourar:** PROD-001-14 não exige 1h de esforço humano — apenas 5-10 min de ação direta (clicar/copiar/colar no dashboard Vercel + GoDaddy) + 5-15 min de propagação ACME (espera passiva). 1 SP reflete tempo wall-clock total, não esforço contínuo. A story cabe na capacity real sem pressão.

---

## Vereditos esperados pós-ajuste

- **Pedro Valério:** APPROVE confirmado — PROD-001-14 tem owner pessoa-física nomeado (Pedro Emilio), gate binário executável (`openssl s_client`), rollback declarado in-line (Track 2), AC mensurável e auditável.
- **Alan Nicolas:** APPROVE confirmado — curadoria absorvida: checklist de 4 passos no topo da story, R0 workaround funnel-first, H3/R3 no apêndice do diagnóstico Aria v3 (fora do corpo principal).
- **Thiago Finch:** APPROVE confirmado — HSTS preload declarado no topo do sprint com nota de urgência, loss aversion calibrado (1h = 100% tráfego bloqueado), R0 workaround (URL `*.vercel.app`) disponível e documentado.

---

*Changelog gerado por @sm River — 2026-04-30*
*Inputs: SPRINT-2026-04-28 v2 + PROD-001-14 (Morgan) + diagnóstico Aria v3 + auditoria trio (Pedro Valério, Alan Nicolas, Thiago Finch)*
