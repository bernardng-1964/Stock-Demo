import React, { useState, useMemo } from 'react';
import {
  SlidersHorizontal,
  Download,
  Search,
  CheckCircle2,
  TrendingUp,
  Percent,
  Activity,
  DollarSign,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Info,
  ShieldCheck,
  ChevronRight,
  BarChart3,
  Flame,
} from 'lucide-react';
import { StockInstrument } from '../types';
import { formatCurrency } from '../utils/formatters';

interface QualitativeScreenerViewProps {
  instruments: StockInstrument[];
  onOpenNewOrder: (symbol?: string) => void;
  onOpenFullReport?: (stock1: StockInstrument, stock2: StockInstrument) => void;
}

type SortField =
  | 'symbol'
  | 'peRatio'
  | 'targetUpside'
  | 'dividendYield'
  | 'operatingMargin'
  | 'avgVolumeRaw'
  | 'qualitativeScore';

export const QualitativeScreenerView: React.FC<QualitativeScreenerViewProps> = ({
  instruments,
  onOpenNewOrder,
  onOpenFullReport,
}) => {
  // Filter States for the 5 Qualitative Metrics
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPeFilter, setMaxPeFilter] = useState<number | 'ALL'>('ALL');
  const [minUpsideFilter, setMinUpsideFilter] = useState<number | 'ALL'>('ALL');
  const [minDividendFilter, setMinDividendFilter] = useState<number | 'ALL'>('ALL');
  const [minOperatingMarginFilter, setMinOperatingMarginFilter] = useState<number | 'ALL'>('ALL');
  const [minAvgVolumeFilter, setMinAvgVolumeFilter] = useState<number | 'ALL'>('ALL');
  const [selectedPreset, setSelectedPreset] = useState<string>('ALL');

  // Sorting
  const [sortField, setSortField] = useState<SortField>('qualitativeScore');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Selected Stock for deep-dive inspection panel
  const [selectedSymbol, setSelectedSymbol] = useState<string>(instruments[0]?.symbol || 'AAPL');

  // Calculate qualitative scores and derived metrics for each stock
  const enrichedInstruments = useMemo(() => {
    return instruments.map((stock) => {
      // 1. Current vs Target Price upside %
      const targetUpside = ((stock.priceTarget - stock.lastPrice) / stock.lastPrice) * 100;

      // 2. Score P/E Ratio (0 - 20 pts): lower PE gets higher score, optimal 12-30x
      let peScore = 10;
      if (stock.peRatio <= 15) peScore = 20;
      else if (stock.peRatio <= 25) peScore = 18;
      else if (stock.peRatio <= 35) peScore = 15;
      else if (stock.peRatio <= 50) peScore = 11;
      else peScore = 7;

      // 3. Score Target Upside (0 - 25 pts): higher upside gets higher score
      let upsideScore = 10;
      if (targetUpside >= 25) upsideScore = 25;
      else if (targetUpside >= 15) upsideScore = 20;
      else if (targetUpside >= 5) upsideScore = 15;
      else if (targetUpside >= 0) upsideScore = 10;
      else upsideScore = 4;

      // 4. Score Operating Margin (0 - 25 pts): high margin indicates competitive moat
      let marginScore = 10;
      if (stock.operatingMargin >= 45) marginScore = 25;
      else if (stock.operatingMargin >= 30) marginScore = 21;
      else if (stock.operatingMargin >= 20) marginScore = 17;
      else if (stock.operatingMargin >= 10) marginScore = 12;
      else marginScore = 6;

      // 5. Score Dividend Yield (0 - 15 pts): cash distribution safety
      let dividendScore = 5;
      if (stock.dividendYield >= 3.0) dividendScore = 15;
      else if (stock.dividendYield >= 2.0) dividendScore = 13;
      else if (stock.dividendYield >= 0.5) dividendScore = 10;
      else if (stock.dividendYield > 0) dividendScore = 8;
      else dividendScore = 6; // Growth reinvestment

      // 6. Score Average Trading Volume (0 - 15 pts): institutional liquidity
      let volumeScore = 8;
      if (stock.avgVolumeRaw >= 50000000) volumeScore = 15;
      else if (stock.avgVolumeRaw >= 25000000) volumeScore = 12;
      else if (stock.avgVolumeRaw >= 10000000) volumeScore = 9;
      else volumeScore = 6;

      const qualitativeScore = Math.min(100, Math.round(peScore + upsideScore + marginScore + dividendScore + volumeScore));

      return {
        ...stock,
        targetUpside,
        qualitativeScore,
        breakdown: {
          peScore,
          upsideScore,
          marginScore,
          dividendScore,
          volumeScore,
        },
      };
    });
  }, [instruments]);

  // Handle Preset Selection
  const applyPreset = (presetKey: string) => {
    setSelectedPreset(presetKey);
    switch (presetKey) {
      case 'HIGH_MARGIN_VALUE':
        setMaxPeFilter(35);
        setMinUpsideFilter(10);
        setMinOperatingMarginFilter(30);
        setMinDividendFilter('ALL');
        setMinAvgVolumeFilter('ALL');
        break;
      case 'HIGH_UPSIDE':
        setMaxPeFilter('ALL');
        setMinUpsideFilter(15);
        setMinOperatingMarginFilter('ALL');
        setMinDividendFilter('ALL');
        setMinAvgVolumeFilter('ALL');
        break;
      case 'INCOME_COMPOUNDERS':
        setMaxPeFilter(30);
        setMinUpsideFilter('ALL');
        setMinOperatingMarginFilter(20);
        setMinDividendFilter(1.0);
        setMinAvgVolumeFilter('ALL');
        break;
      case 'MEGA_LIQUID':
        setMaxPeFilter('ALL');
        setMinUpsideFilter('ALL');
        setMinOperatingMarginFilter('ALL');
        setMinDividendFilter('ALL');
        setMinAvgVolumeFilter(40000000);
        break;
      case 'ALL':
      default:
        setMaxPeFilter('ALL');
        setMinUpsideFilter('ALL');
        setMinDividendFilter('ALL');
        setMinOperatingMarginFilter('ALL');
        setMinAvgVolumeFilter('ALL');
        break;
    }
  };

  // Filtered List
  const filteredInstruments = useMemo(() => {
    return enrichedInstruments
      .filter((stock) => {
        // Search filter
        const matchesSearch =
          stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          stock.sector.toLowerCase().includes(searchQuery.toLowerCase());
        if (!matchesSearch) return false;

        // 1. P/E ratio filter
        if (maxPeFilter !== 'ALL' && stock.peRatio > maxPeFilter) return false;

        // 2. Current vs Target Price Upside filter
        if (minUpsideFilter !== 'ALL' && stock.targetUpside < minUpsideFilter) return false;

        // 3. Dividend yield filter
        if (minDividendFilter !== 'ALL' && stock.dividendYield < minDividendFilter) return false;

        // 4. Operating margin filter
        if (minOperatingMarginFilter !== 'ALL' && stock.operatingMargin < minOperatingMarginFilter) return false;

        // 5. Average volume filter
        if (minAvgVolumeFilter !== 'ALL' && stock.avgVolumeRaw < minAvgVolumeFilter) return false;

        return true;
      })
      .sort((a, b) => {
        let valA: any = a[sortField];
        let valB: any = b[sortField];

        if (typeof valA === 'string') {
          return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return sortOrder === 'asc' ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
      });
  }, [
    enrichedInstruments,
    searchQuery,
    maxPeFilter,
    minUpsideFilter,
    minDividendFilter,
    minOperatingMarginFilter,
    minAvgVolumeFilter,
    sortField,
    sortOrder,
  ]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Selected Stock Data for deep-dive
  const activeStock = enrichedInstruments.find((s) => s.symbol === selectedSymbol) || enrichedInstruments[0];

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'Symbol',
      'Company Name',
      'Sector',
      'Current Price ($)',
      'Target Price ($)',
      'Target Upside (%)',
      'P/E Ratio (x)',
      'Operating Margin (%)',
      'Dividend Yield (%)',
      'Avg Volume',
      'Qualitative Score (100)',
    ];

    const rows = filteredInstruments.map((s) => [
      s.symbol,
      `"${s.name}"`,
      `"${s.sector}"`,
      s.lastPrice.toFixed(2),
      s.priceTarget.toFixed(2),
      `${s.targetUpside.toFixed(2)}%`,
      s.peRatio.toFixed(1),
      `${s.operatingMargin.toFixed(1)}%`,
      `${s.dividendYield.toFixed(2)}%`,
      s.avgVolume,
      s.qualitativeScore,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `qualitative_stock_screening_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Aggregate Market Stats across the 5 qualitative pillars
  const avgPe = (enrichedInstruments.reduce((acc, s) => acc + s.peRatio, 0) / enrichedInstruments.length).toFixed(1);
  const avgUpside = (enrichedInstruments.reduce((acc, s) => acc + s.targetUpside, 0) / enrichedInstruments.length).toFixed(1);
  const avgMargin = (enrichedInstruments.reduce((acc, s) => acc + s.operatingMargin, 0) / enrichedInstruments.length).toFixed(1);
  const avgDividend = (enrichedInstruments.reduce((acc, s) => acc + s.dividendYield, 0) / enrichedInstruments.length).toFixed(2);

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto animate-fade-in">
      {/* Header & Title Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded bg-blue-50 text-blue-600 border border-blue-200">
              <SlidersHorizontal className="w-5 h-5" />
            </span>
            <h1 className="text-2xl md:text-[28px] font-bold text-slate-900 tracking-tight">
              Qualitative Stock Screener
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Multi-factor qualitative analysis evaluating P/E multiples, Price Target gaps, Dividend yields, Operating profitability, and Volume liquidity.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-50 shadow-xs transition-colors text-xs font-semibold"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Export Qualitative Data
          </button>
        </div>
      </div>

      {/* 5 Qualitative Pillars Metric Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Metric 1: P/E Ratio */}
        <div className="bg-white border border-slate-200 rounded p-4 shadow-xs">
          <div className="flex justify-between items-start mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">1. P/E Multiple</span>
            <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
              Valuation
            </span>
          </div>
          <div className="text-xl font-bold font-mono text-slate-900">{avgPe}x</div>
          <div className="text-[11px] text-slate-500 mt-1 font-sans">
            Universe Median Multiple
          </div>
        </div>

        {/* Metric 2: Current vs Target Price */}
        <div className="bg-white border border-slate-200 rounded p-4 shadow-xs">
          <div className="flex justify-between items-start mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">2. Target Upside</span>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              Price vs Target
            </span>
          </div>
          <div className="text-xl font-bold font-mono text-emerald-600">+{avgUpside}%</div>
          <div className="text-[11px] text-slate-500 mt-1 font-sans">
            Average Consensus Upside
          </div>
        </div>

        {/* Metric 3: Dividend Yield */}
        <div className="bg-white border border-slate-200 rounded p-4 shadow-xs">
          <div className="flex justify-between items-start mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">3. Dividend Yield</span>
            <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
              Yield / Return
            </span>
          </div>
          <div className="text-xl font-bold font-mono text-slate-900">{avgDividend}%</div>
          <div className="text-[11px] text-slate-500 mt-1 font-sans">
            Universe Mean Yield
          </div>
        </div>

        {/* Metric 4: Operating Margins */}
        <div className="bg-white border border-slate-200 rounded p-4 shadow-xs">
          <div className="flex justify-between items-start mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">4. Operating Margin</span>
            <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
              Moat Quality
            </span>
          </div>
          <div className="text-xl font-bold font-mono text-slate-900">{avgMargin}%</div>
          <div className="text-[11px] text-slate-500 mt-1 font-sans">
            Mean Operating Margin
          </div>
        </div>

        {/* Metric 5: Average Trading Volume */}
        <div className="bg-white border border-slate-200 rounded p-4 shadow-xs">
          <div className="flex justify-between items-start mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">5. Avg Trading Vol</span>
            <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
              Liquidity Tier
            </span>
          </div>
          <div className="text-xl font-bold font-mono text-slate-900">38.2M</div>
          <div className="text-[11px] text-slate-500 mt-1 font-sans">
            Institutional Daily Liquidity
          </div>
        </div>
      </div>

      {/* Preset Strategy Selector Pills */}
      <div className="bg-white border border-slate-200 rounded p-4 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Qualitative Screening Archetypes:
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { id: 'ALL', label: 'All Equities' },
              { id: 'HIGH_MARGIN_VALUE', label: 'High Operating Margins & Value (P/E < 35x, Margin > 30%)' },
              { id: 'HIGH_UPSIDE', label: 'High Target Upside (> 15% to Target)' },
              { id: 'INCOME_COMPOUNDERS', label: 'Income & Dividends (Yield > 1.0%, Margin > 20%)' },
              { id: 'MEGA_LIQUID', label: 'Mega-Liquid Institutional Tier (> 40M Vol)' },
            ].map((preset) => (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset.id)}
                className={`px-3 py-1.5 rounded text-xs font-semibold tracking-wide transition-all border ${
                  selectedPreset === preset.id
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* 5-Metric Filter Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-3 border-t border-slate-100">
          {/* Search */}
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Search Ticker</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Symbol or name..."
                className="w-full bg-slate-50 border border-slate-200 rounded pl-8 pr-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>
          </div>

          {/* Metric 1: P/E Ratio Filter */}
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">1. Max P/E Ratio</label>
            <select
              value={maxPeFilter}
              onChange={(e) => {
                setSelectedPreset('CUSTOM');
                setMaxPeFilter(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value));
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
            >
              <option value="ALL">Any P/E Multiple</option>
              <option value="20">Deep Value (&le; 20x)</option>
              <option value="30">Moderate (&le; 30x)</option>
              <option value="45">Growth Reasonable (&le; 45x)</option>
            </select>
          </div>

          {/* Metric 2: Target Upside Filter */}
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">2. Min Target Upside</label>
            <select
              value={minUpsideFilter}
              onChange={(e) => {
                setSelectedPreset('CUSTOM');
                setMinUpsideFilter(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value));
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
            >
              <option value="ALL">Any Target Spread</option>
              <option value="5">&gt; 5% Upside to Target</option>
              <option value="15">&gt; 15% Upside to Target</option>
              <option value="25">&gt; 25% Upside to Target</option>
            </select>
          </div>

          {/* Metric 3: Dividend Yield Filter */}
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">3. Min Dividend Yield</label>
            <select
              value={minDividendFilter}
              onChange={(e) => {
                setSelectedPreset('CUSTOM');
                setMinDividendFilter(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value));
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
            >
              <option value="ALL">Any Dividend Yield</option>
              <option value="0.01">Paying Dividend (&gt; 0%)</option>
              <option value="0.5">&gt; 0.5% Yield</option>
              <option value="1.0">&gt; 1.0% Yield</option>
              <option value="2.0">&gt; 2.0% High Yield</option>
            </select>
          </div>

          {/* Metric 4: Operating Margin Filter */}
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">4. Min Operating Margin</label>
            <select
              value={minOperatingMarginFilter}
              onChange={(e) => {
                setSelectedPreset('CUSTOM');
                setMinOperatingMarginFilter(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value));
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
            >
              <option value="ALL">Any Operating Margin</option>
              <option value="15">&gt; 15% Operating Margin</option>
              <option value="25">&gt; 25% Strong Margin</option>
              <option value="40">&gt; 40% Elite Moat Margin</option>
            </select>
          </div>

          {/* Metric 5: Average Trading Volume Filter */}
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">5. Min Avg Daily Vol</label>
            <select
              value={minAvgVolumeFilter}
              onChange={(e) => {
                setSelectedPreset('CUSTOM');
                setMinAvgVolumeFilter(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value));
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
            >
              <option value="ALL">Any Volume Tier</option>
              <option value="15000000">&gt; 15M Shares / Day</option>
              <option value="30000000">&gt; 30M Shares / Day</option>
              <option value="50000000">&gt; 50M Mega Liquid</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Screener Table (Left) + Qualitative Inspector Card (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Qualitative Screener Matrix Table (Col Span 8) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded flex flex-col h-[750px] shadow-xs overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/60">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-800">
                Screening Matrix ({filteredInstruments.length} Instruments)
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              Click any stock to inspect qualitative scorecard
            </span>
          </div>

          <div className="flex-1 overflow-auto">
            <table className="w-full text-left whitespace-nowrap border-collapse">
              <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 z-10 font-sans">
                <tr>
                  <th
                    onClick={() => handleSort('symbol')}
                    className="px-3.5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 cursor-pointer hover:text-blue-600"
                  >
                    Ticker & Name {sortField === 'symbol' && (sortOrder === 'asc' ? '▲' : '▼')}
                  </th>
                  <th
                    onClick={() => handleSort('targetUpside')}
                    className="px-3.5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 cursor-pointer hover:text-blue-600 text-right"
                  >
                    Price vs Target {sortField === 'targetUpside' && (sortOrder === 'asc' ? '▲' : '▼')}
                  </th>
                  <th
                    onClick={() => handleSort('peRatio')}
                    className="px-3.5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 cursor-pointer hover:text-blue-600 text-right"
                  >
                    P/E Ratio {sortField === 'peRatio' && (sortOrder === 'asc' ? '▲' : '▼')}
                  </th>
                  <th
                    onClick={() => handleSort('operatingMargin')}
                    className="px-3.5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 cursor-pointer hover:text-blue-600 text-right"
                  >
                    Operating Margin {sortField === 'operatingMargin' && (sortOrder === 'asc' ? '▲' : '▼')}
                  </th>
                  <th
                    onClick={() => handleSort('dividendYield')}
                    className="px-3.5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 cursor-pointer hover:text-blue-600 text-right"
                  >
                    Dividend {sortField === 'dividendYield' && (sortOrder === 'asc' ? '▲' : '▼')}
                  </th>
                  <th
                    onClick={() => handleSort('avgVolumeRaw')}
                    className="px-3.5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 cursor-pointer hover:text-blue-600 text-right"
                  >
                    Avg Volume {sortField === 'avgVolumeRaw' && (sortOrder === 'asc' ? '▲' : '▼')}
                  </th>
                  <th
                    onClick={() => handleSort('qualitativeScore')}
                    className="px-3.5 py-3 text-[10px] font-bold uppercase tracking-wider text-blue-700 cursor-pointer hover:text-blue-800 text-center"
                  >
                    Qual Score {sortField === 'qualitativeScore' && (sortOrder === 'asc' ? '▲' : '▼')}
                  </th>
                  <th className="px-3.5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-xs">
                {filteredInstruments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-16 text-slate-400 font-sans text-xs">
                      No stocks match the selected qualitative criteria. Try adjusting your metric filters.
                    </td>
                  </tr>
                ) : (
                  filteredInstruments.map((stock) => {
                    const isSelected = stock.symbol === activeStock.symbol;
                    const isUpsidePositive = stock.targetUpside >= 0;

                    return (
                      <tr
                        key={stock.symbol}
                        onClick={() => setSelectedSymbol(stock.symbol)}
                        className={`cursor-pointer transition-colors group border-l-2 ${
                          isSelected
                            ? 'bg-blue-50/50 hover:bg-blue-50/80 border-l-blue-600'
                            : 'hover:bg-slate-50 border-l-transparent'
                        }`}
                      >
                        {/* Ticker & Name */}
                        <td className="px-3.5 py-3 font-sans">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center font-bold font-mono text-[11px] text-slate-800 border border-slate-200 shrink-0">
                              {stock.symbol}
                            </div>
                            <div className="overflow-hidden">
                              <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                                {stock.symbol}
                                <span className="text-[10px] font-normal text-slate-400 truncate">({stock.sector})</span>
                              </div>
                              <div className="text-[11px] text-slate-500 truncate">{stock.name}</div>
                            </div>
                          </div>
                        </td>

                        {/* Metric 2: Current vs Target Price */}
                        <td className="px-3.5 py-3 text-right">
                          <div className="flex flex-col items-end">
                            <div className="text-slate-900 font-semibold">
                              ${stock.lastPrice.toFixed(2)}{' '}
                              <span className="text-[10px] font-normal text-slate-400">/ ${stock.priceTarget.toFixed(2)}</span>
                            </div>
                            <span
                              className={`inline-flex items-center text-[10px] font-bold px-1.5 py-0.2 rounded mt-0.5 border ${
                                isUpsidePositive
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : 'bg-rose-50 text-rose-700 border-rose-200'
                              }`}
                            >
                              {isUpsidePositive ? '+' : ''}
                              {stock.targetUpside.toFixed(1)}% Upside
                            </span>
                          </div>
                        </td>

                        {/* Metric 1: P/E Ratio */}
                        <td className="px-3.5 py-3 text-right">
                          <div className="flex flex-col items-end">
                            <span className="font-bold text-slate-900">{stock.peRatio.toFixed(1)}x</span>
                            <span
                              className={`text-[9px] font-sans font-semibold px-1 rounded ${
                                stock.peRatio <= 25
                                  ? 'text-emerald-700 bg-emerald-50'
                                  : stock.peRatio <= 40
                                  ? 'text-blue-700 bg-blue-50'
                                  : 'text-amber-700 bg-amber-50'
                              }`}
                            >
                              {stock.peRatio <= 25 ? 'Value' : stock.peRatio <= 40 ? 'Moderate' : 'Growth Premium'}
                            </span>
                          </div>
                        </td>

                        {/* Metric 4: Operating Margin */}
                        <td className="px-3.5 py-3 text-right">
                          <div className="flex flex-col items-end">
                            <span className="font-bold text-slate-900">{stock.operatingMargin.toFixed(1)}%</span>
                            <span
                              className={`text-[9px] font-sans font-semibold px-1 rounded ${
                                stock.operatingMargin >= 40
                                  ? 'text-emerald-700 bg-emerald-50'
                                  : stock.operatingMargin >= 25
                                  ? 'text-blue-700 bg-blue-50'
                                  : 'text-slate-600 bg-slate-100'
                              }`}
                            >
                              {stock.operatingMargin >= 40
                                ? 'Elite Moat'
                                : stock.operatingMargin >= 25
                                ? 'Strong Margin'
                                : 'Moderate'}
                            </span>
                          </div>
                        </td>

                        {/* Metric 3: Dividend Yield */}
                        <td className="px-3.5 py-3 text-right">
                          <div className="flex flex-col items-end">
                            <span className="font-bold text-slate-900">
                              {stock.dividendYield > 0 ? `${stock.dividendYield.toFixed(2)}%` : '0.00%'}
                            </span>
                            <span className="text-[9px] font-sans text-slate-400">
                              {stock.dividendYield >= 2.0
                                ? 'High Yield'
                                : stock.dividendYield > 0
                                ? 'Income'
                                : 'Reinvesting'}
                            </span>
                          </div>
                        </td>

                        {/* Metric 5: Average Trading Volume */}
                        <td className="px-3.5 py-3 text-right font-sans">
                          <div className="flex flex-col items-end">
                            <span className="font-bold text-slate-900 font-mono">{stock.avgVolume}</span>
                            <span
                              className={`text-[9px] font-semibold px-1 rounded ${
                                stock.avgVolumeRaw >= 50000000
                                  ? 'text-blue-700 bg-blue-50'
                                  : 'text-slate-600 bg-slate-100'
                              }`}
                            >
                              {stock.avgVolumeRaw >= 50000000 ? 'Tier 1 Liquid' : 'Liquid'}
                            </span>
                          </div>
                        </td>

                        {/* Composite Qualitative Score */}
                        <td className="px-3.5 py-3 text-center">
                          <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-blue-50 border border-blue-200">
                            <span className="text-xs font-bold font-mono text-blue-700">
                              {stock.qualitativeScore}
                            </span>
                            <span className="text-[9px] font-sans text-blue-600">/100</span>
                          </div>
                        </td>

                        {/* Trade Action */}
                        <td className="px-3.5 py-3 text-center font-sans">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenNewOrder(stock.symbol);
                            }}
                            className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-300 rounded transition-colors"
                          >
                            Trade
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Qualitative Stock Deep-Dive Inspector Panel (Col Span 4) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded flex flex-col h-[750px] shadow-xs overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/60 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Qualitative Scorecard
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-500">{activeStock.symbol} Analysis</span>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Top Overview Box */}
            <div className="bg-slate-50 border border-slate-200 rounded p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-lg font-bold text-slate-900 font-mono flex items-center gap-2">
                    {activeStock.symbol}
                    <span className="text-xs font-sans font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {activeStock.analystRating}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{activeStock.name} · {activeStock.sector}</div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold font-mono text-blue-600">{activeStock.qualitativeScore}</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Qualitative Index</div>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-sans border-t border-slate-200 pt-2">
                {activeStock.description}
              </p>
            </div>

            {/* 5 Qualitative Pillars Evaluation Breakdown */}
            <div className="space-y-3.5">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
                5 Qualitative Pillar Assessment
              </h4>

              {/* Pillar 1: P/E Ratio */}
              <div className="p-3 bg-white border border-slate-200 rounded space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">1. Price-to-Earnings (P/E)</span>
                  <span className="font-mono font-bold text-slate-900">{activeStock.peRatio.toFixed(1)}x</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full"
                    style={{ width: `${(activeStock.breakdown.peScore / 20) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-sans">
                  <span>Valuation multiple benchmark</span>
                  <span>{activeStock.breakdown.peScore}/20 pts</span>
                </div>
              </div>

              {/* Pillar 2: Current vs Target Price */}
              <div className="p-3 bg-white border border-slate-200 rounded space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">2. Current vs Target Price</span>
                  <span className="font-mono font-bold text-emerald-600">
                    ${activeStock.lastPrice.toFixed(2)} &rarr; ${activeStock.priceTarget.toFixed(2)} (+{activeStock.targetUpside.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full"
                    style={{ width: `${(activeStock.breakdown.upsideScore / 25) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-sans">
                  <span>Consensus analyst price upside</span>
                  <span>{activeStock.breakdown.upsideScore}/25 pts</span>
                </div>
              </div>

              {/* Pillar 3: Dividend Yield */}
              <div className="p-3 bg-white border border-slate-200 rounded space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">3. Dividend Yield</span>
                  <span className="font-mono font-bold text-slate-900">
                    {activeStock.dividendYield > 0 ? `${activeStock.dividendYield.toFixed(2)}%` : '0.00% (Reinvesting)'}
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-600 h-full rounded-full"
                    style={{ width: `${(activeStock.breakdown.dividendScore / 15) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-sans">
                  <span>Cash distribution yield</span>
                  <span>{activeStock.breakdown.dividendScore}/15 pts</span>
                </div>
              </div>

              {/* Pillar 4: Operating Margins */}
              <div className="p-3 bg-white border border-slate-200 rounded space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">4. Operating Margin</span>
                  <span className="font-mono font-bold text-slate-900">{activeStock.operatingMargin.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full"
                    style={{ width: `${(activeStock.breakdown.marginScore / 25) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-sans">
                  <span>Operating profitability & pricing moat</span>
                  <span>{activeStock.breakdown.marginScore}/25 pts</span>
                </div>
              </div>

              {/* Pillar 5: Average Trading Volume */}
              <div className="p-3 bg-white border border-slate-200 rounded space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">5. Average Trading Volume</span>
                  <span className="font-mono font-bold text-slate-900">{activeStock.avgVolume}</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full"
                    style={{ width: `${(activeStock.breakdown.volumeScore / 15) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-sans">
                  <span>Daily institutional liquidity depth</span>
                  <span>{activeStock.breakdown.volumeScore}/15 pts</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 mt-auto flex gap-2">
            <button
              onClick={() => onOpenNewOrder(activeStock.symbol)}
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold uppercase tracking-wider transition-all shadow-xs"
            >
              Trade {activeStock.symbol}
            </button>
            {onOpenFullReport && (
              <button
                onClick={() => onOpenFullReport(activeStock, instruments.find((s) => s.symbol !== activeStock.symbol) || instruments[0])}
                className="px-3.5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs font-semibold transition-colors"
              >
                Research
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
