'use client'

import Link from 'next/link'

interface UpgradeGateProps {
  /** Feature bloqueada (ex: "SKUs ilimitados", "Análise de mercado ilimitada"). */
  feature: string
  /** Texto curto explicando o que destrava. */
  hint?: string
}

/**
 * Card mostrado em Pro features quando trial expirou + usuário não converteu.
 * Story VIAB-R3-1 — fallback gracioso (não-bloqueante absoluto). Usuário continua
 * podendo usar Free 1 SKU; este card aparece apenas no contexto da feature paga.
 */
export default function UpgradeGate({ feature, hint }: UpgradeGateProps) {
  return (
    <div className="rounded-2xl border border-halo-orange-30 bg-halo-orange-05 p-6 text-center">
      <p className="text-xs uppercase tracking-[0.18em] text-halo-orange-90 font-extrabold mb-2">
        Trial expirado
      </p>
      <p className="text-base font-extrabold text-halo-navy mb-2">
        {feature} é uma feature Pro
      </p>
      {hint && (
        <p className="text-sm text-halo-navy-60 mb-4 max-w-md mx-auto leading-relaxed">
          {hint}
        </p>
      )}
      <Link
        href="/precos?from=upgrade_gate"
        className="inline-flex items-center justify-center rounded-xl bg-halo-navy px-5 py-2.5 text-sm font-extrabold text-halo-orange shadow-[0_4px_14px_rgba(45,50,119,0.28)] hover:-translate-y-[2px] transition-transform"
      >
        Continuar como Pro — R$ 49/mês
      </Link>
      <p className="mt-3 text-xs text-halo-navy-40">
        Sem fidelidade · Cancele quando quiser
      </p>
    </div>
  )
}
