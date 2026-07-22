export default function Loading() {
  return (
    <div className="container-guide py-20">
      <div className="animate-pulse space-y-6">
        {/* Title skeleton */}
        <div className="h-8 w-1/3 bg-ink-200 dark:bg-ink-700 rounded" />
        
        {/* Subtitle skeleton */}
        <div className="h-4 w-1/2 bg-ink-200 dark:bg-ink-700 rounded" />
        
        {/* Hero image skeleton */}
        <div className="h-64 w-full bg-ink-200 dark:bg-ink-700 rounded" />
        
        {/* Content cards skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="h-32 bg-ink-200 dark:bg-ink-700 rounded" />
          <div className="h-32 bg-ink-200 dark:bg-ink-700 rounded" />
        </div>
        
        {/* Sidebar skeleton */}
        <div className="h-48 w-full bg-ink-200 dark:bg-ink-700 rounded" />
      </div>
    </div>
  )
}