# EPIC-VIAB-R3 — Trial 14d + Headline /precos + Concorrência

**Versão:** v1 (2026-05-02)
**Workflow:** viability-2026-04-30 → R3 do roadmap (após R1+R2)
**Owner:** Pedro Emilio Ferreira (executor: @dev Dex via handoff)
**Data:** 2026-05-02
**Sprint alvo:** SPRINT-2026-05-12 (proposto, 1 sprint após VIAB-R1-1/2/3 em prod)
**Origem:**
- `docs/reviews/viability-2026-04-30/01-meli-viability.md` — Recomendação R3 do relatório de viabilidade
- `docs/reviews/painel-6-personas-2026-05-02/01-pontuacao-painel.md` — Top 5 ações (item #4: Trial 14d)
- `docs/business/ICP-validation-2026-Q2.md` — WTP modal R$ 49 confirmado por triangulação
- `docs/business/concorrencia-2026-Q2.md` — concorrência atualizada com Letzee + GoSmarter

---

## Objetivo

Endereçar 3 itens do roadmap pós-R1+R2 que destravam upgrade da pontuação mundial de 4.5/10 (R1 técnico completo) para 6.0-6.5/10 (tier Sellerboard early):

1. **Trial 14d híbrido** (vs Free tier eterno atual) — endereça M4 finding (4-6× MRR mês 1)
2. **Reescrever headline `/precos`** (atual feature-first 3/10 — Finch) — destravar conversão pricing → click
3. **Atualizar bloco concorrência na página `/precos`** com Letzee + GoSmarter mapeados em FASE 2

---

## Justificativa de negócio

**Free tier eterno viola padrão de mercado** (M4 [PUBLIC-DATA]): 100% dos concorrentes ML BR usam trial (Hunter Hub 14d, Letzee 15d, GoSmarter free permanente — mas paid via upsell). SmartPreço atual com Free 1 SKU eterno cria hábito de não pagar, segundo análise Alfredo Soares no painel 6 personas (3.6/10 comercial).

**Headline /precos atual** (`/precos` page.tsx — "O motor de decisão de preço mais preciso para o Mercado Livre Brasil") foi avaliada por Thiago Finch como 3/10 — feature-first, sem Loss Aversion, ignora ratio 12.6:1 estruturalmente forte. Badge "Posicionamento — Liderança em Produto" identificada por Uma + Finch como ruído interno de estratégia.

**Concorrência desatualizada** (Letzee + GoSmarter descobertos em 2026-05-02 não estão na página `/precos` se houver bloco "vs concorrentes") — vendedor sofisticado (Sub-D Ricardo, Sub-E Carlos/Rodrigo) compara antes de pagar.

**Resultado projetado:** subir conversão pricing → click de 4% (estimado) para 8-12% (meta), gerar tração paga real para validar ICP v1 sintética com vendedores reais.

---

## Stories incluídas

| ID | Título | Esforço | Severidade origem | Depends-on | Bloqueador? |
|----|--------|---------|-------------------|------------|-------------|
| VIAB-R3-1 | Trial 14d híbrido via pricing-experiment.ts | 3 SP | M4 — ALTA | VIAB-R1-1 prod (apply migration 012) | NÃO (paralelizável) |
| VIAB-R3-2 | Reescrever headline `/precos` com Loss Aversion | 2 SP | M6 Finding 2 — ALTA | — | NÃO |
| VIAB-R3-3 | Atualizar bloco concorrência em `/precos` (Letzee + GoSmarter) | 1 SP | competitive intel | VIAB-R3-2 (fica natural na mesma página) | NÃO |

**Total:** 6 SP em 3 stories.

---

## Pré-requisitos antes do Sprint começar

### Decisões de Pedro
- **D1 (VIAB-R3-1):** Trial 14d Pro completo OU 7d? Recomendação: **14d** (alinha com Letzee 15d e Hunter Hub 14d — padrão de mercado consolidado)
- **D2 (VIAB-R3-1):** após trial expirar — fallback Free 1 SKU OU paywall absoluto? Recomendação: **fallback Free 1 SKU** (evita trauma como o de Patrícia "academia debitou 8 meses")
- **D3 (VIAB-R3-2):** confirmar headline final. Variante D-pricing proposta:
  - *"Pare de precificar no escuro. Veja exatamente onde sua margem está vazando — e corrija hoje."*
  - Alternativa MeliDev-style: *"R$ 39/mês para parar de perder R$ 500-1.500/mês com erro de precificação ML."*

### Pré-requisitos técnicos
- VIAB-R1-1 em prod (apply migration 012 — pendente Pedro/devops)
- VIAB-R1-2 + R1-2.1 em prod (preview Vercel review pendente)
- VIAB-R1-3 em prod (recém-implementado, pendente push deploy)

### Pré-requisitos documentais (todos atendidos em 2026-05-02)
- ✅ ICP-validation v1 SINTÉTICA (`docs/business/ICP-validation-2026-Q2.md`)
- ✅ Concorrência atualizada (`docs/business/concorrencia-2026-Q2.md`)
- ✅ Posicionamento (`docs/business/posicionamento.md` — Liderança em Produto + sub-âncoras)

---

## Critério de "epic done"

- [ ] VIAB-R3-1 em status `Done` (Trial 14d em prod, ≥10 trials iniciados nos primeiros 30 dias, instrumentação OK)
- [ ] VIAB-R3-2 em status `Done` (`/precos` headline reescrita, badge "Posicionamento" removida, Lighthouse ≥ 90)
- [ ] VIAB-R3-3 em status `Done` (bloco concorrência com 3-4 ferramentas comparadas)
- [ ] Pontuação mundial reavaliada — meta: subir de 4.5/10 (R1) para ≥ 5.5/10
- [ ] KPI: pricing → click ≥ 8% em 30 dias pós-deploy
- [ ] Sprint retrospective registrada

---

## Riscos do epic

| Risco | Probabilidade | Mitigação |
|-------|:-------------:|-----------|
| Trial 14d aumentar churn pós-expiração (vs Free eterno reter mais) | Média | Fallback Free 1 SKU + email day-13 com prova de economia gerada |
| Headline R$ 500-1.500 não defensável | Baixa | ICP-validation v1 já tem disclaimer "faixa estimada" |
| Bloco concorrência soar agressivo / cair em comparação enganosa CDC | Baixa | Comparar SOMENTE pricing público + features oficiais; não citar dados não-verificáveis |
| Letzee/GoSmarter mudarem pricing após implementação | Média | Bloco concorrência tem nota "última verificação 2026-05-02"; revisar trimestralmente |
| Pricing-experiment.ts não existir no codebase | Alta | VIAB-R3-1 inclui criar componente se ausente |

---

## Recomendações não-absorvidas

### Eliminação completa do scraping HTML (VIAB-R1-3.1)
**Não absorvida.** Backlog técnico — exige análise de quais queries dependem do scraping vs API oficial. Não bloqueia VIAB-R3.

### Criptografia at-rest do refresh_token (F2 Finding 3)
**Não absorvida.** Backlog técnico — `pgsodium` + migration de dados existentes. Impacto alto se houver breach mas não é race ATIVA.

### Roundtable virtual com Tallis/Pedro V/Nardon validando R3
**Não absorvida.** Tallis vetou painéis ("para de escrever relatório, vende"). VIAB-R3 é decisão direta baseada em painel anterior + ICP v1.

### Implementar agente strategist-swot-canvas (criado em 2026-05-02)
**Não absorvida nesta epic.** Agente disponível em `.cursor/rules/agents/strategist-swot-canvas.md` para uso futuro. Pode ser usado pós-VIAB-R3 para gerar SWOT formal + Business Model Canvas v1.

---

## Próxima ação

1. **Pedro Emilio (papel @po):** validar 3 stories Draft → Ready quando R1 estiver em prod
2. **Pedro/devops:** apply migration 012 + promote VIAB-R1-2/2.1/3 para prod
3. **Próxima sessão @dev:** implementar VIAB-R3-1 (Trial 14d) — maior impacto comercial direto

---

## Change Log

| Data | Autor | Mudança |
|------|-------|---------|
| 2026-05-02 | Orion (@aiox-master) | Epic criado consolidando R3 do roadmap pós-ICP v1 + competitive intel atualizado |
