/**
 * Auction filter logic: only include lots from auctions that are
 * - published
 * - bidding period has not yet started (start_time is in the future)
 */

export function isAuctionEligibleForGame(auction: {
  published?: boolean;
  start_time?: string | null;
}): boolean {
  if (!auction.published) return false;
  if (!auction.start_time) return false;
  return new Date(auction.start_time) > new Date();
}
