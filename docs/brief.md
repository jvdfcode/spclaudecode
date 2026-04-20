# Project Brief: SmartPreço

**Versão:** 1.0  
**Data:** 2026-04-20  
**Autor:** Atlas (Analyst) — AIOX SmartPreço Squad  

---

## Executive Summary

O **SmartPreço** é uma ferramenta de apoio à decisão de preço para vendedores de marketplace, com foco inicial no Mercado Livre Brasil. A partir do custo real do produto, o sistema calcula viabilidade financeira, simula cenários de preço e compara com o mercado real — conduzindo o vendedor a uma decisão comercial concreta: *por quanto vender*.

**Problema:** Vendedores definem preço por intuição ou cópia da concorrência, sem saber se estão tendo lucro real após taxas, frete e custos operacionais.  
**Solução:** Sistema que une custo real + simulação + mercado → preço vendável, competitivo e sustentável.  
**Mercado-alvo:** Vendedores ativos no Mercado Livre Brasil (MLB), especialmente pequenos e médios operadores de marketplace.

---

## Problem Statement

### Situação atual

Vendedores de marketplace enfrentam um problema estrutural: **a opacidade do custo real**. As taxas do Mercado Livre são complexas, variam por categoria, tipo de anúncio e modalidade de envio. Somadas ao custo do produto, embalagem, impostos e tempo operacional, tornam quase impossível calcular o lucro real sem uma ferramenta dedicada.

### Dores específicas

1. **Custo invisível:** Taxa de venda (11-20% por categoria), taxa de parcelamento (até 4%), frete Full ou normal — cada um cobra uma fatia que o vendedor frequentemente desconhece no detalhe.
2. **Preço por imitação:** A estratégia mais comum é copiar o concorrente, sem saber se aquele preço dá lucro.
3. **Decisão sem contexto:** Mesmo quem calcula o custo, não consegue visualizar como o preço se posiciona no mercado real.
4. **Portfólio sem controle:** Quem vende múltiplos SKUs não tem visão consolidada de quais produtos são viáveis, quais estão no limite e quais dão prejuízo.

### Por que agora

O volume de vendedores no ML Brasil cresce anualmente. A competição por preço aumenta. Margem encolhe. Quem não tiver controle financeiro real vai ser expulso pelo mercado.

---

## Proposed Solution

O SmartPreço resolve o problema em 5 camadas integradas:

### 1. Base Financeira
Entrada dos custos reais do produto:
- Custo do produto (CMV)
- Embalagem e materiais
- Taxa de venda ML (automática por categoria/tipo de anúncio)
- Taxa de parcelamento
- Custo do frete (Full, Envios, próprio)
- Impostos / regime tributário
- Overhead operacional (opcional)

**Output:** Custo total real, margem real, lucro real, ROI, break-even, preço mínimo viável.

### 2. Simulador de Cenários
Tabela interativa com faixas de preço:
- Mostra onde o produto sai do prejuízo
- Identifica a faixa de lucro saudável
- Calcula ROI por cenário
- Sugere preço equilibrado baseado em margem-alvo

**Output:** Preço recomendado com lógica equilibrada (base do sistema).

### 3. Central de SKUs
Portfólio de produtos com:
- Histórico de cálculos por SKU
- Status: Viável ✅ | Em atenção ⚠️ | Não viável ❌ | À venda 🏷️
- Revisão periódica de viabilidade
- Comparação entre SKUs

### 4. Bloco Mercado (ML API Integration)
Busca de anúncios reais do Mercado Livre:
- Pesquisa por produto/categoria
- Filtros: unitário vs kit, condição, frete grátis, Full
- Deduplicação e limpeza de base
- Indicadores: nota do vendedor, Full, destaque, quantidade vendida
- Índice de confiança da base de comparação

**Output:** Posicionamento do preço calculado vs mercado real.

### 5. Motor de Decisão
Integração dos 4 módulos:
- Simulador define a base interna equilibrada
- Mercado mostra o posicionamento competitivo
- Sistema apresenta opções de posicionamento (abaixo, alinhado, premium)
- Recomendação final: preço vendável + sustentável

---

## Target Users

### Segmento Primário: Vendedor Ativo ML (Pequeno/Médio)

- **Perfil:** Pessoa física ou ME/EPP vendendo no ML como atividade principal ou complementar
- **Volume:** 10–500 SKUs ativos, faturamento R$ 5K–R$ 100K/mês
- **Comportamento atual:** Controla custo em planilha Excel ou não controla formalmente
- **Dor principal:** Não sabe se está tendo lucro real após todas as taxas
- **Objetivo:** Precificar com segurança, escalar vendas sem perder margem

### Segmento Secundário: Full Seller / Operação Maior

- **Perfil:** Seller com operação estruturada, equipe, múltiplos canais
- **Volume:** 500+ SKUs, faturamento R$ 100K+/mês
- **Necessidade adicional:** Visão consolidada de portfólio, análise de margem por canal
- **Futuro:** Expansão para Amazon, Shopee (v2)

---

## Goals & Success Metrics

### Objetivos de Negócio

- Ser a ferramenta de referência para decisão de preço no ML Brasil
- Atingir 1.000 usuários ativos nos primeiros 6 meses pós-lançamento
- NPS ≥ 50 após 90 dias de uso
- Taxa de retenção mensal ≥ 60%

### Métricas de Sucesso do Usuário

- Tempo para primeira decisão de preço: < 5 minutos
- Usuário consegue calcular custo real de um SKU sem ajuda externa
- Usuário consegue comparar seu preço com o mercado em < 2 minutos
- Redução percebida de incerteza na precificação

### KPIs

- **Cálculos realizados/semana:** meta 500 na semana 4 pós-lançamento
- **SKUs salvos por usuário:** meta média de 5 SKUs por usuário ativo
- **Busca de mercado utilizada:** % de sessões que usam o Bloco Mercado > 60%
- **Decisão de preço tomada:** % de sessões que terminam com preço definido > 70%

---

## MVP Scope

### Core Features (Must Have)

- **Calculadora de custo real:** Entrada de CMV, taxa ML automática por tipo de anúncio, frete, parcelamento → custo total + margem + lucro + ROI + break-even + preço mínimo
- **Simulador de cenários:** Tabela de faixas de preço com lucro e ROI por faixa, indicando preço equilibrado
- **Bloco Mercado básico:** Busca de produtos no ML, listagem de anúncios, filtro unitário vs kit, deduplicação básica
- **Central de SKUs:** Salvar, listar e revisar produtos calculados com status de viabilidade
- **Fluxo integrado:** Entrada → Viabilidade → Simulador → Mercado → Decisão

### Out of Scope para MVP

- Suporte a Amazon, Shopee, outros canais
- Integração direta com conta ML do vendedor (autenticação OAuth)
- Gestão de estoque
- Emissão de nota fiscal
- Relatórios financeiros avançados
- App mobile nativo
- Multi-usuário / equipes

### MVP Success Criteria

Um vendedor sem conhecimento técnico consegue, em uma sessão de 10 minutos, calcular o custo real de um produto, simular 3 cenários de preço e comparar com o mercado — saindo com um preço definido e justificado.

---

## Post-MVP Vision

### Fase 2
- Autenticação ML (OAuth) — acesso a dados reais do vendedor: anúncios ativos, vendas, taxas reais
- Alertas de margem: notificar quando custo ou concorrência muda e impacta viabilidade
- Análise por categoria: benchmarks de margem por nicho
- Exportação de relatórios (PDF, Excel)

### Visão de Longo Prazo (12-24 meses)
- Expansão: Amazon Brasil, Shopee, Magalu, OLX
- Inteligência de mercado: tendências de preço, sazonalidade
- Sugestão de preço por ML (modelo preditivo)
- Plano SaaS com tiers (Free → Pro → Business)

### Oportunidades de Expansão
- API para integração com ERPs de e-commerce
- White-label para aceleradoras de marketplace
- Consultoria de precificação assistida por IA

---

## Technical Considerations

### Stack Confirmada

- **Frontend:** Next.js 14+ (App Router) + Tailwind CSS + shadcn/ui
- **Backend:** Node.js + TypeScript (API Routes no Next.js ou serviço separado)
- **Banco:** Supabase (PostgreSQL + Auth + RLS + Storage)
- **Deploy:** Vercel (frontend) + Railway (backend se separado)

### Mercado Livre API — Estrutura Técnica

#### Autenticação
- **Tipo:** OAuth 2.0
- **Registro:** developers.mercadolivre.com.br → criar App → Client ID + Client Secret
- **Token:** Access token (6h) + Refresh token (para renovação)
- **Endpoints públicos (sem auth):** search, categories, items por ID
- **Endpoints autenticados:** fees, seller data, orders, inventory

#### Endpoints Relevantes para o SmartPreço

```
# Busca de anúncios (público)
GET /sites/MLB/search?q={query}&category={id}&limit={n}&offset={n}
  Parâmetros úteis: price, condition, shipping_cost=free, power_seller_status

# Item individual (público)
GET /items/{item_id}
  Retorna: title, price, currency_id, condition, listing_type_id,
           shipping.free_shipping, shipping.logistic_type,
           seller_address, sold_quantity, tags, catalog_listing

# Taxas de venda (requer auth do vendedor)
POST /items/{item_id}/fees
  Retorna: sale_fee_amount, financing_fee_amount, shipping_fee_amount

# Categorias
GET /sites/MLB/categories
GET /categories/{category_id}

# Tipos de anúncio
GET /sites/MLB/listing_types
  Retorna: free, bronze, silver, gold, gold_special, gold_pro, gold_premium
```

#### Estrutura de Taxas ML Brasil (MLB) — Referência

| Tipo de Anúncio | Taxa de Venda | Observação |
|----------------|---------------|------------|
| Grátis         | 0%            | Sem destaque, limite de quantidade |
| Clássico       | 11–16%        | Varia por categoria |
| Premium        | 16–20%        | Máxima exposição |

**Categorias com taxa mais alta (~16%):** Moda, Beleza, Brinquedos  
**Categorias com taxa mais baixa (~11%):** Indústria e Comércio, Agro

#### Taxas de Parcelamento (vendedor absorve)
| Parcelas | Custo aproximado para o vendedor |
|----------|----------------------------------|
| 1–3x     | 0% (sem custo)                   |
| 4–6x     | ~2.5%                            |
| 7–12x    | ~4.5%                            |
| 13–18x   | ~6.5%                            |

#### Frete Mercado Envios Full
- ML gerencia: estoque, separação, embalagem, envio
- Custo: varia por peso/dimensão (R$ 7–25+ por envio)
- Badge "Full" melhora ranking e conversão significativamente

### Considerações de Arquitetura

- **Dados de taxas:** Manter tabela local de taxas por categoria (atualizar periodicamente via API autenticada ou manualmente)
- **Cache de busca ML:** Resultados de search cacheados por 1h no Supabase para evitar rate limit
- **RLS Supabase:** Cada usuário acessa apenas seus próprios SKUs e cálculos
- **Rate limit ML API:** 1 req/seg sem auth, 10 req/seg com auth de app

---

## Constraints & Assumptions

### Constraints

- **API ML sem autenticação no MVP:** Busca pública tem rate limit menor e menos dados; autenticação OAuth será Fase 2
- **Taxas estáticas no MVP:** Tabela de taxas mantida manualmente até ter autenticação ML
- **Sem integração financeira:** Não conecta com conta bancária ou ERP no MVP
- **Stack web-first:** Não há app mobile no MVP

### Key Assumptions

- Vendedor tem acesso a computador/tablet durante precificação
- Vendedor conhece o custo do produto que está calculando
- A maioria dos vendedores-alvo opera no regime Simples Nacional ou MEI
- Busca pública ML retorna dados suficientes para análise de mercado sem autenticação
- Vendedores estão dispostos a usar uma ferramenta web para precificar (vs Excel)

---

## Risks & Open Questions

### Key Risks

- **API ML bloqueada por IP:** A API pública pode bloquear requests de servidor — será necessário proxy, credenciais de app ou scraping controlado
- **Mudança de taxas ML:** O ML altera taxas periodicamente — manter tabela atualizada manualmente é frágil
- **Concorrência:** Ferramentas similares existem (Precifica, Olist Price) — diferencial deve ser UX superior e foco em decisão, não só cálculo
- **Retenção:** Usuário pode calcular uma vez e não voltar — Central de SKUs e alertas são críticos para retenção

### Open Questions

- O usuário vai querer conectar sua conta ML (OAuth) no MVP ou isso é Fase 2?
- Qual o modelo de monetização: freemium, assinatura, por uso?
- Como lidar com produtos que vendem em kit vs unitário na comparação de mercado?
- O cálculo de impostos deve suportar Simples, Lucro Presumido e MEI?

### Areas Needing Further Research

- **ML App Registration:** Confirmar fluxo de criação de App no portal de devs ML para obter Client ID
- **Rate limits reais:** Testar limites de request da API pública de busca em produção
- **Concorrência detalhada:** Mapear Precifica, Olist Price, Tiny ERP pricing — gaps de UX
- **Estrutura de taxas 2026:** Validar tabela de taxas atual no painel ML

---

## Appendix A — Mercado Livre API Research

### Portal de Desenvolvedores
- **URL:** https://developers.mercadolibre.com.br
- **Registro de App:** Criar aplicação → Client ID + Secret → OAuth flow
- **Documentação:** /jms/mlb/docs/

### Endpoints Críticos para SmartPreço

```bash
# 1. BUSCA DE PRODUTOS (Bloco Mercado)
GET https://api.mercadolibre.com/sites/MLB/search
  ?q=produto
  &category=MLB1051
  &price=*-500          # até R$ 500
  &condition=new
  &shipping_cost=free    # só frete grátis
  &power_seller_status=platinum  # top sellers
  &limit=50
  &offset=0

# Response relevante por item:
{
  "id": "MLB...",
  "title": "...",
  "price": 89.90,
  "currency_id": "BRL",
  "condition": "new",
  "listing_type_id": "gold_pro",
  "shipping": {
    "free_shipping": true,
    "logistic_type": "fulfillment"  // Full
  },
  "seller": {
    "id": 123,
    "nickname": "VENDEDOR",
    "reputation": { "level_id": "5_green" }  // Reputação
  },
  "sold_quantity": 450,
  "catalog_listing": true,  // Anúncio catálogo
  "tags": ["good_quality_thumbnail", "dragged_bids_and_visits"]
}

# 2. TAXAS (requer auth — Fase 2)
POST https://api.mercadolibre.com/items/{item_id}/fees
Response:
{
  "sale_fee_amount": 13.50,      // Taxa de venda
  "financing_fee_amount": 2.10,  // Taxa de parcelamento
  "free_shipping_cost": 8.00     // Custo do frete grátis assumido
}

# 3. CATEGORIAS (público)
GET https://api.mercadolibre.com/sites/MLB/categories
GET https://api.mercadolibre.com/categories/MLB1051/fee_structure (requer auth)
```

### Filtros para "Base Limpa" no Bloco Mercado

Para garantir base de comparação confiável, filtrar:
1. **Excluir kits:** title não contém "kit", "combo", "par", "2x", "3x", "pacote"
2. **Excluir importados genéricos:** Sellers sem reputação (level_id = null)
3. **Deduplicar:** Agrupar por título similar (distância de Levenshtein < 20%)
4. **Relevância:** Priorizar sold_quantity > 10, reputação ≥ verde
5. **Indicador de confiança:** % de anúncios "limpos" vs total retornado

---

## Next Steps

### Ações Imediatas

1. Registrar App no portal ML para obter Client ID (https://developers.mercadolivre.com.br)
2. Confirmar tabela de taxas ML atualizada para 2026
3. Handoff para `@pm` criar PRD completo com base neste brief
4. Handoff para `@architect` definir arquitetura detalhada (Next.js + Supabase)
5. Handoff para `@data-engineer` criar schema do banco (SKUs, cálculos, anúncios ML)

### PM Handoff

Este Project Brief fornece o contexto completo do SmartPreço. O `@pm` deve iniciar em modo PRD Generation, revisando o brief para criar o PRD seção a seção, com acceptance criteria e épicos bem definidos para os 5 módulos: Base Financeira, Simulador, Central de SKUs, Bloco Mercado e Motor de Decisão.
