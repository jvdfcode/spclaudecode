# Story MKT-001-1 — Lead Magnet: Calculadora Pública sem Cadastro

**Epic:** EPIC-MKT-001
**Status:** Draft
**Owner sugerido:** [OWNER: ?] (preencher na sprint planning)
**Persona-origem do roundtable:** Finch + Nardon + Tallis
**Esforço estimado:** 3–5 dias

---

## Contexto

O SmartPreço tem motor de cálculo completo e testado em `src/lib/calculations/`, mas ele está 100% atrás de autenticação. Nenhum vendedor de ML que não conhece o produto consegue experimentar o diferencial antes de criar conta.

Thiago Finch (roundtable): "Lead Magnet antes do próximo sprint. Criar uma calculadora pública gratuita que mostra ao vendedor ML quanto ele provavelmente está perdendo. Isso é funil de entrada. Captura email, prova valor, gera urgência."

Nardon e Tallis convergem: produto sem funil de entrada é demo. Cada semana sem Lead Magnet é semana sem dado de mercado real.

Esta story cria a rota `/calculadora-livre` — pública, sem cadastro, sem auth — reutilizando a engine existente e adicionando CTA de captura de email com LGPD opt-in. É a primeira linha de funil de aquisição do SmartPreço.

---

## Acceptance Criteria

- [ ] **AC1:** Rota `/calculadora-livre` acessível em produção sem login; retorna 200 para usuário não autenticado
- [ ] **AC2:** Engine de cálculo de `src/lib/calculations/` reutilizada sem duplicação de lógica; feature de simulação de custo funcional na rota pública
- [ ] **AC3:** CTA de captura de email presente na página com LGPD opt-in explícito ("Ao continuar, você concorda com nossa política de privacidade")
- [ ] **AC4:** Envio de email de boas-vindas funcional via Resend (ou serviço equivalente) após captura; lead registrado em tabela `leads` ou equivalente
- [ ] **AC5:** Pelo menos 10 leads capturados dentro de 30 dias pós-publicação (métrica de validação do canal)
- [ ] **AC6:** `pnpm typecheck`, `pnpm lint`, `pnpm build` passando após implementação
- [ ] **AC7:** Rota não consome `checkRateLimit` autenticado — sem dependência de Bloco H para funcionar

---

## Tasks

- [ ] **T1:** Mapear quais funções de `src/lib/calculations/` podem ser chamadas sem contexto de usuário autenticado; identificar dependências de Supabase auth
- [ ] **T2:** Criar rota `src/app/calculadora-livre/page.tsx` com UI de entrada de produto (nome, custo, preço desejado, tipo de anúncio ML) e resultado de cálculo de margem
- [ ] **T3:** Adaptar engine de cálculo para aceitar inputs diretos sem `userId` (ou criar wrapper thin sem chamar `checkRateLimit`)
- [ ] **T4:** Criar componente de CTA pós-cálculo com campo de email + LGPD opt-in checkbox obrigatório
- [ ] **T5:** Criar tabela `leads` no Supabase (ou `public_leads`) com campos: `email`, `source`, `created_at`, `lgpd_consent_at`; migration `010_leads_table.sql`
- [ ] **T6:** Integrar envio de email via Resend API (ou `nodemailer` se já configurado): email de boas-vindas com link para criar conta completa
- [ ] **T7:** Adicionar link para `/calculadora-livre` no header/footer público (landing page)
- [ ] **T8:** Verificar que `/calculadora-livre` não aparece em `middleware.ts` como rota protegida
- [ ] **T9:** Deploy em staging; testar fluxo completo (calcular → CTA → email recebido); verificar `pnpm build`

---

## Output esperado

- `src/app/calculadora-livre/page.tsx` — rota pública funcional
- `supabase/migrations/010_leads_table.sql` — tabela de captura de leads
- Configuração de email (Resend ou similar) em `.env` + `src/lib/email.ts`
- Link de acesso público documentado em `docs/business/ICP-validation-2026-Q2.md` (seção canais testados)

---

## Notas técnicas / referências

- **Recomendação 4 / Finch + Nardon + Tallis:** "Criar pricing-page + Lead Magnet (calculadora pública gratuita) em paralelo ao Bloco H — não esperar paydown terminar." (roundtable-personas-2026-04-27.md, Adições ao roadmap H1)
- **DEBT-FE-NEW-5** (WelcomeTour sem estado real): o Lead Magnet externo substitui/complementa o onboarding interno — leads que chegam via calculadora já passaram pelo funil antes do cadastro
- Engine de cálculo: `src/lib/calculations/` — validar quais exports estão cobertos por testes antes de reutilizar (NFR08: 70% cobertura em funções de cálculo)
- LGPD: captura de email exige opt-in explícito e registro de timestamp de consentimento; não usar dark patterns

---

## Riscos

- Engine de cálculo pode ter dependências implícitas de `userId` que exijam refatoração maior que estimada (mitigação: wrapper thin com valores de usuário genérico; limite T3 a 4h de análise antes de escalar)
- Resend não configurado no projeto: avaliar alternativa (Nodemailer + SMTP) ou usar simulação de email em staging

---

*Story gerada por @pm (Morgan) — EPIC-MKT-001 — Roundtable 2026-04-27*
