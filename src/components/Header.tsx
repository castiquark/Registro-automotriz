import React from 'react';
import { ShieldCheck, Search, Wrench, BarChart3, Sparkles, PlusCircle, Globe, ChevronDown, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ViewMode, Currency } from '../types';

interface HeaderProps {
  onOpenNewRepair: () => void;
  onOpenNewVehicle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNewRepair, onOpenNewVehicle }) => {
  const {
    activeView,
    setActiveView,
    userSubscription,
    setIsSubscriptionModalOpen,
    mechanics,
    selectedMechanicId,
    setSelectedMechanicId,
    selectedCurrency,
    setSelectedCurrency,
    formatCurrency
  } = useApp();

  const navItems: { id: ViewMode; label: string; icon: React.ReactNode }[] = [
    { id: 'search', label: 'Consultar Auto', icon: <Search className="w-4 h-4" /> },
    { id: 'mechanics_portal', label: 'Portal Talleres', icon: <Wrench className="w-4 h-4" /> },
    { id: 'revenue_ecosystem', label: 'Calculadora Royalties', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'pricing', label: 'Planes y Precios', icon: <Sparkles className="w-4 h-4" /> }
  ];

  const currencyOptions: { code: Currency; label: string; flag: string }[] = [
    { code: 'UYU', label: '$ UYU (Uruguay)', flag: '🇺🇾' },
    { code: 'ARS', label: '$ ARS (Argentina)', flag: '🇦🇷' },
    { code: 'USD', label: 'US$ (Dólares)', flag: '🌐' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-lg">
      {/* Top Banner (clean and concise) */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-xs py-1 px-3 sm:px-4 text-center text-blue-100 font-medium flex items-center justify-between sm:justify-center gap-2">
        <div className="flex items-center gap-1.5 truncate">
          <span className="inline-flex items-center px-1.5 py-0.2 rounded bg-white/20 text-white font-bold text-[10px] uppercase">
            🇺🇾 Uruguay & 🇦🇷 Argentina
          </span>
          <span className="text-[11px] sm:text-xs truncate">
            Cada consulta retribuye directamente a los mecánicos y talleres que mantuvieron el vehículo.
          </span>
        </div>

        {/* Currency Switcher in micro-banner for mobile fast switch */}
        <div className="flex items-center gap-1 shrink-0 bg-black/20 rounded-md px-1.5 py-0.5 border border-white/10 text-[11px]">
          <span className="text-[10px] text-blue-200 hidden xs:inline">Moneda:</span>
          <select
            id="currency-selector-top"
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value as Currency)}
            className="bg-transparent text-white font-bold focus:outline-none cursor-pointer text-xs"
            aria-label="Seleccionar moneda"
          >
            <option value="UYU" className="bg-slate-900 text-white">🇺🇾 $ UYU</option>
            <option value="ARS" className="bg-slate-900 text-white">🇦🇷 $ ARS</option>
            <option value="USD" className="bg-slate-900 text-white">🌐 US$</option>
          </select>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
          {/* Logo */}
          <div
            id="app-logo-btn"
            onClick={() => setActiveView('search')}
            className="flex items-center gap-2.5 cursor-pointer select-none group shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-black text-base sm:text-lg text-white tracking-tight">AutoHistorial</span>
                <span className="text-[10px] sm:text-xs px-1.5 py-0.5 rounded bg-blue-500/30 text-blue-300 font-bold border border-blue-400/30">PRO</span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-normal hidden xs:block mt-0.5">Historial Verificado por Talleres</p>
            </div>
          </div>

          {/* Desktop & Tablet Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-800/90 p-1 rounded-xl border border-slate-700/60">
            {navItems.map((item) => {
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => setActiveView(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mechanic Switcher dropdown (for demo and workshop portal) */}
            <div className="hidden lg:flex items-center gap-1.5 bg-slate-800/90 py-1 px-2.5 rounded-lg border border-slate-700 text-xs">
              <span className="text-slate-400">Taller:</span>
              <select
                id="header-mechanic-select"
                value={selectedMechanicId}
                onChange={(e) => setSelectedMechanicId(e.target.value)}
                className="bg-transparent text-blue-300 font-semibold focus:outline-none cursor-pointer max-w-[150px] truncate"
              >
                {mechanics.map((m) => (
                  <option key={m.id} value={m.id} className="bg-slate-900 text-white">
                    {m.workshopName} ({m.city})
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Record Service Button */}
            <button
              id="header-new-repair-btn"
              onClick={onOpenNewRepair}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-sm"
              title="Registrar mantenimiento de taller"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Nuevo Servicio</span>
              <span className="sm:hidden">Servicio</span>
            </button>

            {/* Subscription Button / Badge */}
            {userSubscription.active ? (
              <button
                id="user-sub-badge"
                onClick={() => setIsSubscriptionModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-500/20 border border-blue-400/40 text-blue-300 text-xs font-bold hover:bg-blue-500/30 transition-colors"
                title="Gestionar pase de consultas"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">{userSubscription.tierName}:</span>
                <span>
                  {userSubscription.queriesRemaining === 'unlimited'
                    ? 'Ilimitadas'
                    : `${userSubscription.queriesRemaining} disp.`}
                </span>
              </button>
            ) : (
              <button
                id="header-get-plan-btn"
                onClick={() => setIsSubscriptionModalOpen(true)}
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ver Planes</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
