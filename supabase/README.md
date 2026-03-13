# Supabase Setup

## 1. Tables

Tables are created automatically when you first load the Browse page or click Sync Now. The app uses `POSTGRES_URL` or `POSTGRES_URL_NON_POOLING` to run migrations.

## 2. Environment variables (Vercel / local)

Set these in Vercel (Settings → Environment Variables) or `.env.local`:

| Variable | Required | Notes |
|----------|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Project URL (browser) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Anon key for client auth |
| `SUPABASE_URL` | Yes | Project URL (server-side: sync, admin) |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Service role key for sync and admin operations |
| `POSTGRES_URL` or `POSTGRES_URL_NON_POOLING` | Yes | From Supabase Settings → Database (for auto table creation) |

## 3. Sync

Click **Sync Now** on the Browse page to pull auction data from AuctionMethod.
