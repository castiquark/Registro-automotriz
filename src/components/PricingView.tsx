import React from 'react';
import { Check, Sparkles, ShieldCheck, Zap, Award, Star, HelpCircle, ArrowRight, Clock, Users, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SUBSCRIPTION_TIERS } from '../data/mockData';
import { Currency, SubscriptionTierId } from '../types';

export const PricingView: React.FC = () => {
  const { userSubscription, subscribeToPlan, setActiveView, selectedCurrency, setSelectedCurrency, formatCurrency } = useApp();

  const getPriceForTier = (tier: typeof SUBSCRIPTION_TIERS[0]) => {
    if (selectedCurrency === 'USD') return `US$ ${tier.priceUsd}`;
    if (selectedCurrency === 'ARS') return `$ ${tier.priceArs.toLocaleString('es-AR')} ARS`;
    return `$ ${tier.priceUyu.toLocaleString('es-UY')} UYU`;
  };

  const getPeriodLabel = (period: string) => {
    if (period === 'pago_unico') return 'pago único (sin renovación)';
    return 'al mes';
  };

  return (
    <div className="space-y-10 pb-20 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 px-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Planes Transparentes y Claros • Uruguay & Argentina</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
          Elige el Plan que Mejor se Adapta a Ti
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Desde una consulta puntual para revisar un auto antes de señarlo, hasta suscripciones para quienes buscan activamente o gestionan una automotora.
        </p>

        {/* Currency selector toggle */}
        <div className="pt-2 flex items-center justify-center">
          <div className="inline-flex items-center p-1 rounded-2xl bg-slate-200/80 border border-slate-300 shadow-inner text-xs font-bold">
            <button
              onClick={() => setSelectedCurrency('UYU')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                selectedCurrency === 'UYU'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🇺🇾 Pesos Uruguayos ($ UYU)
            </button>
            <button
              onClick={() => setSelectedCurrency('USD')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                selectedCurrency === 'USD'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🌐 Dólares (US$)
            </button>
            <button
              onClick={() => setSelectedCurrency('ARS')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                selectedCurrency === 'ARS'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🇦🇷 Pesos Argentinos ($ ARS)
            </button>
          </div>
        </div>
      </div>

      {/* 3 Pricing Cards: Consulta Única, Suscripción Limitada, Suscripción Ilimitada */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SUBSCRIPTION_TIERS.map((tier) => {
          const isCurrent = userSubscription.active && userSubscription.tierId === tier.id;

          return (
            <div
              key={tier.id}
              className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 ${
                tier.popular
                  ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white border-2 border-blue-500 shadow-2xl shadow-blue-900/30'
                  : 'bg-white text-slate-900 border border-slate-200/90 shadow-sm hover:shadow-md'
              }`}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-extrabold uppercase tracking-wider py-1 px-4 rounded-full shadow-md flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  <span>Más Recomendado</span>
                </div>
              )}

              <div className="space-y-5">
                {/* Title & Tagline */}
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      tier.popular ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {tier.targetAudience}
                    </span>
                  </div>

                  <h3 className={`text-xl font-black mt-2 ${tier.popular ? 'text-white' : 'text-slate-900'}`}>
                    {tier.name}
                  </h3>
                  <p className={`text-xs mt-1 leading-relaxed ${tier.popular ? 'text-slate-300' : 'text-slate-500'}`}>
                    {tier.tagline}
                  </p>
                </div>

                {/* Price Display */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1 text-slate-900">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950">
                      {getPriceForTier(tier)}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{getPeriodLabel(tier.period)}</span>
                    <span>•</span>
                    <strong className="text-blue-700">{tier.shortName}</strong>
                  </div>
                </div>

                {/* Mechanic Royalty Pill */}
                <div
                  className={`p-3 rounded-xl text-xs flex items-start gap-2.5 font-medium ${
                    tier.popular
                      ? 'bg-blue-500/10 border border-blue-400/30 text-blue-200'
                      : 'bg-emerald-50 text-emerald-900 border border-emerald-100'
                  }`}
                >
                  <Award className="w-4 h-4 shrink-0 text-emerald-500 mt-0.5" />
                  <span className="leading-tight">
                    El <strong>{tier.payoutToPoolPercent}% de esta tarifa</strong> se acredita a los mecánicos y talleres que verificaron el vehículo.
                  </span>
                </div>

                {/* Features List */}
                <div className="space-y-2.5 pt-1">
                  <div className={`text-[11px] font-bold uppercase tracking-wider ${tier.popular ? 'text-slate-400' : 'text-slate-500'}`}>
                    ¿Qué incluye?
                  </div>
                  {tier.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2 text-xs leading-snug">
                      <div className={`p-0.5 rounded-full mt-0.5 shrink-0 ${tier.popular ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-100 text-emerald-700'}`}>
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className={tier.popular ? 'text-slate-200' : 'text-slate-700'}>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6 mt-4 border-t border-slate-200/40">
                {isCurrent ? (
                  <div className="w-full py-3 text-center rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>Tu Plan Activo</span>
                  </div>
                ) : (
                  <button
                    id={`select-plan-${tier.id}`}
                    onClick={() => {
                      subscribeToPlan(tier.id);
                      setActiveView('search');
                    }}
                    className={`w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold shadow-md transition-all flex items-center justify-center gap-2 select-none min-h-[48px] ${
                      tier.popular
                        ? 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white shadow-blue-600/40'
                        : 'bg-slate-900 hover:bg-slate-800 active:bg-black text-white'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Contratar {tier.name}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison Summary Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-white">
              ¿Dudas sobre qué plan elegir para tu compra?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Todos los planes incluyen descarga oficial de certificado en PDF y verificación anti-fraude de odómetro.
            </p>
          </div>
          <button
            onClick={() => setActiveView('search')}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs shrink-0 transition-colors"
          >
            <span>Probar con un auto de ejemplo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <strong className="text-white block font-bold">100% Datos Oficiales</strong>
              <span className="text-slate-400">Cruce con SUCIVE, DNRPA y talleres mecánicos auditados.</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <FileText className="w-5 h-5 text-blue-400 shrink-0" />
            <div>
              <strong className="text-white block font-bold">Certificado Pericial PDF</strong>
              <span className="text-slate-400">Listo para imprimir y mostrar al comprador o vendedor.</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Users className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <strong className="text-white block font-bold">Soporte Local</strong>
              <span className="text-slate-400">Atención personalizada en Uruguay y Argentina.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-black text-slate-900">Preguntas Frecuentes sobre los Planes</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 leading-relaxed">
          <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <h4 className="font-bold text-slate-900 text-sm">¿Cómo funciona la Consulta Única?</h4>
            <p>
              Pagas una única vez ($390 UYU o su equivalente) y tienes acceso completo al informe del auto seleccionado sin suscripciones recurrentes ni cobros sorpresa en tu tarjeta.
            </p>
          </div>

          <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <h4 className="font-bold text-slate-900 text-sm">¿Cómo ganan dinero los mecánicos?</h4>
            <p>
              El 40% al 50% de los ingresos recaudados por las consultas se distribuye automáticamente entre los talleres mecánicos que cargaron intervenciones reales en el historial de ese coche.
            </p>
          </div>

          <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <h4 className="font-bold text-slate-900 text-sm">¿Sirve para autos de Uruguay y Argentina?</h4>
            <p>
              Sí. La plataforma está preparada para matrículas uruguayas (formato alfanumérico y Mercosur) y argentinas (DNRPA y Mercosur), así como búsqueda universal por número de chasis (VIN).
            </p>
          </div>

          <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <h4 className="font-bold text-slate-900 text-sm">¿Qué medios de pago están disponibles?</h4>
            <p>
              Tarjetas de crédito y débito (Visa, Mastercard), transferencias locales BROU, Santander, Itaú, Prex y Mercado Pago.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
