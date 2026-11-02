import React, { useState } from 'react';
import { InstallmentMonth } from '../types';
import { CalendarClock, CheckCircle2, Circle, CheckCheck, Filter } from 'lucide-react';

interface InstallmentsViewProps {
  installments: InstallmentMonth[];
  onTogglePaid: (monthId: string, bank: 'akbank' | 'garanti' | 'denizbank') => void;
}

export const InstallmentsView: React.FC<InstallmentsViewProps> = ({ installments, onTogglePaid }) => {
  const [filterMode, setFilterMode] = useState<'all' | 'unpaid' | 'paid'>('all');

  const formatTL = (val: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(val);
  };

  // Toplam Taksit Hesaplamaları
  let totalGrand = 0;
  let totalPaid = 0;
  let totalRemaining = 0;

  installments.forEach(m => {
    // Akbank
    totalGrand += m.akbank;
    if (m.isPaid.akbank) totalPaid += m.akbank;
    else totalRemaining += m.akbank;

    // Garanti
    totalGrand += m.garanti;
    if (m.isPaid.garanti) totalPaid += m.garanti;
    else totalRemaining += m.garanti;

    // DenizBank
    totalGrand += m.denizbank;
    if (m.isPaid.denizbank) totalPaid += m.denizbank;
    else totalRemaining += m.denizbank;
  });

  const filteredInstallments = installments.filter(m => {
    const isAllPaid = m.isPaid.akbank && m.isPaid.garanti && m.isPaid.denizbank;
    if (filterMode === 'paid') return isAllPaid;
    if (filterMode === 'unpaid') return !isAllPaid;
    return true;
  });

  return (
    <div className="space-y-4 pb-20">
      {/* 1. ÜST ÖZET KARTI */}
      <div className="rounded-3xl bg-gradient-to-br from-dark-900 to-dark-950 p-5 border border-dark-800 shadow-md">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
          <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <CalendarClock className="w-4 h-4 text-cyan-400" />
            Taksitli Krediler / Borçlar (2026 - 2027)
          </span>
          <span className="text-cyan-400 font-mono text-[11px]">3 Banka</span>
        </div>

        <div className="grid grid-cols-2 gap-4 my-2">
          <div>
            <span className="text-[11px] text-gray-400">Kalan Taksit Toplamı</span>
            <div className="text-2xl font-bold text-white">{formatTL(totalRemaining)}</div>
          </div>
          <div>
            <span className="text-[11px] text-gray-400">Şimdiye Kadar Ödenen</span>
            <div className="text-2xl font-bold text-emerald-400">{formatTL(totalPaid)}</div>
          </div>
        </div>

        {/* İlerleme Çubuğu */}
        <div className="mt-2">
          <div className="flex justify-between text-[11px] text-gray-400 mb-1">
            <span>Ödenme Oranı: %{((totalPaid / totalGrand) * 100).toFixed(1)}</span>
            <span>Genel Toplam: {formatTL(totalGrand)}</span>
          </div>
          <div className="w-full bg-dark-950 rounded-full h-2 overflow-hidden border border-gray-800">
            <div
              className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.max(2, (totalPaid / totalGrand) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. FİLTRE BUTONLARI */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Aylık Ödeme Planı</h2>
        <div className="flex bg-dark-900 rounded-xl p-0.5 border border-dark-800 text-[11px]">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-2.5 py-1 rounded-lg transition ${filterMode === 'all' ? 'bg-dark-800 text-white font-semibold' : 'text-gray-400'}`}
          >
            Tümü
          </button>
          <button
            onClick={() => setFilterMode('unpaid')}
            className={`px-2.5 py-1 rounded-lg transition ${filterMode === 'unpaid' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-gray-400'}`}
          >
            Ödenmemiş
          </button>
          <button
            onClick={() => setFilterMode('paid')}
            className={`px-2.5 py-1 rounded-lg transition ${filterMode === 'paid' ? 'bg-emerald-500/20 text-emerald-300 font-semibold' : 'text-gray-400'}`}
          >
            Ödenen
          </button>
        </div>
      </div>

      {/* 3. DÖNEM BAZLI TAKVİM LİSTESİ */}
      <div className="space-y-3">
        {filteredInstallments.map(month => {
          const monthTotal = month.akbank + month.garanti + month.denizbank;
          const isAllPaid = month.isPaid.akbank && month.isPaid.garanti && month.isPaid.denizbank;

          return (
            <div
              key={month.id}
              className={`rounded-2xl p-4 border transition-all ${
                isAllPaid
                  ? 'bg-dark-950/60 border-dark-800/60 opacity-70'
                  : 'bg-dark-900 border-dark-800 shadow-sm'
              }`}
            >
              {/* Dönem Başlığı */}
              <div className="flex items-center justify-between mb-3 border-b border-dark-800/80 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{month.period}</span>
                  {isAllPaid && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 font-medium">
                      <CheckCheck className="w-3 h-3" />
                      Tamamı Ödendi
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-cyan-400">{formatTL(monthTotal)}</span>
                  <span className="text-[10px] text-gray-500 block">Aylık Toplam</span>
                </div>
              </div>

              {/* 3 Banka Taksit Satırları */}
              <div className="space-y-2">
                {/* Akbank */}
                {month.akbank > 0 && (
                  <div
                    onClick={() => onTogglePaid(month.id, 'akbank')}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-dark-950/40 border border-dark-800/60 hover:border-gray-700 transition cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2.5">
                      {month.isPaid.akbank ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-600" />
                      )}
                      <div>
                        <span className={`text-xs font-semibold ${month.isPaid.akbank ? 'line-through text-gray-500' : 'text-gray-200'}`}>
                          Akbank Taksiti
                        </span>
                      </div>
                    </div>
                    <span className={`text-xs font-bold ${month.isPaid.akbank ? 'text-gray-500 line-through' : 'text-white'}`}>
                      {formatTL(month.akbank)}
                    </span>
                  </div>
                )}

                {/* Garanti */}
                {month.garanti > 0 && (
                  <div
                    onClick={() => onTogglePaid(month.id, 'garanti')}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-dark-950/40 border border-dark-800/60 hover:border-gray-700 transition cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2.5">
                      {month.isPaid.garanti ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-600" />
                      )}
                      <div>
                        <span className={`text-xs font-semibold ${month.isPaid.garanti ? 'line-through text-gray-500' : 'text-gray-200'}`}>
                          Garanti Taksiti
                        </span>
                      </div>
                    </div>
                    <span className={`text-xs font-bold ${month.isPaid.garanti ? 'text-gray-500 line-through' : 'text-white'}`}>
                      {formatTL(month.garanti)}
                    </span>
                  </div>
                )}

                {/* DenizBank */}
                {month.denizbank > 0 && (
                  <div
                    onClick={() => onTogglePaid(month.id, 'denizbank')}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-dark-950/40 border border-dark-800/60 hover:border-gray-700 transition cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2.5">
                      {month.isPaid.denizbank ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-600" />
                      )}
                      <div>
                        <span className={`text-xs font-semibold ${month.isPaid.denizbank ? 'line-through text-gray-500' : 'text-gray-200'}`}>
                          DenizBank Taksiti
                        </span>
                      </div>
                    </div>
                    <span className={`text-xs font-bold ${month.isPaid.denizbank ? 'text-gray-500 line-through' : 'text-white'}`}>
                      {formatTL(month.denizbank)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
