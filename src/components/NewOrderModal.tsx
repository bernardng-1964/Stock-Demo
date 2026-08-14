import React, { useState } from 'react';
import { X, Sparkles, Coins, CheckCircle2, AlertCircle, ShoppingCart, ArrowRight } from 'lucide-react';
import { StockInstrument, PortfolioStats, OrderAction } from '../types';
import { formatCoins, playChibiSound } from '../utils/formatters';

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  instruments: StockInstrument[];
  targetSymbol?: string;
  portfolioStats?: PortfolioStats;
  onSubmitOrder: (order: {
    symbol: string;
    type: OrderAction;
    qty: number;
    price: number;
  }) => void;
  soundEnabled: boolean;
}

export const NewOrderModal: React.FC<NewOrderModalProps> = ({
  isOpen,
  onClose,
  instruments,
  targetSymbol,
  portfolioStats,
  onSubmitOrder,
  soundEnabled,
}) => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>(targetSymbol || 'AAPL');
  const [orderType, setOrderType] = useState<OrderAction>('BUY');
  const [quantity, setQuantity] = useState<number>(5);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successCelebration, setSuccessCelebration] = useState<boolean>(false);

  // Sync symbol when targetSymbol changes
  React.useEffect(() => {
    if (targetSymbol) {
      setSelectedSymbol(targetSymbol);
    }
  }, [targetSymbol]);

  if (!isOpen) return null;

  const currentStock = instruments.find((s) => s.symbol === selectedSymbol) || instruments[0];
  const totalCost = +(quantity * currentStock.lastPrice).toFixed(2);
  const walletBalance = portfolioStats?.walletChibiCoins ?? 0;
  const hasEnoughCoins = orderType === 'BUY' ? walletBalance >= totalCost : true;

  const handleExecute = () => {
    if (!hasEnoughCoins && orderType === 'BUY') return;
    if (soundEnabled) playChibiSound('celebrate');
    setIsSubmitting(true);

    setTimeout(() => {
      onSubmitOrder({
        symbol: currentStock.symbol,
        type: orderType,
        qty: quantity,
        price: currentStock.lastPrice,
      });
      setIsSubmitting(false);
      setSuccessCelebration(true);

      setTimeout(() => {
        setSuccessCelebration(false);
        onClose();
      }, 1200);
    }, 400);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border-3 border-amber-300 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden animate-coin">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-amber-100 text-slate-400 hover:text-slate-700 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {successCelebration ? (
          <div className="py-12 text-center space-y-3">
            <span className="text-6xl animate-bounce block">🎉</span>
            <h3 className="font-heading font-bold text-2xl text-slate-900">
              Order Executed Successfully!
            </h3>
            <p className="text-sm font-semibold text-emerald-700">
              {quantity} slices of {currentStock.name} added to your Piggy Vault!
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Modal Header */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 flex items-center justify-center text-3xl shrink-0">
                🍕
              </div>
              <div>
                <h3 className="font-heading font-bold text-xl text-slate-900">
                  Trade Company Slices
                </h3>
                <span className="text-xs text-slate-500 font-semibold">
                  Pretend Paper Trading with Play ChibiCoins
                </span>
              </div>
            </div>

            {/* Buy / Sell Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
              <button
                type="button"
                onClick={() => {
                  if (soundEnabled) playChibiSound('pop');
                  setOrderType('BUY');
                }}
                className={`py-2 rounded-xl font-heading font-bold text-xs transition-all cursor-pointer ${
                  orderType === 'BUY'
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                + BUY SLICES (Add to Vault) 🛒
              </button>
              <button
                type="button"
                onClick={() => {
                  if (soundEnabled) playChibiSound('pop');
                  setOrderType('SELL');
                }}
                className={`py-2 rounded-xl font-heading font-bold text-xs transition-all cursor-pointer ${
                  orderType === 'SELL'
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                - SELL SLICES (Cash Out) 💰
              </button>
            </div>

            {/* Company Selector */}
            <div className="space-y-1.5">
              <label htmlFor="company-select" className="text-xs font-bold text-slate-700 block">
                Choose Company:
              </label>
              <select
                id="company-select"
                value={selectedSymbol}
                onChange={(e) => {
                  if (soundEnabled) playChibiSound('pop');
                  setSelectedSymbol(e.target.value);
                }}
                className="w-full bg-amber-50 border-2 border-amber-300 rounded-2xl px-3.5 py-2.5 text-sm font-heading font-bold text-slate-800 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                {instruments.map((stk) => (
                  <option key={stk.symbol} value={stk.symbol}>
                    {stk.mascotEmoji} {stk.name} ({stk.symbol}) &bull; ${stk.lastPrice.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>

            {/* Company Summary Pill */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{currentStock.mascotEmoji}</span>
                <div>
                  <span className="font-bold text-slate-900 block">{currentStock.chibiName}</span>
                  <span className="text-slate-500">{currentStock.category}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-heading font-bold text-slate-900 block tabular-nums">
                  ${currentStock.lastPrice.toFixed(2)}
                </span>
                <span className="text-[10px] font-bold text-emerald-700">
                  Fair Value: ${currentStock.fairValue.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Quantity Stepper & Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <label htmlFor="qty-slider" className="cursor-pointer">How Many Slices (Shares):</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-6 h-6 rounded-lg bg-slate-200 hover:bg-amber-200 text-slate-800 font-bold flex items-center justify-center cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-heading font-extrabold text-base text-amber-900 w-8 text-center tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(100, q + 1))}
                    className="w-6 h-6 rounded-lg bg-slate-200 hover:bg-amber-200 text-slate-800 font-bold flex items-center justify-center cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <input
                id="qty-slider"
                type="range"
                min="1"
                max="50"
                step="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Order Total & Wallet Balance Check */}
            <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-3.5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-medium">Estimated Total Price:</span>
                <span className="font-heading font-bold text-base text-slate-900 tabular-nums">
                  ${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })} CC
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                <span className="text-slate-600 font-medium">Piggy Bank Balance:</span>
                <span className="font-bold text-amber-900 tabular-nums">
                  {formatCoins(walletBalance)} CC
                </span>
              </div>

              {!hasEnoughCoins && orderType === 'BUY' && (
                <div className="text-rose-600 font-bold text-[11px] flex items-center gap-1 pt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Not enough ChibiCoins! Lower the quantity or sell other slices.
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleExecute}
              disabled={!hasEnoughCoins && orderType === 'BUY'}
              className={`w-full font-heading font-bold text-sm py-3.5 rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                hasEnoughCoins || orderType === 'SELL'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white active:scale-95'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>
                {orderType === 'BUY'
                  ? `Confirm & Buy ${quantity} Slices! 🍕`
                  : `Confirm & Sell ${quantity} Slices! 💰`}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
