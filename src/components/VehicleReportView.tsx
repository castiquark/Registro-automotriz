import React, { useState } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  Calendar,
  Gauge,
  UserCheck,
  Wrench,
  FileText,
  Sparkles,
  Printer,
  Lock,
  Unlock,
  CheckCircle,
  AlertTriangle,
  QrCode,
  Tag,
  Clock,
  DollarSign,
  Share2,
  Building,
  Plus,
  MapPin,
  Award,
  TrendingUp
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RepairCategory } from '../types';

interface VehicleReportViewProps {
  onOpenAiDiagnostics: () => void;
  onOpenPrintableReport: () => void;
  onOpenNewRepair: () => void;
  onOpenNewTransfer?: () => void;
}

export const VehicleReportView: React.FC<VehicleReportViewProps> = ({
  onOpenAiDiagnostics,
  onOpenPrintableReport,
  onOpenNewRepair,
}) => {
  const {
    selectedVehicleId,
    setActiveView,
    getVehicleById,
    getVehicleRepairs,
    unlockedVehicles,
    unlockVehicleReport,
    calculateVehicleScore,
    userSubscription,
    setIsSubscriptionModalOpen,
    mechanics,
    formatCurrency,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'repairs' | 'odometer'>('repairs');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [copiedLink, setCopiedLink] = useState(false);

  const vehicle = selectedVehicleId ? getVehicleById(selectedVehicleId) : null;

  if (!vehicle) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm max-w-xl mx-auto">
        <h2 className="text-xl font-bold text-slate-800">Vehículo no seleccionado</h2>
        <p className="text-sm text-slate-500 mt-2">Por favor selecciona un vehículo del buscador para ver su historial de mantenimiento.</p>
        <button
          onClick={() => setActiveView('search')}
          className="mt-5 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold"
        >
          Volver a la búsqueda
        </button>
      </div>
    );
  }

  const isUnlocked = unlockedVehicles.includes(vehicle.id);
  const repairs = getVehicleRepairs(vehicle.id);
  const score = calculateVehicleScore(vehicle.id);

  // Filter repairs
  const filteredRepairs = activeCategoryFilter === 'all'
    ? repairs
    : repairs.filter((r) => r.category === activeCategoryFilter);

  // Find distinct workshops that worked on this car
  const distinctMechanicIds = Array.from(new Set(repairs.map((r) => r.mechanicId)));
  const creditedWorkshops = distinctMechanicIds.map((id) => mechanics.find((m) => m.id === id)).filter(Boolean);

  const handleUnlock = () => {
    unlockVehicleReport(vehicle.id);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      {/* Navigation Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-sm">
        <button
          id="back-to-search-btn"
          onClick={() => setActiveView('search')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors min-h-[40px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Buscador</span>
        </button>

        <div className="flex items-center gap-2">
          {/* AI Diagnostic Summary */}
          <button
            id="open-ai-analysis-btn"
            onClick={onOpenAiDiagnostics}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-sm shadow-blue-500/20 transition-all min-h-[40px]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Auditoría IA</span>
          </button>

          {/* Printable Report PDF */}
          <button
            id="open-print-report-btn"
            onClick={onOpenPrintableReport}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors min-h-[40px]"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exportar PDF</span>
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors min-h-[40px]"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Copiado' : 'Compartir'}</span>
          </button>
        </div>
      </div>

      {/* Main Vehicle Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Vehicle Photo */}
          <div className="relative md:w-2/5 h-56 md:h-auto min-h-[220px] bg-slate-950">
            <img
              src={vehicle.photo}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent md:hidden" />
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-slate-950 px-3 py-1 rounded-lg font-mono font-black text-sm shadow-md border border-slate-200">
              <span>{vehicle.country === 'UY' ? '🇺🇾' : '🇦🇷'} {vehicle.plate}</span>
            </div>
            <div className="absolute bottom-3 left-3 right-3 text-white text-xs md:hidden flex items-center justify-between">
              <span>{vehicle.year} • {vehicle.fuelType}</span>
              <span>{vehicle.departmentOrProvince}</span>
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="p-5 sm:p-7 md:w-3/5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  {vehicle.year} • {vehicle.fuelType} • {vehicle.transmission}
                </span>
                <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  {vehicle.departmentOrProvince} ({vehicle.country === 'UY' ? 'Uruguay' : 'Argentina'})
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 leading-tight">
                {vehicle.brand} {vehicle.model}
              </h1>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                {vehicle.engineNumber ? `Motor: ${vehicle.engineNumber} • ` : ''}Chasis / VIN: {vehicle.vin}
              </p>
            </div>

            {/* Score & Status Alert */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg ${
                  score >= 80 ? 'bg-emerald-100 text-emerald-800' : score >= 60 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {score}
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block font-medium">Libreta de Taller</span>
                  <strong className={`text-xs font-bold ${
                    score >= 80 ? 'text-emerald-700' : score >= 60 ? 'text-amber-700' : 'text-rose-700'
                  }`}>
                    {score >= 80 ? 'Mantenimiento al Día' : score >= 60 ? 'Mantenimientos Pendientes' : 'Alerta Odómetro'}
                  </strong>
                </div>
              </div>

              <div className={`p-3 rounded-2xl border flex items-center gap-2.5 ${
                vehicle.status === 'clean'
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                  : vehicle.status === 'alert'
                  ? 'bg-rose-50 text-rose-900 border-rose-200'
                  : 'bg-amber-50 text-amber-900 border-amber-200'
              }`}>
                {vehicle.status === 'clean' ? (
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
                <div className="leading-tight">
                  <strong className="text-xs font-bold block">{vehicle.statusLabel}</strong>
                  <span className="text-[10px] block opacity-90">{vehicle.statusExplanation}</span>
                </div>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-center">
              <div>
                <span className="text-[10px] text-slate-500 block">Kilometraje Actual</span>
                <strong className="text-xs sm:text-sm font-bold text-slate-900 font-mono">
                  {vehicle.currentMileage.toLocaleString('es-UY')} km
                </strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Mantenimientos Registrados</span>
                <strong className="text-xs sm:text-sm font-bold text-blue-700">
                  {repairs.length} intervenciones de taller
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Royalty Contributor Workshops Banner */}
        <div className="bg-slate-900 text-slate-300 p-3.5 sm:p-4 border-t border-slate-800 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Talleres mecánicos que cargaron services a este vehículo:{' '}
              <strong className="text-white">
                {creditedWorkshops.map((w) => w?.workshopName).join(', ') || 'Talleres de la red'}
              </strong>
            </span>
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
            Regalías acreditadas a talleres
          </span>
        </div>
      </div>

      {/* Lock Overlay / Purchase Prompt if not unlocked */}
      {!isUnlocked && (
        <div className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-3xl p-6 sm:p-8 text-white text-center space-y-4 shadow-xl border border-blue-500/40 relative overflow-hidden">
          <div className="w-14 h-14 rounded-2xl bg-blue-600/30 text-blue-300 flex items-center justify-center mx-auto border border-blue-400/40">
            <Lock className="w-7 h-7" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Desbloquea el Historial de Mantenimiento Completo
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Accede al detalle de facturas de taller, código QR de verificación, repuestos colocados y cronología de kilometraje.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            {userSubscription.active && (userSubscription.queriesRemaining === 'unlimited' || (typeof userSubscription.queriesRemaining === 'number' && userSubscription.queriesRemaining > 0)) ? (
              <button
                id="unlock-with-sub-btn"
                onClick={handleUnlock}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-lg shadow-emerald-900/40 flex items-center justify-center gap-2 min-h-[48px]"
              >
                <Unlock className="w-4 h-4" />
                <span>Desbloquear con mi Pase ({typeof userSubscription.queriesRemaining === 'number' ? `${userSubscription.queriesRemaining} disp.` : 'Ilimitado'})</span>
              </button>
            ) : (
              <button
                id="buy-pass-to-unlock-btn"
                onClick={() => setIsSubscriptionModalOpen(true)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm shadow-lg shadow-blue-600/40 flex items-center justify-center gap-2 min-h-[48px]"
              >
                <Sparkles className="w-4 h-4" />
                <span>Ver Planes y Pases (Desde $390 UYU)</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-1.5 text-xs font-bold">
          <button
            onClick={() => setActiveTab('repairs')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 min-h-[40px] ${
              activeTab === 'repairs'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Reparaciones & Mantenimientos ({repairs.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('odometer')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 min-h-[40px] ${
              activeTab === 'odometer'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>Auditoría de Odómetro</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenNewRepair}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm shadow-emerald-600/20 min-h-[40px]"
          >
            <Plus className="w-4 h-4" />
            <span>+ Cargar Service</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Repairs Timeline */}
      {activeTab === 'repairs' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-700">Cronograma de Mantenimientos & Diagnósticos:</span>
            {/* Category Filter */}
            <select
              value={activeCategoryFilter}
              onChange={(e) => setActiveCategoryFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="all">Todas las categorías ({repairs.length})</option>
              <option value="mantenimiento_preventivo">Mantenimiento Preventivo</option>
              <option value="motor">Motor & Distribución</option>
              <option value="frenos">Frenos & Seguridad</option>
              <option value="transmision">Transmisión</option>
              <option value="suspension_direccion">Suspensión & Dirección</option>
              <option value="electrico_bateria">Batería & Eléctrico</option>
              <option value="carroceria_choque">Carrocería & Chapa</option>
            </select>
          </div>

          {filteredRepairs.map((repair, idx) => (
            <div
              key={repair.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3 relative overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                    #{filteredRepairs.length - idx}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">{repair.title}</h4>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {repair.date} • {repair.mileage.toLocaleString('es-UY')} km
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verificado por Taller</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">
                    QR: {repair.qrVerificationCode}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {repair.description}
              </p>

              {/* Replaced parts list */}
              {repair.replacedParts && repair.replacedParts.length > 0 && (
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[11px] font-bold text-slate-700 block">Repuestos Colocados:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {repair.replacedParts.map((p, pIdx) => (
                      <span key={pIdx} className="px-2 py-0.5 rounded bg-white text-slate-800 text-[11px] border border-slate-200 font-medium">
                        ✓ {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {repair.diagnosticNotes && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                  <strong>Observación del taller:</strong> {repair.diagnosticNotes}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Building className="w-3.5 h-3.5 text-blue-600" />
                  <span className="font-bold text-slate-800">{repair.workshopName}</span>
                  <span>({repair.workshopCity})</span>
                  <span className="px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 font-semibold text-[10px]">
                    {repair.workshopBadge}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span>Factura/Orden: <strong>{repair.invoiceNumber}</strong></span>
                  <span>Garantía: <strong>{repair.warrantyMonths} meses</strong></span>
                </div>
              </div>
            </div>
          ))}

          {filteredRepairs.length === 0 && (
            <div className="text-center py-10 bg-white rounded-2xl border border-slate-200 p-6">
              <p className="text-slate-500 text-xs">No hay servicios registrados en esta categoría.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Odometer Audit */}
      {activeTab === 'odometer' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                <Gauge className="w-5 h-5 text-blue-600" />
                <span>Auditoría Cronológica de Odómetro por Talleres</span>
              </h3>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                vehicle.hasOdometerRollback
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                {vehicle.hasOdometerRollback ? '⚠️ Discrepancia Detectada' : '✓ Odómetro Conforme'}
              </span>
            </div>

            {vehicle.hasOdometerRollback && vehicle.odometerDiscrepancyNote && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                <div>
                  <strong className="block font-bold">ALERTA PERICIAL:</strong>
                  <span>{vehicle.odometerDiscrepancyNote}</span>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <p className="text-xs text-slate-600">
                Cada intervención mecánica registrada genera una lectura inmutable del odómetro que permite verificar la evolución natural del kilometraje.
              </p>

              <div className="space-y-2">
                {repairs.map((r, i) => (
                  <div
                    key={r.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs font-mono">
                        {r.date.split('-')[0]}
                      </div>
                      <div>
                        <strong className="text-slate-900 block font-bold">{r.title}</strong>
                        <span className="text-slate-500 font-mono text-[11px]">{r.date} • {r.workshopName}</span>
                      </div>
                    </div>

                    <div className="text-right sm:border-l sm:border-slate-200 sm:pl-4">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Lectura Odómetro</span>
                      <strong className="text-sm font-mono font-black text-blue-700">
                        {r.mileage.toLocaleString('es-UY')} km
                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
