import { describe, it, expect } from 'vitest'
import { formatBRL, formatPercent } from '@/lib/utils/format'

describe('formatBRL', () => {
  it('formata valor positivo', () => {
    expect(formatBRL(99.90)).toMatch(/99/)
    expect(formatBRL(99.90)).toMatch(/R\$|R/)
  })

  it('formata zero', () => {
    expect(formatBRL(0)).toMatch(/0/)
  })

  it('formata valor negativo', () => {
    const result = formatBRL(-50)
    expect(result).toMatch(/50/)
  })

  it('inclui duas casas decimais', () => {
    expect(formatBRL(10)).toMatch(/00|10,00|10\.00/)
  })
})

describe('formatPercent', () => {
  it('formata percentual com símbolo', () => {
    expect(formatPercent(20)).toMatch(/%/)
    expect(formatPercent(20)).toMatch(/20/)
  })

  it('formata zero', () => {
    expect(formatPercent(0)).toMatch(/0/)
  })

  it('formata valor negativo', () => {
    expect(formatPercent(-5)).toMatch(/5/)
  })

  it('retorna string', () => {
    expect(typeof formatPercent(15)).toBe('string')
  })
})
