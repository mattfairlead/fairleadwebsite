import type { TeamMember } from "@/lib/types";

/**
 * Seed roster. TODO(§9): titles, credentials, and the full team list are
 * pending Adam/Renee's confirmation of the roster (Joe Winters, Kristen,
 * Adam Vosker on; Chrystelle off per marketing opt-out — she is deliberately
 * absent from this file, not just `visible: false`). Bios below are
 * two-sentence drafts in the §10 voice to be replaced with edited versions
 * of the current site bios (typos fixed, titles standardized, one
 * credential format).
 *
 * Photos: drop standardized headshots (one aspect ratio, 4:5) into
 * Supabase Storage and set photo_url; null renders the brandmark placeholder.
 */
export const team: TeamMember[] = [
  {
    id: "1",
    slug: "adam-carte",
    name: "Adam Carte",
    title: "Partner",
    credentials: null,
    group: "partner",
    specialty: "Embedded CFO leadership and sponsor alignment",
    bio_md:
      "Adam leads embedded finance engagements for PE-backed platforms, sitting in the CFO seat through carve-outs, turnarounds, and exits. TODO: replace with edited bio from current site.",
    photo_url: null,
    linkedin: null,
    visible: true,
    sort: 1,
  },
  {
    id: "2",
    slug: "renee-sass",
    name: "Renee Sass",
    title: "Partner",
    credentials: null,
    group: "partner",
    specialty: "Operating discipline and portfolio company oversight",
    bio_md:
      "Renee runs operating engagements across the portfolio — overhead discipline, cash forecasting, and the controls sponsors depend on. TODO: replace with edited bio from current site.",
    photo_url: null,
    linkedin: null,
    visible: true,
    sort: 2,
  },
  {
    id: "3",
    slug: "charles-abbott",
    name: "Charles Abbott",
    title: "Partner",
    credentials: null,
    group: "partner",
    specialty: "District energy and infrastructure operations",
    bio_md:
      "Charlie leads Fairlead's district energy and infrastructure work, including the firm's largest embedded platform engagements. TODO: replace with edited bio from current site.",
    photo_url: null,
    linkedin: null,
    visible: true,
    sort: 3,
  },
  {
    id: "4",
    slug: "jason-salgo",
    name: "Jason Salgo",
    title: "Partner",
    credentials: null,
    group: "partner",
    specialty: "Operating intelligence and AI-enabled finance",
    bio_md:
      "Jason leads the firm's operating intelligence practice — the tools, the data discipline, and the engagements where both run together. Author of “AI as a core capability.” TODO: replace with edited bio from current site.",
    photo_url: null,
    linkedin: null,
    visible: true,
    sort: 4,
  },
  // ---- Team (partial seed — full roster imports after §9 confirmation) ----
  {
    id: "5",
    slug: "matt-faria",
    name: "Matt Faria",
    title: "TODO: confirm title",
    credentials: null,
    group: "team",
    specialty: "Engagement analytics and marketing systems",
    bio_md: "TODO: bio pending roster confirmation.",
    photo_url: null,
    linkedin: null,
    visible: true,
    sort: 10,
  },
  {
    id: "6",
    slug: "adam-vosker",
    name: "Adam Vosker",
    title: "Senior Advisor", // TODO(§9): site shows both "Senior Advisor" and "Senior Consultant" — confirm
    credentials: null,
    group: "team",
    specialty: "TODO: one-line specialty",
    bio_md: "TODO: bio pending roster confirmation.",
    photo_url: null,
    linkedin: null,
    visible: true,
    sort: 11,
  },
  {
    id: "7",
    slug: "joe-winters",
    name: "Joe Winters",
    title: "TODO: confirm title",
    credentials: null,
    group: "team",
    specialty: "TODO: one-line specialty",
    bio_md: "TODO: bio pending roster confirmation.",
    photo_url: null,
    linkedin: null,
    visible: true,
    sort: 12,
  },
];
