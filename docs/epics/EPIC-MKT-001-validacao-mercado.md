# EPIC-MKT-001 — Validação de Mercado (Bloco I)

**Workflow:** brownfield-discovery → roundtable consultivo → execução
**Owner:** @pm Morgan
**Data:** 2026-04-27
**Sprint alvo:** entre H1 (paydown técnico) e H2 (cleanup + performance)
**Origem:** roundtable-personas-2026-04-27.md (recomendação 2 + Bloco I novo)

---

## Objetivo

Validar ICP, canal de aquisição e modelo de monetização do SmartPreço ANTES de iniciar H2. Pré-requisito documental para liberar Blocos B/A/C. Em 30 dias, o time deve ter evidência de mercado real — não hipótese de produto.

---

## Justificativa

Quatro das 6 personas do roundtable (Raduan, Nardon, Finch, Tallis) vetaram pagar 6-7 sprints de débito técnico sem confirmar que existe tração comercial. Sem ICP validado por dados e canal de aquisição testado, o roadmap H2/H3 é elegância técnica em produto sem mercado confirmado.

Citações diretas do roundtable:
- **Raduan:** "Pagar 6-7 sprints de débito técnico sem confirmar tração comercial é jogar dinheiro fora."
- **Nardon:** "A ordem correta não é 'corrige o tech, depois vai para o mercado'. A ordem é 'valida que alguém paga, depois escala com tech sólido'."
- **Finch:** "Lead Magnet antes do próximo sprint. Calculadora pública gratuita que mostra quanto o vendedor está perdendo."
- **Tallis:** "O maior débito técnico do SmartPreço não está em nenhuma tabela — está na ausência de uma operação comercial rodando enquanto o time arruma o código."

---

## Stories incluídas

| ID | Título | Esforço estimado | Persona-origem | Bloqueia H2? |
|----|--------|-----------------|----------------|--------------|
| MKT-001-1 | Lead Magnet — Calculadora pública sem cadastro | 3–5 dias | Finch + Nardon + Tallis | Não (paralela a H1) |
| MKT-001-2 | 10 Entrevistas ICP com roteiro PWR | 10–14 dias (paralelo) | Raduan + Nardon + Tallis | Sim (output ICP-validation) |
| MKT-001-3 | Mapeamento de concorrência OMIE | 3–5 dias | Finch | Não |
| MKT-001-4 | Pricing-page v0 + posicionamento Treacy & Wiersema | 3–5 dias | Raduan + Finch | Sim (output posicionamento) |
| MKT-001-5 | KPIs baseline — CAC, LTV, ativação, NPS piloto | 2–3 dias | Nardon + Finch | Sim (dashboard ativo) |

---

## Critérios de aceitação do epic

- [ ] **ICP validado:** 10 entrevistas com vendedores ML concluídas; transcripts estruturados em `docs/business/interviews/`; documento síntese `docs/business/ICP-validation-2026-Q2.md` publicado com padrões de resposta (ICP, dor, urgência, WTP, canais, timing)
- [ ] **Canal testado:** pelo menos 1 canal de aquisição testado em 30 dias com métrica de conversão registrada (ex: taxa de cadastro pós-Lead Magnet, taxa de engajamento em grupo FB/WhatsApp)
- [ ] **Lead Magnet no ar:** rota `/calculadora-livre` acessível sem login; CTA de captura de email funcional com LGPD opt-in; pelo menos 10 leads capturados em 30 dias pós-publicação
- [ ] **Pricing-page v0 publicada:** pelo menos 1 plano com CTA e preço hipótese; primeiros sinais de WTP coletados
- [ ] **Posicionamento declarado:** documento `docs/business/posicionamento.md` publicado com decisão entre as 3 portas Treacy & Wiersema (Liderança em Produto / Excelência Operacional / Intimidade com Cliente) e justificativa baseada em evidência das entrevistas
- [ ] **Dashboard de KPIs vivo:** 4 KPIs (CAC hipótese, LTV hipótese, taxa de ativação, NPS piloto) instrumentados e com baseline registrada
- [ ] **Output consolidado:** `docs/business/ICP-validation-2026-Q2.md` completo e revisado — este arquivo é o pré-requisito formal para liberar o H2

---

## Dependências

| Dependência | Status | Impacto se ausente |
|-------------|--------|-------------------|
| Bloco H (race conditions — TD-001-1) entregue antes | A verificar | Instabilidade em `checkRateLimit` e OAuth ML quebra qualquer teste de mercado real com usuários reais |
| DEBT-H3 (Sentry Edge `tracesSampleRate: 0.1`) ativo | Deve sair como primeiro item de H1 | Sem observabilidade, leads capturados pela calculadora e pelo Lead Magnet geram erros invisíveis |
| `docs/business/` criado (diretório) | Criar junto a MKT-001-2 | Não bloqueia MKT-001-1, mas bloqueia outputs formais |

---

## Riscos do epic

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| ICP entrevistado não tem WTP para produto SaaS | Média | Alto (pivot de tese) | Se >= 7 de 10 entrevistados não têm WTP > R$0, documento pivot recomendation antes de H2 — não continuar pagando débito técnico de produto sem mercado |
| Lead Magnet não converte em 30 dias (< 10 leads) | Média | Médio (sinal de canal errado) | Testar segundo canal (comunidades vs. SEO) em paralelo após semana 2 |
| Concorrente identificado cobre o diferencial técnico integralmente | Baixa | Alto | Documentar como vantagem diferencial (e.g., cálculo de taxas por tipo de anúncio ML — scraping real vs. manual) |
| Pricing-page v0 sem integração de pagamento real | Baixa | Baixo | v0 é hipótese de preço + CTA de lista de espera, não checkout real — intencionalmente simples |
| Bloco H não entregue antes de MKT-001-1 | Média | Médio | Lead Magnet pode ir ao ar antes do Bloco H desde que `checkRateLimit` não seja chamado na rota `/calculadora-livre` sem auth |

---

## Plano de rollback / pivô

Se em 30 dias as 5 stories não confirmarem ICP/WTP/canal — critério objetivo: < 5 entrevistas com WTP > R$29/mês + < 10 leads via Lead Magnet — pausar H2 completamente e revisar tese do produto antes de continuar qualquer paydown técnico. Documento de pivô: `docs/business/pivot-recommendation-2026-Q2.md`.

---

*Epic gerado por @pm (Morgan) — Roundtable Bloco I — 2026-04-27*
*Origem: roundtable-personas-2026-04-27.md Recomendação 2 + Seção "Adições propostas ao roadmap / H1.5"*
