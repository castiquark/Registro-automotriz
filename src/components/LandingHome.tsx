import React, { useState } from 'react';
import {
  Search,
  Wrench,
  ShieldCheck,
  ArrowRight,
  PlusCircle,
  Car,
  Gauge,
  Award,
  Sparkles,
  DollarSign,
  TrendingUp,
  Building2,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
  Coins
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface LandingHomeProps {
  onOpenNewRepair: () => void;
  onOpenNewVehicle: () => void;
}

export const LandingHome: React.FC<LandingHomeProps> = ({ onOpenNewRepair, onOpenNewVehicle }) => {
  const {
    setActiveView,
    setSelectedVehicleId,
    vehicles,
    mechanics,
    selectedMechanicId,
    setSelectedMechanicId,
    getCurrentMechanic,
    totalRoyaltiesDistributedUyu,
    formatCurrency,
  } = useApp();

  const [directSearchQuery, setDirectSearchQuery] = useState('');
  const currentMechanic = getCurrentMechanic() || mechanics[0];

  const handleDirectSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = directSearchQuery.trim().toUpperCase();
    if (!q) {
      setActiveView('search');
      return;
    }

    const found = vehicles.find(
      (v) =>
        v.plate.toUpperCase().includes(q) ||
        v.vin.toUpperCase().includes(q) ||
        (v.engineNumber && v.engineNumber.toUpperCase().includes(q))
    );

    if (found) {
      setSelectedVehicleId(found.id);
      setActiveView('vehicle_report');
    } else {
      setActiveView('search');
    }
  };

  const handleSelectSample = (plate: string) => {
    const found = vehicles.find((v) => v.plate === plate);
    if (found) {
      setSelectedVehicleId(found.id);
      setActiveView('vehicle_report');
    }
  };

  return (
    <div className="space-y-8 sm:space-y-10 pb-16 max-w-6xl mx-auto">
      {/* Hero Welcome Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 pt-2 sm:pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold shadow-xs">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>Plataforma de Trazabilidad & Libreta Digital • Uruguay 🇺🇾 & Argentina 🇦🇷</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          ¿Cómo deseas ingresar a <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600">
            AutoHistorial PRO
          </span>
          ?
        </h1>

        <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Selecciona tu perfil para consultar el historial verificado de un vehículo o ingresar al panel de gestión de tu taller mecánico.
        </p>
      </div>

      {/* Main Dual Role Selection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* ======================================================== */}
        {/* CARD 1: USUARIO / COMPRADOR / PROPIETARIO */}
        {/* ======================================================== */}
        <div className="relative group bg-white rounded-3xl border-2 border-slate-200 hover:border-blue-500 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
          {/* Top subtle glow bar */}
          <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600 w-full" />

          <div className="p-6 sm:p-8 space-y-6">
            {/* Header / Role Badge */}
            <div className="flex items-start justify-between gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs border border-blue-100 group-hover:scale-105 transition-transform">
                <Car className="w-7 h-7" />
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-100/70 text-blue-800 text-xs font-black uppercase tracking-wider">
                Para Compradores & Dueños
              </span>
            </div>

            {/* Title & Description */}
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                Consultar Historial de un Vehículo
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Audita intervenciones mecánicas, sellos de taller, repuestos colocados y consistencia de kilometraje antes de comprar o vender un auto.
              </p>
            </div>

            {/* Quick In-Card Search Input */}
            <form onSubmit={handleDirectSearch} className="space-y-2 pt-2">
              <label className="text-xs font-bold text-slate-700 block">
                Búsqueda rápida directa por Matrícula o Chasis:
              </label>
              <div className="flex items-center gap-1.5 p-1 bg-slate-50 border border-slate-300 rounded-2xl focus-within:border-blue-500 focus-within:bg-white transition-all shadow-inner">
                <div className="pl-3 text-slate-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="ej. SBX 4821, AAP 9321 o Chasis..."
                  value={directSearchQuery}
                  onChange={(e) => setDirectSearchQuery(e.target.value)}
                  className="w-full bg-transparent px-2 py-2 text-xs sm:text-sm font-bold uppercase placeholder:normal-case placeholder:font-normal placeholder-slate-400 text-slate-900 focus:outline-none min-h-[40px]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors shrink-0 shadow-xs min-h-[40px]"
                >
                  Buscar
                </button>
              </div>

              {/* Sample Plates Quick Chips */}
              <div className="flex flex-wrap items-center gap-1 pt-1">
                <span className="text-[11px] text-slate-400 font-medium">Ejemplos:</span>
                <button
                  type="button"
                  onClick={() => handleSelectSample('SBX 4821')}
                  className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-700 transition-colors"
                >
                  🇺🇾 SBX 4821
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectSample('B 518 902')}
                  className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-800 transition-colors"
                >
                  ⚠️ B 518 902 (Alerta)
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectSample('AD 812 PK')}
                  className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-700 transition-colors"
                >
                  🇦🇷 AD 812 PK
                </button>
              </div>
            </form>

            {/* Feature List */}
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Libreta digital inmutable con órdenes de taller</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Auditoría de odómetro y detección de alteraciones de km</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Informe pericial exportable en PDF con código QR</span>
              </div>
            </div>
          </div>

          {/* Card 1 Action Button */}
          <div className="p-6 sm:p-8 pt-0">
            <button
              id="enter-as-user-btn"
              onClick={() => setActiveView('search')}
              className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 min-h-[48px] group-hover:gap-3"
            >
              <span>Ingresar como Usuario / Consultar Auto</span>
              <ArrowRight className="w-4 h-4 transition-transform" />
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* CARD 2: TALLER MECÁNICO / PROFESIONAL */}
        {/* ======================================================== */}
        <div className="relative group bg-white rounded-3xl border-2 border-slate-200 hover:border-emerald-500 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
          {/* Top subtle glow bar */}
          <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-600 w-full" />

          <div className="p-6 sm:p-8 space-y-6">
            {/* Header / Role Badge */}
            <div className="flex items-start justify-between gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs border border-emerald-100 group-hover:scale-105 transition-transform">
                <Wrench className="w-7 h-7" />
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100/70 text-emerald-800 text-xs font-black uppercase tracking-wider flex items-center gap-1">
                <Coins className="w-3 h-3 text-emerald-600" />
                <span>50% Regalías a Talleres</span>
              </span>
            </div>

            {/* Title & Description */}
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors leading-tight">
                Soy Taller Mecánico / Profesional
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Registra los servicios de tus clientes en 30 segundos por matrícula o chasis, emite certificados QR y genera ingresos cada vez que consulten el auto.
              </p>
            </div>

            {/* Workshop Active Profile Selector */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  <span>Taller seleccionado:</span>
                </span>
                <span className="text-emerald-700 font-extrabold bg-emerald-100/60 px-2 py-0.5 rounded text-[11px]">
                  {currentMechanic.tier}
                </span>
              </div>

              <select
                value={selectedMechanicId}
                onChange={(e) => setSelectedMechanicId(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-xs text-slate-900 focus:outline-none focus:border-emerald-500 min-h-[42px]"
              >
                {mechanics.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.workshopName} ({m.city}, {m.country === 'UY' ? 'Uruguay' : 'Argentina'})
                  </option>
                ))}
              </select>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>Mecánico: <strong className="text-slate-800">{currentMechanic.name}</strong></span>
                <span className="text-emerald-700 font-bold">
                  Acumulado: {formatCurrency(currentMechanic.accumulatedEarningsUyu)}
                </span>
              </div>
            </div>

            {/* Feature List */}
            <div className="space-y-2 pt-1 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Carga ultra rápida sin fricción por chasis o chapa</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>50% del valor de cada consulta acreditado a tu cuenta bancaria</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Respaldo oficial de garantías y órdenes de trabajo digitales</span>
              </div>
            </div>
          </div>

          {/* Card 2 Action Buttons */}
          <div className="p-6 sm:p-8 pt-0 space-y-2.5">
            <button
              id="open-new-repair-landing-btn"
              onClick={onOpenNewRepair}
              className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm transition-all shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 min-h-[46px]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Cargar Mantenimiento / Service</span>
            </button>

            <button
              id="enter-as-mechanic-btn"
              onClick={() => setActiveView('mechanics_portal')}
              className="w-full py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 min-h-[46px]"
            >
              <span>Ingresar al Portal del Taller</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Trust & Network Stats Bar */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
          <div className="space-y-1">
            <span className="text-2xl sm:text-3xl font-black text-blue-400 font-mono">100%</span>
            <p className="text-xs text-slate-300 font-medium">Trazabilidad en Talleres</p>
          </div>

          <div className="space-y-1 pt-4 md:pt-0">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">50%</span>
            <p className="text-xs text-slate-300 font-medium">Reparto a Mecánicos</p>
          </div>

          <div className="space-y-1 pt-4 md:pt-0">
            <span className="text-2xl sm:text-3xl font-black text-sky-400 font-mono">
              {formatCurrency(totalRoyaltiesDistributedUyu)}
            </span>
            <p className="text-xs text-slate-300 font-medium">Regalías Liquidadas</p>
          </div>

          <div className="space-y-1 pt-4 md:pt-0">
            <span className="text-2xl sm:text-3xl font-black text-indigo-400 font-mono">24/7</span>
            <p className="text-xs text-slate-300 font-medium">Auditoría con IA y Sellos QR</p>
          </div>
        </div>
      </div>
    </div>
  );
};
