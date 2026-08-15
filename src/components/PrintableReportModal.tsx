import React from 'react';
import { X, Printer, ShieldCheck, QrCode, Building, Award, Wrench, UserCheck, FileCheck2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface PrintableReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrintableReportModal: React.FC<PrintableReportModalProps> = ({ isOpen, onClose }) => {
  const { selectedVehicleId, getVehicleById, getVehicleRepairs, calculateVehicleScore } = useApp();

  const vehicle = selectedVehicleId ? getVehicleById(selectedVehicleId) : null;
  const repairs = selectedVehicleId ? getVehicleRepairs(selectedVehicleId) : [];

  if (!isOpen || !vehicle) return null;

  const score = calculateVehicleScore(vehicle.id);
  const printDate = new Date().toLocaleDateString('es-UY', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-5 sm:p-8 shadow-2xl border border-slate-300 relative my-6 text-slate-900 print:m-0 print:p-0 print:border-none print:shadow-none max-h-[94vh] overflow-y-auto">
        {/* Top non-print action bar */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-5 print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <span className="font-black text-sm text-slate-900">
              Certificado Oficial de Historial Vehicular
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition-colors min-h-[40px]"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="space-y-5 text-xs text-slate-700 font-sans">
          {/* Header of Certificate */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-sm">
                  AH
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">AutoHistorial PRO</h1>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                    Red Oficial de Talleres & Certificación Mecánica • Uruguay & Argentina
                  </p>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="font-mono text-[9px] text-slate-400">CERTIFICADO PERICIAL Nº</div>
              <div className="font-mono font-bold text-xs text-slate-900">
                PASSPORT-{vehicle.country}-{vehicle.plate.replace(/\s+/g, '')}-{Date.now().toString().slice(-4)}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Emisión: {printDate}</div>
            </div>
          </div>

          {/* Vehicle Snapshot */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <div className="text-[9px] text-slate-400 uppercase font-bold">Matrícula (Chapa)</div>
              <div className="text-sm font-black font-mono text-slate-900">{vehicle.country === 'UY' ? '🇺🇾' : '🇦🇷'} {vehicle.plate}</div>
            </div>
            <div>
              <div className="text-[9px] text-slate-400 uppercase font-bold">Vehículo</div>
              <div className="text-xs font-bold text-slate-900">{vehicle.brand} {vehicle.model} ({vehicle.year})</div>
            </div>
            <div>
              <div className="text-[9px] text-slate-400 uppercase font-bold">Número de Chasis (VIN)</div>
              <div className="text-xs font-mono font-bold text-slate-800">{vehicle.vin}</div>
            </div>
            <div>
              <div className="text-[9px] text-slate-400 uppercase font-bold">Odómetro Auditado</div>
              <div className="text-xs font-mono font-bold text-blue-700">
                {vehicle.currentMileage.toLocaleString('es-UY')} km
              </div>
            </div>
          </div>

          {/* Official Audit Score Stamp */}
          <div className="p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between bg-white">
            <div className="space-y-1">
              <h3 className="font-black text-sm text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Índice de Fiabilidad y Trazabilidad Mecánica: {score}/100
              </h3>
              <p className="text-xs text-slate-600">
                {vehicle.hasOdometerRollback
                  ? 'ALERTA PERICIAL: Se detectaron inconsistencias en el odómetro durante auditorías previas de taller.'
                  : 'Documentación congruente con inspecciones continuas y facturas de talleres certificados.'}
              </p>
            </div>

            <div className="w-16 h-16 rounded-xl border-2 border-dashed border-emerald-600 text-emerald-800 flex flex-col items-center justify-center font-bold shrink-0 text-center leading-none">
              <span className="text-[8px] uppercase tracking-wider font-extrabold">SELLO</span>
              <span className="text-base font-black mt-0.5">{score}%</span>
              <span className="text-[7px] uppercase">AUDITADO</span>
            </div>
          </div>

          {/* Chronological Repairs List */}
          <div className="space-y-2.5">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-blue-600" />
              Historial de Reparaciones y Mantenimientos Certificados ({repairs.length} intervenciones)
            </h3>

            <div className="space-y-2">
              {repairs.map((rep) => (
                <div key={rep.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-slate-900 text-xs">{rep.title}</span>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {rep.date} • {rep.mileage.toLocaleString('es-UY')} km • {rep.workshopName} ({rep.workshopCity})
                      </div>
                    </div>
                    <span className="font-mono text-[10px] font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
                      QR: {rep.qrVerificationCode}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">{rep.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Legal / SUCIVE Footnote */}
          <div className="pt-3 border-t border-slate-200 text-[10px] text-slate-400 flex items-center justify-between">
            <span>Certificado emitido para fines de compraventa y verificación pericial.</span>
            <span>Verificación digital en autohistorial.uy</span>
          </div>
        </div>
      </div>
    </div>
  );
};
