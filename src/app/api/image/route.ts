import { NextRequest, NextResponse } from "next/server";

// Allow self-signed certs for AM image fetch
if (typeof process !== "undefined") process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const AM_DOMAIN = (process.env.AM_DOMAIN || "").replace(/^https?:\/\//, "").replace(/\/$/, "");
const AM_IMAGE_BASE = (process.env.AM_IMAGE_BASE || "").replace(/^https?:\/\//, "").replace(/\/$/, "");

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

  const parsed = new URL(imageUrl);
  const host = parsed.hostname.toLowerCase();
  const allowedHosts = [AM_DOMAIN, AM_IMAGE_BASE].filter(Boolean).map((h) => h.toLowerCase());
  const isAllowed =
    allowedHosts.some(
      (allowedHost) =>
        host === allowedHost ||
        host.endsWith("." + allowedHost) ||
        allowedHost.endsWith("." + host)
    ) ||
    host.endsWith(".cloudfront.net") ||
    host.endsWith(".amazonaws.com");
  if (!isAllowed) {
    return NextResponse.json(
      { error: "URL not allowed. Set AM_DOMAIN or AM_IMAGE_BASE." },
      { status: 403 }
    );
  }

  try {
    let res = await fetch(imageUrl, {
      headers: {
        Accept: "image/*",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      next: { revalidate: 3600 },
    });
    if (!res.ok && (res.status === 403 || res.status === 500)) {
      res = await fetch(imageUrl, {
        headers: { Accept: "image/*" },
        next: { revalidate: 3600 },
      });
    }
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
