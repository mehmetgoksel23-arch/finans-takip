import React from 'react';
import { 
  TrendingDown, 
  TrendingUp, 
  CreditCard, 
  CalendarClock, 
  AlertCircle, 
  PlusCircle, 
  Coins, 
  Target,
  Heart,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Receipt
} from 'lucide-react';
import { CreditCard as ICreditCard } from '../types';

interface DashboardProps {
  // Ortak Birikim Fonu (Ön Planda)
  jointTotalBalance: number;
  jointTarget: number;
  jointProgressPercent: number;
  jointRemainingToTarget: number;
  jointDailyYield: number;
  yieldBadgeText: string;
  gokselDailyYieldShare: number;
  gokselAccumulatedYieldShare: number;
  onOpenAddJointMoney: () => void;

  // Net Sermaye Borcu
  netCapitalDebt: number;
  initialCapitalDebt: number;
  personalPpfEarnings: number;
  totalErodedFromCapital: number;

  // Nakit Harcamalar
  totalCashExpensesThisMonth?: number;

  // Kredi & Kartlar
  totalCardDebt: number;
  currentMonthObligation: number;
  totalRemainingInstallments: number;
  cardsWithDaysUntilCutoff: (ICreditCard & { daysLeft: string; isUrgent: boolean })[];
  onOpenQuickAction: (actionType?: 'spending' | 'payment' | 'ppf' | 'crypto') => void;
  onNavigateTab: (tab: 'cards' | 'installments' | 'expenses' | 'crypto_ppf') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  jointTotalBalance,
  jointTarget,
  jointProgressPercent,
  jointRemainingToTarget,
  jointDailyYield,
  yieldBadgeText,
  gokselDailyYieldShare,
  gokselAccumulatedYieldShare,
  onOpenAddJointMoney,
  netCapitalDebt,
  initialCapitalDebt,
  personalPpfEarnings,
  totalErodedFromCapital,
  totalCashExpensesThisMonth = 0,
  totalCardDebt,
  currentMonthObligation,
  totalRemainingInstallments,
  cardsWithDaysUntilCutoff,
  onOpenQuickAction,
  onNavigateTab
}) => {
  const formatTL = (val: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(val);
  };

  const debtErosionPercent = Math.min(100, (totalErodedFromCapital / initialCapitalDebt) * 100);

  return (
    <div className="space-y-4 pb-20">
      {/* 1. EN ÖN PLANDAKİ ANA KART: ORTAK BİRİKİM & 1 MİLYON HEDEFİ 🎯 */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-dark-900 to-dark-950 p-5 border border-indigo-500/30 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-44 h-44 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-44 h-44 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Başlık ve Eşit Pay Rozeti */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-pink-400 uppercase tracking-wider flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500 animate-pulse" />
            Ortak Birikim Hesabı
          </span>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-semibold flex items-center gap-1">
            <Target className="w-3 h-3 text-indigo-400" />
            Hedef: 1.000.000 TL
          </span>
        </div>

        {/* Ana Para & Bakiye ve Para Ekle Butonu */}
        <div className="flex items-end justify-between my-2">
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {formatTL(jointTotalBalance)}
            </div>
            <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-2">
              <span>Senin: <b className="text-indigo-300 font-semibold">{formatTL(jointTotalBalance / 2)}</b></span>
              <span className="text-gray-600">•</span>
              <span>Kız Arkadaşın: <b className="text-pink-300 font-semibold">{formatTL(jointTotalBalance / 2)}</b></span>
            </div>
          </div>

          <button
            onClick={onOpenAddJointMoney}
            className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 active:scale-95 transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Para Ekle
          </button>
        </div>

        {/* 1 MİLYON HEDEFİ İLERLEME ÇUBUĞU */}
        <div className="mt-4 pt-2 border-t border-dark-800/80">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-gray-300 font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              1M Hedefine: <b className="text-pink-400">%{jointProgressPercent.toFixed(2)}</b>
            </span>
            <span className="text-[11px] text-gray-400">
              Kalan: <b className="text-white">{formatTL(jointRemainingToTarget)}</b>
            </span>
          </div>

          {/* İlerleme Çubuğu */}
          <div className="w-full bg-dark-950 rounded-full h-2.5 overflow-hidden border border-gray-800 p-0.5">
            <div
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-1.5 rounded-full transition-all duration-700 shadow-sm"
              style={{ width: `${Math.max(2, jointProgressPercent)}%` }}
            />
          </div>
        </div>

        {/* GÜNLÜK OTOMATİK GETİRİ VE BORÇTAN DÜŞÜM BİLGİSİ */}
        <div className="mt-3 p-2.5 rounded-xl bg-dark-950/70 border border-dark-800 flex items-center justify-between text-xs">
          <div>
            <div className="text-[10px] text-gray-400 uppercase font-semibold">Günlük Getiri</div>
            <div className="text-xs font-bold text-emerald-400 mt-0.5">
              +{formatTL(jointDailyYield)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-gray-400 uppercase font-semibold">Senin Payın</div>
            <div className="text-xs font-bold text-white mt-0.5">
              +{formatTL(gokselDailyYieldShare)}
            </div>
          </div>
        </div>
      </div>

      {/* 2. ARKA PLANDA / TAMAMLAYICI KART: NET KALAN SERMAYE BORCU */}
      <div className="rounded-2xl bg-dark-900 p-4 border border-dark-800 shadow-sm">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-gray-400" />
            Net Kalan Sermaye Borcu
          </span>
          <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            -{formatTL(totalErodedFromCapital)} Eritildi
          </span>
        </div>

        <div className="flex items-baseline justify-between my-1">
          <div className="text-2xl font-bold text-white tracking-tight">
            {formatTL(netCapitalDebt)}
          </div>
          <span className="text-[11px] text-gray-500">
            Başlangıç: {formatTL(initialCapitalDebt)}
          </span>
        </div>

        {/* Düşüm Detayı */}
        <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1 border-t border-dark-800/80 mt-2">
          <span>Ortak Fondan Payın: <b className="text-emerald-400">-{formatTL(gokselAccumulatedYieldShare)}</b></span>
          <span>Kişisel PPF: <b className="text-emerald-400">-{formatTL(personalPpfEarnings)}</b></span>
        </div>

        {/* Borç Eritme İlerleme Çubuğu */}
        <div className="w-full bg-dark-950 rounded-full h-1.5 mt-2 overflow-hidden border border-gray-800/60">
          <div
            className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${Math.max(1, debtErosionPercent)}%` }}
          />
        </div>
      </div>

      {/* 2.5 NAKİT HARCAMALAR ÖZET KARTI */}
      <div 
        onClick={() => onNavigateTab('expenses')}
        className="rounded-2xl bg-dark-900 p-4 border border-dark-800 shadow-sm cursor-pointer hover:border-gray-700 transition"
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <Receipt className="w-3.5 h-3.5 text-emerald-400" />
            Bu Ayki Nakit Harcamalar
          </span>
          <span className="text-[11px] text-indigo-400 font-medium flex items-center gap-0.5">
            Harcamalar →
          </span>
        </div>
        <div className="flex items-baseline justify-between mt-2">
          <div className="text-2xl font-bold text-white tracking-tight">
            {formatTL(totalCashExpensesThisMonth)}
          </div>
          <span className="text-[11px] text-emerald-400 font-medium">Kasım 2026</span>
        </div>
      </div>

      {/* 3. KESİM GÜNÜ GERİ SAYIMLARI */}
      <div className="rounded-2xl bg-dark-900 p-4 border border-dark-800 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-indigo-400" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">Kart Kesim Günleri</h2>
          </div>
          <button
            onClick={() => onNavigateTab('cards')}
            className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
          >
            Tüm Kartlar →
          </button>
        </div>

        <div className="space-y-2">
          {cardsWithDaysUntilCutoff.map(card => (
            <div
              key={card.id}
              onClick={() => onNavigateTab('cards')}
              className="flex items-center justify-between p-2.5 rounded-xl bg-dark-950/60 border border-dark-800 hover:border-gray-700 transition cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-2.5 h-8 rounded-full bg-gradient-to-b ${card.color}`} />
                <div>
                  <div className="text-xs font-semibold text-white">{card.name}</div>
                  <div className="text-[11px] text-gray-400">
                    Borç: <span className="text-rose-400 font-medium">{formatTL(card.currentDebt)}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1 ${
                    card.isUrgent
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                      : 'bg-dark-800 text-gray-300 border border-gray-700'
                  }`}
                >
                  {card.isUrgent && <AlertCircle className="w-3 h-3 text-rose-400" />}
                  Her ayın {card.statementDay}'i ({card.daysLeft})
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. HIZLI İŞLEMLER */}
      <div>
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">Hızlı İşlemler</h2>
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => onOpenQuickAction('spending')}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-dark-900 border border-dark-800 hover:border-indigo-500/40 active:scale-95 transition"
          >
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-1.5">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-medium text-gray-200">Harcama</span>
          </button>

          <button
            onClick={() => onOpenQuickAction('payment')}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-dark-900 border border-dark-800 hover:border-indigo-500/40 active:scale-95 transition"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-1.5">
              <ArrowDownRight className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-medium text-gray-200">Kart Öde</span>
          </button>

          <button
            onClick={() => onOpenQuickAction('ppf')}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-dark-900 border border-dark-800 hover:border-indigo-500/40 active:scale-95 transition"
          >
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-1.5">
              <Coins className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-medium text-gray-200">+Kişisel PPF</span>
          </button>

          <button
            onClick={() => onOpenQuickAction('crypto')}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-dark-900 border border-dark-800 hover:border-indigo-500/40 active:scale-95 transition"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-1.5">
              <PlusCircle className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-medium text-gray-200">Kripto</span>
          </button>
        </div>
      </div>
    </div>
  );
};
