import { FinanceState } from '../types';

export const INITIAL_FINANCE_STATE: FinanceState = {
  pin: '1111',
  isPinLocked: true,
  initialCapitalDebt: 123930.33, // Excel'deki ana borç tutarı

  cards: [
    {
      id: 'deniz',
      name: 'DenizBank',
      color: 'from-cyan-600 to-blue-900',
      statementDay: 17,
      limit: 194000,
      currentDebt: 10000,
      cycles: [
        { month: 'Temmuz 2026', startingDebt: 77000, interest: 3999.19, payment: 25999.19, spending: 0, remainingDebt: 55000 },
        { month: 'Ağustos 2026', startingDebt: 55000, interest: 2836.71, payment: 19836.71, spending: 0, remainingDebt: 38000 },
        { month: 'Eylül 2026', startingDebt: 38000, interest: 1984.39, payment: 16984.39, spending: 0, remainingDebt: 23000 },
        { month: 'Ekim 2026', startingDebt: 23000, interest: 1147.40, payment: 14147.40, spending: 0, remainingDebt: 10000 },
      ]
    },
    {
      id: 'garanti',
      name: 'Garanti BBVA',
      color: 'from-emerald-600 to-teal-900',
      statementDay: 11,
      limit: 50000,
      currentDebt: 5000,
      cycles: [
        { month: 'Temmuz 2026', startingDebt: 8500, interest: 317.87, payment: 1817.87, spending: 1085.30, remainingDebt: 8085.30 },
        { month: 'Ağustos 2026', startingDebt: 8085.30, interest: 305.60, payment: 1890.90, spending: 2555.00, remainingDebt: 9055.00 },
        { month: 'Eylül 2026', startingDebt: 9055.00, interest: 252.19, payment: 2307.19, spending: 3000.00, remainingDebt: 10000.00 },
        { month: 'Ekim 2026', startingDebt: 10000.00, interest: 289.81, payment: 5289.81, spending: 0, remainingDebt: 5000.00 },
      ]
    },
    {
      id: 'ziraat',
      name: 'Ziraat Bankası',
      color: 'from-red-600 to-rose-900',
      statementDay: 3,
      limit: 50000,
      currentDebt: 5000,
      cycles: [
        { month: 'Temmuz 2026', startingDebt: 12500, interest: 120.67, payment: 2120.67, spending: 0, remainingDebt: 10500 },
        { month: 'Ağustos 2026', startingDebt: 10500, interest: 271.81, payment: 2271.81, spending: 0, remainingDebt: 8500 },
        { month: 'Eylül 2026', startingDebt: 8500, interest: 407.61, payment: 2352.61, spending: 1445.00, remainingDebt: 8000 },
        { month: 'Ekim 2026', startingDebt: 8000, interest: 362.17, payment: 3362.17, spending: 0, remainingDebt: 5000 },
      ]
    },
    {
      id: 'akbank',
      name: 'Akbank',
      color: 'from-rose-600 to-red-800',
      statementDay: 16,
      limit: 10000,
      currentDebt: 5000,
      cycles: [
        { month: 'Temmuz 2026', startingDebt: 5000, interest: 286.67, payment: 1286.67, spending: 4221.65, remainingDebt: 8221.65 },
        { month: 'Ağustos 2026', startingDebt: 8221.65, interest: 389.02, payment: 1610.67, spending: 0, remainingDebt: 7000 },
        { month: 'Eylül 2026', startingDebt: 7000, interest: 441.22, payment: 1441.22, spending: 0, remainingDebt: 6000 },
        { month: 'Ekim 2026', startingDebt: 6000, interest: 354.49, payment: 1354.49, spending: 0, remainingDebt: 5000 },
      ]
    },
    {
      id: 'yapikredi',
      name: 'Yapı Kredi',
      color: 'from-blue-600 to-indigo-900',
      statementDay: 16,
      limit: 1500,
      currentDebt: 0,
      cycles: [
        { month: 'Temmuz 2026', startingDebt: 0, interest: 0, payment: 0, spending: 1277.65, remainingDebt: 1277.65 },
        { month: 'Ağustos 2026', startingDebt: 1277.65, interest: 0, payment: 777.65, spending: 0, remainingDebt: 500 },
        { month: 'Eylül 2026', startingDebt: 500, interest: 0, payment: 629.99, spending: 129.99, remainingDebt: 0 },
        { month: 'Ekim 2026', startingDebt: 0, interest: 0, payment: 248.99, spending: 248.99, remainingDebt: 0 },
      ]
    }
  ],

  installments: [
    { id: '1', period: 'Aralık 2026', akbank: 11485.15, garanti: 12388.60, denizbank: 24067.73, isPaid: { akbank: false, garanti: false, denizbank: false } },
    { id: '2', period: 'Ocak 2027', akbank: 11485.15, garanti: 12388.60, denizbank: 24067.73, isPaid: { akbank: false, garanti: false, denizbank: false } },
    { id: '3', period: 'Şubat 2027', akbank: 11485.15, garanti: 12388.60, denizbank: 24067.73, isPaid: { akbank: false, garanti: false, denizbank: false } },
    { id: '4', period: 'Mart 2027', akbank: 11485.15, garanti: 12388.60, denizbank: 24067.73, isPaid: { akbank: false, garanti: false, denizbank: false } },
    { id: '5', period: 'Nisan 2027', akbank: 11485.15, garanti: 12388.60, denizbank: 24067.73, isPaid: { akbank: false, garanti: false, denizbank: false } },
    { id: '6', period: 'Mayıs 2027', akbank: 11485.15, garanti: 12388.60, denizbank: 24067.73, isPaid: { akbank: false, garanti: false, denizbank: false } },
    { id: '7', period: 'Haziran 2027', akbank: 11485.15, garanti: 12388.60, denizbank: 24067.73, isPaid: { akbank: false, garanti: false, denizbank: false } },
    { id: '8', period: 'Temmuz 2027', akbank: 11485.15, garanti: 12388.60, denizbank: 24067.73, isPaid: { akbank: false, garanti: false, denizbank: false } },
    { id: '9', period: 'Ağustos 2027', akbank: 11485.15, garanti: 12388.60, denizbank: 24067.73, isPaid: { akbank: false, garanti: false, denizbank: false } },
    { id: '10', period: 'Eylül 2027', akbank: 11485.11, garanti: 12388.60, denizbank: 24067.66, isPaid: { akbank: false, garanti: false, denizbank: false } },
    { id: '11', period: 'Ekim 2027', akbank: 0, garanti: 12388.60, denizbank: 0, isPaid: { akbank: true, garanti: false, denizbank: true } },
    { id: '12', period: 'Kasım 2027', akbank: 0, garanti: 12388.60, denizbank: 0, isPaid: { akbank: true, garanti: false, denizbank: true } }
  ],

  ppfRecords: [
    { id: 'ppf-1', date: '2026-10-27', amount: 94.93, note: 'Günlük Fon Getirisi' },
    { id: 'ppf-2', date: '2026-10-28', amount: 35.52, note: 'Günlük Fon Getirisi' },
    { id: 'ppf-3', date: '2026-10-29', amount: 75.94, note: 'Günlük Fon Getirisi' },
    { id: 'ppf-4', date: '2026-10-30', amount: 76.73, note: 'Günlük Fon Getirisi' },
    { id: 'ppf-5', date: '2026-10-31', amount: 84.44, note: 'Günlük Fon Getirisi' },
  ],

  cryptoRecords: [
    { id: 'c-1', date: '2026-10-25', platform: 'Binance', amount: 20000, note: 'Transfer' },
    { id: 'c-2', date: '2026-10-26', platform: 'Binance', amount: 9000, note: 'Transfer' },
    { id: 'c-3', date: '2026-10-27', platform: 'Binance', amount: -5268.52, note: 'Çıkış' },
    { id: 'c-4', date: '2026-10-28', platform: 'Midas', amount: 30000, note: 'Kripto / Portföy' },
    { id: 'c-5', date: '2026-10-29', platform: 'Midas', amount: -20000, note: 'Çıkış' },
    { id: 'c-6', date: '2026-10-30', platform: 'Binance', amount: 50000, note: 'Giriş' },
  ],

  jointFund: {
    target: 1000000, // 1 Milyon TL Hedefi
    principal: 70000, // 70.000 TL Ana Para (35k + 35k)
    accumulatedYield: 813.61, // 813.61 TL Net Getiri (Toplam Bakiye: 70.813,61 TL)
    dailyRatePercent: 0.07, // Günlük Net %0.07 Getiri Oranı
    startDate: '2026-10-09',
    lastCalculatedDate: '2026-11-02',
    contributions: [
      { id: 'c-1', date: '2026-10-09', amount: 30000, gokselShare: 15000, partnerShare: 15000, note: 'İlk Giriş (15.000 + 15.000 TL)' },
      { id: 'c-2', date: '2026-10-24', amount: 40000, gokselShare: 20000, partnerShare: 20000, note: 'İkinci Giriş (20.000 + 20.000 TL)' }
    ]
  }
};
