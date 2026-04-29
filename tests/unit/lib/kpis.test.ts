import { describe, it, expect } from 'vitest'
import { _ratioForTesting } from '@/lib/analytics/kpis'

describe('_ratioForTesting (helper de KPIs)', () => {
  it('retorna 0 quando denominador é 0', () => {
    expect(_ratioForTesting(10, 0)).toBe(0)
  })

  it('arredonda para 4 casas', () => {
    expect(_ratioForTesting(1, 3)).toBe(0.3333)
  })

  it('retorna proporção exata em casos limpos', () => {
    expect(_ratioForTesting(50, 100)).toBe(0.5)
  })

  it('aceita zero no numerador', () => {
    expect(_ratioForTesting(0, 100)).toBe(0)
  })

  it('lida com números maiores que 1 (não normaliza)', () => {
    expect(_ratioForTesting(150, 100)).toBe(1.5)
  })
})
