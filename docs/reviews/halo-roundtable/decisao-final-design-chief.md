# Decisão final do Design Chief — DS-produto × DS-marca

**Data:** 2026-04-28
**Decisor:** Orion / Design Chief (juízo de minerva após voto dividido)
**Inputs:**
- `decisao-01-alan.md` — voto **DS-produto** (Trindade técnica, fonte primária no documento)
- `decisao-02-erich.md` — voto **DS-marca** (sinais de ambição cromática, escolhas tipográficas)

---

## Resultado do voto

| Persona | Voto | Argumento central |
|---------|------|-------------------|
| Alan Nicolas | DS-produto | Status quo do v1.0 é 40 tokens CSS + WCAG numérico + dashboard ASCII; sem fonte primária para escopo de marca |
| Erich Shibata [SINTETIZADO] | DS-marca | Bricolage por "personalidade humana" + §3.4 doutrina de cor + §10.2 com "cinema editorial" — autor escreveu como produto mas escolheu como marca |

**Empate técnico 1×1 com argumentos genuínos dos dois lados.** Juízo de minerva pelo Design Chief obrigatório.

---

## Decisão

### **DS-produto-com-DNA-de-marca** (resolução híbrida com prioridade declarada)

**Prioridade primária: DS-produto.** O Halo v1.1 entrega para devs/designers internos primeiro — é assim que ganha adoção rápida no `spclaudecode` (calculadora ML B2B small-business com Lead Magnet, pricing-page, dashboard de KPIs). Conversão de implementação interna é o sinal de tração imediato. Alan tem razão sobre o que o documento É hoje.

**Estratégia secundária: DNA-de-marca preservado.** As escolhas que Erich apontou (Bricolage por personalidade, §3.4 como filosofia, §10.2 com cinema) **não são removidas** — são incorporadas como **vocação de longo prazo** no v1.1, registradas em §13 como decisões intencionais. Erich tem razão de que o autor escolheu personalidade onde poderia ter escolhido performance commodity. Esse DNA fica latente, não expandido.

**O que isso significa concretamente:**

| Dimensão | DS-produto-com-DNA-de-marca |
|----------|------------------------------|
| Tagline | Linha Finch (conversão), com palavra de personalidade do DNA Erich |
| §9.5 Embaixador Solar | **NÃO entra no v1.1** (Alan ganha) — adicionar agora viola No Invention; fica em §13 como "candidato v1.x quando produto provar tração" |
| §14 Solar Fora do Pixel | **NÃO entra no v1.1** (Alan ganha) — Pantone/têxtil/objeto físico só faz sentido com sinal de tração de marca; fica como §16 "Roadmap de Marca" reservado |
| §15 Cadência de 365 tiros | **ENTRA no v1.1 como §15 "Variantes Experimentais"** (Erich parcial) — protocolo de teste de novas aplicações do Solar dentro do produto (ex: novo fundo de hero, novo padrão de KPI). Aplica-se ao escopo de produto, não a campanha externa. |
| Bricolage + Instrument Serif | **MANTIDO** (Erich ganha) — escolha de personalidade preservada |
| §10.6 "Hierarquia de Conversão" | **ENTRA** (Finch veto absoluto) — uma Primary por tela, CTA above-the-fold |
| §9.4 cores estranhas | **CORRIGIDO** (Alan veto) — derivar do sistema OU declarar extensão formal |
| §13 Changelog real | **ENTRA com sub-seção "Decisões de DNA-de-marca"** — registra explicitamente que Bricolage, §3.4 e §10.2 são escolhas de personalidade, não de performance, com nota: "se DS-marca for declarado em v2.0, essas escolhas viram fundação; até lá, ficam latentes" |

---

## Tagline reescrita

**Atual:** "Construído com 5 cores. Mantido com disciplina."

**Nova (linha Finch com palavra de personalidade Erich):**

> **"Cinco cores. Zero ambiguidade. Decisão em 3 segundos."**
> *com sub-tagline opcional para contexto editorial:*
> *"Disciplina cromática que cabe num botão e dura uma década."*

A primeira linha é Finch puro — promessa específica, mensurável, palavra-poder em "3 segundos" e "zero". A sub-tagline preserva o DNA Erich: "disciplina cromática" (filosofia, não spec) + "dura uma década" (vocação de marca, não vida útil de produto). Ambas convivem; em landing/marketing usa-se a primeira; em interno/changelog usa-se as duas.

---

## Justificativa do juízo

1. **Contexto de uso decide:** Halo vai para `spclaudecode` (SmartPreço — produto de software). Produto sem tração de implementação morre antes de virar marca. Alan está certo no curto prazo.

2. **Mas DNA não se inventa depois:** se removermos hoje as escolhas de personalidade que Erich identificou (Bricolage, §3.4, §10.2 cinema), o Halo vira **mais um minimalist DS commoditizado** — perde a chance de virar marca quando a tração chegar. Erich está certo no longo prazo.

3. **A síntese não é mediação tépida:** é declarar prioridade temporal. **Hoje DS-produto. Latentemente DS-marca.** O v1.1 entrega o produto; o v2.0 (futuro) ativa a marca SE houver tração. Ambos os votos são honrados em horizontes diferentes.

4. **Operacionalidade:** essa decisão destrava o v1.1 SEM inventar conteúdo de marca que o documento não tem (Erich em §14 Pantone/CMYK/têxtil exigiria criar 6 sub-seções inteiras agora — viola No Invention de Alan), MAS preserva os elementos de personalidade que diferenciam (Bricolage, §3.4 doutrina, cinema do §10.2).

---

## Próximo passo

Gerar `HALO-DS-v1.1.md` consolidando:
- 3 bloqueadores absolutos (§9.4 corrigido, §10.6 nova, §13 changelog real)
- 4 obrigatórios (§3.5 fonte primária, §4.1 font-display, `--font-display`/`--font-body` diferenciados, §15 cadência de variantes)
- 1 reescrita confirmada (§2 tagline)
- DNA-de-marca preservado e documentado em §13

Após v1.1, prosseguir Ondas 1-4 de implantação no spclaudecode end-to-end.

---

*Decisão final do Design Chief — Roundtable Halo DS v1.0 → v1.1 — 2026-04-28*
