import { describe, it, expect, beforeEach } from "vitest";
import { LocalRepository } from "@/lib/repository/localRepository";
import { getRepository, setRepositoryInstance } from "@/lib/repository";
import { computeMetrics } from "@/context/LedgerContext";
import { Expense, ReceiptLineItem } from "@/types/database.types";

// Mock browser storage and EventTarget for isolated unit testing in Node
class MockStorage {
  private store: Record<string, string> = {};

  getItem(key: string): string | null {
    return this.store[key] ?? null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }
}

class MockCustomEvent {
  type: string;
  detail: unknown;
  constructor(type: string, params?: { detail?: unknown }) {
    this.type = type;
    this.detail = params?.detail;
  }
}

class MockEventTarget {
  private listeners: Record<string, ((event: unknown) => void)[]> = {};

  addEventListener(type: string, listener: (event: unknown) => void) {
    if (!this.listeners[type]) this.listeners[type] = [];
    this.listeners[type].push(listener);
  }

  removeEventListener(type: string, listener: (event: unknown) => void) {
    if (!this.listeners[type]) return;
    this.listeners[type] = this.listeners[type].filter((l) => l !== listener);
  }

  dispatchEvent(event: { type: string; detail?: unknown }): boolean {
    const list = this.listeners[event.type] || [];
    list.forEach((l) => l(event));
    return true;
  }
}

describe("Data Repository Layer (Milestone 2)", () => {
  let repo: LocalRepository;
  let mockWindow: MockEventTarget;
  let mockStorage: MockStorage;

  beforeEach(() => {
    mockStorage = new MockStorage();
    mockWindow = new MockEventTarget();

    // Attach mock window & localStorage
    (globalThis as unknown as { window: unknown }).window = mockWindow;
    (mockWindow as unknown as { localStorage: MockStorage }).localStorage = mockStorage;
    (globalThis as unknown as { localStorage: MockStorage }).localStorage = mockStorage;
    (globalThis as unknown as { CustomEvent: typeof MockCustomEvent }).CustomEvent = MockCustomEvent;
    (mockWindow as unknown as { CustomEvent: typeof MockCustomEvent }).CustomEvent = MockCustomEvent;

    setRepositoryInstance(null);
    repo = new LocalRepository();
  });

  describe("1. Initialization and Seed Data", () => {
    it("initializes with realistic seed data on first access", async () => {
      expect(repo.isDemoMode()).toBe(true);

      const profile = await repo.getProfile();
      expect(profile.full_name).toBe("Sarah Jenkins");
      expect(profile.court_case_number).toBe("MC-2024/7821");

      const children = await repo.getChildren();
      expect(children.length).toBe(2);
      expect(children.map((c) => c.first_name)).toEqual(["Liam", "Maya"]);

      const expenses = await repo.getExpenses();
      expect(expenses.length).toBe(5);

      const agreement = await repo.getAgreement();
      expect(agreement.co_parent_full_name).toBe("Mark Jenkins");
    });
  });

  describe("2. Expense Mutations & Line Item Association", () => {
    it("creates a new expense and resolves child name automatically", async () => {
      const children = await repo.getChildren();
      const liam = children.find((c) => c.first_name === "Liam")!;

      const newExpense = await repo.createExpense({
        user_id: "user-mother-01",
        child_id: liam.id,
        vendor: "Woolworths Kids",
        description: "School Uniform Shoes",
        category: "Clothing & Essentials",
        subcategory: "Uniforms",
        expense_date: "2024-11-01",
        gross_slip_amount: 650.0,
        medical_aid_covered: 0.0,
        net_claimable_amount: 650.0,
        co_parent_percentage: 50.0,
        co_parent_share_amount: 325.0,
        receipt_image_url: null,
        receipt_sha256_hash: "abcd1234efgh5678",
        receipt_id_tag: "#SL-9901",
        exhibit_label: "Exhibit 06",
        legal_court_notes: "Winter uniform replacement.",
        status: "pending",
        ocr_score: 98.5,
        ocr_raw_text: "WOOLWORTHS TAX INVOICE...",
        is_recurring: false,
        recurring_period: null,
      });

      expect(newExpense.id).toBeDefined();
      expect(newExpense.child_name).toBe("Liam");

      const allExpenses = await repo.getExpenses();
      expect(allExpenses[0].id).toBe(newExpense.id);
      expect(allExpenses.length).toBe(6);

      // Verify child filter
      const liamExpenses = await repo.getExpenses(liam.id);
      expect(liamExpenses.some((e) => e.id === newExpense.id)).toBe(true);

      // Verify category filter
      const clothingExpenses = await repo.getExpenses(undefined, "Clothing & Essentials");
      expect(clothingExpenses.length).toBe(1);
      expect(clothingExpenses[0].id).toBe(newExpense.id);
    });

    it("creates line items associated with an expense and retrieves them", async () => {
      const lineItemInput: Omit<ReceiptLineItem, "id" | "expense_id" | "created_at">[] = [
        {
          child_id: "child-liam-01",
          item_name: "School Shoes Size 2",
          quantity: 1,
          unit_price: 450.0,
          line_total: 450.0,
          is_included: true,
          child_allocation_ratio: 1.0,
          child_portion_amount: 450.0,
        },
        {
          child_id: null,
          item_name: "Coffee Beans 250g",
          quantity: 1,
          unit_price: 85.0,
          line_total: 85.0,
          is_included: false,
          exclusion_reason: "Personal parent expense",
          child_allocation_ratio: 0.0,
          child_portion_amount: 0.0,
        },
      ];

      const expense = await repo.createExpense(
        {
          user_id: "user-mother-01",
          child_id: "child-liam-01",
          vendor: "Checkers Supermarket",
          description: "Shoes & Groceries",
          category: "Clothing & Essentials",
          subcategory: null,
          expense_date: "2024-11-02",
          gross_slip_amount: 535.0,
          medical_aid_covered: 0.0,
          net_claimable_amount: 450.0,
          co_parent_percentage: 50.0,
          co_parent_share_amount: 225.0,
          receipt_image_url: null,
          receipt_sha256_hash: null,
          receipt_id_tag: null,
          exhibit_label: null,
          legal_court_notes: null,
          status: "pending",
          ocr_score: null,
          ocr_raw_text: null,
          is_recurring: false,
          recurring_period: null,
        },
        lineItemInput
      );

      const items = await repo.getLineItems(expense.id);
      expect(items.length).toBe(2);
      expect(items[0].expense_id).toBe(expense.id);
      expect(items[0].is_included).toBe(true);
      expect(items[1].is_included).toBe(false);
      expect(items[1].exclusion_reason).toBe("Personal parent expense");
    });

    it("updates expense audit status", async () => {
      const expenses = await repo.getExpenses();
      const target = expenses[0];

      const updated = await repo.updateExpenseStatus(target.id, "reimbursed");
      expect(updated.status).toBe("reimbursed");

      const refreshed = await repo.getExpenses();
      expect(refreshed.find((e) => e.id === target.id)?.status).toBe("reimbursed");
    });

    it("deletes an expense and cascade deletes its line items", async () => {
      const expense = await repo.createExpense(
        {
          user_id: "user-mother-01",
          child_id: null,
          vendor: "Test Vendor",
          description: "To be deleted",
          category: "Other",
          subcategory: null,
          expense_date: "2024-11-03",
          gross_slip_amount: 100.0,
          medical_aid_covered: 0.0,
          net_claimable_amount: 100.0,
          co_parent_percentage: 50.0,
          co_parent_share_amount: 50.0,
          receipt_image_url: null,
          receipt_sha256_hash: null,
          receipt_id_tag: null,
          exhibit_label: null,
          legal_court_notes: null,
          status: "draft",
          ocr_score: null,
          ocr_raw_text: null,
          is_recurring: false,
          recurring_period: null,
        },
        [
          {
            child_id: null,
            item_name: "Test item",
            quantity: 1,
            unit_price: 100.0,
            line_total: 100.0,
            is_included: true,
            child_allocation_ratio: 1.0,
            child_portion_amount: 100.0,
          },
        ]
      );

      expect((await repo.getLineItems(expense.id)).length).toBe(1);

      const deleted = await repo.deleteExpense(expense.id);
      expect(deleted).toBe(true);

      const expensesAfter = await repo.getExpenses();
      expect(expensesAfter.some((e) => e.id === expense.id)).toBe(false);

      const lineItemsAfter = await repo.getLineItems(expense.id);
      expect(lineItemsAfter.length).toBe(0);
    });
  });

  describe("3. Children Management", () => {
    it("adds a new child and retrieves updated list", async () => {
      const newChild = await repo.addChild({
        user_id: "user-mother-01",
        first_name: "Leo",
        last_name: "Jenkins",
        date_of_birth: "2023-04-10",
        age_display: "Age 1 • Toddler",
        school_name: "Oakridge Daycare",
        medical_aid_number: "MED-88192-03",
        avatar_url: null,
        default_split_ratio: 60.0,
        notes: "High support needs daycare.",
      });

      expect(newChild.id).toBeDefined();
      expect(newChild.first_name).toBe("Leo");

      const children = await repo.getChildren();
      expect(children.length).toBe(3);
      expect(children.some((c) => c.id === newChild.id)).toBe(true);
    });

    it("deletes a child by id", async () => {
      const children = await repo.getChildren();
      const childToDelete = children[0];

      const success = await repo.deleteChild(childToDelete.id);
      expect(success).toBe(true);

      const remaining = await repo.getChildren();
      expect(remaining.length).toBe(children.length - 1);
      expect(remaining.some((c) => c.id === childToDelete.id)).toBe(false);
    });
  });

  describe("4. Custom Event Dispatch for Cross-Component Reactivity", () => {
    it("dispatches slipstats:data-changed on expense creation", async () => {
      const events: string[] = [];
      mockWindow.addEventListener("slipstats:data-changed", (evt: unknown) => {
        const customEvt = evt as { detail?: { entity?: string } };
        if (customEvt.detail?.entity) {
          events.push(customEvt.detail.entity);
        }
      });

      await repo.createExpense({
        user_id: "user-mother-01",
        child_id: null,
        vendor: "Clicks",
        description: "Panado",
        category: "Medical Aid / Doctor",
        subcategory: null,
        expense_date: "2024-11-04",
        gross_slip_amount: 55.0,
        medical_aid_covered: 0.0,
        net_claimable_amount: 55.0,
        co_parent_percentage: 50.0,
        co_parent_share_amount: 27.5,
        receipt_image_url: null,
        receipt_sha256_hash: null,
        receipt_id_tag: null,
        exhibit_label: null,
        legal_court_notes: null,
        status: "pending",
        ocr_score: null,
        ocr_raw_text: null,
        is_recurring: false,
        recurring_period: null,
      });

      expect(events).toContain("expense");
    });

    it("dispatches slipstats:data-changed on child creation and deletion", async () => {
      const events: string[] = [];
      mockWindow.addEventListener("slipstats:data-changed", (evt: unknown) => {
        const customEvt = evt as { detail?: { entity?: string } };
        if (customEvt.detail?.entity) {
          events.push(customEvt.detail.entity);
        }
      });

      const child = await repo.addChild({
        user_id: "user-mother-01",
        first_name: "Ethan",
        last_name: "Jenkins",
        date_of_birth: null,
        age_display: "Baby",
        school_name: null,
        medical_aid_number: null,
        avatar_url: null,
        default_split_ratio: 50.0,
        notes: null,
      });

      expect(events).toContain("child");

      await repo.deleteChild(child.id);
      expect(events.filter((e) => e === "child").length).toBe(2);
    });

    it("dispatches slipstats:data-changed on agreement modification", async () => {
      let agreementFired = false;
      mockWindow.addEventListener("slipstats:data-changed", (evt: unknown) => {
        const customEvt = evt as { detail?: { entity?: string } };
        if (customEvt.detail?.entity === "agreement") {
          agreementFired = true;
        }
      });

      await repo.saveAgreement({ payment_due_day: 7 });
      expect(agreementFired).toBe(true);

      const agr = await repo.getAgreement();
      expect(agr.payment_due_day).toBe(7);
    });
  });

  describe("5. Demo Mode vs Clean Slate Toggle", () => {
    it("clears all records to clean slate and disables demo mode", async () => {
      const events: string[] = [];
      mockWindow.addEventListener("slipstats:data-changed", (evt: unknown) => {
        const customEvt = evt as { detail?: { entity?: string } };
        if (customEvt.detail?.entity) {
          events.push(customEvt.detail.entity);
        }
      });

      await repo.clearToCleanSlate();

      expect(repo.isDemoMode()).toBe(false);
      expect(events).toContain("all");

      const expenses = await repo.getExpenses();
      expect(expenses).toEqual([]);

      const children = await repo.getChildren();
      expect(children).toEqual([]);

      const profile = await repo.getProfile();
      expect(profile.full_name).toBe("Mother");
    });

    it("resets back to realistic seed data on resetToSeedData()", async () => {
      await repo.clearToCleanSlate();
      expect((await repo.getExpenses()).length).toBe(0);

      await repo.resetToSeedData();
      expect(repo.isDemoMode()).toBe(true);

      const expenses = await repo.getExpenses();
      expect(expenses.length).toBe(5);

      const children = await repo.getChildren();
      expect(children.length).toBe(2);
    });

    it("toggles demo mode state using setDemoMode", async () => {
      await repo.setDemoMode(false);
      expect(repo.isDemoMode()).toBe(false);

      await repo.setDemoMode(true);
      expect(repo.isDemoMode()).toBe(true);
    });
  });

  describe("6. Ledger Metrics Computation", () => {
    it("computes accurate ledger totals, co-parent owed, arrears, and child breakdown", async () => {
      const expenses = await repo.getExpenses();
      const metrics = computeMetrics(expenses);

      // Seed data: 64.50 + 118.20 + 950.00 + 75.00 + 350.00 = 1557.70
      expect(metrics.totalTracked).toBe(1557.7);

      // Co-parent owed: 32.25 + 59.10 + 475.00 + 45.00 + 175.00 = 786.35
      expect(metrics.coParentOwed).toBe(786.35);

      // exp-03 (Oakridge Montessori R475.00) is reimbursed, so settled = 475.00
      // Arrears = 786.35 - 475.00 = 311.35
      expect(metrics.arrears).toBe(311.35);

      // Child spends mapping
      expect(metrics.childSpends["child-liam-01"]).toBe(64.5 + 75.0 + 350.0);
      expect(metrics.childSpends["child-maya-02"]).toBe(118.2);
      expect(metrics.childSpends["joint"]).toBe(950.0);

      // Category breakdown
      expect(metrics.categoryBreakdown["School & Education"]).toBe(950.0);
      expect(metrics.categoryBreakdown["Medical Aid / Doctor"]).toBe(414.5);
      expect(metrics.categoryBreakdown["Nutrition & Hygiene"]).toBe(118.2);
      expect(metrics.categoryBreakdown["Fuel / Transport"]).toBe(75.0);
    });

    it("returns zero metrics on clean slate (empty expenses)", () => {
      const metrics = computeMetrics([]);
      expect(metrics.totalTracked).toBe(0);
      expect(metrics.coParentOwed).toBe(0);
      expect(metrics.arrears).toBe(0);
      expect(metrics.childSpends).toEqual({});
      expect(metrics.categoryBreakdown).toEqual({});
    });
  });

  describe("7. Court Bundle Generation", () => {
    it("generates a valid court bundle conforming to Form 4A preset", async () => {
      const bundle = await repo.getCourtBundle("2024-10", "form_4a");

      expect(bundle.id).toBeDefined();
      expect(bundle.preset_type).toBe("form_4a");
      expect(bundle.bundle_title.toLowerCase()).toContain("form 4a");
      expect(bundle.total_expenses_tracked).toBeGreaterThan(0);
      expect(bundle.total_coparent_share).toBeGreaterThan(0);
      expect(bundle.cryptographic_bundle_hash).toBe(
        "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
      );
    });
  });

  describe("8. Repository Factory", () => {
    it("returns LocalRepository when Supabase is not configured", () => {
      const r = getRepository();
      expect(r).toBeInstanceOf(LocalRepository);
    });

    it("allows resetting the repository instance", () => {
      const r1 = getRepository();
      setRepositoryInstance(null);
      const r2 = getRepository();
      expect(r1).toBe(r2); // singletons match
    });
  });
});
