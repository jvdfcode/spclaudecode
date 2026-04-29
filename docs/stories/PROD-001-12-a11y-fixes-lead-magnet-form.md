# Story PROD-001-12 — A11y fixes críticos no LeadMagnetForm

**Epic:** EPIC-PROD-001
**Status:** Draft
**Owner:** Pedro Emilio (executor: @dev Dex via handoff)
**Severidade origem:** H5, H6, H8
**Esforço estimado:** 3 SP
**Classificação:** must-have paralelo Dia 1-2

---

## Contexto

Uma (03-ux-uma.md, problemas 1, 2 e 5) documenta três gaps de acessibilidade em `LeadMagnetForm.tsx` que afetam WCAG 2.4.7, WCAG 4.1.3 e WCAG 2.5.5 — todos bloqueadores de produção para o funil principal do produto. H5: focus ring usa `focus:ring-2 focus:ring-halo-navy/20` em vez do canônico Halo §12.2 `4px solid --halo-orange-15` — falha em fundos brancos para usuários com baixa visão. H6: `aria-busy` ausente no botão "Calcular viabilidade" — screen readers não anunciam o estado de loading do cálculo. H8: touch targets dos botões de "Tipo de anúncio" têm apenas ~30px de altura vs. mínimo de 44px (WCAG 2.5.5). O produto é mobile-first para vendedores do Mercado Livre — tap target pequeno causa abandono no único funil de conversão.

Esta story é **must-have paralelo Dia 1-2** — deve ser executada em paralelo com o caminho crítico (PROD-001-1 a PROD-001-10), não após.

**v2 — reclassificação:** de "should-have/deferrable" para "must-have paralelo Dia 1-2". Touch targets de 30px num produto mobile-first quebram funil de conversão — não é deferrable. Input de Alan Nicolas + Thiago Finch (síntese trio, mudança #11).

---

## Acceptance Criteria

- [ ] Lighthouse A11y >= 90 em `/calculadora-livre` (executar contra URL de produção ou preview)
- [ ] `grep "focus:ring-halo-orange\|focus:border-halo-orange" src/components/LeadMagnetForm.tsx` encontra correspondências nos inputs (H5)
- [ ] `grep "aria-busy" src/components/LeadMagnetForm.tsx` encontra o atributo no botão "Calcular viabilidade" (H6)
- [ ] Inspeção visual mobile (375px): botões de "Tipo de anúncio" têm altura >= 44px (verificar em DevTools Device Mode)
- [ ] Focus ring dos inputs visível em fundo branco (testar com teclado em `/calculadora-livre`)

---

## Tasks

**H5 — Focus ring:**
- [ ] Em `LeadMagnetForm.tsx`: substituir `focus:ring-2 focus:ring-halo-navy/20` por `focus:border-halo-orange focus:ring-4 focus:ring-halo-orange-15` nos inputs de linha 169, 187, 229, 333
- [ ] Verificar select de parcelamento e checkbox LGPD com o mesmo fix

**H6 — aria-busy:**
- [ ] No botão "Calcular viabilidade" (`LeadMagnetForm.tsx:239-244`): adicionar `aria-busy={isCalculating}` onde `isCalculating` é o estado booleano do cálculo
- [ ] Verificar que `isCalculating` já existe no componente ou criar estado local

**H8 — Touch targets:**
- [ ] Nos botões de "Tipo de anúncio" (`LeadMagnetForm.tsx:201-215`): substituir `px-3 py-2` por `px-3 py-3` (aumenta padding vertical de 8px para 12px, total ~46px com font 14px)
- [ ] Verificar checkbox LGPD: label adjacente deve ter `min-h-[44px]` para área de toque

**Validação:**
- [ ] `pnpm typecheck` retorna 0 erros após as mudanças
- [ ] `pnpm lint` retorna 0 erros
- [ ] Commit: `fix: a11y fixes H5/H6/H8 in LeadMagnetForm — focus ring, aria-busy, touch targets`

---

## File List

- `src/components/LeadMagnetForm.tsx` (focus ring H5, aria-busy H6, touch targets H8)

---

## Notas técnicas

Uma (recomendação 1) especifica o fix exato para H5:
> "substituir `focus:ring-2 focus:ring-halo-navy/20` por `focus:border-halo-orange focus:ring-4 focus:ring-halo-orange-15` e adicionar `focus:bg-halo-orange-05` — exatamente `.auth-input:focus` em `globals.css:597-601`, que já implementa o padrão correto. O padrão existe e funciona na rota `/login` — é só replicar para os inputs públicos."

Para H6, o botão de captura de lead já tem o padrão correto em linha 358 (`aria-busy={pending}`) — replicar o mesmo para o botão de cálculo.

Para H8, Uma documenta: "px-3 py-2 — padding vertical de 8px + font-size 14px = altura efetiva ~30px". O fix de `py-2 → py-3` eleva para ~46px.

**Execução paralela:** esta story pode e deve ser executada em paralelo com PROD-001-1 a PROD-001-10 a partir do Dia 1-2. Não aguardar o caminho crítico para iniciar.

---

## Riscos

1. Mudança de classes Tailwind em inputs pode alterar o visual — testar visualmente em `/calculadora-livre` após a mudança.
2. `aria-busy` no botão de cálculo requer que o estado de loading seja acessível no escopo do componente — verificar se `isCalculating` já existe ou se precisa ser extraído de um contexto maior.
