import { NextRequest, NextResponse } from "next/server";

// Allow self-signed certs for AM image fetch
if (typeof process !== "undefined") process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const AM_DOMAIN = (process.env.AM_DOMAIN || "").replace(/^https?:\/\//, "").replace(/\/$/, "");

export const dynamic = "force-dynamic";

/**
 * Proxies images from the AuctionMethod domain.
 * Use when direct image loading fails (CORS, referrer, etc.).
 * GET /api/image?url=<encoded_full_url>
 */
export async function GET(req: NextRequest) {
  const urlParam = req.nextUrl.searchParams.get("url");
  if (!urlParam) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  let imageUrl: string;
  try {
    imageUrl = decodeURIComponent(urlParam);
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  if (!imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) {
    return NextResponse.json({ error: "Invalid url scheme" }, { status: 400 });
  }

  // Only allow proxying from our configured AM domain
  if (!AM_DOMAIN) {
    return NextResponse.json({ error: "AM_DOMAIN not configured" }, { status: 500 });
  }
  const parsed = new URL(imageUrl);
  const allowedHost = AM_DOMAIN.toLowerCase();
  const host = parsed.hostname.toLowerCase();
  const isAllowed = host === allowedHost || host.endsWith("." + allowedHost);
  if (!isAllowed) {
    return NextResponse.json({ error: "URL not allowed" }, { status: 403 });
  }

  try {
    const res = await fetch(imageUrl, {
      headers: { Accept: "image/*" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      return NextResponse.json({ error: "Upstream error" }, { status: res.status });
    }
    const contentType = res.headers.get("content-type") || "image/jpeg";
    const body = await res.arrayBuffer();
    return new NextResponse(body, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (err) {
    console.error("[api/image] fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch image" }, { status: 502 });
  }
}
