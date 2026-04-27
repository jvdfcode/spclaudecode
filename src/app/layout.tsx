import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const manrope = Manrope({ subsets: ['latin'], variable: '--font-sans', weight: ['400', '500', '600', '700', '800'] })

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
      <body className={manrope.variable}>
        {children}
        <Toaster richColors position="top-right" duration={3000} />
      </body>
    </html>
  )
}
