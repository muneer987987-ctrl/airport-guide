'use client'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="container-guide py-20 text-center">
      <h2 className="font-display text-2xl font-bold text-ink-900 dark:text-white">
        Something went wrong
      </h2>
      <p className="mt-2 text-ink-500">
        We couldn't load this airport guide. Please try again.
      </p>
      <button 
        onClick={reset} 
        className="mt-6 px-6 py-2 bg-signal text-white rounded-lg hover:bg-signal-dim transition"
      >
        Try again
      </button>
    </div>
  )
}