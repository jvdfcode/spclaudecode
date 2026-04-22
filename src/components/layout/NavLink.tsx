'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface NavLinkProps {
  href: string
  icon: React.ReactNode
  label: string
}

export default function NavLink({ href, icon, label }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))

  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(
        'flex items-center justify-center md:justify-start gap-3 rounded-lg px-2 md:px-3 py-2 text-sm font-medium transition-colors',
        isActive
          ? 'bg-primary text-white'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      )}
    >
      <span className="h-5 w-5 shrink-0">{icon}</span>
      <span className="hidden md:inline">{label}</span>
    </Link>
  )
}
