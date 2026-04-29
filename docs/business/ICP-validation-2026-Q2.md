# ICP Validation 2026-Q2 — output consolidado do Bloco I

**Epic:** EPIC-MKT-001 · **Status:** TEMPLATE — preencher ao longo do sprint.
**Pré-requisito documental para liberar H2** (TECHNICAL-DEBT-REPORT.md §8).

> Este documento consolida os outputs das 5 stories do Bloco I em uma
> síntese executiva. Sem ele preenchido com dados reais, **H2 (cleanup +
> performance) não é desbloqueado**.

---

## 1. ICP confirmado

### 1.1 Quem é o vendedor-alvo (síntese das 10 entrevistas — MKT-001-2)

- Faixa de SKUs ativos predominante: …
- Faixa de faturamento ML mensal predominante: …
- Quem precifica (própria pessoa / time): …
- Maturidade digital: …

### 1.2 Quem NÃO é (anti-ICP)

- Vendedores casuais com <5 SKUs (não há dor recorrente).
- Sellers Enterprise com +R$1M/mês (já têm BI custom; SmartPreço é commodity).

## 2. Dor & urgência confirmadas

### 2.1 Top 3 dores (com citação textual de pelo menos 2 entrevistas cada)

1. **Dor X:** … — citações: "…" (#NN), "…" (#NN)
2. **Dor Y:** …
3. **Dor Z:** …

### 2.2 Urgência média

- Score de urgência (1-10) das entrevistas ★ + ✓: __ / 10
- O que destrava o "agora" (timing, Raduan): …

## 3. WTP — Willingness to Pay

| Faixa testada | Reação ★ | Reação ✓ | Reação ✗ |
|---------------|---------|---------|---------|
| R$ 19/mês | … | … | … |
| R$ 49/mês | … | … | … |
| R$ 99/mês | … | … | … |

- **WTP modal nos ★+✓:** R$ ___ / mês
- **Recomendação para Pro:** R$ ___ / mês (variante __ do A/B test)
- Features mínimas que destravam o WTP: …

## 4. Canal de aquisição validado (MKT-001-3 + entrevistas)

### 4.1 Bullseye (Nardon — top 3 hipóteses → top 1 testado)

| Hipótese | Custo | Velocidade | Dado coletado |
|----------|-------|-----------|---------------|
| SEO ("calculadora taxa ML") | baixo | médio | … |
| Comunidades (FB/WhatsApp) | baixo | rápido | … |
| Parceria com agregadores (Bling, Olist, Nuvemshop) | médio | lento | … |

- **Canal #1 escolhido para H2 inicial:** …
- **Por quê:** …
- **Métrica de sucesso (30 dias após H2):** … leads / … assinaturas Pro

### 4.2 OMIE — Concorrência mapeada

(Resumo de `concorrencia-2026-Q2.md` — Story MKT-001-3)

- Concorrentes identificados: …
- Diferencial defensável do SmartPreço: …
- Lição #1 que vamos copiar: …
- Lição #2 que vamos descartar: …

## 5. Posicionamento confirmado

(Cf. `posicionamento.md`)

- **Decisão final:** Liderança em Produto / Excelência Operacional / Intimidade com Cliente
- **Mudou em relação à v0?** sim / não — porquê: …
- **Frase âncora:** "…"

## 6. KPIs baseline (MKT-001-5)

(Snapshot em … após 30 dias do Bloco I, lido de `/dashboard/kpis`.)

| KPI | Baseline | Meta H2 | Status |
|-----|---------:|--------:|--------|
| Cálculos no Lead Magnet (30d) | … | … | … |
| Leads capturados (30d) | … | … | … |
| Cálculo → Lead | …% | …% | … |
| Pricing → Click | …% | …% | … |
| WTP modal entrevistas | R$ … | — | base |

## 7. Decisão de gate — H2 desbloqueado?

> Critério (ver `TECHNICAL-DEBT-REPORT.md` §8): Bloco I tem que confirmar
> ICP, WTP e canal antes de iniciar H2.

- [ ] ICP descrito com **10 entrevistas concluídas** e ≥6 com fit ★ ou ✓
- [ ] Top 3 dores cada uma corroborada por **≥2 entrevistas**
- [ ] WTP modal documentado **e** Pro alinhado a essa faixa no pricing
- [ ] Pelo menos **1 canal** com ≥30 dias de dado e meta H2 declarada
- [ ] Concorrência com **≥3 ferramentas** mapeadas
- [ ] Posicionamento **confirmado ou revisado** explicitamente
- [ ] KPIs baseline com 4 valores numéricos preenchidos

**Veredito:** ⏳ pendente / ✅ desbloqueia H2 / ⛔ pivot necessário

**Se ⛔:** registrar em `pivot-2026-Q2.md` (a criar) com tese revisada
antes de qualquer story de H2.
