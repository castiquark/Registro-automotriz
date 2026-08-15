import React, { useState } from 'react';
import {
  Wrench,
  DollarSign,
  TrendingUp,
  Award,
  CheckCircle2,
  Calendar,
  Gauge,
  PlusCircle,
  CreditCard,
  Building,
  UserCheck,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  Search,
  MapPin
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface MechanicPortalProps {
  onOpenNewRepair: () => void;
  onOpenNewTransfer: () => void;
}

export const MechanicPortal: React.FC<MechanicPortalProps> = ({
  onOpenNewRepair,
  onOpenNewTransfer,
}) => {
  const {
    mechanics,
    selectedMechanicId,
    setSelectedMechanicId,
    getCurrentMechanic,
    getMechanicRepairs,
    requestMechanicPayout,
    payouts,
    vehicles,
    transactions,
    formatCurrency,
  } = useApp();

  const currentMechanic = getCurrentMechanic() || mechanics[0];
  const mechanicRepairs = getMechanicRepairs(currentMechanic.id);
  const mechanicPayouts = payouts.filter((p) => p.mechanicId === currentMechanic.id);

  const [payoutAmount, setPayoutAmount] = useState<string>('');
  const [payoutMethod, setPayoutMethod] = useState<string>('brou');
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [payoutSuccessMsg, setPayoutSuccessMsg] = useState<string | null>(null);

  // Calculate distinct vehicles registered by this mechanic
  const distinctVehicleIds = Array.from(new Set(mechanicRepairs.map((r) => r.vehicleId)));
  const registeredVehicles = distinctVehicleIds.map((id) => vehicles.find((v) => v.id === id)).filter(Boolean);

  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(payoutAmount);
    if (isNaN(amount) || amount <= 0 || amount > currentMechanic.pendingEarningsUyu) {
      alert('Por favor introduce un importe válido inferior o igual a tu saldo disponible.');
      return;
    }

    const methodDesc =
      payoutMethod === 'brou'
        ? `Transferencia BROU Instantánea (${currentMechanic.bankAccount})`
        : payoutMethod === 'santander'
        ? `Banco Santander (${currentMechanic.bankAccount})`
        : payoutMethod === 'prex'
        ? `Prex Card / Dinero Ya`
        : `Transferencia Bancaria CBU/CVU (${currentMechanic.bankAccount})`;

    const success = requestMechanicPayout(currentMechanic.id, amount, methodDesc);
    if (success) {
      setPayoutSuccessMsg(`¡Solicitud de liquidación por ${formatCurrency(amount)} procesada con éxito!`);
      setPayoutAmount('');
      setIsPayoutModalOpen(false);
      setTimeout(() => setPayoutSuccessMsg(null), 4000);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-20 max-w-6xl mx-auto">
      {/* Top Banner / Switcher */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <img
              src={currentMechanic.avatar}
              alt={currentMechanic.name}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-blue-400/40 shadow-md shrink-0"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg sm:text-2xl font-black text-white leading-tight">
                  {currentMechanic.workshopName}
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 text-xs font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {currentMechanic.tier}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                {currentMechanic.city} ({currentMechanic.country === 'UY' ? 'Uruguay' : 'Argentina'}) • RUT/CUIT: {currentMechanic.rutOrCuit}
              </p>
            </div>
          </div>

          {/* Quick Actions & Switcher */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenNewRepair}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-colors min-h-[44px]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Registrar Servicio</span>
            </button>

            {/* Switch mechanic selector */}
            <div className="bg-slate-800 px-3 py-2 rounded-xl border border-slate-700 text-xs flex items-center gap-1.5">
              <span className="text-slate-400 hidden sm:inline">Cambiar Taller:</span>
              <select
                value={selectedMechanicId}
                onChange={(e) => setSelectedMechanicId(e.target.value)}
                className="bg-transparent text-blue-300 font-bold focus:outline-none cursor-pointer text-xs"
              >
                {mechanics.map((m) => (
                  <option key={m.id} value={m.id} className="bg-slate-900 text-white">
                    {m.workshopName} ({m.city})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {payoutSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500 text-emerald-900 font-bold text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>{payoutSuccessMsg}</span>
        </div>
      )}

      {/* Financial Metrics Cards (Mobile: 1 col, Tablet: 2 col, Desktop: 4 col) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pending Royalties (Ready to withdraw) */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Saldo Disponible</span>
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {formatCurrency(currentMechanic.pendingEarningsUyu)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Listo para transferir a tu cuenta</p>
          </div>
          <button
            onClick={() => setIsPayoutModalOpen(true)}
            className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm transition-colors min-h-[40px]"
          >
            Solicitar Retiro
          </button>
        </div>

        {/* Total Accumulated */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Ganado</span>
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {formatCurrency(currentMechanic.accumulatedEarningsUyu)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Cobrado: {formatCurrency(currentMechanic.paidEarningsUyu)}
            </p>
          </div>
          <div className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg">
            ✓ Regalías de por vida activas
          </div>
        </div>

        {/* Total Consultations Generated */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Consultas Pagas</span>
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
              <Search className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {currentMechanic.totalQueriesGenerated}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Veces que consultaron tus autos</p>
          </div>
          <div className="text-[11px] text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg">
            Promedio: ~4.2 consultas/auto
          </div>
        </div>

        {/* Total Registered Interventions */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Servicios Cargados</span>
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {currentMechanic.totalRegistrations}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              En {distinctVehicleIds.length} autos diferentes
            </p>
          </div>
          <div className="text-[11px] text-blue-700 font-bold bg-blue-50 px-2.5 py-1 rounded-lg">
            Nivel: {currentMechanic.tier}
          </div>
        </div>
      </div>

      {/* Main Content: Recent Registered Services & Payout History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Registered Services by this workshop */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-blue-600" />
                <span>Intervenciones Registradas por tu Taller ({mechanicRepairs.length})</span>
              </h3>
              <button
                onClick={onOpenNewRepair}
                className="text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                + Registrar otra
              </button>
            </div>

            <div className="space-y-3">
              {mechanicRepairs.map((repair) => {
                const vehicle = vehicles.find((v) => v.id === repair.vehicleId);

                return (
                  <div
                    key={repair.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs bg-slate-900 text-white px-2 py-0.5 rounded">
                          {vehicle ? vehicle.plate : 'Matrícula'}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900">{repair.title}</h4>
                      </div>
                      <p className="text-xs text-slate-500">
                        {vehicle?.brand} {vehicle?.model} • {repair.date} • {repair.mileage.toLocaleString('es-UY')} km
                      </p>
                    </div>

                    <div className="flex items-center gap-3 justify-between sm:justify-end">
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                        QR: {repair.qrVerificationCode}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Payout History */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>Historial de Retiros</span>
            </h3>

            {mechanicPayouts.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No has solicitado retiros aún.</p>
            ) : (
              <div className="space-y-3">
                {mechanicPayouts.map((payout) => (
                  <div
                    key={payout.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <strong className="text-sm font-black text-slate-900">
                        {formatCurrency(payout.amountUyu)}
                      </strong>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        Completado
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">{payout.paymentMethod}</p>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      Ref: {payout.referenceCode} • {payout.date}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payout Modal */}
      {isPayoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <h3 className="text-lg font-black text-slate-900">
              Solicitar Liquidación de Regalías
            </h3>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-slate-500 block">Saldo disponible:</span>
              <strong className="text-xl font-black text-emerald-700">
                {formatCurrency(currentMechanic.pendingEarningsUyu)}
              </strong>
            </div>

            <form onSubmit={handleRequestPayout} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Monto a retirar ($ UYU):</label>
                <input
                  type="number"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  placeholder={`Ej: ${currentMechanic.pendingEarningsUyu}`}
                  max={currentMechanic.pendingEarningsUyu}
                  min={100}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-bold text-base focus:outline-none focus:border-blue-500 min-h-[44px]"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Método de cobro:</label>
                <select
                  value={payoutMethod}
                  onChange={(e) => setPayoutMethod(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-medium focus:outline-none focus:border-blue-500 min-h-[44px]"
                >
                  <option value="brou">Transferencia BROU Instantánea</option>
                  <option value="santander">Banco Santander UYU</option>
                  <option value="itau">Banco Itaú UYU</option>
                  <option value="prex">Prex Card / Tarjeta Digital</option>
                  <option value="cbu">Transferencia CBU/CVU (Argentina)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPayoutModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors min-h-[44px]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition-colors min-h-[44px]"
                >
                  Confirmar Retiro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
