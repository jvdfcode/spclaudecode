# Decisão Alan Nicolas — Halo é DS-produto ou DS-marca?

> "Bora decidir com base em fonte primária."

---

## Voto

**DS-produto.**

---

## Justificativa em 3 evidências do v1.0

**1. §11 Tokens (referência completa) — bloco CSS copiável com 40+ variáveis de implementação direta**
O documento dedica sua seção mais longa a um artefato de consumo técnico: variáveis CSS com naming semântico em camadas (`--bg`, `--ink`, `--line`), imports do Google Fonts com parâmetros de peso/optical-size exatos, e escalas de token nomeadas por função de UI. Isso é **Trindade de implementador** — Playbook + Framework + Swipe para dev ou designer interno. Nenhuma marca voltada ao consumidor externo constrói 40 tokens CSS como peça central do seu manifesto. Isso prova que o Halo fala com quem constrói, não com quem compra.

**2. §12 Acessibilidade — normas WCAG com thresholds numéricos (4.5:1, 3:1, 44×44 px, 300 ms)**
Quatro sub-seções, cada uma com critério mensurável. Ring de foco em `--halo-orange-15` com 4 px declarado. Limite de animação em 300 ms. Tamanho mínimo de alvo de toque em 44×44 px. Isso é linguagem de **auditoria de produto e conformidade técnica** — não de lifestyle, não de embaixador, não de presença na rua. Marca-consumidor não escreve `prefers-reduced-motion: reduce` no seu manifesto de identidade. Produto B2B com requisito de WCAG formal escreve.

**3. §10 Padrões de aplicação — layout de dashboard com grid de 12 colunas, ASCII art e densidade compacta vs. confortável**
§10.1 entrega um wireframe ASCII de dashboard com side nav Eclipse de 260 px, KPI tiles e tabela. §10.5 define duas densidades de UI (Confortável / Compacta) com valores exatos de padding e gap. O único caso de uso demonstrado no documento inteiro é um **painel interno de dados** — não um site institucional, não uma vitrine, não uma peça de comunicação. O Halo mostrou sua mão aqui: o produto que ele imagina existir é um dashboard de gestão, não uma campanha.

---

## Pareto ao Cubo aplicado à decisão

- **0,8% genialidade do v1.0 está em:** §3 (sistema cromático com proporção 60·30·8·2 e escalas tonais derivadas matematicamente) + §11 (bloco de tokens CSS completo e executável). Esse núcleo serve exclusivamente ao **escopo DS-produto**: é linguagem de implementação, não de branding. Uma marca escolhe Pantone; um sistema de produto escolhe `--halo-orange-15` e explica cada step da escala.

- **80% do volume do v1.0 está em:** §9 (12 componentes — botões, inputs, badges, KPI tile, tabela, timeline, tabs, avatares, toasts, progress bar, calendar, toggle), §5–§8 (escalas de espaçamento, raios, elevação, iconografia). Esse volume é inteiramente coerente com **DS-produto**: são especificações de UI interna, cada uma com estados e variantes para devs. Não existe uma linha de orientação sobre como o Halo aparece em objeto físico, vestuário, OOH ou qualquer superfície fora da tela.

---

## O que essa decisão destrava no v1.1

- **Tagline reescrita na linha de: Finch** — headline de conversão com promessa específica e mensurável. A tagline atual ("Construído com 5 cores. Mantido com disciplina.") é descrição de processo, não promessa de resultado para o implementador. A reescrita correta é na direção de: *"Cinco cores. Zero ambiguidade. Decisão em 3 segundos."* — fala com o dev/designer que precisa de velocidade de implementação, não com o CMO que quer mito de marca.

- **§9.5 Embaixador Solar: não entra no v1.1.** Se o Halo é DS-produto, o embaixador é o componente, não a pessoa. §9.5 Avatares já cobre a UI de representação humana dentro do produto. Adicionar "embaixador de marca" é inventar um escopo que o documento atual não justifica — viola o Princípio iv (Article IV, No Invention da constituição AIOX). A pergunta de Erich sobre âncora física é legítima mas pertence a uma decisão de marca futura, não ao v1.1 de um DS técnico.

- **Outras consequências estruturais:**
  - §13 Changelog real deve registrar decisões técnicas de implementação (por que Bricolage, o que foi descartado, breaking changes para adotantes) — não narrativa de marca
  - §10.6 "Hierarquia de Conversão" (Finch veto) entra como métrica de adoção interna: cobertura de componentes, tempo de implementação, taxa de violação de tokens — KPIs de DS-produto
  - §14 proposto por Erich (Solar Fora do Pixel, Pantone, CMYK, têxtil) não entra no v1.1 — essa adição só se justifica quando o Halo declarar ambição de DS-marca numa versão futura; adicioná-la agora é ouro vs. bronze errado

---

## Veto e blind test

- **Se o Halo decidir ser DS-marca, eu (Alan) vetaria por:** a fonte primária contradiz essa escolha. O documento não contém uma linha sobre presença física, sobre embaixador, sobre ritmo de comunicação externa, sobre métricas de reconhecimento de marca. Não existe uma seção de "tom de voz", não existe diretriz de fotografia, não existe regra de aplicação em outdoor. Declarar DS-marca sem essas camadas é **afirmação sem fonte primária** — o erro que bloqueei em §3.5 com os valores de contraste sem calculadora. Curadoria > volume: para ser DS-marca, o Halo precisaria de conteúdo de marca, e ele simplesmente não tem.

- **Blind test proposto:** pegar os 13 sumários de seção do Halo v1.0 (sem o conteúdo), enviá-los para 5 devs e 5 brand managers sem contexto e perguntar: "Esse documento foi feito para quem?" Se 80%+ dos devs disserem "para mim" e 80%+ dos brand managers disserem "não é para mim", a decisão DS-produto está confirmada com dado externo. Essa é a **self-validation** que o Halo ainda não fez — e que o v1.1 deve registrar em §13 como prova de escopo.

---

*Gravação confirmada. Alan Nicolas — Decisão Rodada 2 (tagline) · Roundtable Halo DS v1.0 · 2026-04-28.*
