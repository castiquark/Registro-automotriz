import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Vehicle,
  RepairRecord,
  OwnershipRecord,
  Mechanic,
  UserSubscription,
  QueryTransaction,
  PayoutRequest,
  ViewMode,
  SubscriptionTier,
  SubscriptionTierId,
  Currency,
  AuthUser,
  UserRole
} from '../types';
import {
  INITIAL_VEHICLES,
  INITIAL_REPAIRS,
  INITIAL_OWNERSHIPS,
  INITIAL_MECHANICS,
  INITIAL_TRANSACTIONS,
  INITIAL_PAYOUTS,
  SUBSCRIPTION_TIERS
} from '../data/mockData';

interface AppContextType {
  vehicles: Vehicle[];
  repairs: RepairRecord[];
  ownerships: OwnershipRecord[];
  mechanics: Mechanic[];
  transactions: QueryTransaction[];
  payouts: PayoutRequest[];
  userSubscription: UserSubscription;
  currentUser: AuthUser | null;
  activeView: ViewMode;
  selectedVehicleId: string | null;
  selectedMechanicId: string;
  selectedCurrency: Currency;
  isSubscriptionModalOpen: boolean;
  isLoginModalOpen: boolean;
  unlockedVehicles: string[];
  isProcessing: boolean;
  processingMessage: string | null;
  activeToast: { message: string; type: 'success' | 'info' | 'error' } | null;
  login: (role: UserRole, details?: { name?: string; email?: string; mechanicId?: string; workshopName?: string }) => void;
  logout: () => void;
  setIsLoginModalOpen: (open: boolean) => void;
  setProcessing: (isProcessing: boolean, message?: string | null) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  setActiveView: (view: ViewMode) => void;
  setSelectedVehicleId: (id: string | null) => void;
  setSelectedMechanicId: (id: string) => void;
  setSelectedCurrency: (currency: Currency) => void;
  setIsSubscriptionModalOpen: (open: boolean) => void;
  formatCurrency: (amountInUyu: number, overrideCurrency?: Currency) => string;
  addRepair: (repair: Omit<RepairRecord, 'id' | 'qrVerificationCode' | 'verified'>) => void;
  addOwnership: (ownership: Omit<OwnershipRecord, 'id' | 'verifiedByDgtOrRegistry'>) => void;
  addNewVehicle: (vehicle: Omit<Vehicle, 'id' | 'totalConsultations' | 'createdDate'>) => string;
  subscribeToPlan: (tierId: SubscriptionTierId) => void;
  unlockVehicleReport: (vehicleId: string) => boolean;
  requestMechanicPayout: (mechanicId: string, amountUyu: number, paymentMethod: string) => boolean;
  getVehicleById: (id: string) => Vehicle | undefined;
  getVehicleRepairs: (vehicleId: string) => RepairRecord[];
  getVehicleOwnerships: (vehicleId: string) => OwnershipRecord[];
  getMechanicRepairs: (mechanicId: string) => RepairRecord[];
  getCurrentMechanic: () => Mechanic | undefined;
  calculateVehicleScore: (vehicleId: string) => number;
  totalSystemRevenueUyu: number;
  totalRoyaltiesDistributedUyu: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_PREFIX = 'autohistorial_pro_uy_';

// Conversion constants
// 1 USD ≈ 43 UYU | 1 UYU ≈ 30 ARS
const RATES = {
  UYU: 1,
  USD: 1 / 43,
  ARS: 30
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_PREFIX + 'currency');
    return (saved as Currency) || 'UYU';
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_PREFIX + 'vehicles');
    return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
  });

  const [repairs, setRepairs] = useState<RepairRecord[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_PREFIX + 'repairs');
    return saved ? JSON.parse(saved) : INITIAL_REPAIRS;
  });

  const [ownerships, setOwnerships] = useState<OwnershipRecord[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_PREFIX + 'ownerships');
    return saved ? JSON.parse(saved) : INITIAL_OWNERSHIPS;
  });

  const [mechanics, setMechanics] = useState<Mechanic[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_PREFIX + 'mechanics');
    return saved ? JSON.parse(saved) : INITIAL_MECHANICS;
  });

  const [transactions, setTransactions] = useState<QueryTransaction[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_PREFIX + 'transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [payouts, setPayouts] = useState<PayoutRequest[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_PREFIX + 'payouts');
    return saved ? JSON.parse(saved) : INITIAL_PAYOUTS;
  });

  const [userSubscription, setUserSubscription] = useState<UserSubscription>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_PREFIX + 'subscription');
    return saved
      ? JSON.parse(saved)
      : {
          tierId: 'none',
          tierName: 'Sin suscripción',
          active: false,
          expiresAt: null,
          queriesRemaining: 0,
          queriesUsed: 0,
          totalSpentUyu: 0,
        };
  });

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_PREFIX + 'currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [unlockedVehicles, setUnlockedVehicles] = useState<string[]>(['veh-1']); // First vehicle unlocked for demonstration
  const [activeView, setActiveView] = useState<ViewMode>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_PREFIX + 'currentUser');
    if (saved) {
      const user = JSON.parse(saved);
      return user.role === 'mechanic' ? 'mechanics_portal' : 'search';
    }
    return 'landing';
  });
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>('veh-1');
  const [selectedMechanicId, setSelectedMechanicId] = useState<string>('mec-1');
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingMessage, setProcessingMessage] = useState<string | null>(null);
  const [activeToast, setActiveToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Sync currentUser to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(LOCAL_STORAGE_PREFIX + 'currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_PREFIX + 'currentUser');
    }
  }, [currentUser]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    setActiveToast({ message, type });
    setTimeout(() => {
      setActiveToast((current) => (current?.message === message ? null : current));
    }, 3500);
  };

  const setProcessing = (processing: boolean, message: string | null = null) => {
    setIsProcessing(processing);
    setProcessingMessage(message);
  };

  const login = (
    role: UserRole,
    details?: { name?: string; email?: string; mechanicId?: string; workshopName?: string }
  ) => {
    setProcessing(true, 'Iniciando sesión...');
    setTimeout(() => {
      setProcessing(false);
      if (role === 'user') {
        const user: AuthUser = {
          id: 'usr-1',
          name: details?.name || 'Comprador / Particular',
          email: details?.email || 'comprador@autohistorial.com',
          role: 'user'
        };
        setCurrentUser(user);
        setActiveView('search');
        showToast('Sesión iniciada como Comprador / Usuario', 'success');
      } else {
        const targetMechanicId = details?.mechanicId || selectedMechanicId || 'mec-1';
        setSelectedMechanicId(targetMechanicId);
        const mechanicData = mechanics.find((m) => m.id === targetMechanicId);
        const user: AuthUser = {
          id: 'usr-mec',
          name: details?.name || mechanicData?.name || 'Mecánico Responsable',
          email: details?.email || 'taller@autohistorial.com',
          role: 'mechanic',
          mechanicId: targetMechanicId,
          workshopName: details?.workshopName || mechanicData?.workshopName || 'Taller Mecánica del Sur',
          city: mechanicData?.city || 'Montevideo'
        };
        setCurrentUser(user);
        setActiveView('mechanics_portal');
        showToast(`Sesión iniciada: ${user.workshopName}`, 'success');
      }
      setIsLoginModalOpen(false);
    }, 450);
  };

  const logout = () => {
    setProcessing(true, 'Cerrando sesión...');
    setTimeout(() => {
      setProcessing(false);
      setCurrentUser(null);
      setActiveView('landing');
      showToast('Has cerrado sesión', 'info');
    }, 300);
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + 'currency', selectedCurrency);
  }, [selectedCurrency]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + 'vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + 'repairs', JSON.stringify(repairs));
  }, [repairs]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + 'ownerships', JSON.stringify(ownerships));
  }, [ownerships]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + 'mechanics', JSON.stringify(mechanics));
  }, [mechanics]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + 'transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + 'payouts', JSON.stringify(payouts));
  }, [payouts]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + 'subscription', JSON.stringify(userSubscription));
  }, [userSubscription]);

  // Format currency helper
  const formatCurrency = (amountInUyu: number, overrideCurrency?: Currency): string => {
    const currency = overrideCurrency || selectedCurrency;
    if (currency === 'USD') {
      const val = amountInUyu * RATES.USD;
      return `US$ ${Math.round(val).toLocaleString('es-UY')}`;
    }
    if (currency === 'ARS') {
      const val = amountInUyu * RATES.ARS;
      return `$ ${Math.round(val).toLocaleString('es-AR')} ARS`;
    }
    return `$ ${Math.round(amountInUyu).toLocaleString('es-UY')} UYU`;
  };

  // Calculations
  const totalSystemRevenueUyu =
    transactions.reduce((acc, t) => acc + t.feePaidUyu, 0) + (userSubscription.totalSpentUyu || 0);
  const totalRoyaltiesDistributedUyu = mechanics.reduce((acc, m) => acc + m.accumulatedEarningsUyu, 0);

  const getVehicleById = (id: string) => vehicles.find((v) => v.id === id);

  const getVehicleRepairs = (vehicleId: string) =>
    repairs
      .filter((r) => r.vehicleId === vehicleId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getVehicleOwnerships = (vehicleId: string) =>
    ownerships
      .filter((o) => o.vehicleId === vehicleId)
      .sort((a, b) => a.ownerNumber - b.ownerNumber);

  const getMechanicRepairs = (mechanicId: string) =>
    repairs
      .filter((r) => r.mechanicId === mechanicId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getCurrentMechanic = () => mechanics.find((m) => m.id === selectedMechanicId);

  const calculateVehicleScore = (vehicleId: string): number => {
    const v = getVehicleById(vehicleId);
    if (!v) return 50;
    const vRepairs = getVehicleRepairs(vehicleId);

    let score = 80;
    // Boost for verified maintenance records in workshops
    score += Math.min(20, vRepairs.length * 5);
    // Heavy penalty for odometer rollback
    if (v.hasOdometerRollback) score -= 50;

    return Math.max(10, Math.min(100, score));
  };

  // Add new repair by mechanic
  const addRepair = (repairData: Omit<RepairRecord, 'id' | 'qrVerificationCode' | 'verified'>) => {
    const newId = 'rep-' + Date.now().toString().slice(-6);
    const qrCode = `AUTOHIST-UY-${repairData.mileage}-${repairData.mechanicId.toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const newRecord: RepairRecord = {
      ...repairData,
      id: newId,
      qrVerificationCode: qrCode,
      verified: true,
    };

    // Update repairs
    setRepairs((prev) => [newRecord, ...prev]);

    // Update mechanic stats
    setMechanics((prev) =>
      prev.map((m) => {
        if (m.id === repairData.mechanicId) {
          const nextCount = m.totalRegistrations + 1;
          let tier = m.tier;
          if (nextCount > 120) tier = 'Master Certificado';
          else if (nextCount > 80) tier = 'Oro';
          else if (nextCount > 40) tier = 'Plata';

          return {
            ...m,
            totalRegistrations: nextCount,
            tier,
          };
        }
        return m;
      })
    );

    // Update vehicle's current mileage if greater & check rollback
    setVehicles((prev) =>
      prev.map((v) => {
        if (v.id === repairData.vehicleId) {
          const isRollback = repairData.mileage < v.currentMileage;
          return {
            ...v,
            currentMileage: Math.max(v.currentMileage, repairData.mileage),
            hasOdometerRollback: v.hasOdometerRollback || isRollback,
            odometerDiscrepancyNote: isRollback
              ? `Inconsistencia detectada: registro del ${repairData.date} con ${repairData.mileage.toLocaleString()} km cuando previamente existía registro de ${v.currentMileage.toLocaleString()} km.`
              : v.odometerDiscrepancyNote,
            status: isRollback ? 'alert' : v.status,
            statusLabel: isRollback ? 'Alerta de Odómetro' : v.statusLabel,
          };
        }
        return v;
      })
    );

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch {
      // ignore
    }
  };

  // Add ownership transfer
  const addOwnership = (ownershipData: Omit<OwnershipRecord, 'id' | 'verifiedByDgtOrRegistry'>) => {
    const newId = 'own-' + Date.now().toString().slice(-6);
    const newRecord: OwnershipRecord = {
      ...ownershipData,
      id: newId,
      verifiedByDgtOrRegistry: true,
    };

    setOwnerships((prev) => [...prev, newRecord]);

    // Update vehicle current mileage if higher
    setVehicles((prev) =>
      prev.map((v) => {
        if (v.id === ownershipData.vehicleId) {
          return {
            ...v,
            currentMileage: Math.max(v.currentMileage, ownershipData.mileageAtTransfer),
          };
        }
        return v;
      })
    );
  };

  // Add a new vehicle to the registry
  const addNewVehicle = (vehicleData: Omit<Vehicle, 'id' | 'totalConsultations' | 'createdDate'>): string => {
    const newId = 'veh-' + Date.now().toString().slice(-5);
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: newId,
      totalConsultations: 0,
      createdDate: new Date().toISOString().split('T')[0],
    };

    setVehicles((prev) => [newVehicle, ...prev]);
    return newId;
  };

  // Subscribe to a plan
  const subscribeToPlan = (tierId: SubscriptionTierId) => {
    const tier = SUBSCRIPTION_TIERS.find((t) => t.id === tierId);
    if (!tier) return;

    const expiresDate = new Date();
    if (tier.period === 'mes') {
      expiresDate.setDate(expiresDate.getDate() + 30);
    } else if (tier.period === 'pago_unico') {
      expiresDate.setDate(expiresDate.getDate() + 30);
    }

    setUserSubscription((prev) => ({
      tierId,
      tierName: tier.name,
      active: true,
      expiresAt: expiresDate.toISOString(),
      queriesRemaining:
        tier.queriesIncluded === 'unlimited'
          ? 'unlimited'
          : (typeof prev.queriesRemaining === 'number' ? prev.queriesRemaining : 0) + tier.queriesIncluded,
      queriesUsed: prev.queriesUsed,
      totalSpentUyu: prev.totalSpentUyu + tier.priceUyu,
    }));

    setIsSubscriptionModalOpen(false);

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  };

  // Unlock vehicle report & distribute royalties to mechanics
  const unlockVehicleReport = (vehicleId: string): boolean => {
    if (unlockedVehicles.includes(vehicleId)) {
      return true;
    }

    const hasQueries =
      userSubscription.active &&
      (userSubscription.queriesRemaining === 'unlimited' ||
        (typeof userSubscription.queriesRemaining === 'number' && userSubscription.queriesRemaining > 0));

    if (!hasQueries) {
      setIsSubscriptionModalOpen(true);
      return false;
    }

    const vehicle = getVehicleById(vehicleId);
    if (!vehicle) return false;

    // Calculate which mechanics have records in this vehicle
    const vehicleRepairsList = getVehicleRepairs(vehicleId);
    const mechanicIdsWithRecords: string[] = Array.from(new Set(vehicleRepairsList.map((r) => r.mechanicId)));

    // Pool distribution: ~$195 UYU per query distributed across contributing mechanics
    const totalRoyaltyUyu = 195;
    const royaltyPerMechanic = mechanicIdsWithRecords.length > 0
      ? Math.round(totalRoyaltyUyu / mechanicIdsWithRecords.length)
      : 0;

    const creditedMechanicsList: {
      mechanicId: string;
      mechanicName: string;
      workshopName: string;
      amountUyu: number;
    }[] = mechanicIdsWithRecords.map((mId) => {
      const mechanic = mechanics.find((m) => m.id === mId);
      return {
        mechanicId: mId,
        mechanicName: mechanic?.name || 'Taller Certificado',
        workshopName: mechanic?.workshopName || 'Taller',
        amountUyu: royaltyPerMechanic,
      };
    });

    // Credit mechanics
    if (mechanicIdsWithRecords.length > 0) {
      setMechanics((prev) =>
        prev.map((m) => {
          if (mechanicIdsWithRecords.includes(m.id)) {
            return {
              ...m,
              totalQueriesGenerated: m.totalQueriesGenerated + 1,
              accumulatedEarningsUyu: m.accumulatedEarningsUyu + royaltyPerMechanic,
              pendingEarningsUyu: m.pendingEarningsUyu + royaltyPerMechanic,
            };
          }
          return m;
        })
      );
    }

    // Record Query Transaction
    const newTransaction: QueryTransaction = {
      id: 'trx-' + Date.now().toString().slice(-6),
      timestamp: new Date().toISOString(),
      vehicleId,
      vehiclePlate: vehicle.plate,
      vehicleName: `${vehicle.brand} ${vehicle.model}`,
      userType: userSubscription.tierId === 'unlimited_pro' ? 'concesionario' : 'comprador_particular',
      feePaidUyu: userSubscription.tierId === 'single_pass' ? 390 : 180,
      totalRoyaltiesDistributedUyu: totalRoyaltyUyu,
      creditedMechanics: creditedMechanicsList,
    };

    setTransactions((prev) => [newTransaction, ...prev]);

    // Update vehicle consultations count
    setVehicles((prev) =>
      prev.map((v) => (v.id === vehicleId ? { ...v, totalConsultations: v.totalConsultations + 1 } : v))
    );

    // Consume query count if not unlimited
    setUserSubscription((prev) => ({
      ...prev,
      queriesRemaining:
        prev.queriesRemaining === 'unlimited'
          ? 'unlimited'
          : Math.max(0, (typeof prev.queriesRemaining === 'number' ? prev.queriesRemaining : 1) - 1),
      queriesUsed: prev.queriesUsed + 1,
    }));

    setUnlockedVehicles((prev) => [...prev, vehicleId]);

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {
      // ignore
    }

    return true;
  };

  // Request payout for a mechanic
  const requestMechanicPayout = (mechanicId: string, amountUyu: number, paymentMethod: string): boolean => {
    const mechanic = mechanics.find((m) => m.id === mechanicId);
    if (!mechanic || mechanic.pendingEarningsUyu < amountUyu || amountUyu <= 0) {
      return false;
    }

    const newPayout: PayoutRequest = {
      id: 'pay-' + Date.now().toString().slice(-6),
      mechanicId,
      mechanicName: mechanic.name,
      workshopName: mechanic.workshopName,
      amountUyu,
      date: new Date().toISOString().split('T')[0],
      status: 'completado',
      paymentMethod,
      referenceCode: 'ROYALTY-UY-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
    };

    setPayouts((prev) => [newPayout, ...prev]);

    setMechanics((prev) =>
      prev.map((m) => {
        if (m.id === mechanicId) {
          return {
            ...m,
            paidEarningsUyu: m.paidEarningsUyu + amountUyu,
            pendingEarningsUyu: m.pendingEarningsUyu - amountUyu,
          };
        }
        return m;
      })
    );

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
      });
    } catch {
      // ignore
    }

    return true;
  };

  return (
    <AppContext.Provider
      value={{
        vehicles,
        repairs,
        ownerships,
        mechanics,
        transactions,
        payouts,
        userSubscription,
        currentUser,
        activeView,
        selectedVehicleId,
        selectedMechanicId,
        selectedCurrency,
        isSubscriptionModalOpen,
        isLoginModalOpen,
        unlockedVehicles,
        isProcessing,
        processingMessage,
        activeToast,
        login,
        logout,
        setIsLoginModalOpen,
        setProcessing,
        showToast,
        setActiveView,
        setSelectedVehicleId,
        setSelectedMechanicId,
        setSelectedCurrency,
        setIsSubscriptionModalOpen,
        formatCurrency,
        addRepair,
        addOwnership,
        addNewVehicle,
        subscribeToPlan,
        unlockVehicleReport,
        requestMechanicPayout,
        getVehicleById,
        getVehicleRepairs,
        getVehicleOwnerships,
        getMechanicRepairs,
        getCurrentMechanic,
        calculateVehicleScore,
        totalSystemRevenueUyu,
        totalRoyaltiesDistributedUyu,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
