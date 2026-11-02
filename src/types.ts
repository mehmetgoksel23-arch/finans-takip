export interface CreditCardCycle {
  month: string; // "Aralık 2026"
  startingDebt: number; // Önceki aydan devreden borç
  interest: number; // Faiz
  payment: number; // Ödenen (pozitif tutar olarak saklanır)
  spending: number; // Ay içi yeni harcama
  remainingDebt: number; // Diğer aya devreden net borç = startingDebt + interest - payment + spending
}

export interface CreditCard {
  id: string;
  name: string; // "Ziraat", "Garanti", "Deniz", "Akbank", "Yapıkredi"
  color: string; // Hex veya Tailwind renk sınıfı
  statementDay: number; // Kesim günü (örn: 3, 11, 16, 17)
  limit: number;
  currentDebt: number;
  cycles: CreditCardCycle[];
}

export interface InstallmentMonth {
  id: string;
  period: string; // "Aralık 2026", "Ocak 2027", vb.
  akbank: number;
  garanti: number;
  denizbank: number;
  isPaid: {
    akbank: boolean;
    garanti: boolean;
    denizbank: boolean;
  };
}

export interface PpfRecord {
  id: string;
  date: string;
  amount: number; // Günlük faiz/PPF getirisi (TL)
  note?: string;
}

export interface CryptoRecord {
  id: string;
  date: string;
  platform: 'Binance' | 'Midas';
  amount: number; // Giriş (+) veya Çıkış (-)
  note?: string;
}

export interface JointContribution {
  id: string;
  date: string;
  amount: number; // Toplam eklenen tutar
  gokselShare: number; // Göksel'in payı (%50)
  partnerShare: number; // Kız arkadaşının payı (%50)
  note?: string;
}

export interface JointFund {
  target: number; // 1,000,000 TL
  principal: number; // 70,000 TL (35k + 35k)
  accumulatedYield: number; // 800 TL
  dailyRatePercent: number; // 0.07 (%0.07)
  startDate: string; // 2026-10-09
  lastCalculatedDate: string; // 2026-11-02
  contributions: JointContribution[];
}

export interface FinanceState {
  pin: string; // Varsayılan "1111"
  isPinLocked: boolean;
  initialCapitalDebt: number; // 123930.33 TL (Excel'deki başlangıç borcu)
  cards: CreditCard[];
  installments: InstallmentMonth[];
  ppfRecords: PpfRecord[];
  cryptoRecords: CryptoRecord[];
  jointFund: JointFund;
}
