// Single source of truth for the response security headers. Imported by
// next.config.ts (the real headers) and the terminal's `nmap` command (the
// easter egg), so the printed "scan result" can never drift from reality.
export const SECURITY_HEADERS = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // CSP intentionally omitted: framer-motion relies on inline styles, which
  // needs a nonce-based CSP to be effective. Add one after confirming every
  // inline style path with a proper audit.
];
