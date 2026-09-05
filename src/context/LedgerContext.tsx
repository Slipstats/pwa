"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import {
  Profile,
  Child,
  SettlementAgreement,
  Expense,
  ReceiptLineItem,
} from "@/types/database.types";
import { getRepository } from "@/lib/repository";
import {
  calculateMedicalAidGap,
  calculateCoParentShare,
  calculateOutstandingArrears,
  roundToTwo,
} from "@/lib/calculations";

export interface LedgerMetrics {
  totalTracked: number;
  coParentOwed: number;
  arrears: number;
  childSpends: Record<string, number>;
  categoryBreakdown: Record<string, number>;
}

export interface LedgerContextType {
  expenses: Expense[];
  children: Child[];
  agreement: SettlementAgreement | null;
  profile: Profile | null;
  metrics: LedgerMetrics;
  demoMode: boolean;
  isDemo: boolean;
  loading: boolean;
  activeChildId: string | null;
  setActiveChildId: (id: string | null) => void;
  addExpense: (
    expense: Omit<Expense, "id" | "created_at" | "updated_at">,
    lineItems?: Omit<ReceiptLineItem, "id" | "expense_id" | "created_at">[]
  ) => Promise<Expense>;
  createExpense: (
    expense: Omit<Expense, "id" | "created_at" | "updated_at">,
    lineItems?: Omit<ReceiptLineItem, "id" | "expense_id" | "created_at">[]
  ) => Promise<Expense>;
  addChild: (child: Omit<Child, "id" | "created_at">) => Promise<Child>;
  deleteChild: (id: string) => Promise<boolean>;
  saveAgreement: (agreement: Partial<SettlementAgreement>) => Promise<SettlementAgreement>;
  updateProfile: (data: Partial<Profile>) => Promise<Profile>;
  deleteExpense: (id: string) => Promise<boolean>;
  toggleDemoMode: () => Promise<void>;
  setDemoMode: (enabled: boolean) => Promise<void>;
  resetToSeed: () => Promise<void>;
  resetToSeedData: () => Promise<void>;
  clearToCleanSlate: () => Promise<void>;
  refreshLedger: () => Promise<void>;
}

export function computeMetrics(expenses: Expense[]): LedgerMetrics {
  let totalTracked = 0;
  let coParentOwed = 0;
  let totalSettled = 0;
  const childSpends: Record<string, number> = {};
  const categoryBreakdown: Record<string, number> = {};

  for (const exp of expenses) {
    const netClaimable =
      exp.net_claimable_amount ??
      calculateMedicalAidGap(exp.gross_slip_amount, exp.medical_aid_covered);
    const coparentShare =
      exp.co_parent_share_amount ??
      calculateCoParentShare(netClaimable, exp.co_parent_percentage);

    totalTracked += netClaimable;
    coParentOwed += coparentShare;

    if (exp.status === "reimbursed") {
      totalSettled += coparentShare;
    }

    const childKey = exp.child_id || "joint";
    childSpends[childKey] = roundToTwo((childSpends[childKey] || 0) + netClaimable);
    if (exp.child_name && exp.child_id) {
      childSpends[exp.child_name] = roundToTwo((childSpends[exp.child_name] || 0) + netClaimable);
    }

    const catKey = exp.category || "Other";
    categoryBreakdown[catKey] = roundToTwo((categoryBreakdown[catKey] || 0) + netClaimable);
  }

  const roundedTotalTracked = roundToTwo(totalTracked);
  const roundedCoParentOwed = roundToTwo(coParentOwed);
  const arrears = calculateOutstandingArrears(roundedCoParentOwed, totalSettled);

  return {
    totalTracked: roundedTotalTracked,
    coParentOwed: roundedCoParentOwed,
    arrears,
    childSpends,
    categoryBreakdown,
  };
}

const defaultMetrics: LedgerMetrics = {
  totalTracked: 0,
  coParentOwed: 0,
  arrears: 0,
  childSpends: {},
  categoryBreakdown: {},
};

const LedgerContext = createContext<LedgerContextType>({
  expenses: [],
  children: [],
  agreement: null,
  profile: null,
  metrics: defaultMetrics,
  demoMode: true,
  isDemo: true,
  loading: true,
  activeChildId: null,
  setActiveChildId: () => {},
  addExpense: async () => {
    throw new Error("LedgerProvider not mounted");
  },
  createExpense: async () => {
    throw new Error("LedgerProvider not mounted");
  },
  addChild: async () => {
    throw new Error("LedgerProvider not mounted");
  },
  deleteChild: async () => false,
  saveAgreement: async () => {
    throw new Error("LedgerProvider not mounted");
  },
  updateProfile: async () => {
    throw new Error("LedgerProvider not mounted");
  },
  deleteExpense: async () => {
    throw new Error("LedgerProvider not mounted");
  },
  toggleDemoMode: async () => {},
  setDemoMode: async () => {},
  resetToSeed: async () => {},
  resetToSeedData: async () => {},
  clearToCleanSlate: async () => {},
  refreshLedger: async () => {},
});

export const LedgerProvider = ({ children: childNodes }: { children: ReactNode }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [agreement, setAgreement] = useState<SettlementAgreement | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [demoMode, setDemoModeState] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeChildId, setActiveChildId] = useState<string | null>(null);

  const refreshLedger = useCallback(async () => {
    try {
      const repo = getRepository();
      const [expList, childList, agr, prof] = await Promise.all([
        repo.getExpenses(),
        repo.getChildren(),
        repo.getAgreement(),
        repo.getProfile(),
      ]);
      setExpenses(expList);
      setChildren(childList);
      setAgreement(agr);
      setProfile(prof);
      setDemoModeState(repo.isDemoMode());
    } catch (e) {
      console.error("Failed to load ledger data", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshLedger();

    const handleDataChanged = () => {
      refreshLedger();
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key && event.key.startsWith("slipstats_")) {
        refreshLedger();
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("slipstats:data-changed", handleDataChanged);
      window.addEventListener("storage", handleStorage);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("slipstats:data-changed", handleDataChanged);
        window.removeEventListener("storage", handleStorage);
      }
    };
  }, [refreshLedger]);

  const metrics = useMemo(() => computeMetrics(expenses), [expenses]);

  const addExpense = useCallback(
    async (
      expense: Omit<Expense, "id" | "created_at" | "updated_at">,
      lineItems?: Omit<ReceiptLineItem, "id" | "expense_id" | "created_at">[]
    ): Promise<Expense> => {
      const repo = getRepository();
      const created = await repo.createExpense(expense, lineItems);
      await refreshLedger();
      return created;
    },
    [refreshLedger]
  );

  const addChild = useCallback(
    async (child: Omit<Child, "id" | "created_at">): Promise<Child> => {
      const repo = getRepository();
      const created = await repo.addChild(child);
      await refreshLedger();
      return created;
    },
    [refreshLedger]
  );

  const deleteChild = useCallback(
    async (id: string): Promise<boolean> => {
      const repo = getRepository();
      const deleted = await repo.deleteChild(id);
      await refreshLedger();
      return deleted;
    },
    [refreshLedger]
  );

  const saveAgreement = useCallback(
    async (ag: Partial<SettlementAgreement>): Promise<SettlementAgreement> => {
      const repo = getRepository();
      const saved = await repo.saveAgreement(ag);
      await refreshLedger();
      return saved;
    },
    [refreshLedger]
  );

  const updateProfile = useCallback(
    async (data: Partial<Profile>): Promise<Profile> => {
      const repo = getRepository();
      const updated = await repo.updateProfile(data);
      await refreshLedger();
      return updated;
    },
    [refreshLedger]
  );

  const deleteExpense = useCallback(
    async (id: string): Promise<boolean> => {
      const repo = getRepository();
      const deleted = await repo.deleteExpense(id);
      await refreshLedger();
      return deleted;
    },
    [refreshLedger]
  );

  const setDemoMode = useCallback(
    async (enabled: boolean): Promise<void> => {
      const repo = getRepository();
      await repo.setDemoMode(enabled);
      await refreshLedger();
    },
    [refreshLedger]
  );

  const toggleDemoMode = useCallback(async () => {
    const repo = getRepository();
    const current = repo.isDemoMode();
    await repo.setDemoMode(!current);
    await refreshLedger();
  }, [refreshLedger]);

  const resetToSeed = useCallback(async () => {
    const repo = getRepository();
    await repo.resetToSeedData();
    await refreshLedger();
  }, [refreshLedger]);

  const clearToCleanSlate = useCallback(async () => {
    const repo = getRepository();
    await repo.clearToCleanSlate();
    await refreshLedger();
  }, [refreshLedger]);

  const contextValue = useMemo(
    () => ({
      expenses,
      children,
      agreement,
      profile,
      metrics,
      demoMode,
      isDemo: demoMode,
      loading,
      activeChildId,
      setActiveChildId,
      addExpense,
      createExpense: addExpense,
      addChild,
      deleteChild,
      saveAgreement,
      updateProfile,
      deleteExpense,
      toggleDemoMode,
      setDemoMode,
      resetToSeed,
      resetToSeedData: resetToSeed,
      clearToCleanSlate,
      refreshLedger,
    }),
    [
      expenses,
      children,
      agreement,
      profile,
      metrics,
      demoMode,
      loading,
      activeChildId,
      setActiveChildId,
      addExpense,
      addChild,
      deleteChild,
      saveAgreement,
      updateProfile,
      deleteExpense,
      toggleDemoMode,
      setDemoMode,
      resetToSeed,
      clearToCleanSlate,
      refreshLedger,
    ]
  );

  return <LedgerContext.Provider value={contextValue}>{childNodes}</LedgerContext.Provider>;
};

export const useLedger = () => useContext(LedgerContext);
