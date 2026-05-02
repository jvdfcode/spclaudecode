# OMIE — Concorrência (2026-Q2)

> ⚠️ **[v1 — 2026-05-02]** — Documento populado via Método B da triangulação ICP (`docs/business/interviews/00-pesquisa-campo-2026-05-02.md`) + atualização Letzee/GoSmarter (`docs/reviews/world-benchmark-2026-05-01/01-benchmark-mundial.md`).
>
> Inputs: WebFetch + WebSearch em fontes públicas (Capterra, G2, Crunchbase, sites oficiais, Chrome Web Store, Reclame Aqui). Cada finding com `[SOURCE:]` ou `[INFERRED]`.

**Story:** MKT-001-3 (EPIC-MKT-001 / Bloco I)
**Persona-origem:** Thiago Finch (OMIE — **O**bservar > **M**odelar > **M**elhorar > **E**xcelência; "Funil > Produto. Sempre.")
**Status:** v1 (preencher mais ao longo do sprint H2 conforme novos sinais aparecem)

---

## 1. Grupos/comunidades de vendedores ML (mapeamento via tripla triangulação)

| # | Grupo / canal | Plataforma | Membros est. | Atividade | Tópico dominante | Fonte |
|---|---------------|:----------:|:-----------:|:---------:|------------------|-------|
| 1 | Vendedores do Mercado Livre Brasil | Facebook | ~60.000 | Alta | Geral (todas categorias) — taxa, suspensão, Buy Box | [MELIDEV] + [PUBLIC-DATA] |
| 2 | Mercado Livre — Dicas para Vendedores | Facebook | ~35.000 | Alta | Geral | [MELIDEV] |
| 3 | Grupo Foco em Vendas (GFV) | Multi (FB+WA+TG) | n/d (desde 2017) | Alta | Estratégia, scale ups | [PUBLIC-DATA] |
| 4 | Comunidade JoomPulse | WhatsApp | n/d | Média | Precificação ML (curado) | [PUBLIC-DATA] |
| 5 | Mulheres Empreendedoras ML BR | Facebook | ~2.000 | Média | Geral feminino | [SYNTHETIC — Patrícia] |
| 6 | Vendedores RJ MEI | WhatsApp | ~180 | Média | Regional/MEI/dúvidas fiscais | [MELIDEV] |
| 7 | Vendedoras ML RJ | WhatsApp | ~80 | Alta | Regional zona norte/baixada | [SYNTHETIC — Marlene] |
| 8 | Sellers Brinquedo BR | WhatsApp | ~80 | Alta (Q4) | Vertical (categoria) | [SYNTHETIC — Carlos] |
| 9 | Suplementos ML BR | Telegram | ~400 | Alta | Vertical (categoria) | [SYNTHETIC — Diego] |
| 10 | Importadores ML | Telegram | ~140 | Média | Câmbio, sourcing, importação | [SYNTHETIC — Vanessa] |
| 11 | Encontro de Autopeças do Sul | WhatsApp | ~85 | Média | Vertical regional (presencial Caxias) | [SYNTHETIC — Rodrigo] |
| 12 | Sellers ML Avançado SP | WhatsApp | ~80 (curado) | Média | Sellers seniores R$50k+ | [SYNTHETIC — Ricardo] |
| 13 | DTC Brasil | WhatsApp | ~120 (curado) | Média | DTC multicanal sofisticado | [SYNTHETIC — Julia] |
| 14 | Slack DTC Brasil | Slack | ~340 | Alta | Founders DTC | [SYNTHETIC — Bruno T] |

**Tier-1 prioritário (orgânico, custo R$ 0):** Grupo FB "Vendedores do Mercado Livre Brasil" (60k+) — confirmado por Método A + B + C como canal #1 do ICP central.

---

## 2. Concorrentes mapeados (12 — atualizado 2026-05-02)

### Concorrentes diretos BR (4)

| # | Concorrente | Pricing entry | Foco | Marketplace | Threat level |
|---|-------------|---------------|------|-------------|:------------:|
| 1 | **Letzee** | R$ 59/mês (~$12) | Margem real + DRE + ROAS | ML | **HIGH** — concorrente direto mesmo ICP |
| 2 | **GoSmarter** | $0 free (paid R$ 129+) | Score IA + calculadora + listing optimizer | ML + multi | **MEDIUM** — overlap calculadora |
| 3 | **Hunter Hub** | R$ 97-397/mês | Spy concorrente + financeiro + conciliação | ML | **MEDIUM** — diferente foco (spy vs cálculo) |
| 4 | **Nubimetrics** | R$ 310+/mês | Market intelligence + parceiro oficial ML | ML | **LOW** (preço alto, ICP enterprise) |

### Concorrentes adjacentes BR (3)

| # | Concorrente | Pricing entry | Foco | Threat level |
|---|-------------|---------------|------|:------------:|
| 5 | Real Trends | R$ 115-445/mês | Multicanal + repricing | LOW (preço/escopo) |
| 6 | JoomPulse | R$ 137+/mês | Precificação ML | LOW (preço) |
| 7 | Olist Avance | R$ 49/mês | ERP + planilha pricing | LOW (categoria diferente) |

### Concorrentes globais não-ML (5)

| # | Concorrente | Pricing entry | Marketplace | Threat futuro |
|---|-------------|---------------|-------------|:-------------:|
| 8 | Helium 10 | $99/mês | Amazon | MEDIUM (12-24m se entrar LATAM) |
| 9 | Sellerboard | $15/mês | Amazon+Walmart+Shopify | MEDIUM (se adicionar ML) |
| 10 | Jungle Scout | $29/mês | Amazon | LOW |
| 11 | Pricefx | >$2k/mês | Enterprise B2B | LOW (categoria diferente) |
| 12 | Prisync | $99/mês | Multi-ecommerce | LOW (categoria diferente) |

---

## 3. Diferencial defensável SmartPreço (atualizado pós-Letzee/GoSmarter)

### 3 diferenciais principais

1. **Calcular ANTES de anunciar**
   - Letzee + Hunter Hub monitoram pós-publicação (margem do que já vendeu)
   - GoSmarter mostra na página ML após anúncio existir
   - **SmartPreço:** valida margem antes do seller subir o anúncio — evita prejuízo, não diagnostica
   - Frase âncora: *"A calculadora do ML te diz quanto custa vender. O SmartPreço te diz se vale vender."*

2. **Especialização pura em margem ML**
   - GoSmarter é suite (Score IA + clonador + remoção fundo + SEO)
   - Letzee é dashboard amplo (DRE + ROAS + IA cliente)
   - **SmartPreço:** uma coisa só, feita bem — calcular margem ML por SKU + tipo de anúncio

3. **Atualização automática quando ML muda regra**
   - Planilhas Olist/Excel ficam estáticas
   - Letzee não promete (sem evidência pública)
   - **SmartPreço:** tabela de comissões centralizada — quando ML muda, atualiza para todos os usuários

### Diferencial #4 (potencial — não-implementado): Loop viral via lead magnet
- `/calculadora-livre` sem cadastro permite share via WhatsApp/FB
- Letzee exige login para usar
- GoSmarter exige instalar Chrome Extension
- Implementação: VIAB-R3-2 (próximo sprint) — adicionar botão "Compartilhar resultado no WhatsApp"

---

## 4. Lições por concorrente (Modelar — fase O.M.I.E.)

### Helium 10 — crescimento via conteúdo
- 500 episódios podcast "Serious Sellers Podcast"
- Helium 10 Academy com cursos gratuitos
- Chrome Extension como porta de entrada gratuita
- **Aplicação SmartPreço:** lead magnet `/calculadora-livre` é o "Chrome Extension" análogo; conteúdo educativo em comunidades WhatsApp/Telegram

### Sellerboard — bootstrapped + UX "1 número"
- 0 → 14k sellers sem funding em ~5 anos
- Foco obsessivo: lucro líquido real é a primeira tela
- **Aplicação SmartPreço:** stat card hero "R$ 500-1.500/mês perdido" implementado em VIAB-R1-2

### Letzee — narrativa "margem real" + certificação ML
- Posicionamento: "clareza total sobre os números"
- Certificação App Mercado Livre dez/2025 — sinaliza maturidade
- Aceleradoras Sebrae (Spark+Start+Speed)
- **Aplicação SmartPreço:** buscar certificação ML quando atingir critério mínimo; usar narrativa "margem ML específica" (não "margem genérica") para diferenciar

### GoSmarter — free tier permanente como SEO trojan
- Calculadora gratuita atrai tráfego "calculadora mercado livre grátis"
- Score IA é gancho de conversão para tier paid
- **Aplicação SmartPreço:** continuar `/calculadora-livre` SEM cadastro como SEO trap; nutrir via email pós-cálculo (já implementado em LeadMagnetForm)

### Anti-lições (NÃO copiar)

- **Hunter Hub:** spy de concorrente como feature core — não é dor da maioria do ICP central (validado em Método A: nenhum dos 10 sintéticos pediu)
- **Conciliação financeira (Hunter Hub + Letzee):** Bling cobre 70% do mercado — redundância
- **GoSmarter consultoria R$ 500-15k/mês:** misturar SaaS + serviço dilui posicionamento

---

## 5. Faixa de pricing deserta? — Atualização 2026-05-02

**Antes (benchmark 2026-05-01):** "faixa de preço deserta entre R$39 e R$100" no ecossistema ML BR.

**Agora (pós-descoberta Letzee/GoSmarter):** **NÃO está mais deserta.**
- R$ 0 — GoSmarter free tier
- R$ 39 — SmartPreço entry
- R$ 49 — Olist Avance
- **R$ 59 — Letzee Clareza** (tier que SmartPreço estava reivindicando como deserto)
- R$ 99 — Letzee Escala
- R$ 97-310 — Hunter Hub / Nubimetrics

**Implicação estratégica:** SmartPreço NÃO pode mais argumentar "única opção barata" — Letzee R$59 é só 50% mais caro. Diferenciação tem que ser em **especialização + UX + atualização automática**, não em preço sozinho.

---

## 6. Excelência — KPI alvos (fase E. de OMIE)

Dados-alvo para próxima sessão de revisão (2026-08):
- Market share SmartPreço entre as 12 ferramentas mapeadas: ?
- # menções SmartPreço vs Letzee em comunidades-alvo (sentiment analysis): ?
- CTR `/calculadora-livre` vs SEO de "calculadora mercado livre grátis" (concorrência GoSmarter): ?
- Conversão lead magnet → trial pago: ≥10% (meta)

---

## 7. Sources consolidadas

| Tag | Origem | Onde foi usada |
|-----|--------|----------------|
| [PUBLIC-DATA] | Capterra/G2/Reclame Aqui/YouTube/Chrome Web Store/sites oficiais | Letzee, GoSmarter, citações reais de vendedores |
| [SYNTHETIC] | 10 entrevistas sintéticas (Método A) | Comunidades regionais/verticais nominalmente identificadas |
| [MELIDEV] | Squad MeliDev (Método C) — `00-melidev-icp-proxy-2026-05-02.md` | Grupos FB amplos, perfil-tipo Ricardo |
| [INFERRED] | Inferência de pattern | Membros estimados não-confirmados publicamente |

**URLs verificadas em 2026-05-02:**
- https://letzee.ai/ + /precos/ + /sobre/
- https://gosmarter.com.br/ + /extensao-para-vendedores-mercado-livre/
- https://chrome.google.com/webstore (Letzee + GoSmarter)
- LinkedIn fundadores Letzee (Vitor Crovador)
- Econodata CNPJ Letzee + GoSmarter

---

*Documento v1 consolidado por Orion (@aiox-master) em 2026-05-02 a partir de Método B da triangulação ICP + atualização incremental do benchmark mundial. Próxima revisão: 2026-08-02 (checklist trimestral em `docs/architecture/ml-platform-risk-fallback.md`).*
