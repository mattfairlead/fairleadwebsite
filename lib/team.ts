import type { HubTeamRow, TeamMember } from "@/lib/types";

/**
 * Hub → website mapping for team members. The engagement hub owns the data
 * (one table, `team_members`); this file owns how it reads on the site.
 */

/** Columns the site reads. Never `photo_url` — see HubTeamRow. */
export const HUB_TEAM_COLUMNS =
  "id,name,suffix,roles,sort_order,extended_bio,has_photo,show_on_website,updated_at";

export function slugify(name: string): string {
  return name
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Credential tokens that can appear in the hub's suffix line, with an optional
// qualifier: "CPA", "CPA (inactive)", "P.E.", "CGMA".
const CREDENTIAL =
  /^(CPA|CFA|CGMA|CMA|CIA|CTP|CIRA|CFP|CAIA|FRM|PMP|P\.?E\.?|MBA|J\.?D\.?|Ph\.?D\.?|Esq\.?)(\s*\([^)]*\))?$/i;

/**
 * "CFA, Partner" → title "Partner", credentials "CFA".
 * "CPA, CGMA, Senior Consultant" → title "Senior Consultant", credentials "CPA, CGMA".
 * "Strategic Partner, Commercial Diligence & Growth" → title verbatim, no credentials.
 */
export function splitSuffix(suffix: string): { title: string; credentials: string | null } {
  const parts = suffix
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const credentials = parts.filter((p) => CREDENTIAL.test(p));
  const rest = parts.filter((p) => !CREDENTIAL.test(p));
  return {
    title: rest.join(", "),
    credentials: credentials.length ? credentials.join(", ") : null,
  };
}

/** The founding partners carry a bare "Partner" in the suffix; "Strategic Partner" is the bench. */
export function isPartner(suffix: string): boolean {
  return suffix.split(",").some((p) => /^partner$/i.test(p.trim()));
}

/**
 * Hub bios are plain text with paragraph breaks — usually blank lines, but
 * some were pasted with single newlines. Every line break becomes a paragraph
 * so the Markdown renderer never collapses one into a space.
 */
export function bioToMarkdown(text: string): string {
  return text
    .replace(/\r\n?/g, "\n")
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .join("\n\n");
}

export function photoUrlFor(row: Pick<HubTeamRow, "id" | "has_photo" | "updated_at">): string | null {
  if (!row.has_photo) return null;
  // updated_at busts the CDN cache when a new headshot is uploaded in the hub.
  const v = Date.parse(row.updated_at) || 0;
  return `/api/team/photo/${row.id}?v=${v}`;
}

export function mapHubMember(row: HubTeamRow): TeamMember {
  const { title, credentials } = splitSuffix(row.suffix ?? "");
  return {
    id: String(row.id),
    slug: slugify(row.name),
    name: row.name.trim(),
    title,
    credentials,
    group: isPartner(row.suffix ?? "") ? "partner" : "team",
    specialty: (row.roles ?? "").trim(),
    bio_md: bioToMarkdown(row.extended_bio ?? ""),
    photo_url: photoUrlFor(row),
    linkedin: null,
    visible: row.show_on_website,
    sort: row.sort_order,
  };
}

export function sortHubRows<T extends Pick<HubTeamRow, "sort_order" | "id">>(rows: T[]): T[] {
  return [...rows].sort((a, b) => a.sort_order - b.sort_order || a.id - b.id);
}
