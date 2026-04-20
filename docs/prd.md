# SmartPreço Product Requirements Document (PRD)

**Versão:** 1.0  
**Data:** 2026-04-20  
**Status:** Draft  

---

## Change Log

| Data | Versão | Descrição | Autor |
|------|--------|-----------|-------|
| 2026-04-20 | 1.0 | Versão inicial — gerada a partir do Project Brief | Morgan (PM) |

---

## 1. Goals and Background Context

### Goals

- Permitir que vendedores do Mercado Livre calculem o **custo real** de um produto, incluindo todas as taxas da plataforma
- Oferecer um **simulador de cenários** que mostre o comportamento financeiro em diferentes faixas de preço
- Entregar uma **Central de SKUs** para gestão de portfólio com visibilidade de viabilidade por produto
- Integrar dados reais de **anúncios do Mercado Livre** para posicionamento competitivo de preço
- Conduzir o vendedor a uma **decisão de preço** vendável, competitivo e financeiramente sustentável
- Substituir o Excel e a intuição por uma ferramenta de operação comercial real

### Background Context

Vendedores de marketplace — especialmente pequenos e médios operadores do Mercado Livre Brasil — enfrentam um problema estrutural: a opacidade do custo real. As taxas da plataforma (venda, parcelamento, frete Full) somadas ao custo do produto, embalagem e impostos tornam quase impossível calcular o lucro real sem uma ferramenta dedicada. O resultado é precificação por imitação, margens invisíveis e produtos que parecem lucrativos mas geram prejuízo.

O SmartPreço nasce como ferramenta de apoio à decisão de preço: parte do custo real, simula cenários, compara com o mercado e conduz o vendedor a um preço concreto e justificado. Não é uma calculadora — é um sistema de decisão comercial.

---

## 2. Requirements

### Functional Requirements

**FR01:** O sistema deve permitir entrada de custo do produto (CMV), embalagem, impostos e overhead operacional.

**FR02:** O sistema deve calcular automaticamente a taxa de venda do Mercado Livre com base no tipo de anúncio selecionado (Grátis 0%, Clássico 11–16%, Premium 16–20%).

**FR03:** O sistema deve calcular a taxa de parcelamento com base nas parcelas oferecidas (1–3x: 0%, 4–6x: 2.5%, 7–12x: 4.5%, 13–18x: 6.5%).

**FR04:** O sistema deve calcular o custo total da operação: CMV + embalagem + taxa ML + parcelamento + frete + impostos + overhead.

**FR05:** O sistema deve exibir: margem real (%), lucro real (R$), ROI (%), break-even (unidades) e preço mínimo viável.

**FR06:** O simulador de cenários deve exibir uma tabela com faixas de preço mostrando lucro, margem e ROI por faixa.

**FR07:** O simulador deve identificar e destacar visualmente: zona de prejuízo, zona de atenção e zona saudável.

**FR08:** O simulador deve sugerir um preço equilibrado baseado em margem-alvo configurável pelo usuário.

**FR09:** O sistema deve permitir salvar um produto calculado como SKU com nome, foto (opcional) e dados de custo.

**FR10:** A Central de SKUs deve exibir todos os SKUs salvos com status: Viável ✅, Em atenção ⚠️, Não viável ❌, À venda 🏷️.

**FR11:** O status do SKU deve ser calculado automaticamente com base na margem: ≥20% = Viável, 10–19% = Atenção, <10% = Não viável.

**FR12:** O Bloco Mercado deve permitir busca de anúncios reais do Mercado Livre por palavra-chave ou categoria.

**FR13:** O Bloco Mercado deve filtrar automaticamente kits e combos da análise de mercado (títulos com "kit", "combo", "par", "2x", "3x", "pacote").

**FR14:** O Bloco Mercado deve exibir indicadores por anúncio: preço, frete grátis, Full, reputação do vendedor, quantidade vendida.

**FR15:** O Bloco Mercado deve exibir um índice de confiança da base de comparação (% de anúncios limpos vs total).

**FR16:** O Motor de Decisão deve comparar o preço calculado pelo simulador com os preços do mercado e mostrar o posicionamento (abaixo, alinhado, premium).

**FR17:** O sistema deve oferecer fluxo sequencial: Entrada → Viabilidade → Simulador → Mercado → Decisão.

**FR18:** O usuário deve poder criar conta e fazer login com email/senha via Supabase Auth.

**FR19:** Cada usuário deve acessar apenas seus próprios SKUs e cálculos (RLS no Supabase).

**FR20:** O sistema deve funcionar em dispositivo desktop e tablet (web responsivo).

### Non-Functional Requirements

**NFR01:** O tempo de resposta para cálculo de custo e simulação deve ser inferior a 500ms.

**NFR02:** A busca no Bloco Mercado deve retornar resultados em menos de 3 segundos.

**NFR03:** A aplicação deve ter uptime de 99.5% mensais.

**NFR04:** O banco de dados deve usar Row Level Security (RLS) do Supabase para isolamento de dados por usuário.

**NFR05:** Nenhuma credencial ou token deve ser exposto no frontend (variáveis de ambiente server-side only).

**NFR06:** A aplicação deve ser acessível em WCAG AA básico (contraste, navegação por teclado nos formulários principais).

**NFR07:** O sistema deve suportar até 1.000 usuários simultâneos no MVP sem degradação perceptível.

**NFR08:** Todo o código deve ter cobertura de testes unitários ≥ 70% nas funções de cálculo financeiro.

**NFR09:** O deploy deve ser automatizado via CI/CD (GitHub Actions → Vercel/Railway).

**NFR10:** A taxa de erro em produção deve ser monitorada e alertas configurados para erros >1% das requisições.

---

## 3. User Interface Design Goals

### Overall UX Vision

Menos planilha, mais ferramenta de operação. O SmartPreço deve parecer uma ferramenta comercial moderna — não um formulário de Excel em HTML. A experiência deve ser fluida, orientada por fluxo (wizard), com feedback visual imediato a cada entrada de dado. O usuário deve sentir que está "no controle dos números" — não que está "preenchendo campos".

### Key Interaction Paradigms

- **Fluxo sequencial em abas/steps:** Entrada → Viabilidade → Simulador → Mercado → Decisão
- **Feedback em tempo real:** Cálculos atualizam conforme o usuário digita (sem "calcular" button)
- **Zonas visuais coloridas:** Verde (viável), amarelo (atenção), vermelho (prejuízo) — usadas consistentemente
- **Cards de SKU:** Central de SKUs usa cards visuais, não tabelas densas
- **Comparação visual:** Bloco Mercado usa lista com badges e indicadores, não tabela

### Core Screens and Views

1. **Dashboard / Home** — Resumo de SKUs ativos, atalho para novo cálculo
2. **Calculadora** — Formulário de entrada de custos com preview de resultado em tempo real
3. **Simulador** — Tabela de cenários com zonas coloridas e preço recomendado
4. **Bloco Mercado** — Busca + lista de anúncios + posicionamento
5. **Tela de Decisão** — Resumo final com preço recomendado e justificativa
6. **Central de SKUs** — Grid de cards com status e filtros
7. **Detalhe do SKU** — Histórico de cálculos e edição
8. **Login / Cadastro** — Auth simples com email

### Accessibility

WCAG AA — foco em contraste adequado e navegação por teclado nos formulários principais.

### Branding

Interface limpa, moderna, com paleta financeira: tons de azul escuro, verde para positivo, vermelho para negativo, amarelo para atenção. Tipografia clara e legível. Sem excessos decorativos — o dado é o protagonista.

### Target Device and Platforms

Web Responsivo — desktop e tablet como prioridade, mobile como bonus.

---

## 4. Technical Assumptions

### Repository Structure

**Monorepo** — frontend e backend na mesma estrutura, organizado por `packages/` se necessário separar em futuro.

### Service Architecture

**Monolith modular com Next.js App Router:**
- Frontend: Next.js 14+ (App Router) + Tailwind CSS + shadcn/ui
- Backend: API Routes do próprio Next.js (server actions + route handlers)
- Banco: Supabase (PostgreSQL + Auth + RLS + Realtime)
- Deploy: Vercel (frontend + API Routes) + Railway (se serviços adicionais necessários)
- ML API: Calls server-side para evitar CORS e expor credenciais

### Testing Requirements

- **Unit:** Jest + Testing Library para funções de cálculo financeiro (obrigatório, ≥70% cobertura)
- **Integration:** Testes de API Routes com mock do Supabase
- **E2E:** Cypress ou Playwright para fluxos críticos (calculadora → simulador → decisão)
- **Manual:** Checklist de QA para cada story antes de merge

### Additional Technical Assumptions

- Supabase será usado para Auth, banco PostgreSQL e Storage (fotos de SKU)
- As taxas do ML serão mantidas em tabela no banco, atualizáveis sem deploy
- Cache de resultados de busca ML: 1 hora no banco para evitar rate limit
- Variáveis de ambiente sensíveis: nunca expostas no cliente, sempre server-side
- TypeScript obrigatório em todo o codebase
- ESLint + Prettier configurados no setup inicial
- GitHub Actions para CI (lint + test + typecheck) em cada PR

---

## 5. Epic List

### EPIC-01: Fundação & Infraestrutura
Estabelecer o projeto Next.js com Supabase, autenticação, CI/CD e estrutura base — entregando uma aplicação funcional com login e página inicial deployada em produção.

### EPIC-02: Base Financeira — Calculadora de Custo
Implementar o coração do sistema: formulário de entrada de custos com cálculo automático de taxa ML, parcelamento, frete e overhead — exibindo custo total, margem, lucro, ROI, break-even e preço mínimo viável em tempo real.

### EPIC-03: Simulador de Cenários
Construir o simulador de faixas de preço com zonas visuais (prejuízo / atenção / saudável), cálculo de lucro e ROI por cenário e sugestão de preço equilibrado baseado em margem-alvo.

### EPIC-04: Central de SKUs
Implementar o portfólio de produtos: salvar cálculos como SKUs, listar com status automático de viabilidade, histórico de cálculos por produto e filtros por status.

### EPIC-05: Bloco Mercado — Integração ML API
Integrar a API do Mercado Livre para busca de anúncios reais, com filtros de limpeza de base (excluir kits, deduplicar), indicadores de qualidade e índice de confiança da base de comparação.

### EPIC-06: Motor de Decisão & Polish
Implementar a tela de decisão integrando simulador + mercado, mostrar posicionamento competitivo (abaixo/alinhado/premium) e refinar a experiência completa do fluxo para produção.

---

## 6. Epic Details

---

### EPIC-01: Fundação & Infraestrutura

**Objetivo:** Criar a base técnica completa do SmartPreço: repositório, Next.js configurado, Supabase conectado, autenticação funcionando, CI/CD ativo e aplicação deployada em Vercel com uma página inicial acessível. Ao final deste épico, qualquer membro do squad consegue rodar o projeto localmente e fazer deploy em produção.

---

#### Story 1.1 — Setup do Projeto Next.js + Supabase

Como desenvolvedor,  
quero um projeto Next.js 14 configurado com TypeScript, Tailwind, ESLint, Prettier e Supabase conectado,  
para que o squad tenha uma base de desenvolvimento padronizada e funcional.

**Acceptance Criteria:**
1. Projeto criado com `create-next-app` usando TypeScript e Tailwind
2. shadcn/ui instalado e configurado com tema base
3. Supabase client configurado via variáveis de ambiente (server e client)
4. ESLint + Prettier configurados e passando sem erros
5. `npm run dev` sobe localmente sem erros
6. `npm run build` completa sem erros

---

#### Story 1.2 — Autenticação com Supabase Auth

Como vendedor,  
quero criar conta e fazer login com email e senha,  
para que meus dados de SKUs e cálculos sejam salvos e privados.

**Acceptance Criteria:**
1. Página de cadastro com email + senha + confirmação de senha
2. Página de login com email + senha
3. Logout funcional com limpeza de sessão
4. Rota protegida: usuário não autenticado é redirecionado para login
5. Middleware Next.js protege todas as rotas `/app/*`
6. Mensagens de erro claras para email já cadastrado, senha incorreta
7. RLS habilitado no Supabase para todas as tabelas do usuário

---

#### Story 1.3 — CI/CD + Deploy em Produção

Como desenvolvedor,  
quero CI/CD configurado e aplicação deployada em Vercel,  
para que cada PR seja validado automaticamente e o deploy em produção seja automático.

**Acceptance Criteria:**
1. GitHub Actions: lint + typecheck + test em cada PR
2. Deploy automático na Vercel a cada merge na `main`
3. Variáveis de ambiente configuradas na Vercel (Supabase URL + keys)
4. URL de produção acessível e funcional
5. Preview deployments para cada PR
6. Badge de status do CI no README

---

#### Story 1.4 — Estrutura de Navegação e Layout Base

Como vendedor,  
quero uma navegação clara com as seções principais do app,  
para que eu consiga me localizar e acessar qualquer módulo facilmente.

**Acceptance Criteria:**
1. Layout com sidebar ou navbar com links: Dashboard, Nova Análise, Meus SKUs
2. Página de Dashboard com mensagem de boas-vindas e atalho para nova análise
3. Layout responsivo: funciona em desktop (1280px+) e tablet (768px+)
4. Estado ativo na navegação indica a seção atual
5. Header com nome do usuário e botão de logout
6. Loading states para transições de página

---

### EPIC-02: Base Financeira — Calculadora de Custo

**Objetivo:** Entregar o coração do SmartPreço — a calculadora de custo real. O vendedor entra com dados do produto e recebe imediatamente: custo total da operação, margem real, lucro, ROI, break-even e preço mínimo viável. Os cálculos atualizam em tempo real conforme os campos são preenchidos.

---

#### Story 2.1 — Formulário de Entrada de Custos

Como vendedor,  
quero inserir os custos do meu produto (CMV, embalagem, overhead),  
para que o sistema calcule meu custo base de operação.

**Acceptance Criteria:**
1. Campos: Custo do produto (R$), Embalagem (R$), Overhead (R$, opcional)
2. Todos os campos aceitam apenas valores numéricos positivos
3. Validação inline: campo obrigatório destacado se vazio ao tentar avançar
4. Subtotal de custo fixo atualiza em tempo real conforme preenchimento
5. Campo de preço de venda (R$) para base do cálculo
6. Layout limpo com labels claros e placeholders de exemplo

---

#### Story 2.2 — Configuração de Taxas ML

Como vendedor,  
quero selecionar o tipo de anúncio e parcelas que ofereço,  
para que as taxas do Mercado Livre sejam calculadas automaticamente no meu custo.

**Acceptance Criteria:**
1. Seletor de tipo de anúncio: Grátis (0%), Clássico, Premium (com % por categoria)
2. Seletor de parcelas máximas: 1x, 3x, 6x, 12x, 18x
3. Tabela de taxas carregada do banco (atualizável sem deploy)
4. Taxa calculada exibida em R$ e % com base no preço de venda
5. Seletor de modalidade de frete: Sem frete grátis, Envios, Full
6. Custo de frete estimado configurável (R$) para Full e Envios

---

#### Story 2.3 — Resultado Financeiro em Tempo Real

Como vendedor,  
quero ver imediatamente o custo total, margem, lucro e ROI do produto,  
para que eu entenda a viabilidade financeira antes de definir o preço.

**Acceptance Criteria:**
1. Painel de resultados exibe: Custo Total (R$), Margem (%), Lucro (R$), ROI (%)
2. Exibe Break-even (quantidade de unidades para cobrir custo fixo mensal, se configurado)
3. Exibe Preço Mínimo Viável (preço onde margem = 0%)
4. Todos os valores atualizam em tempo real (sem botão "calcular")
5. Indicador visual de saúde: verde (margem ≥20%), amarelo (10-19%), vermelho (<10%)
6. Fórmulas de cálculo exibíveis em tooltip para transparência

---

### EPIC-03: Simulador de Cenários

**Objetivo:** Transformar o cálculo financeiro em leitura prática de mercado. O simulador gera automaticamente uma tabela de faixas de preço, mostra onde o produto entra no lucro, identifica a faixa saudável e sugere um preço equilibrado baseado em margem-alvo configurável pelo usuário.

---

#### Story 3.1 — Tabela de Cenários de Preço

Como vendedor,  
quero ver uma tabela com diferentes faixas de preço e o lucro em cada uma,  
para que eu entenda como o preço impacta minha margem.

**Acceptance Criteria:**
1. Tabela gerada automaticamente com 10–15 faixas de preço ao redor do preço base
2. Colunas: Preço de Venda, Lucro (R$), Margem (%), ROI (%)
3. Faixas geradas em incrementos de 5–10% acima e abaixo do preço base
4. Linha do preço atual destacada visualmente
5. Tabela atualiza automaticamente quando dados da calculadora mudam
6. Exportação da tabela como CSV (opcional nice-to-have)

---

#### Story 3.2 — Zonas Visuais e Preço Recomendado

Como vendedor,  
quero ver claramente quais preços dão prejuízo, quais são aceitáveis e quais são saudáveis,  
para que eu tome uma decisão de preço com confiança.

**Acceptance Criteria:**
1. Zona vermelha: linhas onde margem < 0% (prejuízo)
2. Zona amarela: linhas onde margem 0–19% (atenção)
3. Zona verde: linhas onde margem ≥20% (saudável)
4. Campo de margem-alvo configurável pelo usuário (default: 20%)
5. Preço recomendado calculado: primeiro preço que atinge a margem-alvo
6. Badge "Recomendado" destacado na linha do preço sugerido
7. Legenda explicando as zonas de cor

---

### EPIC-04: Central de SKUs

**Objetivo:** Transformar o SmartPreço de uma calculadora avulsa em uma ferramenta de portfólio. O vendedor salva seus produtos calculados, acompanha o status de viabilidade de cada SKU ao longo do tempo e tem uma visão consolidada de quais produtos estão saudáveis, em atenção ou no vermelho.

---

#### Story 4.1 — Salvar SKU após Cálculo

Como vendedor,  
quero salvar o cálculo do meu produto como um SKU nomeado,  
para que eu possa revisitar e atualizar seus dados depois.

**Acceptance Criteria:**
1. Botão "Salvar como SKU" disponível após cálculo completo
2. Modal para inserir nome do SKU (obrigatório) e notas (opcional)
3. SKU salvo no Supabase com todos os dados de custo e resultado
4. Feedback visual de confirmação após salvar
5. SKU aparece imediatamente na Central de SKUs
6. Possibilidade de atualizar dados de um SKU existente (nova versão do cálculo)

---

#### Story 4.2 — Central de SKUs com Status

Como vendedor,  
quero ver todos os meus produtos salvos com seu status de viabilidade,  
para que eu tenha uma visão rápida do meu portfólio.

**Acceptance Criteria:**
1. Grid de cards exibindo todos os SKUs do usuário
2. Cada card mostra: nome, preço atual, margem, status (badge colorido)
3. Status calculado automaticamente: Viável (≥20%), Atenção (10-19%), Não viável (<10%), À venda (marcado manualmente)
4. Filtros por status (Todos, Viável, Atenção, Não viável, À venda)
5. Busca por nome do SKU
6. Ordenação por nome, margem, data de criação
7. Opção de deletar SKU com confirmação

---

#### Story 4.3 — Detalhe e Histórico do SKU

Como vendedor,  
quero ver o histórico de cálculos de um SKU e editar seus dados,  
para que eu acompanhe a evolução da viabilidade do produto ao longo do tempo.

**Acceptance Criteria:**
1. Página de detalhe do SKU abre ao clicar no card
2. Exibe cálculo atual completo (todos os campos e resultados)
3. Histórico de versões anteriores do cálculo (data + margem)
4. Botão "Recalcular" abre a calculadora preenchida com dados atuais
5. Campo de notas editável
6. Botão "Marcar como À venda" / "Retirar de venda"

---

### EPIC-05: Bloco Mercado — Integração ML API

**Objetivo:** Trazer o mercado real para dentro da análise. O vendedor busca produtos similares no Mercado Livre e vê como seu preço se posiciona frente à concorrência real — com base limpa, filtrada e confiável.

---

#### Story 5.1 — Busca de Anúncios ML

Como vendedor,  
quero buscar produtos similares ao meu no Mercado Livre,  
para que eu veja os preços reais praticados no mercado.

**Acceptance Criteria:**
1. Campo de busca por palavra-chave
2. Resultados buscados server-side (API Route Next.js → ML API)
3. Exibe até 50 anúncios por busca
4. Cada resultado mostra: título, preço, frete grátis, Full (badge), reputação do vendedor, vendidos
5. Loading state durante a busca
6. Mensagem clara se API ML retornar erro ou nenhum resultado
7. Cache de resultado no Supabase por 1 hora para mesma query

---

#### Story 5.2 — Filtros e Limpeza de Base

Como vendedor,  
quero que kits, combos e anúncios irrelevantes sejam removidos automaticamente,  
para que minha base de comparação seja confiável.

**Acceptance Criteria:**
1. Filtro automático de kits: remove títulos com "kit", "combo", "par", "2x", "3x", "pacote", "caixa com"
2. Filtro de condição: novo / usado / todos
3. Filtro manual de frete grátis
4. Deduplicação: anúncios com preço e título idênticos são agrupados
5. Índice de confiança exibido: "Base limpa: X de Y anúncios (Z%)"
6. Usuário pode incluir/excluir anúncios manualmente

---

#### Story 5.3 — Análise de Posicionamento

Como vendedor,  
quero ver como meu preço se posiciona em relação ao mercado,  
para que eu entenda se estou competitivo, acima ou abaixo da média.

**Acceptance Criteria:**
1. Métricas da base: preço mínimo, máximo, mediana, média
2. Posição do preço calculado destacada na distribuição de preços
3. Badge de posicionamento: "Abaixo do mercado", "Alinhado", "Acima do mercado"
4. Gráfico simples de distribuição de preços (barras ou pontos)
5. Indicação de quantos sellers têm Full ativo
6. Botão "Usar este preço" para levar o preço de um concorrente para o simulador

---

### EPIC-06: Motor de Decisão & Polish

**Objetivo:** Unir todos os módulos em uma experiência de decisão fluida. O Motor de Decisão integra os outputs do Simulador e do Bloco Mercado para apresentar uma recomendação de preço clara e justificada. O polish final garante que a experiência completa seja coesa, rápida e pronta para produção.

---

#### Story 6.1 — Tela de Decisão Integrada

Como vendedor,  
quero ver uma recomendação de preço consolidada com base no meu custo e no mercado,  
para que eu tome uma decisão de preço com total confiança.

**Acceptance Criteria:**
1. Tela de Decisão exibe: preço recomendado pelo simulador + posição no mercado
2. Três opções de posicionamento apresentadas: Econômico (abaixo), Competitivo (alinhado), Premium (acima)
3. Para cada opção: preço sugerido, margem resultante, posição no mercado
4. Botão "Adotar este preço" salva o preço escolhido no SKU
5. Resumo da análise: custo total, margem, mercado (mediana), gap do preço escolhido
6. Fluxo completo navegável: Calculadora → Simulador → Mercado → Decisão

---

#### Story 6.2 — Refinamentos de UX e Performance

Como vendedor,  
quero uma experiência fluida, rápida e sem fricção em todo o app,  
para que usar o SmartPreço seja mais simples do que usar uma planilha.

**Acceptance Criteria:**
1. Tempo de carregamento inicial < 2s (Vercel + Next.js SSR)
2. Feedback visual em todas as ações (loading, success, error states)
3. Formulários salvam estado automaticamente (não perdem dados ao navegar)
4. Responsividade validada em: desktop 1440px, laptop 1280px, tablet 768px
5. Mensagens de erro amigáveis (sem stack traces para o usuário)
6. Onboarding: tooltip ou tour guiado na primeira sessão do usuário
7. Favicon, metadata OpenGraph e título correto em todas as páginas

---

## 7. Checklist Results

*A ser executado pelo @pm após revisão do usuário.*

---

## 8. Next Steps

### UX Expert Prompt

```
@ux-design-expert — PRD do SmartPreço aprovado. Criar especificação de frontend
para os 6 épicos, com foco no fluxo Calculadora → Simulador → Mercado → Decisão.
Stack: Next.js + Tailwind + shadcn/ui. Referenciar: docs/prd.md e docs/brief.md.
```

### Architect Prompt

```
@architect — PRD do SmartPreço aprovado. Criar documento de arquitetura técnica
cobrindo: estrutura de pastas Next.js App Router, schema Supabase (SKUs, cálculos,
taxas ML, cache de busca), API Routes para ML API, estratégia de RLS, e configuração
de CI/CD. Referenciar: docs/prd.md e docs/brief.md.
```
