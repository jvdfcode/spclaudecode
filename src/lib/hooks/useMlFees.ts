'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ML_FEES, ML_INSTALLMENT_FEES } from '@/lib/mercadolivre.config'
import type { ListingType, MlFeesMap } from '@/types'

const FALLBACK: MlFeesMap = {
  base: { ...ML_FEES },
  installment: {
    free:    { 1: 0 },
    classic: { ...(ML_INSTALLMENT_FEES.classic as Record<number, number>) },
    premium: { ...(ML_INSTALLMENT_FEES.premium as Record<number, number>) },
  },
}

export function useMlFees(): { fees: MlFeesMap; loading: boolean } {
  const [fees, setFees] = useState<MlFeesMap>(FALLBACK)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const supabase = createClient()

    supabase
      .from('ml_fees')
      .select('listing_type, installments, fee_percent')
      .is('category_id', null)
      .then(({ data, error }) => {
        if (cancelled || error || !data?.length) {
          setLoading(false)
          return
        }

        const base: Partial<Record<ListingType, number>> = {}
        const installment: Partial<Record<ListingType, Record<number, number>>> = {}

        for (const row of data) {
          const type = row.listing_type as ListingType
          const pct = Number(row.fee_percent)

          if (row.installments === 1) {
            base[type] = pct
          } else {
            if (!installment[type]) installment[type] = {}
            installment[type]![row.installments] = pct
          }
        }

        // Preenche com fallback para tipos ausentes no banco
        const merged: MlFeesMap = {
          base: {
            free:    base.free    ?? FALLBACK.base.free,
            classic: base.classic ?? FALLBACK.base.classic,
            premium: base.premium ?? FALLBACK.base.premium,
          },
          installment: {
            free:    { 1: 0, ...installment.free },
            classic: { 1: 0, ...FALLBACK.installment.classic, ...installment.classic },
            premium: { 1: 0, ...FALLBACK.installment.premium, ...installment.premium },
          },
        }

        setFees(merged)
        setLoading(false)
      })

    return () => { cancelled = true }
  }, [])

  return { fees, loading }
}
