# Our Year — Anniversary Gift Site

A romantic scrapbook website with shared cloud memories (Supabase) and free Vercel hosting.

## Customize

Edit `src/config.ts` for names, copy, and the anniversary gate date (`GATE.dateDisplay`).

## 1. Create free Supabase project

1. Sign up at [supabase.com](https://supabase.com) → **New project**
2. Open **SQL Editor** → paste and run everything in `supabase/schema.sql`
3. Open **Project Settings → API** and copy:
   - Project URL
   - `anon` `public` key

## 2. Local env

```bash
cp .env.example .env
```

Put your URL and anon key in `.env`:

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

## 3. Run locally

```bash
npm install
npm run dev
```

## 4. Host free on Vercel

1. Push this repo to GitHub
2. Import the project on [vercel.com](https://vercel.com)
3. Add the same env vars in Vercel → **Settings → Environment Variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy

After that, memories and photos are shared — you and your girlfriend see the same album on any device (after entering the anniversary date gate).

## Notes

- Free Supabase storage is limited (~1GB). Compress large phone photos if you upload a lot.
- The anniversary gate is frontend-only. Anyone with the live URL + date can open and edit the scrapbook — that’s intentional for a private couple gift link.
- Old browser-only (IndexedDB) memories are not migrated automatically; re-upload once into the cloud album.
