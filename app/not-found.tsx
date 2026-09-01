import Link from "next/link";
import HairlineFrame from "@/components/HairlineFrame";

/**
 * 404 — designed, not defaulted (§5.9): same hairline frame, one .h2,
 * one pill.
 */
export default function NotFound() {
  return (
    <div className="container-page pb-24 pt-48">
      <HairlineFrame>
        <div className="flex flex-col items-center gap-8 px-6 py-24 text-center">
          <h1 className="h2">This page isn&rsquo;t on the map.</h1>
          <Link href="/" className="btn btn-primary button">
            Back to the platform
          </Link>
        </div>
      </HairlineFrame>
    </div>
  );
}
