# Varun × Aashna — Valentine Site (chic + password protected)

## Run locally
```bash
npm i
npm run dev
```

## Deploy on Vercel
- Push to GitHub → Import into Vercel
- Set an env var in Vercel:
  - `SITE_PASSWORD` (example: `14022026`)
- If you *don't* set `SITE_PASSWORD`, the site will still work, but the login will accept only `14022026`.

## How password protection works
- `/login` posts password to `/api/auth`
- If correct, server sets an HttpOnly cookie
- `middleware.js` blocks all routes except login + api + assets unless cookie exists
