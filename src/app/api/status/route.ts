import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, verifyToken } from "@/lib/auth";
import { checkRate } from "@/lib/rate-limit";
import { readStatus, writeStatus } from "@/lib/status-store";

export const runtime = "nodejs";

function clientKey(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd?.split(",")[0].trim() || "unknown";
}

export async function GET() {
  const text = await readStatus();
  return NextResponse.json({ text });
}

export async function PUT(req: NextRequest) {
  if (!checkRate(`status:${clientKey(req)}`, 20, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const token = req.cookies.get(AUTH_COOKIE)?.value;
  if (!verifyToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const text = (body as { text?: unknown })?.text;
  if (typeof text !== "string") {
    return NextResponse.json({ error: "Invalid status text" }, { status: 400 });
  }
  const trimmed = text.trim();
  if (!trimmed || trimmed.length > 100) {
    return NextResponse.json(
      { error: "Status text must be 1-100 characters" },
      { status: 400 }
    );
  }

  try {
    await writeStatus(trimmed);
  } catch {
    return NextResponse.json({ error: "Failed to save status" }, { status: 500 });
  }
  return NextResponse.json({ success: true, text: trimmed });
}
