import type { Metadata } from 'next'
import {
  Bricolage_Grotesque,
  Instrument_Serif,
  JetBrains_Mono,
} from 'next/font/google'
import { Toaster } from 'sonner'
import SkipLink from '@/components/layout/SkipLink'
import './globals.css'

// Halo DS v1.1 — tipografia (§4.1)
// `--font-display` e `--font-body` apontam para Bricolage Grotesque com
// pesos e features distintos (§4.1.1). Crítico (display: swap).
const bricolageDisplay = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-display',
  display: 'swap',
})
const bricolageBody = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
})
// Instrument Serif: editorial em hero. NÃO bloqueia LCP (display: optional).
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'optional',
})
// JetBrains Mono: dados, KPIs, labels mono.
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'SmartPreço — Precificação inteligente para vendedores ML',
    template: '%s | SmartPreço',
  },
  description: 'Calcule custos reais, simule cenários e compare com o mercado para tomar a melhor decisão de preço no Mercado Livre.',
  openGraph: {
    title: 'SmartPreço — Precificação inteligente para vendedores ML',
    description: 'Calcule custos reais, simule cenários e compare com o mercado para tomar a melhor decisão de preço no Mercado Livre.',
    type: 'website',
    locale: 'pt_BR',
    url: process.env.NEXT_PUBLIC_APP_URL,
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="pt-BR"
      className={`${bricolageDisplay.variable} ${bricolageBody.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <SkipLink />
        {children}
        <Toaster richColors position="top-right" duration={3000} />
      </body>
    </html>
  )
}
