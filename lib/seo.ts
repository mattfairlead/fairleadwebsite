import type { Metadata } from "next";

// An empty or malformed NEXT_PUBLIC_SITE_URL (e.g. env vars imported from
// .env.example with blank values) must fall back, not reach new URL("").
function resolveSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) {
    try {
      return new URL(raw).toString().replace(/\/$/, "");
    } catch {
      console.warn(`[seo] NEXT_PUBLIC_SITE_URL is not a valid URL (${JSON.stringify(raw)}) — using default`);
    }
  }
  return "https://fairleadadvisors.com";
}

export const SITE_URL = resolveSiteUrl();
export const SITE_NAME = "Fairlead Advisors";
export const SITE_TAGLINE = "The embedded operating platform for PE-backed companies";
export const SITE_DESCRIPTION =
  "Executive intelligence + artificial intelligence, working inside your portfolio. Embedded finance and operating leadership for PE-backed companies since 2010.";

export function pageMetadata(title: string, description: string, path: string): Metadata {
  const url = `${SITE_URL}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

/** JSON-LD Organization — emitted once, in the root layout. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    telephone: "+1-617-315-4822",
    sameAs: ["https://www.linkedin.com/company/fairlead-advisors"],
    areaServed: "US",
    knowsAbout: [
      "private equity operating partner services",
      "interim CFO",
      "portfolio company visibility",
      "embedded finance leadership",
    ],
  };
}

export function personJsonLd(p: { name: string; title: string; slug: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: p.name,
    jobTitle: p.title,
    worksFor: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    url: `${SITE_URL}/team#${p.slug}`,
  };
}

export function articleJsonLd(a: { title: string; slug: string; published_at: string; excerpt: string; author?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    datePublished: a.published_at,
    description: a.excerpt,
    url: `${SITE_URL}/perspectives/${a.slug}`,
    author: a.author ? { "@type": "Person", name: a.author } : { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };
}

/** JSON-LD VideoObject — client testimonial embeds, so the still shows in video results. */
export function videoJsonLd(v: {
  name: string;
  description: string;
  contentUrl: string;
  thumbnailPath: string;
  uploadDate: string; // ISO date
  duration?: string; // ISO 8601, e.g. "PT2M10S"
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: v.name,
    description: v.description,
    contentUrl: v.contentUrl,
    thumbnailUrl: `${SITE_URL}${v.thumbnailPath}`,
    uploadDate: v.uploadDate,
    ...(v.duration ? { duration: v.duration } : {}),
    url: `${SITE_URL}${v.path}`,
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };
}
