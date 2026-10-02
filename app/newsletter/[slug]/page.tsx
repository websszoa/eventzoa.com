import type { Metadata } from "next";
import { notFound } from "next/navigation";

import PageNotificationArticle from "@/components/page/page-notification-article";
import NotificationToc from "@/components/page/page-notification-toc";
import { APP_NAME, APP_SITE_URL } from "@/lib/constants";
import { extractMdxHeadings } from "@/lib/mdx";
import { getNotificationPosts } from "@/lib/notifications";
import { createPageMetadata } from "@/lib/seo";

type NewsletterArticleProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getNotificationPosts()).filter((post) => post.category === "newsletter").map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: NewsletterArticleProps): Promise<Metadata> {
  const { slug } = await params;
  const post = (await getNotificationPosts()).find((item) => item.category === "newsletter" && item.slug === slug);
  if (!post) return {};
  return createPageMetadata({ title: post.title, description: post.excerpt, path: `/newsletter/${post.slug}`, type: "article", image: post.image, publishedTime: `${post.publishedAt}T00:00:00+09:00`, keywords: post.keywords });
}

export default async function NewsletterArticlePage({ params }: NewsletterArticleProps) {
  const { slug } = await params;
  const post = (await getNotificationPosts()).find((item) => item.category === "newsletter" && item.slug === slug);
  if (!post) notFound();
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    inLanguage: "ko-KR",
    mainEntityOfPage: `${APP_SITE_URL}/newsletter/${post.slug}`,
    author: { "@type": "Organization", name: APP_NAME },
    publisher: { "@type": "Organization", name: APP_NAME },
  };

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="container grid items-start gap-8 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-12">
        <NotificationToc category="newsletter" headings={extractMdxHeadings(post.source)} backHref="/newsletter" />
        <main className="min-w-0 overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200"><PageNotificationArticle post={post} backHref="/newsletter" /></main>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c") }} />
    </section>
  );
}
