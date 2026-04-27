import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ connected: false })

  const { data } = await supabase
    .from('ml_tokens')
    .select('expires_at')
    .single()

  if (!data) return NextResponse.json({ connected: false })

  const expiresAt = new Date(data.expires_at as string)
  const connected = expiresAt > new Date()

  return NextResponse.json({ connected, expiresAt: data.expires_at })
}
