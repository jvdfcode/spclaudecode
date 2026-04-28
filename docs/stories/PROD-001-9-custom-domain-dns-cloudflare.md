# Story PROD-001-9 — Custom domain smartpreco.app + DNS Cloudflare (proxy OFF apex)

**Epic:** EPIC-PROD-001
**Status:** Draft
**Owner:** Pedro Emilio
**Severidade origem:** H9
**Esforço estimado:** 2 SP

---

## Contexto

Gage (04-devops-gage.md, problemas 3 e 4) documenta que o DNS do Cloudflare atualmente aponta para AWS (`15.197.148.33` e `3.33.130.190`) com proxy ON — `smartpreco.app` serve a infra AWS anterior, não o deploy Vercel. O proxy ON no apex é incompatível com o processo ACME da Vercel para emissão de certificado TLS: a Vercel requer que o registro A do apex aponte diretamente para `76.76.21.21` com proxy OFF (grey cloud). Proxy ON faz o Cloudflare terminar TLS antes de chegar na Vercel, quebrando a validação do certificado e gerando erros SSL intermitentes.

Depende de PROD-001-8 (deploy production funcional e URL de deployment anotada).

---

## Acceptance Criteria

- [ ] `dig +short smartpreco.app A` retorna `76.76.21.21`
- [ ] `curl -Iv https://smartpreco.app 2>&1 | grep -E "issuer|subject"` mostra certificado emitido pela Vercel (não pela AWS)
- [ ] `curl -sI https://smartpreco.app` retorna `HTTP/2 200`
- [ ] `curl -sI https://www.smartpreco.app` retorna `HTTP/2 200` ou redirect para apex
- [ ] `vercel domains inspect smartpreco.app --scope jvdfcode` mostra status `verified`

---

## Tasks

- [ ] `vercel domains add smartpreco.app --scope jvdfcode`
- [ ] `vercel domains add www.smartpreco.app --scope jvdfcode`
- [ ] `vercel domains inspect smartpreco.app --scope jvdfcode` — anotar IP Vercel para apex (`76.76.21.21`) e CNAME para www
- [ ] No painel Cloudflare (smartpreco.app → DNS):
  - [ ] DELETAR registros A: `15.197.148.33` e `3.33.130.190`
  - [ ] CRIAR registro A: Name `@`, IPv4 `76.76.21.21`, Proxy status: **DNS only (grey cloud)**
  - [ ] VERIFICAR/ATUALIZAR registro CNAME www: Target `cname.vercel-dns.com`, Proxy status: **DNS only (grey cloud)**
  - [ ] Manter intactos: TXT `_dmarc`, CNAME `_domainco...` (validação de domínio)
- [ ] `dig +short smartpreco.app A` — aguardar retornar `76.76.21.21` (tipicamente 2-10min)
- [ ] `curl -Iv https://smartpreco.app` — verificar certificado TLS emitido pela Vercel

---

## File List

(nenhum arquivo de código modificado — operacional no Cloudflare e Vercel)

---

## Notas técnicas

Sequência canônica de Gage (Blocos 5 e 6):
```bash
# Bloco 5 — Custom domain no Vercel
vercel domains add smartpreco.app --scope jvdfcode
vercel domains add www.smartpreco.app --scope jvdfcode
vercel domains inspect smartpreco.app --scope jvdfcode
# IP do apex: 76.76.21.21

# Bloco 6 — DNS no Cloudflare (manual, no painel)
# a. DELETAR registros A: 15.197.148.33 e 3.33.130.190
# b. CRIAR registro A: @ → 76.76.21.21 com proxy OFF (grey cloud) OBRIGATORIO
# c. CNAME www: → cname.vercel-dns.com com proxy OFF recomendado

# Verificação
dig +short smartpreco.app A
# deve retornar: 76.76.21.21
```

Gage avisa: o botão "Continuar para ativação" no painel Cloudflare **não deve ser clicado** antes de o DNS Vercel estar propagado — ativar o modo full do Cloudflare antes da verificação Vercel invalida o processo ACME.

Bloco 7 — verificação de SSL:
```bash
curl -Iv https://smartpreco.app 2>&1 | grep -E "SSL|issuer|subject|HTTP/"
```

---

## Rollback

```bash
# Se DNS não propagar em 30 minutos ou certificado TLS falhar:
# 1. No painel Cloudflare, restaurar registros A para IPs AWS anteriores
#    - DELETAR registro A: 76.76.21.21
#    - CRIAR registro A: @ → 15.197.148.33 com Proxy ON
#    - CRIAR registro A: @ → 3.33.130.190 com Proxy ON
# 2. Verificar: dig +short smartpreco.app A
#    deve retornar 15.197.148.33 ou 3.33.130.190
# O preview URL *.vercel.app continua acessível independente do DNS
```

Janela de decisão: se após 30 minutos `dig +short smartpreco.app A` ainda não retornar `76.76.21.21`, executar rollback e investigar antes de continuar.

---

## Riscos

1. Propagação DNS pode levar até 24h globalmente, embora com Cloudflare seja tipicamente 2-10 minutos — executar no início de um dia de trabalho.
2. Durante a troca DNS há janela de downtime potencial — o app AWS anterior para de responder antes do Vercel começar; manter preview URL `smartpreco-*.vercel.app` como fallback.
3. Se o Cloudflare emitir um certificado próprio via proxy ON, SSL do Vercel falha — proxy OFF no apex é não-negociável.
