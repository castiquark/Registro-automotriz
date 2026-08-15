import React from 'react';
import { Search, FileText, Wrench, Sparkles, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ViewMode } from '../types';

export const BottomNav: React.FC = () => {
  const { activeView, setActiveView, selectedVehicleId, userSubscription, setIsSubscriptionModalOpen } = useApp();

  const navItems: { id: ViewMode; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'search',
      label: 'Consultar',
      icon: <Search className="w-5 h-5" />
    },
    {
      id: 'vehicle_report',
      label: 'Informe Auto',
      icon: <FileText className="w-5 h-5" />,
      badge: selectedVehicleId ? '1' : undefined
    },
    {
      id: 'mechanics_portal',
      label: 'Talleres',
      icon: <Wrench className="w-5 h-5" />
    },
    {
      id: 'pricing',
      label: 'Planes',
      icon: <Sparkles className="w-5 h-5" />
    }
  ];

  return (
    <nav
      id="mobile-bottom-navigation"
      aria-label="Navegación principal móvil"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-2 py-1.5 shadow-2xl safe-area-inset-bottom"
    >
      <div className="grid grid-cols-4 gap-1 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              id={`bottom-nav-${item.id}`}
              onClick={() => setActiveView(item.id)}
              className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all select-none min-h-[50px] ${
                isActive
                  ? 'bg-blue-600/20 text-blue-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200 active:bg-slate-800/60'
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.badge && !isActive && (
                  <span className="absolute -top-1 -right-1.5 w-2 h-2 bg-blue-500 rounded-full" />
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight leading-none whitespace-nowrap">
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0.5 w-6 h-0.5 bg-blue-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
