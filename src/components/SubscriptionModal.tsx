import React from 'react';
import { X, Sparkles, Check, Award, Star, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SUBSCRIPTION_TIERS } from '../data/mockData';

export const SubscriptionModal: React.FC = () => {
  const {
    isSubscriptionModalOpen,
    setIsSubscriptionModalOpen,
    subscribeToPlan,
    userSubscription,
    selectedCurrency,
    setSelectedCurrency
  } = useApp();

  if (!isSubscriptionModalOpen) return null;

  const getPriceForTier = (tier: typeof SUBSCRIPTION_TIERS[0]) => {
    if (selectedCurrency === 'USD') return `US$ ${tier.priceUsd}`;
    if (selectedCurrency === 'ARS') return `$ ${tier.priceArs.toLocaleString('es-AR')} ARS`;
    return `$ ${tier.priceUyu.toLocaleString('es-UY')} UYU`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 relative my-6 max-h-[92vh] overflow-y-auto">
        <button
          onClick={() => setIsSubscriptionModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Cerrar ventana"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center max-w-lg mx-auto space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-100 text-blue-900 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Acceso al Historial Pericial Completo</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Elige tu Consulta o Suscripción
          </h2>
          <p className="text-xs text-slate-500">
            Desbloquea auditorías completas, cronogramas de taller y detección de fraudes de odómetro.
          </p>

          {/* Currency Mini Switcher */}
          <div className="pt-2 flex items-center justify-center gap-1 text-xs">
            <span className="text-slate-500 font-medium">Moneda:</span>
            <div className="inline-flex rounded-lg bg-slate-100 p-0.5 border border-slate-200 text-[11px] font-bold">
              <button
                onClick={() => setSelectedCurrency('UYU')}
                className={`px-2 py-0.5 rounded-md ${selectedCurrency === 'UYU' ? 'bg-white shadow-xs text-blue-700 font-extrabold' : 'text-slate-600'}`}
              >
                🇺🇾 UYU
              </button>
              <button
                onClick={() => setSelectedCurrency('USD')}
                className={`px-2 py-0.5 rounded-md ${selectedCurrency === 'USD' ? 'bg-white shadow-xs text-blue-700 font-extrabold' : 'text-slate-600'}`}
              >
                🌐 USD
              </button>
              <button
                onClick={() => setSelectedCurrency('ARS')}
                className={`px-2 py-0.5 rounded-md ${selectedCurrency === 'ARS' ? 'bg-white shadow-xs text-blue-700 font-extrabold' : 'text-slate-600'}`}
              >
                🇦🇷 ARS
              </button>
            </div>
          </div>
        </div>

        {/* The 3 plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SUBSCRIPTION_TIERS.map((tier) => {
            const isCurrent = userSubscription.active && userSubscription.tierId === tier.id;

            return (
              <div
                key={tier.id}
                className={`rounded-2xl p-4 sm:p-5 border flex flex-col justify-between relative transition-all ${
                  tier.popular
                    ? 'bg-slate-900 text-white border-blue-500 shadow-xl'
                    : 'bg-slate-50 text-slate-900 border-slate-200/90'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-extrabold uppercase py-0.5 px-3 rounded-full shadow-sm">
                    Recomendado
                  </div>
                )}

                <div className="space-y-3.5">
                  <div>
                    <h3 className={`font-black text-base ${tier.popular ? 'text-white' : 'text-slate-900'}`}>
                      {tier.name}
                    </h3>
                    <p className={`text-[11px] mt-0.5 leading-snug ${tier.popular ? 'text-slate-300' : 'text-slate-500'}`}>
                      {tier.tagline}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/10 border border-white/10 space-y-0.5">
                    <div className="flex items-baseline gap-1">
                      <span className={`text-2xl font-black ${tier.popular ? 'text-white' : 'text-slate-900'}`}>
                        {getPriceForTier(tier)}
                      </span>
                    </div>
                    <span className={`text-[10px] font-medium block ${tier.popular ? 'text-slate-300' : 'text-slate-500'}`}>
                      {tier.period === 'pago_unico' ? '1 sola vez (sin suscripción)' : '/mes'} • <strong>{tier.shortName}</strong>
                    </span>
                  </div>

                  <div className="space-y-1.5 text-[11px]">
                    {tier.features.slice(0, 4).map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 leading-tight">
                        <Check className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${tier.popular ? 'text-blue-400' : 'text-emerald-600'}`} />
                        <span className={tier.popular ? 'text-slate-200' : 'text-slate-700'}>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-2">
                  {isCurrent ? (
                    <div className="w-full py-2.5 text-center rounded-xl bg-emerald-600 text-white text-xs font-bold">
                      ✓ Plan Activo
                    </div>
                  ) : (
                    <button
                      id={`modal-plan-${tier.id}`}
                      onClick={() => subscribeToPlan(tier.id)}
                      className={`w-full py-2.5 px-3 rounded-xl text-xs font-extrabold shadow-sm transition-colors min-h-[44px] flex items-center justify-center gap-1.5 ${
                        tier.popular
                          ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/40'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Elegir {tier.name}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 pt-3 border-t border-slate-100 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
          <Award className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>El 40% al 50% de cada pago se acredita a los talleres que cargaron los registros del vehículo.</span>
        </div>
      </div>
    </div>
  );
};
