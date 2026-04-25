import { NextResponse, type NextRequest } from "next/server";

export const config = {
  matcher: [
    // Run on all routes except static assets and API routes (CSP doesn't help JSON).
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico|fonts/|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|woff2?|ttf)).*)",
    },
  ],
};

export function proxy(request: NextRequest) {
  const nonce = generateNonce();
  const isDev = process.env.NODE_ENV !== "production";

  const directives = [
    `default-src 'self'`,
    // strict-dynamic lets nonce'd scripts load further scripts; falls back to
    // 'self' on browsers that ignore it. unsafe-eval is required by Next dev HMR.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    // framer-motion writes inline `style="..."` attributes from JS. CSP3 splits
    // <style> elements (style-src-elem, nonce-checked) from style attributes
    // (style-src-attr). On older browsers, the unified style-src fallback is
    // permissive — that's the price of motion.
    `style-src 'self' 'unsafe-inline'`,
    `style-src-elem 'self' 'nonce-${nonce}' 'unsafe-inline'`,
    `style-src-attr 'unsafe-inline'`,
    `img-src 'self' data: blob:`,
    `font-src 'self' data:`,
    `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `object-src 'none'`,
    `upgrade-insecure-requests`,
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", directives);
  return response;
}

function generateNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  let str = "";
  for (let i = 0; i < bytes.length; i++) str += String.fromCharCode(bytes[i]);
  return btoa(str);
}
