import React from 'react';
import {
  PiggyBank,
  Coins,
  Award,
  TrendingUp,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { Transaction, PortfolioStats, StockInstrument, ChibiHoldings } from '../types';
import { formatCoins, playChibiSound } from '../utils/formatters';

interface TransactionsViewProps {
  transactions: Transaction[];
  portfolioStats?: PortfolioStats;
  holdings: ChibiHoldings;
  instruments: StockInstrument[];
  onOpenNewOrder: (symbol?: string) => void;
  soundEnabled: boolean;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  transactions,
  portfolioStats,
  holdings,
  instruments,
  onOpenNewOrder,
  soundEnabled,
}) => {
  const level = portfolioStats?.level ?? 1;
  const levelTitle = portfolioStats?.levelTitle ?? 'Chibi Stock Explorer';
  const totalPortfolioValue = portfolioStats?.totalPortfolioValue ?? 0;
  const walletChibiCoins = portfolioStats?.walletChibiCoins ?? 0;
  const totalProfitLoss = portfolioStats?.totalProfitLoss ?? 0;
  const totalProfitPercent = portfolioStats?.totalProfitPercent ?? 0;
  const badges = portfolioStats?.badges ?? [];

  // Calculate current value of holdings
  const holdingsList = (Object.entries(holdings) as [string, { shares: number; avgPrice: number; totalInvested: number }][]).map(([symbol, data]) => {
    const instrument = instruments.find((i) => i.symbol === symbol);
    const currentPrice = instrument?.lastPrice || data.avgPrice;
    const currentValue = data.shares * currentPrice;
    const profitLoss = currentValue - data.totalInvested;
    const profitLossPercent = data.totalInvested > 0 ? (profitLoss / data.totalInvested) * 100 : 0;

    return {
      symbol,
      instrument,
      shares: data.shares,
      avgPrice: data.avgPrice,
      currentPrice,
      totalInvested: data.totalInvested,
      currentValue,
      profitLoss,
      profitLossPercent,
    };
  });

  const totalInvestedStockValue = holdingsList.reduce((acc, h) => acc + h.currentValue, 0);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* 1. Piggy Bank Vault Summary */}
      <div className="bg-gradient-to-r from-amber-100 via-orange-100 to-amber-50 border-2 border-amber-300 rounded-3xl p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-3xl bg-white border-2 border-amber-300 flex items-center justify-center text-5xl shadow-sm shrink-0 animate-float">
              🐷
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-bold text-2xl text-slate-900">
                  Pip the Piggy Banker&apos;s Vault
                </h2>
                <span className="text-xs bg-amber-200 text-amber-950 font-extrabold px-2.5 py-0.5 rounded-full border border-amber-300">
                  Level {level}: {levelTitle}
                </span>
              </div>
              <p className="text-xs md:text-sm text-slate-700 mt-1 max-w-xl leading-relaxed">
                Welcome to your official treasure chest! Track all your owned company slices, count your pretend
                ChibiCoins, and view your earned achievement badges!
              </p>
            </div>
          </div>

          {/* 3 Metric Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto">
            <div className="bg-white/90 border-2 border-amber-200 rounded-2xl p-3 text-center">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase">Total Net Worth</span>
              <div className="font-heading text-lg md:text-xl font-bold text-slate-900 tabular-nums">
                {formatCoins(totalPortfolioValue)} <span className="text-xs text-amber-600">CC</span>
              </div>
            </div>

            <div className="bg-white/90 border-2 border-amber-200 rounded-2xl p-3 text-center">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase">Piggy Cash Coins</span>
              <div className="font-heading text-lg md:text-xl font-bold text-amber-800 tabular-nums">
                {formatCoins(walletChibiCoins)} <span className="text-xs text-amber-600">CC</span>
              </div>
            </div>

            <div className="bg-white/90 border-2 border-emerald-300 rounded-2xl p-3 text-center col-span-2 sm:col-span-1">
              <span className="text-[10px] font-extrabold text-emerald-700 uppercase">Total Profit</span>
              <div className="font-heading text-lg md:text-xl font-bold text-emerald-600 tabular-nums">
                +{formatCoins(totalProfitLoss)} <span className="text-xs font-semibold">({totalProfitPercent.toFixed(1)}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Owned Slices Breakdown */}
      <section aria-labelledby="holdings-heading">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🍕</span>
            <h3 id="holdings-heading" className="font-heading font-bold text-lg text-slate-900">
              Your Company Slices (Portfolio Holdings)
            </h3>
          </div>
          <button
            onClick={() => {
              if (soundEnabled) playChibiSound('pop');
              onOpenNewOrder();
            }}
            className="bg-amber-500 hover:bg-amber-600 text-white font-heading font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            + Buy More Slices
          </button>
        </div>

        {holdingsList.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-amber-300 rounded-3xl p-8 text-center space-y-3">
            <span className="text-5xl">🛒</span>
            <h4 className="font-heading font-bold text-lg text-slate-800">Your Vault is Empty!</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven&apos;t bought any company slices yet. Use your 10,000 ChibiCoins to buy your first shares in Apple, Roblox, or Disney!
            </p>
            <button
              onClick={() => onOpenNewOrder()}
              className="bg-amber-500 hover:bg-amber-600 text-white font-heading font-bold text-xs px-4 py-2 rounded-xl"
            >
              Browse Companies Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {holdingsList.map((item) => {
              const isProfit = item.profitLoss >= 0;
              return (
                <div
                  key={item.symbol}
                  className="bg-white border-2 border-amber-200/80 rounded-3xl p-4 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-3xl">{item.instrument?.mascotEmoji || '🏢'}</span>
                        <div>
                          <div className="font-heading font-bold text-base text-slate-900">{item.symbol}</div>
                          <div className="text-xs text-slate-500">{item.instrument?.name || item.symbol}</div>
                        </div>
                      </div>
                      <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                        {item.shares} Slices
                      </span>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 mt-3 space-y-1 text-xs">
                      <div className="flex justify-between text-slate-600">
                        <span>Avg Cost:</span>
                        <span className="font-bold text-slate-800">${item.avgPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Current Value:</span>
                        <span className="font-bold text-slate-800">${item.currentValue.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-semibold">Profit:</span>
                    <span
                      className={`text-xs font-extrabold ${
                        isProfit ? 'text-emerald-600' : 'text-rose-500'
                      }`}
                    >
                      {isProfit ? '+' : ''}${item.profitLoss.toFixed(2)} ({isProfit ? '+' : ''}
                      {item.profitLossPercent.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 3. Trophies & Badges Shelf */}
      <section aria-labelledby="badges-heading">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">🏆</span>
          <h3 id="badges-heading" className="font-heading font-bold text-lg text-slate-900">
            Trophies &amp; Achievements Shelf
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`rounded-2xl p-3.5 border-2 text-center flex flex-col items-center justify-between transition-all ${
                badge.unlocked
                  ? 'bg-gradient-to-b from-amber-50 to-orange-50 border-amber-300 shadow-xs scale-100'
                  : 'bg-slate-50 border-slate-200 opacity-60'
              }`}
            >
              <div className="text-3xl mb-1">{badge.emoji}</div>
              <div className="font-heading font-bold text-xs text-slate-900 leading-tight">
                {badge.title}
              </div>
              <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-tight">
                {badge.description}
              </p>
              <span
                className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full mt-2 ${
                  badge.unlocked
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {badge.unlocked ? 'Unlocked! 🌟' : 'Locked 🔒'}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Transactions Receipt Log */}
      <section aria-labelledby="history-heading">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">🧾</span>
          <h3 id="history-heading" className="font-heading font-bold text-lg text-slate-900">
            Piggy Bank Trade Receipts ({transactions.length} Total)
          </h3>
        </div>

        <div className="bg-white border-2 border-amber-200/80 rounded-3xl overflow-hidden shadow-xs">
          <div className="divide-y divide-slate-100">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="p-4 hover:bg-amber-50/50 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-heading font-bold text-xs ${
                      tx.type === 'BUY'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}
                  >
                    {tx.type}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-sm text-slate-900">{tx.symbol}</span>
                      <span className="text-xs text-slate-500">{tx.chibiName}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">{tx.mascotTip}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 self-end md:self-auto text-right">
                  <div>
                    <div className="font-heading font-bold text-sm text-slate-900 tabular-nums">
                      {tx.qty} shares @ ${tx.price.toFixed(2)}
                    </div>
                    <div className="text-[11px] text-slate-400">Total: ${tx.totalValue.toFixed(2)}</div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {tx.status}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5">{tx.date}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
