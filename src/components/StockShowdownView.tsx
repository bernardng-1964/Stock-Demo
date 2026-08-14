import React, { useState } from 'react';
import { Swords, Trophy, Sparkles, ArrowRight, ShieldCheck, Check, Zap } from 'lucide-react';
import { StockInstrument } from '../types';
import { playChibiSound } from '../utils/formatters';

interface StockShowdownViewProps {
  instruments: StockInstrument[];
  onOpenNewOrder: (symbol?: string) => void;
  soundEnabled: boolean;
}

export const StockShowdownView: React.FC<StockShowdownViewProps> = ({
  instruments,
  onOpenNewOrder,
  soundEnabled,
}) => {
  const [stock1Symbol, setStock1Symbol] = useState<string>('AAPL');
  const [stock2Symbol, setStock2Symbol] = useState<string>('NVDA');

  const stock1 = instruments.find((s) => s.symbol === stock1Symbol) || instruments[0];
  const stock2 = instruments.find((s) => s.symbol === stock2Symbol) || instruments[1];

  // Showdown metrics comparison
  const stock1BargainWins = stock1.discountPercent > stock2.discountPercent;
  const stock1DividendWins = stock1.dividendYield > stock2.dividendYield;
  const stock1GrowthWins = stock1.changePercent > stock2.changePercent;

  let stock1Score = 0;
  if (stock1BargainWins) stock1Score += 1;
  if (stock1DividendWins) stock1Score += 1;
  if (stock1GrowthWins) stock1Score += 1;
  const stock2Score = 3 - stock1Score;

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-orange-100 via-amber-100 to-rose-100 border-2 border-orange-300 rounded-3xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white border-2 border-orange-300 flex items-center justify-center text-4xl shadow-sm shrink-0 animate-wiggle">
              ⚔️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-bold text-xl text-slate-900">
                  Chibi Stock Showdown (Battle of the Slices!)
                </h2>
                <span className="text-xs bg-orange-200 text-orange-950 font-bold px-2.5 py-0.5 rounded-full border border-orange-400">
                  Head-to-Head Arena
                </span>
              </div>
              <p className="text-xs md:text-sm text-slate-700 mt-1 max-w-2xl leading-relaxed">
                Can&apos;t decide which company to invest your ChibiCoins in? Put any two titans into the arena and
                compare their discounts, pocket money dividends, and superpowers!
              </p>
            </div>
          </div>

          {/* Quick Swap */}
          <button
            onClick={() => {
              if (soundEnabled) playChibiSound('pop');
              const temp = stock1Symbol;
              setStock1Symbol(stock2Symbol);
              setStock2Symbol(temp);
            }}
            className="bg-white hover:bg-orange-50 border-2 border-orange-300 text-orange-900 font-heading font-bold text-xs px-4 py-2 rounded-xl shadow-xs active:scale-95 transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <Swords className="w-4 h-4" />
            <span>Swap Fighters 🔄</span>
          </button>
        </div>
      </div>

      {/* 2. Fighters Selector Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fighter 1 Picker */}
        <div className="bg-blue-50/80 border-2 border-blue-200 rounded-2xl p-4">
          <label htmlFor="fighter-1-select" className="text-xs font-bold text-blue-900 uppercase block mb-1.5 cursor-pointer">
            Select Fighter #1 (Blue Corner 🥊):
          </label>
          <select
            id="fighter-1-select"
            value={stock1Symbol}
            onChange={(e) => {
              if (soundEnabled) playChibiSound('pop');
              setStock1Symbol(e.target.value);
            }}
            className="w-full bg-white border-2 border-blue-300 rounded-xl px-3 py-2 text-sm font-heading font-bold text-slate-800 focus:outline-none focus:border-blue-500"
          >
            {instruments.map((stk) => (
              <option key={stk.symbol} value={stk.symbol}>
                {stk.mascotEmoji} {stk.name} ({stk.symbol}) - ${stk.lastPrice.toFixed(2)}
              </option>
            ))}
          </select>
        </div>

        {/* Fighter 2 Picker */}
        <div className="bg-rose-50/80 border-2 border-rose-200 rounded-2xl p-4">
          <label htmlFor="fighter-2-select" className="text-xs font-bold text-rose-900 uppercase block mb-1.5 cursor-pointer">
            Select Fighter #2 (Red Corner 🥊):
          </label>
          <select
            id="fighter-2-select"
            value={stock2Symbol}
            onChange={(e) => {
              if (soundEnabled) playChibiSound('pop');
              setStock2Symbol(e.target.value);
            }}
            className="w-full bg-white border-2 border-rose-300 rounded-xl px-3 py-2 text-sm font-heading font-bold text-slate-800 focus:outline-none focus:border-rose-500"
          >
            {instruments.map((stk) => (
              <option key={stk.symbol} value={stk.symbol}>
                {stk.mascotEmoji} {stk.name} ({stk.symbol}) - ${stk.lastPrice.toFixed(2)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. The Arena Battle Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Fighter 1 Card */}
        <div className="bg-white border-3 border-blue-300 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-blue-500 text-white font-heading font-bold text-xs px-4 py-1 rounded-bl-2xl">
            Fighter #1
          </div>

          <div>
            <div className="flex items-center gap-3">
              <span className="text-5xl">{stock1.mascotEmoji}</span>
              <div>
                <h3 className="font-heading text-2xl font-bold text-slate-900">{stock1.name}</h3>
                <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                  {stock1.symbol} &bull; {stock1.category}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 mt-3 bg-blue-50/60 p-3 rounded-xl border border-blue-100 leading-relaxed">
              {stock1.kidExplanation}
            </p>
          </div>

          {/* Metric Rounds */}
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-600">Current Share Price:</span>
              <span className="font-heading font-bold text-sm text-slate-900 tabular-nums">
                ${stock1.lastPrice.toFixed(2)}
              </span>
            </div>

            <div
              className={`flex items-center justify-between p-2.5 rounded-xl border ${
                stock1BargainWins
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <span>🏷️ Bargain Discount:</span>
                {stock1BargainWins && <span className="text-[10px] bg-emerald-200 px-1.5 rounded">Round Winner! 🏆</span>}
              </span>
              <span className="font-heading font-extrabold tabular-nums">
                +{stock1.discountPercent.toFixed(1)}% OFF
              </span>
            </div>

            <div
              className={`flex items-center justify-between p-2.5 rounded-xl border ${
                stock1DividendWins
                  ? 'bg-amber-50 border-amber-300 text-amber-950 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <span>🍦 Free Pocket Money:</span>
                {stock1DividendWins && <span className="text-[10px] bg-amber-200 px-1.5 rounded">Round Winner! 🏆</span>}
              </span>
              <span className="font-heading font-bold tabular-nums">
                {stock1.dividendYield.toFixed(2)}% Yield
              </span>
            </div>

            <div
              className={`flex items-center justify-between p-2.5 rounded-xl border ${
                stock1GrowthWins
                  ? 'bg-blue-50 border-blue-300 text-blue-950 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <span>🚀 Today&apos;s Sprint:</span>
                {stock1GrowthWins && <span className="text-[10px] bg-blue-200 px-1.5 rounded">Round Winner! 🏆</span>}
              </span>
              <span className="font-heading font-bold tabular-nums">
                {stock1.changePercent >= 0 ? '+' : ''}
                {stock1.changePercent.toFixed(2)}%
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              if (soundEnabled) playChibiSound('pop');
              onOpenNewOrder(stock1.symbol);
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-heading font-bold text-sm py-2.5 rounded-2xl shadow-xs active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>+ Buy {stock1.symbol} Slices 🍕</span>
          </button>
        </div>

        {/* Fighter 2 Card */}
        <div className="bg-white border-3 border-rose-300 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-rose-500 text-white font-heading font-bold text-xs px-4 py-1 rounded-bl-2xl">
            Fighter #2
          </div>

          <div>
            <div className="flex items-center gap-3">
              <span className="text-5xl">{stock2.mascotEmoji}</span>
              <div>
                <h3 className="font-heading text-2xl font-bold text-slate-900">{stock2.name}</h3>
                <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
                  {stock2.symbol} &bull; {stock2.category}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 mt-3 bg-rose-50/60 p-3 rounded-xl border border-rose-100 leading-relaxed">
              {stock2.kidExplanation}
            </p>
          </div>

          {/* Metric Rounds */}
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-600">Current Share Price:</span>
              <span className="font-heading font-bold text-sm text-slate-900 tabular-nums">
                ${stock2.lastPrice.toFixed(2)}
              </span>
            </div>

            <div
              className={`flex items-center justify-between p-2.5 rounded-xl border ${
                !stock1BargainWins
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <span>🏷️ Bargain Discount:</span>
                {!stock1BargainWins && <span className="text-[10px] bg-emerald-200 px-1.5 rounded">Round Winner! 🏆</span>}
              </span>
              <span className="font-heading font-extrabold tabular-nums">
                +{stock2.discountPercent.toFixed(1)}% OFF
              </span>
            </div>

            <div
              className={`flex items-center justify-between p-2.5 rounded-xl border ${
                !stock1DividendWins
                  ? 'bg-amber-50 border-amber-300 text-amber-950 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <span>🍦 Free Pocket Money:</span>
                {!stock1DividendWins && <span className="text-[10px] bg-amber-200 px-1.5 rounded">Round Winner! 🏆</span>}
              </span>
              <span className="font-heading font-bold tabular-nums">
                {stock2.dividendYield.toFixed(2)}% Yield
              </span>
            </div>

            <div
              className={`flex items-center justify-between p-2.5 rounded-xl border ${
                !stock1GrowthWins
                  ? 'bg-rose-50 border-rose-300 text-rose-950 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <span>🚀 Today&apos;s Sprint:</span>
                {!stock1GrowthWins && <span className="text-[10px] bg-rose-200 px-1.5 rounded">Round Winner! 🏆</span>}
              </span>
              <span className="font-heading font-bold tabular-nums">
                {stock2.changePercent >= 0 ? '+' : ''}
                {stock2.changePercent.toFixed(2)}%
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              if (soundEnabled) playChibiSound('pop');
              onOpenNewOrder(stock2.symbol);
            }}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-heading font-bold text-sm py-2.5 rounded-2xl shadow-xs active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>+ Buy {stock2.symbol} Slices 🍕</span>
          </button>
        </div>
      </div>

      {/* 4. Penny Panda's Showdown Verdict Card */}
      <div className="bg-gradient-to-r from-amber-100 via-orange-50 to-amber-100 border-2 border-amber-300 rounded-3xl p-5 shadow-xs flex items-center gap-4">
        <span className="text-4xl shrink-0">🐼</span>
        <div>
          <h4 className="font-heading font-bold text-base text-slate-900">
            Penny Panda&apos;s Showdown Verdict
          </h4>
          <p className="text-xs md:text-sm text-slate-700 mt-1 leading-relaxed">
            {stock1Score > stock2Score ? (
              <>
                <strong>{stock1.name}</strong> leads this match with higher discount &amp; value points! However,{' '}
                <strong>{stock2.name}</strong> is also a world-class creator. Remember Penny&apos;s golden rule: Why choose
                only one when you can own both in your diversified basket? 🧺
              </>
            ) : (
              <>
                <strong>{stock2.name}</strong> takes the championship belt today! But both companies are loved by
                millions of kids and families across the planet.
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
