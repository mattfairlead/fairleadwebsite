import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import SectionReveal from "@/components/SectionReveal";
import SectionHead from "@/components/SectionHead";
import NewsletterForm from "@/components/NewsletterForm";
import Compassmark from "@/components/Compassmark";
import { ARROW } from "@/components/Btn";
import { getPerspectives, getTeam } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Perspectives",
  "The firm's point of view, written from inside engagements, and the record of the work back to 2010.",
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
 * The posts are read live from the engagement hub (see lib/data.ts). The hub
 * pings /api/revalidate when a post is published or edited; this interval is
 * the safety net for anything that changes the table without that ping.
 */
export const revalidate = 300;

/**
 * /perspectives — §4.6. One dated list of every post, newest first; each row
 * opens the post's own page. The content is the hub's `perspectives` table
 * (lib/data.ts), so the partners publish, edit and unpublish from there.
 */
export default async function PerspectivesPage() {
  const [posts, team] = await Promise.all([getPerspectives(), getTeam()]);

  return (
    <>
      <PageIntro
        eyebrow="Perspectives"
        title={<>The firm&rsquo;s point of view.</>}
        lead={<>Written from inside engagements. One per quarter, worth the wait.</>}
        aside={<Compassmark className="block w-52 max-lg:mx-auto md:w-60 lg:w-72" />}
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
                  className="spot group grid items-baseline gap-3 px-2 py-10 md:grid-cols-[12rem_1fr_auto] md:gap-10 md:px-5"
                >
                  <span className="body-sm text-white-40 tabular">{formatDate(post.published_at)}</span>
                  <span className="flex flex-col gap-3">
                    <span className="h3 transition-colors duration-300 group-hover:text-gold-soft">{post.title}</span>
                    <span className="body-md max-w-2xl text-white-60">{post.excerpt}</span>
                    {author && (
                      <span className="body-sm flex items-center gap-2 text-white-40">
                        <span className="inline-block h-px w-4 bg-white-20" aria-hidden="true" />
                        {author.name}
                      </span>
                    )}
                  </span>
                  <span className="row-arrow self-center">{ARROW}</span>
                </Link>
              </div>
            );
          })}
          <span className="dec bottom-0 left-0 h-px w-full" />
        </div>
      </SectionReveal>

      <SectionReveal className="section container-page">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div className="flex flex-col gap-8">
            <Image
              src="/brand/PlanAsset%203.svg"
              alt=""
              width={622}
              height={344}
              aria-hidden="true"
              data-anim="fade-up"
              className="h-auto w-28 md:w-36"
            />
            <SectionHead eyebrow="Newsletter" title={<>Get the next one.</>} titleClass="h3" />
          </div>
          <NewsletterForm />
        </div>
      </SectionReveal>
    </>
  );
}
