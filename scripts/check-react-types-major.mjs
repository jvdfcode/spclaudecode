#!/usr/bin/env node
/**
 * Veto Pedro Valério (Story TD-001-5):
 * Falha o build/CI se @types/react ou @types/react-dom tiverem MAJOR
 * diferente do react/react-dom instalado.
 *
 * Resolve a regressão DEBT-C1: @types/react@19 com react@18 instalado
 * passa silenciosamente em pnpm install mas quebra autocomplete e
 * abre buracos de tipo em runtime.
 */

import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

function major(version) {
  // Aceita "^18.3.1", "~18.3", "18.3.1", "18".
  const m = String(version).replace(/^[\^~>=<]+/, '').match(/^(\d+)/)
  return m ? Number(m[1]) : NaN
}

async function loadJson(rel) {
  const text = await readFile(resolve(root, rel), 'utf8')
  return JSON.parse(text)
}

async function main() {
  const pkg = await loadJson('package.json')
  const deps = pkg.dependencies ?? {}
  const dev = pkg.devDependencies ?? {}

  const checks = [
    { runtime: 'react', types: '@types/react' },
    { runtime: 'react-dom', types: '@types/react-dom' },
  ]

  const failures = []

  for (const { runtime, types } of checks) {
    const runtimeRange = deps[runtime] ?? dev[runtime]
    const typesRange = deps[types] ?? dev[types]

    if (!runtimeRange) continue // pacote runtime não está no projeto, ignora
    if (!typesRange) continue // sem @types — segue (não é débito)

    const a = major(runtimeRange)
    const b = major(typesRange)

    if (Number.isNaN(a) || Number.isNaN(b)) {
      failures.push(`Não consegui parsear versão de ${runtime} (${runtimeRange}) ou ${types} (${typesRange}).`)
      continue
    }

    if (a !== b) {
      failures.push(
        `❌ Mismatch de major: ${runtime}@${a} (${runtimeRange}) vs ${types}@${b} (${typesRange}). ` +
          `Alinhe ambos para o mesmo major em package.json.`,
      )
    }
  }

  if (failures.length > 0) {
    console.error('Veto TD-001-5 — react/types-react majors desalinhados:')
    for (const f of failures) console.error('  ' + f)
    process.exit(1)
  }

  console.log('✓ react/@types/react e react-dom/@types/react-dom em majors alinhados.')
}

main().catch((err) => {
  console.error('Erro inesperado:', err)
  process.exit(2)
})
