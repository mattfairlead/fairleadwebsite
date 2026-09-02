import Image from "next/image";
import clsx from "clsx";

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Circular portrait — the same round, gold-ringed headshot the engagement
 * hub uses on its team cards, translated onto the dark ground: a hairline
 * inner ring, a blue-950 gap, and a gold outer ring that brightens on hover
 * (`.group:hover`). Photos come through /api/team/photo/[id] (already small,
 * served with long cache headers), so they bypass the image optimizer.
 * No photo → graded monogram, same silhouette.
 */
export default function Portrait({
  name,
  src,
  size = "md",
  className,
}: {
  name: string;
  src: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <span className={clsx("portrait", `portrait-${size}`, className)}>
      {src ? (
        <Image
          src={src}
          alt={name}
          fill
          sizes={size === "lg" ? "184px" : size === "md" ? "116px" : "56px"}
          className="object-cover"
          unoptimized={src.startsWith("/api/")}
        />
      ) : (
        <span className="portrait-monogram" aria-hidden="true">
          {initials(name)}
        </span>
      )}
    </span>
  );
}
