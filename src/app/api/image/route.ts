import { NextRequest, NextResponse } from "next/server";

const AM_DOMAIN = (process.env.AM_DOMAIN || "").replace(/^https?:\/\//, "").replace(/\/$/, "");
const AM_IMAGE_BASE = (process.env.AM_IMAGE_BASE || "").replace(/^https?:\/\//, "").replace(/\/$/, "");

export const dynamic = "force-dynamic";

/** Hosts allowed for image proxy (AuctionMethod API returns full URLs from various CDNs) */
function isHostAllowed(host: string): boolean {
  const h = host.toLowerCase();
  const fromEnv = [AM_DOMAIN, AM_IMAGE_BASE].filter(Boolean).map((x) => x.toLowerCase());
  if (fromEnv.some((a) => h === a || h.endsWith("." + a) || a.endsWith("." + h))) return true;
  if (h.endsWith(".cloudfront.net") || h.endsWith(".amazonaws.com")) return true;
  if (h.endsWith(".auctionmethod.com") || h === "auctionmethod.com") return true;
  return false;
}

/**
 * Proxies images from AuctionMethod / CDN domains.
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
  if (!isHostAllowed(parsed.hostname)) {
    return NextResponse.json(
      { error: "URL host not allowed", host: parsed.hostname },
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
