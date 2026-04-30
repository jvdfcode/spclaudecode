# Pedro Valerio -- Auditoria Process-Absolutist do diagnostico SSL (Aria)

> "Verde no terminal != verde em producao. Mostra a evidencia ou nao passa."

## Veredito (1 frase)

**NEEDS WORK** -- O diagnostico e tecnicamente solido na coleta de evidencias e na estrutura de hipoteses, mas possui um erro factual critico no provedor DNS (GoDaddy vs Cloudflare), ausencia total de owner pessoa-fisica, rollback nao declarado em nenhuma recomendacao, e gates CLI sem comando binario executavel -- quatro vetos absolutos que impedem transformacao em stories executaveis.

## 3 Fortalezas do diagnostico Aria

1. **Evidencias verificaveis e auditaveis.** As 10 evidencias do "Estado capturado" sao reproduziveis via comandos (`dig`, `curl`, `openssl s_client`). Isso e pass -- evidencia > opiniao.
2. **Hipoteses com criterio de descarte binario.** Cada hipotese (H1/H2/H3) declara "Como confirmar" e "Como descartar" -- permite execucao pass/fail sem ambiguidade interpretativa.
3. **Sequencia de recomendacoes ordenada por reversibilidade.** R1 (read-only) antes de R2 (parcialmente reversivel) antes de R3 (destrutivo) -- respeita o principio de rollback incremental.

## 4 Vetos absolutos (gaps process)

### VETO 1 -- Erro factual no provedor DNS: GoDaddy vs Cloudflare

**Gap:** Aria afirma no veredito: `"nao possui registro TXT _vercel.smartpreco.app no DNS GoDaddy"` e em R2: `"criar registro TXT _vercel no GoDaddy"`. Porem, TODA documentacao anterior -- Gage (`04-devops-gage.md`: "DNS do Cloudflare aponta para AWS"), story PROD-001-9 (titulo: "DNS Cloudflare"), e a propria Aria em 28/04 (`01-architect-aria.md`: "Depende do USUARIO (DNS/Cloudflare)") -- referencia Cloudflare como provedor DNS. O SOA serial com GoDaddy pode indicar que o registrar e GoDaddy mas o DNS autoritativo e Cloudflare, ou pode indicar migracao recente. Sem clareza, o executor vai ao painel errado.

**Condicao de desbloqueio:** Declarar binariamente: "O DNS autoritativo de smartpreco.app e gerenciado por [GoDaddy | Cloudflare]. O registro TXT deve ser criado no painel [X]." Incluir evidencia: `dig NS smartpreco.app` com resultado.

### VETO 2 -- Ausencia total de owner pessoa-fisica

**Gap:** R1 diz `"Acessar dashboard Vercel"` -- quem? R2 diz `"criar registro TXT no GoDaddy"` -- quem? R3 diz `"No dashboard ou CLI"` -- quem? Aria identifica na dependencia 1 que `"o usuario pedroemilio11 NAO tem acesso CLI ao team"` e que `"precisa que o owner (jvictorformiga) conceda acesso"` -- mas nenhuma recomendacao nomeia qual pessoa-fisica executa cada passo. "@dev" ou "Dev" nao conta. Sem owner, nao ha accountability auditavel.

**Condicao de desbloqueio:** Cada recomendacao deve declarar: "Owner: Pedro Emilio" ou "Owner: jvictorformiga" ou "Owner: sessao Claude com acesso X". Gate binario: se o owner nomeado nao tem acesso ao recurso, a recomendacao e bloqueada ate acesso ser concedido.

### VETO 3 -- Rollback nao declarado em nenhuma recomendacao

**Gap:** R1 diz "read-only, zero risco" (ok). R2 diz `"TXT record pode ser removido a qualquer momento; dominio pode ser removido e re-adicionado"` -- isso e descricao generica, nao procedimento de rollback. Se o TXT for criado com valor errado e Vercel rejeitar, qual e o passo exato? R3 diz `"o dominio pode ficar sem servir trafego durante o processo"` -- mas nao declara: "Se R3 falhar, executar [comando X] para restaurar estado anterior." A story PROD-001-9 JA tem secao Rollback com comandos exatos -- o diagnostico Aria ignora isso.

**Condicao de desbloqueio:** Cada recomendacao R2 e R3 deve incluir secao `Rollback:` com comandos exatos. Minimo: "Se falhar: deletar registro TXT `_vercel` no painel DNS, verificar `dig TXT _vercel.smartpreco.app` retorna NXDOMAIN."

### VETO 4 -- Probabilidades sem base concreta (75%/20%/5%)

**Gap:** Aria afirma H1 com `"prob: 75%"`, H2 com `"prob: 20%"`, H3 com `"prob: 5%"`. Esses numeros nao tem base empirica -- sao chute calibrado, nao evidencia. O diagnostico nao pode ser auditavel com probabilidades inventadas. A convergencia de evidencias e forte (e isso e merito de Aria), mas o numero "75%" e opiniao disfarçada de dado.

**Condicao de desbloqueio:** Substituir probabilidades numericas por classificacao binaria: "H1: PROVAVEL (4 evidencias a favor, 1 contra, nenhuma descartante)" / "H2: POSSIVEL (1 evidencia a favor, 1 contra)" / "H3: DESCARTADO (evidencia contra confirmada)". Elimina a falsa precisao.

## Matriz auditoria das 3 recomendacoes de Aria

| Rec | Owner pessoa-fisica? | DoD mensuravel? | Rollback declarado? | Gate CLI executavel? | Veredito |
|-----|---------------------|-----------------|---------------------|----------------------|----------|
| R1 | NAO -- nenhum nomeado | NAO -- "identificar o estado exato" nao e binario | SIM -- read-only, N/A | NAO -- nenhum comando pass/fail declarado | **VETO** |
| R2 | NAO -- nenhum nomeado | SIM -- `openssl s_client` declarado | NAO -- procedimento generico, sem comandos | SIM -- `openssl s_client -connect smartpreco.app:443` | **VETO** |
| R3 | NAO -- nenhum nomeado | NAO -- "cert emitido em ate 15 minutos" sem comando | NAO -- risco de downtime mencionado, sem procedimento | NAO -- nenhum comando pass/fail | **VETO** |

## 3 Recomendacoes concretas (input pra PM+SM)

1. **EXIGIR no AC da story:** Gate binario obrigatorio no DoD: `openssl s_client -connect smartpreco.app:443 -servername smartpreco.app 2>/dev/null | openssl x509 -noout -subject -issuer | grep -q "Let's Encrypt" && echo "PASS" || echo "FAIL"`. Sem PASS no terminal, story nao fecha.

2. **NOMEAR owner:** Pedro Emilio e owner de R1 (acesso dashboard via browser) e R2 (acesso painel DNS). Se acesso ao team `jvdfcode` nao existir via browser, pre-requisito bloqueante: jvictorformiga conceder acesso Member. Owner do pre-requisito: Pedro Emilio (solicitar a jvictorformiga). Isso e auditavel.

3. **DECLARAR rollback in-line na story:** Para R2: "Se TXT criado com valor errado: deletar registro TXT `_vercel` no painel DNS, aguardar 2min, verificar `dig TXT _vercel.smartpreco.app` retorna NXDOMAIN, re-copiar valor correto do dashboard Vercel." Para R3: "Se dominio removido nao re-adicionar: trafego HTTP para de funcionar; restaurar apontando A para preview URL ou IPs anteriores conforme PROD-001-9 secao Rollback."

## Conclusao executiva

O diagnostico Aria e tecnicamente correto na coleta de evidencias e na logica de hipoteses -- a convergencia para H1 e solida. Porem, falta: (1) clareza binaria sobre qual painel DNS usar (veto critico: GoDaddy vs Cloudflare), (2) owner pessoa-fisica em cada acao, (3) rollback declarado com comandos exatos, (4) gates CLI pass/fail no DoD. PM precisa absorver os 4 gaps nos ACs da story; SM precisa garantir DoR verificando que o owner nomeado tem acesso ao recurso antes de marcar "Ready".
