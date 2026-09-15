import type { HubPerspectiveRow, Perspective } from "@/lib/types";
import { slugify } from "@/lib/team";

/**
 * Hub → website mapping for perspectives. The engagement hub owns the data
 * (one table, `perspectives`, edited in its Perspectives module); this file
 * owns how it reads on the site.
 */

/**
 * Columns the site reads. `author` embeds the team member's name through the
 * hub's own anon policy on `team_members`, so it comes back null for an
 * author whose Website checkbox is off — the post then shows no byline.
 */
export const HUB_PERSPECTIVE_COLUMNS =
  "id,kind,slug,title,published_at,excerpt,body_md,external_url,show_on_website,author:team_members(name)";

export function mapHubPerspective(row: HubPerspectiveRow): Perspective {
  return {
    id: String(row.id),
    slug: row.slug,
    title: row.title.trim(),
    author_slug: row.author?.name ? slugify(row.author.name) : null,
    kind: row.kind,
    published_at: row.published_at,
    excerpt: row.excerpt,
    body_md: row.body_md,
    external_url: row.external_url,
    visible: row.show_on_website,
  };
}
