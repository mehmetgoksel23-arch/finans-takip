import React, { useState } from 'react';
import { X, Heart, Plus, RefreshCw } from 'lucide-react';

interface AddJointMoneyModalProps {
  isOpen: boolean;
  currentBalance: number;
  onClose: () => void;
  onAddJointContribution: (amount: number, note?: string) => void;
  onSyncJointFundBalance: (exactTotal: number) => void;
}

export const AddJointMoneyModal: React.FC<AddJointMoneyModalProps> = ({
  isOpen,
  currentBalance,
  onClose,
  onAddJointContribution,
  onSyncJointFundBalance
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'add' | 'sync'>('add');
  const [amount, setAmount] = useState('');
  const [syncAmount, setSyncAmount] = useState(currentBalance.toString());
  const [note, setNote] = useState('');

  const numAmount = parseFloat(amount) || 0;
  const halfAmount = numAmount / 2;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numAmount > 0) {
      onAddJointContribution(numAmount, note || undefined);
      setAmount('');
      setNote('');
      onClose();
    }
  };

  const handleSyncSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const exactVal = parseFloat(syncAmount);
    if (!isNaN(exactVal) && exactVal > 0) {
      onSyncJointFundBalance(exactVal);
      onClose();
    }
  };

  const formatTL = (val: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-dark-900 border-t sm:border border-dark-800 rounded-t-3xl sm:rounded-3xl p-5 space-y-4 shadow-2xl animate-slideUp">
        {/* Başlık */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center border border-pink-500/20">
              <Heart className="w-4 h-4 text-pink-500 fill-pink-500/30" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Ortak Birikim Yönetimi</h3>
              <p className="text-[11px] text-gray-400">Mevcut Bakiye: {formatTL(currentBalance)}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full bg-dark-800 text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2 Sekme: Para Ekle vs Bakiyeyi Eşitle */}
        <div className="grid grid-cols-2 p-1 bg-dark-950 rounded-2xl border border-dark-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMode('add')}
            className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              mode === 'add' ? 'bg-gradient-to-r from-indigo-600 to-pink-600 text-white shadow-md' : 'text-gray-400'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            Para Ekle
          </button>
          <button
            type="button"
            onClick={() => setMode('sync')}
            className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              mode === 'sync' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Net Bakiyeyi Eşitle
          </button>
        </div>

        {/* 1. SEKME: PARA EKLE */}
        {mode === 'add' && (
          <form onSubmit={handleAddSubmit} className="space-y-3 pt-1">
            <div>
              <label className="text-[11px] text-gray-400 font-semibold uppercase">Toplam Eklenen Tutar (TL)</label>
              <input
                type="number"
                step="100"
                placeholder="Örn: 10000"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                required
                autoFocus
                className="w-full mt-1 bg-dark-950 border border-dark-800 rounded-xl p-3 text-lg font-bold text-white focus:border-indigo-500 outline-none"
              />
            </div>

            {/* Eşit Pay Göstergesi */}
            {numAmount > 0 && (
              <div className="p-3 rounded-2xl bg-dark-950 border border-dark-800 grid grid-cols-2 gap-2 text-xs">
                <div className="border-r border-dark-800 pr-2">
                  <span className="text-[10px] text-gray-400 block">Senin Payın (%50)</span>
                  <span className="text-sm font-bold text-indigo-400">{formatTL(halfAmount)}</span>
                </div>
                <div className="pl-2">
                  <span className="text-[10px] text-gray-400 block">Kız Arkadaşın (%50)</span>
                  <span className="text-sm font-bold text-pink-400">{formatTL(halfAmount)}</span>
                </div>
              </div>
            )}

            <div>
              <label className="text-[11px] text-gray-400 font-semibold uppercase">Not / Açıklama (Opsiyonel)</label>
              <input
                type="text"
                placeholder="Örn: Maaş birikimi, ek para..."
                value={note}
                onChange={e => setNote(e.target.value)}
                className="w-full mt-1 bg-dark-950 border border-dark-800 rounded-xl p-2.5 text-xs text-white focus:border-gray-700 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-pink-600/20 active:scale-98 transition flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Birikime Ekle
            </button>
          </form>
        )}

        {/* 2. SEKME: NET BAKİYEYİ EŞİTLE */}
        {mode === 'sync' && (
          <form onSubmit={handleSyncSubmit} className="space-y-3 pt-1">
            <div>
              <label className="text-[11px] text-gray-400 font-semibold uppercase">Banka Hesabındaki Güncel Net Tutar (TL)</label>
              <input
                type="number"
                step="0.01"
                placeholder="Örn: 70813.61"
                value={syncAmount}
                onChange={e => setSyncAmount(e.target.value)}
                required
                autoFocus
                className="w-full mt-1 bg-dark-950 border border-indigo-500/50 rounded-xl p-3 text-lg font-bold text-white focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="p-3 rounded-2xl bg-dark-950/70 border border-dark-800 text-xs text-gray-400 space-y-1">
              <span className="font-semibold text-white block">ℹ️ Bakiye Eşitleme Nasıl Çalışır?</span>
              <p className="text-[11px] leading-relaxed">
                Kız arkadaşınızın hesabında gördüğünüz kuruşu kuruşuna net tutarı buraya girdiğinizde, 70.000 TL ana paranın üzerindeki tüm fark (net biriken nema) olarak güncellenir ve yarısı otomatik olarak sermaye borcunuzdan düşülür.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/20 active:scale-98 transition flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Bakiyeyi Güncelle
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
