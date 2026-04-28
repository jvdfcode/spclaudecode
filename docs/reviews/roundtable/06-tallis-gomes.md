# Tallis Gomes [SINTETIZADO] — Análise Pragmática de Execução

> "O que ganha campeonato é consistência, cultura, gente boa e visão de futuro." — Tallis Gomes (24 horas com Tallis Gomes, transcrição YouTube)
>
> ⚠️ Persona sintetizada de fontes públicas (dossier ~/Downloads/tallis_gomes_relatorio.md + transcrições YouTube). Esta é uma INTERPRETAÇÃO da voz dele, não uma representação oficial.

---

## Veredito (1 frase)

O SmartPreço tem tese forte e base técnica decente, mas está jogando defesa quando o campeonato exige ataque — 54 débitos catalogados, 6-7 sprints de paydown projetados, e nenhuma linha sobre quem é o vendedor ML que vai pagar pelo produto.

---

## 3 Fortalezas (pelo crivo da execução)

1. **Tese validada no pain point real.** [SINTETIZADO] Pricing para vendedor de ML é confuso por natureza — comissão variável, frete, taxa de anúncio, concorrência dinâmica. O motor de cálculo está completo e testado. Isso é o Alfredo fora do escritório: gera valor direto para o usuário. Manter o foco aqui.

2. **Stack não é problema, é ativo.** Next.js 14 App Router + Supabase + RLS extensivo com score 8/10 em arquitetura (assessment Fase 8). Design system com tokens semânticos em 9/10. Decisão técnica foi boa. Quem acertou a fundação pode correr mais rápido. [SINTETIZADO]

3. **Time já resolveu itens críticos sem precisar de sprint formal.** Durante o ciclo brownfield, vários débitos foram resolvidos inline: índices M007, RLS otimizado, toast Sonner, MobileDrawer base. Isso é sinal de cultura de execução incremental — consistência operacional que distingue time bom de time que faz planejamento bonito e não entrega. [SINTETIZADO]

---

## 5 Fraquezas / Gaps de execução

1. **ICP ausente em 100% do discovery.** Quatro documentos, nenhuma menção ao perfil do vendedor-alvo. É o vendedor casual com 20 SKUs? O seller profissional com 500 SKUs e equipe? Isso não é detalhe de produto — é pré-requisito para SDR, para preço de assinatura, para onboarding. Sem ICP, o roadmap está construído no vácuo. [SINTETIZADO]

2. **Roadmap 100% defensivo, zero ofensivo.** O EPIC-TD-001 e todo o TECHNICAL-DEBT-REPORT são paydown puro. Nenhum epic de aquisição, nenhuma feature de retenção, nenhuma métrica de receita no horizonte H1/H2. [SINTETIZADO] Quando Tallis tocou Easy Taxi, a corrida para validar mercado e adquirir motoristas aconteceu enquanto o código tinha débito técnico — não depois de pagá-lo. Adiar crescimento para pagar débito é uma escolha que tem custo de oportunidade real.

3. **6-7 sprints de paydown = momentum perdido para concorrente.** O TECHNICAL-DEBT-REPORT estima 24-33 dias de trabalho só para H1+H2. Se o sprint é de 2 semanas, são 3-4 meses de time focado em infraestrutura. [SINTETIZADO] O concorrente que não tem design system perfeito mas está adquirindo vendedores nesse período ganha terreno que não se recupera.

4. **Time e presença não documentados.** O discovery não menciona tamanho do time, se é presencial ou remoto, se os founders estão na operação diária. [SINTETIZADO] Para Tallis, presença é prioridade — "As pessoas que falam que não tem tempo, elas estão mentindo para elas mesmas. Não é prioridade para elas." — Tallis Gomes (citação do dossier). Sem essa informação, não é possível avaliar se o ritmo de execução é real ou documentado.

5. **Observabilidade zero em produção hoje (DEBT-H3, DEBT-DB-C2).** Sentry Edge com `tracesSampleRate: 0` significa que os problemas reais dos primeiros usuários são invisíveis. [SINTETIZADO] Sem dados de produção, não tem como pivotar com evidência. A tese pode estar errada e o produto não vai saber.

---

## Comparativo serial founder

**Como Tallis tocou Easy Taxi / Singu:**
[SINTETIZADO] A narrativa pública de Tallis sobre Easy Taxi é de execução brutal com recurso limitado — validar o modelo de negócio e crescer usuários primeiro, refinar produto depois. A venda para a Cabify veio de tração, não de código perfeito. O mesmo padrão se repetiu na Singu com vendedoras de beleza: o produto foi para o mercado com limitações técnicas, e a operação corrigiu o curso baseada em feedback real de usuárias.

**Como o SmartPreço está tocando agora:**
O ciclo brownfield gerou um assessment técnico de alta qualidade — 4 documentos, 54 débitos catalogados com IDs rastreáveis, roadmap em 3 horizontes, KPIs mensuráveis. O problema não é a qualidade da análise. O problema é que o time investiu ciclos significativos em discovery técnico sem documentar nenhuma métrica de tração: quantos vendedores ML estão usando? Qual é a taxa de retenção? O que o usuário mais reclama? O discovery está para dentro (código), não para fora (mercado).

---

## 3 Recomendações

1. **Definir ICP antes de executar qualquer sprint de paydown.** Uma sessão de 2h com 5 vendedores ML reais define o perfil. Esse ICP vai determinar quais débitos realmente bloqueiam conversão (ex: mobile UX — TD-FEAT-02 — pode ser mais crítico que LGPD se o ICP usa celular) e quais podem esperar. Executar paydown sem ICP é otimizar para o errado.

2. **Separar debt paydown de feature delivery no mesmo sprint.** [SINTETIZADO] Não pausar o produto para pagar débito. Os blocos críticos de H1 (DEBT-DB-H3, DEBT-DB-C3 — race conditions que quebram funcionalidade central) merecem sprint dedicado. O resto do paydown deve rodar em paralelo com aquisição de usuários, não em série. Cada sprint tem que ter pelo menos uma entrega que o usuário vê.

3. **Instrumentar o produto antes de qualquer outra coisa.** Fix DEBT-H3 (Sentry Edge `tracesSampleRate`) e DEBT-OBS-01 são os primeiros itens — não porque são sexy, mas porque sem observabilidade os primeiros 100 usuários vão ensinar o produto a falhar em silêncio. [SINTETIZADO] Dados de produção valem mais que qualquer planejamento técnico documentado.

---

## Provocação Tallis

[SINTETIZADO] O discovery está impecável para uma empresa que vai apresentar o board. Mas o campeonato não é ganho no relatório — é ganho na consistência de quem está colocando vendedor ML dentro do produto toda semana. Quem é esse vendedor? Onde ele está? Quantos entraram essa semana? Se a resposta for "não sei", o maior débito técnico do SmartPreço não está em nenhuma tabela do TECHNICAL-DEBT-REPORT — está na ausência de uma operação comercial rodando enquanto o time arruma o código.
