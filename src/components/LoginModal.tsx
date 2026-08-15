import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Wrench,
  Car,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Lock,
  User,
  Building2,
  Mail,
  Loader2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: UserRole;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  initialRole = 'user'
}) => {
  const {
    login,
    mechanics,
    selectedMechanicId,
    setSelectedMechanicId,
    isProcessing
  } = useApp();

  const [role, setRole] = useState<UserRole>(initialRole);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [selectedWorkshopId, setSelectedWorkshopId] = useState(selectedMechanicId || mechanics[0]?.id || 'mec-1');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'user') {
      login('user', {
        name: name.trim() || 'Comprador Particular',
        email: email.trim() || 'usuario@autohistorial.com'
      });
    } else {
      const mechanicData = mechanics.find((m) => m.id === selectedWorkshopId);
      login('mechanic', {
        name: name.trim() || mechanicData?.name || 'Mecánico Responsable',
        email: email.trim() || 'taller@autohistorial.com',
        mechanicId: selectedWorkshopId,
        workshopName: mechanicData?.workshopName
      });
    }
  };

  const handleQuickDemoUser = () => {
    login('user', {
      name: 'Pablo Casanova',
      email: 'pablo.casanova@ejemplo.com'
    });
  };

  const handleQuickDemoMechanic = (mechanicId: string) => {
    const m = mechanics.find((item) => item.id === mechanicId);
    login('mechanic', {
      name: m?.name,
      email: 'taller@autohistorial.com',
      mechanicId: m?.id,
      workshopName: m?.workshopName
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 pb-4 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Ingreso a AutoHistorial</h2>
              <p className="text-xs text-slate-400">Selecciona el tipo de cuenta</p>
            </div>
          </div>

          {/* Role Switcher Tabs */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-800/90 rounded-2xl mt-4 border border-slate-700/60">
            <button
              type="button"
              onClick={() => setRole('user')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                role === 'user'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Car className="w-4 h-4" />
              <span>Usuario / Comprador</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('mechanic')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                role === 'mechanic'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>Taller Mecánico</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {role === 'user' ? (
              <div className="space-y-3">
                <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-2xl text-xs text-blue-900 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>
                    Acceso para consultar historiales de vehículos por matrícula o chasis y auditar odómetros.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nombre o Apodo (Opcional)
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="ej. Pablo Casanova"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Correo Electrónico (Opcional para recibir reportes)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      placeholder="ej. usuario@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm transition-all shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 min-h-[44px]"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Ingresando...</span>
                    </>
                  ) : (
                    <>
                      <span>Ingresar como Comprador / Usuario</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={handleQuickDemoUser}
                    className="text-[11px] text-blue-600 hover:text-blue-800 font-bold underline cursor-pointer"
                  >
                    ⚡ Ingreso Rápido con 1 Clic (Demo)
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-2xl text-xs text-emerald-900 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    Acceso para registrar órdenes de servicio, emitir sellos digitales y cobrar regalías del 50%.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Selecciona tu Taller Mecánico:
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <select
                      value={selectedWorkshopId}
                      onChange={(e) => setSelectedWorkshopId(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white font-bold text-slate-900"
                    >
                      {mechanics.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.workshopName} ({m.city}, {m.country === 'UY' ? 'UY' : 'AR'})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mecánico / Responsable de Firma:
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Nombre del técnico o titular"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm transition-all shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 min-h-[44px]"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Conectando taller...</span>
                    </>
                  ) : (
                    <>
                      <Wrench className="w-4 h-4" />
                      <span>Ingresar al Panel del Taller</span>
                    </>
                  )}
                </button>

                {/* Quick select workshop pills */}
                <div className="pt-2">
                  <p className="text-[11px] font-bold text-slate-500 mb-1 text-center">Acceso rápido con talleres demo:</p>
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {mechanics.slice(0, 3).map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => handleQuickDemoMechanic(m.id)}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 font-medium transition-colors border border-slate-200"
                      >
                        🔧 {m.workshopName.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
