# Alan Nicolas — Curadoria do diagnostico SSL (Aria v2)

> "Pareto ao Cubo: 1% das acoes gera 50% do resultado. O resto e bronze que finge ser ouro."

## Veredito (1 frase)

**APPROVE** — O diagnostico v2 da Aria e tecnicamente correto, absorveu os 4 vetos com substancia (nao cosmese), e a convergencia para H1 e solida — mas o documento precisa de curadoria implacavel: 3 das 10 evidencias sao commodity, H3 e ruido declarado, e R3 e paranoia operacional travestida de recomendacao.

## 3 Fortalezas (o OURO do diagnostico)

1. **NXDOMAIN no TXT `_vercel` e a evidencia-raiz.** Evidencia 9 (`dig TXT _vercel.smartpreco.app: NXDOMAIN`) e o ativo de conhecimento mais valioso do documento inteiro. Sozinha, combinada com evidencia 5 (TLS 0 bytes), fecha o diagnostico. Isso e ouro puro.
2. **Sequencia R1 -> R2 ordenada por reversibilidade.** Read-only antes de write. Dashboard antes de DNS. Zero risco antes de risco parcial. Aria respeitou o principio correto e o executor nao precisa pensar — so seguir a ordem. Curadoria aprova.
3. **Absorcao genuina dos 4 vetos.** O esclarecimento GoDaddy cita nameservers concretos (`ns39/ns40.domaincontrol.com`), owner pessoa-fisica nomeado, rollback com passos numerados, classificacao PROVAVEL/POSSIVEL/DESCARTADO com contagem de evidencias. Nao foi compliance mecanico — houve correcao real. Merito da Aria.

## 4 Fraquezas (o BRONZE travestido de OURO)

1. **H3 (Middleware interceptando ACME) — ruido declarado que polui a leitura.** Aria marca `DESCARTADO` com `A favor (0)` e `Contra (4)`. Se zero evidencias suportam, por que ocupa 4 linhas do diagnostico? E curiosidade tecnica, nao curadoria. Um executor lendo o documento gasta atencao em algo que a propria autora ja descartou. Cortar ou reduzir a uma unica linha de registro.

2. **H2 (ACME em fila/timing) — hipotese-sombra sem poder de acao.** `"A favor (2)"` com evidencias fracas (SOA serial e header Age). `"Contra (3)"`. A recomendacao derivada e "espere 30 min" — que qualquer pessoa faria naturalmente apos R2. H2 nao gera nenhuma acao diferente de H1. E bronze: parece analise, mas nao move ponteiro.

3. **R3 (remover e re-adicionar dominio) — paranoia operacional.** Aria diz `"ultimo caso"` e admite `"downtime temporario"`. Se R1 confirmar pending verification e R2 resolver com TXT, R3 nunca sera executada. Incluir uma opcao destrutiva com downtime "por precaucao" dilui a clareza da recomendacao executiva. O executor precisa saber: **faca R1+R2, pronto**. R3 so deveria existir como nota de rodape condicional, nao como recomendacao pareada.

4. **3 evidencias sao commodity de troubleshooting.** Evidencia 2 (SOA serial) so sustenta H2 que e fraca. Evidencia 7 (www CNAME) e problema secundario que nao bloqueia o cert do dominio raiz. Evidencia 10 (API endpoint existe) e informativa — prova que a Vercel TEM um endpoint, nao que o dominio PRECISA dele agora. Incluir tudo infla o documento e esconde a essencia.

## 3 Recomendacoes de curadoria

1. **CORTAR:** H3 inteira (reduzir a 1 linha: "H3 Middleware — DESCARTADO, 0 evidencias a favor"). Cortar evidencias 2, 7 e 10 do corpo principal — mover para apendice "Evidencias complementares" se necessario para auditoria. Cortar R3 do corpo principal — mover para nota condicional: "Se R1+R2 falharem apos 1h, considerar reset de dominio (ver apendice)."

2. **ELEVAR:** A essencia cabe em 3 frases: (a) TXT `_vercel` nao existe no GoDaddy, (b) sem TXT a Vercel nao verifica ownership e nao inicia ACME, (c) criar o TXT resolve. Essa essencia deve ser o primeiro paragrafo, nao estar enterrada apos 10 evidencias. O veredito atual e bom mas a "Recomendacao executiva final" deveria ser o SEGUNDO bloco do documento, nao o ultimo.

3. **ADICIONAR:** Nada de novo — o ouro ja esta no documento, so precisa de curadoria. O unico item que agregaria valor real: um **checklist de 4 passos** no topo do documento (1. Acessar dashboard jvdfcode, 2. Confirmar "Pending Verification", 3. Copiar TXT challenge, 4. Criar registro no GoDaddy). Isso e ouro porque e o unico artefato que o executor realmente precisa.

## Ranking das 3 recomendacoes (R1/R2/R3) — OURO/PRATA/BRONZE

| Rec | Classificacao | Justificativa Pareto |
|-----|---------------|---------------------|
| R1 (verificar dashboard) | **OURO** | 2 minutos, zero risco, resultado binario que desbloqueia tudo. E o 1% que define se o diagnostico esta correto. Sem R1 confirmado, R2 e R3 sao chute. |
| R2 (criar TXT) | **OURO** | E a acao que resolve o problema. Se H1 e PROVAVEL (e e), R2 e a cura. Gate com `openssl` e mensuravel. Junto com R1, forma o par inegociavel. |
| R3 (remover e re-adicionar) | **BRONZE** | Causa downtime, so se aplica se R1+R2 falharem (cenario improvavel dado a convergencia de 5 evidencias para H1), e nao tem evidencia propria que justifique sua existencia como recomendacao primaria. E seguro de paranoia, nao curadoria. |

## Curadoria das 10 evidencias

**Essenciais (manter — sao o ouro):**

| # | Evidencia | Por que e ouro |
|---|-----------|---------------|
| 5 | TLS 0 bytes, no peer certificate | Prova o sintoma. Sem isso nao ha diagnostico. |
| 9 | `dig TXT _vercel.smartpreco.app`: NXDOMAIN | Prova a causa provavel. A evidencia mais valiosa do documento. |
| 4 | HTTP 307, Server: Vercel, X-Vercel-Cache: HIT | Prova que DNS e routing funcionam — isola o problema em TLS/ACME. |
| 8 | Team jvdfcode: 403 Forbidden | Explica por que nao ha confirmacao direta via API. Contexto critico. |
| 1 | DNS resolve 76.76.21.21 em 3 resolvers | Elimina propagacao DNS como causa. |

**Uteis mas secundarias (manter resumidas):**

| # | Evidencia | Papel |
|---|-----------|-------|
| 3 | CAA vazio | Elimina bloqueio de CA. Util, mas esperado. |
| 6 | ACME path retorna 404 da infra Vercel | Confirma que infra e acessivel. Complementar. |

**Commodity — cortar do corpo principal (3):**

| # | Evidencia | Por que e bronze |
|---|-----------|-----------------|
| 2 | SOA serial 2026043000 | So sustenta H2 (fraca). Nao move ponteiro para H1. |
| 7 | www CNAME aponta para smartpreco.app | Problema secundario de subdomain. Nao bloqueia cert do dominio raiz. |
| 10 | API endpoint POST verify existe | Informativo. Prova que a API existe, nao que o dominio precisa dela agora. |

**Placar: 5 ouro, 2 prata, 3 bronze.** Documento curado teria 7 evidencias no corpo e 3 em apendice.

## Conclusao executiva (2-3 frases)

O 1% que importa: evidencia 9 (NXDOMAIN no TXT) + R1 (confirmar no dashboard) + R2 (criar o TXT). Esse trio resolve o problema. Todo o resto — H2, H3, R3, evidencias 2/7/10 — e ruido de completude que finge ser rigor. A Aria fez um diagnostico tecnicamente correto; a curadoria agora e separar a essencia do documento da sua gordura operacional para que o executor tenha um caminho de 4 passos, nao um labirinto de 10 evidencias e 3 hipoteses.
