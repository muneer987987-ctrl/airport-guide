export function GuideSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 border-t border-ink-100 py-10 dark:border-ink-800">
      <h2 className="mb-5 font-display text-xl font-600">{title}</h2>
      {children}
    </section>
  );
}
