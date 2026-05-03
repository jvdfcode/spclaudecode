# PROD-002 — Certificação App Mercado Livre

**Epic:** EPIC-PROD-002 (Defensabilidade Institucional)
**Status:** Draft
**Severidade:** **CRÍTICA** — único voto unânime (8/8 personas) do painel comparativo Letzee
**Sprint:** SPRINT-2026-05-12 ou seguinte (depende Cenário B/B' do gate Nardon)
**Owner:** Pedro Emilio Ferreira (humano — processo via developers.mercadolivre.com.br)
**SP estimado:** 5 SP (~4-8 semanas wall-clock, mas <20h efetivas de trabalho de Pedro)
**Referência:**
- `docs/reviews/comparativo-letzee-2026-05-02/01-comparativo-8-personas.md` (8/8 votos)
- Letzee tem certificação dez/2025 — `docs/reviews/world-benchmark-2026-05-01/01-benchmark-mundial.md` seção 1.11
- developers.mercadolivre.com.br — programa de certificação App ML

---

## Contexto

Letzee obteve certificação App Mercado Livre em dez/2025. Em ~12 meses de operação, transformou status de "ferramenta third-party" em "App Certificado oficial ML" — selo de confiança que aparece na Central de Vendedores ML, gera trust signal direto e destrava acesso a APIs privilegiadas (eventos webhook, claims, gestão de listings).

SmartPreço atualmente usa **scraping HTML** em `src/app/api/ml-proxy/route.ts` (Cheerio + User-Agent falso) — pattern que viola ToS ML seção 6.2 e expõe a risco de banimento da conta seller integrada. Ferramentas certificadas usam OAuth 2.0 + API oficial (`/items`, `/orders`, `/users`) sem fricção institucional.

**Sem certificação:**
- Trust signal zero para sellers compliance-conscious (sub-perfil G enterprise, sub-perfil D Ricardo profissional)
- Risco regulatório real (denúncia → suspensão app → produto morto em 48h)
- Não acessa Central de Parceiros ML (canal de aquisição institucional)
- Letzee continua dominando narrativa "ferramenta legítima"

**Com certificação:**
- Selo "App Certificado" visível no perfil em developers.mercadolivre.com.br
- Acesso a APIs privilegiadas (webhook eventos, ML Pago acelerar metrics)
- Listagem na vitrine oficial do ML (canal de aquisição passivo)
- Defensabilidade contra ML lançar calculadora oficial (cert sinaliza relacionamento institucional)

**Tag:** `[ML-OFFICIAL]` + `[GUSTAVO-LUCAS]` (mentoria valida que cert agrega 30-50% em conversão para sellers maduros).

---

## Acceptance Criteria

### Submissão e aprovação
1. [ ] Cadastro completo em developers.mercadolivre.com.br como pessoa jurídica (depende CNPJ-001)
2. [ ] App SmartPreço criado e configurado (redirect URLs, scopes, descrição)
3. [ ] Submissão para programa "App Certificado" enviada
4. [ ] Resposta da equipe ML recebida (aprovação OU lista de pendências)
5. [ ] Se pendências: corrigidas e ressubmetidas (até 2 ciclos)
6. [ ] Selo "App Certificado" visível em developers.mercadolivre.com.br/{slug}

### Migração técnica pós-certificação
7. [ ] Substituir scraping HTML em `src/app/api/ml-proxy/route.ts` por chamadas API oficial (endpoints autorizados pela cert)
8. [ ] Adicionar webhook handlers para eventos privilegiados (orders, claims, listings)
9. [ ] Atualizar `docs/architecture/ml-platform-risk-fallback.md` removendo Cenário C (IP ban) — não-aplicável após cert
10. [ ] Story VIAB-R1-3.1 (eliminar scraping) fechada como subsumida

### Comunicação
11. [ ] Adicionar selo "App Certificado Mercado Livre" em `/precos` + `/calculadora-livre` + footer global
12. [ ] Anúncio em FB "Vendedores ML BR" 60k + LinkedIn (canal #1 + Tier-2)
13. [ ] Adicionar em `docs/business/posicionamento.md` como diferencial principal

---

## Tasks

### Track 1 — Pré-requisitos institucionais (semanas 1-2)
- [ ] CNPJ ativo (depende CNPJ-001 — story irmã)
- [ ] DPO nomeado (LGPD art. 41)
- [ ] Política de privacidade revisada por advogado (já existe em `/privacidade` — review jurídico)
- [ ] Termos de uso publicados (criar `/termos` se não existir)
- [ ] Página "Sobre" pública com fundadores nominais (LinkedIn) e CNPJ visível

### Track 2 — Submissão técnica (semanas 2-3)
- [ ] Criar app em developers.mercadolivre.com.br
- [ ] Documentar todas as integrations: OAuth flow, scopes solicitados (`offline_access`, `read`, `write`), endpoints chamados
- [ ] Preencher questionário de certificação (segurança, privacidade, monitoramento)
- [ ] Anexar documentos: política privacidade, termos, DPIA inicial, prova de CNPJ
- [ ] Submit

### Track 3 — Aguardar review ML (semanas 3-6)
- [ ] Acompanhar status do pedido
- [ ] Responder a feedback dentro de 48h se vier
- [ ] Se rejeitado: identificar gaps, corrigir, ressubmeter (timeline reseta)

### Track 4 — Pós-aprovação (semanas 7-8)
- [ ] Atualizar config OAuth para usar endpoints certificados
- [ ] Migrar `ml-proxy/route.ts` para API oficial (subsume VIAB-R1-3.1)
- [ ] Adicionar webhook handlers para eventos
- [ ] Comunicar nas 3 superfícies (`/precos`, `/calculadora-livre`, footer + posts)

---

## Out of Scope

- **Submissão para múltiplos países ML** (México, Argentina) — backlog após validação BR
- **App marketplace ML featured listing** — depende negociação comercial pós-cert
- **Patrocínio em ML Experience** (evento anual) — backlog comercial

---

## Riscos

| Risco | Probabilidade | Mitigação |
|-------|:-------------:|-----------|
| Certificação demora >12 semanas | Média | Manter scraping com backoff durante review; comunicar timing realista |
| Rejeição com pendências grandes | Baixa-Média | Track 1 (pré-requisitos) cobre 80% dos motivos comuns de rejeição |
| ML mudar critérios durante review | Baixa | Acompanhar comunicações developers.mercadolivre.com.br |
| Custo de cert (taxa anual?) | Baixa | Verificar política — se >R$ 5k/ano, reavaliar custo-benefício |
| CNPJ-001 atrasar bloqueia tudo | Média | Track 1 começa em paralelo a CNPJ-001; review técnico pode rodar com CNPJ em provisório |

---

## Definition of Done

- [ ] AC 1-13 todos checados
- [ ] Selo certificado visível publicamente
- [ ] Scraping HTML eliminado de `ml-proxy/route.ts`
- [ ] VIAB-R1-3.1 fechada (subsumida)
- [ ] Posicionamento atualizado em 3 superfícies
- [ ] Story atualizada com File List + Status `Done`

---

## Change Log

| Data | Autor | Mudança |
|------|-------|---------|
| 2026-05-03 | Orion (@aiox-master) | Story criada como parte do EPIC-PROD-002 — voto unânime 8/8 painel comparativo Letzee |
