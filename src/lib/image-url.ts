/**
 * Returns the URL to use for displaying an auction item image.
 * Uses our proxy to avoid CORS/referrer issues with AuctionMethod images.
 */
export function getItemImageUrl(imageUrl: string | null | undefined): string | null {
  if (!imageUrl || typeof imageUrl !== "string") return null;
  const trimmed = imageUrl.trim();
  if (!trimmed) return null;
  // Use our proxy for all external images (avoids CORS, referrer blocking)
  return `/api/image?url=${encodeURIComponent(trimmed)}`;
}
