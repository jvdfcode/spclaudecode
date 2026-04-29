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
        'group flex items-center justify-center md:justify-start gap-3 rounded-[12px] px-2 md:px-3 py-2.5 text-sm font-semibold transition-all duration-200',
        isActive
          ? 'bg-halo-navy text-white shadow-[0_4px_12px_rgba(45,50,119,0.22)]'
          : 'text-halo-navy-60 hover:bg-halo-gray-15 hover:text-halo-navy',
      )}
    >
      <span className={cn(
        'h-5 w-5 shrink-0 transition-colors',
        isActive ? 'text-halo-orange' : 'text-halo-navy-60 group-hover:text-halo-navy',
      )}>
        {icon}
      </span>
      <span className="hidden md:inline">{label}</span>
    </Link>
  )
}
