# Story PROD-001-10 — Publicar /privacidade e ativar CTA Lead Magnet

**Epic:** EPIC-PROD-001
**Status:** Done
**Owner:** Pedro Emilio
**Severidade origem:** B5
**Esforço estimado:** 2 SP

---

## Contexto

Alex (06-analyst-alex.md, problema 4) documenta que a captura de email sem política de privacidade publicada é infração imediata à LGPD (Lei 13.709/2018), independente do tamanho da base. B5 da síntese (00-sintese-orion.md) é BLOQUEADOR absoluto: `/privacidade` inexistente e lead magnet captura PII. A decisão D3 define se o CTA vai ao ar ativo imediatamente ou desativado até `/privacidade` publicada — esta story pressupõe que a decisão foi tomada e executa a consequência.

Depende de PROD-001-9 (smartpreco.app no ar com TLS válido) e **PROD-001-13** (instrumentação de funil — eventos de funil devem estar implementados antes de ativar o CTA para não lançar o funil cego).

---

## Acceptance Criteria

- [ ] `curl -sI https://smartpreco.app/privacidade` retorna `HTTP 200`
- [ ] A página `/privacidade` contém: identificação do controlador, finalidade do tratamento, base legal (consentimento), dados coletados (email), direitos do titular, prazo de retenção, contato DPO/responsável
- [ ] O CTA de captura de email no LeadMagnetForm exibe link para `/privacidade` visível antes da submissão
- [ ] Submissão do LeadMagnetForm com email válido persiste registro na tabela `leads` (verificar via `SELECT count(*) FROM leads` no Supabase)
- [ ] Se D3 = CTA ativo: checkbox ou texto de consentimento LGPD está presente e marcado obrigatório antes do submit
- [ ] Se D3 = CTA pausado até /privacidade: CTA reativado após publicação desta story (AC anterior se aplica)

---

## Tasks

- [ ] Confirmar que PROD-001-13 está completa (eventos de funil implementados)
- [ ] Criar `src/app/privacidade/page.tsx` com conteúdo da política de privacidade
- [ ] Conteúdo mínimo legal: controlador (Pedro Emilio Ferreira / Orange), finalidade (comunicação, notificações de produto), base legal (consentimento art. 7º, I, LGPD), dados (email, IP indiretamente), retenção (até revogação do consentimento), direitos (acesso, exclusão, portabilidade), contato DPO
- [ ] Verificar que o LeadMagnetForm tem link para `/privacidade` visível (ex: "Ao enviar, você concorda com nossa [Política de Privacidade](/privacidade)")
- [ ] Confirmar que `aria-label` do link de privacidade está presente (acessibilidade)
- [ ] Se CTA estava desativado (D3): remover flag/condicional que desativava o CTA
- [ ] Deploy (novo commit → CI → Vercel auto-deploy via preview URL, ou `vercel deploy --prod`)
- [ ] Testar submissão do formulário em produção
- [ ] Verificar lead persistido no Supabase

---

## File List

- `src/app/privacidade/page.tsx` (novo)
- `src/components/LeadMagnetForm.tsx` (verificar/atualizar link para /privacidade e consentimento)

---

## Notas técnicas

Alex (recomendação 1): "Ir para produção com o Lead Magnet agora, mas só ativar CTA de email depois da política de privacidade publicada." Esta story executa exatamente isso — publica `/privacidade` e então ativa (ou mantém ativo) o CTA.

Conteúdo da política de privacidade é decisão jurídica do Pedro — não inventar conteúdo legal. A story entrega a rota e a estrutura; o texto final é responsabilidade do owner.

Se o CTA de email já está ativo no código mas `/privacidade` não existia, o risco LGPD era real desde a publicação do PROD-001-9. Prioridade: esta story deve ser executada no mesmo dia que PROD-001-9.

Ver EPIC-MKT-001-validacao-mercado.md §Riscos para referência adicional sobre risco LGPD documentado no epic de marketing.

**Dependência PROD-001-13:** os 4 eventos de funil (`calculo_iniciado`, `resultado_exibido`, `cta_clicado`, `email_submetido`) devem estar instrumentados antes de ativar o CTA. Sem isso, o sprint vai ao ar sem capacidade de medir onde o funil quebra.

---

## Riscos

1. Conteúdo jurídico da política pode requerer revisão por advogado — se não houver tempo, publicar versão minimalista com os campos obrigatórios e indicar "versão provisória sujeita a revisão".
2. Se o LeadMagnetForm não tiver checkbox de consentimento explícito, o LGPD opt-in não está completo — verificar `LeadMagnetForm.tsx` antes de marcar story como Done.
