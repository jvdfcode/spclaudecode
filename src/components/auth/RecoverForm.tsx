'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function RecoverForm() {
  const [email, setEmail]     = useState('')
  const [error, setError]     = useState('')
  const [sent, setSent]       = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) { setError('Informe seu email.'); return }

    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/nova-senha`,
    })
    setLoading(false)

    if (error) {
      setError('Não foi possível enviar o email. Tente novamente.')
      return
    }

    setSent(true)
  }

  if (sent) {
    return (
      <div className="auth-card">
        <div className="auth-success-card">
          <div className="auth-success-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="auth-success-title">Email enviado</h2>
          <p className="auth-success-text">
            Enviamos um link de redefinição para{' '}
            <strong>{email}</strong>.
            Verifique também a pasta de spam.
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
      <div style={{ marginBottom: '0.75rem' }}>
        <Link href="/login" className="auth-link-sm" style={{ fontSize: '0.8125rem' }}>
          ← Voltar ao login
        </Link>
      </div>
      <h2 className="auth-card-title">Recuperar senha</h2>
      <p className="auth-card-subtitle">
        Informe seu email e enviaremos um link para redefinir sua senha.
      </p>

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
          />
        </div>

        {error && (
          <div className="auth-error" role="alert">
            <svg className="auth-error-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
            </svg>
            <p>{error}</p>
          </div>
        )}

        <button type="submit" className="auth-btn" disabled={loading}>
          {loading ? (
            <>
              <span className="auth-btn-spinner" />
              Enviando...
            </>
          ) : (
            'Enviar link de redefinição'
          )}
        </button>
      </form>
    </div>
  )
}
