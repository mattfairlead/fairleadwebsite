import Link from "next/link";
import HairlineFrame from "@/components/HairlineFrame";
import Btn from "@/components/Btn";

/**
 * 404 — designed, not defaulted (§5.9): same hairline frame, one headline,
 * a plain explanation, and two ways out.
 */
export default function NotFound() {
  return (
    <div className="container-page pb-24 pt-48">
      <HairlineFrame>
        <div className="relative flex flex-col items-center gap-8 overflow-hidden px-6 py-24 text-center md:py-32">
          <span className="ghost-num !right-auto !top-1/2 !-translate-y-1/2 !text-[14rem] md:!text-[22rem]" aria-hidden="true" style={{ left: "50%", transform: "translate(-50%, -50%)" }}>
            404
          </span>
          <span className="label relative text-gold">Not on the map</span>
          <h1 className="h2 relative max-w-2xl">This page isn&rsquo;t on the map.</h1>
          <p className="body-lg relative max-w-md text-white-60">
            The address may have moved when the site was rebuilt. Nothing you did — head back to the
            platform, or tell a partner what you were looking for.
          </p>
          <div className="relative flex flex-wrap justify-center gap-4">
            <Btn href="/" arrow>
              Back to the platform
            </Btn>
            <Link href="/contact" className="btn btn-ghost button">
              Talk to a partner
            </Link>
          </div>
        </div>
      </HairlineFrame>
    </div>
  );
}
