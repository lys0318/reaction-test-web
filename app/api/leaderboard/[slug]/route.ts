import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getTest } from "@/lib/tests";
import { cleanNickname, validateValue, type LeaderboardEntry } from "@/lib/leaderboard";

export const dynamic = "force-dynamic";

// Minimal D1 surface we use, to avoid depending on generated env types.
interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  all<T = Record<string, unknown>>(): Promise<{ results: T[] }>;
  run(): Promise<unknown>;
}
interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

function getDb(): D1Database | null {
  try {
    const { env } = getCloudflareContext();
    return (env as unknown as { DB?: D1Database }).DB ?? null;
  } catch {
    return null;
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

  const db = getDb();
  if (!db) return NextResponse.json({ entries: [] });
  try {
    const entries = await topScores(db, slug, test.higherIsBetter);
    return NextResponse.json({ entries });
  } catch {
    return NextResponse.json({ entries: [] });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const test = getTest(slug);
  if (!test) return NextResponse.json({ error: "unknown_test" }, { status: 404 });

  const db = getDb();
  if (!db) return NextResponse.json({ error: "unavailable" }, { status: 503 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }

  const { nickname: rawNickname, value: rawValue } = (body ?? {}) as {
    nickname?: unknown;
    value?: unknown;
  };
  const nickname = cleanNickname(rawNickname);
  const value = validateValue(rawValue, test.scoreType);
  if (!nickname) return NextResponse.json({ error: "bad_nickname" }, { status: 400 });
  if (value === null) return NextResponse.json({ error: "bad_value" }, { status: 400 });

  try {
    await db
      .prepare("INSERT INTO scores (test_slug, nickname, value, created_at) VALUES (?1, ?2, ?3, ?4)")
      .bind(slug, nickname, value, Date.now())
      .run();
    const entries = await topScores(db, slug, test.higherIsBetter);
    return NextResponse.json({ ok: true, entries });
  } catch {
    return NextResponse.json({ error: "db_error" }, { status: 500 });
  }
}
