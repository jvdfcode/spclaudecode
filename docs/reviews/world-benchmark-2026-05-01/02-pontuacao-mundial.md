# Pontuação Mundial — SmartPreço vs Benchmark Global

**Data:** 2026-05-01
**Owner do relatório:** Pedro Emilio Ferreira
**Orquestrador:** Orion (@aiox-master)
**Painel de avaliadores:** Aria (@architect), Uma (@ux-design-expert), Alfredo Soares, Thiago Finch
**Inputs:** `01-benchmark-mundial.md` (10 concorrentes mundiais via @analyst Alex)

---

## NOTA FINAL CONSOLIDADA: **4.2/10** (nível mundial)

| # | Dimensão | Avaliador | Peso | Nota | Contribuição |
|---|----------|-----------|:----:|:----:|:------------:|
| 1 | Arquitetura técnica & produto | Aria (@architect) | 30% | **4.6/10** | 1.38 |
| 2 | UX/UI/Design system | Uma (@ux-design-expert) | 20% | **5.2/10** | 1.04 |
| 3 | GTM/Pricing/Business model | Alfredo Soares | 30% | **3.6/10** | 1.08 |
| 4 | Funil/Conversão/Copy | Thiago Finch | 20% | **3.4/10** | 0.68 |
| | **MÉDIA PONDERADA** | | 100% | **4.18/10** | |

> **Pesos justificados:** Técnico e Comercial pesam 30% cada (são os 2 motores do produto). UX e Funil pesam 20% cada (são amplificadores: sem motor não importam, mas com motor multiplicam).

---

## Veredito em 1 frase

**SmartPreço é um produto com fundação técnica decente (stack moderno + CI maduro) e ratio Loss Aversion estruturalmente excepcional (12.6:1, raríssimo no mercado), mas opera em maturidade comercial pré-MVP de mercado: pricing global mais agressivo do mundo ($8/mês) sem ICP nomeado, sem comunidade, sem funil público — ranking 4.2/10 contra benchmark mundial reflete que o produto está pronto, o NEGÓCIO ainda não.**

---

## Onde SmartPreço se posiciona globalmente

```
NÍVEL MUNDIAL (escala 0-10)
                                                                  
0      2      4      6      8      10                             
|------|------|------|------|------|                              
                                                                  
                    ▲ SmartPreço (4.2)                            
              ▲ Hunter Hub (~5.5 inferido BR)                     
                          ▲ Sellerboard (~7.5)                    
                                ▲ Jungle Scout (~8.0)             
                                       ▲ Helium 10 (~8.5)         
                                       ▲ Pricefx Enterprise (~9.0)
```

**Tier:** SmartPreço está no tier **"Produto MVP funcional, negócio em validação"** — mesmo tier de SaaS pré-Series A do mundo todo. Para subir para tier Sellerboard (bootstrapped 14k sellers), precisa fechar R1+R2+R3 do roadmap de viabilidade (já documentado).

---

## Notas detalhadas por dimensão

### 1️⃣ Arquitetura técnica & produto — **4.6/10** (Aria)

| Sub-dim | Peso | Nota |
|---------|:----:|:----:|
| Stack moderna | 15% | 7/10 |
| Robustez OAuth/integração | 25% | 3/10 |
| Sustentabilidade scraping/API | 20% | 2/10 |
| Arquitetura de dados | 20% | 6/10 |
| DevOps/observability | 20% | 6/10 |

**Veredito Aria:** Stack state-of-the-art (Next.js + Supabase + Vercel), CI maduro com Lighthouse a11y enforced, RLS correto, rate limit atomico via advisory locks. **MAS:** advisory lock OAuth nunca executa em prod (race condition ATIVA), scraping HTML com seletores frágeis, 26 categorias hardcoded sem health check, refresh_token texto plano. Comparado a Sellerboard (8+ anos de iteração de produção) está 3-4 anos atrás em maturidade de integração; comparado a Helium 10 ($1B valuation), distância é de geração tecnológica.

**Top 3 gaps técnicos:** (1) fix advisory lock + state CSRF + criptografia refresh_token; (2) eliminar scraping HTML + backoff exponencial; (3) detecção de drift de taxas + fonte única de truth.

---

### 2️⃣ UX/UI/Design system — **5.2/10** (Uma)

| Sub-dim | Peso | Nota |
|---------|:----:|:----:|
| Design system maturity | 20% | 7/10 |
| Funil público (landing → calc → conversão) | 25% | 2/10 |
| Dashboard UX | 25% | 5/10 |
| Mobile-first / responsividade | 15% | 6/10 |
| Acessibilidade & i18n | 15% | 6/10 |

**Veredito Uma:** Halo DS v1.1 é ativo real — tokens canônicos (Bricolage Grotesque + Instrument Serif + JetBrains Mono, navy + laranja, escala tonal coerente). É design system mais formal que muitos concorrentes diretos (Nubimetrics, Hunter Hub). **MAS:** funil público inexistente (page.tsx faz redirect), dashboard não mostra "1 número" (lucro real) à la Sellerboard, placeholder "+R$ 0,00" hardcoded em /calculadora-livre destrói credibilidade da promessa Loss Aversion antes do usuário calcular.

**Top 3 gaps UX:** (1) landing pública em `/`; (2) dashboard com KPI lucro real above-the-fold; (3) remover placeholder "+R$ 0,00".

---

### 3️⃣ GTM/Pricing/Business model — **3.6/10** (Alfredo Soares)

| Sub-dim | Peso | Nota |
|---------|:----:|:----:|
| Pricing strategy global | 25% | 6/10 |
| ICP/posicionamento | 25% | 2/10 |
| Funil de aquisição (GTM) | 20% | 3/10 |
| Modelo de monetização | 15% | 4/10 |
| Defensabilidade competitiva | 15% | 3/10 |

**Veredito Alfredo:** Pricing entry global mais agressivo do mundo ($8/mês) em nicho que nenhum player global cobre — vantagem real, defensável por 12-24 meses. **MAS:** ICP em estado TEMPLATE (zero entrevistas), Mercado Ads inviável (CAC:LTV 1:0.2), founder solo com 4-6h/semana, zero comunidade construída contra Helium 10/Pacvue ($1B valuation pode entrar LATAM em 12-24 meses). Sellerboard saiu de 0 a 14k sellers bootstrapped focando em "1 número"; SmartPreço tem 0 sellers pagantes confirmados.

**Top 3 gaps comerciais:** (1) executar 5 entrevistas em 14 dias; (2) migrar para Trial 14d híbrido; (3) plantar comunidade nos 3 grupos FB ML.

---

### 4️⃣ Funil/Conversão/Copy — **3.4/10** (Finch)

| Sub-dim | Peso | Nota |
|---------|:----:|:----:|
| Headlines (Loss Aversion 2.5:1) | 25% | 3/10 |
| Funil de conversão público | 25% | 1/10 |
| Lead magnet (/calculadora-livre) | 20% | 6/10 |
| Copy de pricing/upgrade | 15% | 2/10 |
| Instrumentação/tracking | 15% | 7/10 |

**Veredito Finch:** Ratio Loss Aversion 12.6:1 (M5) é raríssimo — vendedor ML perde R$1.064-1.520/mês sem ferramenta vs R$59 da assinatura. Produto deveria estar vendendo sozinho. **MAS:** funil público em estado embrionário — `redirect('/dashboard')` na home é buraco negro, headline /precos é feature-first, calculadora é beco sem saída (sem captura email + nutrição). Hunter Hub (concorrente BR) com Loss Aversion mais fraca está vencendo no copy. Helium 10 cresceu via podcast 500 episódios + Chrome Extension free + Academy.

**Top 3 gaps funil:** (1) home pública com headline Loss Aversion + CTA; (2) reescrever headline /precos com número concreto; (3) conectar calculadora a captura email + nutrição.

---

## Comparação 1-a-1 com top 3 mundiais

### vs Helium 10 ($99/mês, $1B valuation, 2M+ usuários)

| Dimensão | SmartPreço | Helium 10 | Gap |
|----------|:----------:|:---------:|:---:|
| Stack | 7/10 | 8/10 | -1 |
| Integração marketplace | 3/10 | 9/10 | **-6** |
| GTM/Comunidade | 3/10 | 9/10 | **-6** |
| Funil/Aquisição | 3/10 | 9/10 | **-6** |
| Pricing competitivo | 6/10 | 7/10 | -1 |

**Resumo:** SmartPreço perde por geração inteira em GTM e integração, paridade em stack moderna. Vantagem real: pricing 8% do Helium 10 em nicho que ele não cobre (ML).

### vs Sellerboard ($15/mês, bootstrapped, 14k sellers)

| Dimensão | SmartPreço | Sellerboard | Gap |
|----------|:----------:|:-----------:|:---:|
| Stack | 7/10 | 7/10 | 0 |
| UX "1 número" | 5/10 | 9/10 | **-4** |
| Robustez OAuth | 3/10 | 8/10 | **-5** |
| ICP cristalino | 2/10 | 9/10 | **-7** |
| Pricing | 6/10 | 7/10 | -1 |

**Resumo:** SmartPreço empata em stack e está 50% mais barato. Perde GRAVE em ICP, UX de valor imediato e robustez de integração — exatamente as 3 coisas que Sellerboard refinou em 8 anos para virar benchmark mundial de "profit dashboard barato".

### vs Nubimetrics (~R$310/mês, parceiro oficial ML)

| Dimensão | SmartPreço | Nubimetrics | Gap |
|----------|:----------:|:-----------:|:---:|
| Stack | 7/10 | 7/10 | 0 |
| Acesso a dados ML | 3/10 (scraping) | 9/10 (parceiro oficial) | **-6** |
| Market intelligence | 2/10 | 8/10 | **-6** |
| Margin calc nativo | 7/10 | 5/10 | **+2** |
| Pricing | 6/10 | 5/10 | +1 |

**Resumo:** Categorias parcialmente diferentes — Nubimetrics é market intelligence completa, SmartPreço é margin calculator focado. SmartPreço pode coexistir como complemento (não competidor direto) se posicionar narrativa correta.

---

## Top 5 ações priorizadas para subir 4.2 → 6.5+/10 em 90 dias

### P0 — Fechar gaps técnicos críticos (subir Aria 4.6 → 6.5)
1. **VIAB-R1-1** — Fix race condition OAuth (já criada como story Draft)
2. **VIAB-R1-3** — Backoff exponencial + plano fallback (já criada)
3. **Novo** — Eliminar scraping HTML em `ml-proxy/route.ts`

### P0 — Fechar gap de funil público (subir Finch 3.4 → 6.0+, Uma 5.2 → 6.5+)
4. **VIAB-R1-2** — Landing pública em `/` com headline Loss Aversion (já criada)
5. **Novo** — Reescrever headline /precos + remover badge "Posicionamento — Liderança em Produto"

### P1 — Validar ICP (subir Alfredo 3.6 → 5.5)
6. **R2 do roadmap original** — 5 entrevistas ICP em 14 dias (não delegável — Pedro)

### P1 — Migração Trial 14d (subir Alfredo 3.6 → 5.5+, Finch 3.4 → 6.0+)
7. **VIAB-R3** (originalmente em backlog) — adicionar variante Trial 14d em pricing-experiment.ts

### P2 — Construção de comunidade (subir Alfredo 3.6 → 6.0+ em 6 meses)
8. **Novo** — Plantar founder em 3 grupos FB ML; conteúdo value-first 2x/semana

---

## Cenários projetados

| Cenário | Ações | Nota projetada (90 dias) | Tier mundial |
|---------|-------|:------------------------:|:------------:|
| **Inação** | nenhuma | 3.5/10 (decai com calculadora oficial ML pegando tração) | Pré-MVP |
| **R1 técnico apenas** | VIAB-R1-1/2/3 | 5.0/10 | Produto funcional |
| **R1 + R2 ICP** | + 5 entrevistas | 5.8/10 | Produto-mercado early |
| **R1 + R2 + R3** | + Trial 14d + headline /precos | 6.5/10 | **Tier Sellerboard early** |
| **R1+R2+R3+comunidade** | + 3 grupos FB + conteúdo | 7.2/10 (em 6 meses) | **Tier Sellerboard maduro** |

---

## Risk Matrix vs Benchmark Mundial

|  | Impacto BAIXO | Impacto MÉDIO | Impacto ALTO |
|--|---|---|---|
| **Prob ALTA** | — | — | **Calculadora oficial ML evolui (F3)** |
| **Prob MÉDIA** | — | Hunter Hub melhora copy | **Helium 10/Pacvue entra LATAM** |
| **Prob BAIXA** | — | Sellerboard adiciona ML | Nubimetrics adiciona margin calc |

**Riscos top 3 do nível mundial:**
1. **Calculadora ML evolui:** ML pode adicionar margin calc nativo que mata SmartPreço — diferenciar via profundidade (cenários, simulador, histórico)
2. **Pacvue entra LATAM:** $1B valuation, 12-24 meses — janela para construir comunidade ANTES disso
3. **Nubimetrics expande escopo:** parceiro oficial ML pode adicionar margin calc e capturar mercado por inércia da base instalada

---

## Próximos passos imediatos

1. **Pedro Emilio review** este relatório + 01-benchmark-mundial.md
2. **@po validar VIAB-R1-1/2/3** (já em Draft) — transição Draft → Ready
3. **@dev implementar VIAB-R1-1** (race condition é P0 ATIVA em prod)
4. **Pedro agendar 5 entrevistas ICP** (R2, não delegável, 7.5h em 14 dias)
5. **Após R1+R2:** sessão de planejamento R3 + comunidade

---

## Sources do painel

- Aria (@architect): inspeção de `ml-api.ts`, `ml-proxy/route.ts`, migration 009, `ci.yml`, `lighthouserc.json`
- Uma (@ux-design-expert): inspeção de `page.tsx`, `calculadora-livre/`, `dashboard/`, Halo DS tokens
- Alfredo Soares: M1, M2, M4, M8b findings + experiência Loja Integrada/G4
- Finch: M6 (headlines auto-escritas), M5 (Loss Aversion 12.6:1), inspeção páginas públicas

Benchmark mundial: 30 sources verificadas em 2026-05-01 (Capterra, G2, Crunchbase, Tracxn, GetLatka + sites oficiais).

---

*Relatório consolidado por Orion (@aiox-master) em 2026-05-01. Owner: Pedro Emilio Ferreira. Painel: Aria + Uma + Alfredo + Finch + Alex (benchmark).*
