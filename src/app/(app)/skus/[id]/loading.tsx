export default function Loading() {
  return (
    <div className="space-y-6 max-w-3xl animate-pulse">
      <div className="h-4 w-24 rounded bg-paper-200" />
      <div className="rounded-[24px] border border-paper-200 bg-white p-5 space-y-3">
        <div className="h-6 w-48 rounded bg-paper-100" />
        <div className="h-4 w-32 rounded bg-paper-100" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="rounded-[16px] border border-paper-200 bg-white p-4 h-16" />
        ))}
      </div>
    </div>
  )
}
