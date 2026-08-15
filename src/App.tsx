import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { LandingHome } from './components/LandingHome';
import { VehicleSearch } from './components/VehicleSearch';
import { VehicleReportView } from './components/VehicleReportView';
import { MechanicPortal } from './components/MechanicPortal';
import { RevenueShareExplainer } from './components/RevenueShareExplainer';
import { PricingView } from './components/PricingView';
import { SubscriptionModal } from './components/SubscriptionModal';
import { AiDiagnosticsModal } from './components/AiDiagnosticsModal';
import { PrintableReportModal } from './components/PrintableReportModal';
import { NewRepairModal } from './components/NewRepairModal';
import { NewTransferModal } from './components/NewTransferModal';
import { NewVehicleModal } from './components/NewVehicleModal';
import { ShieldCheck } from 'lucide-react';

function MainApp() {
  const { activeView, setActiveView } = useApp();

  // Modals state
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isNewRepairModalOpen, setIsNewRepairModalOpen] = useState(false);
  const [isNewTransferModalOpen, setIsNewTransferModalOpen] = useState(false);
  const [isNewVehicleModalOpen, setIsNewVehicleModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white pb-16 md:pb-0">
      {/* Top Header */}
      <Header
        onOpenNewRepair={() => setIsNewRepairModalOpen(true)}
        onOpenNewVehicle={() => setIsNewVehicleModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-8">
        {activeView === 'landing' && (
          <LandingHome
            onOpenNewRepair={() => setIsNewRepairModalOpen(true)}
            onOpenNewVehicle={() => setIsNewVehicleModalOpen(true)}
          />
        )}

        {activeView === 'search' && (
          <VehicleSearch onOpenNewVehicle={() => setIsNewVehicleModalOpen(true)} />
        )}

        {activeView === 'vehicle_report' && (
          <VehicleReportView
            onOpenAiDiagnostics={() => setIsAiModalOpen(true)}
            onOpenPrintableReport={() => setIsPrintModalOpen(true)}
            onOpenNewRepair={() => setIsNewRepairModalOpen(true)}
            onOpenNewTransfer={() => setIsNewTransferModalOpen(true)}
          />
        )}

        {activeView === 'mechanics_portal' && (
          <MechanicPortal
            onOpenNewRepair={() => setIsNewRepairModalOpen(true)}
            onOpenNewTransfer={() => setIsNewTransferModalOpen(true)}
          />
        )}

        {activeView === 'revenue_ecosystem' && <RevenueShareExplainer />}

        {activeView === 'pricing' && <PricingView />}
      </main>

      {/* Mobile Fixed Bottom Navigation */}
      <BottomNav />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-12 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <ShieldCheck className="w-5 h-5 text-blue-500" />
                <span>AutoHistorial PRO</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded border border-blue-400/30">
                  Uruguay & Argentina
                </span>
              </div>
              <p className="text-slate-400 text-xs max-w-md leading-relaxed">
                La primera plataforma que retribuye económicamente a los talleres mecánicos cada vez que un comprador o automotora consulta el historial de mantenimiento de un vehículo que ellos atendieron.
              </p>
              <div className="flex flex-wrap items-center gap-2 text-slate-500 pt-2 text-[11px]">
                <span className="text-emerald-400 font-semibold">✓ Libreta Digital de Mantenimiento</span>
                <span>•</span>
                <span>Sellos QR de Taller</span>
                <span>•</span>
                <span>50% Reparto a Talleres</span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-3">Accesos Directos</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => setActiveView('search')} className="hover:text-white transition-colors">
                    🔍 Consultar Matrícula / VIN
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveView('mechanics_portal')} className="hover:text-white transition-colors">
                    🔧 Portal para Mecánicos
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveView('revenue_ecosystem')} className="hover:text-white transition-colors">
                    📊 Calculadora de Ingresos
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveView('pricing')} className="hover:text-white transition-colors">
                    💎 Planes y Precios
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-3">Red de Talleres</h4>
              <ul className="space-y-2 text-slate-400">
                <li>✓ Registro gratuito para mecánicos</li>
                <li>✓ Firma digital pericial en cada orden</li>
                <li>✓ Pagos por BROU, Santander, Itaú, Prex y CBU</li>
                <li>✓ Certificado anti-fraude de odómetro</li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <div>
              © {new Date().getFullYear()} AutoHistorial PRO. Sistema de trazabilidad vehicular pericial.
            </div>
            <div className="flex items-center gap-4">
              <span>Términos y Condiciones</span>
              <span>Protección de Datos</span>
              <span>Liquidación de Regalías</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      <SubscriptionModal />
      <AiDiagnosticsModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} />
      <PrintableReportModal isOpen={isPrintModalOpen} onClose={() => setIsPrintModalOpen(false)} />
      <NewRepairModal isOpen={isNewRepairModalOpen} onClose={() => setIsNewRepairModalOpen(false)} />
      <NewTransferModal isOpen={isNewTransferModalOpen} onClose={() => setIsNewTransferModalOpen(false)} />
      <NewVehicleModal isOpen={isNewVehicleModalOpen} onClose={() => setIsNewVehicleModalOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
