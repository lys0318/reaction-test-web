import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getTest } from "@/lib/tests";
import { cleanNickname, validateValue, type LeaderboardEntry } from "@/lib/leaderboard";

export const dynamic = "force-dynamic";

// Minimal binding surfaces, to avoid depending on generated env types.
interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  all<T = Record<string, unknown>>(): Promise<{ results: T[] }>;
  run(): Promise<unknown>;
}
interface D1Database {
  prepare(query: string): D1PreparedStatement;
}
interface RateLimiter {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}
type Env = {
  DB?: D1Database;
  LEADERBOARD_RL?: RateLimiter;
  TURNSTILE_SECRET_KEY?: string;
};

function getEnv(): Env {
  try {
    return getCloudflareContext().env as unknown as Env;
  } catch {
    return {};
  }
}

function clientIp(request: Request): string {
  return request.headers.get("cf-connecting-ip") || "anon";
}

async function verifyTurnstile(secret: string, token: string | undefined, ip: string): Promise<boolean> {
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

async function topScores(db: D1Database, slug: string, higherIsBetter: boolean): Promise<LeaderboardEntry[]> {
  const agg = higherIsBetter ? "MAX" : "MIN";
  const dir = higherIsBetter ? "DESC" : "ASC";
  const sql = `SELECT nickname, ${agg}(value) AS value FROM scores WHERE test_slug = ?1 GROUP BY nickname ORDER BY value ${dir} LIMIT 10`;
  const { results } = await db.prepare(sql).bind(slug).all<{ nickname: string; value: number }>();
  return results.map((row) => ({ nickname: row.nickname, value: row.value }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const test = getTest(slug);
  if (!test) return NextResponse.json({ error: "unknown_test" }, { status: 404 });

  const db = getEnv().DB;
  if (!db) return NextResponse.json({ entries: [] });
  try {
    return NextResponse.json({ entries: await topScores(db, slug, test.higherIsBetter) });
  } catch {
    return NextResponse.json({ entries: [] });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const test = getTest(slug);
  if (!test) return NextResponse.json({ error: "unknown_test" }, { status: 404 });

  const env = getEnv();
  const db = env.DB;
  if (!db) return NextResponse.json({ error: "unavailable" }, { status: 503 });

  const ip = clientIp(request);

  // Rate limit submissions per IP + test (no-op if the binding is absent).
  if (env.LEADERBOARD_RL) {
    const { success } = await env.LEADERBOARD_RL.limit({ key: `${slug}:${ip}` });
    if (!success) return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }
  const { nickname: rawNickname, value: rawValue, turnstileToken } = (body ?? {}) as {
    nickname?: unknown;
    value?: unknown;
    turnstileToken?: string;
  };

  // Bot protection: verify the Turnstile token when a secret is configured.
  if (env.TURNSTILE_SECRET_KEY) {
    const ok = await verifyTurnstile(env.TURNSTILE_SECRET_KEY, turnstileToken, ip);
    if (!ok) return NextResponse.json({ error: "turnstile_failed" }, { status: 403 });
  }

  const nickname = cleanNickname(rawNickname);
  const value = validateValue(rawValue, test.scoreType);
  if (!nickname) return NextResponse.json({ error: "bad_nickname" }, { status: 400 });
  if (value === null) return NextResponse.json({ error: "bad_value" }, { status: 400 });

  try {
    await db
      .prepare("INSERT INTO scores (test_slug, nickname, value, created_at) VALUES (?1, ?2, ?3, ?4)")
      .bind(slug, nickname, value, Date.now())
      .run();
    return NextResponse.json({ ok: true, entries: await topScores(db, slug, test.higherIsBetter) });
  } catch {
    return NextResponse.json({ error: "db_error" }, { status: 500 });
  }
}
