import React, { useState } from 'react';
import { Bot, Send, Sparkles, HelpCircle, Lightbulb, Tag, ShieldAlert, Award, MessageSquare } from 'lucide-react';
import { StockInstrument, AIAdvisorResponse } from '../types';
import { playChibiSound } from '../utils/formatters';

interface ChibiAdvisorViewProps {
  instruments: StockInstrument[];
  soundEnabled: boolean;
}

export const ChibiAdvisorView: React.FC<ChibiAdvisorViewProps> = ({ instruments, soundEnabled }) => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>('AAPL');
  const [customQuestion, setCustomQuestion] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [advisorData, setAdvisorData] = useState<AIAdvisorResponse | null>({
    answer:
      'Apple makes the iPhones, iPads, and MacBooks that kids and teachers love! When you buy a slice of Apple, you are a mini-partner in all their future gadget inventions! 🍎',
    analogy:
      'Think of it like owning 1 slice of a giant 10-slice pepperoni pizza. As the pizzeria sells more pizzas and gets famous, your 1 slice becomes worth much more than you paid for it! 🍕',
    bargainVerdict: 'BARGAIN',
    pennyRule: 'Never spend all your coins at once! Keep some ChibiCoins in your piggy bank so you can buy more if prices drop! 🐷',
    funFact:
      'Did you know that Steve Jobs named the company "Apple" simply because he thought the fruit sounded fun, spirited, and not intimidating?',
    isAiGenerated: true,
  });

  const starterPrompts = [
    { label: '🍕 What is a stock share?', q: 'Explain what a stock share is using a pizza or lemonade stand analogy!' },
    { label: '🍪 Explain P/E Ratio with cookies!', q: 'What does P/E ratio mean in simple words for a 10-year-old?' },
    { label: '🏷️ How to find bargains?', q: 'How does Professor Ollie Owl know if a stock is on sale or overpriced?' },
    { label: '🍦 What is dividend pocket money?', q: 'Why do companies like Coca-Cola pay free dividend money to owners?' },
    { label: '🎮 Is Roblox or Apple on sale?', q: 'Compare Roblox and Apple: which is a better company for a kid to learn investing?' },
    { label: '🧺 Why diversify my piggy bank?', q: 'Why should I never put all my eggs in one basket?' },
  ];

  const handleAskAdvisor = async (questionText: string) => {
    if (isLoading) return;
    if (soundEnabled) playChibiSound('pop');
    setIsLoading(true);

    try {
      const res = await fetch('/api/insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: selectedSymbol,
          question: questionText,
          topic: 'KID_INVESTING_ADVICE',
        }),
      });

      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      setAdvisorData(data);
      if (soundEnabled) playChibiSound('success');
    } catch (err) {
      console.error('Advisor error:', err);
      // Fallback
      setAdvisorData({
        answer:
          'Penny Panda says: Stocks are miniature slices of great companies! When you hold them patiently, they can grow as big as a giant beanstalk! 🌿',
        analogy:
          'Imagine planting an apple seed in your backyard. If you water it and wait patiently, it grows into an apple tree that gives you free apples every summer! 🍎',
        bargainVerdict: 'FAIR',
        pennyRule: 'Be patient! Real wealth grows slowly, just like learning a new video game or sport! 🐼',
        funFact: 'Some of the most successful investors started learning when they were just 11 years old!',
        isAiGenerated: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 rounded-3xl p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl shadow-inner shrink-0 animate-float">
            🤖
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-bold text-2xl text-white">Ask Chibi AI Advisor</h2>
              <span className="text-xs bg-amber-300 text-amber-950 font-extrabold px-2.5 py-0.5 rounded-full">
                Powered by Gemini 3.7
              </span>
            </div>
            <p className="text-xs md:text-sm text-emerald-50 mt-1 max-w-xl leading-relaxed">
              Ask Penny Panda 🐼 and Professor Ollie Owl 🦉 any question about stocks, money, pizza slices, or how
              companies work!
            </p>
          </div>
        </div>
      </div>

      {/* 2. Interactive Question Builder */}
      <div className="bg-white border-2 border-amber-200/80 rounded-3xl p-6 shadow-xs space-y-4">
        {/* Symbol Selector Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Focus Company:</span>
            <select
              value={selectedSymbol}
              onChange={(e) => setSelectedSymbol(e.target.value)}
              className="bg-amber-50 border-2 border-amber-300 rounded-xl px-3 py-1.5 text-xs font-heading font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="ALL">🌐 Whole Market (General Investing)</option>
              {instruments.map((stk) => (
                <option key={stk.symbol} value={stk.symbol}>
                  {stk.mascotEmoji} {stk.name} ({stk.symbol})
                </option>
              ))}
            </select>
          </div>

          <span className="text-[11px] text-slate-400 font-semibold">
            Safe, child-friendly financial education &bull; No real money risk
          </span>
        </div>

        {/* Starter Chips */}
        <div>
          <span className="text-xs font-bold text-slate-500 block mb-2">
            ✨ Quick Starter Questions (Click to Ask):
          </span>
          <div className="flex flex-wrap gap-2">
            {starterPrompts.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCustomQuestion(item.q);
                  handleAskAdvisor(item.q);
                }}
                disabled={isLoading}
                className="text-xs font-heading font-bold bg-amber-50 hover:bg-amber-100/90 text-amber-900 border border-amber-200 px-3 py-1.5 rounded-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input */}
        <div className="flex items-center gap-2 pt-2">
          <input
            type="text"
            placeholder="Type your own question for Penny Panda (e.g. Why do video game stocks go up?)..."
            value={customQuestion}
            onChange={(e) => setCustomQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && customQuestion.trim()) {
                handleAskAdvisor(customQuestion);
              }
            }}
            disabled={isLoading}
            className="flex-1 bg-slate-50 border-2 border-amber-200 rounded-2xl px-4 py-3 text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:bg-white transition-colors"
          />

          <button
            onClick={() => {
              if (customQuestion.trim()) {
                handleAskAdvisor(customQuestion);
              }
            }}
            disabled={isLoading || !customQuestion.trim()}
            className={`font-heading font-bold text-xs md:text-sm px-5 py-3 rounded-2xl shadow-sm transition-all flex items-center gap-1.5 ${
              customQuestion.trim() && !isLoading
                ? 'bg-amber-500 hover:bg-amber-600 text-white active:scale-95 cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Ask Sensei</span>
          </button>
        </div>
      </div>

      {/* 3. Advisor Response Card */}
      {isLoading ? (
        <div className="bg-white border-2 border-amber-200 rounded-3xl p-12 text-center space-y-4 shadow-xs">
          <div className="text-5xl animate-bounce">🐼</div>
          <h3 className="font-heading font-bold text-lg text-slate-800">
            Penny Panda is consulting Ollie Owl&apos;s Detective Book...
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Translating complex Wall Street numbers into fun pizza slices and lemonade stands!
          </p>
        </div>
      ) : advisorData ? (
        <div className="bg-white border-3 border-amber-300 rounded-3xl p-6 shadow-sm space-y-5 animate-coin">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🐼</span>
              <div>
                <h3 className="font-heading font-bold text-lg text-slate-900">
                  Penny Panda&apos;s Advice for Young Investors
                </h3>
                <span className="text-xs font-semibold text-slate-400">
                  Easy to understand &bull; Kid-Friendly Breakdown
                </span>
              </div>
            </div>

            <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" />
              Verdict: {advisorData.bargainVerdict}
            </span>
          </div>

          {/* Main Explanation */}
          <div className="bg-amber-50/60 border-2 border-amber-200/80 rounded-2xl p-4">
            <span className="text-xs font-bold text-amber-900 uppercase block mb-1">
              💬 Direct Answer:
            </span>
            <p className="text-sm md:text-base font-semibold text-slate-800 leading-relaxed">
              {advisorData.answer}
            </p>
          </div>

          {/* Real Life Analogy */}
          <div className="bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-4">
            <span className="text-xs font-bold text-indigo-900 uppercase flex items-center gap-1 mb-1">
              <Lightbulb className="w-4 h-4 text-indigo-600" />
              The Kid Analogy (How to Picture It):
            </span>
            <p className="text-xs md:text-sm text-slate-700 leading-relaxed">
              {advisorData.analogy}
            </p>
          </div>

          {/* 2-col bottom: Penny's Rule & Fun Fact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
              <span className="font-heading font-bold text-emerald-900 block mb-1 text-sm">
                📜 Penny&apos;s Golden Rule:
              </span>
              <p className="text-slate-700 leading-relaxed font-medium">{advisorData.pennyRule}</p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4">
              <span className="font-heading font-bold text-purple-900 block mb-1 text-sm">
                ⭐ Did You Know? (Fun Trivia):
              </span>
              <p className="text-slate-700 leading-relaxed">{advisorData.funFact}</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
