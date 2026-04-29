'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const tabs = [
  {
    href: '/calculadora',
    label: 'Análise de Custo',
    icon: '🧮',
    desc: 'Calcule margem e viabilidade',
  },
  {
    href: '/mercado',
    label: 'Mercado',
    icon: '🏪',
    desc: 'Compare com anúncios reais',
  },
  {
    href: '/skus',
    label: 'Meus SKUs',
    icon: '📦',
    desc: 'Portfólio de produtos',
  },
]

export function WorkspaceNav() {
  const pathname = usePathname()

  return (
    <nav
      className="flex items-end gap-1 border-b border-halo-gray px-1 mb-6"
      aria-label="Navegação do workspace"
    >
      {tabs.map(({ href, label, icon }) => {
        const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'relative flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-all duration-200 rounded-t-[12px] -mb-px border border-b-0',
              isActive
                ? 'bg-white border-halo-gray text-halo-navy shadow-[0_-4px_12px_rgba(45,50,119,0.06)]'
                : 'border-transparent text-halo-navy-60 hover:text-halo-navy hover:bg-halo-gray-15',
            )}
          >
            {isActive && (
              <span className="absolute inset-x-0 top-0 h-0.5 rounded-t-[12px] bg-[linear-gradient(90deg,var(--halo-orange)_0%,var(--halo-navy)_100%)]" />
            )}
            <span className="text-base">{icon}</span>
            <span className="text-xs sm:text-sm">{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
