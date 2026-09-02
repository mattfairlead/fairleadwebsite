"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { isLightRoute } from "@/lib/theme";

/**
 * Keeps <html data-theme> in step with the route on client-side navigation.
 * The first paint is handled by the inline script in app/layout.tsx, so a
 * hard load never flashes the wrong ground.
 */
export default function RouteTheme() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const root = document.documentElement;
    if (isLightRoute(pathname)) root.setAttribute("data-theme", "light");
    else root.removeAttribute("data-theme");
  }, [pathname]);

  return null;
}
