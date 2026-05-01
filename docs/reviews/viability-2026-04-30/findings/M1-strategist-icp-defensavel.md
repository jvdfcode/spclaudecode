# M1 — @meli-strategist: ICP defensavel (modo proxy)

**Specialist:** @meli-strategist
**Comando:** *audit-listing (proxy: vendedor ML real que usaria SmartPreco)
**Data:** 2026-05-01

## Estado atual do ICP

- **Declaracao:** "vendedor 5+ SKUs, faturamento R$5-100k/mes"
- **Defensavel?** Nao
- **Tem nome+sobrenome+canal?** Nao
- **Tem 5 entrevistas validadas?** Nao (zero de dez executadas)

`ICP-validation-2026-Q2.md` inteiramente TEMPLATE. `interviews/INDEX.md`: 10 linhas pendentes, zero entrevistas. ICP e demografia generica, nao pessoa encontravel.

---

## Findings

### #1 — ICP sem nome real: impossivel encontrar em campo

- **Severidade:** CRITICA
- **Heuristica:** MS007 (analogia: categoria errada de cliente = visibilidade zero)
- **Evidencia:** `ICP-validation-2026-Q2.md` secao 1.1 — campos `...`. `posicionamento.md` linha 6: "decisao tentativa" dependente das entrevistas.
- **Tag:** [INFERRED]
- **Recomendacao:** Construir 1 perfil nomeado com cidade, faturamento, SKUs e grupo onde a pessoa esta HOJE. Problema e execucao, nao metodo.

### #2 — Faixa R$5-100k colapsa dois perfis distintos

- **Severidade:** ALTA
- **Heuristica:** MS006 (analogia: agrupar perfis fragmenta mensagem como fragmentar SKUs)
- **Evidencia:** Vendedor R$5k/mes (solo, sem SaaS) vs R$80k/mes (equipe, Bling/Tiny R$100-300/mes). Dor e WTP sao diferentes. [GUSTAVO-LUCAS] — alunos de mentoria acima de R$30k/mes ja investem em ferramentas.
- **Tag:** [GUSTAVO-LUCAS] + [INFERRED]
- **Recomendacao:** Separar em 2 sub-perfis. Decidir apos 5 entrevistas qual tem WTP para R$39-59/mes.

### #3 — Zero evidencia de onde o ICP se congrega

- **Severidade:** CRITICA
- **Heuristica:** MS001 (analogia: sem canal = anuncio sem atributos)
- **Evidencia:** `concorrencia-2026-Q2.md` secao 1 — tabela de grupos em branco. Zero entrevistas = zero dados de canal.
- **Tag:** [INFERRED]
- **Recomendacao:** Mapear 3 grupos ativos (FB vendedores ML, WhatsApp regional, comunidades Tiny/Bling). Sao tambem canal de recrutamento para entrevistas.

### #4 — WTP R$39-59 desancorado: A/B test roda no vazio

- **Severidade:** ALTA
- **Heuristica:** MS005 (analogia: sem WTP validado, preco e ruido)
- **Evidencia:** Tabela WTP em branco. Alex: "tres precos sao chute". Nubimetrics R$197/mes, Real Trends R$99+. [PARROS-CASE] — vendedores de volume tratam SaaS como investimento.
- **Tag:** [PARROS-CASE] + [INFERRED]
- **Recomendacao:** Nao fixar preco antes de 5 entrevistas com WTP declarado.

### #5 — Anti-ICP nao verificado

- **Severidade:** MEDIA
- **Heuristica:** MS003 (analogia: assumir exclusao sem checar)
- **Evidencia:** Exclui "<5 SKUs" e "+R$1M/mes" sem validacao. Vendedores com 3 SKUs de ticket alto podem ter dor intensa.
- **Tag:** [INFERRED]
- **Recomendacao:** Incluir 1 entrevista fora da faixa para testar fronteiras.

### #6 — Posicionamento suspenso sem ICP

- **Severidade:** ALTA
- **Heuristica:** MS009 (analogia: posicionamento sem ICP = Ads sem conversao organica)
- **Evidencia:** `posicionamento.md` linhas 55-60 exige revisita apos entrevistas. Se dor primaria for integracao e nao precisao, posicionamento muda.
- **Tag:** [INFERRED]
- **Recomendacao:** Tratar posicionamento como hipotese H0 ate 5 entrevistas confirmarem.

---

## Perfil PROXY (vendedor ML real que pagaria SmartPreco)

**Nome:** Ricardo Tavares (ficcional, baseado em perfil-tipo)
**Idade:** 34 anos
**Cidade/Estado:** Duque de Caxias, RJ
**SKUs ativos:** 45 (eletronicos: capas, carregadores, fones)
**Faturamento ML mensal:** R$38.000
**Equipe:** ele + esposa (SAC/embalagem)
**Reputacao:** verde claro

**Onde esta hoje:**
- 2 grupos Facebook de vendedores ML (50k+ membros) [INFERRED]
- Videos Gustavo Lucas no YouTube [GUSTAVO-LUCAS]
- Usa Bling (R$99/mes) para NF; precifica no Excel sem calcular comissao por tipo de anuncio
- Mercado Livre Experience quando no Sudeste [ML-CENTRAL]

**Como descobre ferramentas:**
- Grupo FB: "alguem usa ferramenta pra calcular margem real no ML?"
- Google: "calculadora taxa mercado livre"
- Indicacao de vendedor no WhatsApp

**Razao para PAGAR R$39-59/mes:**
Perde ~R$2.800/mes em margem por precificar errado 12 de 45 SKUs. Com comissoes variando entre Free (0%), Classic (11%) e Premium (17%), nao tem tempo para calcular manualmente. Paga pelo **recalculo em lote com cenarios** — R$49 sobre R$38k = 0.13% do faturamento. [PARROS-CASE] + [INFERRED]

---

## Veredito

ICP NAO e defensavel. Declaracao demografica sem nome, sem canal, sem entrevista. Ferramental metodologico existe — problema e execucao. Perfil PROXY "Ricardo Tavares" e hipotese, nao evidencia.

## Nota 3/10

**Nota:** 3/10
**Justificativa:** Rubric v3 faixa 1-3: "Sem ICP, sem pricing defensavel, sem GTM". Nao e 1 porque ferramental existe e posicionamento tem logica interna (Raduan + Finch + Tallis). Mas ferramental sem execucao nao e ICP — e intencao.

---

## Sources usadas

| Tag | Fonte | Uso neste documento |
|-----|-------|---------------------|
| [GUSTAVO-LUCAS] | gustavolucas.net, OURO ativo | Faixa de vendedores que investem em ferramentas |
| [PARROS-CASE] | Exame 2017, OURO historico | Vendedor trata SaaS como investimento |
| [ML-CENTRAL] | Central de Vendedores ML | ML Experience como ponto de encontro |
| [INFERRED] | Padroes gerais marketplace | Perfil PROXY, canais, anti-ICP, posicionamento |
| Docs internos | ICP-validation, posicionamento, concorrencia, interviews/, analyst-alex | Estado TEMPLATE como evidencia de gap |
