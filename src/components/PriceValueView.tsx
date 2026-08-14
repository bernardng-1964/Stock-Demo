import React, { useState } from 'react';
import {
  Tag,
  Sliders,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Calculator,
} from 'lucide-react';
import { StockInstrument } from '../types';
import { playChibiSound } from '../utils/formatters';

interface PriceValueViewProps {
  instruments: StockInstrument[];
  selectedStock: StockInstrument;
  onSelectStock: (stock: StockInstrument) => void;
  onOpenNewOrder: (symbol?: string) => void;
  soundEnabled: boolean;
}

export const PriceValueView: React.FC<PriceValueViewProps> = ({
  instruments,
  selectedStock,
  onSelectStock,
  onOpenNewOrder,
  soundEnabled,
}) => {
  // Sensitivity sliders for the Lemonade Stand DCF model
  const [growthRate, setGrowthRate] = useState(8.5); // %
  const [profitMargin, setProfitMargin] = useState(25.0); // %
  const [discountRate, setDiscountRate] = useState(8.5); // %

  // Dynamic DCF calculation based on user's lemonade stand inputs
  // Base fair value adjusted by growth and discount sensitivity
  const growthMultiplier = 1 + (growthRate - 8.5) * 0.035;
  const discountMultiplier = 1 - (discountRate - 8.5) * 0.045;
  const marginMultiplier = 1 + (profitMargin - 25.0) * 0.02;

  const dynamicFairValue = Math.max(
    5,
    +(selectedStock.fairValue * growthMultiplier * discountMultiplier * marginMultiplier).toFixed(2)
  );

  const discountDollars = +(dynamicFairValue - selectedStock.lastPrice).toFixed(2);
  const dynamicDiscountPercent = +((discountDollars / dynamicFairValue) * 100).toFixed(1);

  const isBargain = dynamicDiscountPercent > 0;
  const isMegaBargain = dynamicDiscountPercent >= 15;

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* 1. Header & Concept Explainer Banner */}
      <div className="bg-gradient-to-r from-indigo-100 via-purple-100 to-amber-50 border-2 border-indigo-200 rounded-3xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white border-2 border-indigo-300 flex items-center justify-center text-4xl shadow-sm shrink-0">
              🦉
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-xl text-slate-900">
                  Professor Ollie Owl&apos;s Bargain Detective
                </span>
                <span className="text-xs bg-indigo-200 text-indigo-900 font-bold px-2 py-0.5 rounded-full border border-indigo-300">
                  Price vs. Fair Value
                </span>
              </div>
              <p className="text-xs md:text-sm text-slate-700 mt-1 max-w-2xl leading-relaxed">
                <strong>The Secret Rule:</strong> Never judge a stock by its price tag alone! Always compare what it
                costs (Price) with what the business is truly worth (Fair Value). Look for discounts!
              </p>
            </div>
          </div>

          <div className="bg-white/90 border-2 border-indigo-200 px-4 py-2.5 rounded-2xl shrink-0 flex items-center gap-3">
            <span className="text-2xl">🏷️</span>
            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase">Detective Goal</span>
              <span className="text-xs font-bold text-indigo-900">Find stocks with +5% or more discount!</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Stock Selector Pills */}
      <div className="bg-white border-2 border-amber-200/80 rounded-2xl p-4 shadow-xs">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
          Select a Company to Inspect:
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {instruments.map((stk) => {
            const isSelected = stk.symbol === selectedStock.symbol;
            return (
              <button
                key={stk.symbol}
                onClick={() => {
                  if (soundEnabled) playChibiSound('pop');
                  onSelectStock(stk);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-heading font-bold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm scale-105'
                    : 'bg-amber-50 hover:bg-amber-100 text-slate-700 border border-amber-200'
                }`}
              >
                <span className="text-base">{stk.mascotEmoji}</span>
                <span>{stk.symbol}</span>
                <span className="text-[10px] opacity-80">${stk.lastPrice.toFixed(0)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Main Hero Valuation Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: The Visual Bargain Meter */}
        <div className="lg:col-span-2 bg-white border-2 border-amber-200/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="text-5xl">{selectedStock.mascotEmoji}</span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading text-2xl font-bold text-slate-900">
                    {selectedStock.name} ({selectedStock.symbol})
                  </h3>
                  <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2.5 py-0.5 rounded-full">
                    {selectedStock.category}
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-500">{selectedStock.chibiName}</p>
              </div>
            </div>

            {/* Bargain Status Stamp */}
            <div
              className={`px-4 py-2 rounded-2xl border-2 font-heading font-bold text-sm shadow-xs flex items-center gap-2 ${
                isBargain
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  : 'bg-rose-100 text-rose-900 border-rose-300'
              }`}
            >
              {isBargain ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertTriangle className="w-5 h-5 text-rose-600" />}
              <span>
                {isMegaBargain
                  ? `🎉 MEGA BARGAIN (+${dynamicDiscountPercent}% OFF)`
                  : isBargain
                  ? `🏷️ ON SALE (+${dynamicDiscountPercent}% Discount)`
                  : `⚠️ Overpriced by ${Math.abs(dynamicDiscountPercent)}%`}
              </span>
            </div>
          </div>

          {/* 3 Metric Comparison Blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 text-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Market Price Today
              </span>
              <div className="font-heading text-2xl md:text-3xl font-extrabold text-slate-900 mt-1 tabular-nums">
                ${selectedStock.lastPrice.toFixed(2)}
              </div>
              <span className="text-[11px] text-slate-500">What you pay at the shop</span>
            </div>

            <div className="bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-4 text-center">
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-wide">
                Estimated True Value
              </span>
              <div className="font-heading text-2xl md:text-3xl font-extrabold text-indigo-900 mt-1 tabular-nums">
                ${dynamicFairValue.toFixed(2)}
              </div>
              <span className="text-[11px] text-indigo-600">Calculated DCF True Worth</span>
            </div>

            <div
              className={`rounded-2xl p-4 text-center border-2 ${
                isBargain
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              <span className="text-xs font-bold uppercase tracking-wide">
                Margin of Safety
              </span>
              <div className="font-heading text-2xl md:text-3xl font-extrabold mt-1 tabular-nums">
                {isBargain ? '+' : ''}
                {dynamicDiscountPercent}%
              </div>
              <span className="text-[11px]">
                {isBargain ? 'Discount savings cushion' : 'Trading at a premium'}
              </span>
            </div>
          </div>

          {/* Visual Bargain Scale Bar */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-slate-800 inline-block"></span>
                Market Price: ${selectedStock.lastPrice.toFixed(2)}
              </span>
              <span className="flex items-center gap-1 text-indigo-800">
                <span className="w-3 h-3 rounded-full bg-indigo-600 inline-block"></span>
                Ollie&apos;s Fair Value: ${dynamicFairValue.toFixed(2)}
              </span>
            </div>

            {/* Animated Bar Track */}
            <div className="w-full bg-slate-200 h-5 rounded-full overflow-hidden p-0.5 relative shadow-inner">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isBargain
                    ? 'bg-gradient-to-r from-emerald-400 to-teal-500'
                    : 'bg-gradient-to-r from-amber-400 to-rose-500'
                }`}
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(15, (selectedStock.lastPrice / (dynamicFairValue * 1.3)) * 100)
                  )}%`,
                }}
              ></div>
            </div>

            <p className="text-[11px] text-slate-500 text-center">
              {isBargain
                ? `🎉 When the green bar is shorter than the full value, you're buying at a juicy discount!`
                : `⚠️ The current market price is higher than the calculated true value.`}
            </p>
          </div>

          {/* Quick Trade Button */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-slate-600 font-semibold">
              Ready to invest in this company?
            </div>
            <button
              onClick={() => {
                if (soundEnabled) playChibiSound('pop');
                onOpenNewOrder(selectedStock.symbol);
              }}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-heading font-bold text-sm px-6 py-2.5 rounded-2xl shadow-sm hover:shadow active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            >
              <span>+ Buy {selectedStock.symbol} Slices</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right 1 Col: Interactive Lemonade Stand DCF Machine */}
        <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 border-2 border-amber-300 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-amber-400 flex items-center justify-center text-lg">
                🍋
              </div>
              <h4 className="font-heading font-bold text-base text-slate-900">
                The Lemonade Stand Machine
              </h4>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed mb-4">
              Slide the knobs to see how selling more toys or having higher profits changes the company&apos;s Fair Value!
            </p>

            {/* Slider 1: Growth Rate */}
            <div className="space-y-1 mb-4 bg-white/80 border border-amber-200 rounded-xl p-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <label htmlFor="slider-growth" className="flex items-center gap-1 cursor-pointer">
                  <span>🚀 5-Year Growth Rate:</span>
                </label>
                <span className="text-amber-700 font-extrabold tabular-nums">{growthRate.toFixed(1)}%</span>
              </div>
              <p className="text-[10px] text-slate-500">How many more games/gadgets they sell each year</p>
              <input
                id="slider-growth"
                type="range"
                min="2"
                max="25"
                step="0.5"
                value={growthRate}
                onChange={(e) => setGrowthRate(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Slider 2: Profit Margin */}
            <div className="space-y-1 mb-4 bg-white/80 border border-amber-200 rounded-xl p-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <label htmlFor="slider-margin" className="flex items-center gap-1 cursor-pointer">
                  <span>🍯 Profit Margin per Sale:</span>
                </label>
                <span className="text-amber-700 font-extrabold tabular-nums">{profitMargin.toFixed(1)}%</span>
              </div>
              <p className="text-[10px] text-slate-500">Money kept after paying workers &amp; materials</p>
              <input
                id="slider-margin"
                type="range"
                min="10"
                max="45"
                step="1"
                value={profitMargin}
                onChange={(e) => setProfitMargin(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Slider 3: Discount Rate / Patience */}
            <div className="space-y-1 bg-white/80 border border-amber-200 rounded-xl p-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <label htmlFor="slider-discount" className="flex items-center gap-1 cursor-pointer">
                  <span>⏳ Patience &amp; Safety Rate:</span>
                </label>
                <span className="text-amber-700 font-extrabold tabular-nums">{discountRate.toFixed(1)}%</span>
              </div>
              <p className="text-[10px] text-slate-500">Interest rate &amp; required return on your coins</p>
              <input
                id="slider-discount"
                type="range"
                min="6"
                max="14"
                step="0.5"
                value={discountRate}
                onChange={(e) => setDiscountRate(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Reset Sliders */}
          <button
            onClick={() => {
              if (soundEnabled) playChibiSound('pop');
              setGrowthRate(8.5);
              setProfitMargin(25.0);
              setDiscountRate(8.5);
            }}
            className="w-full text-xs font-bold text-amber-800 hover:text-amber-950 py-1.5 rounded-lg border border-amber-300 hover:bg-amber-200/60 transition-colors cursor-pointer"
          >
            Reset Machine to Defaults 🔄
          </button>
        </div>
      </div>

      {/* 4. Ollie Owl Detective Notes */}
      <div className="bg-white border-2 border-amber-200/80 rounded-3xl p-5 shadow-xs space-y-3">
        <h4 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
          <span>🦉</span>
          <span>Ollie Owl&apos;s Field Notes on {selectedStock.name}</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3">
            <span className="font-bold text-amber-900 block mb-1">🎮 What They Make</span>
            <p className="text-slate-700 leading-relaxed">
              {selectedStock.whatTheyMake.join(' • ')}
            </p>
          </div>

          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-3">
            <span className="font-bold text-indigo-900 block mb-1">🍦 Free Pocket Money (Dividends)</span>
            <p className="text-slate-700 leading-relaxed">
              {selectedStock.dividendPocketMoney}
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3">
            <span className="font-bold text-emerald-900 block mb-1">⭐ Surprising Fun Fact</span>
            <p className="text-slate-700 leading-relaxed">
              {selectedStock.funFact}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
