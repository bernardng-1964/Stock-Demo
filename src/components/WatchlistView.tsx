import React, { useState } from 'react';
import { Search, Filter, Sparkles, Tag, ArrowUpRight, ArrowDownRight, Layers, ArrowUpDown } from 'lucide-react';
import { StockInstrument } from '../types';
import { playChibiSound, getSparklineSvgPath } from '../utils/formatters';

interface WatchlistViewProps {
  instruments: StockInstrument[];
  onOpenNewOrder: (symbol?: string) => void;
  onSelectInstrument: (symbol: string) => void;
  soundEnabled: boolean;
}

export const WatchlistView: React.FC<WatchlistViewProps> = ({
  instruments,
  onOpenNewOrder,
  onSelectInstrument,
  soundEnabled,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'discount' | 'price' | 'change' | 'name'>('discount');

  const categories = [
    { id: 'ALL', label: '🌟 All Companies' },
    { id: 'Gaming & Gadgets', label: '🎮 Gaming & Gadgets' },
    { id: 'Toys & Cartoons', label: '🏰 Toys & Cartoons' },
    { id: 'Snacks & Fun', label: '🍟 Snacks & Fun' },
    { id: 'Future Tech', label: '⚡ Future Tech' },
    { id: 'Everyday Life', label: '📦 Everyday Life' },
    { id: 'BARGAIN', label: '🏷️ On Sale Only' },
  ];

  // Filtering
  const filtered = instruments.filter((stk) => {
    const matchesSearch =
      stk.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stk.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stk.chibiName.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedCategory === 'ALL') return true;
    if (selectedCategory === 'BARGAIN') return stk.discountPercent > 0;
    return stk.category === selectedCategory;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'discount') return b.discountPercent - a.discountPercent;
    if (sortBy === 'price') return b.lastPrice - a.lastPrice;
    if (sortBy === 'change') return b.changePercent - a.changePercent;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* 1. Header & Filters */}
      <div className="bg-white border-2 border-amber-200/80 rounded-3xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔍</span>
              <h2 className="font-heading font-bold text-xl text-slate-900">
                Chibi Company Directory &amp; Screener
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Explore all {instruments.length} companies, filter by fun categories, and hunt for discounts!
            </p>
          </div>

          {/* Search Input & Sort Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search symbol or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2.5 py-2 rounded-xl text-xs font-bold text-slate-700">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="discount">Sort: Biggest Bargain 🏷️</option>
                <option value="change">Sort: Today&apos;s Gain 🚀</option>
                <option value="price">Sort: Price (High to Low) 💰</option>
                <option value="name">Sort: Name (A-Z) 🔤</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
          {categories.map((cat) => {
            const isCatActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  if (soundEnabled) playChibiSound('pop');
                  setSelectedCategory(cat.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold transition-all shrink-0 cursor-pointer ${
                  isCatActive
                    ? 'bg-amber-500 text-white shadow-xs scale-105'
                    : 'bg-amber-50 hover:bg-amber-100 text-slate-700 border border-amber-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Stock Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sorted.map((stock) => {
          const isGain = stock.change >= 0;
          const isDiscount = stock.discountPercent > 0;
          const { path } = getSparklineSvgPath(stock.sparkline, 90, 26);

          return (
            <div
              key={stock.symbol}
              className="bg-white border-2 border-amber-200/80 hover:border-amber-400 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl group-hover:scale-110 transition-transform">
                      {stock.mascotEmoji}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-heading font-bold text-base text-slate-900">
                          {stock.name}
                        </h3>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600">
                          {stock.symbol}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-500">{stock.chibiName}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-heading font-bold text-base text-slate-900 tabular-nums">
                      ${stock.lastPrice.toFixed(2)}
                    </div>
                    <div
                      className={`text-xs font-bold flex items-center justify-end ${
                        isGain ? 'text-emerald-600' : 'text-rose-500'
                      }`}
                    >
                      {isGain ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                      {isGain ? '+' : ''}
                      {stock.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>

                {/* Kid Explanation */}
                <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                  {stock.kidExplanation}
                </p>

                {/* What they make tags */}
                <div className="flex flex-wrap gap-1 mt-2.5">
                  {stock.whatTheyMake.slice(0, 3).map((item, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-slate-50 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                {/* Valuation & Dividend Box */}
                <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-3 mt-3 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-medium">True Fair Value:</span>
                    <span className="font-bold text-indigo-900 tabular-nums">
                      ${stock.fairValue.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-medium">Bargain Status:</span>
                    <span
                      className={`font-extrabold px-2 py-0.5 rounded-md ${
                        isDiscount
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isDiscount ? `+${stock.discountPercent.toFixed(1)}% Discount 🏷️` : 'Overpriced ⚠️'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-amber-200/60">
                    <span>🍦 Pocket Money:</span>
                    <span className="font-semibold text-slate-700">{stock.dividendPocketMoney}</span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <svg className="w-20 h-6 overflow-visible" viewBox="0 0 90 26">
                  <path
                    d={path}
                    fill="none"
                    stroke={isGain ? '#10b981' : '#f43f5e'}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (soundEnabled) playChibiSound('pop');
                      onSelectInstrument(stock.symbol);
                    }}
                    className="text-xs font-bold text-slate-600 hover:text-amber-600 px-2 py-1 rounded-lg hover:bg-amber-50 cursor-pointer"
                  >
                    Inspect 🔍
                  </button>
                  <button
                    onClick={() => {
                      if (soundEnabled) playChibiSound('pop');
                      onOpenNewOrder(stock.symbol);
                    }}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-heading font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-xs active:scale-95 transition-all cursor-pointer"
                  >
                    + Buy Slice 🍕
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
