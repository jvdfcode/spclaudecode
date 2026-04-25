'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const ONBOARDED_KEY = 'smartpreco_onboarded'

const steps = [
  {
    step: 1,
    icon: '🧮',
    title: 'Calculadora de Custos',
    description: 'Informe o custo do produto, taxas ML e preço de venda para ver margem e viabilidade em tempo real.',
    href: '/calculadora',
  },
  {
    step: 2,
    icon: '📊',
    title: 'Simulador de Cenários',
    description: 'Veja como sua margem muda em ±35% de variação de preço — encontre a faixa ideal de precificação.',
    href: '/calculadora',
  },
  {
    step: 3,
    icon: '🏪',
    title: 'Bloco Mercado',
    description: 'Busque produtos similares no Mercado Livre e compare seu preço com a concorrência real.',
    href: '/mercado',
  },
  {
    step: 4,
    icon: '🎯',
    title: 'Decisão de Preço',
    description: 'Com base nos seus custos e no mercado, escolha entre Econômico, Competitivo ou Premium.',
    href: '/calculadora',
  },
]

export default function WelcomeTour() {
  const [show, setShow] = useState(false)
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    try {
      if (!localStorage.getItem(ONBOARDED_KEY)) setShow(true)
    } catch {}
  }, [])

  function dismiss() {
    try { localStorage.setItem(ONBOARDED_KEY, 'true') } catch {}
    setShow(false)
  }

  if (!show) return null

  const step = steps[activeStep]
  const isLast = activeStep === steps.length - 1

  return (
    <section
      className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 space-y-4"
      aria-label="Tour de onboarding do SmartPreço"
    >
      {/* Cabeçalho */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-blue-600 uppercase tracking-wide">
            Bem-vindo ao SmartPreço!
          </p>
          <p className="text-sm text-blue-700 mt-0.5">
            Em 4 passos, você estará precificando como um profissional.
          </p>
        </div>
        <button
          onClick={dismiss}
          aria-label="Pular tour"
          className="text-blue-400 hover:text-blue-600 transition-colors text-xs flex-shrink-0"
        >
          Pular ✕
        </button>
      </div>

      {/* Indicadores de progresso */}
      <div className="flex gap-1.5" aria-label="Progresso do tour">
        {steps.map((s, i) => (
          <button
            key={s.step}
            onClick={() => setActiveStep(i)}
            aria-label={`Passo ${s.step}: ${s.title}`}
            aria-current={i === activeStep ? 'step' : undefined}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-all',
              i <= activeStep ? 'bg-blue-500' : 'bg-blue-200'
            )}
          />
        ))}
      </div>

      {/* Conteúdo do passo */}
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0" aria-hidden="true">{step.icon}</span>
        <div>
          <p className="text-sm font-bold text-blue-800">
            {activeStep + 1}. {step.title}
          </p>
          <p className="text-xs text-blue-600 mt-0.5 leading-snug">{step.description}</p>
        </div>
      </div>

      {/* Navegação */}
      <div className="flex items-center gap-2">
        {activeStep > 0 && (
          <button
            onClick={() => setActiveStep(a => a - 1)}
            className="px-3 py-1.5 rounded-lg border border-blue-300 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors"
          >
            ← Anterior
          </button>
        )}
        {!isLast ? (
          <button
            onClick={() => setActiveStep(a => a + 1)}
            className="ml-auto px-3 py-1.5 rounded-lg bg-blue-600 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            Próximo →
          </button>
        ) : (
          <Link
            href={step.href}
            onClick={dismiss}
            className="ml-auto px-3 py-1.5 rounded-lg bg-blue-600 text-center text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            Começar agora 🚀
          </Link>
        )}
      </div>
    </section>
  )
}
