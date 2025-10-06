import express, { Request, Response, NextFunction } from 'express';
import path from 'node:path';
import routes from './routes.js';

const app = express();
app.set('trust proxy', true);
app.use(express.json({ limit: '1mb' }));

// Health
app.get('/healthz', (_req: Request, res: Response) => res.json({ ok: true }));

// Static (only used in local dev; Vercel will serve /public as static automatically)
app.use('/static', express.static(path.join(process.cwd(), 'public', 'static')));

// Mount API/SSR routes
app.use(routes);

// Root docs
app.get('/', (_req: Request, res: Response) => {
  res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[error]', err);
  res.status(err?.status || 500).json({ error: err?.message || 'Internal Server Error' });
});

export default app;