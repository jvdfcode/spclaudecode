# CNPJ-001 — Constituição CNPJ + DPO (LGPD art. 41)

**Epic:** EPIC-PROD-002 (Defensabilidade Institucional)
**Status:** Draft
**Severidade:** ALTA — Pedro Valério no painel: "owner anônimo não é auditável"; bloqueia DD investidor + cert ML
**Sprint:** SPRINT-2026-05-12 (proposto, paralelo a PROD-002)
**Owner:** Pedro Emilio Ferreira (humano + contador)
**SP estimado:** 3 SP (~7-15 dias wall-clock; <8h efetivas Pedro)
**Referência:**
- Comparativo Letzee: `docs/reviews/comparativo-letzee-2026-05-02/01-comparativo-8-personas.md` (Pedro Valério)
- Letzee tem CNPJ 57.607.992/0001-37 desde ~2024 — `docs/reviews/world-benchmark-2026-05-01/01-benchmark-mundial.md` seção 1.11
- LGPD art. 41 (DPO obrigatório para tratamento de dados pessoais)

---

## Contexto

Pedro Valério no painel comparativo Letzee:
> *"Owner anônimo não é auditável. Sob LGPD art. 41 (encarregado), CDC art. 37 (publicidade enganosa) e ToS ML, ausência de CNPJ é risco regulatório real, não teórico. SmartPreço hoje opera como projeto pessoal Pedro Emilio sem CNPJ próprio mapeado em STATUS.md."*

**Bloqueia:**
- **PROD-002** (certificação ML exige pessoa jurídica)
- **Due diligence de investidor** (Nardon: "qualquer pitch trava")
- **Contratos enterprise** (sub-perfil G Bruno T. + Sub-F Julia DTC exigem CNPJ)
- **Adicionar TI/contador formal** (pré-requisito Cenário B' co-founder)

**Risco regulatório real (não teórico):**
- LGPD art. 41 + 52: multa até 2% do faturamento (R$ 50M cap), DPO obrigatório
- CDC art. 37 §1°: publicidade enganosa (faixa "R$ 500-1.500/mês perdido" exige fonte verificável — sem CNPJ, sem responsável jurídico)
- Marco Civil art. 15: retenção de logs por 6 meses (sem CNPJ = pessoa física responde)

---

## Acceptance Criteria

### CNPJ
1. [ ] Tipo escolhido entre: MEI · ME (Simples Nacional) · LTDA · Sociedade Limitada Unipessoal (SLU)
   - **Recomendação Orion:** SLU como ME no Simples Nacional (limite até R$ 360k/ano, alíquota 6-13.25% conforme faixa) — flexibilidade entre MEI (limite R$ 81k) e LTDA (mais burocrático)
2. [ ] Razão social registrada (sugestão: "SmartPreço Tecnologia LTDA" ou "Pedro Emilio Tecnologia LTDA")
3. [ ] Nome fantasia "SmartPreço"
4. [ ] CNAE primário: 6201-5/01 (Desenvolvimento de programas de computador sob encomenda) ou 6202-3/00 (Desenvolvimento e licenciamento de programas customizáveis)
5. [ ] Endereço fiscal definido (residencial OK para SLU, ou coworking)
6. [ ] CNPJ ativo na Receita Federal (consulta REC)
7. [ ] Inscrição Estadual (se aplicável SP) e Inscrição Municipal (NF-e SP)
8. [ ] Conta PJ aberta (Nubank PJ ou Inter PJ — sem mensalidade)

### DPO (Data Protection Officer)
9. [ ] DPO nomeado oficialmente (próprio Pedro pode ser o DPO interino — declaração formal)
10. [ ] Email público `dpo@smartpreco.app` ativo (forward para Pedro)
11. [ ] Página `/dpo` ou seção em `/privacidade` explicitando: nome, email, canal de contato (LGPD art. 41 §2°)

### Compliance documental
12. [ ] DPIA (Data Protection Impact Assessment) inicial em `docs/legal/DPIA-2026-05-XX.md`
   - Dados pessoais coletados (email, OAuth ML token, IP, eventos funnel)
   - Base legal de tratamento (consentimento + legítimo interesse)
   - Riscos identificados + mitigações (criptografia at-rest pendente — F2 Finding 3)
13. [ ] Termos de Uso publicados em `/termos` (criar se não existir)
14. [ ] Política de Privacidade revisada por advogado (review jurídico do `/privacidade` atual)
15. [ ] Adicionar página `/sobre` com fundadores, CNPJ, endereço

### Atualização de superfícies
16. [ ] CNPJ + razão social adicionados no footer global
17. [ ] CNPJ visível em `/precos` (transparência) e `/sobre`
18. [ ] Email PJ configurado (`contato@smartpreco.app`, `suporte@smartpreco.app`, `dpo@smartpreco.app`)

---

## Tasks

### Track 1 — Constituição (semanas 1-2)
- [ ] Contratar serviço online: **Contabilizei** (R$ 0 abertura + R$ 89/mês), **Conube** (R$ 0 + R$ 99/mês), ou **Open Companies** (R$ 0 + R$ 79/mês)
- [ ] Escolher tipo (recomendação SLU + Simples Nacional)
- [ ] Enviar documentos pessoais Pedro (RG, CPF, comprovante endereço)
- [ ] Aguardar registro JUCESP/JUCERJA + Receita Federal (7-15 dias)
- [ ] Receber CNPJ + abrir conta PJ

### Track 2 — DPO + LGPD (paralelo)
- [ ] Nomear Pedro como DPO interino (declaração formal — template online OK)
- [ ] Criar email `dpo@smartpreco.app` (forward via Vercel/Cloudflare ou Google Workspace R$ 36/mês)
- [ ] Adicionar seção "Encarregado de Proteção de Dados" em `/privacidade`
- [ ] Criar `docs/legal/DPIA-2026-05-XX.md` (template online OK — adaptar para SmartPreço)

### Track 3 — Documentos jurídicos (semana 2-3)
- [ ] Contratar review jurídico de `/privacidade` (advogado especialista LGPD — R$ 500-1.500 fixo)
- [ ] Criar `/termos` baseado em template (Termly ou similar)
- [ ] Criar `/sobre` página com bio Pedro + CNPJ + missão + contato

### Track 4 — Atualização superfícies (semana 3-4)
- [ ] Atualizar footer global em `src/components/layout/Footer.tsx` (ou equivalente) com CNPJ + razão social
- [ ] Adicionar CNPJ em `/precos` (footer)
- [ ] Atualizar `og:image` e `<meta>` para refletir entidade jurídica formal

---

## Out of Scope

- **Transformar em LTDA com sócios formais** — backlog após Cenário B' (co-founder)
- **Inscrição estadual em outros estados** — só SP inicialmente
- **Compliance internacional (GDPR, CCPA)** — backlog, foco BR
- **Auditoria SOC 2 / ISO 27001** — backlog enterprise (Sub-G Bruno T)

---

## Riscos

| Risco | Probabilidade | Mitigação |
|-------|:-------------:|-----------|
| Demora na Receita Federal (>15 dias) | Baixa | Contabilizei/Conube têm taxa de 95%+ aprovação em 7-10 dias |
| Endereço fiscal residencial gera problemas | Baixa | SLU permite endereço residencial; alternativa coworking R$ 100/mês |
| Custo mensal contador (R$ 89-150/mês) sem caixa | Média | Negociar 3 meses grátis OU usar Contabilizei tier free para ME inicial |
| Pedro como DPO interino não é "boas práticas" | Baixa | Aceitável até 100k+ usuários; depois contratar DPO externo |

---

## Definition of Done

- [ ] AC 1-18 todos checados
- [ ] CNPJ ativo + conta PJ funcionando
- [ ] DPIA + Termos + Privacidade + Sobre publicados
- [ ] Footer + /precos atualizados
- [ ] Story atualizada com File List + Status `Done`

---

## Change Log

| Data | Autor | Mudança |
|------|-------|---------|
| 2026-05-03 | Orion (@aiox-master) | Story criada como parte do EPIC-PROD-002 — recomendação Pedro Valério painel comparativo Letzee |
