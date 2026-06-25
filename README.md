# Francine Realty — Resident Assistant

A production-ready AI tenant-support chatbot for **Francine Realty**, a NYC
residential property management company. Residents can ask about rent,
maintenance, leases, and how to reach the office. Maintenance requests are
triaged (life-safety → 911, urgent → office line, routine → logged).

- **Frontend:** a single static `index.html` (vanilla HTML/CSS/JS — no build
  step, no framework).
- **Backend:** one serverless function that proxies to the Google Gemini API.
  The Gemini API key lives **only** in a server-side environment variable and
  never reaches the browser.

```
index.html                  ← complete frontend (chat UI)
api/chat.js                 ← Vercel serverless proxy
netlify/functions/chat.js   ← Netlify equivalent
netlify.toml                ← Netlify build + /api/chat redirect
.env.example                ← GEMINI_API_KEY=
```

## 1. Get a Gemini API key

1. Go to <https://aistudio.google.com/apikey>.
2. Sign in and click **Create API key**.
3. Copy the key — you'll set it as `GEMINI_API_KEY`.

> The key is used **only** server-side. It is never embedded in `index.html`,
> never sent to the browser, and never included in any API response.

## 2. Vercel or Netlify — which to use?

Both are included and behave identically; pick one.

- **Vercel** uses `api/chat.js`. The endpoint `/api/chat` maps to that file
  automatically — no extra config.
- **Netlify** uses `netlify/functions/chat.js`. `netlify.toml` redirects
  `/api/chat` → `/.netlify/functions/chat` so the frontend code is unchanged.

The frontend always calls its own `/api/chat`, so you don't edit any code when
switching providers.

## 3. Run locally

Create a `.env` (or `.env.local`) from the example and add your key:

```bash
cp .env.example .env
# edit .env and set GEMINI_API_KEY=your_key_here
```

### With Vercel (recommended)

```bash
npm i -g vercel
vercel dev
```

Open the printed URL (typically <http://localhost:3000>). `vercel dev` loads
`.env` automatically and serves `index.html` plus the `/api/chat` function.

### With Netlify

```bash
npm i -g netlify-cli
netlify dev
```

Open the printed URL (typically <http://localhost:8888>). `netlify dev` loads
`.env` and applies the `/api/chat` redirect from `netlify.toml`.

## 4. Deploy

### Deploy to Vercel

```bash
vercel            # first deploy / link the project
vercel --prod     # production deploy
```

Set the key once (or add it in **Project → Settings → Environment Variables**):

```bash
vercel env add GEMINI_API_KEY
```

### Deploy to Netlify

```bash
netlify deploy            # draft deploy
netlify deploy --prod     # production deploy
```

Set the key (or add it in **Site settings → Environment variables**):

```bash
netlify env:set GEMINI_API_KEY your_key_here
```

## Runtime & region (Vercel)

`vercel.json` pins the function to the **`iad1`** region (US East — lowest
latency to NYC residents and to Google's API) and allows up to a 30-second
execution window. The Node version is pinned to **20.x** via `engines` in
`package.json`. Edit `regions` in `vercel.json` to deploy elsewhere.

## Configuration notes

- **Model:** the function uses `gemini-2.5-flash`. To switch, change the
  `MODEL` constant at the top of `api/chat.js` and
  `netlify/functions/chat.js` (e.g. to `gemini-3.5-flash`).
- **Abuse protection:** requests with more than 30 messages, or any single
  message over 2000 characters, are rejected with a `400`.
- **Generation:** `temperature: 0.4`, `maxOutputTokens: 1000`.

## Security

- The API key is read from `process.env.GEMINI_API_KEY` on the server only.
- Upstream Google errors are logged server-side but never forwarded to the
  client — the browser only sees a generic, friendly error message.
- No conversation data is persisted; history lives in browser memory for the
  session only (no `localStorage`).
