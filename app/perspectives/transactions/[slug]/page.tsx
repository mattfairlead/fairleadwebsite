import { permanentRedirect } from "next/navigation";

/**
 * Landing target for the legacy /YYYY/MM/* catch-all redirect (§3). The
 * transaction record renders as a compact timeline on /perspectives — a
 * slug-level page adds nothing over the row, so land on the timeline.
 */
export default function TransactionSlugPage() {
  permanentRedirect("/perspectives#transactions");
}
