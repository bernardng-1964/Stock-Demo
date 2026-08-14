import React from 'react';
import {
  TrendingUp,
  Tag,
  Swords,
  Layers,
  PiggyBank,
  GraduationCap,
  Bot,
  Newspaper,
  Award,
  Sparkles,
} from 'lucide-react';
import { PortfolioStats } from '../types';
import { playChibiSound } from '../utils/formatters';

export type TabType =
  | 'dashboard'
  | 'price-value'
  | 'showdown'
  | 'watchlist'
  | 'transactions'
  | 'academy'
  | 'advisor'
  | 'news';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  portfolioStats?: PortfolioStats;
  soundEnabled: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  portfolioStats,
  soundEnabled,
}) => {
  const level = portfolioStats?.level ?? 1;
  const levelTitle = portfolioStats?.levelTitle ?? 'Chibi Stock Explorer';
  const badges = portfolioStats?.badges ?? [];

  const navItems: { id: TabType; label: string; emoji: string; badge?: string; desc: string }[] = [
    {
      id: 'dashboard',
      label: 'Chibi Exchange',
      emoji: '🎪',
      desc: 'Live stock prices & today’s star picks',
    },
    {
      id: 'price-value',
      label: 'Bargain Detective',
      emoji: '🏷️',
      badge: 'DCF Game',
      desc: 'Is it on sale or overpriced?',
    },
    {
      id: 'showdown',
      label: 'Stock Showdown',
      emoji: '⚔️',
      badge: 'Battle',
      desc: 'Compare any 2 companies head-to-head',
    },
    {
      id: 'watchlist',
      label: 'All Companies',
      emoji: '🔍',
      desc: 'Gaming, Tech, Cartoons & Snacks',
    },
    {
      id: 'transactions',
      label: 'My Piggy Vault',
      emoji: '🐷',
      badge: `Lvl ${level}`,
      desc: 'Your owned slices & trophy shelf',
    },
    {
      id: 'academy',
      label: 'Chibi Academy',
      emoji: '🎓',
      badge: 'Earn CC',
      desc: '5-min fun lessons & interactive quizzes',
    },
    {
      id: 'advisor',
      label: 'Ask Chibi AI',
      emoji: '🤖',
      badge: 'Gemini',
      desc: 'Ask Penny Panda & Ollie Owl anything!',
    },
    {
      id: 'news',
      label: 'Junior Gazette',
      emoji: '📰',
      desc: 'Kid-friendly market news decoded',
    },
  ];

  const handleTabClick = (id: TabType) => {
    if (soundEnabled) playChibiSound('pop');
    setActiveTab(id);
  };

  const unlockedBadgesCount = badges.filter((b) => b.unlocked).length;

  return (
    <aside className="w-full md:w-64 bg-white/90 border-r-2 border-amber-200/80 flex flex-col justify-between p-3 md:p-4 shrink-0 shadow-sm md:fixed md:top-16 md:bottom-0 md:left-0 z-40 overflow-y-auto">
      {/* Navigation List */}
      <div className="space-y-1">
        <div className="text-[11px] font-bold text-slate-400 px-3 py-1.5 uppercase tracking-wider flex items-center justify-between">
          <span>Explore Academy</span>
          <span className="text-amber-600 font-extrabold flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Fun Mode
          </span>
        </div>

        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-left font-heading transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-md scale-[1.02]'
                  : 'text-slate-700 hover:bg-amber-100/70 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl shrink-0">{item.emoji}</span>
                <div className="flex flex-col">
                  <span className={`text-sm font-bold leading-tight ${isActive ? 'text-white' : 'text-slate-800'}`}>
                    {item.label}
                  </span>
                  <span
                    className={`text-[11px] hidden sm:block ${
                      isActive ? 'text-amber-100' : 'text-slate-400'
                    }`}
                  >
                    {item.desc}
                  </span>
                </div>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border shadow-xs ${
                    isActive
                      ? 'bg-white/30 text-white border-white/40'
                      : 'bg-amber-100 text-amber-900 border-amber-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Chibi Level & Mascot Footer Card */}
      <div className="mt-4 pt-4 border-t-2 border-amber-200/60">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-3 shadow-inner text-left relative overflow-hidden">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5 font-heading">
              <Award className="w-4 h-4 text-amber-600" />
              {levelTitle}
            </span>
            <span className="text-[10px] bg-amber-200/80 text-amber-950 font-extrabold px-1.5 py-0.5 rounded-md">
              Level {level}
            </span>
          </div>

          <p className="text-[11px] text-slate-600 mb-2 leading-relaxed">
            🐼 Penny Panda: &ldquo;Complete quizzes and trade bargain slices to unlock rare trophies!&rdquo;
          </p>

          <div className="flex items-center justify-between text-[11px] font-bold text-amber-800">
            <span>Trophies Unlocked</span>
            <span>
              {unlockedBadgesCount} / {Math.max(badges.length, 1)} 🏆
            </span>
          </div>
          <div className="w-full bg-amber-200/80 h-2 rounded-full mt-1 overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{
                width: `${(unlockedBadgesCount / Math.max(badges.length, 1)) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </aside>
  );
};
