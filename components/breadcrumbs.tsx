import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="border-b border-ink-100 dark:border-ink-800">
      <ol className="container-guide flex items-center gap-1.5 py-3 text-xs text-ink-500 dark:text-ink-400">
        {items.map((item, i) => (
          <li key={item.path} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3 w-3" aria-hidden />}
            {i === items.length - 1 ? (
              <span className="text-ink-800 dark:text-ink-100">{item.name}</span>
            ) : (
              <Link href={item.path} className="hover:text-signal-dim dark:hover:text-signal">
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
