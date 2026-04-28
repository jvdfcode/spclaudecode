import { CircleAlert, CircleCheckBig, CircleX } from 'lucide-react'
import { StatusPill } from '@/components/ui/StatusPill'
import type { ViabilityClassification } from '@/types'

/**
 * ProfitabilityBadge — Halo DS v1.1 §12.5.
 *
 * Comunica viabilidade usando **três sinais simultâneos**: cor, ícone e
 * texto. A doutrina Halo (5 âncoras) não tem verde/vermelho — diferenciamos
 * viable/attention/not_viable com Solar suave / Solar pleno / Eclipse,
 * sempre acompanhados de ícone Lucide e label explícito.
 *
 * Daltonismo: legível mesmo sem distinção de cor — o ícone e o texto
 * carregam a informação completa.
 */
const config: Record<ViabilityClassification, {
  tone: 'success' | 'warn' | 'danger'
  label: string
  icon: React.ReactNode
  ariaLabel: string
}> = {
  viable: {
    tone:  'success',
    label: 'Viável',
    icon:  <CircleCheckBig size={14} strokeWidth={2.2} aria-hidden="true" />,
    ariaLabel: 'Produto viável: margem dentro do esperado',
  },
  attention: {
    tone:  'warn',
    label: 'Atenção',
    icon:  <CircleAlert size={14} strokeWidth={2.2} aria-hidden="true" />,
    ariaLabel: 'Atenção: margem apertada, revisar antes de adotar',
  },
  not_viable: {
    tone:  'danger',
    label: 'Não Viável',
    icon:  <CircleX size={14} strokeWidth={2.2} aria-hidden="true" />,
    ariaLabel: 'Inviável: margem negativa ou abaixo do mínimo',
  },
}

export function ProfitabilityBadge({ classification }: { classification: ViabilityClassification }) {
  const { tone, label, icon, ariaLabel } = config[classification]
  return (
    <span role="status" aria-label={ariaLabel}>
      <StatusPill label={label} tone={tone} icon={icon} />
    </span>
  )
}
