# PRD § 3 — User Interface Design Goals

> SmartPreço PRD v1.0 — 2026-04-20 | Shard 3/8

## Overall UX Vision

Menos planilha, mais ferramenta de operação. O SmartPreço deve parecer uma ferramenta comercial moderna — não um formulário de Excel em HTML. A experiência deve ser fluida, orientada por fluxo (wizard), com feedback visual imediato a cada entrada de dado. O usuário deve sentir que está "no controle dos números" — não que está "preenchendo campos".

## Key Interaction Paradigms

- **Fluxo sequencial em abas/steps:** Entrada → Viabilidade → Simulador → Mercado → Decisão
- **Feedback em tempo real:** Cálculos atualizam conforme o usuário digita (sem "calcular" button)
- **Zonas visuais coloridas:** Verde (viável), amarelo (atenção), vermelho (prejuízo) — usadas consistentemente
- **Cards de SKU:** Central de SKUs usa cards visuais, não tabelas densas
- **Comparação visual:** Bloco Mercado usa lista com badges e indicadores, não tabela

## Core Screens and Views

| # | Tela | Descrição |
|---|------|-----------|
| 1 | Dashboard / Home | Resumo de SKUs ativos, atalho para novo cálculo |
| 2 | Calculadora | Formulário de entrada de custos com preview de resultado em tempo real |
| 3 | Simulador | Tabela de cenários com zonas coloridas e preço recomendado |
| 4 | Bloco Mercado | Busca + lista de anúncios + posicionamento |
| 5 | Tela de Decisão | Resumo final com preço recomendado e justificativa |
| 6 | Central de SKUs | Grid de cards com status e filtros |
| 7 | Detalhe do SKU | Histórico de cálculos e edição |
| 8 | Login / Cadastro | Auth simples com email |

## Accessibility

WCAG AA — foco em contraste adequado e navegação por teclado nos formulários principais.

## Branding

Interface limpa, moderna, com paleta financeira: tons de azul escuro, verde para positivo, vermelho para negativo, amarelo para atenção. Tipografia clara e legível. Sem excessos decorativos — o dado é o protagonista.

## Target Device and Platforms

Web Responsivo — desktop e tablet como prioridade (1280px+, 768px+), mobile como bonus.

---

[← Requirements](02-requirements.md) | [→ Technical Assumptions](04-technical.md)
