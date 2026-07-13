type TerminalWithAirlines = {
  id: string;
  code: string;
  description: string | null;
  checkInInfo: string | null;
  immigrationInfo: string | null;
  securityInfo: string | null;
  airlines: { airline: { name: string; iataCode: string | null } }[];
};

export function TerminalGuide({ terminals }: { terminals: TerminalWithAirlines[] }) {
  if (terminals.length === 0) {
    return (
      <p className="text-sm text-ink-500">
        Terminal-by-terminal detail for this airport hasn't been published yet.
      </p>
    );
  }

  return (
    <div className="divide-y divide-ink-200 border border-ink-200 dark:divide-ink-800 dark:border-ink-800">
      {terminals.map((t) => (
        <details key={t.id} className="group open:bg-ink-50 dark:open:bg-ink-900">
          <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4">
            <span className="font-display text-base font-600">{t.code}</span>
            <span className="font-mono text-xs text-ink-400 group-open:hidden">Show detail</span>
            <span className="hidden font-mono text-xs text-ink-400 group-open:inline">Hide</span>
          </summary>
          <div className="space-y-3 px-5 pb-5 text-sm text-ink-600 dark:text-ink-300">
            {t.description && <p>{t.description}</p>}
            {t.airlines.length > 0 && (
              <p>
                <span className="font-medium text-ink-800 dark:text-ink-100">Airlines: </span>
                {t.airlines.map((a) => a.airline.name).join(", ")}
              </p>
            )}
            {t.checkInInfo && <p><span className="font-medium">Check-in: </span>{t.checkInInfo}</p>}
            {t.immigrationInfo && <p><span className="font-medium">Immigration: </span>{t.immigrationInfo}</p>}
            {t.securityInfo && <p><span className="font-medium">Security: </span>{t.securityInfo}</p>}
          </div>
        </details>
      ))}
    </div>
  );
}
