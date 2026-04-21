export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="h-28 animate-pulse rounded-xl bg-gray-200" />
        <div className="h-28 animate-pulse rounded-xl bg-gray-200" />
      </div>
    </div>
  )
}
