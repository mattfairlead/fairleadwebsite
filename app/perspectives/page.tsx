import type { Metadata } from "next";
import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import SectionReveal from "@/components/SectionReveal";
import SectionHead from "@/components/SectionHead";
import NewsletterForm from "@/components/NewsletterForm";
import { getPerspectives, getTeam } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Perspectives",
  "The firm's point of view — written from inside engagements, one per quarter. Plus the transaction record.",
  "/perspectives"
);

function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    timeZone: "UTC",
  });
}

/**
 * /perspectives — §4.6. Firm view first; the historical press reposts live
 * below as a compact dated "Transactions" timeline (deal history without
 * pretending it's editorial).
 */
export default async function PerspectivesPage() {
  const [posts, transactions, team] = await Promise.all([
    getPerspectives("perspective"),
    getPerspectives("transaction"),
    getTeam(),
  ]);

  return (
    <>
      <PageIntro
        eyebrow="Perspectives"
        title={<>The firm&rsquo;s point of view.</>}
        lead={<>Written from inside engagements. One per quarter — worth the wait.</>}
      />

      <SectionReveal className="container-page pb-10">
        <div className="relative">
          {posts.map((post) => {
            const author = team.find((m) => m.slug === post.author_slug);
            return (
              <div key={post.slug} data-anim="slide-in" className="relative">
                <span className="dec left-0 top-0 h-px w-full" />
                <Link
                  href={`/perspectives/${post.slug}`}
                  className="grid items-baseline gap-3 px-1 py-8 transition-colors duration-200 hover:bg-blue-900/40 md:grid-cols-[12rem_1fr] md:gap-10 md:px-4"
                >
                  <span className="body-sm text-white-40 tabular">{formatDate(post.published_at)}</span>
                  <span className="flex flex-col gap-2">
                    <span className="h4">{post.title}</span>
                    <span className="body-md max-w-2xl text-white-60">{post.excerpt}</span>
                    {author && <span className="body-sm text-white-40">{author.name}</span>}
                  </span>
                </Link>
              </div>
            );
          })}
          <span className="dec bottom-0 left-0 h-px w-full" />
        </div>
      </SectionReveal>

      <SectionReveal className="section container-page">
        <SectionHead eyebrow="Newsletter" title={<>Get the next one.</>} titleClass="h3" />
        <div className="mt-8">
          <NewsletterForm />
        </div>
      </SectionReveal>

      <SectionReveal className="section container-page" id="transactions">
        <SectionHead eyebrow="Transactions" title={<>The deal record.</>} titleClass="h3" />
        <div className="relative mt-10">
          {transactions.map((t) => (
            <div key={t.slug} data-anim="fade-up" className="relative">
              <span className="dec left-0 top-0 h-px w-full" />
              <div className="grid items-baseline gap-2 px-1 py-5 md:grid-cols-[12rem_1fr_auto] md:gap-10 md:px-4">
                <span className="body-sm text-white-40 tabular">{formatDate(t.published_at)}</span>
                <span className="flex flex-col gap-1">
                  <span className="body-lg text-white-100">{t.title}</span>
                  <span className="body-sm text-white-50">{t.excerpt}</span>
                </span>
                {t.external_url && (
                  <a
                    href={t.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="body-sm link-underline self-center text-white-60"
                  >
                    Original release
                  </a>
                )}
              </div>
            </div>
          ))}
          <span className="dec bottom-0 left-0 h-px w-full" />
        </div>
      </SectionReveal>
    </>
  );
}
