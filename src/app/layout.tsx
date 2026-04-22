import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

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
    <html lang="pt-BR">
      <body className={inter.variable}>{children}</body>
    </html>
  )
}
