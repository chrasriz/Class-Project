// In-memory rate limiter. Per-instance only: on serverless platforms each
// cold-started instance has its own map, so this stops naive bursts but is
// not a substitute for a distributed limiter (Upstash Ratelimit, Vercel KV).

type Entry = { count: number; resetAt: number };

const buckets = new Map<string, Entry>();

// Cap distinct keys so a flood of unique clients (e.g. spoofed X-Forwarded-For)
// can't grow the map without bound. Sweep expired entries when we cross it.
const MAX_BUCKETS = 10_000;

export function checkRate(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = buckets.get(key);
  if (!entry || entry.resetAt <= now) {
    if (buckets.size >= MAX_BUCKETS) {
      for (const [k, v] of buckets) {
        if (v.resetAt <= now) buckets.delete(k);
      }
    }
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= max) return false;
  entry.count += 1;
  return true;
}
