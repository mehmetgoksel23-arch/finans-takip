import React from 'react';
import { LayoutDashboard, CreditCard, CalendarClock, TrendingUp } from 'lucide-react';

export type TabType = 'dashboard' | 'cards' | 'installments' | 'crypto_ppf';

interface BottomNavProps {
  currentTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onChangeTab }) => {
  const tabs = [
    { id: 'dashboard' as TabType, label: 'Özet', icon: LayoutDashboard },
    { id: 'cards' as TabType, label: 'Kartlar', icon: CreditCard },
    { id: 'installments' as TabType, label: 'Taksitler', icon: CalendarClock },
    { id: 'crypto_ppf' as TabType, label: 'PPF / Kripto', icon: TrendingUp },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-dark-950/90 backdrop-blur-lg border-t border-dark-800 pb-safe">
      <div className="max-w-md mx-auto grid grid-cols-4 px-2 py-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-150 relative ${
                isActive ? 'text-indigo-400 font-semibold' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 transition-transform ${isActive ? 'scale-110' : ''}`} />
              <span className="text-[10px] tracking-tight">{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 w-8 h-0.5 bg-indigo-500 rounded-full shadow-sm shadow-indigo-500/80" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
