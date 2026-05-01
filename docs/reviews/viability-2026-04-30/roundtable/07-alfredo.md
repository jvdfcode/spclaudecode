# Alfredo Soares — Auditoria SaaS B2B do plano de analise

> "PME compra por comunidade. Plano sem ICP defensavel e sem canal de comunidade nao converte."

## Veredito

**NEEDS WORK**

Motor de calculo testado e EPIC-MKT-001 com 5 stories mostram merito tecnico. Mas nao passa no teste SaaS B2B PME: ICP sem sobrenome, free tier posterga decisao de pagar, comunidade aparece como pesquisa e nao como canal de ativacao.

---

## 3 Forcas (do plano)

1. **Motor de calculo como ativo:** Engine com cobertura >= 70%, calculo automatico de taxa ML por categoria. Tempo ate primeiro valor pode ser rapido se UX nao atrapalhar.
2. **EPIC-MKT-001 estruturado:** Lead Magnet, entrevistas ICP, OMIE, pricing-page, KPIs. Roteiro PWR com 21 perguntas e WTP explicito e acima da media.
3. **Posicionamento declarado:** `posicionamento.md` escolhe Lideranca em Produto e documenta anti-posicionamentos. Raro em SaaS PME — maioria tenta ser tudo e morre no churn.

---

## 5 Fraquezas (gaps SaaS B2B PME)

1. **ICP nao e defensavel** — Brief: "10-500 SKUs, R$ 5K-100K/mes". Faixa demografica. ICP defensavel: "Carlos, 38, capinhas ML Classic, R$ 15k/mes, grupo 'Vendedores ML Pro' no Facebook, precifica copiando concorrente." Sem nome+sobrenome+onde encontra, pricing e canal sao chute.
2. **Free tier nao converte PME** — "Free — 5 SKUs" sem trial 14 dias como alternativa. Free cria habito de nao pagar. Trial forca ativacao: prazo, explora tudo, decide quando valor esta fresco.
3. **Comunidade ausente como canal** — MKT-001-3 pede "entrar em 3 grupos" para pesquisa. Comunidade e canal primario de PME, nao ferramenta de pesquisa. Sem presenca ativa, sem conteudo de valor, sem referral.
4. **Churn nao diagnosticado** — KPI mede primeiro SKU salvo. Nao analisa por que pararia de usar. Churn vem de ausencia de habito: calcula uma vez, nao volta. Sem loop de reuso (alertas de margem, recalculo), MRR despenca no mes 3.
5. **Tempo ate primeiro valor nao testado** — Brief promete "< 5 minutos". Nenhuma story mede. PME abandona em 2 minutos. Roteiro mostra produto mas nao cronometra "aha moment".

---

## Pricing audit (R$39/49/59)

- **Vs Nubimetrics R$197:** R$ 39-59 posiciona como acessivel para PME — coerente com Lideranca em Produto. Mas sem WTP validado, e numero inventado. Roteiro testa R$ 19/49/99 — bom. Esperar resultado.
- **Free 5 SKUs vs trial 14 dias:** PME que nao paga e custo de servidor, nao cliente. Na Loja Integrada, conversao trial-to-paid era 3-5x maior que free-to-paid. Testar trial como variante B.
- **WTP PME R$ 5-50k/mes:** R$ 49 e ~1% do lucro de quem fatura R$ 15k. Acessivel se ancorar no Loss Aversion ("economizei R$ 500/mes em precificacao errada").

---

## ICP defensavel check

- [ ] **Nome+sobrenome real** — Nao. ICP como faixa. Zero personas concretas.
- [ ] **Onde encontrar** — Parcial. Grupos genericos. Nenhum grupo especifico, nenhum evento (Mercado Livre Experience, G4 Educacao).
- [ ] **5 entrevistas validadas** — Nao. Zero realizadas. Roteiro existe, `interviews/` so tem templates.

---

## 3 Mudancas (SaaS B2B) que devem entrar

1. **ADICIONAR teste de ICP defensavel:** Completar 5 entrevistas, produzir 3 personas concretas com "onde encontra" preenchido — grupo de Facebook especifico, evento ML especifico. Sem isso, pricing e hipotese no escuro.
2. **ADICIONAR analise trial vs free:** Variante trial 14 dias no A/B test. Medir conversao trial-to-paid vs free-to-paid em 30 dias. Impacta MRR e churn diretamente.
3. **EXIGIR plano de comunidade como canal:** 5 grupos ativos de vendedores ML no Facebook (>5k membros), 4 posts de valor/mes, meta 50 leads via comunidade em 60 dias, presenca em 1 evento (Mercado Livre Experience, meetups e-commerce). Vendedor ML descobre ferramenta por recomendacao.

---

## Conclusao executiva

Plano faz as perguntas certas mas nao tem respostas. ICP e hipotese, pricing sem WTP, comunidade como pesquisa quando deveria ser estrategia de ativacao. SmartPreco vira SaaS viavel quando completar entrevistas, testar trial vs free, e montar presenca nos grupos onde vendedor ML ja esta. Sem habito, sem comunidade, sem MRR. Simplicidade > poder — mas primeiro, provar que alguem paga.

---

*Alfredo Soares, SaaS B2B | Comunidade > Feature.*
