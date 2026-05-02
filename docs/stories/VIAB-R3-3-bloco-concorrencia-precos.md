# VIAB-R3-3 — Bloco "vs concorrentes" em `/precos` com Letzee + GoSmarter

**Epic:** EPIC-VIAB-R3 (Trial 14d + Headline + Concorrência)
**Status:** Draft
**Severidade:** MÉDIA — competitive intel desatualizada na página pública; vendedor sofisticado (Sub-D Ricardo, Sub-E Carlos/Rodrigo) compara antes de pagar
**Sprint:** SPRINT-2026-05-12 (proposto, paralelo a R3-1/R3-2)
**Owner:** Pedro Emilio (executor: @dev)
**SP estimado:** 1 SP (~2-3h)
**Referência:**
- `docs/business/concorrencia-2026-Q2.md` v1 — 12 concorrentes mapeados em 2026-05-02
- `docs/reviews/world-benchmark-2026-05-01/01-benchmark-mundial.md` v2 — secções 1.11 Letzee + 1.12 GoSmarter
- `docs/reviews/viability-2026-04-30/findings/M3-strategist-concorrencia-mapeada.md` (5 concorrentes mapeados originalmente)

---

## Contexto

Método B da triangulação ICP (2026-05-02) descobriu **2 concorrentes diretos** não-mapeados antes:
- **Letzee** (R$ 59/mês, threat HIGH) — concorrente direto, certificação ML, 500+ sellers
- **GoSmarter** ($0 free + R$ 129+, threat MEDIUM) — extensão Chrome com calculadora integrada

Vendedor sofisticado (Sub-D Ricardo, Sub-E Carlos/Rodrigo) **compara antes de pagar**: Ricardo testou Hunter Hub trial e cancelou; Carlos testou Hunter Hub e cancelou; Rodrigo paga Hunter Hub Premium R$397 (canibalizável). Sem bloco comparativo na página `/precos`, o vendedor sai pesquisar e pode parar em Letzee R$59 (mesmo preço-tier mais agressivo).

**Solução:** adicionar bloco "Por que SmartPreço vs concorrentes?" em `/precos` com tabela honesta destacando 3 diferenciais defensáveis (já documentados em `concorrencia-2026-Q2.md` seção 3).

**Cuidado CDC art 37:** comparação tem que ser baseada em pricing público + features oficiais. Não citar dados não-verificáveis. Tabela tem disclaimer "última verificação 2026-05-02".

---

## Acceptance Criteria

### Estrutura
1. [ ] Adicionar seção "Por que SmartPreço vs concorrentes?" abaixo da tabela de planos em `src/app/precos/page.tsx`
2. [ ] Tabela comparativa com 4 ferramentas: SmartPreço + Letzee + Hunter Hub + GoSmarter (free)
3. [ ] 5 dimensões comparáveis:
   - Pricing entry
   - Foco principal
   - Calcula ANTES de anunciar (sim/não)
   - Especialização ML (sim/parcial/genérico)
   - Atualização automática regras ML (sim/não/n/d)

### Copy defensável
4. [ ] Disclaimer rodapé da tabela: "Comparação baseada em pricing público em 2026-05-02. Concorrentes podem ter atualizado."
5. [ ] Sem claim sobre "melhor que X" — apenas fatos verificáveis em URLs públicas
6. [ ] Frase âncora abaixo da tabela: *"A calculadora do ML te diz quanto custa vender. O SmartPreço te diz se vale vender."*

### Diferenciação visual (Halo DS)
7. [ ] Coluna SmartPreço destacada com `bg-halo-orange-05` ou border `border-halo-orange-30`
8. [ ] Cells de "vantagem SmartPreço" usam ✓ verde Halo
9. [ ] Cells de "concorrente vence" usam — neutro (não ✗ vermelho — evitar tom acusatório)

### Eventos
10. [ ] Estender `FunnelEventName` com `pricing_concorrentes_view` (IntersectionObserver)
11. [ ] Instrumentação via padrão `<PricingTracking />` de VIAB-R3-2 (se já existir)

### Qualidade
12. [ ] `npm run typecheck` PASS
13. [ ] `npm run lint` PASS
14. [ ] `npm run build` PASS

### Conteúdo
15. [ ] Pedro Emilio aprova copy da tabela ANTES do deploy (revisão jurídica leve — claim CDC)

---

## Tasks

### Track 1 — Implementação
- [ ] Adicionar seção em `src/app/precos/page.tsx` (depende da story R3-2 estar OK ou trabalhar em paralelo)
- [ ] Tabela responsiva mobile-first (em mobile, transformar em cards stacked)
- [ ] Tokens Halo (navy/orange) consistentes com padrão `/calculadora-livre` + landing nova

### Track 2 — Conteúdo defensável
- [ ] Validar pricing Letzee + GoSmarter no dia do deploy (URLs em `concorrencia-2026-Q2.md`)
- [ ] Atualizar disclaimer "última verificação" para data atual
- [ ] Pedro revisa copy

### Track 3 — Eventos
- [ ] `pricing_concorrentes_view` no `FunnelEventName`
- [ ] Disparar via IntersectionObserver com threshold 0.5

### Track 4 — Validação
- [ ] Smoke manual em preview Vercel — verificar tabela em mobile + desktop
- [ ] Confirmar disclaimer visível
- [ ] Pedro aprova copy via review

---

## Tabela proposta (rascunho — refinar antes de implementar)

| Dimensão | SmartPreço | Letzee | Hunter Hub | GoSmarter Free |
|----------|:----------:|:------:|:----------:|:--------------:|
| Pricing entry | **R$ 39/mês** | R$ 59/mês | R$ 97/mês | R$ 0 |
| Foco | Margem ML especializada | Margem real + DRE | Spy + financeiro | Listing optimizer + calc |
| Calcula ANTES de anunciar | ✓ | — (monitora pós) | — (monitora pós) | — (na página ML) |
| Especialização ML | ✓ Pura | ✓ ML | ✓ ML | Multi |
| Atualização auto regras ML | ✓ | n/d | n/d | n/d |

*Última verificação de pricing público: 2026-05-02. Concorrentes podem ter atualizado.*

---

## Out of Scope

- **Comparação com Nubimetrics R$310** (categoria diferente — market intelligence, não margin calc)
- **Tabela com 12 concorrentes** — overkill, escolher 3-4 mais relevantes
- **Ranking estilo G2** com estrelas — sem dados próprios, criaria claim
- **Logos de concorrentes** — risco de violação de marca

---

## Riscos

| Risco | Probabilidade | Mitigação |
|-------|:-------------:|-----------|
| Letzee mudar pricing após deploy | Alta | Disclaimer "última verificação"; revisar trimestralmente |
| Comparação CDC art 37 (publicidade comparativa) | Baixa | Apenas fatos verificáveis em URLs públicas; sem claim "melhor que" |
| Visual ficar desbalanceado (coluna SmartPreço destacada demais) | Baixa | Halo DS pattern + Pedro review preview |
| GoSmarter free como "vantagem" deles | Baixa | Disclaimer "free com calculadora limitada vs SmartPreço com regras ML específicas" |

---

## Definition of Done

- [ ] AC 1-15 todos checados
- [ ] PR com screenshots da tabela mobile + desktop
- [ ] Pedro aprovou copy
- [ ] @qa gate PASS
- [ ] Story atualizada com File List + Status `Done`

---

## Change Log

| Data | Autor | Mudança |
|------|-------|---------|
| 2026-05-02 | Orion (@aiox-master) | Story criada como parte do EPIC-VIAB-R3 |
