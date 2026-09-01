import type { Perspective } from "@/lib/types";

/**
 * Perspectives — the firm's point of view (target: one per quarter), plus
 * the historical press reposts archived as "Transactions" (§4.6).
 *
 * TODO(§9): full transaction archive (27 posts back to 2010) imports from
 * the WordPress export — the entries below are the known named ones. Each
 * transaction is a compact timeline row: title, date, one line, link out.
 */
export const perspectives: Perspective[] = [
  {
    id: "1",
    slug: "ai-as-core-capability",
    title: "AI as a core capability",
    author_slug: "jason-salgo",
    kind: "perspective",
    published_at: "2026-02-15",
    excerpt:
      "Over the past year, AI moved from experiment to daily production across our engagements. What that actually took — and why most pilots never get there.",
    body_md: `Over the past year, AI at Fairlead moved from experiment to daily production. Not a pilot, not a proof of concept — tools our teams use every day, inside live engagements, for more than six months now.

That distinction matters because most firms are stuck at the pilot phase. The industry data is blunt: the overwhelming majority of corporate AI pilots never reach production. The gap isn't the models. It's the implementation threshold — the unglamorous work of wiring a tool into how a company actually closes its books, pays its vendors, and reports to its board.

We crossed that threshold the only way we know: from inside the companies. Every tool we run started as a specific answer to a specific client's pain — a 13-week cash forecast a sponsor could trust before every meeting, a board pack that assembles itself from live data with a full audit trail, an assistant that noticed our client's largest customer was being undercharged.

Because the tools were built against real operating problems, they generalize. And because we've been embedded in PE-backed companies since 2010, the data they learn from is the kind you can't buy: fifteen years of operating history, captured from the seat.

We are not the most vocal participants in discussions about AI. But when a portfolio company asks whether an approach will work, we answer from experience rather than optimism.

*TODO: replace with the edited full text of Jason's February 2026 post.*`,
    external_url: null,
    visible: true,
  },
  // ---- Transactions (historical reposts — compact timeline) ----
  {
    id: "t1",
    slug: "dion-leadership-gallagher",
    title: "Fairlead supports Dion Leadership in its sale to Gallagher",
    author_slug: null,
    kind: "transaction",
    published_at: "2025-12-01",
    excerpt: "Sale process support from preparation to close.",
    body_md: null,
    external_url: null, // TODO: link to original release
    visible: true,
  },
  {
    id: "t2",
    slug: "nirenberg-neuroscience-sale",
    title: "Fairlead advises Nirenberg Neuroscience through its sale",
    author_slug: null,
    kind: "transaction",
    published_at: "2023-05-01",
    excerpt: "M&A advisory through diligence and close.",
    body_md: null,
    external_url: null, // TODO: link to original release
    visible: true,
  },
  {
    id: "t3",
    slug: "survival-sprint-case-study",
    title: "Case study: the survival sprint",
    author_slug: null,
    kind: "transaction",
    published_at: "2023-06-01",
    excerpt: "Cash control, overhead discipline, and the path to financing.",
    body_md: null,
    external_url: null,
    visible: true,
  },
  // TODO(§9): import remaining ~24 historical posts (MXenergy, Ford, K.A.CARE, ...)
  // from the WordPress export as kind: "transaction" rows.
];
