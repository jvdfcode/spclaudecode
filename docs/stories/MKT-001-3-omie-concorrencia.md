# Story MKT-001-3 — Mapeamento de Concorrência OMIE

**Epic:** EPIC-MKT-001
**Status:** Draft
**Owner sugerido:** [OWNER: ?] (preencher na sprint planning)
**Persona-origem do roundtable:** Finch (OMIE)
**Esforço estimado:** 3–5 dias

---

## Contexto

O discovery técnico do SmartPreço não mapeou nenhuma ferramenta concorrente. Nenhum dos 4 documentos do brownfield menciona Olist, SellerPro, planilhas virais de vendedores ML ou ferramentas de precificação existentes no mercado.

Thiago Finch (roundtable): "OMIE agora: mapear concorrência em 2 horas. Entrar em 3 grupos de vendedores ML no Facebook/WhatsApp. Perguntar 'o que você usa para calcular preço?'. Registrar. Isso é Observar. Sem isso, o Modelar é invenção."

O framework OMIE (Observar → Modelar → Melhorar → Excelência) exige partir de evidência do mercado real, não de suposição técnica. O SmartPreço pulou diretamente para Melhorar sem Observar ou Modelar.

Esta story corrige essa lacuna: mapeamento de concorrência com presença nos grupos onde o ICP está, análise de 3 ferramentas concorrentes com matriz comparativa.

---

## Acceptance Criteria

- [ ] **AC1:** Pesquisador entrou em pelo menos 3 grupos de Facebook ou WhatsApp de vendedores ML e coletou respostas à pergunta "o que você usa para calcular preço?" de pelo menos 20 membros (combinado entre grupos)
- [ ] **AC2:** 3 ferramentas concorrentes identificadas e documentadas com: nome, preço, features principais, prints de tela, avaliação de usuários (se disponível)
- [ ] **AC3:** Documento `docs/business/concorrencia-2026-Q2.md` publicado com matriz comparativa (SmartPreço vs. 3 concorrentes) em pelo menos 5 dimensões (preço, cálculo de taxas ML, integração, mobile, facilidade de uso)
- [ ] **AC4:** Seção de "best practices identificadas" com pelo menos 3 padrões de UX/posicionamento que funcionam nos concorrentes e que o SmartPreço pode incorporar ou superar
- [ ] **AC5:** Documento revisado e linkado de `docs/business/ICP-validation-2026-Q2.md`

---

## Tasks

- [ ] **T1:** Identificar e entrar em 3+ grupos de Facebook/WhatsApp de vendedores ML (ex: "Vendedores Mercado Livre Brasil", "Sellers ML Pro", grupos locais de empreendedores)
- [ ] **T2:** Postar pergunta padronizada nos grupos: "Pesquisa rápida — o que você usa hoje para calcular o preço certo de venda no ML? Excel, calculadora do ML, ferramenta paga, planilha própria?" — coletar respostas por 48–72h
- [ ] **T3:** Pesquisar ferramentas concorrentes: buscar "calculadora mercado livre", "calcular taxa ml", "ferramentas vendedor ml" no Google, YouTube, grupos; identificar top 3 mais citadas
- [ ] **T4:** Para cada um dos 3 concorrentes: documentar preço, fazer trial/free tier se disponível, capturar prints de tela das features principais, anotar avaliações de usuários no Google Play/App Store/Reclame Aqui
- [ ] **T5:** Montar matriz comparativa: SmartPreço vs. 3 concorrentes × 5 dimensões (preço, cálculo de taxas ML, integração com catálogo, mobile, onboarding)
- [ ] **T6:** Extrair best practices: quais features os concorrentes têm que o SmartPreço não tem? quais o SmartPreço tem que os concorrentes não têm? qual diferencial é percebível pelo ICP?
- [ ] **T7:** Redigir `docs/business/concorrencia-2026-Q2.md` com achados, matriz, best practices e recomendação de diferencial

---

## Output esperado

- `docs/business/concorrencia-2026-Q2.md` — matriz comparativa e análise OMIE
- Prints de tela dos 3 concorrentes em `docs/business/assets/concorrentes/` (ou links)
- Síntese de respostas dos grupos de vendedores documentada no arquivo

---

## Notas técnicas / referências

- **Recomendação OMIE / Finch:** "OMIE começa em Observar. Não observaram." (05-thiago-finch.md — Diagnóstico OMIE). Candidatos prováveis de concorrência: Olist, SellerPro, ExcelDeVendedor.xlsx (planilha viral em grupos), calculadora nativa do ML
- **Nardon Bullseye:** "Comunidades — grupos de WhatsApp e Facebook de vendedores ML onde a dor é discussão diária" como canal mais provável. Esta story serve tanto para mapear concorrência quanto para confirmar o canal
- **Finch Loss Aversion:** ao entrar nos grupos, registrar também quanto os membros relatam perder por mês com precificação errada — alimenta a quantificação da dor para MKT-001-1 e MKT-001-4
- Manter presença nos grupos após a pesquisa — os grupos são canal de aquisição potencial (testar soft mention do Lead Magnet após resultado)

---

## Riscos

- Grupos podem ter regras contra pesquisa/divulgação (mitigação: ser transparente sobre a pesquisa; apresentar-se como desenvolvedor buscando feedback; não fazer spam)
- Concorrentes sem free tier dificultam análise de features (mitigação: usar prints de landing page + reviews de usuários + vídeos demo no YouTube como substituto)
- Baixo engajamento nas perguntas dos grupos (mitigação: formular como pergunta genuína de comunidade, não de pesquisa formal)

---

*Story gerada por @pm (Morgan) — EPIC-MKT-001 — Roundtable 2026-04-27*
