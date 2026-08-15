export type RepairCategory =
  | 'mantenimiento_preventivo'
  | 'motor'
  | 'frenos'
  | 'transmision'
  | 'suspension_direccion'
  | 'electrico_bateria'
  | 'carroceria_choque'
  | 'inspeccion_itv_revision';

export type Currency = 'UYU' | 'USD' | 'ARS';
export type Country = 'UY' | 'AR';

export interface RepairRecord {
  id: string;
  vehicleId: string;
  mechanicId: string;
  mechanicName: string;
  workshopName: string;
  workshopBadge: 'Certificado Gold' | 'Taller Oficial' | 'Especialista Máster' | 'Taller Registrado' | 'Master Certificado' | 'Oro';
  workshopCity: string;
  country: Country;
  date: string;
  mileage: number;
  category: RepairCategory;
  title: string;
  description: string;
  replacedParts: string[];
  invoiceNumber: string;
  warrantyMonths: number;
  costEstimated?: number;
  verified: boolean;
  qrVerificationCode: string;
  diagnosticNotes?: string;
  photos?: string[];
}

export interface OwnershipRecord {
  id: string;
  vehicleId: string;
  ownerNumber: number;
  ownerType: 'particular' | 'empresa_flota' | 'renting_leasing' | 'concesionario_usado';
  startDate: string;
  endDate?: string;
  locationCity: string;
  departmentOrProvince: string;
  mileageAtTransfer: number;
  transferReason: 'compraventa_particular' | 'concesionario_usado' | 'cambio_titular_familiar' | 'fin_leasing';
  verifiedByDgtOrRegistry: boolean;
  registryEntity: 'SUCIVE (Uruguay)' | 'Registro Nacional de Automotores (Uruguay)' | 'DNRPA (Argentina)';
}

export interface Vehicle {
  id: string;
  vin: string; // Número de chasis o VIN
  engineNumber?: string; // Número de motor opcional
  plate: string; // Matrícula / Chapa
  plateFormat?: 'uruguay_mercosur' | 'uruguay_departamento' | 'argentina_mercosur' | 'argentina_clasica';
  country: Country;
  departmentOrProvince: string;
  brand: string;
  model: string;
  year: number;
  color?: string;
  fuelType: 'Gasolina' | 'Diésel' | 'Híbrido' | 'Eléctrico';
  transmission: 'Manual' | 'Automática';
  powerHp?: number;
  currentMileage: number;
  estimatedMarketValueUyu?: number;
  status: 'clean' | 'warning' | 'alert';
  statusLabel: string;
  statusExplanation: string;
  photo: string;
  hasOdometerRollback: boolean;
  odometerDiscrepancyNote?: string;
  isStolen?: boolean;
  totalConsultations: number;
  createdDate: string;
}

export interface Mechanic {
  id: string;
  name: string;
  workshopName: string;
  avatar: string;
  city: string;
  departmentOrProvince: string;
  country: Country;
  rating: number;
  tier: 'Bronce' | 'Plata' | 'Oro' | 'Master Certificado' | 'Taller Oficial';
  totalRegistrations: number;
  totalQueriesGenerated: number;
  accumulatedEarningsUyu: number;
  paidEarningsUyu: number;
  pendingEarningsUyu: number;
  bankAccount: string;
  rutOrCuit: string;
  phone: string;
  joinedDate: string;
}

export type SubscriptionTierId = 'single_pass' | 'limited_pack' | 'unlimited_pro';

export interface SubscriptionTier {
  id: SubscriptionTierId;
  name: string;
  shortName: string;
  tagline: string;
  priceUyu: number;
  priceUsd: number;
  priceArs: number;
  period: 'pago_unico' | 'mes' | 'año';
  queriesIncluded: number | 'unlimited';
  payoutToPoolPercent: number; // e.g. 50% of fees goes to mechanics royalties
  popular?: boolean;
  features: string[];
  targetAudience: string;
  badgeLabel?: string;
}

export interface UserSubscription {
  tierId: SubscriptionTierId | 'none';
  tierName: string;
  active: boolean;
  expiresAt: string | null;
  queriesRemaining: number | 'unlimited';
  queriesUsed: number;
  totalSpentUyu: number;
}

export interface QueryTransaction {
  id: string;
  timestamp: string;
  vehicleId: string;
  vehiclePlate: string;
  vehicleName: string;
  userType: 'comprador_particular' | 'concesionario' | 'mecanico_evaluador';
  feePaidUyu: number;
  totalRoyaltiesDistributedUyu: number;
  creditedMechanics: {
    mechanicId: string;
    mechanicName: string;
    workshopName: string;
    amountUyu: number;
  }[];
}

export interface PayoutRequest {
  id: string;
  mechanicId: string;
  mechanicName: string;
  workshopName: string;
  amountUyu: number;
  date: string;
  status: 'completado' | 'procesando';
  paymentMethod: string;
  referenceCode: string;
}

export interface AiAnalysisResult {
  healthScore: number;
  verdict: string;
  summary: string;
  keyFindings: string[];
  pendingMaintenance: string[];
  valuationImpact: string;
}

export type UserRole = 'user' | 'mechanic';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  mechanicId?: string;
  workshopName?: string;
  city?: string;
}

export type ViewMode =
  | 'landing'
  | 'search'
  | 'vehicle_report'
  | 'mechanics_portal'
  | 'revenue_ecosystem'
  | 'pricing';
