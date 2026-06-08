# Engineering Rules

Policies for working in this repo. Keep this file itself lean — if a rule isn't load-bearing, it doesn't belong here.

**Stack:** Next.js 16 (App Router, Turbopack) · React 19 · TypeScript (strict) · Tailwind v4 · framer-motion. Personal portfolio at chrasriz.com.

## 1. No bloat, no dead code
- Ship the smallest change that solves the problem. No speculative abstractions, options, or "might need it later" scaffolding.
- Delete code you make unused — exports, props, imports, types, CSS classes, keyframes. A symbol with zero references gets removed, not left "just in case."
- No commented-out code. Git is the history.
- Before finishing, grep for references to anything you removed or renamed. If a prop/variant/util has no caller, it's dead — cut it.
- Don't add a dependency for something the platform or an existing dep already does. Prefer a few lines of `fetch` over a client SDK when that's all it takes (see `src/lib/status-store.ts`).

## 2. Verify before you claim done
Run both and report real results — never assert success you didn't observe:
```bash
node_modules/.bin/tsc --noEmit      # must pass clean
node_modules/.bin/next build        # must pass clean
node_modules/.bin/eslint .          # don't add new errors
```
- Don't introduce new lint errors. Pre-existing ones in untouched files are out of scope unless the task is to fix them.
- If you can't run a check, say so explicitly.

## 3. Secrets & env
- **Never commit secrets.** `.env*.local` stays untracked; `.env.example` holds documented placeholders only.
- A leaked key is compromised — rotation is the fix; removing it from a commit is not. Surface it, don't silently "clean it up."
- Read env via `process.env`; document every new var in `.env.example` with what it's for and what breaks without it.

## 4. Persistence reality
- This deploys to serverless — **the filesystem is not writable/persistent in production.** Never use files as a data store for runtime writes. Use the configured store (`src/lib/status-store.ts` → Upstash Redis) with a local fallback for `next dev`.

## 5. Security (don't regress these patterns)
- Auth uses HMAC-signed cookies + `timingSafeEqual` (`src/lib/auth.ts`); cookies are `httpOnly`, `sameSite: strict`, `secure` in prod. Keep it that way.
- Validate and bound every API input (type-check, trim, length-cap) before use; return typed JSON errors with correct status codes.
- Keep the security headers in `next.config.ts`. Don't widen `Permissions-Policy` or drop HSTS without a reason.
- Rate-limit mutating/auth endpoints; keep the limiter's memory bounded.

## 6. Code style — match what's there
- Mirror the surrounding file's conventions: named exports, `@/*` import alias, `cn()` for class merging, `"use client"` only where required.
- Strict TypeScript: no `any`. Narrow `unknown` explicitly (the API routes show the pattern).
- Comments explain *why*, not *what*, and only where the reason isn't obvious. Don't narrate.

## 7. Accessibility & motion
- Respect `prefers-reduced-motion` (`useReducedMotion`) for non-essential animation.
- Interactive elements are keyboard-reachable with visible focus and proper roles/labels. Modals get `role="dialog"`, `aria-modal`, and Escape-to-close.

## 8. Delicate areas — change with care
- The scramble / "hacked" mode logic (`Contact.tsx`, `HackedOverlay.tsx`, `LoadingScreen.tsx`, `hacked-context.tsx`) has a history of flicker/timing regressions. Understand the existing effect-dependency comments before editing; don't "tidy" them blindly.

## 9. Git & scope boundaries
- **Commit or push only when explicitly asked.** Staging working-tree changes is fine; creating commits is not, unless requested.
- Stay on the current branch's intent; don't reformat or refactor files unrelated to the task.
- Keep diffs focused and reviewable.
