import { Router, Request, Response } from 'express';
import crypto from 'node:crypto';
import { createCanvas, registerFont } from 'canvas';
import { put, get, head, del } from './share.js';

// Optional font registration (will fallback if not present)
try {
  registerFont('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', { family: 'DejaVu Sans' });
} catch {}

type SharePayload = {
  _v: 1;
  createdAt: string;
  expiresAt: string;
  testId: 'narcissism.v1';
  variant: 'quick' | 'advanced' | 'precise';
  count: 10 | 20 | 40;
  labels: { ADM: string; RIV: string; VUL: string };
  scores: { ADM: number; RIV: number; VUL: number; TNI: number };
  bands:  { ADM: string; RIV: string; VUL: string; TNI: string };
};

const ALLOWED_KEYS = ['_v','createdAt','expiresAt','testId','variant','count','labels','scores','bands'];

function base64url(bytes: Buffer) {
  return bytes.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function makeId() {
  return base64url(crypto.randomBytes(12));
}

function isSafePayload(p: any): p is SharePayload {
  if (!p || typeof p !== 'object') return false;
  for (const k of Object.keys(p)) {
    if (!ALLOWED_KEYS.includes(k)) return false;
  }
  if (p._v !== 1) return false;
  if (p.testId !== 'narcissism.v1') return false;
  if (!['quick','advanced','precise'].includes(p.variant)) return false;
  if (![10,20,40].includes(p.count)) return false;
  if (!p.labels || !p.scores || !p.bands) return false;
  // ensure no nested PII-looking keys
  const forbidden = ['user','userId','email','name','session','demographics','age','gender'];
  const json = JSON.stringify(p).toLowerCase();
  for (const f of forbidden) if (json.includes(`"${f}"`)) return false;
  // basic type checks
  const s = p.scores; const b = p.bands;
  return ['ADM','RIV','VUL','TNI'].every(k => typeof s[k] === 'number' && typeof b[k] === 'string');
}

async function fetchPayloadOrGone(id: string): Promise<SharePayload> {
  const body = await get(id);
  if (!body) {
    const err: any = new Error('Share not found');
    err.status = 410;
    throw err;
  }
  let payload: SharePayload;
  try { payload = JSON.parse(body); } catch {
    const err: any = new Error('Corrupt payload');
    err.status = 410;
    throw err;
  }
  if (!isSafePayload(payload)) {
    const err: any = new Error('Invalid payload');
    err.status = 410;
    throw err;
  }
  // expiry
  const now = Date.now();
  const exp = Date.parse(payload.expiresAt);
  if (isFinite(exp) && now > exp) {
    const err: any = new Error('Share expired');
    err.status = 410;
    throw err;
  }
  return payload;
}

const router = Router();

router.post('/share', async (req: Request, res: Response) => {
  try {
    const payload = req.body?.payload;
    if (!isSafePayload(payload)) {
      return res.status(400).json({ error: 'Invalid payload' });
    }
    const id = makeId();
    const { url } = await put(id, JSON.stringify(payload));
    const shareUrl = `${req.protocol}://${req.get('host')}/share/${id}`;
    res.json({ shareId: id, url: shareUrl, blobUrl: url });
  } catch (e: any) {
    console.error('[POST /share] error', e);
    res.status(500).json({ error: 'Failed to create share' });
  }
});

router.delete('/share/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const exists = await head(id);
    if (!exists) return res.status(404).json({ ok: false, error: 'Not found' });
    await del(id);
    res.json({ ok: true, revoked: id });
  } catch (e: any) {
    console.error('[DELETE /share] error', e);
    res.status(500).json({ error: 'Failed to revoke share' });
  }
});

router.get('/share/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const payload = await fetchPayloadOrGone(id);
    const title = `Narcissism • ${payload.variant} (${payload.count})`;
    const desc = `TNI ${payload.scores.TNI.toFixed(2)} (${payload.bands.TNI}) • ${payload.labels.ADM} ${payload.scores.ADM.toFixed(2)}, ${payload.labels.RIV} ${payload.scores.RIV.toFixed(2)}, ${payload.labels.VUL} ${payload.scores.VUL.toFixed(2)}`;
    const ogUrl = `${req.protocol}://${req.get('host')}/og/${id}.png`;
    const canonical = `${req.protocol}://${req.get('host')}/share/${id}`;

    const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <link rel="canonical" href="${canonical}" />
  <meta name="description" content="${escapeHtml(desc)}" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(desc)}" />
  <meta property="og:image" content="${ogUrl}" />
  <meta property="og:type" content="article" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(desc)}" />
  <meta name="twitter:image" content="${ogUrl}" />
</head>
<body>
  <div id="share-root">Loading…</div>
  <script id="share-data" type="application/json">${escapeScript(JSON.stringify(payload))}</script>
  <script src="/static/share-client.js" defer></script>
</body>
</html>`;
    res.setHeader('content-type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (e: any) {
    const status = e?.status || 410;
    res.status(status).send(`<h1>410 Gone</h1><p>${e?.message || 'Share is unavailable.'}</p>`);
  }
});

router.get('/og/:id.png', async (req: Request, res: Response) => {
  const id = req.params.id.replace(/\.png$/i, '');
  try {
    const payload = await fetchPayloadOrGone(id);
    const width = 1200, height = 630;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Background
    gradientBG(ctx, width, height);

    // Title
    ctx.fillStyle = '#e8ecf1';
    ctx.font = 'bold 64px "DejaVu Sans", Arial, sans-serif';
    ctx.fillText('Narcissism', 60, 110);
    ctx.font = 'bold 32px "DejaVu Sans", Arial, sans-serif';
    ctx.fillText(`Variant: ${payload.variant} (${payload.count})`, 60, 160);

    // Scores
    const lines = [
      ['TNI', payload.scores.TNI, payload.bands.TNI],
      ['ADM', payload.scores.ADM, payload.bands.ADM],
      ['RIV', payload.scores.RIV, payload.bands.RIV],
      ['VUL', payload.scores.VUL, payload.bands.VUL]
    ];

    const x0 = 60, xBar = 260, barW = 800, barH = 28;
    let y = 240;
    for (const [label, val, band] of lines) {
      // Label
      ctx.font = '600 30px "DejaVu Sans", Arial, sans-serif';
      ctx.fillStyle = '#cbe1ff';
      ctx.fillText(`${label}`, x0, y);
      // Band
      ctx.font = '500 24px "DejaVu Sans", Arial, sans-serif';
      ctx.fillStyle = '#9bb3c9';
      ctx.fillText(`(${band})`, x0 + 80, y);
      // Bar track
      const yTop = y + 12;
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      roundRect(ctx, xBar, yTop, barW, barH, 14, true, false);
      // Value bar (map 1–5 onto width)
      const clamped = Math.max(1, Math.min(5, Number(val)));
      const frac = (clamped - 1) / 4; // 0..1
      ctx.fillStyle = '#7cc4ff';
      roundRect(ctx, xBar, yTop, Math.max(6, barW * frac), barH, 14, true, false);
      // Numeric
      ctx.fillStyle = '#e8ecf1';
      ctx.font = '600 26px "DejaVu Sans", Arial, sans-serif';
      ctx.fillText(`${Number(val).toFixed(2)}`, xBar + barW + 20, y + 36);
      y += 90;
    }

    // Footer
    ctx.fillStyle = '#9bb3c9';
    ctx.font = '500 22px "DejaVu Sans", Arial, sans-serif';
    ctx.fillText('Educational use only — not a clinical tool • No PII in this share', 60, height - 40);

    const buf = canvas.toBuffer('image/png');
    res.setHeader('content-type', 'image/png');
    res.send(buf);
  } catch (e: any) {
    res.status(410).send('gone');
  }
});

// helpers
function gradientBG(ctx: any, w: number, h: number) {
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, '#0f1530');
  g.addColorStop(1, '#0b1020');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  // subtle glow
  ctx.fillStyle = 'rgba(124,196,255,0.10)';
  ctx.beginPath();
  ctx.arc(w - 200, 200, 180, 0, Math.PI * 2);
  ctx.fill();
}

function roundRect(ctx: any, x: number, y: number, w: number, h: number, r: number, fill: boolean, stroke: boolean) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"]/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c] as string));
}
function escapeScript(s: string) {
  return s.replace(/<\//g, '<\\/'); // prevent </script> breakouts
}

export default router;