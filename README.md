# GDG SKNCOE Website

Official website of Google Developer Group — SKNCOE.

**Production:** https://gdg-website-gilt.vercel.app

## Repo

https://github.com/Google-developers-Group-SKNCOE/GDG-WEBSITE

Active development branch: `harsheet` (Vercel auto-deploys from it when Git is connected).

## Stack

- React 18 + Vite + Tailwind CSS (brutalist theme)
- Supabase (content database, email OTP edge functions)
- Brevo (transactional email — OTP + campaigns)
- ImgBB (image hosting)

## Local setup

```bash
npm install
cp .env.example .env   # then fill in real values
npm run dev
```

### Required env vars (`.env`)

| Variable | Purpose |
| --- | --- |
| `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` | Supabase project |
| `VITE_BREVO_API_KEY` / `VITE_SENDER_EMAIL` | Email sending (also set as Supabase Edge Function secrets) |
| `VITE_IMGBB_API_KEY` | Image uploads |
| `VITE_ADMIN_EMAIL` / `VITE_ADMIN_PASSWORD` | `/admin` panel login |

See `.env.example` for the template. `.env` is gitignored — never commit it.

## Admin panel

Visit `/admin` and sign in with the credentials configured in `.env`.
Content (hero, events, projects, team, sponsors, FAQs, navigation, resources, comments moderation, email campaigns) is managed there and stored in Supabase.
