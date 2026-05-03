# EPIC-PROD-002 — Defensabilidade Institucional (cert ML + Chrome Ext + IA + CNPJ)

**Versão:** v1 (2026-05-03)
**Workflow:** comparativo-letzee-2026-05-02 → ações P0 do painel 8 personas
**Owner:** Pedro Emilio Ferreira (executor: @dev + @devops + Pedro humano para CNPJ/cert)
**Data:** 2026-05-03
**Sprint alvo:** SPRINT-2026-05-12 ou SPRINT-2026-05-19 (depende decisão Cenário B/B'/C)
**Origem:**
- `docs/reviews/comparativo-letzee-2026-05-02/01-comparativo-8-personas.md` — top 5 ações priorizadas
- `docs/strategy/decisao-founder-full-time-2026-05-03.md` — gate Nardon
- `docs/strategy/SWOT-2026-05-02.md` — Threats top + Weaknesses

---

## Objetivo

Endereçar as **5 ações P0** identificadas pelo painel de 8 personas no comparativo SmartPreço vs Letzee, fechando os gaps institucionais (não técnicos) que mantêm SmartPreço em probabilidade de sobrevivência 18m de apenas 30% (mesmo após R3-1 + R3-2 promovidos).

Movendo para **75-85% de probabilidade** ao fechar todas as 4 stories deste epic.

---

## Justificativa de negócio

Painel 8/8 personas convergiu em **único voto unânime: certificação App ML é P0 não-negociável**. 7/8 disseram "founder solo é gargalo terminal". 6/8 disseram "distribution > produto neste momento". Letzee construiu **vantagem institucional** em 12 meses (CNPJ + selo ML + Sebrae 3 ciclos + Chrome Ext 5.0/5) enquanto SmartPreço construiu vantagem técnica (stack moderno + CI maduro + Halo DS).

Vantagem técnica não vende. **Vantagem institucional vende.** Este epic move SmartPreço de "projeto pessoal técnico" para "negócio operável".

**ARR projetado:**
- Sem este epic: R$ 27k em 12 meses (otimista)
- Com este epic + Cenário B founder full-time: R$ 200-500k em 12 meses

---

## Stories incluídas

| ID | Título | Esforço | Severidade | Owner |
|----|--------|---------|-----------|-------|
| PROD-002 | Certificação App Mercado Livre (4-8 semanas) | 5 SP | **CRÍTICA** (8/8 votos) | Pedro humano |
| PROD-003 | Chrome Extension MVP (point-of-decision) | 8 SP | ALTA (5/8 votos) | @dev |
| PROD-004 | IA recomendação de pricing (diferenciação Letzee) | 5 SP | MÉDIA (1 voto Alan) | @dev |
| CNPJ-001 | Constituição CNPJ + DPO (LGPD art. 41) | 3 SP | ALTA (Pedro V) | Pedro + contador |

**Total:** 21 SP em 4 stories. Maioria depende de **Cenário B/B' do gate Nardon ser tomado** — sem founder dedicado, PROD-003/004 ficam parados.

---

## Pré-requisitos antes do Sprint começar

### Decisão de Pedro (gate Nardon)
- **D1:** Cenário B (full-time), B' (co-founder), C (vender) ou A (status quo)? — registrar em `docs/strategy/decisao-founder-full-time-2026-05-03.md`
  - Se C ou A: epic fica em Draft eterno
  - Se B/B': epic ativo com sequenciamento abaixo

### Pré-requisitos institucionais
- [ ] Apply migration 012 + 013 em prod (runbook `docs/runbooks/apply-prod-2026-05-03.md`)
- [ ] Promote VIAB-R1-2/2.1/3 + R3-2 para prod (runbook acima)
- [ ] EPIC-VIAB-R1 com 4/4 stories Done (não só InReview)
- [ ] EPIC-VIAB-R3 com pelo menos 2/3 stories Done

---

## Sequenciamento recomendado

### Wave 1 — 30 dias (paralelo)
- **CNPJ-001** (Pedro + contador) — bloqueia DD de qualquer investidor sério
- **PROD-002** (cert ML — Pedro humano via developers.mercadolivre.com.br)

### Wave 2 — 60 dias (depende Wave 1 completa)
- **PROD-003** (Chrome Extension MVP — @dev) — só inicia após cert ML para acessar APIs privilegiadas

### Wave 3 — 90 dias (depende validação tração)
- **PROD-004** (IA recomendação) — só faz sentido com 50+ pagantes (data fly-wheel)

---

## Critério de "epic done"

- [ ] PROD-002 em status `Done` (selo App Certificado visível em developers.mercadolivre.com.br)
- [ ] PROD-003 em status `Done` (Chrome Extension publicada com ≥4.5/5 rating)
- [ ] PROD-004 em status `Done` (IA disponível em produção para pagantes Pro)
- [ ] CNPJ-001 em status `Done` (CNPJ ativo + DPO contratado + DPIA inicial publicado)
- [ ] Pontuação mundial reavaliada — meta: 5.5/10 → 7.0/10 (tier Letzee atual)
- [ ] Probabilidade sobrevivência 18m: 30% → 75-85%

---

## Riscos do epic

| Risco | Probabilidade | Mitigação |
|-------|:-------------:|-----------|
| Cenário A do gate Nardon (status quo) | Alta | Documento de decisão força resposta até 2026-05-17 |
| Certificação App ML negada ou demora >12 semanas | Média | Manter Variante D MeliDev como narrativa core; Chrome Ext via API pública não-certificada (degradação graceful) |
| CNPJ-001 demora por contador | Baixa | Múltiplos contadores online (Contabilizei, Conube) entregam em 7-15 dias |
| PROD-003 (Chrome Ext) sem volume — efeito vitrine | Média | Distribuir via FB 60k + grupos verticais (canal #1 já validado em ICP) |
| PROD-004 (IA) custo OpenAI/Anthropic estourar | Baixa | Cache + rate limit por usuário; limit de R$ 50/mês em Pro tier |

---

## Recomendações não-absorvidas

### Eliminação completa do scraping HTML (`ml-proxy/route.ts`)
**Não absorvida nesta epic.** Backlog VIAB-R1-3.1 — depende de PROD-002 (certificação) para trocar scraping por API oficial. Se PROD-002 demorar, manter scraping com backoff (já implementado em VIAB-R1-3) é aceitável.

### Patrocínio Gustavo Lucas YouTube
**Não absorvida.** Recomendação MeliDev no painel — fica em backlog comercial, não epic técnico. Custo R$ 3-8k/mês depende Cenário B aprovado.

### Roundtable validando epic
**Não absorvida.** Tallis vetou painéis recorrentes. Decisões tomadas pelos 8 personas no comparativo Letzee são suficientes.

---

## Próxima ação

1. **Pedro responder** documento de decisão `docs/strategy/decisao-founder-full-time-2026-05-03.md` até 2026-05-17
2. **Se Cenário B/B':** Pedro inicia CNPJ-001 (contador) + PROD-002 (cert ML) **paralelos** em 24h
3. **Se Cenário C:** epic é arquivado; foco em saída via C.1/C.2/C.3
4. **Se Cenário A (default):** epic permanece Draft, revisitar em 2026-08-03

---

## Change Log

| Data | Autor | Mudança |
|------|-------|---------|
| 2026-05-03 | Orion (@aiox-master) | Epic criado consolidando top 5 ações do painel 8 personas (comparativo Letzee) |
