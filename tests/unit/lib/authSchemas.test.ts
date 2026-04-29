import { describe, it, expect } from 'vitest'
import { loginSchema, signupSchema, recoverSchema, fieldErrors } from '@/lib/validations/authSchemas'

describe('loginSchema', () => {
  it('aceita email e senha válidos', () => {
    const r = loginSchema.safeParse({ email: 'pedro@orange.casa', password: '123456' })
    expect(r.success).toBe(true)
  })

  it('rejeita email inválido', () => {
    const r = loginSchema.safeParse({ email: 'pedro@', password: '123456' })
    expect(r.success).toBe(false)
    if (!r.success) {
      const errors = fieldErrors(r)
      expect(errors.email).toMatch(/inválido/i)
    }
  })

  it('rejeita email vazio com mensagem específica', () => {
    const r = loginSchema.safeParse({ email: '   ', password: '123456' })
    expect(r.success).toBe(false)
    if (!r.success) {
      expect(fieldErrors(r).email).toMatch(/Informe seu email/)
    }
  })

  it('faz trim do email antes de validar', () => {
    const r = loginSchema.safeParse({ email: '  pedro@orange.casa  ', password: '123456' })
    expect(r.success).toBe(true)
    if (r.success) expect(r.data.email).toBe('pedro@orange.casa')
  })
})

describe('signupSchema', () => {
  it('aceita signup completo válido', () => {
    const r = signupSchema.safeParse({
      email: 'pedro@orange.casa',
      password: 'forte123',
      confirmPassword: 'forte123',
    })
    expect(r.success).toBe(true)
  })

  it('rejeita confirmação que não coincide com senha', () => {
    const r = signupSchema.safeParse({
      email: 'pedro@orange.casa',
      password: 'forte123',
      confirmPassword: 'fraca456',
    })
    expect(r.success).toBe(false)
    if (!r.success) {
      expect(fieldErrors(r).confirmPassword).toMatch(/não coincidem/i)
    }
  })

  it('rejeita senha curta', () => {
    const r = signupSchema.safeParse({
      email: 'pedro@orange.casa',
      password: '123',
      confirmPassword: '123',
    })
    expect(r.success).toBe(false)
    if (!r.success) {
      expect(fieldErrors(r).password).toMatch(/6 caracteres/)
    }
  })
})

describe('recoverSchema', () => {
  it('aceita email isolado', () => {
    const r = recoverSchema.safeParse({ email: 'pedro@orange.casa' })
    expect(r.success).toBe(true)
  })
})
