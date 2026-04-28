# Alan Nicolas — Auditoria de Curadoria do Halo DS

> "Bora ver se o Halo é OURO ou BRONZE."

---

## Veredito (1 frase)

O Halo é **prata com mancha de bronze**: a estrutura-base tem curadoria real mas a disciplina cromática que o sistema jurou de morte foi executada com bala no próprio pé — §9.4 importa duas cores estranhas sem explicar a origem, e o §13 é placeholder com verniz de versão séria.

---

## 3 Fortalezas (com critério Trindade)

**1. §3 Cor — Sistema cromático com Trindade quase completa**
Playbook concreto: proporção 60·30·8·2 documentada em §3.4 com regra operacional ("se você está usando mais de 2% de laranja, provavelmente está usando errado"). Framework explicado: escala tonal derivada matematicamente das 5 âncoras em §3.2 com step numerado e uso semântico por step. Swipe verificável: tabela de combinações aprovadas em §3.5 com valores de contraste explícitos (21.0, 13.7, 8.4, 11.2). Isso é **fonte primária operacionalizável** — é ouro dentro do ouro.

**2. §11 Tokens — Referência completa como artefato de implementação**
Playbook concreto: o bloco CSS em §11 é um swipe direto, sem fricção — copia, cola, funciona. Framework explicado: separação em camadas (âncoras → escalas tonais → semânticos → tipografia → raios → espaçamento → elevação) reflete arquitetura de token real. Swipe verificável: os imports de Google Fonts com parâmetros exatos (opsz, wght ranges) em §11 são fonte primária executável, não aspiracional. Trindade completa: Playbook + Framework + Swipe presentes.

**3. §12 Acessibilidade — Especificação com critério normativo explícito**
Playbook concreto: §12.1 cita WCAG AA/AAA com thresholds numéricos (4.5:1, 3:1) e aponta §3.5 como fonte dos pares aprovados — rastreável. §12.2 especifica ring exato (4 px, `--halo-orange-15`) em vez de "adicione um estado de foco". §12.3 dá o número (44×44 px). §12.4 dá o limite de tempo (300 ms) e respeita `prefers-reduced-motion`. Cada sub-seção é norma com número, não doutrina vaga. Curadoria > volume aqui.

---

## 5 Fraquezas / Gaps

### Visuais (≥2)

**1. Badges com cores estranhas ao sistema — §9.4 — MERDA (contradição constitucional)**
`badge--success` usa `#E9F4EE` (background) e `#0F5132` (foreground). `badge--danger` usa `#FCE7E0` e `#8B2A0E`. Nenhum desses seis valores existe nas 5 âncoras nem nas escalas tonais de §3.2 e §11. O próprio §3.1 declara: *"nunca cores estranhas ao sistema"*. O §1.i (Princípio i — Restrição é estilo) é a convicção fundadora do Halo — e §9.4 a viola com verde floresta e bordô sem mencionar nem justificar. Isso não é detalhe: é o sistema contradizendo sua própria constituição sem blind test nem nota de rodapé. Se Pareto ao Cubo existe para isso, esse é o item do **0,8% que destrói o argumento inteiro**.

**2. §3.5 Combinações aprovadas — valores de contraste sem fonte primária verificável — BRONZE**
A tabela lista razões precisas (21.0, 13.7, 8.4, 11.2, 11.5) mas não cita a ferramenta de cálculo, não referencia o spec WCAG 2.1/2.2, e não apresenta o método (luminância relativa com fórmula ou calculadora). Isso faz do dado uma **afirmação**, não uma fonte primária. Um auditor externo não consegue reproduzir o cálculo sem inferir os parâmetros. Para ser ouro, §3.5 precisaria de uma linha: "Calculado via [ferramenta] contra WCAG 2.1 §1.4.3".

### Estruturais (≥2)

**3. §13 Changelog — placeholder com verniz de release note — BRONZE**
"v1.0.0 — Abril 2026: Lançamento inicial. 5 cores âncora · 3 escalas tonais · 9 tokens semânticos..." é uma lista de contagem, não um changelog. Changelog real tem: (a) decisão que motivou cada escolha, (b) o que foi considerado e descartado, (c) breaking changes para adotantes futuros. Isso aqui é um bullet de README renomeado. Sem rigor de versionamento, qualquer v1.1 que vier não terá contexto de por que o v1.0 fez o que fez. **Volume sem playbook = ruído.**

**4. §10 Padrões de aplicação — seção mais crítica, menos curada — BRONZE**
§10 contém os padrões de uso real (layout, hero, navegação ativa, densidade) mas está documentada como prescrição sem contexto: "sempre", "nunca", sem exemplo de antipadrão, sem referência cruzada para os componentes de §9. §10.2 (Hero pattern) lista 5 passos mas não mapeia quais tokens usar em cada step — o implementador precisa inferir de §9 e §11 por conta própria. A Trindade quebra aqui: tem Framework (regra) mas falta o Swipe (fragmento HTML/CSS copiável) e falta o Playbook ("quando esta decisão se aplica vs. quando não").

**5. §4 Tipografia — `--font-display` e `--font-body` idênticos — gap estrutural silencioso — PRATA**
§4.1 define dois tokens distintos (`--font-display` e `--font-body`) mas ambos apontam para `"Bricolage Grotesque"`. Não existe diferenciação real entre os dois no §11. Isso cria confusão semântica: o token implica hierarquia de família mas a implementação é idêntica. Ou o sistema precisa de famílias realmente distintas (e deve declarar qual peso/variação optical size pertence a qual token), ou os dois tokens devem ser colapsados em um. Da forma atual, o implementador não sabe quando usar um vs. o outro além do nome.

---

## Análise Pareto ao Cubo (13 seções + sub-seções do Halo)

- **0,8% genialidade**: §3 (Cor) — é a seção que justifica a existência do sistema; se falhar, tudo falha; tem Trindade mais completa do documento + é a única com curadoria de restrição real. §11 (Tokens) como artefato de implementação direto, sem fricção, com escalas completas e imports executáveis.

- **4% excelência (~3 seções)**: §12 (Acessibilidade) — normas com números; §6 (Raios) — escala de 7 passos com semântica clara, regra "nunca raio zero" operacionalizável; §9.1 (Botões) — variantes, tamanhos, estados todos documentados com valores explícitos, sem ambiguidade.

- **20% impacto (~5 seções)**: §5 (Espaçamento), §7 (Elevação), §4 (Tipografia — exceto o gap do §4.1), §9.2 (Inputs), §10.3/10.4 (regras de Solar e navegação ativa).

- **80% volume**: §8 (Iconografia) — lista 24 ícones por nome sem referência de biblioteca ou export real; §10.1 (Layout dashboard) — ASCII art sem grid spec completa; §13 (Changelog) — placeholder; §9.5–9.12 (componentes menores) — documentação inconsistente, alguns com Swipe, outros apenas com regras soltas; §2 (Marca) — seção válida mas mínima, sem guia de misuse.

---

## 3 Melhorias propostas (visuais E estruturais)

**1. Corrigir §9.4 Badges — criar variantes semânticas dentro do sistema de tokens existente**
As variantes `--success` e `--danger` precisam ser derivadas das 5 âncoras ou eliminadas. Opção concreta para v1.1: `badge--success` usa `--halo-orange-15` / `--halo-orange-80` (já existente, já aprovado em §3.5); `badge--danger` usa `--halo-navy` / `--halo-orange` (par Eclipse/Solar já aprovado). Se a semântica verde/vermelho for inegociável para o produto, o sistema precisa declarar **explicitamente** que esses tokens são exceções com justificativa de UX — e adicioná-los ao §3 como extensão formal, não escondê-los no §9.

**2. Adicionar coluna "fonte" e "ferramenta" em §3.5 + vincular §12.1 à mesma tabela**
Uma linha de rodapé basta: "Calculado com APCA / WebAIM Contrast Checker contra WCAG 2.1 §1.4.3, verificado em [data]." Isso transforma afirmação em fonte primária verificável. Simultaneamente, §12.1 deve referenciar §3.5 explicitamente em vez de afirmar genericamente que "todo par atende WCAG AA". Self-validation exige rastreabilidade, não apenas confiança.

**3. Reescrever §13 com estrutura de changelog real e adicionar Swipe copiável em §10**
§13 v1.1 deve ter: decisões-chave (por que Bricolage e não Inter?), o que foi descartado (alguma cor cogitada?), e instruções de migração para quem adotar antes da v1.1. Para §10, adicionar pelo menos um fragmento HTML/CSS comentado por padrão (hero, layout, item ativo) — isso completa a Trindade da seção mais usada na implementação e elimina a necessidade de o dev inferir tokens a partir do spec.

---

## Veto Alan (curadoria)

Itens que Alan barra para produção até v1.1 corrigir:

1. **§9.4 `badge--success` e `badge--danger`** — cores `#0F5132`, `#E9F4EE`, `#8B2A0E`, `#FCE7E0` violam §3.1 ("nunca cores estranhas ao sistema") e §1.i (Restrição é estilo). Qualquer implementação que consuma esses tokens está fora do sistema Halo por definição. **BLOQUEADO até derivação formal ou declaração de extensão.**

2. **§13 Changelog como placeholder** — sem rigor de versionamento, qualquer v1.1 sem contexto de decisões do v1.0 é um sistema sem memória. Não é falha visual, é falha estrutural de governança. **BLOQUEADO para adoção em time multi-desenvolvedor.**

3. **§3.5 sem fonte primária** — valores de contraste não rastreáveis não são auditáveis. Em contexto de produto com requisito de acessibilidade (enterprise, gov, saúde), isso é risco legal, não apenas estético. **BLOQUEADO para produtos com requisito WCAG formal.**

---

*Gravação confirmada. Alan Nicolas — Roundtable Halo DS v1.0 · Abril 2026.*
