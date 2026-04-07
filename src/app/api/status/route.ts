import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const STATUS_FILE = path.join(process.cwd(), "data", "status.json");

async function readStatus(): Promise<string> {
  try {
    const data = await fs.readFile(STATUS_FILE, "utf-8");
    return JSON.parse(data).text || "Available for opportunities";
  } catch {
    return "Available for opportunities";
  }
}

async function writeStatus(text: string): Promise<void> {
  const dir = path.dirname(STATUS_FILE);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(STATUS_FILE, JSON.stringify({ text }), "utf-8");
}

export async function GET() {
  const text = await readStatus();
  return NextResponse.json({ text });
}

export async function PUT(req: NextRequest) {
  try {
    const { text, password } = await req.json();

    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword || password !== adminPassword) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!text || typeof text !== "string" || text.length > 100) {
      return NextResponse.json({ error: "Invalid status text (max 100 chars)" }, { status: 400 });
    }

    await writeStatus(text.trim());
    return NextResponse.json({ success: true, text: text.trim() });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
