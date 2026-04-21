import LogoutButton from '@/components/auth/LogoutButton'

interface TopBarProps {
  userEmail: string | undefined
}

export default function TopBar({ userEmail }: TopBarProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div />
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">{userEmail}</span>
        <LogoutButton />
      </div>
    </header>
  )
}
