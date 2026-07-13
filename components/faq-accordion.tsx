export function FaqAccordion({ faqs }: { faqs: { id: string; question: string; answer: string }[] }) {
  if (faqs.length === 0) return null;
  return (
    <div className="divide-y divide-ink-200 border border-ink-200 dark:divide-ink-800 dark:border-ink-800">
      {faqs.map((faq) => (
        <details key={faq.id} className="group">
          <summary className="cursor-pointer list-none px-5 py-4 font-medium">
            {faq.question}
          </summary>
          <p className="px-5 pb-4 text-sm text-ink-600 dark:text-ink-300">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
