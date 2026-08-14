import React, { useState } from 'react';
import { Search, Sparkles, Coins, HelpCircle, Settings, Volume2, VolumeX, RefreshCw } from 'lucide-react';
import { StockInstrument, PortfolioStats } from '../types';
import { formatCoins, playChibiSound } from '../utils/formatters';

interface HeaderProps {
  onOpenNewOrder: (symbol?: string) => void;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
  instruments: StockInstrument[];
  onSelectInstrument: (symbol: string) => void;
  portfolioStats?: PortfolioStats;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isSyncing?: boolean;
  lastSyncTime?: string;
  onSyncAlpaca?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNewOrder,
  onOpenSettings,
  onOpenHelp,
  instruments,
  onSelectInstrument,
  portfolioStats,
  soundEnabled,
  onToggleSound,
  isSyncing = false,
  lastSyncTime,
  onSyncAlpaca,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const filteredInstruments = searchQuery.trim()
    ? instruments.filter(
        (inst) =>
          inst.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          inst.chibiName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSelectStock = (symbol: string) => {
    if (soundEnabled) playChibiSound('pop');
    onSelectInstrument(symbol);
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-b-2 border-amber-200/80 flex items-center justify-between px-3 md:px-6 z-50 shadow-sm">
      {/* Brand & Market Status */}
      <div className="flex items-center gap-3 md:gap-5">
        <div
          onClick={() => {
            if (soundEnabled) playChibiSound('pop');
          }}
          className="flex items-center gap-2 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-400 flex items-center justify-center text-2xl shadow-sm group-hover:scale-105 transition-transform">
            🐼
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-lg md:text-xl font-bold text-slate-800 tracking-tight leading-tight flex items-center gap-1.5">
              Chibi<span className="text-amber-500">Stock</span> Exchange
              <span className="hidden sm:inline-block text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full border border-amber-300">
                Kids 10+
              </span>
            </span>
            <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Alpaca Live Feed
              </span>
              {lastSyncTime && (
                <span className="hidden xl:inline-block text-slate-400 font-normal">
                  &bull; Synced {lastSyncTime}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Alpaca Sync Button */}
        {onSyncAlpaca && (
          <button
            onClick={() => {
              if (soundEnabled) playChibiSound('pop');
              onSyncAlpaca();
            }}
            disabled={isSyncing}
            title="Sync latest live prices with Alpaca Market Data API"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300/80 rounded-full text-xs font-bold transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-600 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Alpaca'}</span>
          </button>
        )}
      </div>

      {/* Center Search Bar with Kid-Friendly Suggestions */}
      <div className="hidden md:flex flex-1 max-w-md mx-6 relative">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="global-search-input"
            type="text"
            placeholder="Search cool companies (e.g. Apple, Roblox, Disney)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            className="w-full bg-amber-50/70 border-2 border-amber-200/80 rounded-full pl-10 pr-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:bg-white transition-all shadow-inner"
          />
        </div>

        {/* Dropdown Suggestions */}
        {isSearchFocused && filteredInstruments.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-amber-200 rounded-2xl shadow-xl overflow-hidden z-50 p-2 max-h-80 overflow-y-auto">
            <div className="text-[11px] font-bold text-slate-400 px-3 py-1 uppercase tracking-wider">
              Matching Companies
            </div>
            {filteredInstruments.map((inst) => (
              <button
                key={inst.symbol}
                onMouseDown={() => handleSelectStock(inst.symbol)}
                className="w-full flex items-center justify-between p-2.5 hover:bg-amber-50 rounded-xl text-left transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{inst.mascotEmoji}</span>
                  <div>
                    <div className="font-heading font-bold text-sm text-slate-800 group-hover:text-amber-600">
                      {inst.symbol} - {inst.name}
                    </div>
                    <div className="text-xs text-slate-500">{inst.chibiName}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm text-slate-800 tabular-nums">${inst.lastPrice.toFixed(2)}</div>
                  <div
                    className={`text-xs font-bold ${
                      inst.change >= 0 ? 'text-emerald-600' : 'text-rose-500'
                    }`}
                  >
                    {inst.change >= 0 ? '+' : ''}
                    {inst.changePercent.toFixed(2)}%
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Controls: Piggy Coins, Sound, Help, New Order */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Piggy Bank Cash Balance */}
        <div
          title="Your pretend spending money for trading!"
          className="flex items-center gap-2 bg-amber-100/80 border-2 border-amber-300/80 px-3 py-1.5 rounded-full shadow-sm"
        >
          <span className="text-lg">🐷</span>
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-bold text-amber-800 uppercase leading-none">Piggy Coins</span>
            <span className="text-sm font-bold text-amber-950 tabular-nums flex items-center gap-1">
              <Coins className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              {formatCoins(portfolioStats?.walletChibiCoins ?? 0)} <span className="text-[11px] font-medium text-amber-700">CC</span>
            </span>
          </div>
        </div>

        {/* Sound FX Toggle */}
        <button
          onClick={onToggleSound}
          title={soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
          className="p-2 rounded-full bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-700 transition-colors cursor-pointer"
          aria-label="Toggle Sound"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
        </button>

        {/* Settings */}
        <button
          onClick={() => {
            if (soundEnabled) playChibiSound('pop');
            onOpenSettings();
          }}
          title="Piggy Bank & App Settings"
          className="p-2 rounded-full bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-700 transition-colors cursor-pointer"
          aria-label="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Help Guide */}
        <button
          onClick={() => {
            if (soundEnabled) playChibiSound('pop');
            onOpenHelp();
          }}
          title="How to play and learn"
          className="p-2 rounded-full bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-700 transition-colors cursor-pointer"
          aria-label="Help & Guide"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Quick Trade Button */}
        <button
          onClick={() => {
            if (soundEnabled) playChibiSound('pop');
            onOpenNewOrder();
          }}
          className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-heading font-bold px-3.5 py-2 rounded-full shadow-sm hover:shadow active:scale-95 transition-all text-xs md:text-sm cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>+ Trade Shares</span>
        </button>
      </div>
    </header>
  );
};
