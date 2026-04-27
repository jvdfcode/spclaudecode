'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GenieButton } from '@/components/ui/genie-button'

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) { setError('Informe seu email.'); return }
    if (!password)     { setError('Informe sua senha.'); return }

    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Email ou senha incorretos')
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <div className="mb-7">
        <h2 className="text-2xl font-bold text-gray-900">Bem-vindo de volta</h2>
        <p className="text-gray-500 mt-1 text-sm">Entre com sua conta para continuar</p>
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
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">Senha</Label>
            <Link
              href="/recuperar-senha"
              className="text-xs text-blue-600 hover:underline"
            >
              Esqueceu sua senha?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="h-11"
          />
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
          Entrar
        </GenieButton>
      </form>

      <p className="text-sm text-center text-gray-500 mt-6">
        Não tem conta?{' '}
        <Link href="/cadastro" className="text-blue-600 font-medium hover:underline">
          Criar conta grátis
        </Link>
      </p>
    </div>
  )
}
