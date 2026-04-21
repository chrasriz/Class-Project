import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, SESSION_TTL_MS, safeEqual, signToken, verifyToken } from "@/lib/auth";
import { checkRate } from "@/lib/rate-limit";

export const runtime = "nodejs";

function clientKey(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd?.split(",")[0].trim() || "unknown";
}

export async function POST(req: NextRequest) {
  if (!checkRate(`auth:${clientKey(req)}`, 5, 60_000)) {
    return NextResponse.json({ error: "Too many attempts" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const password = (body as { password?: unknown })?.password;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  }
  if (typeof password !== "string" || !safeEqual(password, adminPassword)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const expiresAt = Date.now() + SESSION_TTL_MS;
  const token = signToken(expiresAt);
  if (!token) {
    return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: AUTH_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: AUTH_COOKIE,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return res;
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE)?.value;
  return NextResponse.json({ authenticated: verifyToken(token) });
}
