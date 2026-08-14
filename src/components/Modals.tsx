import React from 'react';
import { X, Settings, HelpCircle, Volume2, VolumeX, RotateCcw, ShieldCheck, Sparkles, Smile } from 'lucide-react';
import { playChibiSound } from '../utils/formatters';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onResetBank: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  soundEnabled,
  onToggleSound,
  onResetBank,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white border-3 border-amber-300 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-coin">
        <div className="p-4 border-b border-amber-100 flex justify-between items-center bg-amber-50">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚙️</span>
            <h2 className="font-heading text-base font-bold text-slate-900">
              Piggy Bank &amp; App Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-amber-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs text-slate-700">
          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <span className="font-bold text-slate-800 block text-xs">Chibi Sound Effects</span>
              <span className="text-[11px] text-slate-500">Play cheerful chimes &amp; coin fanfare</span>
            </div>
            <button
              onClick={() => {
                onToggleSound();
                if (!soundEnabled) playChibiSound('coin');
              }}
              className={`p-2.5 rounded-xl border font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                soundEnabled
                  ? 'bg-amber-500 text-white border-amber-600'
                  : 'bg-slate-200 text-slate-600 border-slate-300'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span>{soundEnabled ? 'ON' : 'OFF'}</span>
            </button>
          </div>

          {/* Reset Coins */}
          <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2">
            <div>
              <span className="font-bold text-amber-900 block text-xs">Reset Pretend Piggy Bank</span>
              <span className="text-[11px] text-slate-600">
                Start fresh with 10,000 ChibiCoins and clear mock portfolio holdings.
              </span>
            </div>
            <button
              onClick={() => {
                if (soundEnabled) playChibiSound('coin');
                onResetBank();
                onClose();
              }}
              className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white font-heading font-bold rounded-xl shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Piggy Bank (10,000 CC)</span>
            </button>
          </div>

          {/* Safety note */}
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              <strong>100% Safe &amp; Educational:</strong> All trading is simulated with pretend coins. No real money or bank accounts are ever involved.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white border-3 border-amber-300 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-coin max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-amber-100 flex justify-between items-center bg-amber-50 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌟</span>
            <h2 className="font-heading text-base font-bold text-slate-900">
              Welcome to Chibi Stock Exchange!
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-amber-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-700">
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-4 rounded-2xl border border-amber-300">
            <h3 className="font-heading font-bold text-sm text-slate-900 mb-1">
              How to Play &amp; Learn in 3 Easy Steps:
            </h3>
            <ol className="space-y-2 mt-2">
              <li className="flex items-start gap-2">
                <span className="font-bold text-amber-900">1.</span>
                <span>
                  <strong>Pick Great Companies:</strong> Browse Apple, Disney, Roblox, and Nvidia. Think about the products you love!
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-amber-900">2.</span>
                <span>
                  <strong>Look for Bargains:</strong> Consult Professor Ollie Owl to check if the company is trading at a discount.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-amber-900">3.</span>
                <span>
                  <strong>Complete Academy Quests:</strong> Earn extra ChibiCoins in the Academy to grow your piggy net worth!
                </span>
              </li>
            </ol>
          </div>

          <div className="space-y-2">
            <h4 className="font-heading font-bold text-slate-900 text-xs uppercase">
              Meet Your Chibi Senseis:
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                <span className="text-2xl">🐼</span>
                <div>
                  <strong>Penny Panda</strong>
                  <p className="text-slate-500">Chief Guide &amp; Value Mentor</p>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                <span className="text-2xl">🐂</span>
                <div>
                  <strong>Bramble Bull</strong>
                  <p className="text-slate-500">Growth &amp; Cheerleader</p>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                <span className="text-2xl">🐻</span>
                <div>
                  <strong>Barnaby Bear</strong>
                  <p className="text-slate-500">Patience &amp; Risk Guard</p>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                <span className="text-2xl">🦉</span>
                <div>
                  <strong>Professor Ollie</strong>
                  <p className="text-slate-500">Bargain Detective</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-heading font-bold rounded-2xl shadow-xs transition-colors cursor-pointer"
          >
            Let&apos;s Start Investing! 🚀
          </button>
        </div>
      </div>
    </div>
  );
};
