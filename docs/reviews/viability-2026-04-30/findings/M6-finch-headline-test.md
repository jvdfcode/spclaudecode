# M6 — @thiago-finch: Headline test

**Specialist:** @thiago-finch (NÃO-MeliDev — Funnel-First)
**Comando:** *headline-test
**Data:** 2026-05-01

## Headlines atuais (capturadas do código)

| Rota | Headline atual | Loss Aversion? | Promessa específica? | Tom |
|------|----------------|----------------|---------------------|-----|
| / | **INEXISTENTE** — `redirect('/dashboard')`, sem landing pública | N/A | N/A | N/A |
| /calculadora-livre | "Descubra em 30 segundos quanto você está perdendo em cada venda no Mercado Livre" | Sim (parcial) — "perdendo em cada venda" ativa medo de perda | Sim — "30 segundos" ancora tempo, "cada venda" ancora frequência | Urgência moderada |
| /precos | "O motor de decisão de preço mais preciso para o Mercado Livre Brasil" | Não — zero custo de não agir, zero perda evocada | Não — "mais preciso" é superlativo genérico sem prova | Institucional / feature-first |

### Diagnóstico rápido

- **Home (/):** Não existe landing pública. Todo tráfego de aquisição que chega no domínio raiz é redirecionado para `/dashboard` (área logada). Isso é um buraco fatal no funil — qualquer campanha paga ou link orgânico apontando para `smartpreco.com.br` perde 100% do potencial de conversão pública.
- **Calculadora-livre:** Melhor headline das três. Usa Loss Aversion ("quanto você está perdendo"), promessa específica ("30 segundos"), e âncora contextual ("cada venda no Mercado Livre"). Nota: 7/10. Pode melhorar com número concreto e amplificação da perda.
- **Preços:** Headline institucional, zero Loss Aversion. "Motor de decisão mais preciso" é linguagem de produto, não de conversão. O vendedor ML não busca "motor de decisão" — busca margem, lucro, parar de perder dinheiro. Nota: 3/10.

## Comparação com concorrentes (OMIE)

| Empresa | Headline | Loss Aversion | Promessa específica |
|---------|----------|---------------|---------------------|
| SmartPreço (calculadora) | "Descubra em 30s quanto você está perdendo em cada venda no ML" | Sim (parcial) — "perdendo" | Sim — "30s", "cada venda" |
| SmartPreço (preços) | "O motor de decisão de preço mais preciso para o ML Brasil" | Não | Não — superlativo vazio |
| Hunter Hub | "Calcule seu lucro real, recupere cobranças indevidas" | Sim — "cobranças indevidas" implica dinheiro perdido | Sim — "lucro real", "recupere" |
| Real Trends | "Precificação dinâmica e gestão multicanal" | Não — feature-first puro | Não — genérico |
| JoomPulse | "Inteligência de mercado para Mercado Livre" | Não — descritivo | Não — categoria, não promessa |
| Nubimetrics | "BI + Big Data para Mercado Livre" | Não — tech-first | Não — siglas, não benefício |

### Análise OMIE

**Observar:** A maioria dos concorrentes usa headlines descritivas/feature-first. Hunter Hub é o único que ativa Loss Aversion ("cobranças indevidas"). O mercado é dominado por copy fraca — oportunidade enorme para quem aplicar Loss Aversion calibrada.

**Modelar:** Hunter Hub mostra que Loss Aversion funciona no nicho ML. "Recupere cobranças indevidas" é forte porque monetiza a perda. SmartPreço já faz isso parcialmente na calculadora.

**Melhorar:** SmartPreço pode superar Hunter Hub com: (1) número concreto de perda, (2) âncora temporal mais agressiva, (3) Loss Aversion 2.5:1 real — ou seja, para cada benefício prometido, 2.5x mais ênfase no custo de não agir.

**Excelência:** KPI alvo = taxa de scroll-to-CTA acima de 60% na calculadora, e CTR do headline-to-form acima de 15%.

## Findings

### Finding 1: Home (/) é um buraco negro de funil
Não existe landing page pública. `redirect('/dashboard')` descarta 100% do tráfego frio. Qualquer investimento em SEO, ads ou link building para o domínio raiz tem ROI zero. Prioridade crítica: criar uma home pública com headline Loss Aversion e CTA para `/calculadora-livre`.

### Finding 2: Headline de pricing é feature-first, não conversion-first
"O motor de decisão de preço mais preciso" fala do produto, não do resultado para o vendedor. Ninguém acorda pensando "preciso de um motor de decisão". Acordam pensando "estou perdendo margem" ou "não sei se estou lucrando". A headline de pricing precisa responder "por que eu pagaria por isso?" com Loss Aversion.

### Finding 3: Calculadora-livre está quase lá, mas falta número concreto
"Quanto você está perdendo" é bom, mas genérico. Loss Aversion 2.5:1 exige especificidade: quanto em reais? Qual a perda média? "R$ 847/mês é o que vendedores ML perdem em média por precificação errada" é 10x mais forte que "quanto você está perdendo".

### Finding 4: Metadata inconsistente prejudica CTR orgânico
A tag OG de `/precos` diz "precificação inteligente para vendedores ML" mas o h1 diz "motor de decisão mais preciso para o ML Brasil". Google mostra a meta description nos resultados — e o usuário chega esperando uma coisa e vê outra. Isso aumenta bounce rate.

### Finding 5: Badge "Posicionamento — Liderança em Produto" na página de preços é ruído
O badge acima do headline de pricing diz "Posicionamento — Liderança em Produto". Isso é linguagem interna de estratégia, não copy de conversão. O vendedor ML não sabe o que é "liderança em produto" e não se importa. Esse espaço deveria ter um badge de prova social ou urgência ("Usado por +500 sellers ML" ou "Economize até R$ 847/mês").

## 3 alternativas de headline com Loss Aversion 2.5:1

### Para /calculadora-livre

#### Alternativa A — Loss Aversion forte
**"Vendedores ML perdem em média R$ 847/mês por erro de precificação. Você está entre eles?"**

- **Justificativa:** Número concreto (R$ 847) ancora a perda. Pergunta retórica força auto-identificação. Loss Aversion 2.5:1 — a perda (R$ 847/mês) é 2.5x mais saliente que o benefício implícito (parar de perder).
- **Headline test:** Passa. Quem lê sabe exatamente o que está em jogo. A pergunta gera urgência sem ser clickbait.
- **Requisito:** Validar o número R$ 847 com dados reais ou usar faixa ("entre R$ 500 e R$ 1.200/mês").

#### Alternativa B — Promessa específica + tempo
**"Em 30 segundos, descubra os R$ 500+ que você deixa na mesa todo mês no Mercado Livre"**

- **Justificativa:** Mantém o "30 segundos" que já funciona. Adiciona número concreto de perda. "Deixa na mesa" é mais tangível que "perdendo". Âncora mensal ("todo mês") amplifica a perda acumulada.
- **Headline test:** Passa. Tempo + dinheiro + frequência. Três âncoras em uma frase.
- **Requisito:** O valor "R$ 500+" deve ser o piso defensável. Melhor pecar por baixo e surpreender no resultado.

#### Alternativa C — Loss Aversion + número concreto + prova social
**"8 em 10 sellers ML não sabem que perdem R$ 600+ por mês em taxas mal calculadas. Calcule o seu em 30s."**

- **Justificativa:** Prova social invertida ("8 em 10 não sabem") + Loss Aversion ("perdem R$ 600+") + CTA direto ("Calcule o seu"). Três camadas de persuasão. Loss Aversion 2.5:1 — a perda (R$ 600+/mês, 8 em 10 sellers) ocupa 2.5x mais espaço cognitivo que o benefício (calcular em 30s).
- **Headline test:** Passa. Específica, acionável, com urgência social.
- **Requisito:** "8 em 10" precisa de fonte ou deve ser suavizado para "a maioria dos sellers ML".

### Para /precos (bônus)

**Alternativa sugerida:** "Pare de precificar no escuro. Veja exatamente onde sua margem está vazando — e corrija hoje."

- "Precificar no escuro" é Loss Aversion (medo de decisão errada).
- "Margem vazando" é metáfora de perda concreta.
- "Corrija hoje" é CTA temporal.
- Substitui o genérico "motor de decisão mais preciso" por linguagem de resultado.

## Veredito + Nota

| Rota | Nota atual | Justificativa |
|------|-----------|---------------|
| / (home) | 0/10 | Não existe. Redirect puro. Buraco fatal no funil. |
| /calculadora-livre | 7/10 | Loss Aversion presente mas sem número concreto. Promessa específica boa (30s). Falta amplificação da perda. |
| /precos | 3/10 | Feature-first, zero Loss Aversion, superlativo genérico sem prova. Badge com linguagem interna. |

**Nota média do sistema de headlines: 3.3/10**

**Prioridades imediatas (ordenadas por impacto no funil):**

1. **CRÍTICO:** Criar home pública com headline Loss Aversion + CTA para calculadora (sem isso, qualquer investimento em aquisição para o domínio raiz é desperdiçado)
2. **ALTO:** Substituir headline de `/precos` — trocar feature-first por resultado-first com Loss Aversion
3. **MÉDIO:** Amplificar headline de `/calculadora-livre` com número concreto de perda (Alternativa A ou C)
4. **BAIXO:** Alinhar metadata OG com headlines renderizadas para consistência SEO

---

*Funil > Produto. Sempre. — Thiago Finch, Funnel-First*
