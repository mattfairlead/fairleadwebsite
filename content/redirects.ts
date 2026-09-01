/**
 * 301 redirects from the legacy WordPress site (fairleadadvisors.com) to the
 * new route structure. See §3 of FAIRLEAD_WEBSITE_REDESIGN_PLAN.md.
 *
 * The catch-all for historical /YYYY/MM/* posts is last so the named
 * redirects above it win first.
 */
export const redirects = [
  { source: "/who-we-are", destination: "/team", permanent: true },
  { source: "/who-we-are/", destination: "/team", permanent: true },
  { source: "/services", destination: "/platform", permanent: true },
  { source: "/services/", destination: "/platform", permanent: true },
  // The #energy anchor variant can't be matched server-side (fragments never
  // reach the server); the sector filter link below covers the query form,
  // and the plain path falls through to /engagements.
  {
    source: "/what-we-do/",
    has: [{ type: "query", key: "sector", value: "energy" }],
    destination: "/engagements?sector=energy",
    permanent: true,
  },
  { source: "/what-we-do", destination: "/engagements", permanent: true },
  { source: "/what-we-do/", destination: "/engagements", permanent: true },
  { source: "/announcements", destination: "/perspectives", permanent: true },
  { source: "/announcements/", destination: "/perspectives", permanent: true },
  { source: "/join-our-team", destination: "/careers", permanent: true },
  { source: "/join-our-team/", destination: "/careers", permanent: true },
  { source: "/contact-us", destination: "/contact", permanent: true },
  { source: "/contact-us/", destination: "/contact", permanent: true },

  // Named legacy posts -> new case studies / perspectives
  {
    source: "/2026/02/:slug(over\\-the\\-past\\-year\\-.*)",
    destination: "/perspectives/ai-as-core-capability",
    permanent: true,
  },
  {
    source: "/2023/05/:slug(fairlead\\-advises\\-.*nirenberg.*)",
    destination: "/engagements/nirenberg-neuroscience",
    permanent: true,
  },
  {
    source: "/2023/06/:slug(case\\-study\\-survival\\-sprint.*)",
    destination: "/engagements/survival-sprint",
    permanent: true,
  },
  {
    source: "/2025/12/:slug(fairlead\\-supports\\-dion.*)",
    destination: "/engagements/dion-leadership",
    permanent: true,
  },

  // Catch-all: every other historical dated post archives under Perspectives → Transactions
  {
    source: "/:year(\\d{4})/:month(\\d{2})/:slug*",
    destination: "/perspectives/transactions/:slug*",
    permanent: true,
  },
];
