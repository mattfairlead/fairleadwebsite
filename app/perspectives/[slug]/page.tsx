import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import PageIntro from "@/components/PageIntro";
import SectionReveal from "@/components/SectionReveal";
import Btn from "@/components/Btn";
import { Markdown } from "@/lib/md";
import { getPerspective, getPerspectives, getTeam } from "@/lib/data";
import { articleJsonLd, pageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  const posts = await getPerspectives();
  return posts.filter((p) => p.body_md).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPerspective(slug);
  if (!post) return {};
  return pageMetadata(post.title, post.excerpt, `/perspectives/${post.slug}`);
}

export default async function PerspectivePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPerspective(slug);
  if (!post) notFound();
  // A post with no body is listed only.
  if (!post.body_md) redirect("/perspectives");

  const team = await getTeam();
  const author = team.find((m) => m.slug === post.author_slug);
  const date = new Date(post.published_at + "T00:00:00Z").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  return (
    <>
      <PageIntro
        eyebrow={`Perspective · ${date}`}
        title={post.title}
        lead={author ? `${author.name} · ${author.title}` : undefined}
      />

      <article className="container-page pb-16">
        <div className="prose-measure">
          <Markdown>{post.body_md}</Markdown>
          {post.external_url && (
            <p className="body-sm mt-10 text-white-40">
              <a
                href={post.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline text-white-60"
              >
                Read the original release
              </a>
            </p>
          )}
        </div>
      </article>

      <SectionReveal className="container-page pb-20">
        <div className="flex flex-wrap gap-4">
          <Link href="/perspectives" className="btn btn-secondary button">
            All perspectives
          </Link>
          <Btn href="/contact" arrow>
            Talk to a partner
          </Btn>
        </div>
      </SectionReveal>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            articleJsonLd({
              title: post.title,
              slug: post.slug,
              published_at: post.published_at,
              excerpt: post.excerpt,
              author: author?.name,
            })
          ),
        }}
      />
    </>
  );
}
