import Link from "next/link";
import { db } from "@/lib/db";
import { siteUrl, siteName } from "@/lib/utils";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Travel Guides & Tips",
  description: "Practical airport and travel guides — layovers, transfers, and tips for smoother trips.",
  alternates: { canonical: `${siteUrl}/blog` },
};

export default async function BlogIndexPage() {
  const posts = await db.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="container-guide py-14">
      <p className="eyebrow mb-2">{siteName} Guides</p>
      <h1 className="mb-8 font-display text-3xl font-700">Travel Guides & Tips</h1>

      {posts.length === 0 ? (
        <p className="text-ink-500">No articles published yet — check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="card flex flex-col p-5 hover:shadow-lg">
              <p className="mb-2 font-mono text-xs text-ink-400">
                {new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(post.publishedAt)}
              </p>
              <h2 className="mb-2 font-display text-lg font-600 leading-snug">{post.title}</h2>
              <p className="text-sm text-ink-500">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}