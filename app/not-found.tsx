import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-guide flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="eyebrow mb-3">Gate not found</p>
      <h1 className="mb-4 font-display text-3xl font-700">This page has already departed.</h1>
      <p className="mb-6 max-w-md text-ink-500">
        We couldn&apos;t find that airport or page. Try searching by name, city, or IATA code.
      </p>
      <Link href="/search" className="border border-beacon px-5 py-2.5 text-sm text-beacon">
        Search airports
      </Link>
    </div>
  );
}
