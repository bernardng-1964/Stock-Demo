import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { PriceValueView } from './components/PriceValueView';
import { StockShowdownView } from './components/StockShowdownView';
import { WatchlistView } from './components/WatchlistView';
import { TransactionsView } from './components/TransactionsView';
import { AcademyView } from './components/AcademyView';
import { ChibiAdvisorView } from './components/ChibiAdvisorView';
import { NewsView } from './components/NewsView';
import { NewOrderModal } from './components/NewOrderModal';
import { SettingsModal, HelpModal } from './components/Modals';
import {
  initialInstruments,
  initialIndices,
  initialNews,
  initialTransactions,
  initialPortfolioStats,
} from './data/mockData';
import { StockInstrument, MarketIndex, NewsItem, Transaction, PortfolioStats, ChibiHoldings, OrderAction } from './types';
import { playChibiSound } from './utils/formatters';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [instruments, setInstruments] = useState<StockInstrument[]>(initialInstruments);
  const [indices, setIndices] = useState<MarketIndex[]>(initialIndices);
  const [news, setNews] = useState<NewsItem[]>(initialNews);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [portfolioStats, setPortfolioStats] = useState<PortfolioStats>(initialPortfolioStats);
  const [holdings, setHoldings] = useState<ChibiHoldings>({
    AAPL: { shares: 10, avgPrice: 175.2, totalInvested: 1752.0 },
    NVDA: { shares: 2, avgPrice: 110.5, totalInvested: 221.0 },
    DIS: { shares: 15, avgPrice: 98.4, totalInvested: 1476.0 },
    RBLX: { shares: 25, avgPrice: 42.1, totalInvested: 1052.5 },
  });
  const [completedLessons, setCompletedLessons] = useState<string[]>(['lesson-1', 'lesson-2']);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Selected Stock for Inspector / Bargain Detective
  const [selectedStock, setSelectedStock] = useState<StockInstrument>(initialInstruments[0]);

  // Alpaca Live Market Synchronization State
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');

  // Synchronize with Alpaca Live Market API
  const syncWithAlpacaApi = async () => {
    try {
      setIsSyncing(true);
      const response = await fetch('/api/market/stocks');
      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.stocks) && data.stocks.length > 0) {
          setInstruments((prevInstruments) => {
            return prevInstruments.map((inst) => {
              const live = data.stocks.find((s: any) => s.symbol === inst.symbol);
              if (!live) return inst;
              return {
                ...inst,
                lastPrice: live.lastPrice ?? live.price ?? inst.lastPrice,
                change: live.change ?? live.changeDollar ?? inst.change,
                changePercent: live.changePercent ?? inst.changePercent,
                open: live.open ?? inst.open,
                high: Math.max(live.high ?? inst.high, live.lastPrice ?? inst.lastPrice),
                low: Math.min(live.low ?? inst.low, live.lastPrice ?? inst.lastPrice),
                close: live.close ?? live.price ?? inst.close,
                prevClose: live.prevClose ?? inst.prevClose ?? inst.open,
                fairValue: live.fairValue ?? inst.fairValue,
                discountPercent: live.discountPercent ?? inst.discountPercent,
                valuation: live.valuation ?? inst.valuation,
                sparkline: live.sparkline && live.sparkline.length > 0 ? live.sparkline : inst.sparkline,
              };
            });
          });

          // Also keep selectedStock updated
          setSelectedStock((prev) => {
            const live = data.stocks.find((s: any) => s.symbol === prev.symbol);
            if (!live) return prev;
            return {
              ...prev,
              lastPrice: live.lastPrice ?? live.price ?? prev.lastPrice,
              change: live.change ?? live.changeDollar ?? prev.change,
              changePercent: live.changePercent ?? prev.changePercent,
              open: live.open ?? prev.open,
              high: Math.max(live.high ?? prev.high, live.lastPrice ?? prev.lastPrice),
              low: Math.min(live.low ?? prev.low, live.lastPrice ?? prev.lastPrice),
              close: live.close ?? live.price ?? prev.close,
              prevClose: live.prevClose ?? prev.prevClose ?? prev.open,
              fairValue: live.fairValue ?? prev.fairValue,
              discountPercent: live.discountPercent ?? prev.discountPercent,
              valuation: live.valuation ?? prev.valuation,
              sparkline: live.sparkline && live.sparkline.length > 0 ? live.sparkline : prev.sparkline,
            };
          });

          setLastSyncTime(
            new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
          );
        }
      }

      // Sync real live major indices (S&P 500, NASDAQ, DOW JONES, VIX)
      const indicesRes = await fetch('/api/market/indices');
      if (indicesRes.ok) {
        const indicesData = await indicesRes.json();
        if (indicesData.success && Array.isArray(indicesData.indices) && indicesData.indices.length > 0) {
          setIndices(indicesData.indices);
        }
      }

      // Sync real financial news wire
      const newsRes = await fetch('/api/market/news');
      if (newsRes.ok) {
        const newsData = await newsRes.json();
        if (newsData.success && Array.isArray(newsData.news) && newsData.news.length > 0) {
          setNews(newsData.news);
        }
      }
    } catch (err) {
      console.warn('Alpaca market sync error:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Initial Alpaca synchronization on load and periodic refresh every 25 seconds
  useEffect(() => {
    syncWithAlpacaApi();
    const interval = setInterval(() => {
      syncWithAlpacaApi();
    }, 25000);
    return () => clearInterval(interval);
  }, []);

  // Modals state
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [orderTargetSymbol, setOrderTargetSymbol] = useState<string | undefined>(undefined);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Keyboard shortcut '/' to search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        const searchInput = document.getElementById('global-search-input');
        searchInput?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Subtle live stock & index fluctuations every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      setInstruments((prev) => {
        const randomIndex = Math.floor(Math.random() * prev.length);
        return prev.map((inst, idx) => {
          if (idx !== randomIndex) return inst;
          const delta = (Math.random() - 0.48) * (inst.lastPrice * 0.002);
          const newPrice = Math.max(1, +(inst.lastPrice + delta).toFixed(2));
          const baseRef = inst.prevClose || inst.open || inst.lastPrice;
          const priceDiff = +(newPrice - baseRef).toFixed(2);
          const changePercent = +((priceDiff / baseRef) * 100).toFixed(2);
          const newSparkline = [...inst.sparkline.slice(1), newPrice];

          return {
            ...inst,
            lastPrice: newPrice,
            change: priceDiff,
            changePercent,
            high: Math.max(inst.high, newPrice),
            low: Math.min(inst.low, newPrice),
            sparkline: newSparkline,
          };
        });
      });

      // Subtle index fluctuation
      setIndices((prev) => {
        const randomIdx = Math.floor(Math.random() * prev.length);
        return prev.map((item, idx) => {
          if (idx !== randomIdx) return item;
          const delta = (Math.random() - 0.48) * (item.value * 0.0006);
          const newVal = +(item.value + delta).toFixed(2);
          const newChange = +(item.change + delta).toFixed(2);
          const newChangePct = +(((newVal - (item.value - item.change)) / (item.value - item.change)) * 100).toFixed(2);

          const currentTf = item.timeframes['1D'];
          const newSpark = [...currentTf.sparkline.slice(1), newVal];

          return {
            ...item,
            value: newVal,
            change: newChange,
            changePercent: newChangePct,
            timeframes: {
              ...item.timeframes,
              '1D': {
                ...currentTf,
                value: newVal,
                changePercent: newChangePct,
                sparkline: newSpark,
              },
            },
          };
        });
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Recompute total portfolio value whenever holdings or prices change
  useEffect(() => {
    let totalHoldingsValue = 0;
    let totalCost = 0;

    (Object.entries(holdings) as [string, { shares: number; avgPrice: number; totalInvested: number }][]).forEach(([symbol, data]) => {
      const stock = instruments.find((s) => s.symbol === symbol);
      const currentPrice = stock?.lastPrice || data.avgPrice;
      totalHoldingsValue += data.shares * currentPrice;
      totalCost += data.totalInvested;
    });

    const netWorth = portfolioStats.walletChibiCoins + totalHoldingsValue;
    const profitLoss = totalHoldingsValue - totalCost;
    const profitPercent = totalCost > 0 ? (profitLoss / totalCost) * 100 : 0;

    // Check unlocking badges
    const updatedBadges = portfolioStats.badges.map((b) => {
      if (b.id === 'badge-1' && Object.keys(holdings).length >= 1) return { ...b, unlocked: true };
      if (b.id === 'badge-2' && Object.keys(holdings).length >= 3) return { ...b, unlocked: true };
      if (b.id === 'badge-4' && completedLessons.length >= 3) return { ...b, unlocked: true };
      if (b.id === 'badge-5' && netWorth >= 10500) return { ...b, unlocked: true };
      return b;
    });

    // Level progression
    const levelScore = completedLessons.length + Object.keys(holdings).length;
    let level = 1;
    let levelTitle = 'Seedling Saver';

    if (levelScore >= 7) {
      level = 3;
      levelTitle = 'Bargain Detective Master';
    } else if (levelScore >= 4) {
      level = 2;
      levelTitle = 'Junior Slice Collector';
    }

    setPortfolioStats((prev) => ({
      ...prev,
      totalPortfolioValue: +netWorth.toFixed(2),
      totalProfitLoss: +profitLoss.toFixed(2),
      totalProfitPercent: +profitPercent.toFixed(2),
      level,
      levelTitle,
      badges: updatedBadges,
    }));
  }, [holdings, instruments, completedLessons, portfolioStats.walletChibiCoins]);

  const handleOpenNewOrder = (symbol?: string) => {
    setOrderTargetSymbol(symbol);
    setIsNewOrderOpen(true);
  };

  const handleSelectInstrument = (symbol: string) => {
    const found = instruments.find((i) => i.symbol === symbol);
    if (found) {
      setSelectedStock(found);
      setActiveTab('price-value');
    }
  };

  const handleSubmitOrder = (order: {
    symbol: string;
    type: OrderAction;
    qty: number;
    price: number;
  }) => {
    const totalCost = +(order.qty * order.price).toFixed(2);
    const isBuy = order.type === 'BUY';
    const targetStock = instruments.find((s) => s.symbol === order.symbol);

    // Update wallet balance
    setPortfolioStats((prev) => ({
      ...prev,
      walletChibiCoins: isBuy
        ? Math.max(0, +(prev.walletChibiCoins - totalCost).toFixed(2))
        : +(prev.walletChibiCoins + totalCost).toFixed(2),
    }));

    // Update holdings
    setHoldings((prev) => {
      const current = prev[order.symbol] || { shares: 0, avgPrice: order.price, totalInvested: 0 };
      if (isBuy) {
        const newShares = current.shares + order.qty;
        const newTotalInvested = +(current.totalInvested + totalCost).toFixed(2);
        const newAvgPrice = +(newTotalInvested / newShares).toFixed(2);
        return {
          ...prev,
          [order.symbol]: {
            shares: newShares,
            avgPrice: newAvgPrice,
            totalInvested: newTotalInvested,
          },
        };
      } else {
        const remainingShares = Math.max(0, current.shares - order.qty);
        if (remainingShares === 0) {
          const copy = { ...prev };
          delete copy[order.symbol];
          return copy;
        }
        const proportion = remainingShares / current.shares;
        return {
          ...prev,
          [order.symbol]: {
            shares: remainingShares,
            avgPrice: current.avgPrice,
            totalInvested: +(current.totalInvested * proportion).toFixed(2),
          },
        };
      }
    });

    // Add transaction receipt
    const newTx: Transaction = {
      id: `TX-${Date.now().toString().slice(-4)}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      type: order.type,
      symbol: order.symbol,
      chibiName: targetStock?.chibiName || order.symbol,
      qty: order.qty,
      price: order.price,
      totalValue: totalCost,
      status: 'Settled 🎉',
      mascotTip: isBuy
        ? `Added ${order.qty} slices of ${order.symbol} to your treasure vault!`
        : `Sold ${order.qty} slices of ${order.symbol} and banked +${totalCost} CC!`,
    };

    setTransactions((prev) => [newTx, ...prev]);
  };

  const handleEarnCoins = (amount: number) => {
    setPortfolioStats((prev) => ({
      ...prev,
      walletChibiCoins: +(prev.walletChibiCoins + amount).toFixed(2),
    }));
  };

  const handleCompleteLesson = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons((prev) => [...prev, lessonId]);
    }
  };

  const handleResetPiggyBank = () => {
    setPortfolioStats({
      ...initialPortfolioStats,
      walletChibiCoins: 10000.0,
      totalPortfolioValue: 10000.0,
      totalProfitLoss: 0,
      totalProfitPercent: 0,
    });
    setHoldings({});
    setTransactions([]);
    if (soundEnabled) playChibiSound('celebrate');
  };

  return (
    <div className="min-h-screen bg-[#fffdfa] text-slate-900 font-sans flex flex-col selection:bg-amber-200">
      {/* 1. Header with Piggy Balance, Sounds & Fast Actions */}
      <Header
        portfolioStats={portfolioStats}
        onOpenNewOrder={() => handleOpenNewOrder()}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((v) => !v)}
        instruments={instruments}
        onSelectInstrument={handleSelectInstrument}
        isSyncing={isSyncing}
        lastSyncTime={lastSyncTime}
        onSyncAlpaca={syncWithAlpacaApi}
      />

      {/* 2. Main Body with Sidebar & Dynamic View */}
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab as any}
          setActiveTab={(tab) => {
            if (soundEnabled) playChibiSound('pop');
            setActiveTab(tab);
          }}
          portfolioStats={portfolioStats}
          soundEnabled={soundEnabled}
        />

        {/* View Switcher Container */}
        <main className="flex-1 md:ml-64 min-h-[calc(100vh-4rem)] pb-12 overflow-x-hidden">
          {activeTab === 'dashboard' && (
            <DashboardView
              indices={indices}
              instruments={instruments}
              news={news}
              onOpenNewOrder={handleOpenNewOrder}
              onSelectInstrument={handleSelectInstrument}
              onNavigateToTab={setActiveTab}
              soundEnabled={soundEnabled}
              isSyncing={isSyncing}
              lastSyncTime={lastSyncTime}
              onSyncAlpaca={syncWithAlpacaApi}
            />
          )}

          {activeTab === 'price-value' && (
            <PriceValueView
              instruments={instruments}
              selectedStock={selectedStock}
              onSelectStock={setSelectedStock}
              onOpenNewOrder={handleOpenNewOrder}
              soundEnabled={soundEnabled}
            />
          )}

          {activeTab === 'showdown' && (
            <StockShowdownView
              instruments={instruments}
              onOpenNewOrder={handleOpenNewOrder}
              soundEnabled={soundEnabled}
            />
          )}

          {activeTab === 'watchlist' && (
            <WatchlistView
              instruments={instruments}
              onOpenNewOrder={handleOpenNewOrder}
              onSelectInstrument={handleSelectInstrument}
              soundEnabled={soundEnabled}
            />
          )}

          {activeTab === 'transactions' && (
            <TransactionsView
              transactions={transactions}
              portfolioStats={portfolioStats}
              holdings={holdings}
              instruments={instruments}
              onOpenNewOrder={handleOpenNewOrder}
              soundEnabled={soundEnabled}
            />
          )}

          {activeTab === 'academy' && (
            <AcademyView
              onEarnCoins={handleEarnCoins}
              completedLessons={completedLessons}
              onCompleteLesson={handleCompleteLesson}
              soundEnabled={soundEnabled}
            />
          )}

          {activeTab === 'advisor' && (
            <ChibiAdvisorView
              instruments={instruments}
              soundEnabled={soundEnabled}
            />
          )}

          {activeTab === 'news' && (
            <NewsView
              news={news}
              onOpenNewOrder={handleOpenNewOrder}
              soundEnabled={soundEnabled}
            />
          )}
        </main>
      </div>

      {/* 3. Interactive Modals */}
      <NewOrderModal
        isOpen={isNewOrderOpen}
        onClose={() => setIsNewOrderOpen(false)}
        instruments={instruments}
        targetSymbol={orderTargetSymbol}
        portfolioStats={portfolioStats}
        onSubmitOrder={handleSubmitOrder}
        soundEnabled={soundEnabled}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((v) => !v)}
        onResetBank={handleResetPiggyBank}
      />

      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}

export default App;
