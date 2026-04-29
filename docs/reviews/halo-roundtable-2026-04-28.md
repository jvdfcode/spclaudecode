# Roundtable Halo DS v1.0 — Síntese mestre

**Data:** 2026-04-28
**Curador:** Orion (AIOX Master / Design Chief)
**Documento-fonte:** `docs/reviews/halo-roundtable/HALO-DS-source.md` (Halo DS v1.0, abril 2026)
**Análises individuais:** `docs/reviews/halo-roundtable/01-alan-nicolas.md`, `02-thiago-finch.md`, `03-erich-shibata.md`

---

## Sumário executivo

As 3 personas convergem em um diagnóstico único e preciso: **o Halo é um sistema de estética cuidadosa fechado em si mesmo**. Alan acusa a **contradição constitucional** (§9.4 importa duas cores estranhas — `#0F5132` e `#8B2A0E` — violando o Princípio i e §3.1); Finch acusa **otimização de produto antes do funil** (zero hierarquia de CTA, tagline sem promessa específica); Erich acusa **doutrina sem campo** (Solar existe no Figma, não na rua; sem objeto físico âncora; sem embaixador). Os 3 vetam implantação técnica do Halo sem v1.1 corrigir esses gaps. Há **3 fortalezas unanimemente reconhecidas** (disciplina cromática 60·30·8·2; KPI tile; restrição como princípio operacionalizável), e **9 fraquezas** divididas em 4 visuais + 5 estruturais — todas com remediação concreta proposta. Decisão consensada: o Halo precisa virar **v1.1** com 5 adições obrigatórias antes que qualquer Onda técnica seja despachada para @brad-frost / @ds-foundations-lead.

---

## Rodada 1 — Análises individuais (resumo)

> Documentos completos em `docs/reviews/halo-roundtable/0N-{persona}.md`.

### 01 — Alan Nicolas (Knowledge Architect)
**Veredito:** "Halo é **prata com mancha de bronze** — estrutura-base com curadoria real, mas a disciplina cromática que o sistema jurou foi executada com bala no próprio pé."
**Aplaude:** §3 Cor (Trindade quase completa); §11 Tokens (Playbook+Framework+Swipe); §12 Acessibilidade (normas com números, não doutrina).
**Critica:** §9.4 importa cores estranhas (`#0F5132`, `#8B2A0E`, `#E9F4EE`, `#FCE7E0`) — viola §3.1 e Princípio i frontalmente; §3.5 sem fonte primária verificável (calculadora? WCAG 2.1?); §13 Changelog placeholder; §10 padrões sem Swipe HTML/CSS; §4 `--font-display` e `--font-body` apontam para a mesma família (token semanticamente vago).
**Pareto ao Cubo:** 0,8% genialidade = §3 + §11. 4% excelência = §12 + §6 + §9.1. 80% volume = §8 (ícones por nome só), §13, §9.5–9.12, §2.
**Veto:** §9.4 BLOQUEADO até derivar variants do sistema; §13 BLOQUEADO para multi-dev sem changelog real; §3.5 BLOQUEADO para produtos com requisito WCAG formal.

### 02 — Thiago Finch (Funnel-First)
**Veredito:** "DS com estética cuidadosa e zero promessa de conversão — otimizou produto antes do funil. Veto."
**Aplaude:** §3.4 + §10.4 (regra dos 2% como Loss Aversion pura); §9.7 KPI tile (hierarquia de dado real); §3.6 (combinações proibidas com motivo declarado).
**Critica:** 4 famílias tipográficas em §4.1 = FOUC + bundle que mata mobile (Instrument Serif decorativo bloqueia LCP); §7 `--shadow-glow` sem regra de frequência (replicar dilui o sinal de ação); §10.1 dashboard sem hierarquia de CTA; §2 tagline é jingle de portfólio, não promessa; §10.4 não quantifica downside em termos de conversão.
**Diagnóstico OMIE:** Observar = ausente (sem referência a Material/Carbon/Polaris/Ant); Modelar = parcial (60·30·8·2 OK, escala Solar inconsistente); Melhorar = estético, não de conversão; Excelência = sem KPI de DS (cobertura, tempo de implementação, taxa de violação).
**Loss Aversion 2.5:1:** o Halo está em ~0,2:1 — falta consequência de funil em §4.1, §10.4, §9.1, §10.1.
**Headline-test:** "Construído com 5 cores. Mantido com disciplina." é descrição de processo, não promessa. Reescrita possível: *"Cinco cores. Zero ambiguidade. Decisão em 3 segundos."*
**Veto:** implantação bloqueada até §10 ganhar §10.6 "Hierarquia de Conversão" obrigatória.

### 03 — Erich Shibata [SINTETIZADO] (Astro Designer / Cimed)
**Veredito (citação textual + síntese):** "O Halo escolheu a cor certa e fez 90% do dever de casa — faltou decidir onde o Solar vai aparecer na rua, no uniforme e no produto físico."
**Aplaude:** §3.4 disciplina monocromática com propósito (mesma decisão do amarelo Cimed); §1.ii + §9.1 hierarquia por contraste real (Solar/Eclipse 8.4 AAA); §4.1 escolha tipográfica corajosa (Bricolage + Instrument Serif > Inter/Roboto).
**Critica:** §3.4 + §11 sem âncora fora da tela (cadê Pantone, CMYK, aplicação têxtil?); §2 logo `H` em quadrado funciona em slide, não testado em fuselagem/tecido/relevo; sem sistema de "365 tiros" ([SOURCE: Made in Brasil 2023]) — Halo é doutrina fechada, não cultura de teste; §9.5 tem avatar como UI mas zero embaixador de marca ([SOURCE: "ninguém melhor do que o próprio dono"]); §2 tagline é promessa técnica, não convocação.
**Comparativo Cimed × Halo:** amarelo Cimed virou ativo porque saiu da bula, foi para o moletom, para o Carmed/Fini, para sonda espacial. O Halo tem disciplina no documento; falta rotina de aplicação fora do digital.
**Provocação:** *"Doutrina escrita não vira lifestyle. O amarelo da Cimed não virou nossa cor porque estava no manual; virou porque apareceu em todo lugar, todo dia, e às vezes errou feio. O Halo tem o sistema. Falta o campo. Falta o tiro."*

---

## Rodada 2 — Réplicas cruzadas (matriz)

### Alan ↔ Finch
- **Concorda 🤝:** ambos atacam **§13 changelog placeholder** como falha estrutural, não estética. Para Alan é falta de governança de versionamento; para Finch é falta de KPI de DS (Excelência do OMIE). Convergem em "sem rigor de versão, qualquer adoção em time multi-dev é apostada".
- **Diverge 🔥:** Alan acha que §3.5 (combinações aprovadas com contraste) é OURO porque tem números; Finch acha que §3.5 sozinho é ESTÉTICA — falta o §3.6 inverso operando como Loss Aversion ativa em outras seções. **Tensão real:** Alan vê dado como prova; Finch vê dado como copy de venda. Os dois estão certos em escopos diferentes — auditoria precisa de ambos.

### Alan ↔ Erich
- **Concorda 🤝:** ambos consideram que **§4.1 escolha tipográfica** é boa decisão (Erich: "decisão corajosa"; Alan: "ouro do conjunto §4 fora do gap do `--font-display`"). Convergem em que Bricolage + Instrument Serif diferenciam genuinamente.
- **Diverge 🔥:** Alan veta §9.4 por **violação constitucional interna** (cores fora do sistema das 5 âncoras); Erich não toca nessa contradição — para ele a falha gravíssima é **externa** (Solar não tem âncora física fora do pixel). **Tensão real:** auditor de doutrina vs. auditor de mundo. Alan barraria o sistema por inconsistência interna mesmo sem provar uso real; Erich barraria por falta de uso real mesmo se a doutrina fosse perfeita.

### Finch ↔ Erich
- **Concorda 🤝:** **tagline genérica** é o ponto onde mais convergem. Finch: "Construído com 5 cores… é jingle, não promessa". Erich: "É promessa técnica, não convocação". Ambos propõem reescrever; ambos invocam exemplos de promessa específica (Finch: "Decisão em 3 segundos"; Erich: "Red Bull da indústria farmacêutica" [SOURCE]).
- **Diverge 🔥:** Finch quer reescrever a tagline como **headline de conversão** (palavra-poder, número, ganho); Erich quer reescrever como **convocação de lifestyle** (ambição grande, simbolismo). **Tensão real:** funil de aquisição vs. mito de marca. A diferença prática é enorme — uma converte hoje, a outra dura uma década. Para um DS pré-MVP, Finch ganha; para um DS que vira marca-mãe, Erich ganha. **O Halo não declarou o que quer ser**, e por isso a divergência é real.

---

## Rodada 3 — Síntese consensada

### Pontos de consenso visual (onde os 3 concordam que está bom)

1. **§3.4 — proporção 60·30·8·2 (regra dos 2% Solar)**
   Alan: "Trindade quase completa". Finch: "Loss Aversion em estado puro". Erich: "doutrina de sinal — entrega na rua". **Não mexer.** É o ouro do sistema.

2. **§3 + §11 — paleta de 5 âncoras + tokens consolidados**
   Alan: "0,8% genialidade do documento". Finch: "diferenciação genuína vs `primary/secondary` de outros sistemas". Erich: "escolha certa, igual amarelo Cimed". **Não mexer na restrição** — é o que faz o sistema existir.

3. **§4.1 — escolha tipográfica (Bricolage + Instrument Serif + JetBrains Mono)**
   Alan: "boa fora do gap `--font-display`". Erich: "decisão corajosa, diferencia em hero/OOH". Finch concorda na escolha mas alerta sobre custo de bundle (não estético). **Manter as famílias, otimizar carregamento.**

### Pontos de consenso estrutural (onde os 3 concordam que precisa mexer)

1. **§13 Changelog é placeholder — falta governança de versionamento**
   Alan veta para multi-dev. Finch coloca no OMIE Excelência (sem KPI de adoção). Erich diz "falta o campo, falta o tiro" — sem changelog real, não há ciclo de teste. **Bloqueador unânime.**

2. **§2 Tagline é genérica**
   Alan não veta direto, mas Finch e Erich vetam. **2 de 3 personas pedem reescrita; o terceiro não defende a atual.** Consenso operacional: reescrever.

3. **Falta camada de aplicação além do pixel**
   Erich é o mais explícito ("Solar fora do pixel, embaixador, 365 tiros"). Finch chega ao mesmo lugar por outro caminho ("hierarquia de CTA, KPIs de DS, conversão"). Alan toca por falta de Swipe operacional em §10. **Os 3 concordam:** o Halo é doutrina sem operação.

### Divergências marcadas

| Tema | Pólo A | Pólo B | Resolução proposta |
|------|--------|--------|--------------------|
| **§9.4 cores estranhas (verde/bordô)** | Alan: VETO absoluto, viola constituição | Finch e Erich: não tocam | Alan está certo no rigor; v1.1 deve resolver via 1 das 3 vias propostas por ele |
| **Como reescrever a tagline** | Finch: headline de conversão com número | Erich: convocação de lifestyle/mito | Halo precisa **declarar primeiro o que quer ser** (DS-produto ou DS-marca); só então reescreve |
| **Onde o Halo é raso** | Alan: rigor interno (governance, fontes) | Erich: rigor externo (uso na rua) | Ambos, em ondas separadas no v1.1 |
| **Bundle de fontes** | Finch: cortar Instrument Serif do bundle padrão | Erich: manter as 4 famílias (diferenciação) | Manter as 4, mas **carregar Instrument Serif assíncrono** (resolve os dois) |

### Top 5 melhorias visuais priorizadas

| # | Melhoria | Apoio | Justificativa | §  |
|---|----------|-------|---------------|----|
| **1** | **Resolver §9.4: derivar `badge--success` e `badge--danger` do sistema das 5 âncoras OU declarar formalmente como extensão fora do core** | Alan (veto) | Viola §3.1 e Princípio i. Sem isso, qualquer implementação está fora do Halo por definição. | §9.4 + §3 |
| **2** | **§3.4 + §11 + §2 — Acrescentar §14 "Solar Fora do Pixel"** com Pantone/CMYK/têxtil, regra de uso em superfície monocromática, exemplo de objeto físico âncora | Erich | Sem isso, Solar existe só no Figma — não vira lifestyle. | §3, §11, novo §14 |
| **3** | **§4.1 — Carregar Instrument Serif de forma assíncrona; especificar `font-display: swap` em todas as famílias; remover Instrument Serif do critical CSS** | Finch + Erich (resolução de divergência) | FOUC + LCP. Loss Aversion: "Instrument Serif bloqueia CTA em 3G mobile = abandono de tarefa" | §4.1 |
| **4** | **§9.5 — Adicionar "Embaixador Solar"**: regras para quando uma pessoa real porta o Solar (uniforme, badge, comunicação); diferenciar avatar-componente de embaixador-de-marca | Erich | Avatar genérico não cria lifestyle. Cimed virou marca porque tinha rosto humano portando o amarelo. | §9.5 + §2 |
| **5** | **§7 + §10.4 — Restringir explicitamente `--shadow-glow` a "exclusivo de Primary"**; declarar que aplicar em outros componentes é violação | Finch | Sem regra de frequência, glow se replica e dilui sinal de CTA. | §7, §10.4 |

### Top 5 melhorias estruturais priorizadas

| # | Melhoria | Apoio | Justificativa | §  |
|---|----------|-------|---------------|----|
| **1** | **Reescrever §13 Changelog como changelog real**: decisões-chave, alternativas descartadas, breaking changes, plano de versionamento | Alan (veto) + Finch + Erich | Sem changelog real, qualquer v1.1 não tem memória. Bloqueador unânime para multi-dev. | §13 |
| **2** | **§10 — Adicionar §10.6 "Hierarquia de Conversão"**: uma Primary por tela, posição above-the-fold, regra de `kpi__item--accent`, downside de violação | Finch (veto) | DS sem CTA é vitrine, não funil. Otimizou produto antes do funil. | §10, §9.1 |
| **3** | **§3.5 + §12.1 — Adicionar fonte primária e ferramenta de cálculo de contraste** ("Calculado com APCA/WebAIM contra WCAG 2.1 §1.4.3, em [data]") | Alan (veto) | Auditoria externa exige rastreabilidade. Risco legal em produtos enterprise/gov/saúde. | §3.5, §12.1 |
| **4** | **Criar protocolo de "365 tiros" — §15 Cadência de Variantes**: critério de teste de campo, avaliação de consistência com §3.4, aprovação para o sistema canônico | Erich | DS sem cultura de teste é constituição morta. "O que não é testado, não é marca, é doutrina." | novo §15 |
| **5** | **§4.1 — Resolver tokens `--font-display` vs `--font-body`**: ou diferenciar (peso, optical size, contexto de uso) ou colapsar em um. Token semanticamente vago = implementação ambígua | Alan | Tokens com mesma família invitam confusão e quebram self-validation. | §4.1, §11 |

---

## Decisão sobre v1.1 — o que entra antes da implantação técnica

Os 3 personas vetaram a implantação direta do v1.0 no `spclaudecode`. **Halo precisa virar v1.1 com 7 adições obrigatórias** antes que as Ondas 1-4 (foundation + UI + codemod + telas) sejam despachadas para @brad-frost / @ds-foundations-lead:

### Bloqueadores absolutos (3) — vêm com VETO de pelo menos 1 persona
1. **§9.4 corrigido** (Alan veto) — `badge--success` e `badge--danger` derivados do sistema das 5 âncoras OU declarados como extensão formal com justificativa.
2. **§10.6 "Hierarquia de Conversão"** (Finch veto) — uma Primary por tela, regra de CTA above-the-fold, downside quantificado.
3. **§13 Changelog real** (Alan + consenso unânime) — decisões, alternativas, breaking changes, plano de v1.x.

### Adições obrigatórias para v1.1 (4) — consenso forte mas sem veto explícito
4. **§14 Solar Fora do Pixel** (Erich) — Pantone, CMYK, têxtil, objeto físico âncora.
5. **§15 Cadência de Variantes / 365 tiros** (Erich) — protocolo de teste de campo.
6. **§3.5 com fonte primária verificável** (Alan) — ferramenta de contraste citada.
7. **§4.1 com `font-display: swap` + Instrument Serif assíncrono + diferenciação real entre `--font-display` e `--font-body`** (Finch + Alan).

### Reescritas recomendadas (2) — consenso operacional, decisão pendente
8. **§2 Tagline reescrita** — depende de declarar primeiro se o Halo é DS-produto (Finch ganha) ou DS-marca (Erich ganha). **Decisão de produto antes de palavra.**
9. **§9.5 Embaixador Solar** — adição opcional dependendo do escopo do Halo (interno × externo).

---

## Próximo passo recomendado pelo Design Chief

1. **Usuário decide:** Halo v1.1 é DS-produto (foco em conversão de implementação interna) ou DS-marca (foco em lifestyle/branding externo)? Isso destrava itens 8 e 9 e a tagline.
2. **Eu (Orion / Design Chief) entrego v1.1 do Halo** com os 7 bloqueadores + obrigatórios resolvidos, em `docs/reviews/halo-roundtable/HALO-DS-v1.1.md`.
3. **Aprovação do v1.1** → roteamento das Ondas 1-4 para @brad-frost / @ds-foundations-lead conforme plano técnico anterior (foundation + UI + codemod + telas).

---

## Procedência

| Persona | Fonte | Tipo |
|---------|-------|------|
| Alan Nicolas | `squads/squad-creator-pro/agents/oalanicolas.md` | Agente formal |
| Thiago Finch | `squads/squad-creator-pro/agents/thiago_finch.md` | Agente formal |
| Erich Shibata | `~/Downloads/erich_shibata_relatorio.md` (266 linhas, dossier público) | **[SINTETIZADO]** — interpretação inferencial; citações textuais marcadas com `[SOURCE: ...]` |

> ⚠️ Disclaimer ético: Erich Shibata é representação inferencial a partir de fontes públicas, não a pessoa real nem manifestação oficial. Análise produzida sob a voz dele para gerar tensão produtiva no roundtable.

---

*Síntese curada por Orion / Design Chief — Roundtable Halo DS v1.0 — 2026-04-28*
*Análises individuais: `docs/reviews/halo-roundtable/01-alan-nicolas.md`, `02-thiago-finch.md`, `03-erich-shibata.md`*
*Fonte primária: `docs/reviews/halo-roundtable/HALO-DS-source.md`*
