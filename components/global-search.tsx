"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function GlobalSearch({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    startTransition(() => {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      role="search"
      className={cn(
        "flex items-center gap-2 rounded-none border border-ink-300 bg-white px-3 dark:border-ink-700 dark:bg-ink-900",
        compact ? "h-10 w-40 sm:w-64" : "h-14 w-full max-w-xl"
      )}
    >
      <Search className="h-4 w-4 shrink-0 text-ink-400" aria-hidden />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search airport, city, or IATA code…"
        aria-label="Search airports"
        className="w-full bg-transparent text-sm text-ink-900 outline-none placeholder:text-ink-400 dark:text-white"
      />
      <button
        type="submit"
        disabled={isPending}
        className="shrink-0 font-mono text-xs uppercase tracking-wide text-signal disabled:opacity-50 px-3 py-1 border border-signal hover:bg-signal hover:text-white transition"
      >
        Go
      </button>
    </form>
  );
}
