import React, { useState } from 'react';
import {
  BarChart3,
  DollarSign,
  Calculator,
  Users,
  ShieldCheck,
  Award,
  TrendingUp,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const RevenueShareExplainer: React.FC = () => {
  const { mechanics, transactions, totalRoyaltiesDistributedUyu, vehicles, formatCurrency } = useApp();

  // Calculator states in UYU
  const [monthlyCarsRegistered, setMonthlyCarsRegistered] = useState<number>(25);
  const [avgQueriesPerCar, setAvgQueriesPerCar] = useState<number>(4);
  const [royaltyPerQueryUyu, setRoyaltyPerQueryUyu] = useState<number>(100); // $100 UYU per query

  // Math calculations
  const totalCarsYearly = monthlyCarsRegistered * 12;
  const totalQueriesYearly = totalCarsYearly * avgQueriesPerCar;
  const estimatedYearlyPassiveIncomeUyu = totalQueriesYearly * royaltyPerQueryUyu;
  const estimatedMonthlyPassiveIncomeUyu = estimatedYearlyPassiveIncomeUyu / 12;

  return (
    <div className="space-y-8 sm:space-y-10 pb-20 max-w-5xl mx-auto">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 px-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold">
          <Zap className="w-3.5 h-3.5 text-blue-600" />
          <span>Economía Colaborativa para Talleres de Uruguay y la Región</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
          ¿Cómo Funciona el <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Reparto de Ingresos</span> para Mecánicos?
        </h1>

        <p className="text-xs sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Convertimos cada intervención y factura que cargas en una fuente continua de ingresos pasivos. Los compradores pagan por consultar el historial y los mecánicos reciben hasta el 50% de cada consulta.
        </p>
      </div>

      {/* 3-Step Win-Win Cycle */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-base shadow-md shadow-blue-600/30">
            1
          </div>
          <div>
            <h3 className="font-black text-base text-slate-900">Registras el Servicio</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              En 60 segundos cargas la chapa, km, piezas cambiadas y tu factura. El registro queda sellado con código QR pericial.
            </p>
          </div>
          <div className="text-[11px] font-bold text-blue-600 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>100% Gratuito para tu taller</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-base shadow-md shadow-indigo-600/30">
            2
          </div>
          <div>
            <h3 className="font-black text-base text-slate-900">Compradores Consultan</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Cuando el auto se pone en venta, compradores y automotoras pagan su consulta para verificar que los services sean reales.
            </p>
          </div>
          <div className="text-[11px] font-bold text-indigo-600 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>50% a la bolsa de talleres</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-base shadow-md shadow-emerald-600/30">
            3
          </div>
          <div>
            <h3 className="font-black text-base text-slate-900">Cobras tus Regalías</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              El sistema reparte automáticamente las ganancias a los talleres del historial. Retiras por transferencia BROU, Santander o Prex.
            </p>
          </div>
          <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>Ingresos pasivos recurrentes</span>
          </div>
        </div>
      </div>

      {/* Interactive Revenue Calculator */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold">
            <Calculator className="w-3.5 h-3.5" />
            <span>Simulador de Ingresos Pasivos para Talleres</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Calcula cuánto puede generar tu taller cada año
          </h2>
          <p className="text-xs text-slate-400">
            Ajusta la cantidad de autos que atiendes por mes en tu taller mecánico.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-2">
          {/* Controls */}
          <div className="space-y-5 bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300">Autos atendidos por mes:</span>
                <span className="text-blue-400 font-mono text-sm">{monthlyCarsRegistered} vehículos</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={monthlyCarsRegistered}
                onChange={(e) => setMonthlyCarsRegistered(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>5 autos/mes</span>
                <span>50 autos/mes</span>
                <span>100 autos/mes</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300">Consultas estimadas por auto en reventa:</span>
                <span className="text-indigo-400 font-mono text-sm">{avgQueriesPerCar} consultas</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={avgQueriesPerCar}
                onChange={(e) => setAvgQueriesPerCar(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </div>

          {/* Results Box */}
          <div className="bg-gradient-to-br from-blue-900/60 to-indigo-900/60 rounded-2xl p-6 border border-blue-500/40 text-center space-y-4">
            <div>
              <span className="text-xs text-blue-200 font-bold uppercase tracking-wider block">
                Ingreso Pasivo Estimado Anual
              </span>
              <div className="text-3xl sm:text-5xl font-black text-white mt-1">
                {formatCurrency(estimatedYearlyPassiveIncomeUyu)}
              </div>
              <p className="text-xs text-emerald-300 mt-1 font-semibold">
                ≈ {formatCurrency(estimatedMonthlyPassiveIncomeUyu)} por mes adicionales
              </p>
            </div>

            <div className="pt-3 border-t border-blue-400/20 grid grid-cols-2 gap-2 text-xs text-slate-300">
              <div>
                <span className="text-[10px] text-slate-400 block">Autos en tu cartera anual:</span>
                <strong>{totalCarsYearly} vehículos</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Consultas generadas:</span>
                <strong>{totalQueriesYearly} consultas</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
