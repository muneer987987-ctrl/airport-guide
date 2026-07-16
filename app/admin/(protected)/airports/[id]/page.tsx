import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { updateAirportCore, createFaq, deleteFaq } from "@/app/admin/actions";

export default async function EditAirportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const airport = await db.airport.findUnique({
    where: { id },
    include: { faqs: { orderBy: { sortOrder: "asc" } } },
  });
  if (!airport) notFound();

  async function saveCore(formData: FormData) {
    "use server";
    await updateAirportCore(id, formData);
  }
  async function addFaq(formData: FormData) {
    "use server";
    await createFaq(id, formData);
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-1 font-display text-2xl font-600">{airport.name}</h1>
      <p className="mb-6 font-mono text-sm text-ink-400">{airport.iata} / {airport.icao}</p>

      <form action={saveCore} className="card space-y-4 p-5">
        <p className="eyebrow">Core content</p>
        <Field label="Name" name="name" defaultValue={airport.name} />
        <TextArea label="Overview" name="overview" defaultValue={airport.overview} rows={5} />
        <Field label="Website URL" name="websiteUrl" defaultValue={airport.websiteUrl ?? ""} />
        <Field label="Hero image URL" name="heroImageUrl" defaultValue={airport.heroImageUrl ?? ""} />
{airport.heroImageUrl && (
  // eslint-disable-next-line @next/next/no-img-element
  <img src={airport.heroImageUrl} alt="" className="h-32 w-full rounded object-cover" />
)}
        <p className="eyebrow pt-2">SEO</p>
        <Field label="Meta title" name="metaTitle" defaultValue={airport.metaTitle ?? ""} />
        <TextArea label="Meta description" name="metaDescription" defaultValue={airport.metaDescription ?? ""} rows={2} />
        <button type="submit" className="bg-signal px-4 py-2 text-sm font-medium text-ink-950">
          Save changes
        </button>
      </form>

      <div className="card mt-6 p-5">
        <p className="eyebrow mb-3">FAQs</p>
        <ul className="mb-4 space-y-2">
          {airport.faqs.map((faq) => (
            <li key={faq.id} className="flex items-start justify-between gap-3 border-b border-ink-100 pb-2 text-sm dark:border-ink-800">
              <div>
                <p className="font-medium">{faq.question}</p>
                <p className="text-ink-500">{faq.answer}</p>
              </div>
              <form action={async () => { "use server"; await deleteFaq(faq.id, id); }}>
                <button className="shrink-0 text-xs text-stop">Remove</button>
              </form>
            </li>
          ))}
        </ul>
        <form action={addFaq} className="space-y-2">
          <Field label="Question" name="question" />
          <TextArea label="Answer" name="answer" rows={2} />
          <button type="submit" className="border border-beacon px-3 py-1.5 text-xs text-beacon">
            Add FAQ
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, name, defaultValue }: { label: string; name: string; defaultValue?: string }) {
  return (
    <label className="block text-sm">
      {label}
      <input
        name={name}
        defaultValue={defaultValue}
        className="mt-1 w-full border border-ink-300 bg-transparent px-3 py-2 text-sm dark:border-ink-700"
      />
    </label>
  );
}

function TextArea({
  label,
  name,
  defaultValue,
  rows,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  rows: number;
}) {
  return (
    <label className="block text-sm">
      {label}
      <textarea
        name={name}
        defaultValue={defaultValue}
        rows={rows}
        className="mt-1 w-full border border-ink-300 bg-transparent px-3 py-2 text-sm dark:border-ink-700"
      />
    </label>
  );
}
