import React from 'react';
import { Wallet, QrCode, Lock, Settings } from 'lucide-react';

interface NavbarProps {
  onLock: () => void;
  onOpenQr: () => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onLock, onOpenQr, onOpenSettings }) => {
  const todayStr = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', weekday: 'short' }).format(new Date());

  return (
    <header className="sticky top-0 z-40 bg-dark-950/80 backdrop-blur-md border-b border-dark-800 px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
              Finans & Borç
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-semibold border border-indigo-500/30">PRO</span>
            </h1>
            <p className="text-[11px] text-gray-400 capitalize">{todayStr}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenQr}
            title="Telefona Bağla (QR Kod)"
            className="p-2 rounded-xl bg-dark-900 border border-dark-800 text-gray-300 hover:text-indigo-400 hover:border-indigo-500/40 active:scale-95 transition-all"
          >
            <QrCode className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenSettings}
            title="Ayarlar & Yedek"
            className="p-2 rounded-xl bg-dark-900 border border-dark-800 text-gray-300 hover:text-indigo-400 hover:border-indigo-500/40 active:scale-95 transition-all"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            onClick={onLock}
            title="Uygulamayı Kilitle"
            className="p-2 rounded-xl bg-dark-900 border border-dark-800 text-gray-400 hover:text-rose-400 hover:border-rose-500/40 active:scale-95 transition-all"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
