// Edge Function — roda na infraestrutura Cloudflare do Vercel.
// IPs do edge não são bloqueados pelo ML (diferente de servidores cloud e IPs residenciais bloqueados).
export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'

const ML_SEARCH = 'https://api.mercadolibre.com/sites/MLB/search'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim()
  if (!q || q.length < 2) {
    return NextResponse.json({ error: 'Informe ao menos 2 caracteres' }, { status: 400 })
  }

  const url = `${ML_SEARCH}?q=${encodeURIComponent(q)}&limit=50`

  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
    })

    if (res.status === 429) {
      return NextResponse.json({ error: 'Limite de requisições atingido. Aguarde um momento.' }, { status: 429 })
    }

    if (!res.ok) {
      return NextResponse.json({ error: `ML API ${res.status}` }, { status: 502 })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Erro de conexão com o Mercado Livre.' }, { status: 503 })
  }
}
