# 🗄️ Supabase Setup & Deployment Guide

This guide walks you through deploying the Slipstats schema to a live Supabase project when you are ready.

---

## 1. Create a Supabase Project
1. Log in to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Click **New project** and specify:
   * **Name**: `slipstats-prod` (or similar)
   * **Database Password**: Generate a secure password.
   * **Region**: Choose the region closest to your users (e.g. `eu-west-1` or `af-south-1` Cape Town).

---

## 2. Deploy the SQL Schema
1. Navigate to the **SQL Editor** tab in your Supabase project dashboard.
2. Open the file [`supabase/schema.sql`](file:///c:/Users/digit/OneDrive/Desktop/GITHUB/slipstats/supabase/schema.sql) in this repository.
3. Paste the complete SQL contents into the SQL Editor.
4. Click **Run**.
5. Verify that all 6 tables have been created:
   * `public.profiles`
   * `public.children`
   * `public.settlement_agreements`
   * `public.expenses`
   * `public.receipt_line_items`
   * `public.court_bundles`

---

## 3. Configure Storage Buckets
Slipstats stores receipt photos and compiled court bundles.
1. In the Supabase Dashboard, navigate to **Storage**.
2. Create two buckets:
   * **`receipts`**:
     * Access: **Private** (authenticated user access only)
     * Allowed MIME types: `image/png`, `image/jpeg`, `image/webp`, `application/pdf`
     * Max file size: `10MB`
   * **`court_bundles`**:
     * Access: **Private**
     * Allowed MIME types: `application/pdf`
     * Max file size: `25MB`
3. Add Storage RLS policies allowing users to upload and read only their own folders: `(storage.foldername(name))[1] = auth.uid()::text`.

---

## 4. Connect Next.js to Supabase
1. In the Supabase Dashboard, go to **Project Settings** ➔ **API**.
2. Copy your **Project URL** and **anon public key**.
3. In your local `slipstats` folder, update `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   NEXT_PUBLIC_DEFAULT_CURRENCY=ZAR
   ```
4. Restart your development server:
   ```bash
   npm run dev
   ```
5. Slipstats will automatically switch from local mock mode to live Supabase Postgres queries!
