import LogoutButton from '@/components/auth/LogoutButton'

interface TopBarProps {
  userEmail: string | undefined
}

export default function TopBar({ userEmail }: TopBarProps) {
  const initials = userEmail ? userEmail[0].toUpperCase() : '?'

  return (
    <header className="relative flex h-14 items-center justify-between border-b border-paper-200 bg-white px-6 shadow-[0_1px_0_0_rgba(45,50,119,0.04)]">
      <div />
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-950 text-gold-400 text-sm font-extrabold shadow-[0_4px_10px_rgba(45,50,119,0.18)]">
            {initials}
          </div>
          <span className="hidden sm:block text-sm text-ink-700 font-medium max-w-[180px] truncate">{userEmail}</span>
        </div>
        <div className="h-5 w-px bg-paper-200" />
        <LogoutButton />
      </div>
    </header>
  )
}
