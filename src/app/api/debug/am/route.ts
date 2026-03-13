import { NextResponse } from "next/server";

const AM_DOMAIN = process.env.AM_DOMAIN!;
const AM_EMAIL = process.env.AM_EMAIL!;
const AM_PASSWORD = process.env.AM_PASSWORD!;

export const dynamic = "force-dynamic";

/**
 * Debug endpoint to inspect raw AuctionMethod API responses.
 * GET /api/debug/am — returns raw auth + auctions response.
 * Remove or restrict before production.
 */
export async function GET() {
  const base = `https://${AM_DOMAIN}`;

  if (!AM_DOMAIN || !AM_EMAIL || !AM_PASSWORD) {
    return NextResponse.json({
      error: "Missing AM_DOMAIN, AM_EMAIL, or AM_PASSWORD",
      env: {
        AM_DOMAIN: AM_DOMAIN ? "set" : "missing",
        AM_EMAIL: AM_EMAIL ? "set" : "missing",
        AM_PASSWORD: AM_PASSWORD ? "set" : "missing",
      },
    });
  }

  try {
    // 1. Auth
    const authRes = await fetch(`${base}/amapi/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: AM_EMAIL, password: AM_PASSWORD }),
    });
    const authText = await authRes.text();
    let authData: unknown;
    try {
      authData = JSON.parse(authText);
    } catch {
      authData = { _raw: authText.slice(0, 500), _note: "Not valid JSON" };
    }

    if (!authRes.ok) {
      return NextResponse.json({
        step: "auth",
        status: authRes.status,
        authResponse: authData,
      });
    }

    const token =
      (authData as { token?: string })?.token ||
      (authData as { access_token?: string })?.access_token;

    if (!token) {
      return NextResponse.json({
        step: "auth",
        note: "No token in response",
        authResponse: authData,
      });
    }

    // 2. Fetch auctions (raw)
    const auctionsRes = await fetch(
      `${base}/amapi/admin/auctions?offset=0&limit=100`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const auctionsText = await auctionsRes.text();
    let auctionsData: unknown;
    try {
      auctionsData = JSON.parse(auctionsText);
    } catch {
      auctionsData = {
        _raw: auctionsText.slice(0, 1000),
        _note: "Not valid JSON — API may return HTML or different format",
      };
    }

    if (!auctionsRes.ok) {
      return NextResponse.json({
        step: "auctions",
        status: auctionsRes.status,
        authOk: true,
        auctionsResponse: auctionsData,
      });
    }

    // Extract array for count
    const obj = auctionsData as Record<string, unknown>;
    const arr =
      obj.auctions ??
      obj.data ??
      obj.results ??
      obj.auction ??
      obj.auction_list;
    const count = Array.isArray(arr) ? arr.length : arr ? 1 : 0;

    return NextResponse.json({
      authOk: true,
      auctionsOk: true,
      rawAuctionCount: count,
      topLevelKeys: Object.keys(obj),
      firstAuctionKeys: Array.isArray(arr) && arr[0] ? Object.keys(arr[0] as object) : null,
      auctionsResponse: auctionsData,
    });
  } catch (err) {
    return NextResponse.json({
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
}
