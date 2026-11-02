import { useState, useEffect } from 'react';
import { 
  FinanceState, 
  CreditCard, 
  InstallmentMonth, 
  PpfRecord, 
  CryptoRecord, 
  CreditCardCycle,
  JointFund,
  JointContribution,
  CashExpenseItem
} from '../types';
import { INITIAL_FINANCE_STATE } from '../data/initialData';

const STORAGE_KEY = 'goksel_finans_takip_v2';

export function useFinanceStore() {
  const [state, setState] = useState<FinanceState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const migratedCards = (parsed.cards || INITIAL_FINANCE_STATE.cards).map((c: CreditCard) => {
          if (c.cycles && c.cycles.length >= 4 && c.cycles[0].month === 'Eylül 2026') {
            const newCycles = [...c.cycles];
            newCycles[0] = { ...newCycles[0], month: 'Temmuz 2026' };
            newCycles[1] = { ...newCycles[1], month: 'Ağustos 2026' };
            newCycles[2] = { ...newCycles[2], month: 'Eylül 2026' };
            newCycles[3] = { ...newCycles[3], month: 'Ekim 2026' };
            return { ...c, cycles: newCycles };
          }
          return c;
        });

        return {
          ...INITIAL_FINANCE_STATE,
          ...parsed,
          cards: migratedCards,
          jointFund: parsed.jointFund || INITIAL_FINANCE_STATE.jointFund,
          cashExpenses: parsed.cashExpenses || INITIAL_FINANCE_STATE.cashExpenses || []
        };
      }
    } catch (e) {
      console.error('LocalStorage parse error:', e);
    }
    return INITIAL_FINANCE_STATE;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('LocalStorage save error:', e);
    }
  }, [state]);

  // Günlük Ortak Getiriyi Otomatik Güncelleme (Hafta sonu pas geçilir, Pazartesi 3 günlük toplu yansır)
  useEffect(() => {
    if (!state.jointFund) return;
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const lastDateStr = state.jointFund.lastCalculatedDate;

    if (lastDateStr && lastDateStr < todayStr) {
      let balance = state.jointFund.principal + state.jointFund.accumulatedYield;
      const dailyRate = state.jointFund.dailyRatePercent / 100; // %0.07 = 0.0007
      let earnedTotal = 0;
      let iterDate = new Date(lastDateStr);
      const targetDate = new Date(todayStr);
      let advancedDateStr = lastDateStr;

      while (iterDate < targetDate) {
        iterDate.setDate(iterDate.getDate() + 1);
        const dayOfWeek = iterDate.getDay(); // 0: Pazar, 1: Pazartesi, ..., 6: Cumartesi
        const currentIterStr = iterDate.toISOString().split('T')[0];

        if (dayOfWeek === 6 || dayOfWeek === 0) {
          // Cumartesi ve Pazar: Banka kapalı, ekranda getiri verilmez.
          // Tarih ilerletilmez ki Pazartesi günü Cuma->Pazartesi arası 3 gün toplu hesaplansın!
          continue;
        } else if (dayOfWeek === 1) {
          // Pazartesi: Cuma + Cumartesi + Pazar (3 günlük bileşik nema) tek seferde toplu yansır
          const yield3Days = balance * (Math.pow(1 + dailyRate, 3) - 1);
          earnedTotal += yield3Days;
          balance += yield3Days;
          advancedDateStr = currentIterStr;
        } else {
          // Salı, Çarşamba, Perşembe, Cuma: 1 günlük nema
          const yield1Day = balance * dailyRate;
          earnedTotal += yield1Day;
          balance += yield1Day;
          advancedDateStr = currentIterStr;
        }
      }

      if (earnedTotal > 0 || advancedDateStr !== lastDateStr) {
        setState(prev => ({
          ...prev,
          jointFund: {
            ...prev.jointFund,
            accumulatedYield: Math.round((prev.jointFund.accumulatedYield + earnedTotal) * 100) / 100,
            lastCalculatedDate: advancedDateStr
          }
        }));
      }
    }
  }, []);

  // PIN işlemleri
  const unlockPin = (enteredPin: string): boolean => {
    if (enteredPin === state.pin) {
      setState(prev => ({ ...prev, isPinLocked: false }));
      return true;
    }
    return false;
  };

  const lockPin = () => {
    setState(prev => ({ ...prev, isPinLocked: true }));
  };

  const updatePin = (newPin: string) => {
    setState(prev => ({ ...prev, pin: newPin }));
  };

  // ==========================================
  // HESAPLAMALAR & ORTAK BİRİKİM FONU
  // ==========================================
  const jointFund: JointFund = state.jointFund || INITIAL_FINANCE_STATE.jointFund;
  const today = new Date();
  
  // 1. Ortak Hesap Toplamı (Ana Para + Getiri)
  const jointTotalBalance = jointFund.principal + jointFund.accumulatedYield;
  const jointTarget = jointFund.target; // 1.000.000 TL
  const jointProgressPercent = Math.min(100, (jointTotalBalance / jointTarget) * 100);
  const jointRemainingToTarget = Math.max(0, jointTarget - jointTotalBalance);
  
  // Günlük Getiri Tutarı (Banka Takvimi Mantığı: Hafta sonu 0 TL, Pazartesi 3 günlük toplu, Hafta içi 1 günlük)
  const currentDayOfWeek = today.getDay(); // 0: Pazar, 1: Pazartesi, ..., 6: Cumartesi
  const isWeekend = currentDayOfWeek === 0 || currentDayOfWeek === 6;
  const isMonday = currentDayOfWeek === 1;

  let jointDailyYield = 0;
  let yieldBadgeText = 'Günlük Fon Getirisi (%0,07)';

  if (isWeekend) {
    jointDailyYield = 0;
    yieldBadgeText = 'Hafta Sonu (Pazartesi 3 Günlük Toplu Yansıyacak)';
  } else if (isMonday) {
    // Pazartesi: 3 günlük nema (Cuma + Cmt + Pazar)
    jointDailyYield = Math.round((jointTotalBalance * (Math.pow(1 + jointFund.dailyRatePercent / 100, 3) - 1)) * 100) / 100;
    yieldBadgeText = 'Pazartesi (3 Günlük Toplu Getiri)';
  } else {
    // Salı - Cuma: 1 günlük nema
    jointDailyYield = Math.round((jointTotalBalance * (jointFund.dailyRatePercent / 100)) * 100) / 100;
    yieldBadgeText = 'Günlük Fon Getirisi (%0,07)';
  }

  const gokselDailyYieldShare = Math.round((jointDailyYield / 2) * 100) / 100;

  // Göksel'in Ortak Fondan Biriken Getiri Payı (%50)
  const gokselAccumulatedYieldShare = Math.round((jointFund.accumulatedYield / 2) * 100) / 100;

  // 2. Kişisel Girilen PPF Getirileri
  const personalPpfEarnings = state.ppfRecords.reduce((sum, item) => sum + item.amount, 0);

  // 3. Sermaye Borcundan Düşülen Toplam (Ortak Fondan %50 Pay + Kişisel PPF)
  const totalErodedFromCapital = gokselAccumulatedYieldShare + personalPpfEarnings;

  // 4. Net Kalan Sermaye Borcu = 123.930,33 - Toplam Düşülen
  const netCapitalDebt = Math.max(0, state.initialCapitalDebt - totalErodedFromCapital);

  // 5. Kredi Kartı & Taksit Hesaplamaları
  const totalCardDebt = state.cards.reduce((sum, card) => sum + card.currentDebt, 0);

  const totalRemainingInstallments = state.installments.reduce((sum, m) => {
    let monthTotal = 0;
    if (!m.isPaid.akbank) monthTotal += m.akbank;
    if (!m.isPaid.garanti) monthTotal += m.garanti;
    if (!m.isPaid.denizbank) monthTotal += m.denizbank;
    return sum + monthTotal;
  }, 0);

  const totalInterestPaid = state.cards.reduce((sum, card) => {
    return sum + card.cycles.reduce((cSum, cyc) => cSum + (cyc.interest || 0), 0);
  }, 0);

  const currentMonthInstallment = state.installments[0]
    ? (state.installments[0].akbank + state.installments[0].garanti + state.installments[0].denizbank)
    : 0;
  const currentMonthObligation = totalCardDebt + currentMonthInstallment;

  // Kart Kesim Günü Geri Sayımları
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const cardsWithDaysUntilCutoff = state.cards.map(card => {
    let targetDay = card.statementDay;
    let targetDate = new Date(currentYear, currentMonth, targetDay);
    if (targetDay < currentDay) {
      targetDate = new Date(currentYear, currentMonth + 1, targetDay);
    }
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return {
      ...card,
      daysLeft: diffDays === 0 ? 'Bugün Kesim!' : `${diffDays} gün kaldı`,
      isUrgent: diffDays <= 3
    };
  });

  // Ortak Hesaba Para Ekleme
  const addJointContribution = (totalAmount: number, note?: string) => {
    const half = Math.round((totalAmount / 2) * 100) / 100;
    const newContrib: JointContribution = {
      id: `joint-c-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      amount: totalAmount,
      gokselShare: half,
      partnerShare: half,
      note: note || 'Ortak Ek Para (Eşit Paylaşım)'
    };

    setState(prev => ({
      ...prev,
      jointFund: {
        ...prev.jointFund,
        principal: prev.jointFund.principal + totalAmount,
        contributions: [newContrib, ...prev.jointFund.contributions]
      }
    }));
  };

  // Ortak Hesap Bakiyesini Doğrudan Eşitleme
  const syncJointFundBalance = (exactTotalBalance: number) => {
    setState(prev => {
      const fund = prev.jointFund || INITIAL_FINANCE_STATE.jointFund;
      const newYield = Math.max(0, exactTotalBalance - fund.principal);
      return {
        ...prev,
        jointFund: {
          ...fund,
          accumulatedYield: Math.round(newYield * 100) / 100,
          lastCalculatedDate: new Date().toISOString().split('T')[0]
        }
      };
    });
  };

  // Kart İşlemleri
  const addCard = (newCard: Omit<CreditCard, 'id' | 'cycles'>) => {
    const card: CreditCard = {
      ...newCard,
      id: `card-${Date.now()}`,
      cycles: []
    };
    setState(prev => ({ ...prev, cards: [...prev.cards, card] }));
  };

  const updateCardDebt = (cardId: string, newDebt: number) => {
    setState(prev => ({
      ...prev,
      cards: prev.cards.map(c => c.id === cardId ? { ...c, currentDebt: newDebt } : c)
    }));
  };

  const addCardCycle = (cardId: string, cycle: CreditCardCycle) => {
    setState(prev => ({
      ...prev,
      cards: prev.cards.map(c => {
        if (c.id === cardId) {
          return {
            ...c,
            currentDebt: cycle.remainingDebt,
            cycles: [...c.cycles, cycle]
          };
        }
        return c;
      })
    }));
  };

  const toggleInstallmentPaid = (monthId: string, bank: 'akbank' | 'garanti' | 'denizbank') => {
    setState(prev => ({
      ...prev,
      installments: prev.installments.map(m => {
        if (m.id === monthId) {
          return {
            ...m,
            isPaid: {
              ...m.isPaid,
              [bank]: !m.isPaid[bank]
            }
          };
        }
        return m;
      })
    }));
  };

  const addPpfRecord = (amount: number, date?: string, note?: string) => {
    const newRecord: PpfRecord = {
      id: `ppf-${Date.now()}`,
      amount,
      date: date || new Date().toISOString().split('T')[0],
      note: note || 'Kişisel Fon Getirisi'
    };
    setState(prev => ({
      ...prev,
      ppfRecords: [newRecord, ...prev.ppfRecords]
    }));
  };

  const addCryptoRecord = (platform: 'Binance' | 'Midas', amount: number, date?: string, note?: string) => {
    const newRecord: CryptoRecord = {
      id: `crypto-${Date.now()}`,
      platform,
      amount,
      date: date || new Date().toISOString().split('T')[0],
      note
    };
    setState(prev => ({
      ...prev,
      cryptoRecords: [newRecord, ...prev.cryptoRecords]
    }));
  };

  const processCardTransaction = (cardId: string, type: 'payment' | 'spending' | 'interest', amount: number) => {
    setState(prev => ({
      ...prev,
      cards: prev.cards.map(c => {
        if (c.id === cardId) {
          let updatedDebt = c.currentDebt;
          if (type === 'payment') updatedDebt -= amount;
          else updatedDebt += amount;
          return { ...c, currentDebt: Math.max(0, updatedDebt) };
        }
        return c;
      })
    }));
  };

  const resetToDefaults = () => {
    if (window.confirm('Tüm verileri varsayılanlara sıfırlamak istediğinize emin misiniz?')) {
      setState(INITIAL_FINANCE_STATE);
    }
  };

  const exportBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `finans_takip_yedek_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importBackup = (jsonData: string) => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed && parsed.cards && parsed.installments) {
        setState({
          ...INITIAL_FINANCE_STATE,
          ...parsed,
          jointFund: parsed.jointFund || INITIAL_FINANCE_STATE.jointFund
        });
        alert('Yedek başarıyla yüklendi!');
      } else {
        alert('Geçersiz yedek dosyası formatı!');
      }
    } catch (e) {
      alert('Yedek dosyası okunurken hata oluştu!');
    }
  };

  const addCashExpense = (category: string, amount: number, month?: string, note?: string) => {
    if (!category || amount <= 0) return;
    const currentMonth = month || 'Kasım 2026';
    const cleanCat = category.trim();
    const todayStr = new Date().toISOString().split('T')[0];
    const newTx = {
      id: 'tx-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      amount,
      date: todayStr,
      note
    };

    setState(prev => {
      const expenses = prev.cashExpenses || [];
      const existingIdx = expenses.findIndex(
        e => e.month === currentMonth && e.category.toLowerCase() === cleanCat.toLowerCase()
      );

      if (existingIdx >= 0) {
        const updated = [...expenses];
        const item = updated[existingIdx];
        updated[existingIdx] = {
          ...item,
          totalAmount: Number((item.totalAmount + amount).toFixed(2)),
          transactions: [newTx, ...item.transactions]
        };
        return { ...prev, cashExpenses: updated };
      } else {
        const newItem: CashExpenseItem = {
          id: 'exp-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
          category: cleanCat,
          month: currentMonth,
          totalAmount: Number(amount.toFixed(2)),
          transactions: [newTx]
        };
        return { ...prev, cashExpenses: [newItem, ...expenses] };
      }
    });
  };

  const deleteCashExpenseTransaction = (itemId: string, txId: string) => {
    setState(prev => {
      const expenses = (prev.cashExpenses || []).map(item => {
        if (item.id !== itemId) return item;
        const targetTx = item.transactions.find(t => t.id === txId);
        if (!targetTx) return item;
        const newTransactions = item.transactions.filter(t => t.id !== txId);
        const newTotal = Number(newTransactions.reduce((sum, tx) => sum + tx.amount, 0).toFixed(2));
        return {
          ...item,
          totalAmount: newTotal,
          transactions: newTransactions
        };
      }).filter(item => item.transactions.length > 0);

      return { ...prev, cashExpenses: expenses };
    });
  };

  const deleteCashExpenseItem = (itemId: string) => {
    setState(prev => ({
      ...prev,
      cashExpenses: (prev.cashExpenses || []).filter(e => e.id !== itemId)
    }));
  };

  return {
    state,
    unlockPin,
    lockPin,
    updatePin,
    jointFund,
    jointTotalBalance,
    jointTarget,
    jointProgressPercent,
    jointRemainingToTarget,
    jointDailyYield,
    yieldBadgeText,
    isWeekend,
    isMonday,
    gokselDailyYieldShare,
    gokselAccumulatedYieldShare,
    personalPpfEarnings,
    totalErodedFromCapital,
    netCapitalDebt,
    totalCardDebt,
    totalInterestPaid,
    totalRemainingInstallments,
    currentMonthObligation,
    cardsWithDaysUntilCutoff,
    addJointContribution,
    syncJointFundBalance,
    addCard,
    updateCardDebt,
    addCardCycle,
    toggleInstallmentPaid,
    addPpfRecord,
    addCryptoRecord,
    processCardTransaction,
    resetToDefaults,
    exportBackup,
    importBackup,
    cashExpenses: state.cashExpenses || [],
    addCashExpense,
    deleteCashExpenseTransaction,
    deleteCashExpenseItem
  };
}
