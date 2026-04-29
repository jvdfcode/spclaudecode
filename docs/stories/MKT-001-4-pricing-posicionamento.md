# Story MKT-001-4 — Pricing-Page v0 + Posicionamento Treacy & Wiersema

**Epic:** EPIC-MKT-001
**Status:** Draft
**Owner sugerido:** [OWNER: ?] (preencher na sprint planning)
**Persona-origem do roundtable:** Raduan + Finch
**Esforço estimado:** 3–5 dias

---

## Contexto

O SmartPreço não tem modelo de monetização documentado. O PRD inteiro não tem uma linha sobre pricing. Não há plano Free, Pro ou Enterprise. Não há página de preços. Não há oferta.

Raduan Melo (roundtable): "Declare o posicionamento e use-o como filtro de backlog. Se o SmartPreço é Liderança em Produto, cada item do backlog passa pelo teste: 'isso torna nossa cirurgia mais precisa ou mais ampla?'"

Finch (roundtable): "Definir a oferta perpétua antes do Bloco G (i18n). Freemium com limite de SKUs, plano básico R$ X/mês. Sem oferta definida, o funil não tem destino."

Nardon: "Criar um pricing page antes de terminar o H1 técnico. Não precisa ser o modelo definitivo. Precisa existir para você aprender."

Esta story faz duas coisas interdependentes: (1) documenta a decisão de posicionamento entre as 3 portas Treacy & Wiersema, e (2) publica a pricing-page v0 com pelo menos 1 plano hipótese e CTA, conectada ao Lead Magnet (MKT-001-1).

---

## Acceptance Criteria

- [ ] **AC1:** Documento `docs/business/posicionamento.md` publicado com decisão explícita entre as 3 portas Treacy & Wiersema (Liderança em Produto / Excelência Operacional / Intimidade com Cliente) + justificativa baseada nos dados das entrevistas (MKT-001-2) ou hipótese documentada se entrevistas ainda não concluídas
- [ ] **AC2:** Pricing-page v0 acessível publicamente (rota `/precos` ou `/pricing`) com pelo menos 1 plano hipótese (nome + preço + features principais + CTA)
- [ ] **AC3:** Pricing-page integrada ao Lead Magnet: CTA da calculadora pública (`/calculadora-livre`) leva para a pricing-page ao final do fluxo
- [ ] **AC4:** Primeiros sinais de WTP coletados: pelo menos 5 clicks no CTA da pricing-page registrados em Vercel Analytics ou equivalente dentro de 14 dias de publicação
- [ ] **AC5:** `pnpm build` e `pnpm lint` passando após implementação da rota

---

## Tasks

- [ ] **T1:** Ler outputs de MKT-001-2 (entrevistas ICP) e MKT-001-3 (concorrência) se disponíveis; caso contrário, usar hipótese documentada a partir dos inputs do roundtable
- [ ] **T2:** Redigir `docs/business/posicionamento.md`: declarar porta Treacy & Wiersema escolhida + justificativa + implicações para backlog (quais débitos se alinham, quais ficam de fora)
- [ ] **T3:** Definir hipóteses de planos (ex: Free — 5 SKUs, Pro — SKUs ilimitados + MarketSearch, Enterprise — multi-usuário); documentar em `docs/business/posicionamento.md` seção Pricing Hypotheses
- [ ] **T4:** Criar rota `src/app/precos/page.tsx` (ou `/pricing`) com pricing-page v0: tabela de planos, CTA de "começar grátis" + "falar com vendas" ou "lista de espera Pro"
- [ ] **T5:** Conectar CTA do Lead Magnet (`/calculadora-livre`) para redirecionar para `/precos` após captura de email
- [ ] **T6:** Instrumentar clicks no CTA de cada plano via Vercel Analytics (ou `gtag`) para medir interesse por plano
- [ ] **T7:** Verificar que `/precos` é rota pública (não protegida por auth em `middleware.ts`)
- [ ] **T8:** Deploy em staging; testar fluxo completo: calculadora → captura email → redirect para pricing; testar `pnpm build`

---

## Output esperado

- `docs/business/posicionamento.md` — decisão de posicionamento Treacy & Wiersema
- `src/app/precos/page.tsx` — pricing-page v0 publicada
- Dados de analytics (clicks por plano) registrados após 14 dias

---

## Notas técnicas / referências

- **Recomendação 4 / Finch + Nardon + Tallis:** "Criar pricing-page + Lead Magnet em paralelo ao Bloco H." (roundtable-personas-2026-04-27.md, Adições H1)
- **Raduan Treacy & Wiersema:** 3 portas — Liderança em Produto (melhor motor de decisão), Excelência Operacional (menor custo de operação), Intimidade com Cliente (melhor relacionamento e customização). SmartPreço provavelmente se encaixa em Liderança em Produto — mas isso deve ser confirmado pelos dados das entrevistas
- **Finch:** "Sem oferta definida, o funil não tem destino." O posicionamento declarado determina qual plano é o "eixo" do negócio (ex: se Liderança em Produto, o Pro plan com MarketSearch ilimitado é o plano central)
- Pricing-page v0 não precisa de integração de pagamento real — um CTA de "lista de espera" ou "falar com vendas" é suficiente para coletar sinal de WTP

---

## Riscos

- Posicionamento declarado antes das entrevistas pode ser hipótese incorreta (mitigação: marcar explicitamente como "hipótese v0 — sujeita a revisão pós-MKT-001-2"; usar gates de atualização no documento)
- Pricing-page com preço muito alto afasta leads antes de entrevistas (mitigação: use preço hipótese com disclaimer "preço em construção — junte-se à lista de espera")
- Conflito de UI entre `/calculadora-livre` e `/precos` se tiverem estilos diferentes (mitigação: usar design system existente; não criar novos componentes de UI — reutilizar tokens semânticos existentes)

---

*Story gerada por @pm (Morgan) — EPIC-MKT-001 — Roundtable 2026-04-27*
