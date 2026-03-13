# Supabase Setup

## 1. Create tables

The app does **not** create tables automatically. Run the schema once in Supabase:

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your project
2. Go to **SQL Editor**
3. Copy the contents of `run-in-dashboard.sql`
4. Paste and click **Run**

## 2. Environment variables (Vercel / local)

Set these in Vercel (Settings → Environment Variables) or `.env.local`:

| Variable | Required | Notes |
|----------|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Project URL (e.g. `https://xxx.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Anon/public key for client auth |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Service role key for sync and admin operations |

`SUPABASE_URL` can be used as a fallback for `NEXT_PUBLIC_SUPABASE_URL` in server-side code.

## 3. After tables exist

Run **Sync Now** on the Browse page to pull auction data from AuctionMethod.
