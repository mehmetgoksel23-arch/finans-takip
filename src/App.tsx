import React, { useState } from 'react';
import { useFinanceStore } from './store/useFinanceStore';
import { PinLockScreen } from './components/PinLockScreen';
import { Navbar } from './components/Navbar';
import { BottomNav, TabType } from './components/BottomNav';
import { Dashboard } from './components/Dashboard';
import { CardsView } from './components/CardsView';
import { InstallmentsView } from './components/InstallmentsView';
import { PpfCryptoView } from './components/PpfCryptoView';
import { QuickActionModal } from './components/QuickActionModal';
import { AddJointMoneyModal } from './components/AddJointMoneyModal';
import { QrModal } from './components/QrModal';
import { SettingsModal } from './components/SettingsModal';
import { CashExpensesView } from './components/CashExpensesView';
import { Plus } from 'lucide-react';

export const App: React.FC = () => {
  const store = useFinanceStore();
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  
  // Modallar
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [quickActionType, setQuickActionType] = useState<'spending' | 'payment' | 'ppf' | 'crypto'>('spending');
  const [isAddJointMoneyOpen, setIsAddJointMoneyOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // PIN Kilit Ekranı
  if (store.state.isPinLocked) {
    return <PinLockScreen onUnlock={store.unlockPin} />;
  }

  const handleOpenQuickAction = (type: 'spending' | 'payment' | 'ppf' | 'crypto' = 'spending') => {
    setQuickActionType(type);
    setIsQuickActionOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 flex flex-col font-sans">
      {/* Üst Menü */}
      <Navbar
        onLock={store.lockPin}
        onOpenQr={() => setIsQrOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Ana İçerik Alanı (Mobil Konteyner) */}
      <main className="flex-1 w-full max-w-md mx-auto px-4 pt-4 pb-20">
        {currentTab === 'dashboard' && (
          <Dashboard
            jointTotalBalance={store.jointTotalBalance}
            jointTarget={store.jointTarget}
            jointProgressPercent={store.jointProgressPercent}
            jointRemainingToTarget={store.jointRemainingToTarget}
            jointDailyYield={store.jointDailyYield}
            yieldBadgeText={store.yieldBadgeText}
            gokselDailyYieldShare={store.gokselDailyYieldShare}
            gokselAccumulatedYieldShare={store.gokselAccumulatedYieldShare}
            onOpenAddJointMoney={() => setIsAddJointMoneyOpen(true)}
            netCapitalDebt={store.netCapitalDebt}
            initialCapitalDebt={store.state.initialCapitalDebt}
            personalPpfEarnings={store.personalPpfEarnings}
            totalErodedFromCapital={store.totalErodedFromCapital}
            totalCashExpensesThisMonth={store.cashExpenses
              .filter(e => e.month === 'Kasım 2026')
              .reduce((sum, e) => sum + e.totalAmount, 0)}
            totalCardDebt={store.totalCardDebt}
            currentMonthObligation={store.currentMonthObligation}
            totalRemainingInstallments={store.totalRemainingInstallments}
            cardsWithDaysUntilCutoff={store.cardsWithDaysUntilCutoff}
            onOpenQuickAction={handleOpenQuickAction}
            onNavigateTab={tab => setCurrentTab(tab as TabType)}
          />
        )}

        {currentTab === 'cards' && (
          <CardsView
            cards={store.state.cards}
            onProcessTransaction={store.processCardTransaction}
            onAddCycle={store.addCardCycle}
          />
        )}

        {currentTab === 'expenses' && (
          <CashExpensesView
            cashExpenses={store.cashExpenses}
            onAddExpense={store.addCashExpense}
            onDeleteTransaction={store.deleteCashExpenseTransaction}
            onDeleteItem={store.deleteCashExpenseItem}
          />
        )}

        {currentTab === 'installments' && (
          <InstallmentsView
            installments={store.state.installments}
            onTogglePaid={store.toggleInstallmentPaid}
          />
        )}

        {currentTab === 'crypto_ppf' && (
          <PpfCryptoView
            initialCapitalDebt={store.state.initialCapitalDebt}
            netCapitalDebt={store.netCapitalDebt}
            totalPpfEarnings={store.personalPpfEarnings}
            ppfRecords={store.state.ppfRecords}
            cryptoRecords={store.state.cryptoRecords}
            onAddPpf={store.addPpfRecord}
            onAddCrypto={store.addCryptoRecord}
          />
        )}
      </main>

      {/* Kayan Hızlı Ekleme Butonu (FAB) */}
      <button
        onClick={() => handleOpenQuickAction('spending')}
        title="Hızlı İşlem Ekle"
        className="fixed bottom-20 right-4 sm:right-[calc(50%-13rem)] z-40 w-13 h-13 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/40 flex items-center justify-center active:scale-95 transition-transform"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Alt Gezinme Çubuğu */}
      <BottomNav
        currentTab={currentTab}
        onChangeTab={setCurrentTab}
      />

      {/* Modallar */}
      <QuickActionModal
        isOpen={isQuickActionOpen}
        initialType={quickActionType}
        cards={store.state.cards}
        onClose={() => setIsQuickActionOpen(false)}
        onProcessCardTransaction={store.processCardTransaction}
        onAddPpf={store.addPpfRecord}
        onAddCrypto={store.addCryptoRecord}
      />

      <AddJointMoneyModal
        isOpen={isAddJointMoneyOpen}
        currentBalance={store.jointTotalBalance}
        onClose={() => setIsAddJointMoneyOpen(false)}
        onAddJointContribution={store.addJointContribution}
        onSyncJointFundBalance={store.syncJointFundBalance}
      />

      <QrModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        currentPin={store.state.pin}
        onClose={() => setIsSettingsOpen(false)}
        onUpdatePin={store.updatePin}
        onExportBackup={store.exportBackup}
        onImportBackup={store.importBackup}
        onResetDefaults={store.resetToDefaults}
      />
    </div>
  );
};
export default App;
