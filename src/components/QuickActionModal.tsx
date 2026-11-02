import React, { useState } from 'react';
import { CreditCard as ICreditCard } from '../types';
import { X, ArrowUpRight, ArrowDownRight, Coins, PlusCircle, Check } from 'lucide-react';

interface QuickActionModalProps {
  isOpen: boolean;
  initialType?: 'spending' | 'payment' | 'ppf' | 'crypto';
  cards: ICreditCard[];
  onClose: () => void;
  onProcessCardTransaction: (cardId: string, type: 'payment' | 'spending' | 'interest', amount: number) => void;
  onAddPpf: (amount: number, date?: string, note?: string) => void;
  onAddCrypto: (platform: 'Binance' | 'Midas', amount: number, date?: string, note?: string) => void;
}

export const QuickActionModal: React.FC<QuickActionModalProps> = ({
  isOpen,
  initialType = 'spending',
  cards,
  onClose,
  onProcessCardTransaction,
  onAddPpf,
  onAddCrypto
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'spending' | 'payment' | 'ppf' | 'crypto'>(initialType);
  const [selectedCardId, setSelectedCardId] = useState(cards[0]?.id || '');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [cryptoPlatform, setCryptoPlatform] = useState<'Binance' | 'Midas'>('Binance');
  const [cryptoDirection, setCryptoDirection] = useState<'in' | 'out'>('in');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) return;

    if (activeTab === 'spending') {
      onProcessCardTransaction(selectedCardId, 'spending', val);
    } else if (activeTab === 'payment') {
      onProcessCardTransaction(selectedCardId, 'payment', val);
    } else if (activeTab === 'ppf') {
      onAddPpf(val, new Date().toISOString().split('T')[0], note || 'Günlük Getiri');
    } else if (activeTab === 'crypto') {
      const finalAmt = cryptoDirection === 'out' ? -val : val;
      onAddCrypto(cryptoPlatform, finalAmt, new Date().toISOString().split('T')[0], note);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-dark-900 border-t sm:border border-dark-800 rounded-t-3xl sm:rounded-3xl p-5 space-y-4 shadow-2xl animate-slideUp">
        {/* Başlık ve Kapat Butonu */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Hızlı İşlem Ekle</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-dark-800 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 4 İşlem Türü Butonları */}
        <div className="grid grid-cols-4 gap-1.5 p-1 bg-dark-950 rounded-2xl border border-dark-800">
          <button
            type="button"
            onClick={() => setActiveTab('spending')}
            className={`py-2 rounded-xl text-[11px] font-semibold flex flex-col items-center gap-1 transition ${
              activeTab === 'spending' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'text-gray-400'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            Harcama
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('payment')}
            className={`py-2 rounded-xl text-[11px] font-semibold flex flex-col items-center gap-1 transition ${
              activeTab === 'payment' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-gray-400'
            }`}
          >
            <ArrowDownRight className="w-3.5 h-3.5" />
            Ödeme
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ppf')}
            className={`py-2 rounded-xl text-[11px] font-semibold flex flex-col items-center gap-1 transition ${
              activeTab === 'ppf' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-gray-400'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            PPF Faiz
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('crypto')}
            className={`py-2 rounded-xl text-[11px] font-semibold flex flex-col items-center gap-1 transition ${
              activeTab === 'crypto' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-gray-400'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Kripto
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {(activeTab === 'spending' || activeTab === 'payment') && (
            <div>
              <label className="text-[11px] text-gray-400 font-medium">Kredi Kartı Seçin</label>
              <select
                value={selectedCardId}
                onChange={e => setSelectedCardId(e.target.value)}
                className="w-full mt-1 bg-dark-950 border border-dark-800 rounded-xl p-2.5 text-xs text-white focus:border-indigo-500 outline-none"
              >
                {cards.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} (Güncel Borç: {c.currentDebt.toLocaleString('tr-TR')} TL)
                  </option>
                ))}
              </select>
            </div>
          )}

          {activeTab === 'crypto' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-gray-400 font-medium">Platform</label>
                <select
                  value={cryptoPlatform}
                  onChange={e => setCryptoPlatform(e.target.value as any)}
                  className="w-full mt-1 bg-dark-950 border border-dark-800 rounded-xl p-2.5 text-xs text-white outline-none"
                >
                  <option value="Binance">Binance</option>
                  <option value="Midas">Midas Kripto</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-gray-400 font-medium">İşlem Yönü</label>
                <select
                  value={cryptoDirection}
                  onChange={e => setCryptoDirection(e.target.value as any)}
                  className="w-full mt-1 bg-dark-950 border border-dark-800 rounded-xl p-2.5 text-xs text-white outline-none"
                >
                  <option value="in">Para Girişi (+)</option>
                  <option value="out">Para Çıkışı (-)</option>
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="text-[11px] text-gray-400 font-medium">Tutar (TL)</label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
              autoFocus
              className="w-full mt-1 bg-dark-950 border border-dark-800 rounded-xl p-3 text-lg font-bold text-white focus:border-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] text-gray-400 font-medium">Açıklama / Not (Opsiyonel)</label>
            <input
              type="text"
              placeholder="Örn: Market harcaması, maaş yatırımı..."
              value={note}
              onChange={e => setNote(e.target.value)}
              className="w-full mt-1 bg-dark-950 border border-dark-800 rounded-xl p-2 text-xs text-gray-300 focus:border-gray-700 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 active:scale-98 transition flex items-center justify-center gap-2 mt-2"
          >
            <Check className="w-4 h-4" />
            İşlemi Kaydet
          </button>
        </form>
      </div>
    </div>
  );
};
