import React from 'react';
import {
  ShieldCheck,
  Search,
  Wrench,
  BarChart3,
  Sparkles,
  PlusCircle,
  LogIn,
  LogOut,
  User,
  Car
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ViewMode, Currency } from '../types';

interface HeaderProps {
  onOpenNewRepair: () => void;
  onOpenNewVehicle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNewRepair }) => {
  const {
    activeView,
    setActiveView,
    userSubscription,
    setIsSubscriptionModalOpen,
    currentUser,
    logout,
    setIsLoginModalOpen,
    selectedCurrency,
    setSelectedCurrency,
  } = useApp();

  const navItems: { id: ViewMode; label: string; icon: React.ReactNode; show?: boolean }[] = [
    { id: 'landing', label: 'Inicio', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'search', label: 'Consultar Auto', icon: <Search className="w-4 h-4" /> },
    { id: 'mechanics_portal', label: 'Portal Talleres', icon: <Wrench className="w-4 h-4" /> },
    { id: 'pricing', label: 'Planes', icon: <Sparkles className="w-4 h-4" /> }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      {/* Top Banner (clean and concise) */}
      <div className="bg-slate-950/80 text-xs py-1 px-3 sm:px-4 text-center text-slate-300 font-medium flex items-center justify-between gap-2 border-b border-slate-800/80">
        <div className="flex items-center gap-1.5 truncate">
          <span className="inline-flex items-center px-1.5 py-0.2 rounded bg-blue-600/30 text-blue-300 font-bold text-[10px] uppercase border border-blue-500/30">
            🇺🇾 UY & 🇦🇷 AR
          </span>
          <span className="text-[11px] truncate">
            Libreta digital de mantenimientos con 50% de regalías a mecánicos
          </span>
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center gap-1 shrink-0 bg-slate-800/90 rounded-md px-1.5 py-0.5 border border-slate-700 text-[11px]">
          <span className="text-[10px] text-slate-400 hidden xs:inline">Moneda:</span>
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
            onClick={() => setActiveView('landing')}
            className="flex items-center gap-2.5 cursor-pointer select-none group shrink-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-black text-base sm:text-lg text-white tracking-tight">AutoHistorial</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/30 text-blue-300 font-bold border border-blue-400/30">PRO</span>
              </div>
              <p className="text-[10px] text-slate-400 font-normal hidden xs:block mt-0.5">Libreta Digital de Taller</p>
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

          {/* Right Action buttons & Auth */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Quick Record Service Button for Mechanics */}
            <button
              id="header-new-repair-btn"
              onClick={onOpenNewRepair}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-xs"
              title="Registrar mantenimiento de taller"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Nuevo Servicio</span>
              <span className="sm:hidden">Servicio</span>
            </button>

            {/* Auth / Profile Area */}
            {currentUser ? (
              <div className="flex items-center gap-1.5 bg-slate-800/90 py-1 px-2 sm:px-2.5 rounded-xl border border-slate-700 text-xs">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${
                    currentUser.role === 'mechanic' ? 'bg-emerald-600' : 'bg-blue-600'
                  }`}
                >
                  {currentUser.role === 'mechanic' ? <Wrench className="w-3 h-3" /> : <User className="w-3 h-3" />}
                </div>
                <div className="hidden sm:block text-left max-w-[120px] truncate">
                  <span className="font-bold text-white block truncate leading-none text-[11px]">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-slate-400 leading-none">
                    {currentUser.role === 'mechanic' ? 'Taller' : 'Usuario'}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="p-1 text-slate-400 hover:text-white transition-colors ml-1"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                id="header-login-btn"
                onClick={() => setIsLoginModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold transition-all"
              >
                <LogIn className="w-3.5 h-3.5 text-blue-400" />
                <span>Ingresar</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
