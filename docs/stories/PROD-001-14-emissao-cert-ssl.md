# PROD-001-14 — Emissão de certificado SSL para smartpreco.app

**Epic:** EPIC-PROD-001
**Status:** Done (2026-04-30)
**Severidade:** BLOQUEADOR (HSTS preload — site 100% inacessível para browsers reais) — RESOLVIDO
**Sprint:** SPRINT-2026-04-28 (v3)
**Owner:** Pedro Emilio (interativo: dashboard Vercel + GoDaddy DNS Manager)
**SP estimado:** 1 SP (~30 min wall-clock; 5-10 min ação direta + 5-15 min propagação ACME)
**Bloqueia:** smartpreco.app acessível via HTTPS. Sem isso, sprint inteiro perde ponto de aterrissagem do funil.

---

## Contexto

DNS GoDaddy corrigido em 30/04 (apex `smartpreco.app` → `76.76.21.21` Vercel). HTTP plano funciona (Vercel atende com 307), mas HTTPS falha com `SSL handshake read 0 bytes / no peer certificate`. **Diagnóstico Aria v3 (PROVÁVEL — 5 evidências a favor, 1 contra):** domínio em estado `verified: false` no Vercel — registro TXT `_vercel.smartpreco.app` (challenge ACME) ainda não foi criado no DNS GoDaddy.

**Crítico (descoberta Finch):** TLD `.app` está em HSTS preload de Chrome/Firefox/Safari — browsers fazem upgrade forçado HTTP→HTTPS. Sem cert, browser exibe `ERR_SSL_PROTOCOL_ERROR`. Curl HTTP funciona (mascarando o problema), mas **nenhum usuário real consegue acessar**. PROD-001-13 (eventos de funil) registra ZERO porque ninguém chega no app.

**Nota sobre DNS autoritativo:** DNS autoritativo de `smartpreco.app` é gerenciado pelo **GoDaddy** (nameservers: `ns39/ns40.domaincontrol.com`). Documentação anterior referenciando Cloudflare (PROD-001-9, `04-devops-gage.md`) está desatualizada — o registro TXT deve ser criado no **GoDaddy DNS Manager**, não no Cloudflare.

---

## Resolução real (2026-04-30)

**Diagnóstico Aria H1 (PROVÁVEL — TXT _vercel ausente) foi DESCARTADO em execução.** O cenário real foi **H2 (POSSÍVEL — ACME em fila / timing)**: o domínio já estava `verified: true` no Vercel, mas a emissão do cert estava em fila ("Generating SSL Certificate"). Um clique no botão `Refresh` do dashboard de Domains forçou re-check e o cert Let's Encrypt foi emitido em <1 min.

**Resolução:** sequência reduzida — apenas **R1 (verificar dashboard)** + **um clique em "Refresh"** resolveu. R2 (criar TXT no GoDaddy) **não foi necessário**. Todas as evidências H1 (NXDOMAIN do TXT, www CNAME incompleto) eram red herrings — Vercel havia auto-criado mecanismo de verificação alternativo.

**Lição para futuras stories SSL:** começar sempre com R1 + Refresh antes de assumir cenário cross-team verification. R2 (TXT manual) só se R1 confirmar `verified: false` explicitamente.

**Aviso recebido no dashboard ("DNS Change Recommended"):** Vercel sugere migrar de `76.76.21.21` para `216.198.79.1` como parte de IP range expansion. Sugestão **opcional** segundo Vercel ("old records will continue to work"). Não-bloqueador, pode ser hygiene em sprint futuro.

---

## Acceptance Criteria

1. [x] `curl -sI --max-time 15 https://smartpreco.app | head -1` retorna `HTTP/2 200` ou `HTTP/2 307` — verificado: `HTTP/2 307`
2. [x] Gate binário de cert passa:
   ```bash
   echo "Q" | openssl s_client -connect smartpreco.app:443 -servername smartpreco.app 2>/dev/null \
     | openssl x509 -noout -subject -issuer | grep -q "Let's Encrypt" \
     && echo "PASS" || echo "FAIL"
   ```
   Resultado esperado: `PASS` — verificado: `subject=CN=smartpreco.app`, `issuer=Let's Encrypt R12`
3. [x] Validade do cert é de no mínimo 60 dias:
   ```bash
   echo "Q" | openssl s_client -connect smartpreco.app:443 -servername smartpreco.app 2>/dev/null \
     | openssl x509 -noout -enddate
   ```
   Resultado esperado: `notAfter=` com data ≥ 60 dias a partir de hoje — verificado: `notAfter=Jul 29 21:21:18 2026 GMT` (~90 dias)
4. [x] Browser real (Chrome ou Safari) carrega `https://smartpreco.app` sem warning de cert — confirmado pelo Pedro Emilio
5. [x] Rotas críticas retornam 200:
   ```bash
   curl -sI https://smartpreco.app/calculadora-livre | head -1   # HTTP/2 200 ✓
   curl -sI https://smartpreco.app/privacidade | head -1         # HTTP/2 200 ✓
   curl -sI https://smartpreco.app/login | head -1               # HTTP/2 200 ✓
   ```
6. [ ] Eventos de funil começam a registrar — pelo menos 1 evento `calculo_iniciado` em `funnel_events` após smoke test manual (PENDENTE — depende de uso real da calculadora pelo Pedro):
   ```sql
   SELECT count(*) FROM funnel_events WHERE event_name = 'calculo_iniciado';
   -- Resultado esperado: > 0
   ```

---

## Tasks

### Track 0 — Workaround Funnel-First (executar EM PARALELO se houver demanda imediata)

- [ ] Identificar URL Vercel atual no dashboard: Vercel → jvdfcode → smartpreco → Deployments → Production
- [ ] Anotar URL `https://smartpreco-[hash]-jvdfcode.vercel.app`
- [ ] Compartilhar URL Vercel direto (cert válido automático) para early adopters enquanto domínio custom resolve

**Owner:** Pedro Emilio
**Custo:** 0 min
**Risco:** zero — URL Vercel já tem cert válido emitido automaticamente

---

### Track 1 — Verificação do estado do domínio no Vercel (R1 do Aria v3)

- [ ] Acessar `https://vercel.com/jvdfcode/smartpreco/settings/domains`
- [ ] Identificar status do domínio `smartpreco.app`: `verified: true` ou `verified: false`
- [ ] Se aparecer badge "Pending Verification" ou similar, copiar o valor do TXT challenge (formato `vc-domain-verify=...`)
- [ ] Registrar resultado: **`verified: true`** → aguardar 30 min (possível H2 — ACME em fila) | **`verified: false`** → prosseguir para Track 2

**Owner:** Pedro Emilio
**Pré-requisito:** acesso de Member/Collaborator no team `jvdfcode` via browser. Se tela retornar 403 ou domínio não aparecer, solicitar convite de `jvictorformiga` antes de prosseguir — bloqueante.
**Custo:** 2 min
**Risco:** zero (read-only)

---

### Track 2 — Adicionar TXT no GoDaddy DNS Manager (R2 do Aria v3) [se Track 1 confirma `verified: false`]

- [ ] Acessar GoDaddy DNS Manager — conta `pedroemilio11` → `smartpreco.app` → DNS
- [ ] Criar registro TXT:
  - **Type:** `TXT`
  - **Name:** `_vercel`
  - **Value:** `<challenge copiado do dashboard Vercel no Track 1>` — copiar via clipboard, não digitar manualmente
  - **TTL:** `1/2 hora` (600s)
- [ ] Aguardar 2-5 min
- [ ] Verificar propagação do registro:
  ```bash
  dig +short TXT _vercel.smartpreco.app
  # Deve retornar o valor do challenge, ex: "vc-domain-verify=..."
  ```
- [ ] Voltar ao dashboard Vercel (`settings/domains`) e clicar em "Verify"
- [ ] Aguardar 5-15 min para Vercel emitir cert via Let's Encrypt
- [ ] Confirmar com o gate binário do AC #2: resultado deve ser `PASS`

**Owner:** Pedro Emilio
**Custo:** 5-10 min ação + 5-15 min propagação ACME

#### Rollback (Track 2)

Se TXT criado com valor errado ou Vercel rejeitar a verificação:

1. Deletar registro TXT `_vercel` no GoDaddy DNS Manager
2. Verificar remoção: `dig TXT _vercel.smartpreco.app` retorna `NXDOMAIN`
3. Re-copiar o valor exato do challenge no dashboard Vercel
4. Repetir Track 2 com o valor correto

---

### Track 3 — Validação E2E (gate de DoD)

- [ ] Rodar gate binário completo (AC #2):
  ```bash
  echo "Q" | openssl s_client -connect smartpreco.app:443 -servername smartpreco.app 2>/dev/null \
    | openssl x509 -noout -subject -issuer | grep -q "Let's Encrypt" \
    && echo "PASS" || echo "FAIL"
  ```
- [ ] Validar 3 rotas críticas (AC #5) com curl
- [ ] Abrir browser real e testar `https://smartpreco.app/calculadora-livre` — confirmar ausência de warning de cert
- [ ] Realizar cálculo de frete manualmente para disparar evento `calculo_iniciado`
- [ ] Verificar evento de funil em `funnel_events` via Supabase dashboard (AC #6)

**Owner:** Pedro Emilio

---

## Dependencies

- **Acesso ao dashboard Vercel team `jvdfcode`** — Pedro Emilio é collaborator GitHub recém-aceito; verificar se acesso Vercel é automático ou requer convite separado de `jvictorformiga`. Se bloqueado, Track 1 e Track 2 ficam suspensos até convite ser concedido.
- **GoDaddy DNS Manager** — Pedro Emilio já tem acesso via conta `pedroemilio11`. Sem dependência externa.
- **Sem dependência de outra sessão Claude `jvdfcode`** — Track 1 e Track 2 são interativos no browser, não precisam de CLI Vercel scopado para o team.

---

## Riscos e mitigações

| Risco | Probabilidade | Mitigação |
|-------|---------------|-----------|
| Pedro não tem acesso ao dashboard Vercel `jvdfcode` | Média | Solicitar acesso Member com `jvictorformiga`; alternativa: solicitar que outra sessão Claude com acesso execute `vercel certs issue --scope jvdfcode` |
| Challenge TXT copiado com erro (typo, espaço extra) | Média | Copiar via clipboard direto, não digitar manualmente; validar com `dig` antes de clicar em "Verify" |
| Vercel não emite cert mesmo após "Verify" bem-sucedido | Baixa | Verificar CAA records (`dig CAA smartpreco.app`); se persistir após 1h, executar R3 do apêndice (remover + re-adicionar domínio) |
| Rate limit Let's Encrypt (50 certs/semana por registered domain) | Muito baixa | Verificar histórico via `curl https://crt.sh/?q=smartpreco.app`; pouco provável em domínio novo |

---

## File List (esperado pós-execução)

- (Nenhum arquivo de código alterado — story é operacional)
- `docs/stories/PROD-001-14-emissao-cert-ssl.md` — atualizar AC para `[x]`, Status para `Done` após conclusão

---

## Definition of Done

- AC #1 a #6 todos `[x]` com evidência (output de comando ou screenshot)
- Status: `Done`
- Smoke test em browser real registrado (screenshot ou comentário na story)
- 1 evento `calculo_iniciado` registrado em `funnel_events` (validação da instrumentação fim-a-fim)
- Code review: aprovação explícita do @pm Morgan (story puramente operacional, sem código modificado)

---

## Referências

- Diagnóstico: `docs/reviews/ssl-domain-2026-04-30/01-architect-aria.md` (v3)
- Auditorias: `docs/reviews/ssl-domain-2026-04-30/02-pedro-valerio.md`, `03-alan-nicolas.md`, `04-thiago-finch.md`
- Sprint: `docs/sprints/SPRINT-2026-04-28.md` (v2 → v3 após River atualizar com PROD-001-14)
- Story relacionada (descontinuada — terminologia Cloudflare): `PROD-001-9-custom-domain-dns-cloudflare.md`
- Story relacionada (URL Vercel de fallback): `PROD-001-8-deploy-preview-smoke-test.md`
- HSTS preload check: `https://hstspreload.org` — TLD `.app` incluído
- Verificar histórico de certs: `https://crt.sh/?q=smartpreco.app`
