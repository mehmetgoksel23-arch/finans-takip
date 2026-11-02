import React, { useState } from 'react';
import { Lock, ShieldCheck, Delete } from 'lucide-react';

interface PinLockScreenProps {
  onUnlock: (pin: string) => boolean;
}

export const PinLockScreen: React.FC<PinLockScreenProps> = ({ onUnlock }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      setError(false);

      if (nextPin.length === 4) {
        setTimeout(() => {
          const success = onUnlock(nextPin);
          if (!success) {
            setError(true);
            setPin('');
          }
        }, 150);
      }
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setError(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0F19] flex flex-col items-center justify-between p-6 select-none max-w-md mx-auto">
      {/* Üst Kısım */}
      <div className="flex flex-col items-center mt-12">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mb-4 text-indigo-400 shadow-lg shadow-indigo-500/10">
          <Lock className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-white tracking-wide">Finans & Borç Takip</h1>
        <p className="text-xs text-gray-400 mt-1">Lütfen 4 haneli PIN kodunuzu girin</p>

        {/* PIN Noktaları */}
        <div className={`flex gap-4 mt-8 ${error ? 'animate-shake' : ''}`}>
          {[0, 1, 2, 3].map(idx => (
            <div
              key={idx}
              className={`w-4 h-4 rounded-full transition-all duration-200 ${
                idx < pin.length
                  ? error
                    ? 'bg-rose-500 scale-110 shadow-lg shadow-rose-500/50'
                    : 'bg-indigo-500 scale-110 shadow-lg shadow-indigo-500/50'
                  : 'bg-gray-800 border border-gray-700'
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="text-xs text-rose-400 mt-3 font-medium">Hatalı PIN! Tekrar deneyin.</p>
        )}
      </div>

      {/* Sayı Tuş Takımı */}
      <div className="w-full max-w-xs mb-8">
        <div className="grid grid-cols-3 gap-4">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
            <button
              key={num}
              onClick={() => handleKeyPress(num)}
              className="w-18 h-18 py-4 rounded-2xl bg-dark-900 border border-dark-800 text-2xl font-semibold text-white active:scale-95 active:bg-dark-800 transition-all duration-150 flex items-center justify-center hover:border-gray-700 shadow-sm"
            >
              {num}
            </button>
          ))}
          <div className="flex items-center justify-center">
            <span className="text-[10px] text-gray-600 uppercase font-mono">PIN: 1111</span>
          </div>
          <button
            onClick={() => handleKeyPress('0')}
            className="w-18 h-18 py-4 rounded-2xl bg-dark-900 border border-dark-800 text-2xl font-semibold text-white active:scale-95 active:bg-dark-800 transition-all duration-150 flex items-center justify-center hover:border-gray-700 shadow-sm"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="w-18 h-18 py-4 rounded-2xl bg-dark-900/60 border border-dark-800 text-gray-400 active:scale-95 active:bg-dark-800 transition-all duration-150 flex items-center justify-center hover:text-white"
          >
            <Delete className="w-6 h-6" />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-1 text-[11px] text-gray-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Verileriniz telefonunuzda güvenle saklanır</span>
        </div>
      </div>
    </div>
  );
};
