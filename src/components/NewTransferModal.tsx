import React, { useState } from 'react';
import { X, UserCheck, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface NewTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewTransferModal: React.FC<NewTransferModalProps> = ({ isOpen, onClose }) => {
  const { vehicles, selectedVehicleId, getVehicleOwnerships, addOwnership } = useApp();

  const [vehicleId, setVehicleId] = useState<string>(selectedVehicleId || vehicles[0]?.id || '');
  const [ownerType, setOwnerType] = useState<'particular' | 'empresa_flota' | 'renting_leasing'>('particular');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [locationCity, setLocationCity] = useState('Montevideo');
  const [departmentOrProvince, setDepartmentOrProvince] = useState('Montevideo');
  const [registryEntity, setRegistryEntity] = useState('SUCIVE Intendencia de Montevideo');
  const [mileageAtTransfer, setMileageAtTransfer] = useState('');
  const [transferReason, setTransferReason] = useState<
    'compraventa_particular' | 'concesionario_usado' | 'cambio_titular_familiar' | 'fin_leasing'
  >('compraventa_particular');

  const targetVehicle = vehicles.find((v) => v.id === vehicleId);
  const currentOwners = vehicleId ? getVehicleOwnerships(vehicleId) : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const km = parseInt(mileageAtTransfer) || (targetVehicle?.currentMileage || 0);

    addOwnership({
      vehicleId,
      ownerNumber: currentOwners.length + 1,
      ownerType,
      startDate,
      locationCity,
      departmentOrProvince,
      registryEntity,
      mileageAtTransfer: km,
      transferReason,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl border border-slate-200 relative my-6 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-slate-900">
                Registrar Transferencia de Titular
              </h3>
              <p className="text-xs text-slate-500">
                Nuevo titular #{currentOwners.length + 1} con certificación SUCIVE / DNRPA
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
          <div>
            <label className="font-bold text-slate-700 block mb-1">Vehículo transferido:</label>
            <select
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              required
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-blue-500 min-h-[44px]"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.plate} — {v.brand} {v.model} (Titulares actuales: {getVehicleOwnerships(v.id).length})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Tipo de titular:</label>
              <select
                value={ownerType}
                onChange={(e) => setOwnerType(e.target.value as any)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 min-h-[44px]"
              >
                <option value="particular">Persona Particular</option>
                <option value="empresa_flota">Automotora / Empresa</option>
                <option value="renting_leasing">Renting / Leasing</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Motivo:</label>
              <select
                value={transferReason}
                onChange={(e) => setTransferReason(e.target.value as any)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 min-h-[44px]"
              >
                <option value="compraventa_particular">Compraventa entre particulares</option>
                <option value="concesionario_usado">Automotora / Concesionario</option>
                <option value="cambio_titular_familiar">Cambio titular familiar</option>
                <option value="fin_leasing">Fin de contrato renting</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Fecha de transferencia:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 min-h-[44px]"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Ciudad / Departamento:</label>
              <input
                type="text"
                value={locationCity}
                onChange={(e) => {
                  setLocationCity(e.target.value);
                  setDepartmentOrProvince(e.target.value);
                }}
                required
                placeholder="ej. Montevideo, Maldonado, Canelones..."
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 min-h-[44px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Kilometraje registrado al transferir:</label>
              <input
                type="number"
                placeholder={`Actual: ${targetVehicle?.currentMileage.toLocaleString('es-UY') || 0} km`}
                value={mileageAtTransfer}
                onChange={(e) => setMileageAtTransfer(e.target.value)}
                required
                className="w-full p-2.5 border border-slate-300 rounded-xl font-bold font-mono focus:outline-none focus:border-blue-500 min-h-[44px]"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Entidad de Registro:</label>
              <input
                type="text"
                value={registryEntity}
                onChange={(e) => setRegistryEntity(e.target.value)}
                placeholder="ej. SUCIVE, DNRPA..."
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 min-h-[44px]"
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
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors min-h-[44px]"
            >
              Asentar Transferencia
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
