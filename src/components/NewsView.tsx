import React from 'react';
import { Newspaper, Sparkles, TrendingUp, Clock, Tag } from 'lucide-react';
import { NewsItem } from '../types';
import { chibiMascots } from '../data/mockData';

interface NewsViewProps {
  news: NewsItem[];
  onOpenNewOrder: (symbol?: string) => void;
  soundEnabled: boolean;
}

export const NewsView: React.FC<NewsViewProps> = ({ news, onOpenNewOrder }) => {
  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-amber-200 via-orange-200 to-yellow-100 border-2 border-amber-300 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white border-2 border-amber-300 flex items-center justify-center text-4xl shadow-sm shrink-0">
            📰
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-bold text-2xl text-slate-900">
                The Daily Junior Market Gazette
              </h2>
              <span className="text-xs bg-amber-400 text-amber-950 font-extrabold px-2.5 py-0.5 rounded-full">
                Decoded for Kids
              </span>
            </div>
            <p className="text-xs md:text-sm text-slate-700 mt-1 max-w-xl leading-relaxed">
              Real world company headlines translated into simple English! Discover what video game makers, gadget
              inventors, and theme parks are building this week!
            </p>
          </div>
        </div>
      </div>

      {/* 2. News Feed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {news.map((item) => {
          const mascot = chibiMascots[item.mascotReaction];

          return (
            <div
              key={item.id}
              className="bg-white border-2 border-amber-200/80 hover:border-amber-400 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Meta header */}
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                      {item.source}
                    </span>
                    {item.symbolTag && (
                      <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                        {item.symbolTag}
                      </span>
                    )}
                  </div>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {item.time}
                  </span>
                </div>

                {/* Kid Headline */}
                <h3 className="font-heading font-bold text-base md:text-lg text-slate-900 leading-snug">
                  {item.kidHeadline}
                </h3>

                {/* Kid Explanation */}
                <p className="text-xs md:text-sm text-slate-600 mt-2.5 leading-relaxed bg-slate-50 border border-slate-200/80 p-3 rounded-2xl">
                  {item.kidExplanation}
                </p>
              </div>

              {/* Mascot Reaction Bubble */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3 flex items-start gap-3">
                <span className="text-3xl shrink-0 mt-0.5">{mascot.avatar}</span>
                <div>
                  <span className="font-heading font-bold text-xs text-slate-900 block">
                    {mascot.name}&apos;s Reaction:
                  </span>
                  <p className="text-xs text-slate-700 italic mt-0.5 leading-relaxed">
                    &ldquo;{item.reactionQuote}&rdquo;
                  </p>
                </div>
              </div>

              {/* Bottom quick trade */}
              {item.symbolTag && (
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Interested in this company?</span>
                  <button
                    onClick={() => onOpenNewOrder(item.symbolTag)}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-heading font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-xs active:scale-95 transition-all cursor-pointer"
                  >
                    + Trade {item.symbolTag} Slice 🍕
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
