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
import { LoginModal } from './components/LoginModal';
import { FeedbackNotifier } from './components/FeedbackNotifier';
import { ShieldCheck } from 'lucide-react';

function MainApp() {
  const { activeView, setActiveView, isLoginModalOpen, setIsLoginModalOpen } = useApp();

  // Modals state
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isNewRepairModalOpen, setIsNewRepairModalOpen] = useState(false);
  const [isNewTransferModalOpen, setIsNewTransferModalOpen] = useState(false);
  const [isNewVehicleModalOpen, setIsNewVehicleModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white pb-16 md:pb-0">
      {/* Visual Feedback & Notification Bar */}
      <FeedbackNotifier />

      {/* Top Header */}
      <Header
        onOpenNewRepair={() => setIsNewRepairModalOpen(true)}
        onOpenNewVehicle={() => setIsNewVehicleModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6">
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
      <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <ShieldCheck className="w-4 h-4 text-blue-500" />
                <span>AutoHistorial PRO</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.2 rounded border border-blue-400/30">
                  Uruguay & Argentina
                </span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
                Libreta digital de mantenimientos con retribución económica directa del 50% para talleres mecánicos.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase text-[10px] tracking-wider mb-2">Accesos Directos</h4>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <button onClick={() => setActiveView('landing')} className="hover:text-white transition-colors">
                    🏠 Inicio & Login
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveView('search')} className="hover:text-white transition-colors">
                    🔍 Consultar Matrícula / VIN
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveView('mechanics_portal')} className="hover:text-white transition-colors">
                    🔧 Portal para Talleres
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase text-[10px] tracking-wider mb-2">Garantías de Red</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Trazabilidad inmutable, firma digital de taller y auditoría cronológica de kilometraje real.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 flex flex-col sm:flex-row justify-between gap-2">
            <span>© {new Date().getFullYear()} AutoHistorial PRO.</span>
            <span>Uruguay 🇺🇾 & Argentina 🇦🇷</span>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
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
