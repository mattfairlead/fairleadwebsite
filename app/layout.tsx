import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MotionProvider from "@/components/MotionProvider";
import RouteTheme from "@/components/RouteTheme";
import { ROUTE_THEME_SCRIPT } from "@/lib/theme";
import { organizationJsonLd, SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/seo";

// Inter is the only typeface — §5.2. Personality comes from weight 600 +
// negative tracking (and Inter's cv11/ss03 alternates), not a second face.
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  icons: { icon: "/brand/brandmark-white.svg" },
};

export const viewport: Viewport = {
  themeColor: "#050E2E",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: the route-theme script below may add
    // data-theme to <html> before React hydrates.
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body>
        {/* Light routes (lib/theme.ts) flip the ground before first paint */}
        <script dangerouslySetInnerHTML={{ __html: ROUTE_THEME_SCRIPT }} />
        <RouteTheme />
        {/* Ambient ground — two slow light sources + film grain behind everything */}
        <div className="ambient" aria-hidden="true" />
        <a href="#main" className="skip-link button">
          Skip to content
        </a>
        <Header />
        <MotionProvider>
          <main id="main">{children}</main>
          <Footer />
        </MotionProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
      </body>
    </html>
  );
}
