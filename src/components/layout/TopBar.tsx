import LogoutButton from '@/components/auth/LogoutButton'

interface TopBarProps {
  userEmail: string | undefined
}

export default function TopBar({ userEmail }: TopBarProps) {
  const initials = userEmail ? userEmail[0].toUpperCase() : '?'

  return (
    <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div />
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
            {initials}
          </div>
          <span className="hidden sm:block text-sm text-gray-600 max-w-[180px] truncate">{userEmail}</span>
        </div>
        <div className="h-5 w-px bg-gray-200" />
        <LogoutButton />
      </div>
    </header>
  )
}
