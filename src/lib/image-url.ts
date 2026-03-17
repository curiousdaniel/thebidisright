/**
 * Returns the proxy URL for an image (use when direct loading fails).
 */
export function getItemImageProxyUrl(imageUrl: string | null | undefined): string | null {
  if (!imageUrl || typeof imageUrl !== "string") return null;
  const trimmed = imageUrl.trim();
  if (!trimmed) return null;
  return `/api/image?url=${encodeURIComponent(trimmed)}`;
}

/**
 * Returns the best URL to try first for an auction item image.
 * Full URLs from the API: try direct first (CDNs often allow embedding).
 * Path-based URLs: use proxy.
 */
export function getItemImageUrl(imageUrl: string | null | undefined): string | null {
  if (!imageUrl || typeof imageUrl !== "string") return null;
  const trimmed = imageUrl.trim();
  if (!trimmed) return null;
  // Full URLs: try direct first (bypass proxy)
  if (trimmed.startsWith("http")) return trimmed;
  // Path-based: use proxy
  return getItemImageProxyUrl(trimmed);
}
