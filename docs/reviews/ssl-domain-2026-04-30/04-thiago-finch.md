# Thiago Finch — Auditoria Funnel-First do diagnóstico SSL (Aria v2)

> "Engenharia que não move o funil é hobby caro. Mostra o lead que entra ou não passa."

## Veredito (1 frase)

**NEEDS WORK** — Root cause correta, mas ignora o fato nuclear: `.app` é TLD HSTS-preloaded = ZERO usuários acessam o site, e não propõe workaround imediato via URL `*.vercel.app` que já tem cert válido.

## Custo de NÃO emitir o cert (loss aversion calibrado)

**Fato que ninguém mencionou:** `.app` está na lista HSTS preload (Chromium/Firefox/Safari). Todo browser faz upgrade automático HTTP→HTTPS. Sem cert, o browser tenta HTTPS, recebe `SSL handshake read 0 bytes`, mostra `ERR_SSL_PROTOCOL_ERROR`. O `curl` HTTP funciona; o browser NÃO. Site 100% inacessível.

- **1h sem HTTPS = 100% tráfego bloqueado.** Não é degradação — é bloqueio total. Link em WhatsApp/email → tela de erro. Zero conversão.
- **1 dia = ~14 visitas perdidas** (base Alex: ~100/semana). Pior: cada link que falha queima credibilidade com early adopters. Loss aversion: reconquistar vendedor ML que viu erro SSL custa 5-10x a primeira impressão.
- **1 semana = ~100 visitas, ~20-50 cálculos, 0 leads.** Meta MKT-001 "10 leads em 30 dias" inviável.
- **SEO:** Googlebot moderno tenta HTTPS em `.app`; sem cert = sem indexação = topo de funil orgânico inexistente.
- **Share previews:** WhatsApp/Slack fazem fetch HTTPS para OG preview. Sem cert = texto azul sem thumbnail = CTR de compartilhamento cai ~60-80%.
- **Custo de atraso por hora:** R1+R2 leva 15 min. Cada hora "esperando" é ROI por hora negativo quando a ação custa quase nada.

## 3 Fortalezas (o que move funil)

1. **Root cause precisa = fix rápido.** Convergência em H1 (TXT `_vercel` ausente) sólida; R1+R2 leva 15 min. Diagnóstico bom encurta tempo-para-conversão.
2. **Sequência reversível.** R1 (read-only) → R2 (TXT) → R3 (reset) = menor risco por passo, rollback declarado.
3. **Instrumentação pronta.** PROD-001-13 Done: `trackFunnel()` emite 4 eventos via beacon + Vercel Analytics. Cert resolvido → funil registra dados imediatamente.

## 3 Fraquezas (engenharia que não move ponteiro)

1. **Ignora HSTS preload.** Diagnóstico trata "HTTP 307 funciona" como parcialmente ok. Para o funil, `.app` HSTS = site inacessível, não degradado. Time pode subestimar urgência.

2. **Zero workaround de funil.** URL `smartpreco-*.vercel.app` já tem cert válido. Sprint doc e PROD-001-8 documentam como fallback. Diagnóstico deveria incluir R0: "Compartilhar URL `*.vercel.app` para early adopters agora. Custo: 0. Tração: imediata."

3. **Não conecta SSL → instrumentação.** Sem site acessível, `@vercel/analytics` não carrega, `/api/track` não recebe beacon. 0 usuários = 0 eventos de funil = PROD-001-13 (Done) registra nada.

## OMIE check

- [x] Vercel emite cert em <5 min após TXT verificado. Atraso é TXT ausente, não Vercel lento.
- [ ] `.app` em Vercel funciona normalmente; problema é ownership, não TLD.
- [ ] Cloudflare Pages/Netlify emitem cert igual, mas migrar agora é custo de atraso desnecessário quando fix é 15 min.

## 3 Recomendações Funnel-First

1. **PRIORIZAR (agora, 15 min):** R1+R2 da Aria. Dashboard Vercel → copiar TXT → GoDaddy. Gate: `openssl s_client` retorna Let's Encrypt. Cada minuto de atraso = minuto sem funil.

2. **WORKAROUND IMEDIATO (paralelo, 0 min):** Usar URL `smartpreco-[hash].vercel.app` (cert válido) para compartilhamento com early adopters e validação end-to-end da instrumentação PROD-001-13. Localizar URL exata: dashboard Vercel → Deployments → Production.

3. **MEDIO PRAZO (esta semana):** Redirect 301 `www` → apex (evidência 7 da Aria: CNAME errado). OG meta tags para share previews. Google Search Console com HTTPS — sem isso, topo de funil orgânico não inicia.

## Conclusão executiva

Engenharia da Aria correta: falta TXT, fix de 15 min. Mas o diagnóstico subestima o custo de atraso: `.app` HSTS-preloaded = site 100% inacessível, não "parcialmente funcional". URL `*.vercel.app` como workaround de tração imediata não foi mencionada. SSL não é problema de infra — é o bloqueio #1 do funil inteiro.
