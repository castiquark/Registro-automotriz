import React, { useState } from 'react';
import { X, Car, Plus, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Country } from '../types';

interface NewVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewVehicleModal: React.FC<NewVehicleModalProps> = ({ isOpen, onClose }) => {
  const { addNewVehicle, setSelectedVehicleId, setActiveView } = useApp();

  const [identifierType, setIdentifierType] = useState<'plate' | 'chassis_motor'>('plate');
  const [identifier, setIdentifier] = useState('');
  const [country, setCountry] = useState<Country>('UY');
  const [departmentOrProvince, setDepartmentOrProvince] = useState('Montevideo');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<number>(new Date().getFullYear() - 2);
  const [currentMileage, setCurrentMileage] = useState<string>('45000');
  const [fuelType, setFuelType] = useState<'Gasolina' | 'Diésel' | 'Híbrido' | 'Eléctrico'>('Gasolina');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanIdent = identifier.trim().toUpperCase();
    if (!cleanIdent) return;

    const isPlate = identifierType === 'plate';

    const newId = addNewVehicle({
      plate: isPlate ? cleanIdent : `S/P-${cleanIdent.slice(0, 6)}`,
      vin: isPlate ? `VIN-${cleanIdent}-${Date.now().toString().slice(-4)}` : cleanIdent,
      engineNumber: !isPlate ? cleanIdent : undefined,
      country,
      departmentOrProvince,
      brand: brand.trim() || 'Vehículo',
      model: model.trim() || 'Particular',
      year,
      fuelType,
      transmission: 'Manual',
      currentMileage: parseInt(currentMileage) || 0,
      status: 'clean',
      statusLabel: 'En Seguimiento de Taller',
      statusExplanation: 'Libreta de mantenimiento digital iniciada.',
      photo: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80',
      hasOdometerRollback: false,
    });

    setSelectedVehicleId(newId);
    setActiveView('vehicle_report');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl border border-slate-200 relative my-6 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-slate-900">
                Alta de Vehículo para Historial
              </h3>
              <p className="text-xs text-slate-500">
                Registro ágil por matrícula o número de chasis/motor
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">País:</label>
              <select
                value={country}
                onChange={(e) => {
                  const c = e.target.value as Country;
                  setCountry(c);
                  setDepartmentOrProvince(c === 'UY' ? 'Montevideo' : 'Buenos Aires');
                }}
                className="w-full p-2.5 border border-slate-300 rounded-xl font-medium focus:outline-none focus:border-blue-500 min-h-[44px]"
              >
                <option value="UY">🇺🇾 Uruguay</option>
                <option value="AR">🇦🇷 Argentina</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Identificar por:</label>
              <select
                value={identifierType}
                onChange={(e) => setIdentifierType(e.target.value as any)}
                className="w-full p-2.5 border border-slate-300 rounded-xl font-medium focus:outline-none focus:border-blue-500 min-h-[44px]"
              >
                <option value="plate">Matrícula (Chapa)</option>
                <option value="chassis_motor">Nº de Chasis o Motor</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              {identifierType === 'plate' ? 'Matrícula (Chapa):' : 'Número de Chasis o Motor:'}
            </label>
            <input
              type="text"
              placeholder={
                identifierType === 'plate'
                  ? country === 'UY'
                    ? 'ej. SBX 4821 o AAP 9321'
                    : 'ej. AD 812 PK'
                  : 'ej. 9BRBR3BE40J084921 o Motor EA888'
              }
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              className="w-full p-3 border border-slate-300 rounded-xl font-mono uppercase font-bold text-sm text-slate-900 focus:outline-none focus:border-blue-500 min-h-[44px]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Marca (ej. Toyota, Ford):</label>
              <input
                type="text"
                placeholder="ej. Toyota"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                required
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 min-h-[44px]"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Modelo (ej. Corolla, Ranger):</label>
              <input
                type="text"
                placeholder="ej. Corolla"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                required
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 min-h-[44px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Año:</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                required
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 min-h-[44px]"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Kilometraje Inicial:</label>
              <input
                type="number"
                value={currentMileage}
                onChange={(e) => setCurrentMileage(e.target.value)}
                required
                className="w-full p-2.5 border border-slate-300 rounded-xl font-mono font-bold focus:outline-none focus:border-blue-500 min-h-[44px]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors min-h-[44px]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-md shadow-blue-600/30 flex items-center gap-1.5 min-h-[44px]"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Guardar Vehículo</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
