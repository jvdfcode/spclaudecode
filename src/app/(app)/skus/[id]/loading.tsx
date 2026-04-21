export default function Loading() {
  return (
    <div className="space-y-6 max-w-3xl animate-pulse">
      <div className="h-4 w-24 rounded bg-gray-100" />
      <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-3">
        <div className="h-6 w-48 rounded bg-gray-100" />
        <div className="h-4 w-32 rounded bg-gray-100" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="rounded-xl border border-gray-100 bg-white p-4 h-16" />
        ))}
      </div>
    </div>
  )
}
