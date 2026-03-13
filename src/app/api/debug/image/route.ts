import { NextRequest, NextResponse } from "next/server";

const AM_DOMAIN = (process.env.AM_DOMAIN || "").replace(/^https?:\/\//, "").replace(/\/$/, "");

export const dynamic = "force-dynamic";

/**
 * Debug endpoint to test image loading.
 * GET /api/debug/image?url=<encoded_url>
 * Returns JSON with fetch result (status, headers) or the image if ?raw=1
 */
export async function GET(req: NextRequest) {
  const urlParam = req.nextUrl.searchParams.get("url");
  const raw = req.nextUrl.searchParams.get("raw") === "1";

  if (!urlParam) {
    return NextResponse.json({
      error: "Missing url parameter",
      example: `/api/debug/image?url=${encodeURIComponent("https://your-am-domain.com/i/1/1773431300/i1-1.jpg")}`,
    });
  }

  let imageUrl: string;
  try {
    imageUrl = decodeURIComponent(urlParam);
  } catch {
    return NextResponse.json({ error: "Invalid url" });
  }

  const parsed = new URL(imageUrl);
  const allowedHost = AM_DOMAIN.toLowerCase();
  const host = parsed.hostname.toLowerCase();
  const isAllowed =
    host === allowedHost ||
    host.endsWith("." + allowedHost) ||
    allowedHost.endsWith("." + host);

  if (!AM_DOMAIN) {
    return NextResponse.json({ error: "AM_DOMAIN not configured", amDomain: "missing" });
  }

  if (!isAllowed) {
    return NextResponse.json({
      error: "URL host not allowed",
      host,
      allowedHost,
    });
  }

  try {
    const res = await fetch(imageUrl, {
      headers: {
        Accept: "image/*",
        "User-Agent": "Mozilla/5.0 (compatible; BidIQ/1.0)",
        Referer: `${parsed.protocol}//${parsed.host}/`,
      },
    });

    if (raw && res.ok) {
      const body = await res.arrayBuffer();
      const contentType = res.headers.get("content-type") || "image/jpeg";
      return new NextResponse(body, { headers: { "Content-Type": contentType } });
    }

    return NextResponse.json({
      url: imageUrl,
      status: res.status,
      statusText: res.statusText,
      ok: res.ok,
      contentType: res.headers.get("content-type"),
      contentLength: res.headers.get("content-length"),
    });
  } catch (err) {
    return NextResponse.json({
      error: err instanceof Error ? err.message : "Fetch failed",
    });
  }
}
