#!/usr/bin/env node
/**
 * Halo DS v1.1 — Codemod big-bang
 *
 * Substitui tokens antigos do SmartPreço (ink/paper/gold/profit/warn/loss/etc.)
 * pelos tokens canônicos do Halo v1.1.
 *
 * Mapeamento decidido pelo Design Chief (decisao-final-design-chief.md):
 * - Semânticos profit/warn/loss → Solar/Mist/Eclipse + ícone + texto (§12.5)
 *   Para o codemod automático mapeamos cores diretas; componentes que
 *   comunicam viabilidade são tratados manualmente após o codemod.
 *
 * Uso: node scripts/codemod-halo.mjs [--dry-run] [--check]
 *   --dry-run: imprime o que faria sem escrever
 *   --check:   sai com código != 0 se ainda houver tokens legacy após executar
 */

import { readdir, readFile, writeFile, stat } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve, join, extname } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const DRY_RUN = process.argv.includes('--dry-run')
const CHECK_ONLY = process.argv.includes('--check')

const TARGET_DIRS = ['src']
const EXTENSIONS = new Set(['.tsx', '.ts', '.css', '.mdx'])
const SKIP_PATHS = ['/node_modules/', '/.next/', '/dist/', '/build/']
const SKIP_FILES = new Set(['globals.css', 'tailwind.config.ts'])

/**
 * Mapeamento ordenado: padrões mais específicos primeiro.
 * Cada item: [regex, replacement, description]
 *
 * Regex tem boundaries (\b ou class-context) para evitar substituição
 * dentro de strings/comentários não-classe.
 */
const MAPPINGS = [
  // ==== INK (azul-índigo SmartPreço → halo-navy / ink) ====
  [/\bink-950\b/g, 'halo-navy', 'ink-950 → halo-navy'],
  [/\bink-900\b/g, 'halo-black', 'ink-900 → halo-black'],
  [/\bink-700\b/g, 'halo-navy-60', 'ink-700 → halo-navy-60'],
  [/\bink-500\b/g, 'halo-navy-40', 'ink-500 → halo-navy-40'],
  [/\bbg-ink\b/g, 'bg-halo-navy', 'bg-ink (sem step) → bg-halo-navy'],
  [/\btext-ink\b/g, 'text-halo-black', 'text-ink → text-halo-black'],

  // ==== PAPER (branco/cinza SmartPreço → halo-gray) ====
  [/\bpaper-50\b/g, 'halo-gray-05', 'paper-50 → halo-gray-05'],
  [/\bpaper-100\b/g, 'halo-gray-15', 'paper-100 → halo-gray-15'],
  [/\bpaper-200\b/g, 'halo-gray', 'paper-200 → halo-gray'],
  [/\bbg-paper\b/g, 'bg-canvas', 'bg-paper → bg-canvas'],
  [/\btext-paper\b/g, 'text-halo-white', 'text-paper → text-halo-white'],

  // ==== GOLD (amarelo SmartPreço → halo-orange / Solar) ====
  [/\bgold-300\b/g, 'halo-orange-15', 'gold-300 → halo-orange-15'],
  [/\bgold-400\b/g, 'halo-orange', 'gold-400 → halo-orange (Solar)'],
  [/\bgold-500\b/g, 'halo-orange-80', 'gold-500 → halo-orange-80'],
  [/\bbg-gold\b/g, 'bg-halo-orange', 'bg-gold → bg-halo-orange'],
  [/\btext-gold\b/g, 'text-halo-orange', 'text-gold → text-halo-orange'],

  // ==== PROFIT/VIABLE (verde → Solar com ícone obrigatório) ====
  [/\bprofit-500\b/g, 'halo-orange-80', 'profit-500 → halo-orange-80 (Solar; lembrar ícone+texto)'],
  [/\bprofit-200\b/g, 'halo-orange-30', 'profit-200 → halo-orange-30'],
  [/\bprofit-50\b/g, 'halo-orange-15', 'profit-50 → halo-orange-15'],
  [/\bbg-profit\b/g, 'bg-halo-orange', 'bg-profit → bg-halo-orange'],
  [/\btext-profit\b/g, 'text-halo-orange-80', 'text-profit → text-halo-orange-80'],
  [/\bborder-profit\b/g, 'border-halo-orange', 'border-profit → border-halo-orange'],
  // 'viable' como TS string literal NÃO é substituído — preservar tipos do domínio.

  // ==== WARN/ATTENTION (laranja → Solar) ====
  [/\bwarn-500\b/g, 'halo-orange-100', 'warn-500 → halo-orange-100'],
  [/\bwarn-200\b/g, 'halo-orange-30', 'warn-200 → halo-orange-30'],
  [/\bwarn-50\b/g, 'halo-orange-05', 'warn-50 → halo-orange-05'],
  [/\bbg-warn\b/g, 'bg-halo-orange', 'bg-warn → bg-halo-orange'],
  [/\btext-warn\b/g, 'text-halo-orange-100', 'text-warn → text-halo-orange-100'],
  [/\bborder-warn\b/g, 'border-halo-orange-30', 'border-warn → border-halo-orange-30'],
  // 'attention' como TS string literal NÃO é substituído — preservar tipos do domínio.

  // ==== LOSS/DANGER (vermelho → Eclipse com ícone obrigatório) ====
  [/\bloss-500\b/g, 'halo-navy', 'loss-500 → halo-navy (Eclipse; ícone+texto obrigatório)'],
  [/\bloss-200\b/g, 'halo-navy-20', 'loss-200 → halo-navy-20'],
  [/\bloss-50\b/g, 'halo-gray-15', 'loss-50 → halo-gray-15'],
  [/\bbg-loss\b/g, 'bg-halo-navy', 'bg-loss → bg-halo-navy'],
  [/\btext-loss\b/g, 'text-halo-navy', 'text-loss → text-halo-navy'],
  [/\bborder-loss\b/g, 'border-halo-navy', 'border-loss → border-halo-navy'],
  // 'danger' como TS string literal NÃO é substituído — preservar tipos do domínio.

  // ==== PRIMARY (azul SmartPreço alias → halo-navy) ====
  [/\bbg-primary\b/g, 'bg-halo-navy', 'bg-primary → bg-halo-navy'],
  [/\btext-primary\b/g, 'text-halo-navy', 'text-primary → text-halo-navy'],
  [/\bborder-primary\b/g, 'border-halo-navy', 'border-primary → border-halo-navy'],
  [/\bprimary-50\b/g, 'halo-orange-15', 'primary-50 → halo-orange-15'],
  [/\bprimary-100\b/g, 'halo-orange-30', 'primary-100 → halo-orange-30'],
  [/\bprimary-500\b/g, 'halo-navy', 'primary-500 → halo-navy'],
  [/\bprimary-600\b/g, 'halo-navy-90', 'primary-600 → halo-navy-90'],
  [/\bprimary-700\b/g, 'halo-navy-80', 'primary-700 → halo-navy-80'],

  // ==== HEX RAW (cores SmartPreço hardcoded em CSS) ====
  // Casos de hex literal — só fora de globals.css (já migrado).
  [/#2d3277/gi, 'var(--halo-navy)', '#2d3277 → var(--halo-navy)'],
  [/#1a1f50/gi, 'var(--halo-navy-90)', '#1a1f50 → var(--halo-navy-90)'],
  [/#ffe600/gi, 'var(--halo-orange)', '#ffe600 → var(--halo-orange)'],
  [/#fff17a/gi, 'var(--halo-orange-15)', '#fff17a → var(--halo-orange-15)'],
  [/#0e9f6e/gi, 'var(--halo-orange-80)', '#0e9f6e → var(--halo-orange-80) (verde→Solar)'],
  [/#c06b00/gi, 'var(--halo-orange-100)', '#c06b00 → var(--halo-orange-100)'],
  [/#d64545/gi, 'var(--halo-navy)', '#d64545 → var(--halo-navy) (vermelho→Eclipse)'],
]

async function* walkFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = join(dir, entry.name)
    const relative = full.replace(root, '')
    if (SKIP_PATHS.some((p) => relative.includes(p))) continue
    if (entry.isDirectory()) {
      yield* walkFiles(full)
    } else if (entry.isFile() && EXTENSIONS.has(extname(entry.name))) {
      if (SKIP_FILES.has(entry.name)) continue
      yield full
    }
  }
}

async function main() {
  let totalFiles = 0
  let changedFiles = 0
  let totalReplacements = 0
  const perPattern = new Map()

  for (const dir of TARGET_DIRS) {
    const fullDir = resolve(root, dir)
    try {
      await stat(fullDir)
    } catch {
      continue
    }
    for await (const file of walkFiles(fullDir)) {
      totalFiles++
      let content = await readFile(file, 'utf8')
      const original = content
      let fileReplacements = 0

      for (const [regex, replacement, desc] of MAPPINGS) {
        const matches = content.match(regex)
        if (matches && matches.length > 0) {
          content = content.replace(regex, replacement)
          fileReplacements += matches.length
          perPattern.set(desc, (perPattern.get(desc) ?? 0) + matches.length)
        }
      }

      if (content !== original) {
        changedFiles++
        totalReplacements += fileReplacements
        if (!DRY_RUN) {
          await writeFile(file, content, 'utf8')
        }
        const rel = file.replace(root + '/', '')
        console.log(`  ${DRY_RUN ? '[dry] ' : ''}${rel} (${fileReplacements} replacements)`)
      }
    }
  }

  console.log('\n────────────────────────────────────────────────')
  console.log(`Codemod Halo v1.1 — ${DRY_RUN ? 'DRY RUN' : 'APLICADO'}`)
  console.log('────────────────────────────────────────────────')
  console.log(`Arquivos visitados:  ${totalFiles}`)
  console.log(`Arquivos alterados:  ${changedFiles}`)
  console.log(`Substituições:       ${totalReplacements}`)
  console.log('\nPor padrão:')
  const sorted = [...perPattern.entries()].sort((a, b) => b[1] - a[1])
  for (const [desc, count] of sorted) {
    console.log(`  ${count.toString().padStart(4)}  ${desc}`)
  }
  console.log('────────────────────────────────────────────────\n')

  if (CHECK_ONLY && !DRY_RUN) {
    // Após aplicar, conta o que sobrou.
    const stillLegacy = await countLegacy()
    if (stillLegacy > 0) {
      console.error(`❌ ${stillLegacy} ocorrências de tokens legacy ainda presentes em src/.`)
      process.exit(1)
    }
    console.log(`✓ Zero tokens legacy restantes.`)
  }
}

async function countLegacy() {
  // Conta uso ainda de tokens legacy padrão (referência grosseira)
  const legacyTokens = ['ink-9', 'paper-', 'gold-', 'profit-', 'warn-', 'loss-', 'attention', 'viable', 'primary-5']
  let total = 0
  for await (const file of walkFiles(resolve(root, 'src'))) {
    if (SKIP_FILES.has(file.split('/').pop())) continue
    const content = await readFile(file, 'utf8')
    for (const token of legacyTokens) {
      const matches = content.match(new RegExp(`\\b${token}`, 'g'))
      if (matches) total += matches.length
    }
  }
  return total
}

main().catch((err) => {
  console.error('Erro inesperado:', err)
  process.exit(2)
})
