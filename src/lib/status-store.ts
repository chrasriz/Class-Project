// Persistence for the editable hero status badge.
//
// Serverless/edge hosts (Vercel, Cloudflare) have no persistent writable
// filesystem, so production uses Upstash Redis over its REST API — no SDK
// dependency, and the same fetch call runs on Node and edge runtimes alike.
// When Upstash isn't configured we fall back to a local gitignored file so
// `next dev` works with zero setup (writes still won't persist on serverless).

import { promises as fs } from "fs";
import path from "path";

const DEFAULT_STATUS = "Available for opportunities";
const KEY = "portfolio:status";

const REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const useUpstash = Boolean(REST_URL && REST_TOKEN);

const STATUS_FILE = path.join(process.cwd(), "data", "status.json");

async function upstashCommand(command: unknown[]): Promise<unknown> {
  const res = await fetch(REST_URL!, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${REST_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Upstash request failed: ${res.status}`);
  }
  const data = (await res.json()) as { result?: unknown; error?: string };
  if (data.error) throw new Error(`Upstash error: ${data.error}`);
  return data.result;
}

export async function readStatus(): Promise<string> {
  if (useUpstash) {
    try {
      const result = await upstashCommand(["GET", KEY]);
      return typeof result === "string" && result ? result : DEFAULT_STATUS;
    } catch {
      return DEFAULT_STATUS;
    }
  }
  try {
    const data = await fs.readFile(STATUS_FILE, "utf-8");
    return (JSON.parse(data) as { text?: string }).text || DEFAULT_STATUS;
  } catch {
    return DEFAULT_STATUS;
  }
}

export async function writeStatus(text: string): Promise<void> {
  if (useUpstash) {
    await upstashCommand(["SET", KEY, text]);
    return;
  }
  const dir = path.dirname(STATUS_FILE);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(STATUS_FILE, JSON.stringify({ text }), "utf-8");
}
