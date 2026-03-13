import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * One-click sync trigger. Calls the sync endpoint with CRON_SECRET.
 * Add a "Sync Now" button in the dashboard that fetches this route.
 */
export async function POST() {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "CRON_SECRET not configured" },
      { status: 500 }
    );
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
    "http://localhost:3000";

  try {
    const res = await fetch(`${baseUrl}/api/sync`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Sync request failed",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return POST();
}
