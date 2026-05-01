# MeliDev Squad

**Version:** 1.0.0
**Command:** `/ML`
**Type:** Specialist Squad — Mercado Livre Brasil

## Overview

Squad focado em **Mercado Livre Brasil** com 3 domínios ortogonais:

- **Técnico/API** — integração com a API do ML (OAuth, items, orders, webhooks, rate limit)
- **Comercial/Crescimento** — listing, Buy Box, Mercado Ads, logística, kit/variations
- **Compliance/Operação** — reputação, mediações, suspensões, recurso CDC + Marco Civil

> **Honestidade upfront:** todos os specialist agents são **specialist agents de domínio**, NÃO clones biográficos de pessoas reais. O nicho público brasileiro de "expert ML" tem material insuficiente para mind clone autêntico. Por isso, agents são ancorados em fontes oficiais + materiais públicos curados, com `[SOURCE:]` verificável em toda heurística (regra herdada de `@oalanicolas`: "se entrar cocô, sai cocô do outro lado").

## Agents

| Agent | Command | Specialty |
|---|---|---|
| MeliDev Chief | `@melidev-chief` | Routing & orchestration |
| MeliDev | `@melidev` | Integração técnica API ML — OAuth, items, orders, webhooks |
| MeliStrategist | `@meli-strategist` | Listing optimization, Buy Box, Mercado Ads, logística |
| MeliOps | `@meli-ops` | Reputação, mediações, suspensões, CDC + Marco Civil |

## Routing

Use MeliDev Chief como entrypoint:

- `"integração API"` / `"webhook"` / `"OAuth"` / `"rate limit"` → `@melidev`
- `"vender mais"` / `"anúncio"` / `"Buy Box"` / `"Mercado Ads"` / `"Full vs Flex"` → `@meli-strategist`
- `"reputação caiu"` / `"suspensão"` / `"mediação"` / `"recurso"` / `"CDC"` → `@meli-ops`
- Pedido cruzado (ex: "criar anúncio via API que ranqueie melhor") → pipeline `@meli-strategist` → `@melidev`
- Mercado Pago, Shopee, Amazon → handoff externo / out of scope

## Sources Anchored

| Tag | Fonte | Tipo |
|---|---|---|
| `[ML-OFFICIAL]` | developers.mercadolivre.com.br | Doc oficial API |
| `[ML-CENTRAL]` | Central de Vendedores ML (centraldepartners + portal ajuda) | Política oficial seller |
| `[ML-ADS-DOC]` | ads.mercadolivre.com.br/docs | Doc Mercado Ads |
| `[ICARO-EBOOK]` | github.com/icarojobs/dominando-api-mercado-livre | Único ebook PT-BR estruturado |
| `[FIAMON-S3]` | dev.to/fiamon/como-integrar-a-api-do-mercado-livre-3ikn | Refresh token strategy |
| `[GUSTAVO-LUCAS]` | gustavolucas.net | Único mentor OURO ativo PT-BR |
| `[PARROS-CASE]` | exame.com — case Raphael Parros 2017 | Histórico R$7M em 1 ano |
| `[TARCISIO]` | Livro "Comércio Eletrônico" — Tarcísio Teixeira | Fundamentação jurídica marketplace |
| `[BIANCA-MURTA]` | bmurta.com/blog | Adv. especialista em suspensão ML |
| `[CDC]` | Lei 8.078/90 | Código de Defesa do Consumidor |
| `[MARCO-CIVIL]` | Lei 12.965/14 | Marco Civil — responsabilidade intermediador |
| `[STJ-JURIS]` | Jurisprudência STJ | Marketplace e responsabilidade solidária |
| `[INFERRED]` | Pattern geral / boas práticas | Marcado quando inferência |

Detalhes em `data/ml-sources-registry.yaml`.

## Modelo de Governança

### Princípio: Specialist agent de domínio, não clone biográfico

Cada specialist (não-chief) tem:
- Disclosure honesto no header e na persona ("NÃO sou clone biográfico")
- Bloco `sources:` com URLs verificáveis e `last_verified`
- Heurísticas com IDs `XX###` + tag `[SOURCE:]` ou `[INFERRED]` obrigatória
- Veto conditions explícitas (segurança, compliance, ética)

### Hierarquia de fontes

Ordem de precedência para resolução de conflitos:

1. `[ML-OFFICIAL]` / `[ML-CENTRAL]` / `[ML-ADS-DOC]` — fontes canônicas oficiais
2. `[CDC]` / `[MARCO-CIVIL]` / `[STJ-JURIS]` — base legal brasileira
3. `[TARCISIO]` / `[BIANCA-MURTA]` / `[GUSTAVO-LUCAS]` / `[ICARO-EBOOK]` / `[FIAMON-S3]` / `[PARROS-CASE]` — referências curadas
4. `[INFERRED]` — última opção, sempre com pedido de validação

### Tier System

| Tier | Papel |
|------|-------|
| **orchestrator** | Routing (MeliDev Chief) |
| **tier_1_specialists** | Specialists ortogonais (melidev, meli-strategist, meli-ops) |

## Handoffs Externos

| Para | Quando |
|---|---|
| `@dev` | Implementar código real no projeto smartpreço |
| `@architect` | Decisão arquitetural macro (filas, storage, escala) |
| `@devops` | git push, deploy, secrets rotation (regra constitucional AIOX) |
| `squad-creator-pro/@oalanicolas` | Usuário tem material denso de pessoa real para mind clone biográfico |

## Notes

- Squad consultivo: **sugere com `[SOURCE:]`, não implementa**. Implementação delega para `@dev`.
- `meli-ops` SEMPRE inclui `[LEGAL-DISCLAIMER]` em comandos sensíveis — não substitui advogado.
- Política do ML muda — campo `last_verified` em todos os sources força re-validação periódica.
- Versão global instalada em `~/.claude/agents/melidev__*.md` (copy literal, não symlink).
