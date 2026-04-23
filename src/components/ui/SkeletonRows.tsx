export function SkeletonRows({
  rows = 5,
  compact = false,
}: {
  rows?: number
  compact?: boolean
}) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className={`skeleton-shimmer rounded-2xl ${compact ? 'h-10' : 'h-12'}`}
        />
      ))}
    </div>
  )
}
