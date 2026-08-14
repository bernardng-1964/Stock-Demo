import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { handleInsightRequest, validateTransaction } from './api/insight.js';
import { getAlpacaStockSnapshots, getLiveMarketNews, getAlpacaMarketIndices } from './api/alpaca.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// API: Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API: Live Market Quotes & Snapshots
app.get('/api/market/stocks', async (req: Request, res: Response) => {
  try {
    const stocks = await getAlpacaStockSnapshots();
    res.json({ success: true, count: stocks.length, stocks });
  } catch (error: any) {
    console.error('Error in /api/market/stocks:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Live Major Market Indices (S&P 500, NASDAQ, DOW JONES, VIX)
app.get('/api/market/indices', async (req: Request, res: Response) => {
  try {
    const indices = await getAlpacaMarketIndices();
    res.json({ success: true, count: indices.length, indices });
  } catch (error: any) {
    console.error('Error in /api/market/indices:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Live Google News & Financial Disclosures
app.get('/api/market/news', async (req: Request, res: Response) => {
  try {
    const news = await getLiveMarketNews();
    res.json({ success: true, count: news.length, news });
  } catch (error: any) {
    console.error('Error in /api/market/news:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Market trend & stock insight endpoint (Gemini powered, secure server-side)
app.post('/api/insight', handleInsightRequest);

// API: Legacy alias for market narrative
app.post('/api/market-narrative', handleInsightRequest);

// API: Server-side Transaction Execution & Validation
app.post('/api/transactions/validate', (req: Request, res: Response) => {
  const result = validateTransaction(req.body);
  if (!result.isValid) {
    return res.status(400).json({ success: false, errors: result.errors });
  }
  return res.json({ success: true, transaction: result.sanitized });
});

// Vite middleware or production static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Stock Analytics Dashboard server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

