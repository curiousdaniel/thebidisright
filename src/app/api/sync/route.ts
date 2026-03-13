import { NextResponse } from "next/server";
import { runSync } from "@/lib/sync";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await runSync();

  if (result.success) {
    return NextResponse.json(result);
  }

  return NextResponse.json(result, { status: 500 });
}

export async function GET(request: Request) {
  return POST(request);
}
