# Plano v2 — Análise de Viabilidade SmartPreço (absorve mesa redonda 7 personas)

> ⚠️ **SUPERSEDED — esta versão foi substituída por `00-plano-v3.md` em 2026-05-01.**
> **Razão:** import da squad MeliDev (`squads/melidev/`, commit `4eba5ef`) permitiu trocar "spawn anônimo subagent_type=analyst" por chamada formal a `@melidev-chief` que rota nos 3 specialists ortogonais (`@melidev`, `@meli-strategist`, `@meli-ops`) com `[SOURCE:]` obrigatório por finding. Resolve definitivamente o veto Pedro Valério ("owner anônimo não é auditável").
> **Conteúdo preservado** abaixo para auditoria histórica do roundtable de 7 personas e das 8 mudanças obrigatórias absorvidas.

---

**Data:** 2026-04-30
**Versão:** v2 (absorve roundtable adversarial completo)
**Origem do feedback:**
- 7 reviews individuais em `docs/reviews/viability-2026-04-30/roundtable/01-..07-..md`
- Mesa redonda em `docs/reviews/viability-2026-04-30/roundtable/00-mesa-redonda.md`

---

## Mudanças absorvidas (8 obrigatórias + 3 tensões resolvidas pelo usuário)

### 8 obrigatórias (5+ APROVA na votação)

| # | Mudança | Origem | Como entra no plano v2 |
|---|---------|--------|------------------------|
| 1 | Nomear owner pessoa-física | Pedro Valério | Owner do relatório: **Pedro Emilio Ferreira** (assina e aprova) |
| 2 | Headline test no Bloco M | Finch | Bloco M ponto 6 — comparar headline da landing vs concorrentes |
| 3 | Risco de plataforma / API ML | Alan | Bloco F ponto 5 (substitui ex-F5 cortado) — dependência da `api.mercadolibre.com` |
| 4 | Loss Aversion calibrada vs concorrentes | Finch | Bloco M ponto 5 — custo R$/mês de NÃO usar SmartPreço vs concorrentes |
| 5 | Rubric com faixas para notas X/10 | Pedro | Seção dedicada antes do diagnóstico (rubric única para F+M) |
| 6 | Rollback documentado para invalidação | Pedro | Seção `## Rollback` no fim do relatório |
| 7 | Análise trial 14d vs free tier | Alfredo | Bloco M ponto 4 — testar variantes de pricing/onboarding |
| 8 | Fallback se concorrencia-Q2 estiver vazio | Alan | Pré-condição: se input ausente, analista busca via web (≥3 concorrentes citados) |

### 3 tensões resolvidas (decisão Pedro Emilio)

| # | Tensão | Decisão | Como entra |
|---|--------|---------|------------|
| T1 | Cortar F2/F4/F5 (bronze)? | **CORTAR** | Bloco F passa de 5 → 3 pontos: regras de cálculo (F1), race condition refresh ML (F2 novo), risco plataforma API ML (F3 novo). OAuth scopes / cache 1h / busca 50 → apêndice |
| T2 | Mapeamento de ritual de uso? | **ADICIONAR** | Bloco M ponto 7 — "vendedor abre o app quando? por quê? frequência?" |
| T3 | Comunidade como canal? | **ADICIONAR** | Bloco M ponto 8 — grupos WhatsApp/Facebook ML, eventos (ML Experience, G4) |

### 3 descartadas (com justificativa explícita)

- **JTBD como critério separado** (Raduan+Rony isolados): não absorvido — cabe no test de tese central, não como dimensão própria
- **Mapeamento JTBD separado** (mesma origem): mesma justificativa
- **Paralelizar em 3 analistas** (Tallis isolado, Pedro rejeita): não absorvido — overhead de síntese > ganho de velocidade pra esta análise específica

---

## Spec final do prompt do analista anônimo

### Persona
"Você é especialista sênior em Mercado Livre Brasil + e-commerce SaaS B2B PME. Já lançou 3 ferramentas para vendedores ML, conhece pricing de marketplace por dentro, e mediu adoption real de Nubimetrics, Real Trends, Olist Free, Hub2B."

### Owner do relatório
**Pedro Emilio Ferreira** (assina). O analista é simulação de especialista; a decisão final de viabilidade é de Pedro Emilio.

### Pré-condições
- Ler `docs/business/posicionamento.md`
- Ler `docs/business/ICP-validation-2026-Q2.md` (estado TEMPLATE)
- Tentar ler `docs/business/concorrencia-2026-Q2.md`. **Se TEMPLATE/vazio:** buscar via WebFetch dados públicos de Nubimetrics, Real Trends, Olist Free, Hub2B (≥3 concorrentes com pricing público citado)
- Ler `docs/reviews/prod-roadmap-2026-04-28/06-analyst-alex.md` (não duplicar)

### Rubric das notas X/10 (faixas binárias)

| Nota | Funcional (regras + sustentabilidade) | Mercadológica (ICP + pricing + GTM) |
|------|--------------------------------------|-------------------------------------|
| 9-10 | Regras corretas, validadas vs ML 2026, sem race condition, alinhado com rate limit, defensável vs ML lançar oficial | ICP defensável (nome+sobrenome+canal), pricing tem narrativa, ≥3 concorrentes mapeados, GTM com canal real, headline converte |
| 7-8 | Regras corretas mas algum gap menor (ex: 1 categoria desatualizada) | ICP em validação ativa (entrevistas em curso), pricing testado em A/B, narrativa em construção |
| 4-6 | Regras corretas mas com débitos críticos (race conditions, dependência total ML) | ICP é demografia genérica, pricing é chute, sem canal definido, sem narrativa |
| 1-3 | Regras erradas ou insustentáveis | Sem ICP, sem pricing defensável, sem GTM |

### Bloco F — FUNCIONAL (3 pontos, foco no que importa)

1. **F1 — Regras de cálculo ML 2026** (`src/lib/calculations/costs.ts` + `src/lib/mercadolivre.config.ts`)
   - Comissão Free 0% / Classic 11% / Premium 17% — está correto vs ML 2026?
   - 26 categorias hardcoded (ML_CATEGORY_FEES) — quantas batem? quantas estão desatualizadas?
   - Faixa custo fixo <R$79 (R$6,25/6,50/6,75) — confirmada?
   - Taxa parcelamento (1x 0% até 12x 9.99%) — atual?
   - **Gate binário:** ≥80% das taxas batem com fonte oficial ML pública

2. **F2 — Race condition refresh OAuth ML** (`src/lib/ml-api.ts` + advisory lock migration 009)
   - A solução com `acquire_user_lock()` mitiga refresh paralelo?
   - Cobre ataque concorrente em produção com 100+ users simultâneos?
   - **Gate binário:** advisory lock obtém SCOPE_USER_LOCK por user_id antes de refresh; sem race = PASS

3. **F3 — Risco de plataforma (dependência total api.mercadolibre.com)**
   - O produto inteiro depende de 1 API externa (ML). Se ML mudar pricing de API ou rate limits?
   - Plano de fallback se ML banir IP do Vercel?
   - Plano de fallback se ML lançar calculadora oficial?
   - **Gate binário:** existe plano documentado de fallback para ≥1 dos 3 cenários

### Bloco M — MERCADOLÓGICA (8 pontos, equilibrado funcional/comercial)

1. **M1 — ICP defensável** (`docs/business/ICP-validation-2026-Q2.md`)
   - Tem nome+sobrenome+canal de encontro (grupo, evento, perfil)?
   - 5 entrevistas validadas?
   - **Gate:** ICP com pelo menos 3 vendedores nominados em entrevista

2. **M2 — Pricing R$39/49/59 defensável vs Nubimetrics R$197**
   - Posicionamento entre PME (mid-tier) ou bottom-tier?
   - WTP de PME ML (faturamento R$5-50k/mês) confirmado?
   - **Gate:** ≥3 concorrentes citados com pricing público; faixa SmartPreço justificada

3. **M3 — Concorrência mapeada (Nubimetrics, Real Trends, Olist Free, Hub2B + ≥1 mais)**
   - Diferencial declarado ("scraping ML real + cálculo por tipo anúncio") existe nesses concorrentes?
   - **Fallback se `concorrencia-2026-Q2.md` estiver vazio:** WebFetch público
   - **Gate:** ≥3 concorrentes com pricing + diferencial mapeado

4. **M4 — Free tier 5 SKUs vs Trial 14 dias** (`src/lib/pricing-experiment.ts`)
   - Free tier eterno educa mas converte? Histórico de SaaS B2B PME diz 3-5x menos que trial 14d
   - **Gate:** análise comparativa free vs trial documentada

5. **M5 — Loss Aversion calibrada vs concorrentes**
   - Custo R$/mês de NÃO usar SmartPreço (ex: vendedor sem cálculo correto perde X% de margem em 50 SKUs = R$Y/mês)
   - vs custo de usar Nubimetrics R$197/mês
   - **Gate:** loss aversion 2.5:1 explícita

6. **M6 — Headline test (landing `/calculadora-livre`, `/precos`, home)**
   - Promessa específica ou abstrata?
   - Compara com headlines dos concorrentes
   - **Gate:** ≥1 alternativa de headline proposta com Loss Aversion

7. **M7 — Ritual de uso (mapeamento)**
   - Vendedor abre o app quando (domingo à noite? toda manhã? só quando precificar?)
   - Frequência esperada (diária, semanal, mensal)
   - O produto cria hábito ou é uso único?
   - **Gate:** hipótese declarada de ritual + plano de validação na entrevista

8. **M8 — Comunidade como canal de aquisição**
   - Existem grupos WhatsApp/Facebook de vendedor ML acessíveis?
   - Eventos (ML Experience anual, G4 Educação Online, encontros locais)?
   - Plano de inserção (não viral genérico — quem o fundador conhece nesses grupos)?
   - **Gate:** ≥3 grupos/comunidades nominalmente identificados

### Estrutura final do output

`docs/reviews/viability-2026-04-30/01-meli-viability.md` (~2000-2500 palavras com Bloco M expandido):

1. Header com versão + owner Pedro Emilio + rubric inline
2. Veredito 1 frase com nota dupla X/10 funcional + Y/10 mercadológica
3. Bloco F (3 pontos com gate binário cada)
4. Bloco M (8 pontos com gate binário cada)
5. Top 5 fortalezas, top 5 fraquezas priorizadas
6. Risk matrix 3x3 (probabilidade × impacto)
7. 3 recomendações 30 dias
8. **Apêndice** — F2/F4/F5 cortados (OAuth scopes / cache 1h / busca 50 results) preservados aqui
9. **Rollback documentado** — se relatório produzir conclusão errada, como reverter ações

### Restrições

- **NÃO duplicar Alex anterior** — citar e estender, não repetir
- **NÃO inventar números** — toda métrica tem fonte (file:line, URL pública, citação)
- **Owner pessoa-física** declarado: Pedro Emilio Ferreira

---

## Critério de sucesso

Após execução do plano v2:
- Arquivo `01-meli-viability.md` existe com header v1, owner Pedro Emilio
- Rubric das notas declarada inline
- Bloco F com 3 pontos (não 5) + apêndice com bronze
- Bloco M com 8 pontos (3 + 5 das tensões resolvidas)
- ≥3 concorrentes citados com pricing público
- Risk matrix 3x3 com top 5 riscos
- Rollback documentado
- Pelo menos 1 alternativa de headline proposta

---

## Próxima etapa (não dispara automaticamente)

Pedro Emilio dá GO → eu disparo 1 spawn anônimo (subagent_type=analyst) com este prompt v2 → relatório fica pronto em ~10-15 min.
