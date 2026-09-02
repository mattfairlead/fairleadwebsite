/**
 * Route themes. The site is dark by default (blue-950 ground, white ink);
 * the routes listed here flip to a white ground with navy ink. The flip is
 * a `data-theme="light"` attribute on <html>, applied before first paint by
 * the inline script in app/layout.tsx and kept in sync on client
 * navigations by <RouteTheme>. The token remap lives in app/globals.css
 * under "Light routes".
 */
export const LIGHT_ROUTES = ["/careers"] as const;

export function isLightRoute(pathname: string): boolean {
  return LIGHT_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"));
}

/** Inline, pre-hydration version of isLightRoute() — keep the two in step. */
export const ROUTE_THEME_SCRIPT = `(function(){var p=location.pathname,r=${JSON.stringify(
  LIGHT_ROUTES
)};for(var i=0;i<r.length;i++){if(p===r[i]||p.indexOf(r[i]+"/")===0){document.documentElement.setAttribute("data-theme","light");return}}})();`;
