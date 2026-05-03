# PROD-003 — Chrome Extension MVP (point-of-decision na criação do anúncio)

**Epic:** EPIC-PROD-002 (Defensabilidade Institucional)
**Status:** Draft
**Severidade:** ALTA — 5/8 votos painel (Alan + Finch + Alfredo + Tallis + Nardon); paridade com Letzee no point-of-decision
**Sprint:** SPRINT-2026-06-09 (proposto, depende PROD-002 cert ML aprovada)
**Owner:** Pedro Emilio (executor: @dev)
**SP estimado:** 8 SP (~4-6 semanas)
**Referência:**
- Comparativo Letzee: `docs/reviews/comparativo-letzee-2026-05-02/01-comparativo-8-personas.md`
- Letzee Chrome Extension 5.0/5: `docs/reviews/world-benchmark-2026-05-01/01-benchmark-mundial.md` seção 1.11
- Helium 10 Chrome Extension como porta de entrada: lição #2 do benchmark

---

## Contexto

Letzee tem **Chrome Extension 5.0/5** que injeta margem na página ML após o anúncio existir. Helium 10 tem Chrome Extension como porta de entrada gratuita que cresceu para 2M+ usuários. SmartPreço tem apenas web app + lead magnet `/calculadora-livre`.

**Diferencial proposto:** SmartPreço Chrome Extension entra no momento da **CRIAÇÃO** do anúncio (não pós-publicação como Letzee). Quando seller está em `mercadolivre.com.br/criar-anuncio` ou similar, extensão injeta:
- Cálculo de margem em tempo real conforme seller digita preço
- Comparativo Free/Classic/Premium em 1 clique
- Alerta visual se margem < 10% antes do "Publicar"

**Por que isso é defensável:**
- Letzee monitora **pós-publicação** (anúncio já existe, decisão já foi tomada)
- SmartPreço entra **no ato de decidir** — momento de maior intent + maior switching cost cognitivo
- Frase âncora: "A calculadora do ML te diz quanto custa vender. SmartPreço te diz se vale vender — antes de vender."

---

## Acceptance Criteria

### Manifest e estrutura
1. [ ] Chrome Extension Manifest V3 publicada
2. [ ] Content script ativa em URLs `mercadolivre.com.br/anuncios/criar*` e `mercadolivre.com.br/MLB-*` (página de edição)
3. [ ] Background service worker para auth + API calls
4. [ ] Popup com login SmartPreço (OAuth com app web já existente)

### UX core
5. [ ] Detecta input de "preço de venda" em página de criação (DOM observer)
6. [ ] Calcula margem em tempo real conforme seller digita (debounce 300ms)
7. [ ] Mostra widget flutuante com 3 cenários (Free/Classic/Premium)
8. [ ] Highlight visual (verde/amarelo/vermelho) baseado em margem (>15% / 10-15% / <10%)
9. [ ] Botão "Salvar simulação" envia para SmartPreço web (sincroniza histórico)

### Reuso de código
10. [ ] Extensão reusa lógica de cálculo de `src/lib/calculations.ts` (não duplicar)
11. [ ] Endpoint `/api/calc/simulate` no SmartPreço web — extensão chama com payload mínimo
12. [ ] Auth via OAuth existente (não criar fluxo separado)

### Distribuição
13. [ ] Publicada em Chrome Web Store com screenshots, descrição, video demo
14. [ ] Privacy policy linkada (`/privacidade`)
15. [ ] Listagem otimizada para keywords: "calculadora mercado livre", "margem anúncio ML", "precificação ml"

### Métricas
16. [ ] Eventos novos em `FunnelEventName`:
   - `ext_installed`
   - `ext_calc_in_creation`
   - `ext_alert_low_margin_shown`
   - `ext_save_to_web_clicked`

### Qualidade
17. [ ] Funciona sem quebrar UX nativa do ML (CSS isolado via shadow DOM ou prefixos)
18. [ ] `npm run typecheck` + lint + build PASS na pasta `extensions/chrome/`
19. [ ] Tests Vitest para lógica core (DOM parsing, debounce, comunicação com endpoint)

---

## Tasks

### Track 1 — Setup Manifest V3
- [ ] Criar pasta `extensions/chrome/` no monorepo
- [ ] `manifest.json` v3 com permissions mínimas (`activeTab`, `storage`, `identity` se OAuth)
- [ ] Content script + background service worker + popup HTML/TSX

### Track 2 — Lógica de injeção
- [ ] DOM observer detecta input de preço em página criar-anuncio
- [ ] Debounce 300ms + cálculo em-memory
- [ ] Widget flutuante posicionado próximo ao input (não bloqueia UX nativa)

### Track 3 — Reuso de código
- [ ] Extrair `calculateMargin(input)` para `packages/shared-calc/` (se monorepo) OU duplicar mínimo em `extensions/chrome/lib/`
- [ ] Endpoint `/api/calc/simulate` (POST input → retorna 3 cenários)

### Track 4 — Auth e sync
- [ ] OAuth flow Chrome Identity API → token Supabase
- [ ] Sync de histórico de simulações com web app (tabela `simulations` ou usar `sku_calculations`)

### Track 5 — Publicação
- [ ] Screenshots 1280x800 + 640x400
- [ ] Vídeo demo 30s
- [ ] Listing na Chrome Web Store (US$ 5 taxa única)
- [ ] Anúncio FB "Vendedores ML BR" 60k

---

## Out of Scope

- **Extension Firefox/Safari/Edge** — backlog (Chrome representa ~70% browsers ML BR)
- **Edição em massa de anúncios via extensão** — backlog (PROD-005?)
- **AI suggestion direto na extensão** — depende PROD-004
- **Dashboard analytics dentro da extensão** — usar web SmartPreço

---

## Riscos

| Risco | Probabilidade | Mitigação |
|-------|:-------------:|-----------|
| Chrome Web Store rejeita extensão | Baixa | Manifest V3 limpo + descrição clara + privacy policy |
| ML muda DOM da página criar-anuncio | Alta | DOM observer com fallbacks; testes E2E semanais via Playwright |
| Conflito CSS com layout ML | Média | Shadow DOM ou prefixo `sp-` em todas classes |
| OAuth Chrome Identity não funciona em conta seller ML | Média | Fallback para email+senha SmartPreço (login simples) |
| Sem volume de instalações iniciais | Média | Distribuir via FB 60k (canal #1 ICP) + parceria 1 microinfluencer ML |

---

## Definition of Done

- [ ] AC 1-19 todos checados
- [ ] Extensão publicada Chrome Web Store
- [ ] ≥50 instalações nas primeiras 4 semanas
- [ ] Rating ≥ 4.0/5 (paridade com Letzee 5.0/5 é objetivo de longo prazo)
- [ ] Story atualizada com File List + Status `Done`

---

## Change Log

| Data | Autor | Mudança |
|------|-------|---------|
| 2026-05-03 | Orion (@aiox-master) | Story criada como parte do EPIC-PROD-002 — 5/8 votos painel comparativo Letzee |
