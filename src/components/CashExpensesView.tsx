import React, { useState } from 'react';
import { CashExpenseItem } from '../types';
import { 
  Receipt, 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  Trash2, 
  Utensils, 
  ShoppingCart, 
  Coffee, 
  Car, 
  Fuel, 
  Pill, 
  Film,
  Calendar,
  Wallet
} from 'lucide-react';

interface CashExpensesViewProps {
  cashExpenses: CashExpenseItem[];
  onAddExpense: (category: string, amount: number, month?: string, note?: string) => void;
  onDeleteTransaction: (itemId: string, transactionId: string) => void;
  onDeleteItem: (itemId: string) => void;
}

export const CashExpensesView: React.FC<CashExpensesViewProps> = ({
  cashExpenses,
  onAddExpense,
  onDeleteTransaction,
  onDeleteItem
}) => {
  // Varsayılan aktif ay (Kasım 2026)
  const [selectedMonth, setSelectedMonth] = useState('Kasım 2026');
  
  // Yeni harcama formu state
  const [newCategory, setNewCategory] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newNote, setNewNote] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Mevcut kaleme hızlı tutar ekleme state
  const [quickAddId, setQuickAddId] = useState<string | null>(null);
  const [quickAddAmount, setQuickAddAmount] = useState('');
  const [quickAddNote, setQuickAddNote] = useState('');

  // Detay açma/kapama state
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Hızlı öneri etiketleri
  const quickTags = [
    { label: 'Yemek', icon: Utensils },
    { label: 'Market', icon: ShoppingCart },
    { label: 'Kahve / Cafe', icon: Coffee },
    { label: 'Ulaşım / Taksi', icon: Car },
    { label: 'Benzin / Yakıt', icon: Fuel },
    { label: 'Eczane / Sağlık', icon: Pill },
    { label: 'Eğlence', icon: Film },
  ];

  const formatTL = (val: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(val);
  };

  // Seçili aya ait harcamalar
  const currentMonthExpenses = cashExpenses.filter(e => e.month === selectedMonth);
  const totalMonthExpense = currentMonthExpenses.reduce((sum, e) => sum + e.totalAmount, 0);
  const totalTransactionsCount = currentMonthExpenses.reduce((sum, e) => sum + e.transactions.length, 0);

  // Mevcut aylar listesi (varsayılanlar + eklenmiş olanlar)
  const availableMonths = Array.from(new Set([
    'Kasım 2026',
    'Aralık 2026',
    'Ocak 2027',
    'Ekim 2026',
    ...cashExpenses.map(e => e.month)
  ]));

  const handleCreateNewExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(newAmount);
    if (!newCategory.trim() || isNaN(amt) || amt <= 0) return;

    onAddExpense(newCategory.trim(), amt, selectedMonth, newNote.trim() || undefined);
    setNewCategory('');
    setNewAmount('');
    setNewNote('');
    setShowAddForm(false);
  };

  const handleQuickAddSubmit = (category: string) => {
    const amt = parseFloat(quickAddAmount);
    if (isNaN(amt) || amt <= 0) return;

    onAddExpense(category, amt, selectedMonth, quickAddNote.trim() || undefined);
    setQuickAddId(null);
    setQuickAddAmount('');
    setQuickAddNote('');
  };

  return (
    <div className="space-y-4 pb-20">
      {/* 1. ÜST ÖZET KARTI */}
      <div className="rounded-3xl bg-gradient-to-br from-dark-900 via-dark-900 to-dark-950 p-5 border border-dark-800 shadow-xl">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-3 border-b border-dark-800/80 pb-2">
          <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5 text-gray-200">
            <Receipt className="w-4 h-4 text-emerald-400" />
            Nakit Harcama Takibi
          </span>
          
          {/* Ay Seçici */}
          <div className="flex items-center gap-1 bg-dark-950 px-2 py-1 rounded-xl border border-dark-800 text-[11px] text-gray-300">
            <Calendar className="w-3 h-3 text-indigo-400" />
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="bg-transparent text-white font-medium outline-none cursor-pointer"
            >
              {availableMonths.map(m => (
                <option key={m} value={m} className="bg-dark-900 text-white">
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Toplam Bakiye ve İşlem Sayısı */}
        <div className="grid grid-cols-2 gap-3 my-2">
          <div className="p-3.5 rounded-2xl bg-dark-950/70 border border-dark-800">
            <span className="text-[11px] text-gray-400 block font-medium">Bu Ayki Toplam Harcama</span>
            <div className="text-xl sm:text-2xl font-bold text-rose-400 mt-1 truncate">
              {formatTL(totalMonthExpense)}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-dark-950/70 border border-dark-800">
            <span className="text-[11px] text-gray-400 block font-medium">Kalem / Fiş Sayısı</span>
            <div className="text-xl sm:text-2xl font-bold text-emerald-400 mt-1 truncate">
              {currentMonthExpenses.length} <span className="text-xs font-normal text-gray-400">kalem ({totalTransactionsCount} fiş)</span>
            </div>
          </div>
        </div>

        {/* Yeni Harcama Ekleme Butonu */}
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full mt-2 py-2.5 px-4 rounded-2xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95 shadow-sm"
        >
          <Plus className="w-4 h-4 text-indigo-400" />
          {showAddForm ? 'Formu Kapat' : 'Yeni Harcama Kalemi Ekle'}
        </button>
      </div>

      {/* 2. YENİ HARCAMA KALEMİ FORMU */}
      {showAddForm && (
        <form onSubmit={handleCreateNewExpense} className="p-4 rounded-3xl bg-dark-900 border border-indigo-500/30 shadow-xl space-y-3 animate-fadeIn">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-indigo-400" />
              Yeni Harcama Girişi ({selectedMonth})
            </span>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-[11px] text-gray-500 hover:text-gray-300"
            >
              Vazgeç
            </button>
          </div>

          {/* Hızlı Kategori Seçim Etiketleri */}
          <div>
            <label className="text-[10px] text-gray-400 block mb-1.5">Hızlı Kategori Seç veya Kendin Yaz:</label>
            <div className="flex flex-wrap gap-1.5">
              {quickTags.map(tag => {
                const Icon = tag.icon;
                const isSelected = newCategory.toLowerCase() === tag.label.toLowerCase();
                return (
                  <button
                    key={tag.label}
                    type="button"
                    onClick={() => setNewCategory(tag.label)}
                    className={`py-1 px-2.5 rounded-xl text-[11px] font-medium flex items-center gap-1 transition ${
                      isSelected 
                        ? 'bg-indigo-600 text-white font-semibold shadow-sm' 
                        : 'bg-dark-950 text-gray-300 border border-dark-800 hover:border-gray-700'
                    }`}
                  >
                    <Icon className="w-3 h-3 text-indigo-400" />
                    {tag.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="text-[10px] text-gray-400 block mb-0.5">Kategori / Kalem Adı</label>
              <input
                type="text"
                placeholder="Örn: Yemek, Market..."
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                required
                className="w-full bg-dark-950 border border-dark-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-400 block mb-0.5">Tutar (TL)</label>
              <input
                type="number"
                step="any"
                placeholder="Örn: 130"
                value={newAmount}
                onChange={e => setNewAmount(e.target.value)}
                required
                autoFocus
                className="w-full bg-dark-950 border border-dark-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-gray-400 block mb-0.5">Not (İsteğe Bağlı)</label>
            <input
              type="text"
              placeholder="Örn: Döner, Öğle yemeği..."
              value={newNote}
              onChange={e => setNewNote(e.target.value)}
              className="w-full bg-dark-950 border border-dark-800 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition active:scale-95 shadow-md shadow-emerald-900/30"
          >
            Harcamayı Kaydet
          </button>
        </form>
      )}

      {/* 3. AKTİF HARCAMA KALEMLERİ LİSTESİ */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <Receipt className="w-3.5 h-3.5 text-indigo-400" />
            {selectedMonth} Harcama Kalemleri
          </h3>
          <span className="text-[11px] text-gray-500">{currentMonthExpenses.length} kalem</span>
        </div>

        {currentMonthExpenses.length === 0 ? (
          <div className="p-8 text-center rounded-3xl bg-dark-900/40 border border-dashed border-dark-800 text-gray-400 space-y-2">
            <Receipt className="w-8 h-8 mx-auto text-gray-600 opacity-60" />
            <p className="text-xs font-medium text-gray-300">
              {selectedMonth} dönemine ait henüz nakit harcama girilmedi.
            </p>
            <p className="text-[11px] text-gray-500 max-w-xs mx-auto">
              Yukarıdaki <b>"Yeni Harcama Kalemi Ekle"</b> butonuna basarak ilk harcamanızı (örn: Yemek 130 TL) ekleyebilirsiniz.
            </p>
          </div>
        ) : (
          currentMonthExpenses.map(item => {
            const isExpanded = expandedId === item.id;
            const isQuickAddOpen = quickAddId === item.id;

            return (
              <div
                key={item.id}
                className="rounded-2xl bg-dark-900 border border-dark-800 shadow-sm overflow-hidden transition-all duration-200"
              >
                {/* Kalem Kartı Satırı */}
                <div className="p-4 flex items-center justify-between gap-3">
                  {/* Başlık ve Detay Butonu */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    className="flex-1 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white capitalize">{item.category}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-dark-950 text-gray-400 border border-dark-800">
                        {item.transactions.length} fiş
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-500 block mt-0.5">
                      Detayları görmek için dokunun
                    </span>
                  </div>

                  {/* Toplam Tutar ve Hızlı Ekle Butonu */}
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="text-base font-bold text-rose-400">
                        {formatTL(item.totalAmount)}
                      </div>
                    </div>

                    {/* Aynısına Tutar Ekleme Butonu (Kullanıcının tam istediği özellik) */}
                    <button
                      onClick={() => {
                        setQuickAddId(isQuickAddOpen ? null : item.id);
                        setQuickAddAmount('');
                        setQuickAddNote('');
                      }}
                      className="py-1.5 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1 transition active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Ekle
                    </button>

                    {/* Genişletme Oku */}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                      className="p-1 text-gray-500 hover:text-gray-300"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Hızlı Ekleme Mini Formu */}
                {isQuickAddOpen && (
                  <div className="px-4 pb-3 pt-1 border-t border-dark-800/80 bg-dark-950/60 animate-fadeIn space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-300 font-semibold text-[11px]">
                        💳 <b>"{item.category}"</b> kalemine yeni tutar ekle:
                      </span>
                      <button
                        onClick={() => setQuickAddId(null)}
                        className="text-[10px] text-gray-500 hover:text-gray-300"
                      >
                        Kapat
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="number"
                        step="any"
                        placeholder="Örn: 250"
                        value={quickAddAmount}
                        onChange={e => setQuickAddAmount(e.target.value)}
                        autoFocus
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleQuickAddSubmit(item.category);
                        }}
                        className="flex-1 bg-dark-950 border border-dark-800 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-emerald-500 font-bold"
                      />
                      <input
                        type="text"
                        placeholder="Not (isteğe bağlı)"
                        value={quickAddNote}
                        onChange={e => setQuickAddNote(e.target.value)}
                        className="flex-1 bg-dark-950 border border-dark-800 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-emerald-500"
                      />
                      <button
                        onClick={() => handleQuickAddSubmit(item.category)}
                        className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition active:scale-95 shadow-sm"
                      >
                        + Ekle
                      </button>
                    </div>
                  </div>
                )}

                {/* Geçmiş Harcama Fişleri Detayı */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-dark-800/80 bg-dark-950/40 space-y-2 animate-fadeIn">
                    <div className="flex justify-between items-center text-[11px] text-gray-400 font-semibold mb-1">
                      <span>Bu Kalemdeki Harcamalar ({item.transactions.length})</span>
                      <button
                        onClick={() => {
                          if (window.confirm(`"${item.category}" kalemini ve tüm harcamalarını silmek istiyor musunuz?`)) {
                            onDeleteItem(item.id);
                          }
                        }}
                        className="text-[10px] text-rose-400 hover:text-rose-300 flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        Kalemi Sil
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      {item.transactions.map(tx => (
                        <div
                          key={tx.id}
                          className="flex items-center justify-between p-2 rounded-xl bg-dark-900 border border-dark-800/80 text-xs"
                        >
                          <div>
                            <span className="font-bold text-white block">
                              +{formatTL(tx.amount)}
                            </span>
                            <span className="text-[10px] text-gray-500">
                              {tx.date} {tx.note ? `• ${tx.note}` : ''}
                            </span>
                          </div>

                          <button
                            onClick={() => onDeleteTransaction(item.id, tx.id)}
                            className="p-1 text-gray-500 hover:text-rose-400 transition"
                            title="Bu harcamayı sil"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
