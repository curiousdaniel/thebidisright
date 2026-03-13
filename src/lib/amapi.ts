import { AMApiAuction, AMApiItem } from "@/types/auction";

const AM_DOMAIN = process.env.AM_DOMAIN!;
const AM_EMAIL = process.env.AM_EMAIL!;
const AM_PASSWORD = process.env.AM_PASSWORD!;

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

function baseUrl(): string {
  return `https://${AM_DOMAIN}`;
}

export async function authenticate(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  const res = await fetch(`${baseUrl()}/amapi/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: AM_EMAIL, password: AM_PASSWORD }),
  });

  if (!res.ok) {
    throw new Error(`AM API auth failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  cachedToken = data.token || data.access_token;
  tokenExpiresAt = Date.now() + 55 * 60 * 1000;
  return cachedToken!;
}

async function amFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = await authenticate();
  const res = await fetch(`${baseUrl()}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`AM API error: ${res.status} ${res.statusText} — ${path}`);
  }

  return res.json();
}

export async function fetchAuctions(
  offset = 0,
  limit = 100
): Promise<AMApiAuction[]> {
  const data = await amFetch<Record<string, unknown>>(
    `/amapi/admin/auctions?offset=${offset}&limit=${limit}`
  );
  // Support various API response shapes
  const arr =
    data.auctions ??
    data.data ??
    data.results ??
    data.auction ??
    data.auction_list;
  if (Array.isArray(arr)) return arr as AMApiAuction[];
  if (arr && typeof arr === "object" && !Array.isArray(arr)) {
    return [arr as AMApiAuction];
  }
  return [];
}

export async function fetchItems(
  auctionId: number,
  offset = 0,
  limit = 500
): Promise<AMApiItem[]> {
  const data = await amFetch<Record<string, unknown>>(
    `/amapi/admin/items?auction=${auctionId}&offset=${offset}&limit=${limit}`
  );
  const arr =
    data.items ?? data.data ?? data.results ?? data.item ?? data.lots;
  if (Array.isArray(arr)) return arr as AMApiItem[];
  if (arr && typeof arr === "object" && !Array.isArray(arr)) {
    return [arr as AMApiItem];
  }
  return [];
}

export async function fetchItem(
  auctionId: number,
  itemId: number
): Promise<AMApiItem> {
  return amFetch<AMApiItem>(
    `/amapi/admin/items/auction/${auctionId}/item/${itemId}`
  );
}

export async function fetchCategories(): Promise<
  Array<{ id: number; name: string }>
> {
  const data = await amFetch<{ categories?: Array<{ id: number; name: string }>; data?: Array<{ id: number; name: string }> }>(
    `/amapi/admin/auxiliarydata/item_categories`
  );
  return data.categories || data.data || [];
}

export async function checkToken(): Promise<boolean> {
  try {
    const token = await authenticate();
    const res = await fetch(`${baseUrl()}/amapi/auth/check`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
  } catch {
    return false;
  }
}
