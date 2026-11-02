import React, { useState } from 'react';
import { PpfRecord, CryptoRecord } from '../types';
import { Coins, TrendingUp, Plus, ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';

interface PpfCryptoViewProps {
  initialCapitalDebt: number;
  netCapitalDebt: number;
  totalPpfEarnings: number;
  ppfRecords: PpfRecord[];
  cryptoRecords: CryptoRecord[];
  onAddPpf: (amount: number, date?: string, note?: string) => void;
  onAddCrypto: (platform: 'Binance' | 'Midas', amount: number, date?: string, note?: string) => void;
}

export const PpfCryptoView: React.FC<PpfCryptoViewProps> = ({
  initialCapitalDebt,
  netCapitalDebt,
  totalPpfEarnings,
  ppfRecords,
  cryptoRecords,
  onAddPpf,
  onAddCrypto
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'ppf' | 'crypto'>('ppf');

  // Hızlı PPF Ekleme State
  const [quickPpfAmount, setQuickPpfAmount] = useState('');
  const [quickPpfNote, setQuickPpfNote] = useState('');

  // Hızlı Kripto Ekleme State
  const [cryptoPlatform, setCryptoPlatform] = useState<'Binance' | 'Midas'>('Binance');
  const [cryptoType, setCryptoType] = useState<'deposit' | 'withdraw'>('deposit');
  const [cryptoAmount, setCryptoAmount] = useState('');
  const [cryptoNote, setCryptoNote] = useState('');

  const formatTL = (val: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(val);
  };

  const handlePpfSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(quickPpfAmount);
    if (amt > 0) {
      onAddPpf(amt, new Date().toISOString().split('T')[0], quickPpfNote || 'Günlük Getiri');
      setQuickPpfAmount('');
      setQuickPpfNote('');
    }
  };

  const handleCryptoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(cryptoAmount);
    if (amt > 0) {
      const finalAmount = cryptoType === 'withdraw' ? -amt : amt;
      onAddCrypto(cryptoPlatform, finalAmount, new Date().toISOString().split('T')[0], cryptoNote || undefined);
      setCryptoAmount('');
      setCryptoNote('');
    }
  };

  // Kripto Toplamları
  const binanceTotal = cryptoRecords
    .filter(c => c.platform === 'Binance')
    .reduce((sum, c) => sum + c.amount, 0);

  const midasTotal = cryptoRecords
    .filter(c => c.platform === 'Midas')
    .reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="space-y-4 pb-20">
      {/* 1. ÜST ÖZET KARTI (PPF & Sermaye Borcu) */}
      <div className="rounded-3xl bg-gradient-to-br from-emerald-950/80 via-dark-900 to-dark-950 p-5 border border-emerald-500/20 shadow-md">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
          <span className="font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <Coins className="w-4 h-4" />
            PPF Getirisi ile Borç Eritme
          </span>
          <span className="text-gray-400 font-mono text-[11px]">{ppfRecords.length} Gün İşlendi</span>
        </div>

        <div className="grid grid-cols-2 gap-4 my-2">
          <div>
            <span className="text-[11px] text-gray-400">Net Kalan Borç</span>
            <div className="text-2xl font-bold text-white">{formatTL(netCapitalDebt)}</div>
          </div>
          <div>
            <span className="text-[11px] text-gray-400">Toplam PPF Kazancı</span>
            <div className="text-2xl font-bold text-emerald-400">+{formatTL(totalPpfEarnings)}</div>
          </div>
        </div>

        <div className="mt-2 text-[11px] text-gray-400 flex justify-between">
          <span>Başlangıç Sermaye Borcu: {formatTL(initialCapitalDebt)}</span>
          <span className="text-emerald-400 font-semibold">%{(totalPpfEarnings / initialCapitalDebt * 100).toFixed(2)} eritildi</span>
        </div>
      </div>

      {/* 2. SEKME BUTONLARI (PPF vs Kripto) */}
      <div className="grid grid-cols-2 p-1 bg-dark-900 rounded-2xl border border-dark-800">
        <button
          onClick={() => setActiveSubTab('ppf')}
          className={`py-2 text-xs font-semibold rounded-xl transition ${
            activeSubTab === 'ppf' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
          }`}
        >
          Günlük Faiz / PPF ({ppfRecords.length})
        </button>
        <button
          onClick={() => setActiveSubTab('crypto')}
          className={`py-2 text-xs font-semibold rounded-xl transition ${
            activeSubTab === 'crypto' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
          }`}
        >
          Binance & Midas ({cryptoRecords.length})
        </button>
      </div>

      {/* 3. PPF İÇERİĞİ */}
      {activeSubTab === 'ppf' && (
        <div className="space-y-3">
          {/* Hızlı PPF Ekle Formu */}
          <form onSubmit={handlePpfSubmit} className="p-4 rounded-2xl bg-dark-900 border border-dark-800 space-y-2.5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              Bugünün PPF / Faiz Getirisini Ekle
            </h3>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.01"
                placeholder="Örn: 94.50 TL"
                value={quickPpfAmount}
                onChange={e => setQuickPpfAmount(e.target.value)}
                required
                className="flex-1 bg-dark-950 border border-dark-800 rounded-xl px-3 py-2 text-sm text-white focus:border-emerald-500 outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 active:scale-95 transition"
              >
                Kaydet
              </button>
            </div>
            <input
              type="text"
              placeholder="Not (Örn: Fon getirisi - Opsiyonel)"
              value={quickPpfNote}
              onChange={e => setQuickPpfNote(e.target.value)}
              className="w-full bg-dark-950/60 border border-dark-800 rounded-xl px-3 py-1.5 text-xs text-gray-300 focus:border-gray-700 outline-none"
            />
          </form>

          {/* PPF Geçmiş Listesi */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">PPF Getiri Geçmişi</h3>
            {ppfRecords.map(item => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl bg-dark-900 border border-dark-800 text-xs"
              >
                <div>
                  <div className="font-semibold text-white">{item.date}</div>
                  <div className="text-[11px] text-gray-400">{item.note || 'Günlük Getiri'}</div>
                </div>
                <div className="text-sm font-bold text-emerald-400">
                  +{formatTL(item.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. KRİPTO / BİNANCE İÇERİĞİ */}
      {activeSubTab === 'crypto' && (
        <div className="space-y-3">
          {/* İkili Bakiye Kartı */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-dark-900 border border-dark-800">
              <span className="text-[10px] text-gray-400 uppercase font-semibold">Binance Net Akış</span>
              <div className="text-lg font-bold text-amber-400 mt-0.5">{formatTL(binanceTotal)}</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-dark-900 border border-dark-800">
              <span className="text-[10px] text-gray-400 uppercase font-semibold">Midas Kripto Net</span>
              <div className="text-lg font-bold text-indigo-400 mt-0.5">{formatTL(midasTotal)}</div>
            </div>
          </div>

          {/* Kripto Ekleme Formu */}
          <form onSubmit={handleCryptoSubmit} className="p-4 rounded-2xl bg-dark-900 border border-dark-800 space-y-2.5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-indigo-400" />
              Yeni Kripto / Borsa Transferi Ekle
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <select
                value={cryptoPlatform}
                onChange={e => setCryptoPlatform(e.target.value as any)}
                className="bg-dark-950 border border-dark-800 rounded-xl p-2 text-white outline-none"
              >
                <option value="Binance">Binance</option>
                <option value="Midas">Midas Kripto</option>
              </select>

              <select
                value={cryptoType}
                onChange={e => setCryptoType(e.target.value as any)}
                className="bg-dark-950 border border-dark-800 rounded-xl p-2 text-white outline-none"
              >
                <option value="deposit">Giriş / Yatırma (+)</option>
                <option value="withdraw">Çıkış / Çekme (-)</option>
              </select>
            </div>

            <div className="flex gap-2">
              <input
                type="number"
                step="0.01"
                placeholder="Tutar (TL)"
                value={cryptoAmount}
                onChange={e => setCryptoAmount(e.target.value)}
                required
                className="flex-1 bg-dark-950 border border-dark-800 rounded-xl px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 active:scale-95 transition"
              >
                Kaydet
              </button>
            </div>
          </form>

          {/* Kripto Hareketleri Listesi */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">Son Transferler</h3>
            {cryptoRecords.map(item => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl bg-dark-900 border border-dark-800 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    item.amount >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                  }`}>
                    {item.amount >= 0 ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{item.platform}</div>
                    <div className="text-[11px] text-gray-400">{item.date} {item.note ? `• ${item.note}` : ''}</div>
                  </div>
                </div>
                <div className={`text-sm font-bold ${item.amount >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {item.amount >= 0 ? `+${formatTL(item.amount)}` : formatTL(item.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
