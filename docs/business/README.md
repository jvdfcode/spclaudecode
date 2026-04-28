# Business — outputs do Bloco I (validação de mercado)

> Os documentos desta pasta são o **output documental** do EPIC-MKT-001
> (Bloco I — validação de mercado, novo no roadmap revisado pós-roundtable).
>
> H2 (cleanup + performance) está **condicionado** ao output consolidado
> em `ICP-validation-2026-Q2.md` — sem esse documento preenchido com dados
> reais das 5 stories (MKT-001-1..5), o H2 não é desbloqueado.

## Estrutura

```
docs/business/
├── README.md                              ← este arquivo
├── ICP-validation-2026-Q2.md              ← output consolidado, gera o gate de H2
├── interviews/                            ← 10 transcripts (MKT-001-2)
│   ├── INDEX.md
│   ├── ROTEIRO.md                         ← roteiro PWR + WTP usado em todas
│   ├── TEMPLATE.md                        ← template em branco para nova entrevista
│   └── 01-{nome-anonimizado}-2026-XX-XX.md
├── concorrencia-2026-Q2.md                ← output da OMIE (MKT-001-3)
└── posicionamento.md                      ← decisão Treacy & Wiersema (MKT-001-4)
```

## Regras

1. **Anonimização:** entrevistas usam pseudonimo + cidade + faixa de
   faturamento; jamais nome completo, CNPJ, ML user ID ou WhatsApp.
2. **Não-determinístico:** transcripts são fontes brutas. A síntese
   acontece em `ICP-validation-2026-Q2.md` (Story MKT-001-5).
3. **Não substitui o transcript pelo resumo:** preserve a fala literal
   relevante — Alan Nicolas (Pareto ao Cubo): "Se entrar cocô, sai cocô".
4. **Atualize INDEX.md** ao adicionar nova entrevista.
