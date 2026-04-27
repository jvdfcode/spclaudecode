// Scraping de lista.mercadolivre.com.br com headers de browser.
// Funciona de servidores porque o site ML não bloqueia IPs de servidor como a API faz.
import { NextRequest, NextResponse } from 'next/server'
import * as cheerio from 'cheerio'
import { createServerSupabase } from '@/lib/supabase/server'
import { checkRateLimit } from '@/lib/rateLimit'
import type { MlListing } from '@/types'

const log = (msg: string, data?: object) =>
  console.log(JSON.stringify({ ts: Date.now(), msg, ...data }))

const ML_SITE = 'https://lista.mercadolivre.com.br'

const HEADERS = {
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
  'Cache-Control': 'no-cache',
  'Sec-Ch-Ua': '"Brave";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
  'Sec-Ch-Ua-Mobile': '?0',
  'Sec-Ch-Ua-Platform': 'Linux',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'same-origin',
  'Sec-Fetch-User': '?1',
  'Upgrade-Insecure-Requests': '1',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
}

function slugify(q: string): string {
  return q
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

function parsePrice(raw: string): number | null {
  if (!raw) return null
  const n = parseFloat(raw.replace('R$', '').replace(/\./g, '').replace(',', '.').replace(/\s/g, ''))
  return isFinite(n) ? n : null
}

function matchRatio(title: string, query: string): number {
  const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\w\s]/g, ' ')
  const words = norm(query).split(/\s+/).filter(Boolean)
  if (!words.length) return 0
  const titleNorm = norm(title)
  const matched = words.filter(w => titleNorm.includes(w))
  return matched.length / words.length
}

function parseListings(html: string, query: string): MlListing[] {
  const $ = cheerio.load(html)
  const results: MlListing[] = []

  $('.ui-search-layout__item').each((_, el) => {
    const title = $(el).find('div.poly-card__content h3').text().trim()
    if (!title) return

    const priceRaw = $(el).find('div.poly-price__current span').first().text()
    const price = parsePrice(priceRaw)
    if (!price) return

    const ratio = matchRatio(title, query)
    if (ratio < 0.5) return  // menos restritivo que 0.8 para retornar mais resultados

    const href = $(el).find('a.poly-component__title').attr('href') ?? ''
    const thumbnail = $(el).find('img.poly-component__picture').attr('src')
      || $(el).find('img.poly-component__picture').attr('data-src')
      || ''

    const shippingText = $(el).find('div.poly-component__shipping, div.poly-component__shipping-v2').text().toLowerCase()
    const freeShipping = shippingText.includes('frete grátis') || shippingText.includes('frete gratis')

    const isFull = $(el).find('svg[aria-label="Enviado pelo FULL"], span.poly-component__shipped-from svg').length > 0

    const sellerRaw = $(el).find('span.poly-component__seller').clone().children().remove().end().text().trim()
    void sellerRaw

    results.push({
      id: href.split('/MLB')[1]?.split('?')[0] ?? String(Math.random()),
      title,
      price,
      currencyId: 'BRL',
      condition: 'not_specified',
      freeShipping,
      isFulfillment: isFull,
      sellerReputation: null,
      soldQuantity: 0,
      thumbnail,
      permalink: href,
    })

    if (results.length >= 50) return false
  })

  return results
}

export async function GET(req: NextRequest) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const rl = await checkRateLimit(user.id, 'ml-proxy')
  const rlHeaders = {
    'X-RateLimit-Limit': String(rl.limit),
    'X-RateLimit-Remaining': String(rl.remaining),
    ...(rl.retryAfter ? { 'Retry-After': String(rl.retryAfter) } : {}),
  }

  if (!rl.ok) {
    return NextResponse.json(
      { error: 'Muitas requisições. Aguarde antes de buscar novamente.' },
      { status: 429, headers: rlHeaders }
    )
  }

  const q = req.nextUrl.searchParams.get('q')?.trim()
  if (!q || q.length < 2) {
    return NextResponse.json({ error: 'Informe ao menos 2 caracteres' }, { status: 400, headers: rlHeaders })
  }

  const slug = slugify(q)
  const url = `${ML_SITE}/novo/${slug}_OrderId_PRICE_NoIndex_True`

  try {
    const res = await fetch(url, {
      headers: { ...HEADERS, Referer: `${ML_SITE}/${slug}` },
      next: { revalidate: 0 },
    })

    if (!res.ok) {
      log('ml-proxy error', { status: res.status, q })
      return NextResponse.json({ error: `ML site ${res.status}` }, { status: 502, headers: rlHeaders })
    }

    const html = await res.text()
    const listings = parseListings(html, q)

    return NextResponse.json({ listings }, { headers: rlHeaders })
  } catch (err) {
    log('ml-proxy error', { error: String(err), q })
    return NextResponse.json({ error: 'Erro de conexão com o Mercado Livre.' }, { status: 503, headers: rlHeaders })
  }
}
