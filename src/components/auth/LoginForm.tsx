'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { fieldErrors, loginSchema } from '@/lib/validations/authSchemas'

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [fieldErrs, setFieldErrs] = useState<Record<string, string>>({})
  const [loading, setLoading]   = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setFieldErrs({})

    const parsed = loginSchema.safeParse({ email, password })
    if (!parsed.success) {
      setFieldErrs(fieldErrors(parsed))
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword(parsed.data)

    if (error) {
      setError('Email ou senha incorretos. Verifique e tente novamente.')
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="auth-card">
      <h2 className="auth-card-title">Bem-vindo de volta</h2>
      <p className="auth-card-subtitle">Entre com sua conta para continuar</p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="auth-field">
          <label htmlFor="email" className="auth-label">Email</label>
          <input
            id="email"
            type="email"
            className="auth-input"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            disabled={loading}
            aria-invalid={Boolean(fieldErrs.email) || undefined}
            aria-describedby={fieldErrs.email ? 'email-error' : undefined}
          />
          {fieldErrs.email && (
            <span id="email-error" className="auth-strength-label" style={{ color: '#ef4444' }}>
              {fieldErrs.email}
            </span>
          )}
        </div>

        <div className="auth-field">
          <div className="auth-field-header">
            <label htmlFor="password" className="auth-label">Senha</label>
            <Link href="/recuperar-senha" className="auth-link-sm">
              Esqueceu sua senha?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            className="auth-input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            disabled={loading}
            aria-invalid={Boolean(fieldErrs.password) || undefined}
            aria-describedby={fieldErrs.password ? 'password-error' : undefined}
          />
          {fieldErrs.password && (
            <span id="password-error" className="auth-strength-label" style={{ color: '#ef4444' }}>
              {fieldErrs.password}
            </span>
          )}
        </div>

        {error && (
          <div className="auth-error" role="alert">
            <svg className="auth-error-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
            </svg>
            <p>{error}</p>
          </div>
        )}

        <button
          type="submit"
          className="auth-btn"
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? (
            <>
              <span className="auth-btn-spinner" />
              Entrando...
            </>
          ) : (
            'Entrar'
          )}
        </button>
      </form>

      <div className="auth-card-footer">
        Não tem conta?{' '}
        <Link href="/cadastro">Criar conta grátis</Link>
      </div>
    </div>
  )
}
