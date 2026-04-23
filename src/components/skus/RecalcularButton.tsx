'use client'

import { useRouter } from 'next/navigation'
import type { ViabilityInput } from '@/types'
import { GenieButton } from '@/components/ui/genie-button'

const FORM_SESSION_KEY = 'smartpreco_calc_form'

interface Props {
  costData: ViabilityInput
}

export default function RecalcularButton({ costData }: Props) {
  const router = useRouter()

  function handleClick() {
    try {
      sessionStorage.setItem(FORM_SESSION_KEY, JSON.stringify(costData))
    } catch {}
    router.push('/calculadora')
  }

  return (
    <GenieButton variant="primary" size="md" onClick={handleClick}>
      🔄 Recalcular
    </GenieButton>
  )
}
