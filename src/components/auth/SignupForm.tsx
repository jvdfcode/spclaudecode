'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { fieldErrors, signupSchema } from '@/lib/validations/authSchemas'

function strengthOf(password: string): { score: number; label: string; color: string; width: string } {
  if (!password) return { score: 0, label: '', color: '#e2e8f0', width: '0%' }
  const hasMin    = password.length >= 6
  const hasUpper  = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const score     = [hasMin, hasUpper, hasNumber].filter(Boolean).length
  const map = [
    { label: '',       color: '#e2e8f0', width: '0%'   },
    { label: 'Fraca',  color: '#f87171', width: '33%'  },
    { label: 'Média',  color: '#fbbf24', width: '66%'  },
    { label: 'Forte',  color: '#34d399', width: '100%' },
  ]
  return { score, ...map[score] }
}

export default function SignupForm() {
  const router = useRouter()
  const [email, setEmail]             = useState('')
  const [password, setPassword]       = useState('')
  const [confirmPassword, setConfirm] = useState('')
  const [error, setError]             = useState('')
  const [fieldErrs, setFieldErrs]     = useState<Record<string, string>>({})
  const [loading, setLoading]         = useState(false)
  const [emailSent, setEmailSent]     = useState(false)

  const strength      = strengthOf(password)
  const confirmMismatch = confirmPassword.length > 0 && confirmPassword !== password

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setFieldErrs({})

    const parsed = signupSchema.safeParse({ email, password, confirmPassword })
    if (!parsed.success) {
      setFieldErrs(fieldErrors(parsed))
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
    })

    if (error) {
      setError(
        error.message.includes('already registered')
          ? 'Este email já possui uma conta.'
          : 'Erro ao criar conta. Tente novamente.'
      )
      setLoading(false)
      return
    }

    if (!data.session) {
      setEmailSent(true)
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  if (emailSent) {
    return (
      <div className="auth-card">
        <div className="auth-success-card">
          <div className="auth-success-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="auth-success-title">Verifique seu email</h2>
          <p className="auth-success-text">
            Enviamos um link de confirmação para{' '}
            <strong>{email}</strong>.
            Clique no link para ativar sua conta.
          </p>
          <p className="auth-success-text" style={{ fontSize: '0.8125rem', color: '#94a3b8', marginTop: '0.25rem' }}>
            Não recebeu? Verifique a pasta de spam.
          </p>
          <div style={{ marginTop: '1.5rem' }}>
            <Link href="/login" className="auth-link-sm" style={{ fontSize: '0.875rem' }}>
              ← Voltar ao login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-card">
      <h2 className="auth-card-title">Criar conta grátis</h2>
      <p className="auth-card-subtitle">Comece a precificar com inteligência agora</p>

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
            aria-describedby={fieldErrs.email ? 'signup-email-error' : undefined}
          />
          {fieldErrs.email && (
            <span id="signup-email-error" className="auth-strength-label" style={{ color: '#ef4444' }}>
              {fieldErrs.email}
            </span>
          )}
        </div>

        <div className="auth-field">
          <label htmlFor="password" className="auth-label">Senha</label>
          <input
            id="password"
            type="password"
            className="auth-input"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            disabled={loading}
            aria-invalid={Boolean(fieldErrs.password) || undefined}
            aria-describedby={fieldErrs.password ? 'signup-password-error' : 'signup-password-strength'}
          />
          {fieldErrs.password && (
            <span id="signup-password-error" className="auth-strength-label" style={{ color: '#ef4444' }}>
              {fieldErrs.password}
            </span>
          )}
          {password && (
            <>
              <div className="auth-strength-bar-wrap">
                <div
                  className="auth-strength-bar"
                  style={{ width: strength.width, background: strength.color }}
                />
              </div>
              <span
                id="signup-password-strength"
                className="auth-strength-label"
                style={{ color: strength.color === '#e2e8f0' ? '#94a3b8' : strength.color }}
              >
                {strength.label && `Senha ${strength.label}`}
                {strength.score < 3 && strength.score > 0 && ' — adicione letras maiúsculas e números'}
              </span>
            </>
          )}
        </div>

        <div className="auth-field">
          <label htmlFor="confirmPassword" className="auth-label">Confirmar senha</label>
          <input
            id="confirmPassword"
            type="password"
            className={`auth-input${confirmMismatch ? ' auth-match-err' : confirmPassword && !confirmMismatch ? ' auth-match-ok' : ''}`}
            placeholder="Repita a senha"
            value={confirmPassword}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
            disabled={loading}
            aria-invalid={Boolean(fieldErrs.confirmPassword || confirmMismatch) || undefined}
            aria-describedby={
              fieldErrs.confirmPassword || confirmMismatch ? 'confirm-password-error' : undefined
            }
          />
          {(fieldErrs.confirmPassword || confirmMismatch) && (
            <span id="confirm-password-error" className="auth-strength-label" style={{ color: '#ef4444' }}>
              {fieldErrs.confirmPassword ?? 'As senhas não coincidem'}
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

        <button type="submit" className="auth-btn" disabled={loading} aria-busy={loading}>
          {loading ? (
            <>
              <span className="auth-btn-spinner" />
              Criando conta...
            </>
          ) : (
            'Criar conta grátis'
          )}
        </button>
      </form>

      <div className="auth-card-footer">
        Já tem conta?{' '}
        <Link href="/login">Entrar</Link>
      </div>
    </div>
  )
}
