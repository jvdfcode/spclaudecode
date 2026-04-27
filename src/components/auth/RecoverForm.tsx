'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GenieButton } from '@/components/ui/genie-button'

export default function RecoverForm() {
  const [email, setEmail]   = useState('')
  const [error, setError]   = useState('')
  const [sent, setSent]     = useState(false)
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
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center space-y-4">
        <div className="text-4xl">📬</div>
        <h2 className="text-xl font-bold text-gray-900">Verifique seu email</h2>
        <p className="text-sm text-gray-500">
          Enviamos um link de redefinição para <span className="font-medium text-gray-700">{email}</span>.
          Verifique também a pasta de spam.
        </p>
        <Link href="/login" className="inline-block text-sm text-blue-600 hover:underline mt-2">
          Voltar ao login
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <div className="mb-7">
        <Link href="/login" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mb-5">
          ← Voltar ao login
        </Link>
        <h2 className="text-2xl font-bold text-gray-900">Recuperar senha</h2>
        <p className="text-gray-500 mt-1 text-sm">
          Informe seu email e enviaremos um link para redefinir sua senha.
        </p>
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
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        <GenieButton type="submit" loading={loading} fullWidth size="lg">
          Enviar link de redefinição
        </GenieButton>
      </form>
    </div>
  )
}
