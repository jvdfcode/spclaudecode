# Uma — Diagnóstico de UX/Halo para Produção

> "Halo no Figma vs Halo na rua — produção é o teste."

---

## Veredito (1 frase)

O Halo v1.1 está estruturalmente correto no código — tokens canônicos, §12.5 (cor + ícone + texto) aplicado, focus trap ativo — mas quatro gaps concretos bloqueiam produção: `aria-busy` ausente no CTA principal de `/calculadora-livre`, focus ring divergente dos inputs internos do formulário, KPI tile §9.7 não existe como componente formal (risco real em `/dashboard/kpis`), e empty/error state de Supabase desconectado não tem representação visual definida em nenhuma rota autenticada.

---

## 5 problemas-raiz no escopo de UX/Halo

**1. Focus ring inconsistente nos inputs de LeadMagnetForm — §12.2**
— Rota `/calculadora-livre` · `LeadMagnetForm.tsx:169,187,229,333`
— Evidência: inputs usam `focus:ring-2 focus:ring-halo-navy/20` (cor Eclipse, opacidade 20%) em vez do ring canônico Halo §12.2: `4px solid --halo-orange-15` + borda Solar. O select de parcelamento e o checkbox de LGPD seguem o mesmo padrão divergente. O input de email da captura de lead replica o mesmo desvio.
— Severidade: **bloqueador de produção** — WCAG 2.4.7 exige foco visível; o ring Eclipse/20% falha em fundos brancos (contraste insuficiente para usuários com baixa visão). Afeta o único funil de conversão da rota pública.

**2. `aria-busy` ausente no CTA de cálculo — §9.1 (estado Loading)**
— Rota `/calculadora-livre` · `LeadMagnetForm.tsx:239–244`
— Evidência: o botão "Calcular viabilidade" não tem `aria-busy` nem `aria-live` durante o cálculo síncrono local. O botão de captura de lead tem `aria-busy={pending}` corretamente (linha 358), mas o botão de cálculo — ação primária da tela — omite o atributo. O resultado aparece via `aria-live="polite"` na `<section>` (linha 249), o que mitiga parcialmente para leitores de tela, mas o estado do botão em si permanece sem semântica.
— Severidade: **bloqueador de produção** — WCAG 4.1.3 (Status Messages); impacto direto em usuários de screen reader na rota de maior tráfego orgânico.

**3. KPI tile §9.7 inexistente como componente formal — gap pós-Onda 4**
— Rota `/dashboard/kpis` (inferido) · sem arquivo `KpiTile.tsx` em `src/components/ui/`
— Evidência: `ResultCard.tsx` resolve a semântica de viabilidade em `/calculadora-livre` com tones `profit/warn/loss`, mas o §9.7 especifica uma anatomia distinta: `LABEL (mono 10 caps)`, `Numeric Display 56px`, delta em mono 12px, variante `kpi__item--accent` (Solar, um por dashboard). Se `/dashboard/kpis` usa `ResultCard` como substituto, o valor numérico principal renderiza em `text-[1.8rem]` (~29px) em vez dos 56px do Numeric Display — hierarquia de dado colapsada, leitura de KPI em 3 segundos comprometida (promessa da tagline).
— Severidade: **bloqueador de produção para rotas autenticadas** — não afeta `/calculadora-livre` ou `/precos`, mas torna `/dashboard/kpis` visualmente substandard na primeira impressão pós-login.

**4. Empty state e error state de Supabase indefinidos em rotas autenticadas — §10**
— Rotas `/dashboard`, `/skus`, `/mercado` · `AppShell.tsx` (sem skeleton/empty)
— Evidência: `AppShell.tsx` entrega `children` diretamente em `<main>` sem nenhum slot de loading skeleton, `aria-busy` de página ou fallback visual. Quando o Supabase real desconecta ou a query demora, o usuário vê layout vazio sem sinal de estado. O `skeleton-shimmer` está definido em `globals.css` (linha 244) mas não há componente que o use nas rotas autenticadas visíveis. Não existe `<Suspense>` boundary com fallback nos page components lidos.
— Severidade: **bloqueador de produção** — em produção com Supabase real, latência de cold start (plano free: até 5s) exibe tela branca sem qualquer feedback. WCAG 4.1.3 e expectativa de qualidade de produto.

**5. Touch targets abaixo de 44×44px nos botões radio de tipo de anúncio — §12.3**
— Rota `/calculadora-livre` · `LeadMagnetForm.tsx:201–215`
— Evidência: os três botões de "Tipo de anúncio" (Grátis / Clássico / Premium) têm `px-3 py-2` — padding vertical de 8px + font-size 14px = altura efetiva ~30px. WCAG §2.5.5 (AA) e Halo §12.3 exigem mínimo 44×44px em mobile. Em viewport 375px, cada um dos três botões ocupa ~117px de largura mas apenas ~30px de altura — tap target abaixo do mínimo. O checkbox de LGPD com `h-4 w-4` (16px) também está abaixo do mínimo isolado, embora a label adjacente aumente a área de toque.
— Severidade: **bloqueador de produção para mobile** — SmartPreço é produto para vendedores ML, majoritariamente mobile. Tap target pequeno aumenta erros de toque e abandono no formulário de conversão principal.

---

## 3 dependências externas

1. **Depende de @dev**: implementar `KpiTile` como componente formal §9.7 (Numeric Display 56px, variante `kpi__item--accent`, delta row mono 12px) e aplicar `skeleton-shimmer` + `<Suspense>` boundaries nas page layouts de rotas autenticadas. Estes são gaps de componente/infraestrutura, não de design token — o CSS já existe, falta o componente e o wiring.

2. **Depende do USUÁRIO (Pedro)**: confirmar se `/dashboard/kpis` já está em produção ou ainda não existe — se a rota não existe, o problema §9.7 é *risco futuro* e não *bloqueador imediato*. Também confirmar se Lighthouse CI está configurado como gate: alvos `LCP < 2.5s` em `/calculadora-livre` (rota pública, SEO crítico) e `A11y ≥ 90` em todas as rotas são metas §14 do Halo DS, mas sem gate de CI automatizado valem zero em produção contínua.

3. **Depende de @data-engineer**: definir os empty states reais que o Supabase retorna por rota — o design de empty state (ilustração vs. texto vs. CTA) não pode ser implementado sem saber quais queries podem retornar zero rows vs. erro de conexão vs. timeout. Empty state de "sem SKUs cadastrados" é diferente de "erro de rede" — cada um precisa de um padrão visual distinto dentro do Halo (§9.9 Toast para erros transientes, card de empty com CTA para zero-data).

---

## 3 recomendações

1. **Corrigir focus ring nos inputs para o padrão Halo §12.2** — `LeadMagnetForm.tsx` inputs: substituir `focus:ring-2 focus:ring-halo-navy/20` por `focus:border-halo-orange focus:ring-4 focus:ring-halo-orange-15` e adicionar `focus:bg-halo-orange-05` (exatamente `.auth-input:focus` em `globals.css:597–601`, que já implementa o padrão correto). O padrão existe e funciona na rota `/login` — é só replicar para os inputs públicos. Custo: 4 linhas de classe Tailwind. Impacto: WCAG 2.4.7 atendido, consistência visual Solar em todo o produto.

2. **Criar `KpiTile.tsx` formalizado com §9.7** — Anatomia exata: container `bg-white rounded-[var(--r-lg)] p-5`, label `font-mono text-[10px] uppercase tracking-[0.12em] text-halo-navy-60`, valor `font-mono text-[56px] font-bold leading-none tracking-[-0.03em] tabular-nums`, delta row `font-mono text-[12px]`. Variante `accent`: fundo `bg-halo-orange text-halo-black` — **um por dashboard**, conforme §10.6 regra 3. Sem este componente, qualquer dev que montar `/dashboard/kpis` vai improvisar com `ResultCard` e quebrar a hierarquia de dado que é a promessa central do produto.

3. **Adicionar `aria-busy="true"` ao botão de cálculo e `<Suspense>` com skeleton nas rotas autenticadas** — No botão "Calcular viabilidade": estado de loading é síncrono mas pode ser lento em mobile; adicionar `aria-busy` mesmo para cálculo local é boa prática e custo zero. Para rotas autenticadas: envolver o `{children}` de `AppShell.tsx` ou cada page em `<Suspense fallback={<PageSkeleton />}>` onde `PageSkeleton` usa `.skeleton-shimmer` já definido — o CSS está pronto em `globals.css:244–253`, falta apenas o componente wrapper e o fallback declarado.

---

*Registrado por Uma (@ux-design-expert) — diagnóstico de UX/Halo para produção · 2026-04-28*
*Arquivos lidos: `globals.css`, `layout.tsx`, `StatusPill.tsx`, `ResultCard.tsx`, `ProfitabilityBadge.tsx`, `LeadMagnetForm.tsx`, `calculadora-livre/page.tsx`, `precos/page.tsx`, `AppShell.tsx`, `MobileDrawer.tsx`, `HALO-DS-v1.1.md`*
