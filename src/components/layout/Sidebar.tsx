import NavLink from './NavLink'

const navItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    href: '/calculadora',
    label: 'Nova Análise',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.652 4.5 4.756V19.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V4.756c0-1.104-.807-2.057-1.907-2.184A48.507 48.507 0 0 0 12 2.25Z" />
      </svg>
    ),
  },
  {
    href: '/skus',
    label: 'Meus SKUs',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
      </svg>
    ),
  },
  {
    href: '/mercado',
    label: 'Mercado',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
      </svg>
    ),
  },
]

export default function Sidebar() {
  return (
    <aside className="relative hidden md:flex h-full w-56 flex-col border-r border-halo-gray bg-white px-3 py-5 flex-shrink-0 shadow-[1px_0_0_0_rgba(45,50,119,0.04)]">
      {/* Barra dourada no topo */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-[linear-gradient(90deg,var(--halo-orange)_0%,var(--halo-navy)_100%)]" />

      {/* Logo desktop */}
      <div className="mb-7 px-1 hidden md:flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-halo-navy text-halo-orange text-sm flex-shrink-0 shadow-[0_4px_12px_rgba(45,50,119,0.18)]">
          💰
        </div>
        <span className="text-sm font-extrabold tracking-[-0.02em] text-halo-navy">SmartPreço</span>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5" aria-label="Navegação principal">
        {navItems.map((item) => (
          <NavLink key={item.href} {...item} />
        ))}
      </nav>

      <div className="hidden md:block pt-4 border-t border-halo-gray">
        <p className="text-[10px] text-halo-navy-40 text-center font-medium">SmartPreço</p>
      </div>
    </aside>
  )
}
