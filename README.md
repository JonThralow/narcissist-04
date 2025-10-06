# Narcissism App — Vercel Blob Shares

A Vercel-ready, privacy-safe share service for narcissism test results. Three variants (Quick 10, Advanced 20, Precise 40). Public shares contain **no PII** and live in **Vercel Blob**.

## Tech
- Node 18+, TypeScript
- Express, `@vercel/node` (serverless handler), `@vercel/blob` (storage), `canvas` (OG images)

## Endpoints
- `POST /share` → returns `{ shareId, url }` and stores JSON at `shares/<id>.json`
- `GET /share/:id` → SSR HTML with OG/Twitter meta, client hydration from `/static/share-client.js`
- `GET /og/:id.png` → 1200×630 PNG visualizing TNI, ADM, RIV, VUL
- `DELETE /share/:id` → deletes the blob (revokes the link)
- `GET /healthz` → `{ ok: true }`

## Local Dev
```bash
npm i
npm run dev
# open http://localhost:3000
```
> For local Blob operations, ensure the Vercel Blob integration is enabled and env `BLOB_READ_WRITE_TOKEN` is available.

## Deploy on Vercel
1. Push to GitHub and import in Vercel.
2. In Vercel, enable **Storage → Blob** (adds `BLOB_READ_WRITE_TOKEN`).
3. Deploy. Static docs served from `/public`, API/SSR from `api/index.ts` entry.

## Curl Smoke Test

Create a sample share:
```bash
curl -s -X POST https://<your-deploy-domain>/share \
  -H 'content-type: application/json' \  -d '{
    "payload": {
      "_v": 1,
      "createdAt": "'"$(date -u +%Y-%m-%dT%H:%M:%SZ)"'",
      "expiresAt": "'"$(date -u -d "+30 days" +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || date -u -v+30d +%Y-%m-%dT%H:%M:%SZ)"'",
      "testId": "narcissism.v1",
      "variant": "quick",
      "count": 10,
      "labels": { "ADM":"Admiration","RIV":"Rivalry","VUL":"Vulnerability" },
      "scores": { "ADM": 3.4, "RIV": 2.9, "VUL": 2.6, "TNI": 3.0 },
      "bands":  { "ADM": "Elevated", "RIV": "Typical", "VUL": "Typical", "TNI": "Typical" }
    }
  }'
```

Open the returned `url` in a browser to see the SSR page, and check the OG image at `/og/<id>.png`.

Revoke the share:
```bash
curl -X DELETE https://<your-deploy-domain>/share/<id>
```

## Notes
- The server validates payloads and rejects anything with suspicious keys (userId, email, etc.).
- Expired shares return **410 Gone** for both `/share/:id` and `/og/:id.png`.
- OG images are generated with `node-canvas` in the serverless function.