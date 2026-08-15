import React, { useState } from 'react';
import { Search, ShieldAlert, ShieldCheck, CheckCircle2, History, AlertTriangle, ArrowRight, Plus, Sparkles, Award, MapPin, Gauge, Fuel, Wrench } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Vehicle } from '../types';

interface VehicleSearchProps {
  onOpenNewVehicle: () => void;
}

export const VehicleSearch: React.FC<VehicleSearchProps> = ({ onOpenNewVehicle }) => {
  const {
    vehicles,
    setSelectedVehicleId,
    setActiveView,
    getVehicleRepairs,
    calculateVehicleScore,
    userSubscription,
    formatCurrency,
    setProcessing
  } = useApp();

  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'UY' | 'AR' | 'clean' | 'alert'>('all');

  const filteredVehicles = vehicles.filter((v) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      v.plate.toLowerCase().includes(q) ||
      v.vin.toLowerCase().includes(q) ||
      (v.engineNumber && v.engineNumber.toLowerCase().includes(q)) ||
      v.brand.toLowerCase().includes(q) ||
      v.model.toLowerCase().includes(q) ||
      v.departmentOrProvince.toLowerCase().includes(q);

    if (!matchesQuery) return false;

    if (activeFilter === 'UY') return v.country === 'UY';
    if (activeFilter === 'AR') return v.country === 'AR';
    if (activeFilter === 'clean') return v.status === 'clean';
    if (activeFilter === 'alert') return v.status === 'alert';

    return true;
  });

  const handleSelectVehicle = (vehicle: Vehicle) => {
    setProcessing(true, `Abriendo informe pericial de ${vehicle.brand} ${vehicle.model}...`);
    setTimeout(() => {
      setProcessing(false);
      setSelectedVehicleId(vehicle.id);
      setActiveView('vehicle_report');
    }, 200);
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-16 max-w-6xl mx-auto">
      {/* Back to Home / Role Selection */}
      <div className="flex items-center justify-between">
        <button
          id="back-to-landing-btn"
          onClick={() => setActiveView('landing')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 bg-white hover:bg-blue-50 px-3.5 py-2 rounded-xl border border-slate-200 transition-colors shadow-2xs"
        >
          <span>← Volver a Inicio / Cambiar Perfil</span>
        </button>

        <button
          onClick={() => setActiveView('mechanics_portal')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors"
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>¿Eres mecánico? Ir al Portal</span>
        </button>
      </div>

      {/* Hero Search Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 p-5 sm:p-8 md:p-10 border border-slate-700/60 shadow-xl text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold">
            <Wrench className="w-3.5 h-3.5" />
            <span>Libreta Digital de Servicios & Mantenimientos de Taller</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Historial de Reparaciones & Services <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-teal-300">
              Registrado por Talleres Mecánicos
            </span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Ingresa la matrícula (chapa) o el número de chasis/motor para auditar los mantenimientos realizados, repuestos cambiados y congruencia de kilometraje.
          </p>

          {/* Search Box */}
          <div className="pt-2 max-w-xl mx-auto space-y-2">
            <div className="relative flex items-center shadow-2xl rounded-2xl bg-slate-950/90 border-2 border-blue-500/50 focus-within:border-blue-400 p-1.5 transition-all">
              <div className="pl-3 text-blue-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                id="vehicle-search-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ingresa matrícula (ej. SBX 4821) o chasis/motor..."
                className="w-full bg-transparent px-3 py-3 text-white placeholder-slate-400 focus:outline-none text-sm sm:text-base font-semibold uppercase tracking-wider min-h-[48px]"
                aria-label="Buscar matrícula o chasis"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="px-3 py-1 text-xs font-bold text-slate-400 hover:text-white bg-slate-800 rounded-lg mr-1"
                >
                  Borrar
                </button>
              )}
            </div>

            {/* Quick Demo Vehicles Chips */}
            <div className="pt-1 flex flex-wrap items-center justify-center gap-1.5 text-xs">
              <span className="text-slate-400 font-medium text-[11px]">Probar con autos de ejemplo:</span>
              <button
                onClick={() => setQuery('SBX 4821')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-300 border border-slate-700 font-mono transition-colors text-[11px]"
              >
                🇺🇾 SBX 4821 (Corolla Híbrido)
              </button>
              <button
                onClick={() => setQuery('B 518 902')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 font-mono transition-colors text-[11px]"
              >
                ⚠️ B 518 902 (Golf GTI Alerta)
              </button>
              <button
                onClick={() => setQuery('AAP 9321')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 font-mono transition-colors text-[11px]"
              >
                🇺🇾 AAP 9321 (Ranger 4x4)
              </button>
              <button
                onClick={() => setQuery('AD 812 PK')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 font-mono transition-colors text-[11px]"
              >
                🇦🇷 AD 812 PK (Peugeot 208)
              </button>
            </div>
          </div>
        </div>

        {/* 3 Confidence Features */}
        <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-4xl mx-auto text-left">
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/40">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-white">Sellos de Taller</h2>
              <p className="text-[11px] text-slate-300">Trabajos, repuestos y fecha de cada service.</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/40">
            <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 shrink-0">
              <Gauge className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-white">Odómetro Auditado</h2>
              <p className="text-[11px] text-slate-300">Detección de inconsistencias de km.</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/40">
            <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-white">Reparto 50% a Mecánicos</h2>
              <p className="text-[11px] text-slate-300">Regalías directas por cada consulta vendida.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Results Header */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900">
              Vehículos con Historial Registrado ({filteredVehicles.length})
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                activeFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setActiveFilter('UY')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                activeFilter === 'UY'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              🇺🇾 Uruguay
            </button>
            <button
              onClick={() => setActiveFilter('AR')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                activeFilter === 'AR'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              🇦🇷 Argentina
            </button>
            <button
              onClick={() => setActiveFilter('clean')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                activeFilter === 'clean'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              ✓ Al Día
            </button>
            <button
              onClick={() => setActiveFilter('alert')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                activeFilter === 'alert'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
              }`}
            >
              ⚠️ Alerta Odómetro
            </button>
          </div>
        </div>

        {/* Vehicle Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVehicles.map((vehicle) => {
            const repairs = getVehicleRepairs(vehicle.id);
            const score = calculateVehicleScore(vehicle.id);

            return (
              <div
                key={vehicle.id}
                onClick={() => handleSelectVehicle(vehicle)}
                className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-blue-400 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Photo & Top Badges */}
                  <div className="relative h-44 bg-slate-950 overflow-hidden">
                    <img
                      src={vehicle.photo}
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                    {/* License Plate Badge */}
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-slate-950 px-2.5 py-1 rounded-lg font-mono font-black text-xs shadow-md border border-slate-200">
                      <span>{vehicle.country === 'UY' ? '🇺🇾' : '🇦🇷'} {vehicle.plate}</span>
                    </div>

                    {/* Score Bubble */}
                    <div className="absolute top-3 right-3 flex items-center gap-1">
                      <div
                        className={`px-2 py-1 rounded-lg font-black text-xs flex items-center gap-1 shadow-md ${
                          score >= 80
                            ? 'bg-emerald-500 text-white'
                            : score >= 60
                            ? 'bg-amber-500 text-white'
                            : 'bg-rose-500 text-white'
                        }`}
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{score} pts</span>
                      </div>
                    </div>

                    {/* Bottom Car Details on image */}
                    <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">{vehicle.year} • {vehicle.fuelType}</span>
                      <span className="font-mono text-slate-300 text-[11px]">
                        {vehicle.currentMileage.toLocaleString('es-UY')} km
                      </span>
                    </div>
                  </div>

                  {/* Vehicle Body Content */}
                  <div className="p-4 sm:p-5 space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span className="font-medium">{vehicle.departmentOrProvince}</span>
                        <span className="font-mono text-[10px] text-slate-400">
                          {vehicle.engineNumber ? `Motor: ${vehicle.engineNumber}` : `Chasis: ${vehicle.vin.slice(0, 10)}...`}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-base text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                        {vehicle.brand} {vehicle.model}
                      </h3>
                    </div>

                    {/* Status Alert or Clean tag */}
                    <div
                      className={`p-2.5 rounded-xl text-xs flex items-start gap-2 ${
                        vehicle.status === 'clean'
                          ? 'bg-emerald-50 text-emerald-900 border border-emerald-200/80'
                          : vehicle.status === 'alert'
                          ? 'bg-rose-50 text-rose-900 border border-rose-200/80'
                          : 'bg-amber-50 text-amber-900 border border-amber-200/80'
                      }`}
                    >
                      {vehicle.status === 'clean' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <strong className="font-bold block text-[11px]">{vehicle.statusLabel}</strong>
                        <span className="text-[10px] block opacity-85 leading-tight">{vehicle.statusExplanation}</span>
                      </div>
                    </div>

                    {/* Workshop Interventions Summary */}
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Wrench className="w-3.5 h-3.5 text-blue-600" />
                        <span className="font-medium">Servicios Taller:</span>
                        <strong className="text-slate-900 font-bold">{repairs.length}</strong>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {repairs[0]?.date ? `Último: ${repairs[0].date}` : 'Sin services'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 pt-0">
                  <button
                    onClick={() => handleSelectVehicle(vehicle)}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-900 group-hover:bg-blue-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 min-h-[44px]"
                  >
                    <span>Ver Historial del Auto</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {filteredVehicles.length === 0 && (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6">
            <p className="text-slate-500 text-sm">No encontramos vehículos con la búsqueda "{query}".</p>
            <button
              onClick={onOpenNewVehicle}
              className="mt-4 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
            >
              + Dar de alta vehículo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
