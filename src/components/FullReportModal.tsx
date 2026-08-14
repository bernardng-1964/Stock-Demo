import React, { useState, useEffect } from 'react';
import { X, Sparkles, Download, CheckCircle2, TrendingUp, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import { StockInstrument } from '../types';

interface FullReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  stock1: StockInstrument;
  stock2: StockInstrument;
  onTradeStock: (symbol: string) => void;
}

export const FullReportModal: React.FC<FullReportModalProps> = ({
  isOpen,
  onClose,
  stock1,
  stock2,
  onTradeStock,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [analysis, setAnalysis] = useState<any>(null);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setLoading(true);

    fetch('/api/analyze-stock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        symbol1: stock1.symbol,
        symbol2: stock2.symbol,
        instrument1Data: {
          name: stock1.name,
          price: stock1.lastPrice,
          pe: stock1.peRatio,
          margin: stock1.profitMargin,
          growth1Y: stock1.estGrowth1Y,
        },
        instrument2Data: {
          name: stock2.name,
          price: stock2.lastPrice,
          pe: stock2.peRatio,
          margin: stock2.profitMargin,
          growth1Y: stock2.estGrowth1Y,
        },
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          setAnalysis(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, stock1.symbol, stock2.symbol]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-lg w-full max-w-3xl shadow-xl overflow-hidden flex flex-col max-h-[85vh] animate-scale-in">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <span className="p-1 rounded bg-blue-50 text-blue-600 border border-blue-200">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Institutional Equity Research: {stock1.symbol} vs {stock2.symbol}
              </h2>
              <span className="text-[11px] text-slate-500 font-mono">
                Valuation Multiples · Discounted Cash Flow (DCF) · Moat Assessment
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-slate-700">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center space-y-3">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-mono text-slate-500">Generating comprehensive valuation report...</p>
            </div>
          ) : (
            <>
              {/* Top Highlights Comparison Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-slate-900 font-mono">{stock1.symbol}</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      {stock1.valuation.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">{stock1.name}</div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 font-mono">
                    <div>
                      <span className="text-[10px] text-slate-400 block">P/E Multiple</span>
                      <span className="font-bold text-slate-900">{stock1.peRatio.toFixed(1)}x</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Margin</span>
                      <span className="font-bold text-slate-900">{stock1.profitMargin.toFixed(1)}%</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onTradeStock(stock1.symbol)}
                    className="w-full mt-2 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-bold uppercase tracking-wider transition-colors shadow-xs"
                  >
                    Trade {stock1.symbol}
                  </button>
                </div>

                <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-slate-900 font-mono">{stock2.symbol}</span>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                      {stock2.valuation.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">{stock2.name}</div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 font-mono">
                    <div>
                      <span className="text-[10px] text-slate-400 block">P/E Multiple</span>
                      <span className="font-bold text-slate-900">{stock2.peRatio.toFixed(1)}x</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Margin</span>
                      <span className="font-bold text-slate-900">{stock2.profitMargin.toFixed(1)}%</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onTradeStock(stock2.symbol)}
                    className="w-full mt-2 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-bold uppercase tracking-wider transition-colors shadow-xs"
                  >
                    Trade {stock2.symbol}
                  </button>
                </div>
              </div>

              {/* Valuation Synthesis */}
              <div className="bg-blue-50/50 p-4 rounded border border-blue-200 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  Valuation Consensus & Model Verdict
                </h3>
                <p className="text-xs leading-relaxed text-slate-700">
                  {analysis?.valuationVerdict ||
                    `${stock1.symbol} presents favorable risk-adjusted multiple expansion opportunities relative to historic averages, while ${stock2.symbol} reflects high forward growth discounting.`}
                </p>
              </div>

              {/* Comparative Analysis Factors */}
              {analysis?.comparativeAnalysis && (
                <div className="space-y-3">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-800">Comparative Fundamentals</h4>
                  <div className="space-y-2">
                    <div className="p-3 bg-slate-50 rounded border border-slate-200">
                      <span className="font-bold text-slate-900 text-[11px]">Growth Drivers: </span>
                      <span className="text-slate-700">{analysis.comparativeAnalysis.growthDriver}</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded border border-slate-200">
                      <span className="font-bold text-slate-900 text-[11px]">Margin & Capital Return: </span>
                      <span className="text-slate-700">{analysis.comparativeAnalysis.marginComparison}</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded border border-slate-200">
                      <span className="font-bold text-slate-900 text-[11px]">Valuation Risk: </span>
                      <span className="text-slate-700">{analysis.comparativeAnalysis.valuationRisk}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Catalysts */}
              {analysis?.catalysts && (
                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-800">Forward 12-Month Catalysts</h4>
                  <ul className="space-y-1.5">
                    {analysis.catalysts.map((c: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-2 text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50/80">
          <span className="text-[10px] text-slate-500 font-mono">TradeView Pro Quantitative Model v4.8</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs font-semibold shadow-xs transition-colors"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
