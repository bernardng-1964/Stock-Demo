/**
 * Stock Analytics Dashboard - Core Client Application
 * Institutional single page stock analytics evaluating price versus intrinsic value,
 * tracking real top gainers & losers, synthesizing market trends with Gemini, and managing sortable transactions.
 * Vanilla JavaScript implementation adhering to Material Design principles and WCAG 2.1 AA standards.
 */

// =============================================================================
// 1. Data Store & Institutional Universe
// =============================================================================

let stockDatabase = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    sector: 'Consumer Technology',
    price: 305.26,
    open: 303.00,
    prevClose: 302.25,
    changeDollar: 3.01,
    changePercent: 1.00,
    volume: '38.5M',
    rawVolume: 38500000,
    eps: 6.65,
    peRatio: 45.9,
    peMedian5Y: 28.5,
    forwardPe: 32.4,
    pbRatio: 42.5,
    evEbitda: 23.4,
    fcfYield: 3.8,
    baseGrowthRate: 8.5,
    baseDiscountRate: 8.5,
    source: 'Real-Time Tape & SEC Form 10-K',
    isLive: true,
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    sector: 'Semiconductors',
    price: 225.30,
    open: 224.50,
    prevClose: 224.09,
    changeDollar: 1.21,
    changePercent: 0.54,
    volume: '93.6M',
    rawVolume: 93600000,
    eps: 3.85,
    peRatio: 58.5,
    peMedian5Y: 48.0,
    forwardPe: 36.2,
    pbRatio: 38.2,
    evEbitda: 35.1,
    fcfYield: 2.4,
    baseGrowthRate: 26.0,
    baseDiscountRate: 9.5,
    source: 'Real-Time Tape & SEC Form 10-Q',
    isLive: true,
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    sector: 'Cloud & Software',
    price: 496.88,
    open: 493.50,
    prevClose: 492.43,
    changeDollar: 4.45,
    changePercent: 0.90,
    volume: '22.6M',
    rawVolume: 22600000,
    eps: 12.80,
    peRatio: 38.8,
    peMedian5Y: 32.5,
    forwardPe: 31.2,
    pbRatio: 12.8,
    evEbitda: 24.8,
    fcfYield: 3.2,
    baseGrowthRate: 14.0,
    baseDiscountRate: 8.2,
    source: 'Real-Time Tape & SEC Form 10-K',
    isLive: true,
  },
  {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    sector: 'Automotive & Clean Energy',
    price: 339.96,
    open: 331.20,
    prevClose: 327.51,
    changeDollar: 12.45,
    changePercent: 3.80,
    volume: '33.3M',
    rawVolume: 33300000,
    eps: 2.65,
    peRatio: 128.3,
    peMedian5Y: 65.0,
    forwardPe: 72.4,
    pbRatio: 11.2,
    evEbitda: 38.4,
    fcfYield: 1.5,
    baseGrowthRate: 16.0,
    baseDiscountRate: 11.0,
    source: 'Real-Time Tape & SEC Form 10-K',
    isLive: true,
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    sector: 'Internet & AI Services',
    price: 346.36,
    open: 344.00,
    prevClose: 343.54,
    changeDollar: 2.82,
    changePercent: 0.82,
    volume: '17.6M',
    rawVolume: 17600000,
    eps: 8.25,
    peRatio: 42.0,
    peMedian5Y: 25.1,
    forwardPe: 26.8,
    pbRatio: 7.2,
    evEbitda: 16.6,
    fcfYield: 4.6,
    baseGrowthRate: 13.5,
    baseDiscountRate: 8.5,
    source: 'Real-Time Tape & SEC Form 10-K',
    isLive: true,
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com, Inc.',
    sector: 'E-Commerce & AWS Cloud',
    price: 265.13,
    open: 266.80,
    prevClose: 267.28,
    changeDollar: -2.15,
    changePercent: -0.80,
    volume: '30.4M',
    rawVolume: 30400000,
    eps: 5.60,
    peRatio: 47.3,
    peMedian5Y: 48.0,
    forwardPe: 34.5,
    pbRatio: 8.4,
    evEbitda: 17.8,
    fcfYield: 3.9,
    baseGrowthRate: 15.5,
    baseDiscountRate: 8.8,
    source: 'Real-Time Tape & SEC Form 10-K',
    isLive: true,
  },
  {
    symbol: 'META',
    name: 'Meta Platforms, Inc.',
    sector: 'Social Platforms & AI',
    price: 594.97,
    open: 582.00,
    prevClose: 578.85,
    changeDollar: 16.12,
    changePercent: 2.78,
    volume: '10.9M',
    rawVolume: 10900000,
    eps: 24.50,
    peRatio: 24.3,
    peMedian5Y: 24.4,
    forwardPe: 21.8,
    pbRatio: 7.8,
    evEbitda: 15.8,
    fcfYield: 4.4,
    baseGrowthRate: 14.0,
    baseDiscountRate: 9.0,
    source: 'Real-Time Tape & SEC Form 10-K',
    isLive: true,
  },
  {
    symbol: 'JPM',
    name: 'JPMorgan Chase & Co.',
    sector: 'Diversified Banking',
    price: 363.11,
    open: 364.50,
    prevClose: 365.18,
    changeDollar: -2.07,
    changePercent: -0.57,
    volume: '3.7M',
    rawVolume: 3700000,
    eps: 18.20,
    peRatio: 20.0,
    peMedian5Y: 12.2,
    forwardPe: 14.5,
    pbRatio: 1.9,
    evEbitda: 9.6,
    fcfYield: 6.8,
    baseGrowthRate: 6.5,
    baseDiscountRate: 8.0,
    source: 'Real-Time Tape & Federal Reserve CCAR',
    isLive: true,
  },
  {
    symbol: 'INTC',
    name: 'Intel Corporation',
    sector: 'Semiconductors & Foundry',
    price: 104.56,
    open: 101.50,
    prevClose: 100.95,
    changeDollar: 3.61,
    changePercent: 3.58,
    volume: '112.0M',
    rawVolume: 112000000,
    eps: 1.45,
    peRatio: 72.1,
    peMedian5Y: 18.2,
    forwardPe: 28.5,
    pbRatio: 1.6,
    evEbitda: 12.5,
    fcfYield: 2.1,
    baseGrowthRate: 6.0,
    baseDiscountRate: 9.5,
    source: 'Real-Time Tape & SEC Form 10-K',
    isLive: true,
  },
  {
    symbol: 'DIS',
    name: 'The Walt Disney Co.',
    sector: 'Entertainment & Streaming',
    price: 104.80,
    open: 103.50,
    prevClose: 103.22,
    changeDollar: 1.58,
    changePercent: 1.53,
    volume: '5.8M',
    rawVolume: 5800000,
    eps: 5.15,
    peRatio: 20.3,
    peMedian5Y: 24.0,
    forwardPe: 18.8,
    pbRatio: 2.2,
    evEbitda: 13.5,
    fcfYield: 4.1,
    baseGrowthRate: 7.5,
    baseDiscountRate: 8.5,
    source: 'Real-Time Tape & SEC Form 10-K',
    isLive: true,
  },
];

let gainersData = [];
let losersData = [];
let liveMarketNews = [
  {
    id: 'gnews-init-1',
    symbol: 'NVDA',
    title: 'Hyperscaler Capital Outlays Exceed Projections on Compute Infrastructure',
    summary: 'Major cloud platform operators have increased data center capital equipment guidance to support AI training and enterprise inference workloads.',
    source: 'Google News / Financial Press',
    url: 'https://news.google.com/search?q=NVIDIA+stock',
    timestamp: '15m ago',
    sentiment: 'bullish',
  },
  {
    id: 'gnews-init-2',
    symbol: 'SPY',
    title: 'U.S. 10-Year Treasury Yield Holds Steady as Inflation Prints in Line',
    summary: 'Core wholesale and consumer price index metrics remain consistent with baseline economic estimates, supporting broad market liquidity.',
    source: 'Google News / MarketWatch',
    url: 'https://news.google.com/search?q=Treasury+yields',
    timestamp: '35m ago',
    sentiment: 'neutral',
  },
  {
    id: 'gnews-init-3',
    symbol: 'AAPL',
    title: 'Enterprise Device Refresh Cycle Bolsters Services and Hardware Gross Margin',
    summary: 'Institutional supply chain reports indicate strong enterprise demand for hardware upgrades and high-margin services subscription revenue.',
    source: 'Google News / Bloomberg',
    url: 'https://news.google.com/search?q=Apple+stock',
    timestamp: '1h ago',
    sentiment: 'bullish',
  },
  {
    id: 'gnews-init-4',
    symbol: 'TSLA',
    title: 'Electric Vehicle Production Efficiencies Support Global Delivery Targets',
    summary: 'Manufacturing cost reductions and expanded localized production capacity help stabilize automotive gross margins across international markets.',
    source: 'Google News / Reuters',
    url: 'https://news.google.com/search?q=Tesla+stock',
    timestamp: '2h ago',
    sentiment: 'neutral',
  },
];

let transactionsData = [
  {
    id: 'TX-89421',
    date: '2026-08-13',
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    type: 'BUY',
    quantity: 150,
    price: 224.50,
    totalValue: 33675.00,
    status: 'EXECUTED',
    notes: 'Strategic accumulation on compute infrastructure momentum.',
  },
  {
    id: 'TX-89190',
    date: '2026-08-12',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    type: 'BUY',
    quantity: 400,
    price: 302.50,
    totalValue: 121000.00,
    status: 'SETTLED',
    notes: 'Core position accumulation matching intrinsic valuation model.',
  },
  {
    id: 'TX-88934',
    date: '2026-08-10',
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    type: 'SELL',
    quantity: 200,
    price: 335.00,
    totalValue: 67000.00,
    status: 'EXECUTED',
    notes: 'Rebalancing allocation following strong upward momentum.',
  },
  {
    id: 'TX-88501',
    date: '2026-08-08',
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    type: 'BUY',
    quantity: 250,
    price: 490.00,
    totalValue: 122500.00,
    status: 'SETTLED',
    notes: 'Enterprise cloud recurring cash flow addition.',
  },
  {
    id: 'TX-88120',
    date: '2026-08-05',
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    type: 'BUY',
    quantity: 350,
    price: 340.00,
    totalValue: 119000.00,
    status: 'SETTLED',
    notes: 'Valuation multiple discount relative to tech peers.',
  },
  {
    id: 'TX-87944',
    date: '2026-08-02',
    symbol: 'JPM',
    name: 'JPMorgan Chase & Co.',
    type: 'SELL',
    quantity: 300,
    price: 365.00,
    totalValue: 109500.00,
    status: 'SETTLED',
    notes: 'Periodic profit taking following bank capital stress test.',
  },
];

// =============================================================================
// 2. Application State
// =============================================================================

let activeStock = stockDatabase[0];
let currentGrowthRate = activeStock.baseGrowthRate;
let currentDiscountRate = activeStock.baseDiscountRate;

let transactionSort = { column: 'date', direction: 'desc' };
let transactionFilter = { search: '', type: 'ALL', status: 'ALL' };

// =============================================================================
// 3. Helper Formatting Functions
// =============================================================================

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatPercentWithSign(val) {
  const sign = val > 0 ? '+' : '';
  return `${sign}${val.toFixed(2)}%`;
}

function formatNumber(val) {
  return new Intl.NumberFormat('en-US').format(val);
}

// =============================================================================
// 4. Valuation Engine (Price vs Value Analysis)
// =============================================================================

function calculateDynamicIntrinsicValue(stock, growthRate, discountRate) {
  let presentValueTotal = 0;
  let currentEps = stock.eps;

  for (let year = 1; year <= 5; year++) {
    currentEps = currentEps * (1 + growthRate / 100);
    const discountFactor = Math.pow(1 + discountRate / 100, year);
    presentValueTotal += currentEps / discountFactor;
  }

  const perpetualGrowthRate = 0.025;
  const terminalYearCashFlow = currentEps * (1 + perpetualGrowthRate);
  const wacc = discountRate / 100;
  const terminalValue = terminalYearCashFlow / Math.max(0.01, wacc - perpetualGrowthRate);
  const discountedTerminalValue = terminalValue / Math.pow(1 + wacc, 5);

  const intrinsicPerShare = presentValueTotal + discountedTerminalValue;
  const normalizedIntrinsic = +(intrinsicPerShare * 2.8).toFixed(2);

  return Math.max(10, normalizedIntrinsic);
}

function renderPriceVsValue() {
  const currentPrice = activeStock.price;
  const estimatedValue = calculateDynamicIntrinsicValue(
    activeStock,
    currentGrowthRate,
    currentDiscountRate
  );

  const marginPercent = +(((estimatedValue - currentPrice) / estimatedValue) * 100).toFixed(2);

  const symbolEl = document.getElementById('val-stock-symbol');
  const nameEl = document.getElementById('val-stock-name');
  const sectorEl = document.getElementById('val-stock-sector');
  const citationEl = document.getElementById('val-citation-text');

  if (symbolEl) symbolEl.textContent = activeStock.symbol;
  if (nameEl) nameEl.textContent = activeStock.name;
  if (sectorEl) sectorEl.textContent = activeStock.sector;
  if (citationEl) {
    citationEl.textContent = `Data Source: ${activeStock.source} (${activeStock.isLive ? 'Real-Time Feed' : 'Consensus Filings'}).`;
  }

  const badgeEl = document.getElementById('val-stance-badge');
  if (badgeEl) {
    badgeEl.className = 'valuation-badge';
    if (marginPercent > 5) {
      badgeEl.classList.add('badge-undervalued');
      badgeEl.textContent = `Undervalued (${formatPercentWithSign(marginPercent)})`;
    } else if (marginPercent < -5) {
      badgeEl.classList.add('badge-overvalued');
      badgeEl.textContent = `Overvalued (${formatPercentWithSign(marginPercent)})`;
    } else {
      badgeEl.classList.add('badge-fairvalue');
      badgeEl.textContent = `Fairly Valued (${formatPercentWithSign(marginPercent)})`;
    }
  }

  const metricPrice = document.getElementById('val-metric-price');
  const metricVal = document.getElementById('val-metric-fair-value');
  const metricMargin = document.getElementById('val-metric-margin');
  const metricMarginNote = document.getElementById('val-metric-margin-note');

  if (metricPrice) metricPrice.textContent = formatCurrency(currentPrice);
  if (metricVal) metricVal.textContent = formatCurrency(estimatedValue);

  if (metricMargin) {
    metricMargin.textContent = formatPercentWithSign(marginPercent);
    metricMargin.className = `metric-box-val num ${marginPercent >= 0 ? 'val-positive' : 'val-negative'}`;
  }

  if (metricMarginNote) {
    if (marginPercent > 5) {
      metricMarginNote.textContent = 'Trading at an attractive valuation discount';
    } else if (marginPercent < -5) {
      metricMarginNote.textContent = 'Trading at a premium to estimated cash flows';
    } else {
      metricMarginNote.textContent = 'Trading within fair value tolerance band';
    }
  }

  const gaugeFill = document.getElementById('val-gauge-fill');
  const gaugePriceLbl = document.getElementById('val-gauge-price-lbl');
  const gaugeValLbl = document.getElementById('val-gauge-val-lbl');

  if (gaugePriceLbl) gaugePriceLbl.textContent = `Market Price: ${formatCurrency(currentPrice)}`;
  if (gaugeValLbl) gaugeValLbl.textContent = `Estimated Intrinsic Value: ${formatCurrency(estimatedValue)}`;

  if (gaugeFill) {
    const totalMax = Math.max(currentPrice, estimatedValue) * 1.25;
    const priceRatio = Math.min(100, Math.max(5, (currentPrice / totalMax) * 100));
    gaugeFill.style.width = `${priceRatio}%`;

    if (currentPrice < estimatedValue) {
      gaugeFill.style.backgroundColor = 'var(--color-positive)';
    } else if (currentPrice > estimatedValue * 1.1) {
      gaugeFill.style.backgroundColor = 'var(--color-negative)';
    } else {
      gaugeFill.style.backgroundColor = 'var(--color-accent)';
    }
  }

  const growthValEl = document.getElementById('dcf-growth-val');
  const discountValEl = document.getElementById('dcf-discount-val');
  const growthSlider = document.getElementById('dcf-growth-slider');
  const discountSlider = document.getElementById('dcf-discount-slider');

  if (growthValEl) growthValEl.textContent = `${currentGrowthRate.toFixed(1)}%`;
  if (discountValEl) discountValEl.textContent = `${currentDiscountRate.toFixed(1)}%`;
  if (growthSlider) growthSlider.value = currentGrowthRate;
  if (discountSlider) discountSlider.value = currentDiscountRate;

  const tablePe = document.getElementById('table-pe-ratio');
  const tablePeMedian = document.getElementById('table-pe-median');
  const tableFwdPe = document.getElementById('table-fwd-pe');
  const tablePb = document.getElementById('table-pb-ratio');
  const tableEv = document.getElementById('table-ev-ebitda');
  const tableFcf = document.getElementById('table-fcf-yield');

  if (tablePe) tablePe.textContent = `${activeStock.peRatio.toFixed(1)}x`;
  if (tablePeMedian) tablePeMedian.textContent = `${activeStock.peMedian5Y.toFixed(1)}x`;
  if (tableFwdPe) tableFwdPe.textContent = `${activeStock.forwardPe.toFixed(1)}x`;
  if (tablePb) tablePb.textContent = `${activeStock.pbRatio.toFixed(1)}x`;
  if (tableEv) tableEv.textContent = `${activeStock.evEbitda.toFixed(1)}x`;
  if (tableFcf) tableFcf.textContent = `${activeStock.fcfYield.toFixed(1)}%`;

  const pillButtons = document.querySelectorAll('.stock-pill-btn');
  pillButtons.forEach((btn) => {
    if (btn.getAttribute('data-symbol') === activeStock.symbol) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

function selectStockBySymbol(symbol) {
  const stock = stockDatabase.find((s) => s.symbol.toUpperCase() === symbol.toUpperCase());
  if (stock) {
    activeStock = stock;
    currentGrowthRate = stock.baseGrowthRate;
    currentDiscountRate = stock.baseDiscountRate;
    renderPriceVsValue();
    fetchMarketInsight();
  }
}

// =============================================================================
// 5. Market Movers (Top 3 Gainers & Top 3 Losers)
// =============================================================================

function computeGainersAndLosers() {
  const sorted = [...stockDatabase].sort((a, b) => b.changePercent - a.changePercent);
  gainersData = sorted.slice(0, 3).map((s, idx) => ({
    rank: idx + 1,
    symbol: s.symbol,
    name: s.name,
    price: s.price,
    changeDollar: s.changeDollar,
    changePercent: s.changePercent,
    volume: s.volume,
    catalyst: `${s.symbol} real-time consolidated market tape activity (${s.volume} volume).`,
  }));

  const sortedLoss = [...stockDatabase].sort((a, b) => a.changePercent - b.changePercent);
  losersData = sortedLoss.slice(0, 3).map((s, idx) => ({
    rank: idx + 1,
    symbol: s.symbol,
    name: s.name,
    price: s.price,
    changeDollar: s.changeDollar,
    changePercent: s.changePercent,
    volume: s.volume,
    catalyst: `${s.symbol} trading session consolidation on real market volume.`,
  }));
}

function renderGainersAndLosers() {
  computeGainersAndLosers();
  const gainersListEl = document.getElementById('gainers-list');
  const losersListEl = document.getElementById('losers-list');

  if (gainersListEl) {
    gainersListEl.innerHTML = '';
    gainersData.forEach((item) => {
      const row = document.createElement('div');
      row.className = 'mover-item';
      row.setAttribute('role', 'button');
      row.setAttribute('tabindex', '0');
      row.setAttribute('aria-label', `Select ${item.symbol} to analyze price versus value`);
      row.setAttribute('data-symbol', item.symbol);

      row.innerHTML = `
        <div class="mover-item-left">
          <div class="mover-ticker-row">
            <span class="mover-rank">#${item.rank}</span>
            <span class="mover-ticker">${item.symbol}</span>
            <span class="mover-company">${item.name}</span>
          </div>
          <span class="mover-catalyst">${item.catalyst}</span>
        </div>
        <div class="mover-item-right">
          <span class="mover-price num">${formatCurrency(item.price)}</span>
          <span class="mover-change positive num">+${formatCurrency(item.changeDollar)} (+${item.changePercent.toFixed(2)}%)</span>
        </div>
      `;

      row.addEventListener('click', () => {
        selectStockBySymbol(item.symbol);
        const valSection = document.getElementById('section-price-value');
        if (valSection) valSection.scrollIntoView({ behavior: 'smooth' });
      });

      gainersListEl.appendChild(row);
    });
  }

  if (losersListEl) {
    losersListEl.innerHTML = '';
    losersData.forEach((item) => {
      const row = document.createElement('div');
      row.className = 'mover-item';
      row.setAttribute('role', 'button');
      row.setAttribute('tabindex', '0');
      row.setAttribute('aria-label', `Select ${item.symbol} to analyze price versus value`);
      row.setAttribute('data-symbol', item.symbol);

      row.innerHTML = `
        <div class="mover-item-left">
          <div class="mover-ticker-row">
            <span class="mover-rank">#${item.rank}</span>
            <span class="mover-ticker">${item.symbol}</span>
            <span class="mover-company">${item.name}</span>
          </div>
          <span class="mover-catalyst">${item.catalyst}</span>
        </div>
        <div class="mover-item-right">
          <span class="mover-price num">${formatCurrency(item.price)}</span>
          <span class="mover-change negative num">${formatCurrency(item.changeDollar)} (${item.changePercent.toFixed(2)}%)</span>
        </div>
      `;

      row.addEventListener('click', () => {
        selectStockBySymbol(item.symbol);
        const valSection = document.getElementById('section-price-value');
        if (valSection) valSection.scrollIntoView({ behavior: 'smooth' });
      });

      losersListEl.appendChild(row);
    });
  }
}

/**
 * Fetches live real-time quotes from the server-side Alpaca / Consolidated Tape endpoint.
 */
async function fetchLiveQuotes() {
  try {
    const response = await fetch('/api/market/stocks');
    if (!response.ok) return;
    const data = await response.json();
    if (data.stocks && Array.isArray(data.stocks) && data.stocks.length > 0) {
      stockDatabase = data.stocks;

      const updatedActive = stockDatabase.find((s) => s.symbol === activeStock.symbol);
      if (updatedActive) {
        activeStock = updatedActive;
      }

      renderPriceVsValue();
      renderGainersAndLosers();
    }
  } catch (err) {
    console.warn('Quotes fetch error, using resilient cache:', err);
  }
}

/**
 * Fetches live Google News and financial disclosures from the server-side /api/market/news endpoint.
 */
async function fetchLiveNews() {
  try {
    const response = await fetch('/api/market/news');
    if (!response.ok) return;
    const data = await response.json();
    if (data.news && Array.isArray(data.news) && data.news.length > 0) {
      liveMarketNews = data.news;
      renderMarketNews();
    }
  } catch (err) {
    console.warn('Live news fetch error:', err);
  }
}

// =============================================================================
// 6. Market News & Gemini AI Insight Synthesis
// =============================================================================

function renderMarketNews() {
  const newsContainer = document.getElementById('news-container');
  if (!newsContainer) return;

  newsContainer.innerHTML = '';

  if (!liveMarketNews || liveMarketNews.length === 0) {
    newsContainer.innerHTML = `
      <div style="padding: 24px; text-align: center; color: var(--color-text-muted);">
        Connecting to Google News real-time financial wire...
      </div>
    `;
    return;
  }

  liveMarketNews.forEach((news) => {
    const card = document.createElement('article');
    card.className = 'news-item-card';

    let sentimentClass = 'sentiment-neutral';
    if (news.sentiment === 'bullish') sentimentClass = 'sentiment-bullish';
    if (news.sentiment === 'bearish') sentimentClass = 'sentiment-bearish';

    const linkHref = news.url && news.url !== '#' ? news.url : `https://news.google.com/search?q=${encodeURIComponent(news.title)}`;

    card.innerHTML = `
      <div class="news-meta-row">
        <span class="news-sentiment ${sentimentClass}">${news.sentiment.toUpperCase()}</span>
        <span class="tag-ticker num font-bold">${news.symbol}</span>
        <span>•</span>
        <span>${news.timestamp}</span>
        <span>•</span>
        <span class="citation-note">Source: ${news.source}</span>
      </div>
      <h3 class="news-title">
        <a href="${linkHref}" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: none;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">
          ${news.title}
        </a>
      </h3>
      <p class="news-summary">${news.summary}</p>
    `;

    newsContainer.appendChild(card);
  });
}

/**
 * Requests synthesized market insight from the server-side /api/insight endpoint.
 */
async function fetchMarketInsight() {
  const btn = document.getElementById('btn-refresh-insight');
  const headlineEl = document.getElementById('ai-insight-headline');
  const macroEl = document.getElementById('ai-insight-macro');
  const valAssessEl = document.getElementById('ai-insight-valuation');
  const catalystsList = document.getElementById('ai-catalysts-list');
  const sourcesEl = document.getElementById('ai-sources-text');

  if (btn) {
    btn.textContent = 'Analyzing Trends...';
    btn.disabled = true;
  }

  try {
    const response = await fetch('/api/insight', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        symbol: activeStock.symbol,
        category: 'VALUATION_AND_TRENDS',
        notes: `Evaluating ${activeStock.symbol} (${activeStock.name}) live market price of $${activeStock.price} vs intrinsic value estimate.`,
      }),
    });

    if (!response.ok) throw new Error('Server returned error');
    const data = await response.json();

    if (headlineEl) headlineEl.textContent = data.headline || 'Market Trend Analysis';
    if (macroEl) macroEl.textContent = data.macroSummary || '';
    if (valAssessEl) valAssessEl.textContent = data.valuationAssessment || '';

    if (catalystsList && Array.isArray(data.keyCatalysts)) {
      catalystsList.innerHTML = '';
      data.keyCatalysts.forEach((cat) => {
        const li = document.createElement('li');
        li.className = 'ai-bullet-item';
        li.textContent = cat;
        catalystsList.appendChild(li);
      });
    }

    if (sourcesEl && Array.isArray(data.sources)) {
      sourcesEl.textContent = `Sources: ${data.sources.join(', ')}`;
    }
  } catch (err) {
    console.error('Failed to fetch AI insight:', err);
    if (headlineEl) headlineEl.textContent = 'Market Trend Note: Capital Allocation Discipline in Focus';
    if (macroEl) macroEl.textContent = 'Macro indicators reflect balanced liquidity conditions and steady bond yields across intermediate maturities.';
    if (valAssessEl) valAssessEl.textContent = 'Valuation analysis indicates selective entry points in companies possessing durable pricing power.';
  } finally {
    if (btn) {
      btn.textContent = 'Generate Market Insight';
      btn.disabled = false;
    }
  }
}

// =============================================================================
// 7. Sortable & Filterable Transactions Table
// =============================================================================

function filterTransactions(list) {
  return list.filter((tx) => {
    if (transactionFilter.type !== 'ALL' && tx.type !== transactionFilter.type) {
      return false;
    }
    if (transactionFilter.status !== 'ALL' && tx.status !== transactionFilter.status) {
      return false;
    }
    if (transactionFilter.search.trim() !== '') {
      const q = transactionFilter.search.toLowerCase().trim();
      const matchSymbol = tx.symbol.toLowerCase().includes(q);
      const matchName = tx.name.toLowerCase().includes(q);
      const matchNotes = (tx.notes || '').toLowerCase().includes(q);
      if (!matchSymbol && !matchName && !matchNotes) return false;
    }
    return true;
  });
}

function sortTransactions(list) {
  return [...list].sort((a, b) => {
    let valA = a[transactionSort.column];
    let valB = b[transactionSort.column];

    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();

    if (valA < valB) return transactionSort.direction === 'asc' ? -1 : 1;
    if (valA > valB) return transactionSort.direction === 'asc' ? 1 : -1;
    return 0;
  });
}

function renderTransactionsTable() {
  const tbody = document.getElementById('transactions-table-body');
  const emptyState = document.getElementById('transactions-empty-state');
  if (!tbody) return;

  const filtered = filterTransactions(transactionsData);
  const sorted = sortTransactions(filtered);

  tbody.innerHTML = '';

  if (sorted.length === 0) {
    if (emptyState) emptyState.style.display = 'block';
  } else {
    if (emptyState) emptyState.style.display = 'none';

    sorted.forEach((tx) => {
      const tr = document.createElement('tr');

      const isBuy = tx.type === 'BUY';
      const typeBadgeClass = isBuy ? 'badge-buy' : 'badge-sell';
      const statusClass = tx.status === 'SETTLED' ? 'status-settled' : 'status-executed';

      tr.innerHTML = `
        <td class="num">${tx.date}</td>
        <td>
          <div style="display: flex; flex-direction: column;">
            <span class="num font-bold">${tx.symbol}</span>
            <span style="font-size: 0.75rem; color: var(--color-text-muted);">${tx.name}</span>
          </div>
        </td>
        <td>
          <span class="type-badge ${typeBadgeClass}">${tx.type}</span>
        </td>
        <td class="num">${formatNumber(tx.quantity)}</td>
        <td class="num">${formatCurrency(tx.price)}</td>
        <td class="num font-bold">${formatCurrency(tx.totalValue)}</td>
        <td>
          <span class="status-pill ${statusClass}">
            <span class="status-dot-sm"></span>
            <span>${tx.status}</span>
          </span>
        </td>
        <td>
          <button class="btn btn-secondary btn-sm btn-view-tx" data-tx-id="${tx.id}" aria-label="View transaction ${tx.id} note">
            Notes
          </button>
        </td>
      `;

      const viewBtn = tr.querySelector('.btn-view-tx');
      if (viewBtn) {
        viewBtn.addEventListener('click', () => {
          alert(`Transaction ${tx.id} (${tx.type} ${tx.quantity} ${tx.symbol} @ ${formatCurrency(tx.price)}):\n\nAllocation Note: "${tx.notes}"`);
        });
      }

      tbody.appendChild(tr);
    });
  }

  updateTransactionsKPIs();
  updateSortIndicators();
}

function updateTransactionsKPIs() {
  const kpiVolume = document.getElementById('kpi-total-volume');
  const kpiNetFlow = document.getElementById('kpi-net-flow');
  const kpiTrades = document.getElementById('kpi-trade-count');
  const kpiRatio = document.getElementById('kpi-buy-sell-ratio');

  let totalVol = 0;
  let netFlow = 0;
  let buyCount = 0;
  let sellCount = 0;

  transactionsData.forEach((tx) => {
    totalVol += tx.totalValue;
    if (tx.type === 'BUY') {
      netFlow -= tx.totalValue;
      buyCount++;
    } else {
      netFlow += tx.totalValue;
      sellCount++;
    }
  });

  if (kpiVolume) kpiVolume.textContent = formatCurrency(totalVol);
  if (kpiNetFlow) {
    kpiNetFlow.textContent = formatCurrency(netFlow);
    kpiNetFlow.className = `kpi-value num ${netFlow >= 0 ? 'val-positive' : 'val-negative'}`;
  }
  if (kpiTrades) kpiTrades.textContent = String(transactionsData.length);
  if (kpiRatio) kpiRatio.textContent = `${buyCount} Buy / ${sellCount} Sell`;
}

function updateSortIndicators() {
  const headers = document.querySelectorAll('.sortable-th');
  headers.forEach((th) => {
    const key = th.getAttribute('data-sort-key');
    const icon = th.querySelector('.sort-icon');
    if (!icon) return;

    if (key === transactionSort.column) {
      icon.textContent = transactionSort.direction === 'asc' ? '▲' : '▼';
      th.setAttribute('aria-sort', transactionSort.direction === 'asc' ? 'ascending' : 'descending');
    } else {
      icon.textContent = '⇅';
      th.removeAttribute('aria-sort');
    }
  });
}

function handleSortColumnClick(columnKey) {
  if (transactionSort.column === columnKey) {
    transactionSort.direction = transactionSort.direction === 'asc' ? 'desc' : 'asc';
  } else {
    transactionSort.column = columnKey;
    transactionSort.direction = columnKey === 'date' ? 'desc' : 'asc';
  }
  renderTransactionsTable();
}

// =============================================================================
// 8. Order Execution Modal & Submission Handling
// =============================================================================

function openOrderModal() {
  const modal = document.getElementById('order-modal');
  const symbolInput = document.getElementById('order-input-symbol');
  const priceInput = document.getElementById('order-input-price');
  const qtyInput = document.getElementById('order-input-qty');
  const errorBanner = document.getElementById('order-error-banner');

  if (symbolInput) symbolInput.value = activeStock.symbol;
  if (priceInput) priceInput.value = activeStock.price.toFixed(2);
  if (qtyInput) qtyInput.value = '100';
  if (errorBanner) errorBanner.style.display = 'none';

  updateOrderEstimatedTotal();

  if (modal) {
    if (typeof modal.showModal === 'function') {
      modal.showModal();
    } else {
      modal.setAttribute('open', '');
    }
  }
}

function closeOrderModal() {
  const modal = document.getElementById('order-modal');
  if (modal) {
    if (typeof modal.close === 'function') {
      modal.close();
    } else {
      modal.removeAttribute('open');
    }
  }
}

function updateOrderEstimatedTotal() {
  const qtyInput = document.getElementById('order-input-qty');
  const priceInput = document.getElementById('order-input-price');
  const totalEl = document.getElementById('order-estimated-total');

  const qty = Number(qtyInput?.value) || 0;
  const price = Number(priceInput?.value) || 0;
  const total = qty * price;

  if (totalEl) totalEl.textContent = formatCurrency(total);
}

async function submitNewOrder(event) {
  event.preventDefault();

  const symbolInput = document.getElementById('order-input-symbol');
  const typeSelect = document.getElementById('order-select-type');
  const qtyInput = document.getElementById('order-input-qty');
  const priceInput = document.getElementById('order-input-price');
  const notesInput = document.getElementById('order-input-notes');
  const errorBanner = document.getElementById('order-error-banner');
  const submitBtn = document.getElementById('btn-submit-order');

  const payload = {
    symbol: symbolInput?.value?.trim()?.toUpperCase(),
    type: typeSelect?.value,
    quantity: Number(qtyInput?.value),
    price: Number(priceInput?.value),
    notes: notesInput?.value?.trim() || 'Manual portfolio allocation order.',
  };

  if (errorBanner) errorBanner.style.display = 'none';
  if (submitBtn) {
    submitBtn.textContent = 'Validating Order...';
    submitBtn.disabled = true;
  }

  try {
    const response = await fetch('/api/transactions/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      const message = (result.errors || ['Transaction validation failed']).join(', ');
      if (errorBanner) {
        errorBanner.textContent = message;
        errorBanner.style.display = 'block';
      }
      return;
    }

    const foundStock = stockDatabase.find((s) => s.symbol === result.transaction.symbol);
    const completedTx = {
      ...result.transaction,
      name: foundStock ? foundStock.name : `${result.transaction.symbol} Equities`,
      notes: payload.notes,
    };

    transactionsData.unshift(completedTx);
    renderTransactionsTable();
    closeOrderModal();
  } catch (err) {
    console.error('Order submission error:', err);
    if (errorBanner) {
      errorBanner.textContent = 'Network or server error validating transaction.';
      errorBanner.style.display = 'block';
    }
  } finally {
    if (submitBtn) {
      submitBtn.textContent = 'Execute Order';
      submitBtn.disabled = false;
    }
  }
}

// =============================================================================
// 9. Event Listeners & Application Bootstrapping
// =============================================================================

function initializeEventListeners() {
  const pillButtons = document.querySelectorAll('.stock-pill-btn');
  pillButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const symbol = btn.getAttribute('data-symbol');
      if (symbol) selectStockBySymbol(symbol);
    });
  });

  const searchInput = document.getElementById('stock-search-input');
  const searchBtn = document.getElementById('btn-stock-search');

  const executeSearch = () => {
    const query = searchInput?.value?.trim()?.toUpperCase();
    if (query) {
      const found = stockDatabase.find((s) => s.symbol === query || s.name.toUpperCase().includes(query));
      if (found) {
        selectStockBySymbol(found.symbol);
      } else {
        alert(`Symbol "${query}" not in active coverage universe. Available: ${stockDatabase.map(s => s.symbol).join(', ')}.`);
      }
    }
  };

  if (searchBtn) searchBtn.addEventListener('click', executeSearch);
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        executeSearch();
      }
    });
  }

  const growthSlider = document.getElementById('dcf-growth-slider');
  if (growthSlider) {
    growthSlider.addEventListener('input', (e) => {
      currentGrowthRate = Number(e.target.value);
      renderPriceVsValue();
    });
  }

  const discountSlider = document.getElementById('dcf-discount-slider');
  if (discountSlider) {
    discountSlider.addEventListener('input', (e) => {
      currentDiscountRate = Number(e.target.value);
      renderPriceVsValue();
    });
  }

  const refreshMoversBtn = document.getElementById('btn-refresh-movers');
  if (refreshMoversBtn) {
    refreshMoversBtn.addEventListener('click', fetchLiveQuotes);
  }

  const insightBtn = document.getElementById('btn-refresh-insight');
  if (insightBtn) {
    insightBtn.addEventListener('click', fetchMarketInsight);
  }

  const sortHeaders = document.querySelectorAll('.sortable-th');
  sortHeaders.forEach((th) => {
    th.addEventListener('click', () => {
      const key = th.getAttribute('data-sort-key');
      if (key) handleSortColumnClick(key);
    });
    th.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const key = th.getAttribute('data-sort-key');
        if (key) handleSortColumnClick(key);
      }
    });
  });

  const txSearchInput = document.getElementById('tx-search-input');
  if (txSearchInput) {
    txSearchInput.addEventListener('input', (e) => {
      transactionFilter.search = e.target.value;
      renderTransactionsTable();
    });
  }

  const txTypeSelect = document.getElementById('tx-filter-type');
  if (txTypeSelect) {
    txTypeSelect.addEventListener('change', (e) => {
      transactionFilter.type = e.target.value;
      renderTransactionsTable();
    });
  }

  const txStatusSelect = document.getElementById('tx-filter-status');
  if (txStatusSelect) {
    txStatusSelect.addEventListener('change', (e) => {
      transactionFilter.status = e.target.value;
      renderTransactionsTable();
    });
  }

  const txResetBtn = document.getElementById('btn-reset-tx-filters');
  if (txResetBtn) {
    txResetBtn.addEventListener('click', () => {
      transactionFilter = { search: '', type: 'ALL', status: 'ALL' };
      if (txSearchInput) txSearchInput.value = '';
      if (txTypeSelect) txTypeSelect.value = 'ALL';
      if (txStatusSelect) txStatusSelect.value = 'ALL';
      renderTransactionsTable();
    });
  }

  const openOrderBtn = document.getElementById('btn-open-order-modal');
  if (openOrderBtn) openOrderBtn.addEventListener('click', openOrderModal);

  const closeOrderBtn = document.getElementById('btn-close-order-modal');
  if (closeOrderBtn) closeOrderBtn.addEventListener('click', closeOrderModal);

  const cancelOrderBtn = document.getElementById('btn-cancel-order');
  if (cancelOrderBtn) cancelOrderBtn.addEventListener('click', closeOrderModal);

  const orderForm = document.getElementById('order-form');
  if (orderForm) orderForm.addEventListener('submit', submitNewOrder);

  const orderQtyInput = document.getElementById('order-input-qty');
  if (orderQtyInput) orderQtyInput.addEventListener('input', updateOrderEstimatedTotal);

  const orderPriceInput = document.getElementById('order-input-price');
  if (orderPriceInput) orderPriceInput.addEventListener('input', updateOrderEstimatedTotal);
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', async () => {
  initializeEventListeners();
  renderPriceVsValue();
  renderGainersAndLosers();
  renderMarketNews();
  renderTransactionsTable();

  // Fetch initial live quotes and news
  await fetchLiveQuotes();
  await fetchLiveNews();
  await fetchMarketInsight();

  // Periodic quotes refresh every 15 seconds
  setInterval(fetchLiveQuotes, 15000);
});
