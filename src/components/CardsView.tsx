import React, { useState } from 'react';
import { CreditCard as ICreditCard, CreditCardCycle } from '../types';
import { 
  CreditCard, 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  Flame, 
  History, 
  WalletCards, 
  ArrowDownRight, 
  ArrowUpRight,
  Sparkles,
  Calendar,
  Layers
} from 'lucide-react';

interface CardsViewProps {
  cards: ICreditCard[];
  onProcessTransaction: (cardId: string, type: 'payment' | 'spending' | 'interest', amount: number) => void;
  onAddCycle: (cardId: string, cycle: CreditCardCycle) => void;
}

export const CardsView: React.FC<CardsViewProps> = ({ cards, onProcessTransaction, onAddCycle }) => {
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [selectedCycleCard, setSelectedCycleCard] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'default' | 'interest' | 'debt' | 'cutoff'>('default');

  // Hızlı Tekil İşlem (Kart bazında modal/form)
  const [quickActionCardId, setQuickActionCardId] = useState<string | null>(null);
  const [quickActionType, setQuickActionType] = useState<'payment' | 'spending'>('payment');
  const [quickActionAmount, setQuickActionAmount] = useState('');

  // Yeni Döngü Form State
  const [newCycleMonth, setNewCycleMonth] = useState('Kasım 2026');
  const [newCycleInterest, setNewCycleInterest] = useState('');
  const [newCyclePayment, setNewCyclePayment] = useState('');
  const [newCycleSpending, setNewCycleSpending] = useState('');

  const formatTL = (val: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(val);
  };

  // Toplam Hesaplamalar
  const totalLimit = cards.reduce((sum, c) => sum + c.limit, 0);
  const totalDebt = cards.reduce((sum, c) => sum + c.currentDebt, 0);
  const availableLimit = Math.max(0, totalLimit - totalDebt);

  // Kart Başına ve Genel Toplam Ödenen Faiz
  const getCardTotalInterest = (card: ICreditCard) => {
    return card.cycles.reduce((sum, c) => sum + (c.interest || 0), 0);
  };


  // Kart Sıralama
  const sortedCards = [...cards].sort((a, b) => {
    if (sortBy === 'interest') return getCardTotalInterest(b) - getCardTotalInterest(a);
    if (sortBy === 'debt') return b.currentDebt - a.currentDebt;
    if (sortBy === 'cutoff') return a.statementDay - b.statementDay;
    return 0;
  });

  const handleCreateCycle = (card: ICreditCard) => {
    const startingDebt = card.currentDebt;
    const interest = parseFloat(newCycleInterest) || 0;
    const payment = parseFloat(newCyclePayment) || 0;
    const spending = parseFloat(newCycleSpending) || 0;
    const remainingDebt = Math.max(0, startingDebt + interest - payment + spending);

    onAddCycle(card.id, {
      month: newCycleMonth,
      startingDebt,
      interest,
      payment,
      spending,
      remainingDebt
    });

    setSelectedCycleCard(null);
    setNewCycleInterest('');
    setNewCyclePayment('');
    setNewCycleSpending('');
  };

  const handleQuickTransaction = (cardId: string) => {
    const amt = parseFloat(quickActionAmount);
    if (amt > 0) {
      onProcessTransaction(cardId, quickActionType, amt);
      setQuickActionCardId(null);
      setQuickActionAmount('');
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* 1. ÜST ÖZET KARTI (TOPLAM BORÇ & KALAN LİMİT) */}
      <div className="rounded-3xl bg-gradient-to-br from-dark-900 via-dark-900 to-dark-950 p-5 border border-dark-800 shadow-xl">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-3 border-b border-dark-800/80 pb-2">
          <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5 text-gray-200">
            <WalletCards className="w-4 h-4 text-indigo-400" />
            Kart Portföyü
          </span>
          <span className="text-gray-400 font-mono text-[11px]">{cards.length} Kart</span>
        </div>

        {/* 2'li Stat Alanı */}
        <div className="grid grid-cols-2 gap-3 my-2">
          {/* Toplam Borç */}
          <div className="p-3.5 rounded-2xl bg-dark-950/70 border border-dark-800">
            <span className="text-[11px] text-gray-400 block font-medium">Toplam Borç</span>
            <div className="text-base sm:text-lg font-bold text-rose-400 mt-1 truncate">
              {formatTL(totalDebt)}
            </div>
          </div>

          {/* Kullanılabilir Limit */}
          <div className="p-3.5 rounded-2xl bg-dark-950/70 border border-dark-800">
            <span className="text-[11px] text-gray-400 block font-medium">Kalan Limit</span>
            <div className="text-base sm:text-lg font-bold text-emerald-400 mt-1 truncate">
              {formatTL(availableLimit)}
            </div>
          </div>
        </div>

        {/* Toplam Limit İlerleme Çubuğu */}
        <div className="mt-3 pt-2">
          <div className="flex justify-between text-[11px] text-gray-400 mb-1.5">
            <span>Limit Doluluk Oranı: <b className="text-white">%{((totalDebt / totalLimit) * 100).toFixed(1)}</b></span>
            <span>Toplam Limit: <b className="text-gray-300">{formatTL(totalLimit)}</b></span>
          </div>
          <div className="w-full bg-dark-950 rounded-full h-2 overflow-hidden border border-gray-800">
            <div
              className="bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (totalDebt / totalLimit) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. SIRALAMA VE FİLTRE ÇUBUĞU */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          Kredi Kartları
        </h2>

        {/* Sıralama Seçenekleri */}
        <div className="flex bg-dark-900 rounded-xl p-0.5 border border-dark-800 text-[10px]">
          <button
            onClick={() => setSortBy('default')}
            className={`px-2 py-1 rounded-lg transition ${sortBy === 'default' ? 'bg-dark-800 text-white font-semibold' : 'text-gray-400'}`}
          >
            Sıra
          </button>
          <button
            onClick={() => setSortBy('interest')}
            className={`px-2 py-1 rounded-lg transition ${sortBy === 'interest' ? 'bg-dark-800 text-white font-semibold' : 'text-gray-400'}`}
          >
            Faiz
          </button>
          <button
            onClick={() => setSortBy('debt')}
            className={`px-2 py-1 rounded-lg transition ${sortBy === 'debt' ? 'bg-dark-800 text-white font-semibold' : 'text-gray-400'}`}
          >
            Borç
          </button>
          <button
            onClick={() => setSortBy('cutoff')}
            className={`px-2 py-1 rounded-lg transition ${sortBy === 'cutoff' ? 'bg-dark-800 text-white font-semibold' : 'text-gray-400'}`}
          >
            Kesim
          </button>
        </div>
      </div>

      {/* 3. KART LİSTESİ */}
      <div className="space-y-3">
        {sortedCards.map(card => {
          const isExpanded = expandedCardId === card.id;
          const usagePercent = Math.min(100, (card.currentDebt / card.limit) * 100);
          const cardInterest = getCardTotalInterest(card);
          const cardAvailable = Math.max(0, card.limit - card.currentDebt);

          return (
            <div
              key={card.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isExpanded ? 'bg-dark-900 border-indigo-500/30 shadow-lg' : 'bg-dark-900 border-dark-800 shadow-sm'
              }`}
            >
              {/* Kart Ön Yüzü / Tıklanabilir Başlık */}
              <div
                onClick={() => setExpandedCardId(isExpanded ? null : card.id)}
                className="p-4 cursor-pointer hover:bg-dark-850/40 transition select-none"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {/* Banka Logosu / Rozeti */}
                    <div className={`w-11 h-8 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-md shadow-black/30 border border-white/10`}>
                      <CreditCard className="w-5 h-5 opacity-90" />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-white">
                        {card.name}
                      </h3>
                      <div className="text-[11px] text-gray-400 flex items-center gap-1.5 mt-0.5 flex-wrap">
                        <span>Kesim: <b>{card.statementDay}</b>'i</span>
                        <span className="text-gray-600">•</span>
                        <span>Limit: {formatTL(card.limit)}</span>
                        {cardInterest > 0 && (
                          <>
                            <span className="text-gray-600">•</span>
                            <span className="text-gray-400">Faiz: <b className="text-gray-300 font-medium">{formatTL(cardInterest)}</b></span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="text-sm font-bold text-rose-400">{formatTL(card.currentDebt)}</div>
                      <span className="text-[10px] text-gray-500">Kalan: {formatTL(cardAvailable)}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Doluluk Çubuğu */}
                <div className="w-full bg-dark-950 rounded-full h-1.5 overflow-hidden border border-gray-800/60 mt-1">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      usagePercent > 80 ? 'bg-rose-500' : usagePercent > 50 ? 'bg-amber-500' : 'bg-indigo-500'
                    }`}
                    style={{ width: `${Math.max(2, usagePercent)}%` }}
                  />
                </div>
              </div>

              {/* Genişletilmiş Döngü Detayları */}
              {isExpanded && (
                <div className="p-4 pt-2 border-t border-dark-800/80 bg-dark-950/60 space-y-3">
                  {/* Hızlı Kart İşlem Butonları */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setQuickActionCardId(card.id);
                        setQuickActionType('payment');
                      }}
                      className="flex-1 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center justify-center gap-1 transition active:scale-95"
                    >
                      <ArrowDownRight className="w-3.5 h-3.5" />
                      Kartı Öde
                    </button>
                    <button
                      onClick={() => {
                        setQuickActionCardId(card.id);
                        setQuickActionType('spending');
                      }}
                      className="flex-1 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold flex items-center justify-center gap-1 transition active:scale-95"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      Harcama Ekle
                    </button>
                    <button
                      onClick={() => setSelectedCycleCard(card.id)}
                      className="flex-1 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-xs font-semibold flex items-center justify-center gap-1 transition active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Yeni Ay
                    </button>
                  </div>

                  {/* Hızlı Harcama/Ödeme Giriş Alanı */}
                  {quickActionCardId === card.id && (
                    <div className="p-3 rounded-2xl bg-dark-900 border border-dark-800 space-y-2 animate-fadeIn">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-white">
                          {quickActionType === 'payment' ? '💳 Kart Ödemesi Yap' : '🛍️ Kart Harcaması Ekle'}
                        </span>
                        <button
                          onClick={() => setQuickActionCardId(null)}
                          className="text-[10px] text-gray-500 hover:text-gray-300"
                        >
                          Vazgeç
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Tutar (TL)"
                          value={quickActionAmount}
                          onChange={e => setQuickActionAmount(e.target.value)}
                          autoFocus
                          className="flex-1 bg-dark-950 border border-dark-800 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                        />
                        <button
                          onClick={() => handleQuickTransaction(card.id)}
                          className={`px-4 py-1.5 rounded-xl text-xs font-bold text-white transition ${
                            quickActionType === 'payment' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'
                          }`}
                        >
                          Kaydet
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Kartın Toplam Faiz Özeti */}
                  {cardInterest > 0 && (
                    <div className="p-2.5 rounded-xl bg-dark-900 border border-dark-800 flex items-center justify-between text-xs">
                      <span className="text-gray-400">Bu Karta Bugüne Kadar Ödenen Faiz:</span>
                      <span className="font-semibold text-gray-200">{formatTL(cardInterest)}</span>
                    </div>
                  )}

                  {/* Geçmiş Döngüler (Excel 4'lü Satır Modeli) */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-semibold text-gray-400 flex items-center gap-1">
                      <History className="w-3 h-3 text-indigo-400" />
                      Aylık Ekstre Geçmişi
                    </span>

                    {card.cycles.map((cycle, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-dark-900 border border-dark-800 text-xs space-y-1.5 shadow-sm"
                      >
                        <div className="flex justify-between items-center font-bold text-white border-b border-dark-800/80 pb-1">
                          <span className="text-gray-200">{cycle.month}</span>
                          <span className="text-indigo-400">Sonraki Aya Devir: {formatTL(cycle.remainingDebt)}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] pt-0.5">
                          <div className="text-gray-400">
                            Önceki Borç: <span className="text-gray-200 font-medium">{formatTL(cycle.startingDebt)}</span>
                          </div>
                          <div className="text-gray-400">
                            + Faiz: <span className="text-amber-400 font-semibold">+{formatTL(cycle.interest)}</span>
                          </div>
                          <div className="text-gray-400">
                            - Ödenen: <span className="text-emerald-400 font-semibold">-{formatTL(cycle.payment)}</span>
                          </div>
                          <div className="text-gray-400">
                            + Harcama: <span className="text-rose-400 font-semibold">+{formatTL(cycle.spending)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Yeni Ay Döngüsü Ekle Formu */}
                  {selectedCycleCard === card.id && (
                    <div className="p-3.5 rounded-2xl bg-dark-900 border border-indigo-500/40 space-y-3 animate-fadeIn shadow-lg">
                      <h4 className="text-xs font-bold text-indigo-400 uppercase flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                        Yeni Ay Ekstre Döngüsü Ekle
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="text-[10px] text-gray-400">Dönem</label>
                          <input
                            type="text"
                            value={newCycleMonth}
                            onChange={e => setNewCycleMonth(e.target.value)}
                            placeholder="Ocak 2027"
                            className="w-full bg-dark-950 border border-dark-800 rounded-lg p-2 text-white text-xs mt-0.5 focus:border-indigo-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-amber-400 font-semibold">Gelen Faiz (TL)</label>
                          <input
                            type="number"
                            value={newCycleInterest}
                            onChange={e => setNewCycleInterest(e.target.value)}
                            placeholder="0"
                            className="w-full bg-dark-950 border border-amber-500/40 rounded-lg p-2 text-white text-xs mt-0.5 focus:border-amber-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-emerald-400 font-semibold">Yapılan Ödeme (TL)</label>
                          <input
                            type="number"
                            value={newCyclePayment}
                            onChange={e => setNewCyclePayment(e.target.value)}
                            placeholder="0"
                            className="w-full bg-dark-950 border border-emerald-500/40 rounded-lg p-2 text-white text-xs mt-0.5 focus:border-emerald-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-rose-400 font-semibold">Yeni Harcama (TL)</label>
                          <input
                            type="number"
                            value={newCycleSpending}
                            onChange={e => setNewCycleSpending(e.target.value)}
                            placeholder="0"
                            className="w-full bg-dark-950 border border-rose-500/40 rounded-lg p-2 text-white text-xs mt-0.5 focus:border-rose-500 outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => setSelectedCycleCard(null)}
                          className="flex-1 py-2 rounded-xl bg-dark-800 text-gray-300 text-xs font-medium hover:bg-dark-700"
                        >
                          İptal
                        </button>
                        <button
                          onClick={() => handleCreateCycle(card)}
                          className="flex-1 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 shadow-md shadow-indigo-600/30"
                        >
                          Döngüyü Kaydet
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
