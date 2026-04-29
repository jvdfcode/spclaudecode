interface PageHeaderProps {
  eyebrow?: string
  title: string
  tagline?: string
  description?: string
  aside?: React.ReactNode
}

export function PageHeader({ eyebrow, title, tagline, description, aside }: PageHeaderProps) {
  return (
    <header className="relative overflow-hidden rounded-[28px] border border-halo-gray bg-white p-6 shadow-[0_16px_40px_rgba(45,50,119,0.08)] sm:p-8">
      {/* Radial glow dourado à direita */}
      <div className="absolute inset-y-0 right-0 w-[40%] bg-[radial-gradient(circle_at_center,rgba(255,230,0,0.15),transparent_62%)]" />
      {/* Barra gradiente no topo */}
      <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--halo-orange)_0%,var(--halo-navy)_100%)]" />

      {eyebrow && (
        <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-halo-navy-60">
          {eyebrow}
        </p>
      )}

      <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-extrabold tracking-[-0.03em] leading-[0.98] text-halo-navy sm:text-[2.5rem]">
            {title}
          </h1>
          {tagline && (
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-halo-navy-60">
              {tagline}
            </p>
          )}
          {description && (
            <p className="mt-4 max-w-2xl text-sm leading-7 text-halo-navy-60 sm:text-[0.95rem]">
              {description}
            </p>
          )}
        </div>
        {aside && (
          <div className="shrink-0 rounded-[20px] border border-halo-gray bg-halo-gray-15 px-4 py-3 text-sm font-medium text-halo-black">
            {aside}
          </div>
        )}
      </div>
    </header>
  )
}
