import React, { useState } from 'react';
import {
  Search,
  Wrench,
  ShieldCheck,
  ArrowRight,
  PlusCircle,
  Car,
  CheckCircle2,
  Coins,
  Building2,
  LogIn,
  LogOut,
  UserCheck,
  Loader2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface LandingHomeProps {
  onOpenNewRepair: () => void;
  onOpenNewVehicle: () => void;
}

export const LandingHome: React.FC<LandingHomeProps> = ({ onOpenNewRepair }) => {
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
    currentUser,
    login,
    logout,
    setIsLoginModalOpen,
    setProcessing,
    showToast
  } = useApp();

  const [directSearchQuery, setDirectSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const currentMechanic = getCurrentMechanic() || mechanics[0];

  const handleDirectSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = directSearchQuery.trim().toUpperCase();
    if (!q) {
      setActiveView('search');
      return;
    }

    setIsSearching(true);
    setProcessing(true, 'Buscando vehículo en la red de talleres...');

    setTimeout(() => {
      setIsSearching(false);
      setProcessing(false);

      const found = vehicles.find(
        (v) =>
          v.plate.toUpperCase().includes(q) ||
          v.vin.toUpperCase().includes(q) ||
          (v.engineNumber && v.engineNumber.toUpperCase().includes(q))
      );

      if (found) {
        setSelectedVehicleId(found.id);
        setActiveView('vehicle_report');
        showToast(`Vehículo ${found.brand} ${found.model} (${found.plate}) encontrado`, 'success');
      } else {
        setActiveView('search');
        showToast(`No se halló coincidencia exacta para "${q}". Mostrando listado completo`, 'info');
      }
    }, 400);
  };

  const handleSelectSample = (plate: string) => {
    setIsSearching(true);
    setProcessing(true, 'Cargando informe pericial...');
    setTimeout(() => {
      setIsSearching(false);
      setProcessing(false);
      const found = vehicles.find((v) => v.plate === plate);
      if (found) {
        setSelectedVehicleId(found.id);
        setActiveView('vehicle_report');
      }
    }, 300);
  };

  const handleLoginAsUser = () => {
    login('user');
  };

  const handleLoginAsMechanic = (mechanicId?: string) => {
    login('mechanic', { mechanicId: mechanicId || selectedMechanicId });
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Session Banner if Logged In */}
      {currentUser && (
        <div className="p-3.5 bg-slate-900 text-white rounded-2xl flex items-center justify-between gap-3 text-xs shadow-md border border-slate-800">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                currentUser.role === 'mechanic' ? 'bg-emerald-600' : 'bg-blue-600'
              }`}
            >
              {currentUser.role === 'mechanic' ? <Wrench className="w-4 h-4" /> : <Car className="w-4 h-4" />}
            </div>
            <div className="truncate">
              <span className="text-slate-400">Sesión activa: </span>
              <strong className="text-white">{currentUser.name}</strong>
              <span className="text-slate-400"> ({currentUser.role === 'mechanic' ? currentUser.workshopName : 'Comprador'})</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveView(currentUser.role === 'mechanic' ? 'mechanics_portal' : 'search')}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-bold transition-colors"
            >
              Ir a mi Panel
            </button>
            <button
              onClick={logout}
              className="p-1 text-slate-400 hover:text-white transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Clean Minimalist Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2.5 pt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-bold">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>Libreta Digital de Taller • Uruguay 🇺🇾 y Argentina 🇦🇷</span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
          Ingreso a AutoHistorial PRO
        </h1>

        <p className="text-slate-600 text-xs sm:text-sm">
          Acceso simplificado: consulta historiales o gestiona los servicios de tu taller.
        </p>
      </div>

      {/* Dual Clean Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {/* ========================================= */}
        {/* CARD 1: USUARIO / COMPRADOR */}
        {/* ========================================= */}
        <div className="bg-white rounded-2xl border-2 border-slate-200 hover:border-blue-500 shadow-sm hover:shadow-md transition-all p-5 sm:p-6 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Comprador / Usuario</h2>
                  <p className="text-[11px] text-slate-500">Consultar historial de auto</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-blue-100/70 text-blue-800 text-[10px] font-bold">
                Auditoría
              </span>
            </div>

            {/* Direct Fast Search */}
            <form onSubmit={handleDirectSearch} className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 block">
                Búsqueda rápida por Matrícula o Chasis:
              </label>
              <div className="flex items-center gap-1.5 p-1 bg-slate-50 border border-slate-300 rounded-xl focus-within:border-blue-500 focus-within:bg-white transition-all">
                <Search className="w-4 h-4 text-slate-400 ml-2" />
                <input
                  type="text"
                  placeholder="ej. SBX 4821 o Chasis..."
                  value={directSearchQuery}
                  onChange={(e) => setDirectSearchQuery(e.target.value)}
                  className="w-full bg-transparent px-2 py-1.5 text-xs font-bold uppercase placeholder:normal-case placeholder:font-normal placeholder-slate-400 text-slate-900 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isSearching}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors shrink-0 flex items-center gap-1"
                >
                  {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Buscar</span>}
                </button>
              </div>

              {/* Sample Chips */}
              <div className="flex flex-wrap items-center gap-1 pt-0.5">
                <span className="text-[10px] text-slate-400">Ejemplos:</span>
                <button
                  type="button"
                  onClick={() => handleSelectSample('SBX 4821')}
                  className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-700"
                >
                  SBX 4821
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectSample('B 518 902')}
                  className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-50 hover:bg-amber-100 text-amber-800"
                >
                  B 518 902 (Alerta)
                </button>
              </div>
            </form>

            <ul className="space-y-1.5 text-xs text-slate-600 pt-1">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Services, repuestos y firmas de taller</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Auditoría de odómetro y kilometraje real</span>
              </li>
            </ul>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <button
              onClick={handleLoginAsUser}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs min-h-[42px]"
            >
              <span>Ingresar como Comprador</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ========================================= */}
        {/* CARD 2: TALLER MECÁNICO */}
        {/* ========================================= */}
        <div className="bg-white rounded-2xl border-2 border-slate-200 hover:border-emerald-500 shadow-sm hover:shadow-md transition-all p-5 sm:p-6 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Taller Mecánico</h2>
                  <p className="text-[11px] text-slate-500">Cargar services y ganar regalías</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100/70 text-emerald-800 text-[10px] font-bold">
                50% Comisión
              </span>
            </div>

            {/* Quick Workshop selector */}
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <label className="text-[10px] font-bold text-slate-600 block">Taller activo:</label>
              <select
                value={selectedMechanicId}
                onChange={(e) => setSelectedMechanicId(e.target.value)}
                className="w-full p-1.5 bg-white border border-slate-300 rounded-lg font-bold text-xs text-slate-900 focus:outline-none"
              >
                {mechanics.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.workshopName} ({m.city})
                  </option>
                ))}
              </select>
            </div>

            <ul className="space-y-1.5 text-xs text-slate-600">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Carga ágil en 30 segundos por matrícula o chasis</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>50% de cada consulta acreditado directamente</span>
              </li>
            </ul>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => handleLoginAsMechanic()}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs min-h-[42px]"
            >
              <Wrench className="w-4 h-4" />
              <span>Ingresar al Portal del Taller</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats Bar - Simple and clean */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-sm text-center grid grid-cols-3 gap-2 text-xs">
        <div>
          <span className="font-black text-blue-400 text-base sm:text-lg block">100%</span>
          <span className="text-slate-400 text-[11px]">Trazabilidad Taller</span>
        </div>
        <div>
          <span className="font-black text-emerald-400 text-base sm:text-lg block">50%</span>
          <span className="text-slate-400 text-[11px]">Regalías al Mecánico</span>
        </div>
        <div>
          <span className="font-black text-sky-400 text-base sm:text-lg block">
            {formatCurrency(totalRoyaltiesDistributedUyu)}
          </span>
          <span className="text-slate-400 text-[11px]">Liquidadas</span>
        </div>
      </div>
    </div>
  );
};
