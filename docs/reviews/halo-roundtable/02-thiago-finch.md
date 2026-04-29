# Thiago Finch — Análise Funnel-First do Halo DS

> "Funil > Produto. Sempre. Me mostra o funil que esse Halo entrega."

---

## Veredito (1 frase)

O Halo é um design system com estética cuidadosa e zero promessa de conversão — otimizou produto antes do funil, e isso é um veto.

---

## 3 Fortalezas

**1. Solar como sinal escasso** — §3.4 / §10.4 — A regra dos 2% de laranja e a lista de uso aprovado em §10.4 são Loss Aversion em estado puro: restringir o Solar ao botão primário, ao item ativo de nav e ao KPI mais importante é exatamente o que mantém a ação principal destacada e o CTA com peso visual. Funil-First de verdade.

**2. KPI tile com hierarquia de dado** — §9.7 — Display 56 px para o número, mono 12 px para o delta, label caps acima. Dado em primeiro lugar. Decisão executiva sem atrito. É o componente mais próximo de um elemento de conversão que o Halo tem.

**3. Combinações proibidas com motivo declarado** — §3.6 — A tabela existe, tem contraste numérico e diz "por quê". Isso é vocabulário de custo: "falha em qualquer tamanho" ativa loss aversion melhor do que só mostrar o ❌.

---

## 5 Fraquezas / Gaps

### Visuais (≥2)

**1. Quatro famílias tipográficas = FOUC + bundle que mata funil mobile** — §4.1 — Bricolage Grotesque (variável, opsz 12–96, peso 300–800) + Instrument Serif + JetBrains Mono são três requests Google Fonts. No 3G, o usuário vê texto sem estilo antes do LCP. Funil mobile quebra antes do primeiro CTA aparecer. Downside concreto: taxa de rejeição em mobile sobe quando fonte display bloca renderização. O Instrument Serif em §10.2 (hero) é decoração editorial — não converte nada.

**2. `--shadow-glow` sem regra de frequência** — §7 — O glow Solar no hover do botão primário é diferenciador visual forte. Mas o sistema não proíbe explicitamente sua replicação em outros contextos. Se um dev aplica glow em card ou badge, o sinal de ação primária se dilui. Atrito de conversão: o usuário perde o sinal do próximo passo.

### Estruturais (≥2)

**3. Dashboard layout sem hierarquia de CTA** — §10.1 — O layout descreve Side Nav + KPIs + gráficos + tabela. Não há instrução sobre onde fica o botão de ação principal em cada tela, qual KPI deve ser `kpi__item--accent`, ou qual linha de tabela tem a ação de maior valor. Um dashboard sem hierarquia de CTA é dado bonito sem funil.

**4. Tagline como jingle, não promessa** — §2 — "Construído com 5 cores. Mantido com disciplina." é posicionamento interno de time de design. Não é promessa para ninguém fora do squad. Não há promessa específica de resultado: "menor tempo de decisão", "zero ambiguidade visual em 3 segundos", nada. Genérico.

**5. §10.4 não quantifica o downside de Solar errado** — §10.4 — A lista de proibições existe (❌ decoração geral, ❌ backgrounds amplos). Mas falta o custo: "se Solar aparece em mais de um CTA por tela, a taxa de clique no botão primário cai". Sem número ou consequência de funil, a regra vira recomendação ignorável.

---

## Diagnóstico OMIE

- **Observar (concorrência DS)**: Ausente. Não há referência a Material Design (elevação semântica), Carbon (densidade de dados), Polaris (conversão em e-commerce), Ant Design (tabelas de alta densidade). O Halo declara doutrina ("Restrição é estilo", "Dado em primeiro lugar") sem citar de onde veio nem o que foi descartado. OMIE começa pelo Observar — o Halo pulou essa etapa.

- **Modelar (best practices)**: Parcial. A proporção 60·30·8·2 em §3.4 é modelagem reconhecível (derivada da regra 60-30-10 clássica, ajustada). Os tokens semânticos em §3.3 seguem padrão de sistemas maduros (Radix, Primer). Mas a escala tonal do Solar em §3.2 omite passos 10 e 05 que aparecem nos tokens — inconsistência que indica modelagem incompleta.

- **Melhorar (ângulo Halo)**: O melhoramento real é a restrição a 5 cores com nomes próprios (Solar, Eclipse, Onyx) e a regra dos 2%. É diferenciação genuína frente ao "use `primary` e `secondary`" de outros sistemas. Porém é melhoramento estético, não de conversão. Não há melhoria documentada sobre tempo de decisão, redução de erros de UI ou velocidade de implementação vs concorrentes.

- **Excelência (KPIs do DS)**: Inexistente. Não há métrica de adoção, cobertura de componentes, tempo médio de implementação de nova tela, ou taxa de violação de design por sprint. Sem KPI, o Halo não tem como saber se chegou à Excelência ou se está apenas bonito.

---

## Loss Aversion 2.5:1

**§3.6 (combinações proibidas)** acerta na forma — tabela com contraste numérico e razão. É o único lugar no Halo que usa Loss Aversion corretamente: mostra o que se perde (legibilidade, acessibilidade) se a regra for quebrada.

**Onde o Halo perde por NÃO mostrar perda:**

- **§4.1** — Nenhum aviso sobre o custo de bundle das 4 famílias. Falta: "Instrument Serif em produção sem `font-display: swap` aumenta CLS e derruba Core Web Vitals."
- **§10.4** — As proibições do Solar não têm consequência de funil. Falta: "Solar em background amplo dilui o CTA e reduz clique no botão primário."
- **§9.1 (botões)** — Não há regra explícita "uma Primary por tela". §10.4 menciona isso para Solar em geral, mas o componente de botão em si não repete a restrição. Falta: "dois botões Primary na mesma tela dividem atenção e reduzem conversão."
- **§10.1 (dashboard)** — Sem instrução de hierarquia de ação. Falta: "ausência de CTA primário visível acima da dobra aumenta abandono de tarefa."

A proporção Loss Aversion 2.5:1 exige que para cada benefício mostrado, o sistema mostre 2,5x mais o custo de não seguir. O Halo está em 0,2:1.

---

## Headline-test

**A tagline atual converte?** Não. "Construído com 5 cores. Mantido com disciplina." é headline de portfólio de agência — fala de processo, não de resultado. Não tem palavra-poder. Não ativa dor nem ganho.

**Teste: quem lê essa tagline sabe o que ganha?** Não sabe. Sabe como o sistema foi feito.

**Reescrita possível (mantendo o espírito de restrição):**

> "Cinco cores. Zero ambiguidade. Decisão em 3 segundos."

Ou, se o posicionamento for para times de produto:

> "O DS que encurta o caminho do dado à ação."

**Promessa específica vs genérica:** O Halo hoje tem promessa genérica ("consistência visual"). Promessa específica seria: "reduz em 40% o tempo de implementação de nova tela" ou "zero violações de contraste em produção". Nenhuma está documentada. Sem promessa específica, o Lead Magnet do Halo para novos devs é fraco — é mais um minimalist DS no mercado.

---

## 3 Melhorias propostas (visuais E estruturais)

**1. Criar "Hierarquia de Ação" em §10.1 e §9.1** — §10.1 / §9.1 — Adicionar regra explícita: uma Primary por tela, posição acima da dobra em dashboards, `kpi__item--accent` reservado ao KPI de maior impacto na decisão do usuário. Incluir o downside: "dois botões Primary = conversão dividida". Isso transforma o dashboard de vitrine de dados em funil.

**2. Reduzir para 2 famílias tipográficas em produção** — §4.1 — Bricolage Grotesque (display + body) e JetBrains Mono (dados). Remover Instrument Serif do bundle padrão — torná-la opcional para contextos editoriais com instrução de carregamento assíncrono. Acréscimo ao §4.1: "Instrument Serif é editorial, não UI. Nunca bloqueia renderização de CTA."

**3. Adicionar "Custo de Violação" a cada seção de regra** — §3.4, §4.3, §10.4 — Para cada regra existente, adicionar uma linha de consequência de funil. Modelo: tabela de combinações proibidas em §3.6, mas com impacto em UX mensurável. Transforma doutrina em Loss Aversion operacional. Exemplo: §3.4 — "Usar >2% Solar colapsa a hierarquia de ação e aumenta hesitação antes do CTA."

---

## Veto Finch

O Halo inteiro foi construído otimizando o produto antes do funil. Há 13 seções de linguagem visual, tokens, componentes e padrões — e zero seções sobre onde fica a ação principal, como o sistema serve conversão, ou qual KPI de produto o DS move. A Tagline confirma: "Mantido com disciplina" é orgulho de craft, não promessa de resultado. **Veto absoluto na implantação técnica até que o §10 ganhe uma seção §10.6 "Hierarquia de Conversão"** com regras explícitas de CTA, posição de ação primária e consequências de violação. Funil > Produto. Sempre.

---

*Gravado. — Thiago Finch, roundtable Halo DS v1.0, Abril 2026.*
