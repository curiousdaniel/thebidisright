# Debugging: No Auction Items Showing

If you're logged in as a player but don't see any lots on the Browse page, follow these steps.

## 1. Call the Debug Endpoint

Visit: **`https://your-app.vercel.app/api/debug`** (or `http://localhost:3000/api/debug` locally)

This returns:
- All auctions in the database with `published`, `start_time`, and item counts
- Which auctions pass the filter (published + start_time in future)
- Sample API field names from `raw_data` (to spot mismatches)

## 2. Common Issues

### No auctions at all (`allAuctions` is empty)
- **Sync hasn't run.** The sync job runs via Vercel Cron every 15 min, or you can trigger it manually:
  ```bash
  curl -X POST "https://your-app.vercel.app/api/sync" \
    -H "Authorization: Bearer YOUR_CRON_SECRET"
  ```
- **AuctionMethod API credentials missing.** Ensure `AM_DOMAIN`, `AM_EMAIL`, `AM_PASSWORD` are set in Vercel.
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
