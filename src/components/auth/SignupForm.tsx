'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GenieButton } from '@/components/ui/genie-button'
import { cn } from '@/lib/utils'

function PasswordStrength({ password }: { password: string }) {
  if (!password) return null
  const hasMin    = password.length >= 6
  const hasUpper  = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const score     = [hasMin, hasUpper, hasNumber].filter(Boolean).length

  const bar   = ['bg-red-400', 'bg-yellow-400', 'bg-green-500'][score - 1] ?? 'bg-gray-200'
  const label = ['Fraca', 'Média', 'Forte'][score - 1] ?? ''
  const width  = ['w-1/3', 'w-2/3', 'w-full'][score - 1] ?? 'w-0'

  return (
    <div className="space-y-1">
      <div className="h-1 w-full rounded-full bg-gray-100 overflow-hidden">
        <div className={cn('h-full rounded-full transition-all duration-300', bar, width)} />
      </div>
      {label && (
        <p className={cn('text-[11px]', score === 3 ? 'text-green-600' : score === 2 ? 'text-yellow-600' : 'text-red-500')}>
          Senha {label} {score < 3 && '— adicione letras maiúsculas e números'}
        </p>
      )}
    </div>
  )
}

export default function SignupForm() {
  const router = useRouter()
  const [email, setEmail]               = useState('')
  const [password, setPassword]         = useState('')
  const [confirmPassword, setConfirm]   = useState('')
  const [error, setError]               = useState('')
  const [loading, setLoading]           = useState(false)
  const [emailSent, setEmailSent]       = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim())              { setError('Informe seu email.'); return }
    if (password.length < 6)        { setError('A senha deve ter pelo menos 6 caracteres.'); return }
    if (password !== confirmPassword) { setError('As senhas não coincidem.'); return }

    setLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) {
      if (error.message.includes('already registered')) {
        setError('Este email já possui uma conta.')
      } else {
        setError('Erro ao criar conta. Tente novamente.')
      }
      setLoading(false)
      return
    }

    // Sem sessão → Supabase requer confirmação de email
    if (!data.session) {
      setEmailSent(true)
      setLoading(false)
      return
    }

    // Sessão ativa → auto-confirm habilitado, acessa diretamente
    router.push('/dashboard')
    router.refresh()
  }

  if (emailSent) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center space-y-4">
        <div className="text-5xl">📬</div>
        <h2 className="text-xl font-bold text-gray-900">Verifique seu email</h2>
        <p className="text-sm text-gray-500 max-w-xs mx-auto">
          Enviamos um link de confirmação para{' '}
          <span className="font-semibold text-gray-700">{email}</span>.
          Clique no link para ativar sua conta.
        </p>
        <p className="text-xs text-gray-400">Não recebeu? Verifique a pasta de spam.</p>
        <Link href="/login" className="inline-block text-sm text-blue-600 hover:underline mt-2">
          Voltar ao login
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <div className="mb-7">
        <h2 className="text-2xl font-bold text-gray-900">Criar conta grátis</h2>
        <p className="text-gray-500 mt-1 text-sm">Comece a precificar com inteligência agora</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="h-11"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-sm font-medium text-gray-700">Senha</Label>
          <Input
            id="password"
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            className="h-11"
          />
          <PasswordStrength password={password} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirmar senha</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Repita a senha"
            value={confirmPassword}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
            className={cn('h-11', confirmPassword && confirmPassword !== password && 'border-red-300 focus-visible:ring-red-300')}
          />
          {confirmPassword && confirmPassword !== password && (
            <p className="text-[11px] text-red-500">As senhas não coincidem</p>
          )}
        </div>
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        <GenieButton
          type="submit"
          loading={loading}
          fullWidth
          size="lg"
        >
          Criar conta grátis
        </GenieButton>
      </form>

      <p className="text-sm text-center text-gray-500 mt-6">
        Já tem conta?{' '}
        <Link href="/login" className="text-blue-600 font-medium hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  )
}
