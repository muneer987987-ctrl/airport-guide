import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { siteUrl, siteName } from "@/lib/utils";
import { jsonLdScriptProps, breadcrumbSchema } from "@/lib/seo";
import type { Metadata } from "next";

export const revalidate = 3600;

async function getPost(slug: string) {
  return db.blogPost.findUnique({ where: { slug } });
}

export async function generateStaticParams() {
  const posts = await db.blogPost.findMany({ where: { published: true }, select: { slug: true } });
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  const title = post.metaTitle ?? `${post.title} | ${siteName}`;
  const description = post.metaDescription ?? post.excerpt;
  const url = `${siteUrl}/blog/${post.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName, type: "article" },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post || !post.published) notFound();

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Guides", path: "/blog" },
    { name: post.title, path: `/blog/${post.slug}` },
  ];

  const blocks = post.content.split("\n\n").filter(Boolean);

  return (
    <>
      <script {...jsonLdScriptProps([breadcrumbSchema(breadcrumbItems)])} />
      <Breadcrumbs items={breadcrumbItems} />
      <article className="container-guide max-w-2xl py-14">
        <p className="eyebrow mb-2">
          {new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(post.publishedAt)}
        </p>
        <h1 className="mb-6 font-display text-3xl font-700">{post.title}</h1>
        <div className="space-y-4 text-ink-700 dark:text-ink-200">
          {blocks.map((block, i) => {
            if (block.startsWith("## ")) {
              return (
                <h2 key={i} className="pt-4 font-display text-xl font-600 text-ink-900 dark:text-white">
                  {block.replace("## ", "")}
                </h2>
              );
            }
            return <p key={i}>{block}</p>;
          })}
        </div>
      </article>
    </>
  );
}
