import { CircleAlert, CircleCheckBig, CircleX } from 'lucide-react'
import { StatusPill } from '@/components/ui/StatusPill'
import type { ViabilityClassification } from '@/types'

const config: Record<ViabilityClassification, {
  tone: 'success' | 'warn' | 'danger'
  label: string
  icon: React.ReactNode
}> = {
  viable: {
    tone:  'success',
    label: 'Viável',
    icon:  <CircleCheckBig size={14} strokeWidth={2.2} />,
  },
  attention: {
    tone:  'warn',
    label: 'Atenção',
    icon:  <CircleAlert size={14} strokeWidth={2.2} />,
  },
  not_viable: {
    tone:  'danger',
    label: 'Não Viável',
    icon:  <CircleX size={14} strokeWidth={2.2} />,
  },
}

export function ProfitabilityBadge({ classification }: { classification: ViabilityClassification }) {
  const { tone, label, icon } = config[classification]
  return <StatusPill label={label} tone={tone} icon={icon} />
}
