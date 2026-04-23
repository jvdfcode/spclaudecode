# SmartPreço — Relatório Executivo de Débito Técnico

> Produzido por: @analyst (Brownfield Discovery — Fase 9)
> Data: 2026-04-23

---

## Resumo para Decisão

O SmartPreço tem uma base técnica e visual **surpreendentemente sólida** para o estágio atual. O design system profissional, o motor de cálculo completo e a integração com o Mercado Livre colocam o produto em posição de lançamento **com ações específicas e de curto prazo**.

Não há débito estrutural que exija reescrita. Os gaps são de **completude** e **resiliência operacional**, não de arquitetura.

---

## O Que Está Funcionando Bem

| Área | Status |
|------|--------|
| Motor de cálculo de viabilidade | ✅ Completo, testado, preciso |
| Design system visual | ✅ Profissional, coeso, impressionante |
| Autenticação e segurança de dados | ✅ RLS correto, Supabase Auth robusto |
| Busca de mercado via scraping ML | ✅ Funcional, com cache |
| Portfólio de SKUs (CRUD) | ✅ Completo |
| Arquitetura Next.js + Supabase | ✅ Padrões modernos e corretos |

---

## O Que Precisa de Atenção (Resumo)

### Crítico para lançamento público:
1. **Sem navegação mobile** — usuários em smartphone não conseguem navegar entre páginas
2. **Sem rate limiting** — risco de abuso nos endpoints de busca ML
3. **Sem observabilidade** — não há como diagnosticar erros em produção

### Importante para qualidade:
4. **Cache ML cresce indefinidamente** — cleanup automático necessário
5. **OAuth ML não implementado** — integração com API oficial bloqueada
6. **Feedback insuficiente nas ações** — salvar SKU e busca ML sem toast de confirmação

---

## Roadmap de Ação (3 Sprints)

### Sprint 1 — "Pronto para Público" (5-7 dias)
Transformar o MVP em produto utilizável por qualquer pessoa:
- Sidebar mobile com drawer
- Rate limiting nos endpoints ML
- Monitoramento básico (Sentry)
- Cleanup automático do cache ML
- Skeleton loading na busca

### Sprint 2 — "Polimento" (4-5 dias)
Elevar a qualidade percebida:
- WelcomeTour para novos usuários
- Sistema de toast de notificações
- Linha "Recomendada" na tabela de cenários
- Otimizações de DB e acessibilidade

### Sprint 3 — "Features Completas" (12-17 dias)
Completar features de valor e infraestrutura:
- OAuth Mercado Livre
- Painel de Decisão integrado
- SKU detalhe completo
- Cobertura de testes ampliada

---

## Estimativa de Esforço Total

| Sprint | Esforço | Impacto |
|--------|---------|---------|
| Sprint 1 | 5-7 dias | Alta — remove bloqueadores |
| Sprint 2 | 4-5 dias | Média — eleva qualidade |
| Sprint 3 | 12-17 dias | Alta — completa o produto |
| **Total** | **~25-30 dias** | — |

---

## Recomendação

**Executar Sprint 1 antes de qualquer lançamento público ou apresentação para usuários reais.**

O produto já pode ser usado em ambiente controlado (beta fechado). Com as ações do Sprint 1, estará pronto para lançamento amplo. O design é competitivo — a fundação é excelente.

> *"A base é sólida. O que falta é acabamento para lançar com confiança."*
