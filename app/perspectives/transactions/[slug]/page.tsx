import { permanentRedirect } from "next/navigation";

/**
 * Former landing target of the legacy /YYYY/MM/* redirect, from when the
 * press reposts were a separate timeline. Every post has its own page now,
 * so anything still pointing here goes to it.
 */
export default async function TransactionSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  permanentRedirect(`/perspectives/${slug}`);
}
