import React, { useState } from 'react';
import { X, Wrench, ShieldCheck, Plus, Trash2, Tag, Calendar, Gauge, FileText, CheckCircle2, Car, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RepairCategory, Country } from '../types';

interface NewRepairModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COMMON_SERVICES = [
  'Cambio de Aceite 5W-30 + Filtros (Aceite, Aire)',
  'Cambio de Pastillas y Discos de Freno Delanteros',
  'Service Mayor: Distribución, Bomba de Agua y Correas',
  'Alineación, Balanceo y Rotación de Neumáticos',
  'Cambio de Amortiguadores y Bujes de Tren Delantero',
  'Cambio de Batería 12V 60Ah + Chequeo Alternador',
  'Escaneo Computarizado & Diagnóstico de Inyección',
  'Cambio de Embrague / Kit de Placa y Disco',
];

export const NewRepairModal: React.FC<NewRepairModalProps> = ({ isOpen, onClose }) => {
  const { vehicles, selectedVehicleId, mechanics, getCurrentMechanic, addRepair, addNewVehicle, setSelectedVehicleId } = useApp();

  const currentMechanic = getCurrentMechanic() || mechanics[0];

  // Mode: select existing vehicle or quick input by plate/chassis
  const [inputMode, setInputMode] = useState<'existing' | 'quick_new'>(
    selectedVehicleId ? 'existing' : 'quick_new'
  );

  const [existingVehicleId, setExistingVehicleId] = useState<string>(selectedVehicleId || vehicles[0]?.id || '');
  
  // Quick vehicle fields (ONLY plate or chassis/motor needed!)
  const [quickIdentifierType, setQuickIdentifierType] = useState<'plate' | 'chassis_motor'>('plate');
  const [quickIdentifier, setQuickIdentifier] = useState('');
  const [quickBrandModel, setQuickBrandModel] = useState('');
  const [quickCountry, setQuickCountry] = useState<Country>('UY');

  // Repair fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<RepairCategory>('mantenimiento_preventivo');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [mileage, setMileage] = useState<string>('');
  const [description, setDescription] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState(`FAC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
  const [warrantyMonths, setWarrantyMonths] = useState<number>(6);
  const [partInput, setPartInput] = useState('');
  const [replacedParts, setReplacedParts] = useState<string[]>([
    'Aceite Sintético 5W-30 (4L)',
    'Filtro de Aceite OEM'
  ]);

  const targetExistingVehicle = vehicles.find((v) => v.id === existingVehicleId);

  const handleAddPart = () => {
    if (partInput.trim()) {
      setReplacedParts([...replacedParts, partInput.trim()]);
      setPartInput('');
    }
  };

  const handleRemovePart = (index: number) => {
    setReplacedParts(replacedParts.filter((_, i) => i !== index));
  };

  const handleSelectCommonService = (serviceName: string) => {
    setTitle(serviceName);
    if (serviceName.includes('Aceite')) setCategory('mantenimiento_preventivo');
    else if (serviceName.includes('Freno')) setCategory('frenos');
    else if (serviceName.includes('Distribución') || serviceName.includes('Inyección')) setCategory('motor');
    else if (serviceName.includes('Amortiguadores') || serviceName.includes('Alineación')) setCategory('suspension_direccion');
    else if (serviceName.includes('Batería')) setCategory('electrico_bateria');
    else if (serviceName.includes('Embrague')) setCategory('transmision');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let finalVehicleId = existingVehicleId;

    // If quick new vehicle, resolve or create
    if (inputMode === 'quick_new') {
      const cleanIdent = quickIdentifier.trim().toUpperCase();
      if (!cleanIdent) return;

      // Check if already in list
      const existing = vehicles.find(
        (v) =>
          v.plate.toUpperCase() === cleanIdent ||
          v.vin.toUpperCase() === cleanIdent ||
          (v.engineNumber && v.engineNumber.toUpperCase() === cleanIdent)
      );

      if (existing) {
        finalVehicleId = existing.id;
      } else {
        // Auto-create with minimum friction
        const isPlate = quickIdentifierType === 'plate';
        const brandModelParts = quickBrandModel.trim().split(' ');
        const brand = brandModelParts[0] || 'Vehículo';
        const model = brandModelParts.slice(1).join(' ') || 'Registrado';

        const newId = addNewVehicle({
          plate: isPlate ? cleanIdent : `S/P-${cleanIdent.slice(0, 6)}`,
          vin: isPlate ? `VIN-${cleanIdent}-${Date.now().toString().slice(-4)}` : cleanIdent,
          engineNumber: !isPlate ? cleanIdent : undefined,
          country: quickCountry,
          departmentOrProvince: quickCountry === 'UY' ? 'Montevideo' : 'Buenos Aires',
          brand,
          model,
          year: new Date().getFullYear() - 3,
          fuelType: 'Gasolina',
          transmission: 'Manual',
          currentMileage: parseInt(mileage) || 45000,
          status: 'clean',
          statusLabel: 'En mantenimiento',
          statusExplanation: 'Historial iniciado en taller mecánico.',
          photo: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80',
          hasOdometerRollback: false,
        });

        finalVehicleId = newId;
      }
    }

    const km = parseInt(mileage) || (targetExistingVehicle?.currentMileage || 0) + 5000;

    addRepair({
      vehicleId: finalVehicleId,
      mechanicId: currentMechanic.id,
      mechanicName: currentMechanic.name,
      workshopName: currentMechanic.workshopName,
      workshopBadge: currentMechanic.tier === 'Master Certificado' ? 'Master Certificado' : currentMechanic.tier === 'Oro' ? 'Certificado Gold' : 'Taller Oficial',
      workshopCity: currentMechanic.city,
      country: currentMechanic.country,
      date,
      mileage: km,
      category,
      title: title || `Mantenimiento de ${category.replace(/_/g, ' ')}`,
      description: description || `Servicio profesional de mantenimiento registrado por ${currentMechanic.workshopName}.`,
      replacedParts,
      invoiceNumber: invoiceNumber.trim() || `FAC-${Date.now().toString().slice(-6)}`,
      warrantyMonths,
    });

    setSelectedVehicleId(finalVehicleId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 relative my-6 max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/30 shrink-0">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-slate-900 leading-tight">
                Registrar Servicio / Mantenimiento
              </h3>
              <p className="text-xs text-slate-500">
                Taller: <strong className="text-slate-800">{currentMechanic.workshopName}</strong> • Carga rápida sin fricción
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Vehicle Identification Switcher: Existing vs Quick Plate/Chassis */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <Car className="w-4 h-4 text-blue-600" />
                <span>Identificación del Vehículo:</span>
              </span>

              <div className="flex items-center bg-slate-200 p-0.5 rounded-lg text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setInputMode('quick_new')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    inputMode === 'quick_new'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Matrícula o Chasis Directo
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode('existing')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    inputMode === 'existing'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Lista de Autos ({vehicles.length})
                </button>
              </div>
            </div>

            {inputMode === 'quick_new' ? (
              <div className="space-y-2 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  <div className="sm:col-span-4">
                    <label className="font-bold text-slate-700 block mb-1">Identificador:</label>
                    <select
                      value={quickIdentifierType}
                      onChange={(e) => setQuickIdentifierType(e.target.value as any)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-xl font-medium focus:outline-none focus:border-blue-500 min-h-[40px]"
                    >
                      <option value="plate">Matrícula (Chapa)</option>
                      <option value="chassis_motor">Nº Chasis o Motor</option>
                    </select>
                  </div>

                  <div className="sm:col-span-5">
                    <label className="font-bold text-slate-700 block mb-1">
                      {quickIdentifierType === 'plate' ? 'Matrícula (ej. SBX 4821):' : 'Nº de Chasis / Motor:'}
                    </label>
                    <input
                      type="text"
                      placeholder={quickIdentifierType === 'plate' ? 'ej. SBX 4821 o AAP 9321' : 'ej. 9BRBR3BE40J... o Motor 1NZ-FE'}
                      value={quickIdentifier}
                      onChange={(e) => setQuickIdentifier(e.target.value)}
                      required
                      className="w-full p-2 bg-white border border-slate-300 rounded-xl font-mono uppercase font-bold text-slate-900 focus:outline-none focus:border-blue-500 min-h-[40px]"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="font-bold text-slate-700 block mb-1">País:</label>
                    <select
                      value={quickCountry}
                      onChange={(e) => setQuickCountry(e.target.value as Country)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-xl font-medium focus:outline-none focus:border-blue-500 min-h-[40px]"
                    >
                      <option value="UY">🇺🇾 Uruguay</option>
                      <option value="AR">🇦🇷 Argentina</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-0.5">
                    Marca y Modelo <span className="font-normal text-slate-500">(opcional para ficha):</span>
                  </label>
                  <input
                    type="text"
                    placeholder="ej. Toyota Corolla, Chevrolet Onix, Ford Ranger..."
                    value={quickBrandModel}
                    onChange={(e) => setQuickBrandModel(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500 min-h-[38px]"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="font-bold text-slate-700 block mb-1">Selecciona el vehículo del taller:</label>
                <select
                  value={existingVehicleId}
                  onChange={(e) => setExistingVehicleId(e.target.value)}
                  required
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-blue-500 min-h-[40px]"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.plate} — {v.brand} {v.model} ({v.currentMileage.toLocaleString('es-UY')} km)
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Quick Common Service Suggestions */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-700 block">Sugerencias Rápidas de Servicio:</label>
              <span className="text-[10px] text-blue-600 font-medium">1-toque para autocompletar</span>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
              {COMMON_SERVICES.map((srv, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectCommonService(srv)}
                  className="px-2 py-1 bg-white hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 text-slate-700 rounded-lg border border-slate-200 text-[11px] font-medium text-left transition-colors"
                >
                  + {srv}
                </button>
              ))}
            </div>
          </div>

          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Trabajo o Reparación Realizada:</label>
              <input
                type="text"
                placeholder="ej. Mantenimiento Preventivo 60.000 km"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 min-h-[42px] font-semibold text-slate-900"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Categoría del Servicio:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as RepairCategory)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 min-h-[42px]"
              >
                <option value="mantenimiento_preventivo">Mantenimiento Preventivo (Aceite/Filtros)</option>
                <option value="motor">Motor & Distribución</option>
                <option value="frenos">Frenos & Seguridad</option>
                <option value="transmision">Transmisión & Embrague</option>
                <option value="suspension_direccion">Suspensión, Dirección & Neumáticos</option>
                <option value="electrico_bateria">Eléctrico, Batería & Inyección</option>
                <option value="carroceria_choque">Carrocería & Chapa</option>
              </select>
            </div>
          </div>

          {/* Mileage & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Kilometraje Actual Odómetro:</label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="ej. 60500"
                  value={mileage}
                  onChange={(e) => setMileage(e.target.value)}
                  required
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-bold font-mono text-sm text-slate-900 focus:outline-none focus:border-blue-500 min-h-[42px]"
                />
                <span className="absolute right-3 top-3 text-slate-400 font-bold text-xs">km</span>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Fecha del Service:</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 min-h-[42px]"
              />
            </div>
          </div>

          {/* Replaced Parts (Optional Chips) */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">Repuestos Colocados (opcional):</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="ej. Pastillas Ferodo, Bujías NGK..."
                value={partInput}
                onChange={(e) => setPartInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddPart();
                  }
                }}
                className="flex-1 p-2 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 text-xs min-h-[40px]"
              />
              <button
                type="button"
                onClick={handleAddPart}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
              >
                + Añadir
              </button>
            </div>

            {replacedParts.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {replacedParts.map((part, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200"
                  >
                    <span>{part}</span>
                    <button
                      type="button"
                      onClick={() => handleRemovePart(idx)}
                      className="text-slate-400 hover:text-rose-600 ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Invoice & Warranty */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Nº Factura / Orden Taller (opcional):</label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="ej. FAC-2026-0842"
                className="w-full p-2 border border-slate-300 rounded-xl font-mono text-slate-700 focus:outline-none focus:border-blue-500 min-h-[40px]"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Garantía del Taller:</label>
              <select
                value={warrantyMonths}
                onChange={(e) => setWarrantyMonths(parseInt(e.target.value))}
                className="w-full p-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 min-h-[40px]"
              >
                <option value={3}>3 meses</option>
                <option value={6}>6 meses</option>
                <option value={12}>12 meses (Recomendado)</option>
                <option value={24}>24 meses</option>
              </select>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors min-h-[44px]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-md shadow-emerald-600/30 flex items-center gap-1.5 min-h-[44px]"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Guardar Mantenimiento</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
