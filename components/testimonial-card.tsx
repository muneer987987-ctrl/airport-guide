import { Star } from "lucide-react";

export function TestimonialCard({ name, role, text, rating }: { 
  name: string; 
  role: string; 
  text: string; 
  rating: number 
}) {
  return (
    <div className="card p-6 hover:shadow-lg transition">
      <div className="flex gap-1 mb-4">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-signal text-signal" />
        ))}
      </div>
      <p className="text-ink-700 dark:text-ink-200 mb-4 italic">&ldquo;{text}&rdquo;</p>
      <div>
        <p className="font-bold text-ink-900 dark:text-white">{name}</p>
        <p className="text-sm text-ink-500">{role}</p>
      </div>
    </div>
  );
}