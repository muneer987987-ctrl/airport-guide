import Image from "next/image";
import Link from "next/link";
import { Calendar } from "lucide-react";

export function BlogCard({ title, excerpt, date, image }: {
  title: string;
  excerpt: string;
  date: string;
  image: string;
}) {
  return (
    <Link href="/blog" className="group block">
      <div className="card overflow-hidden hover:shadow-lg transition h-full">
        <div className="relative h-48 bg-ink-200 dark:bg-ink-700">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2 text-sm text-ink-500 mb-2">
            <Calendar className="w-4 h-4" />
            {date}
          </div>
          <h3 className="font-display font-bold text-lg mb-2 group-hover:text-signal transition">
            {title}
          </h3>
          <p className="text-sm text-ink-500">{excerpt}</p>
        </div>
      </div>
    </Link>
  );
}