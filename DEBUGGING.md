# Debugging: No Auction Items Showing

If you're logged in as a player but don't see any lots on the Browse page, follow these steps.

## 1. Sync Now (Easiest)

On the **Browse** page, when no lots are shown, click the **"Sync Now"** button. This fetches auction data from AuctionMethod and loads it into the database. No command line needed.

You can also use the **Sync Now** button on the Operator Dashboard at `/dashboard`.

## 2. Call the Debug Endpoints

**Database state:** `https://your-app.vercel.app/api/debug`

Returns:
- All auctions in the database with `published`, `start_time`, and item counts
- Which auctions pass the filter (published + start_time in future)
- Sample API field names from `raw_data` (to spot mismatches)

**Raw AuctionMethod API:** `https://your-app.vercel.app/api/debug/am`

Returns:
- Raw auth + auctions API response. Use when sync returns 0 auctions — check `topLevelKeys`, `firstAuctionKeys`, and `auctionsResponse` to see the actual API format.

**Image diagnostics:** Check `sampleItems` and `env` in `/api/debug`. If `image_url` is "null" for items, ensure `AM_DOMAIN` is set in Vercel. If images use a different base URL, set `AM_IMAGE_BASE` (e.g. `https://your-auction-site.com`). After adding env vars, run Sync Now again.

## 2. Common Issues

### No auctions at all (`allAuctions` is empty)
- **Sync hasn't run.** The sync job runs via Vercel Cron every 15 min, or you can trigger it manually:
  ```bash
  curl -X POST "https://your-app.vercel.app/api/sync" \
    -H "Authorization: Bearer YOUR_CRON_SECRET"
  ```
- **AuctionMethod API credentials missing.** In Vercel, set:
  - `AM_DOMAIN` = your auction subdomain only, e.g. `dpwapi.auctionmethod.com` (no `https://`)
  - `AM_EMAIL` = your AuctionMethod API user email
  - `AM_PASSWORD` = your AuctionMethod API user password
- **Sync is failing.** Check Vercel logs for the `/api/sync` cron run.

### Auctions exist but `eligibleAuctionsCount` is 0
- **`start_time` is null.** The AuctionMethod API may use a different field (`start_date`, `sale_date`, etc.). The sync now tries these fallbacks. Check `sampleRawDataKeys` in the debug response to see the actual API field names.
- **`start_time` is in the past.** The auction's start time must be **in the future**. Compare `start_time` to `serverTime` in the debug output.
- **`published` is false.** The sync now also treats `status === "published"` as published. Check the `published` value in the debug output.

### Auctions are eligible but no items
- **Items have `status: "closed"`.** The browse page only shows items with `status = "open"`. If the sync marked them closed (e.g. `closes_at` already passed), they won't appear.
- **Items not synced.** The sync fetches items per auction. If the sync failed partway through, some auctions may have no items.

## 3. Manual Sync Trigger

To run the sync manually (e.g. after fixing env vars):

```bash
curl -X POST "https://your-app.vercel.app/api/sync" \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

Replace `YOUR_CRON_SECRET` with the value of `CRON_SECRET` in your Vercel environment.

## 4. Remove Debug Endpoint

The `/api/debug` route exposes database structure. Remove or restrict it before going to production:

```bash
rm src/app/api/debug/route.ts
```
