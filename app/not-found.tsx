import Link from "next/link";
import HairlineFrame from "@/components/HairlineFrame";
import Compassmark from "@/components/Compassmark";
import Btn from "@/components/Btn";

/**
 * 404 — designed, not defaulted (§5.9): same hairline frame, the compass
 * rose for a page that is off the map, one headline, a plain explanation,
 * and two ways out.
 */
export default function NotFound() {
  return (
    <div className="container-page pb-24 pt-32 md:pt-48">
      <HairlineFrame>
        <div className="relative flex flex-col items-center gap-8 overflow-hidden px-6 py-20 text-center md:py-28">
          <Compassmark className="relative -mb-2 w-36 md:w-44" uid="lost-compass" />
          <span className="label relative text-gold">404 · Not on the map</span>
          <h1 className="h2 relative max-w-2xl">This page isn&rsquo;t on the map.</h1>
          <p className="body-lg relative max-w-md text-white-60">
            The address may have moved when the site was rebuilt. Nothing you did. Head back to the
            homepage, or tell a partner what you were looking for.
          </p>
          <div className="relative flex flex-wrap justify-center gap-4">
            <Btn href="/" arrow>
              Back to the homepage
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
