# PRD § 2 — Requirements

> SmartPreço PRD v1.0 — 2026-04-20 | Shard 2/8

## Functional Requirements

| ID | Requisito |
|----|-----------|
| FR01 | O sistema deve permitir entrada de custo do produto (CMV), embalagem, impostos e overhead operacional. |
| FR02 | O sistema deve calcular automaticamente a taxa de venda do ML com base no tipo de anúncio (Grátis 0%, Clássico 11–16%, Premium 16–20%). |
| FR03 | O sistema deve calcular a taxa de parcelamento com base nas parcelas oferecidas (1–3x: 0%, 4–6x: 2.5%, 7–12x: 4.5%, 13–18x: 6.5%). |
| FR04 | O sistema deve calcular o custo total: CMV + embalagem + taxa ML + parcelamento + frete + impostos + overhead. |
| FR05 | O sistema deve exibir: margem real (%), lucro real (R$), ROI (%), break-even (unidades) e preço mínimo viável. |
| FR06 | O simulador de cenários deve exibir uma tabela com faixas de preço mostrando lucro, margem e ROI por faixa. |
| FR07 | O simulador deve identificar e destacar visualmente: zona de prejuízo, zona de atenção e zona saudável. |
| FR08 | O simulador deve sugerir um preço equilibrado baseado em margem-alvo configurável pelo usuário. |
| FR09 | O sistema deve permitir salvar um produto calculado como SKU com nome, foto (opcional) e dados de custo. |
| FR10 | A Central de SKUs deve exibir todos os SKUs salvos com status: Viável ✅, Em atenção ⚠️, Não viável ❌, À venda 🏷️. |
| FR11 | O status do SKU deve ser calculado automaticamente: ≥20% = Viável, 10–19% = Atenção, <10% = Não viável. |
| FR12 | O Bloco Mercado deve permitir busca de anúncios reais do ML por palavra-chave ou categoria. |
| FR13 | O Bloco Mercado deve filtrar automaticamente kits e combos (títulos com "kit", "combo", "par", "2x", "3x", "pacote"). |
| FR14 | O Bloco Mercado deve exibir indicadores: preço, frete grátis, Full, reputação do vendedor, quantidade vendida. |
| FR15 | O Bloco Mercado deve exibir um índice de confiança (% de anúncios limpos vs total). |
| FR16 | O Motor de Decisão deve comparar o preço calculado com os preços do mercado e mostrar posicionamento (abaixo/alinhado/premium). |
| FR17 | O sistema deve oferecer fluxo sequencial: Entrada → Viabilidade → Simulador → Mercado → Decisão. |
| FR18 | O usuário deve poder criar conta e fazer login com email/senha via Supabase Auth. |
| FR19 | Cada usuário deve acessar apenas seus próprios SKUs e cálculos (RLS no Supabase). |
| FR20 | O sistema deve funcionar em dispositivo desktop e tablet (web responsivo). |

## Non-Functional Requirements

| ID | Requisito |
|----|-----------|
| NFR01 | Tempo de resposta para cálculo e simulação: < 500ms. |
| NFR02 | Busca no Bloco Mercado retorna em < 3 segundos. |
| NFR03 | Uptime de 99.5% mensais. |
| NFR04 | Banco de dados com Row Level Security (RLS) do Supabase para isolamento por usuário. |
| NFR05 | Nenhuma credencial exposta no frontend (variáveis de ambiente server-side only). |
| NFR06 | WCAG AA básico (contraste, navegação por teclado nos formulários principais). |
| NFR07 | Suportar até 1.000 usuários simultâneos no MVP sem degradação perceptível. |
| NFR08 | Cobertura de testes unitários ≥ 70% nas funções de cálculo financeiro. |
| NFR09 | Deploy automatizado via CI/CD (GitHub Actions → Vercel/Railway). |
| NFR10 | Taxa de erro em produção monitorada com alertas para erros >1% das requisições. |

---

[← Goals](01-goals-context.md) | [→ UI Design Goals](03-ui-design.md)
