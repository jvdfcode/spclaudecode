import { describe, it, expect } from 'vitest'
import { classifyViability } from '@/lib/calculations/classifier'

describe('classifyViability', () => {
  it('≥ 20% → viable', () => {
    expect(classifyViability(20)).toBe('viable')
    expect(classifyViability(35)).toBe('viable')
    expect(classifyViability(100)).toBe('viable')
  })

  it('10% a 19.99% → attention', () => {
    expect(classifyViability(10)).toBe('attention')
    expect(classifyViability(15)).toBe('attention')
    expect(classifyViability(19.99)).toBe('attention')
  })

  it('< 10% → not_viable', () => {
    expect(classifyViability(9.99)).toBe('not_viable')
    expect(classifyViability(0)).toBe('not_viable')
    expect(classifyViability(-5)).toBe('not_viable')
  })

  it('exatamente 20% → viable', () => {
    expect(classifyViability(20)).toBe('viable')
  })

  it('exatamente 10% → attention', () => {
    expect(classifyViability(10)).toBe('attention')
  })
})
