import { createHmac, timingSafeEqual } from "crypto";

export const AUTH_COOKIE = "admin_session";
export const SESSION_TTL_MS = 60 * 60 * 1000; // 1 hour

function getSecret(): string | null {
  return process.env.AUTH_SECRET || process.env.ADMIN_PASSWORD || null;
}

export function safeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) {
    // Burn a compare on the attacker's input to keep timing relatively stable.
    timingSafeEqual(aBuf, aBuf);
    return false;
  }
  return timingSafeEqual(aBuf, bBuf);
}

export function signToken(expiresAt: number): string | null {
  const secret = getSecret();
  if (!secret) return null;
  const payload = String(expiresAt);
  const sig = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifyToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const secret = getSecret();
  if (!secret) return false;
  const dot = token.indexOf(".");
  if (dot <= 0) return false;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = createHmac("sha256", secret).update(payload).digest("base64url");
  const aBuf = Buffer.from(sig);
  const bBuf = Buffer.from(expected);
  if (aBuf.length !== bBuf.length) return false;
  if (!timingSafeEqual(aBuf, bBuf)) return false;
  const expiresAt = Number(payload);
  return Number.isFinite(expiresAt) && expiresAt > Date.now();
}
