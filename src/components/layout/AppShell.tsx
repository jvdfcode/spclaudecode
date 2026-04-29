'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import MobileDrawer from './MobileDrawer'

interface AppShellProps {
  children: React.ReactNode
  userEmail: string | undefined
}

export default function AppShell({ children, userEmail }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div
      data-app-shell
      className="flex h-screen overflow-hidden"
      style={{ background: 'var(--background)' }}
    >
      <Sidebar />
      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar userEmail={userEmail} onMenuClick={() => setMobileOpen(true)} />
        <main id="main-content" tabIndex={-1} className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
