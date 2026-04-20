# SmartPreço PRD — Índice

> Versão 1.0 · 2026-04-20 · Status: Draft
> Documento completo: [../prd.md](../prd.md)

## Navegação por Seção

| Shard | Seção | Conteúdo |
|-------|-------|----------|
| [01](01-goals-context.md) | Goals & Context | Objetivos do produto e contexto do problema |
| [02](02-requirements.md) | Requirements | FR01–FR20 e NFR01–NFR10 |
| [03](03-ui-design.md) | UI Design Goals | UX vision, telas, acessibilidade, branding |
| [04](04-technical.md) | Technical Assumptions | Stack, arquitetura, testes, CI/CD |
| [05](05-epic-list.md) | Epic List | Visão geral dos 6 epics + prioridade |
| [06](06-epic-01-02.md) | Epic 01 & 02 | Fundação & Infraestrutura · Base Financeira |
| [07](07-epic-03-04.md) | Epic 03 & 04 | Simulador de Cenários · Central de SKUs |
| [08](08-epic-05-06.md) | Epic 05 & 06 | Bloco Mercado · Motor de Decisão & Polish |

## Resumo Executivo

**SmartPreço** é uma ferramenta de apoio à decisão de preço para vendedores de marketplace (foco: Mercado Livre Brasil). O sistema calcula o custo real do produto, simula cenários de preço e compara com o mercado real — conduzindo o vendedor a uma decisão comercial concreta: *por quanto vender*.

## Métricas de Sucesso do MVP

- Tempo para primeira decisão de preço: **< 5 minutos**
- Sessões que terminam com preço definido: **> 70%**
- Sessões que usam o Bloco Mercado: **> 60%**
- SKUs salvos por usuário ativo: **média 5**

## Epic Summary

| Epic | Stories | Complexidade |
|------|---------|-------------|
| EPIC-01: Fundação & Infraestrutura | 4 | Alta (setup) |
| EPIC-02: Base Financeira | 3 | Alta (coração do sistema) |
| EPIC-03: Simulador de Cenários | 2 | Média |
| EPIC-04: Central de SKUs | 3 | Média |
| EPIC-05: Bloco Mercado | 3 | Alta (API externa) |
| EPIC-06: Motor de Decisão & Polish | 2 | Média |
| **Total** | **17** | |
