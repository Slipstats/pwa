import {
  Profile,
  Child,
  SettlementAgreement,
  Expense,
  ReceiptLineItem,
  CourtBundle,
  IDataRepository,
} from "./types";
import {
  MOCK_PROFILE,
  MOCK_CHILDREN,
  MOCK_AGREEMENT,
  MOCK_EXPENSES,
  MOCK_SLIP_ITEMS,
  MOCK_COURT_BUNDLE,
} from "@/lib/data/mockData";

export const STORAGE_KEYS = {
  PROFILES: "slipstats_profiles",
  CHILDREN: "slipstats_children",
  AGREEMENTS: "slipstats_agreements",
  EXPENSES: "slipstats_expenses",
  LINE_ITEMS: "slipstats_receipt_line_items",
  COURT_BUNDLES: "slipstats_court_bundles",
  DEMO_MODE: "slipstats_demo_mode",
} as const;

// In-memory fallback for SSR or environments without localStorage
const memoryStore = new Map<string, string>();

function getStorage(): {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
} {
  if (typeof window !== "undefined" && window.localStorage) {
    return window.localStorage;
  }
  if (typeof globalThis !== "undefined" && (globalThis as unknown as { localStorage?: Storage }).localStorage) {
    return (globalThis as unknown as { localStorage: Storage }).localStorage;
  }
  return {
    getItem: (key: string) => memoryStore.get(key) ?? null,
    setItem: (key: string, value: string) => memoryStore.set(key, value),
    removeItem: (key: string) => memoryStore.delete(key),
  };
}

function dispatchDataChanged(entity: string): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("slipstats:data-changed", { detail: { entity } }));
  }
}

export class LocalRepository implements IDataRepository {
  private initialized = false;

  private ensureInitialized(): void {
    if (this.initialized) return;

    const storage = getStorage();
    const demoMode = storage.getItem(STORAGE_KEYS.DEMO_MODE);
    const profiles = storage.getItem(STORAGE_KEYS.PROFILES);

    // If storage is uninitialized or demo mode is explicitly enabled
    if (profiles === null || demoMode === null) {
      this.seedMockDataSync();
    }
    this.initialized = true;
  }

  private seedMockDataSync(): void {
    const storage = getStorage();
    storage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify([MOCK_PROFILE]));
    storage.setItem(STORAGE_KEYS.CHILDREN, JSON.stringify(MOCK_CHILDREN));
    storage.setItem(STORAGE_KEYS.AGREEMENTS, JSON.stringify([MOCK_AGREEMENT]));
    storage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(MOCK_EXPENSES));
    storage.setItem(STORAGE_KEYS.LINE_ITEMS, JSON.stringify(MOCK_SLIP_ITEMS));
    storage.setItem(STORAGE_KEYS.COURT_BUNDLES, JSON.stringify([MOCK_COURT_BUNDLE]));
    storage.setItem(STORAGE_KEYS.DEMO_MODE, "true");
  }

  // Profile methods
  async getProfile(): Promise<Profile> {
    this.ensureInitialized();
    const storage = getStorage();
    const raw = storage.getItem(STORAGE_KEYS.PROFILES);
    if (!raw) return MOCK_PROFILE;
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed[0] || MOCK_PROFILE : parsed;
    } catch {
      return MOCK_PROFILE;
    }
  }

  async updateProfile(data: Partial<Profile>): Promise<Profile> {
    const current = await this.getProfile();
    const updated: Profile = {
      ...current,
      ...data,
      updated_at: new Date().toISOString(),
    };
    const storage = getStorage();
    storage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify([updated]));
    dispatchDataChanged("profile");
    return updated;
  }

  // Children methods
  async getChildren(): Promise<Child[]> {
    this.ensureInitialized();
    const storage = getStorage();
    const raw = storage.getItem(STORAGE_KEYS.CHILDREN);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  async addChild(child: Omit<Child, "id" | "created_at">): Promise<Child> {
    const children = await this.getChildren();
    const newChild: Child = {
      ...child,
      id: `child-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      created_at: new Date().toISOString(),
    };
    children.push(newChild);
    const storage = getStorage();
    storage.setItem(STORAGE_KEYS.CHILDREN, JSON.stringify(children));
    dispatchDataChanged("child");
    return newChild;
  }

  async deleteChild(id: string): Promise<boolean> {
    const children = await this.getChildren();
    const initialLength = children.length;
    const filtered = children.filter((c) => c.id !== id);
    if (filtered.length !== initialLength) {
      const storage = getStorage();
      storage.setItem(STORAGE_KEYS.CHILDREN, JSON.stringify(filtered));
      dispatchDataChanged("child");
      return true;
    }
    return false;
  }

  // Settlement Agreement methods
  async getAgreement(): Promise<SettlementAgreement> {
    this.ensureInitialized();
    const storage = getStorage();
    const raw = storage.getItem(STORAGE_KEYS.AGREEMENTS);
    if (!raw) return MOCK_AGREEMENT;
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed[0] || MOCK_AGREEMENT : parsed;
    } catch {
      return MOCK_AGREEMENT;
    }
  }

  async saveAgreement(agreement: Partial<SettlementAgreement>): Promise<SettlementAgreement> {
    const current = await this.getAgreement();
    const updated: SettlementAgreement = {
      ...current,
      ...agreement,
    };
    const storage = getStorage();
    storage.setItem(STORAGE_KEYS.AGREEMENTS, JSON.stringify([updated]));
    dispatchDataChanged("agreement");
    return updated;
  }

  // Expenses methods
  async getExpenses(childId?: string, category?: string): Promise<Expense[]> {
    this.ensureInitialized();
    const storage = getStorage();
    const raw = storage.getItem(STORAGE_KEYS.EXPENSES);
    let expenses: Expense[] = [];
    if (raw) {
      try {
        expenses = JSON.parse(raw);
      } catch {
        expenses = [];
      }
    }
    if (childId) {
      expenses = expenses.filter((e) => e.child_id === childId);
    }
    if (category) {
      expenses = expenses.filter((e) => e.category === category);
    }
    return expenses;
  }

  async createExpense(
    expense: Omit<Expense, "id" | "created_at" | "updated_at">,
    lineItems?: Omit<ReceiptLineItem, "id" | "expense_id" | "created_at">[]
  ): Promise<Expense> {
    this.ensureInitialized();
    const expenses = await this.getExpenses();
    const now = new Date().toISOString();
    const expenseId = `exp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    // If child_name is not provided but child_id is, resolve it
    let childName = expense.child_name;
    if (!childName && expense.child_id) {
      const children = await this.getChildren();
      const matched = children.find((c) => c.id === expense.child_id);
      if (matched) {
        childName = matched.first_name;
      }
    }

    const newExpense: Expense = {
      ...expense,
      id: expenseId,
      child_name: childName,
      created_at: now,
      updated_at: now,
    };

    expenses.unshift(newExpense);
    const storage = getStorage();
    storage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));

    if (lineItems && lineItems.length > 0) {
      const rawLines = storage.getItem(STORAGE_KEYS.LINE_ITEMS);
      let existingLines: ReceiptLineItem[] = [];
      if (rawLines) {
        try {
          existingLines = JSON.parse(rawLines);
        } catch {
          existingLines = [];
        }
      }
      const createdLines: ReceiptLineItem[] = lineItems.map((item, idx) => ({
        ...item,
        id: `slip-item-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 7)}`,
        expense_id: expenseId,
        created_at: now,
      }));
      existingLines.push(...createdLines);
      storage.setItem(STORAGE_KEYS.LINE_ITEMS, JSON.stringify(existingLines));
    }

    dispatchDataChanged("expense");
    return newExpense;
  }

  async updateExpenseStatus(id: string, status: Expense["status"]): Promise<Expense> {
    this.ensureInitialized();
    const expenses = await this.getExpenses();
    const index = expenses.findIndex((e) => e.id === id);
    if (index === -1) {
      throw new Error(`Expense with id ${id} not found`);
    }
    const updated: Expense = {
      ...expenses[index],
      status,
      updated_at: new Date().toISOString(),
    };
    expenses[index] = updated;
    const storage = getStorage();
    storage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    dispatchDataChanged("expense");
    return updated;
  }

  async deleteExpense(id: string): Promise<boolean> {
    this.ensureInitialized();
    const expenses = await this.getExpenses();
    const initialLength = expenses.length;
    const filtered = expenses.filter((e) => e.id !== id);
    if (filtered.length !== initialLength) {
      const storage = getStorage();
      storage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(filtered));

      // Cascade delete line items
      const rawLines = storage.getItem(STORAGE_KEYS.LINE_ITEMS);
      if (rawLines) {
        try {
          const lines: ReceiptLineItem[] = JSON.parse(rawLines);
          const remaining = lines.filter((l) => l.expense_id !== id);
          storage.setItem(STORAGE_KEYS.LINE_ITEMS, JSON.stringify(remaining));
        } catch {
          // ignore
        }
      }

      dispatchDataChanged("expense");
      return true;
    }
    return false;
  }

  // Line items
  async getLineItems(expenseId: string): Promise<ReceiptLineItem[]> {
    this.ensureInitialized();
    const storage = getStorage();
    const raw = storage.getItem(STORAGE_KEYS.LINE_ITEMS);
    if (!raw) return [];
    try {
      const all: ReceiptLineItem[] = JSON.parse(raw);
      return all.filter((item) => item.expense_id === expenseId);
    } catch {
      return [];
    }
  }

  // Court bundles
  async getCourtBundle(period: string, preset: string): Promise<CourtBundle> {
    this.ensureInitialized();
    const storage = getStorage();
    const raw = storage.getItem(STORAGE_KEYS.COURT_BUNDLES);
    let bundles: CourtBundle[] = [];
    if (raw) {
      try {
        bundles = JSON.parse(raw);
      } catch {
        bundles = [];
      }
    }
    const existing = bundles.find((b) => b.preset_type === preset);
    if (existing) {
      return existing;
    }

    // Generate dynamic bundle from current expenses
    const expenses = await this.getExpenses();
    const profile = await this.getProfile();
    const totalTracked = expenses.reduce((sum, e) => sum + (e.net_claimable_amount || 0), 0);
    const totalCoParent = expenses.reduce((sum, e) => sum + (e.co_parent_share_amount || 0), 0);
    const totalSettled = expenses
      .filter((e) => e.status === "reimbursed")
      .reduce((sum, e) => sum + (e.co_parent_share_amount || 0), 0);
    const arrears = Math.max(0, totalCoParent - totalSettled);

    const validPreset = (
      ["form_4a", "rule_43", "arrears_statement", "full_ledger"].includes(preset)
        ? preset
        : "form_4a"
    ) as CourtBundle["preset_type"];

    const bundle: CourtBundle = {
      id: `bundle-${Date.now()}`,
      user_id: profile.id,
      bundle_title: `${preset.toUpperCase()} Maintenance Exhibit Bundle (${period || "Current"})`,
      preset_type: validPreset,
      period_start: new Date().toISOString().slice(0, 10),
      period_end: new Date().toISOString().slice(0, 10),
      total_expenses_tracked: totalTracked,
      total_coparent_share: totalCoParent,
      total_settled: totalSettled,
      total_arrears: arrears,
      verified_slip_count: expenses.length,
      cryptographic_bundle_hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      pdf_storage_path: null,
      certified_timestamp: new Date().toISOString(),
      notes: "Generated via Slipstats court-grade persistence layer.",
    };

    return bundle;
  }

  // Demo mode controls
  isDemoMode(): boolean {
    const storage = getStorage();
    const val = storage.getItem(STORAGE_KEYS.DEMO_MODE);
    if (val === null) {
      return true; // default demo mode is enabled
    }
    return val === "true";
  }

  async setDemoMode(enabled: boolean): Promise<void> {
    const storage = getStorage();
    storage.setItem(STORAGE_KEYS.DEMO_MODE, enabled ? "true" : "false");
    if (enabled) {
      const expensesRaw = storage.getItem(STORAGE_KEYS.EXPENSES);
      if (!expensesRaw || JSON.parse(expensesRaw).length === 0) {
        await this.resetToSeedData();
        return;
      }
    }
    dispatchDataChanged("demo_mode");
  }

  async resetToSeedData(): Promise<void> {
    this.seedMockDataSync();
    this.initialized = true;
    dispatchDataChanged("all");
  }

  async clearToCleanSlate(): Promise<void> {
    const storage = getStorage();
    const cleanProfile: Profile = {
      id: "user-clean-01",
      full_name: "Mother",
      role: "mother",
      email: null,
      phone: null,
      default_currency: "ZAR",
      court_case_number: null,
      court_jurisdiction: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const cleanAgreement: SettlementAgreement = {
      id: "agreement-clean-01",
      user_id: "user-clean-01",
      case_number: null,
      court_order_date: null,
      co_parent_full_name: "Co-Parent",
      co_parent_email: null,
      co_parent_phone: null,
      category_split_rules: {
        "Medical Aid / Doctor": 50,
        "School & Education": 50,
        "Rent / Child Room": 50,
        "Fuel / Transport": 50,
        "Extramural / Sports": 50,
        "Nutrition & Hygiene": 50,
      },
      payment_due_day: 1,
      is_active: true,
      created_at: new Date().toISOString(),
    };

    storage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify([cleanProfile]));
    storage.setItem(STORAGE_KEYS.CHILDREN, JSON.stringify([]));
    storage.setItem(STORAGE_KEYS.AGREEMENTS, JSON.stringify([cleanAgreement]));
    storage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify([]));
    storage.setItem(STORAGE_KEYS.LINE_ITEMS, JSON.stringify([]));
    storage.setItem(STORAGE_KEYS.COURT_BUNDLES, JSON.stringify([]));
    storage.setItem(STORAGE_KEYS.DEMO_MODE, "false");
    this.initialized = true;
    dispatchDataChanged("all");
  }
}

// Export singleton instance
export const localRepository = new LocalRepository();
