import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Tag,
  GraduationCap,
  Coins,
  Smile,
} from 'lucide-react';
import { StockInstrument, MarketIndex, NewsItem, Timeframe, ChibiMascotId } from '../types';
import { chibiMascots } from '../data/mockData';
import { formatCoins, getSparklineSvgPath, playChibiSound } from '../utils/formatters';

interface DashboardViewProps {
  indices: MarketIndex[];
  instruments: StockInstrument[];
  news: NewsItem[];
  onOpenNewOrder: (symbol?: string) => void;
  onSelectInstrument: (symbol: string) => void;
  onNavigateToTab: (tab: string) => void;
  soundEnabled: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  indices,
  instruments,
  news,
  onOpenNewOrder,
  onSelectInstrument,
  onNavigateToTab,
  soundEnabled,
}) => {
  const [selectedIndexTimeframe, setSelectedIndexTimeframe] = useState<Timeframe>('1D');
  const [currentMascotIndex, setCurrentMascotIndex] = useState(0);

  const mascotKeys: ChibiMascotId[] = ['penny', 'bramble', 'barnaby', 'ollie', 'pip'];
  const activeMascot = chibiMascots[mascotKeys[currentMascotIndex]];

  // Sort instruments for top gainer and top bargain
  const topGainer = [...instruments].sort((a, b) => b.changePercent - a.changePercent)[0];
  const topBargain = [...instruments].sort((a, b) => b.discountPercent - a.discountPercent)[0];

  const greenCount = instruments.filter((i) => i.change >= 0).length;
  const redCount = instruments.length - greenCount;

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* 1. Market Weather & Chibi Mascot Welcome Banner */}
      <div className="bg-gradient-to-r from-amber-100 via-orange-100 to-amber-50 border-2 border-amber-300 rounded-3xl p-5 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          {/* Mascot speech bubble */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (soundEnabled) playChibiSound('pop');
                setCurrentMascotIndex((prev) => (prev + 1) % mascotKeys.length);
              }}
              title="Click to switch Chibi Advisor!"
              className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-white border-2 border-amber-300 flex items-center justify-center text-4xl md:text-5xl shadow-md hover:scale-105 active:scale-95 transition-transform cursor-pointer shrink-0 animate-float"
            >
              {activeMascot.avatar}
            </button>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-heading font-bold text-base md:text-lg text-slate-900">
                  {activeMascot.name}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-200 text-amber-900 border border-amber-300">
                  {activeMascot.role}
                </span>
                <span className="text-[11px] text-slate-500 font-semibold cursor-pointer hover:underline" onClick={() => setCurrentMascotIndex((prev) => (prev + 1) % mascotKeys.length)}>
                  (Click to Switch 🔄)
                </span>
              </div>
              <p className="text-sm md:text-base font-semibold text-slate-700 max-w-2xl leading-snug">
                &ldquo;{activeMascot.tagline}&rdquo;
              </p>
            </div>
          </div>

          {/* Market Weather Pill */}
          <div className="flex items-center gap-3 bg-white/90 border-2 border-amber-200 px-4 py-2.5 rounded-2xl shadow-xs shrink-0">
            <span className="text-3xl">☀️</span>
            <div className="flex flex-col">
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wide">Market Climate</span>
              <span className="text-sm font-extrabold text-emerald-700">
                {greenCount} Slices Green &bull; {redCount} on Sale!
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Major Market Indices ("The All-Star Teams") */}
      <section aria-labelledby="indices-heading">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌟</span>
            <h2 id="indices-heading" className="font-heading text-lg md:text-xl font-bold text-slate-900">
              The Big League Teams (Major Indices)
            </h2>
          </div>

          {/* Timeframe selector */}
          <div className="flex items-center bg-amber-100/70 p-1 rounded-xl border border-amber-200">
            {(['1D', '1W', '1M', 'YTD'] as Timeframe[]).map((tf) => (
              <button
                key={tf}
                onClick={() => {
                  if (soundEnabled) playChibiSound('pop');
                  setSelectedIndexTimeframe(tf);
                }}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  selectedIndexTimeframe === tf
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-amber-900 hover:bg-amber-200/60'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {indices.map((idx) => {
            const data = idx.timeframes[selectedIndexTimeframe];
            const isPos = data.changePercent >= 0;
            const { path, areaPath } = getSparklineSvgPath(data.sparkline, 120, 36);

            return (
              <div
                key={idx.symbol}
                className="bg-white border-2 border-amber-200/80 rounded-2xl p-4 shadow-xs hover:shadow-md hover:border-amber-400 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-500">{idx.name}</span>
                    <span className="text-lg">{idx.mascotEmoji}</span>
                  </div>
                  <div className="font-heading font-bold text-sm text-slate-800 leading-tight">
                    {idx.chibiTitle}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {idx.kidDesc}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-end justify-between">
                  <div>
                    <div className="font-bold text-base text-slate-800 tabular-nums">
                      {idx.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                    <div
                      className={`text-xs font-extrabold flex items-center gap-0.5 ${
                        isPos ? 'text-emerald-600' : 'text-rose-500'
                      }`}
                    >
                      {isPos ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                      {isPos ? '+' : ''}
                      {data.changePercent.toFixed(2)}%
                    </div>
                  </div>

                  {/* Cute Sparkline graph */}
                  <svg className="w-24 h-9 overflow-visible" viewBox="0 0 120 36">
                    <defs>
                      <linearGradient id={`grad-${idx.symbol}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={isPos ? '#10b981' : '#f43f5e'} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={isPos ? '#10b981' : '#f43f5e'} stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path d={areaPath} fill={`url(#grad-${idx.symbol})`} />
                    <path
                      d={path}
                      fill="none"
                      stroke={isPos ? '#059669' : '#e11d48'}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Featured Spotlight: Star Stock & Bargain of the Day */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Star Gainer Stock */}
        {topGainer && (
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-3xl p-5 shadow-xs relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{topGainer.mascotEmoji}</span>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded-full border border-emerald-400">
                    🚀 Today&apos;s Star Performer
                  </span>
                  <h3 className="font-heading text-lg font-bold text-slate-900 mt-1">
                    {topGainer.name} ({topGainer.symbol})
                  </h3>
                  <p className="text-xs text-slate-600">{topGainer.chibiName}</p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xl font-bold text-slate-900 tabular-nums">${topGainer.lastPrice.toFixed(2)}</div>
                <div className="text-sm font-extrabold text-emerald-600 flex items-center justify-end gap-0.5">
                  <ArrowUpRight className="w-4 h-4" />
                  +{topGainer.changePercent.toFixed(2)}%
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-700 bg-white/80 border border-emerald-200 rounded-xl p-3 my-3 leading-relaxed">
              💡 <strong>Why it&apos;s charging:</strong> {topGainer.kidExplanation}
            </p>

            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                onClick={() => {
                  if (soundEnabled) playChibiSound('pop');
                  onSelectInstrument(topGainer.symbol);
                }}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
              >
                Inspect Fair Value 🔍
              </button>
              <button
                onClick={() => {
                  if (soundEnabled) playChibiSound('pop');
                  onOpenNewOrder(topGainer.symbol);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-bold text-xs px-4 py-2 rounded-xl shadow-xs active:scale-95 transition-transform cursor-pointer"
              >
                Buy {topGainer.symbol} Slice 🍕
              </button>
            </div>
          </div>
        )}

        {/* Top Bargain Detective Pick */}
        {topBargain && (
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-300 rounded-3xl p-5 shadow-xs relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{topBargain.mascotEmoji}</span>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-800 bg-indigo-200/80 px-2 py-0.5 rounded-full border border-indigo-400">
                    🏷️ Ollie Owl&apos;s Top Bargain
                  </span>
                  <h3 className="font-heading text-lg font-bold text-slate-900 mt-1">
                    {topBargain.name} ({topBargain.symbol})
                  </h3>
                  <p className="text-xs text-slate-600">{topBargain.chibiName}</p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xl font-bold text-slate-900 tabular-nums">${topBargain.lastPrice.toFixed(2)}</div>
                <div className="text-xs font-extrabold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-md border border-indigo-200">
                  Fair Value: ${topBargain.fairValue.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="bg-white/80 border border-indigo-200 rounded-xl p-3 my-3 text-xs text-slate-700 leading-relaxed flex items-center justify-between">
              <div>
                <span className="font-bold text-indigo-900">Discount on Sale: </span>
                <span className="font-extrabold text-emerald-600">+{topBargain.discountPercent.toFixed(1)}% OFF</span>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Buying at a discount gives your piggy bank a safety cushion!
                </p>
              </div>
              <span className="text-2xl">🦉</span>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                onClick={() => {
                  if (soundEnabled) playChibiSound('pop');
                  onNavigateToTab('price-value');
                }}
                className="text-xs font-bold text-indigo-800 hover:text-indigo-950 underline cursor-pointer"
              >
                Open DCF Lemonade Machine 🍋
              </button>
              <button
                onClick={() => {
                  if (soundEnabled) playChibiSound('pop');
                  onOpenNewOrder(topBargain.symbol);
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-heading font-bold text-xs px-4 py-2 rounded-xl shadow-xs active:scale-95 transition-transform cursor-pointer"
              >
                Grab Bargain Slice 🏷️
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. Live Chibi Stock Ticker Universe */}
      <section aria-labelledby="stocks-grid-heading">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🍕</span>
            <h2 id="stocks-grid-heading" className="font-heading text-lg md:text-xl font-bold text-slate-900">
              Live Chibi Companies (Pick Your Slices!)
            </h2>
          </div>
          <button
            onClick={() => onNavigateToTab('watchlist')}
            className="text-xs font-bold text-amber-700 hover:text-amber-900 underline cursor-pointer"
          >
            View All with Filters &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {instruments.map((stock) => {
            const isGain = stock.change >= 0;
            const isDiscount = stock.discountPercent > 0;
            const { path } = getSparklineSvgPath(stock.sparkline, 80, 24);

            return (
              <div
                key={stock.symbol}
                className="bg-white border-2 border-amber-200/80 hover:border-amber-400 rounded-3xl p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-3xl group-hover:scale-110 transition-transform">
                        {stock.mascotEmoji}
                      </span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-heading font-bold text-base text-slate-900">
                            {stock.symbol}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600">
                            {stock.category}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-slate-500">{stock.name}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-base text-slate-900 tabular-nums">
                        ${stock.lastPrice.toFixed(2)}
                      </div>
                      <div
                        className={`text-xs font-bold flex items-center justify-end ${
                          isGain ? 'text-emerald-600' : 'text-rose-500'
                        }`}
                      >
                        {isGain ? '+' : ''}
                        {stock.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>

                  {/* Kid explanation */}
                  <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                    {stock.kidExplanation}
                  </p>

                  {/* Fun badges: Fair Value & Dividend */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                        isDiscount
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {isDiscount ? `🏷️ +${stock.discountPercent.toFixed(1)}% Discount` : '⚠️ Slightly Overpriced'}
                    </span>

                    {stock.dividendYield > 0 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                        🍦 Pocket Money Bonus
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <svg className="w-20 h-6 overflow-visible" viewBox="0 0 80 24">
                    <path
                      d={path}
                      fill="none"
                      stroke={isGain ? '#10b981' : '#f43f5e'}
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        if (soundEnabled) playChibiSound('pop');
                        onSelectInstrument(stock.symbol);
                      }}
                      className="text-xs font-bold text-slate-600 hover:text-amber-600 px-2 py-1 rounded-lg hover:bg-amber-50 cursor-pointer"
                    >
                      Inspect
                    </button>
                    <button
                      onClick={() => {
                        if (soundEnabled) playChibiSound('pop');
                        onOpenNewOrder(stock.symbol);
                      }}
                      className="bg-amber-500 hover:bg-amber-600 text-white font-heading font-bold text-xs px-3 py-1.5 rounded-xl shadow-xs active:scale-95 transition-transform cursor-pointer"
                    >
                      + Buy Slice
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Chibi Academy Callout Card */}
      <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl shrink-0">
            🎓
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-200">
              Interactive Mini-Lessons
            </span>
            <h3 className="font-heading text-xl font-bold text-white mt-0.5">
              Learn What Stocks Are &amp; Earn +250 ChibiCoins!
            </h3>
            <p className="text-xs text-blue-100 max-w-xl mt-1">
              Read 5-minute illustrated stories about the Pizza Slice secret, Bulls vs. Bears, and how to spot real discounts!
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (soundEnabled) playChibiSound('pop');
            onNavigateToTab('academy');
          }}
          className="bg-amber-400 hover:bg-amber-300 text-amber-950 font-heading font-extrabold text-sm px-6 py-3 rounded-2xl shadow-md hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer flex items-center gap-2"
        >
          <GraduationCap className="w-4 h-4" />
          <span>Start Chibi Quest &rarr;</span>
        </button>
      </div>
    </div>
  );
};
