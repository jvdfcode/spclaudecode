# SmartPreço

![CI](https://github.com/jvdfcode/spclaudecode/actions/workflows/ci.yml/badge.svg)

Sistema de apoio à decisão de preço para vendedores no Mercado Livre.

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Supabase** (PostgreSQL + Auth + RLS)
- **Tailwind CSS v4** + shadcn/ui
- **Vitest** (testes unitários)
- **Vercel** (deploy)

## Desenvolvimento local

```bash
# Instalar dependências
pnpm install

# Copiar variáveis de ambiente
cp .env.example .env.local
# Preencher .env.local com suas credenciais Supabase

# Rodar em desenvolvimento
pnpm dev

# Testes
pnpm test

# Build de produção
pnpm build
```

## Comandos

| Comando | Descrição |
|---------|---------|
| `pnpm dev` | Servidor de desenvolvimento (localhost:3000) |
| `pnpm build` | Build de produção |
| `pnpm test` | Rodar testes unitários |
| `pnpm test:coverage` | Testes com cobertura |
| `pnpm lint` | Verificar erros de lint |
| `pnpm typecheck` | Verificar tipos TypeScript |

## Estrutura

```
src/
  app/          # Next.js App Router (páginas e API routes)
  components/   # Componentes React
  lib/          # Lógica de negócio (motor de cálculo, Supabase, ML API)
  types/        # Tipos TypeScript do domínio
docs/           # PRD, arquitetura, stories
supabase/       # Migrations SQL
tests/          # Testes unitários
```
