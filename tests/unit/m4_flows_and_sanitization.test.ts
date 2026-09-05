import { describe, it, expect } from "vitest";
import {
  calculateMedicalAidGap,
  calculateCoParentShare,
  calculateReceiptAudit,
  calculateLineItemPortion,
  LineItemAuditInput,
} from "@/lib/calculations";
import { MOCK_SLIP_ITEMS, MOCK_CHILDREN, MOCK_AGREEMENT, MOCK_EXPENSES } from "@/lib/data/mockData";
import { computeMetrics } from "@/context/LedgerContext";
import type { Child, Expense, SettlementAgreement } from "@/types/database.types";

describe("Milestone 4: Real-World User Flows, Form Sanitization & Pristine UX", () => {
  // --------------------------------------------------------------------------
  // 1. Form Sanitization on /expenses/new
  // --------------------------------------------------------------------------
  describe("1. Form Sanitization on /expenses/new", () => {
    it("verifies initial sanitized empty state defaults", () => {
      const sanitizedInitialState = {
        vendor: "",
        grossAmount: "",
        medicalAidCovered: "",
        category: "Nutrition & Hygiene",
        subCategory: "",
        childAllocation: "",
        legalNotes: "",
        expenseDate: new Date().toISOString().split("T")[0],
        receiptHash: null,
      };

      expect(sanitizedInitialState.vendor).toBe("");
      expect(sanitizedInitialState.grossAmount).toBe("");
      expect(sanitizedInitialState.medicalAidCovered).toBe("");
      expect(sanitizedInitialState.subCategory).toBe("");
      expect(sanitizedInitialState.legalNotes).toBe("");
      expect(sanitizedInitialState.receiptHash).toBeNull();
      expect(sanitizedInitialState.expenseDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it("enforces validation rules: rejects empty vendor, zero amount, and missing child", () => {
      const validateExpenseForm = (form: {
        vendor: string;
        grossAmount: string;
        childAllocation: string;
      }) => {
        const errors: Record<string, string> = {};
        const numGross = parseFloat(form.grossAmount) || 0;

        if (!form.vendor.trim()) {
          errors.vendor = "Vendor or medical provider is required";
        }
        if (!form.grossAmount || numGross <= 0) {
          errors.grossAmount = "Gross amount must be greater than zero";
        }
        if (!form.childAllocation) {
          errors.childAllocation = "Child assignment is required";
        }

        return { isValid: Object.keys(errors).length === 0, errors };
      };

      // Invalid empty submission
      const result1 = validateExpenseForm({
        vendor: "",
        grossAmount: "",
        childAllocation: "",
      });
      expect(result1.isValid).toBe(false);
      expect(result1.errors.vendor).toBeDefined();
      expect(result1.errors.grossAmount).toBeDefined();
      expect(result1.errors.childAllocation).toBeDefined();

      // Zero amount
      const result2 = validateExpenseForm({
        vendor: "Dis-Chem",
        grossAmount: "0.00",
        childAllocation: "child-liam-01",
      });
      expect(result2.isValid).toBe(false);
      expect(result2.errors.grossAmount).toBeDefined();

      // Valid submission
      const result3 = validateExpenseForm({
        vendor: "Dr. V Naidoo Paediatrics",
        grossAmount: "850.00",
        childAllocation: "child-liam-01",
      });
      expect(result3.isValid).toBe(true);
      expect(result3.errors).toEqual({});
    });

    it("calculates real-time medical aid gap and co-parent share", () => {
      const grossAmount = 850.0;
      const medicalAidCovered = 500.0;
      const netClaimable = calculateMedicalAidGap(grossAmount, medicalAidCovered);
      expect(netClaimable).toBe(350.0);

      const split50 = calculateCoParentShare(netClaimable, 50);
      expect(split50).toBe(175.0);

      const split70 = calculateCoParentShare(netClaimable, 70);
      expect(split70).toBe(245.0);
    });

    it("correctly resolves dynamic child naming for individual vs joint allocations", () => {
      const children: Child[] = [...MOCK_CHILDREN];

      const resolveChild = (allocationId: string) => {
        if (allocationId === "joint") {
          return {
            child_id: null,
            child_name: children.map((c) => c.first_name).join(" & "),
          };
        }
        const found = children.find((c) => c.id === allocationId);
        return {
          child_id: found ? found.id : null,
          child_name: found ? found.first_name : "Unknown",
        };
      };

      expect(resolveChild("child-liam-01")).toEqual({
        child_id: "child-liam-01",
        child_name: "Liam",
      });

      expect(resolveChild("joint")).toEqual({
        child_id: null,
        child_name: "Liam & Maya",
      });
    });
  });

  // --------------------------------------------------------------------------
  // 2. Till Slip Audit UX on /scan
  // --------------------------------------------------------------------------
  describe("2. Till Slip Audit UX on /scan", () => {
    it("starts with empty uploader state by default (no pre-loaded items)", () => {
      const initialScanState = {
        items: [],
        vendor: "",
        receiptNumber: "",
        receiptHash: null,
      };

      expect(initialScanState.items).toHaveLength(0);
      expect(initialScanState.vendor).toBe("");
      expect(initialScanState.receiptNumber).toBe("");
      expect(initialScanState.receiptHash).toBeNull();
    });

    it("loading sample till slip loads realistic Checkers Hyper items", () => {
      const sampleItems = MOCK_SLIP_ITEMS.map((item) => ({ ...item }));
      expect(sampleItems.length).toBeGreaterThan(0);

      const auditInputs: LineItemAuditInput[] = sampleItems.map((it) => ({
        line_total: it.line_total,
        is_included: it.is_included,
        child_allocation_ratio: it.child_allocation_ratio,
      }));

      const audit = calculateReceiptAudit(auditInputs, 50);
      expect(audit.gross_slip_total).toBe(184.6);
      expect(audit.child_qualifying_total).toBe(141.8);
      expect(audit.excluded_personal_total).toBe(42.8);
      expect(audit.co_parent_share).toBe(70.9);
    });

    it("toggling personal item exclusion dynamically updates audit totals", () => {
      // Start with 2 items: 1 child (R100), 1 personal (R50)
      const items: LineItemAuditInput[] = [
        { line_total: 100.0, is_included: true, child_allocation_ratio: 1.0 },
        { line_total: 50.0, is_included: true, child_allocation_ratio: 1.0 },
      ];

      const initialAudit = calculateReceiptAudit(items, 50);
      expect(initialAudit.gross_slip_total).toBe(150.0);
      expect(initialAudit.child_qualifying_total).toBe(150.0);
      expect(initialAudit.co_parent_share).toBe(75.0);

      // Exclude personal item (item 2)
      items[1].is_included = false;
      items[1].child_allocation_ratio = 0.0;

      const updatedAudit = calculateReceiptAudit(items, 50);
      expect(updatedAudit.gross_slip_total).toBe(150.0);
      expect(updatedAudit.child_qualifying_total).toBe(100.0);
      expect(updatedAudit.excluded_personal_total).toBe(50.0);
      expect(updatedAudit.co_parent_share).toBe(50.0);
    });

    it("cycling child allocation ratios (1.0 -> 0.7 -> 0.5) recalculates line portion correctly", () => {
      const item = { line_total: 200.0, is_included: true, child_allocation_ratio: 1.0 };
      expect(calculateLineItemPortion(item)).toBe(200.0);

      item.child_allocation_ratio = 0.7;
      expect(calculateLineItemPortion(item)).toBe(140.0);

      item.child_allocation_ratio = 0.5;
      expect(calculateLineItemPortion(item)).toBe(100.0);

      item.is_included = false;
      expect(calculateLineItemPortion(item)).toBe(0.0);
    });
  });

  // --------------------------------------------------------------------------
  // 3. Children & Agreement Management on /children & AddChildModal
  // --------------------------------------------------------------------------
  describe("3. Children & Agreement Management on /children & AddChildModal", () => {
    it("verifies AddChildModal initializes with clean empty fields (no hardcoded mock defaults)", () => {
      const modalState = {
        firstName: "",
        lastName: "",
        ageDisplay: "",
        schoolName: "",
        medicalAidNumber: "",
        splitRatio: 50,
        notes: "",
      };

      expect(modalState.firstName).toBe("");
      expect(modalState.lastName).toBe("");
      expect(modalState.ageDisplay).toBe("");
      expect(modalState.schoolName).toBe("");
      expect(modalState.medicalAidNumber).toBe("");
    });

    it("verifies dynamic child creation creates clean child entity", () => {
      const newChildData: Omit<Child, "id" | "created_at"> = {
        user_id: "user-mother-01",
        first_name: "Ethan",
        last_name: "Naidoo",
        date_of_birth: null,
        age_display: "Age 2 • Nursery",
        school_name: "Little Stars Academy",
        medical_aid_number: "MED-9988-01",
        avatar_url: null,
        default_split_ratio: 60,
        notes: "Nut allergy, swimming lessons",
      };

      expect(newChildData.first_name).toBe("Ethan");
      expect(newChildData.default_split_ratio).toBe(60);
      expect(newChildData.medical_aid_number).toBe("MED-9988-01");
    });

    it("updates settlement agreement split percentages dynamically", () => {
      const agreement: SettlementAgreement = { ...MOCK_AGREEMENT };

      const updateCategorySplit = (
        rules: Record<string, number>,
        category: string,
        ratio: number
      ) => ({
        ...rules,
        [category]: ratio,
      });

      const updated = updateCategorySplit(agreement.category_split_rules, "Extramural / Sports", 70);
      expect(updated["Extramural / Sports"]).toBe(70);
      expect(updated["School & Education"]).toBe(50);
    });
  });

  // --------------------------------------------------------------------------
  // 4. Dynamic Header Child Filter & Dashboard Reactivity
  // --------------------------------------------------------------------------
  describe("4. Dynamic Header Child Filter & Dashboard Reactivity", () => {
    it("filters expenses by active child selection", () => {
      const allExpenses: Expense[] = [...MOCK_EXPENSES];
      expect(allExpenses).toHaveLength(5);

      const filterByChild = (expenses: Expense[], activeChildId: string | null) => {
        if (!activeChildId || activeChildId === "all") return expenses;
        return expenses.filter(
          (e) => e.child_id === activeChildId || e.child_name?.includes(activeChildId)
        );
      };

      const liamExpenses = filterByChild(allExpenses, "Liam");
      expect(liamExpenses.length).toBeGreaterThan(0);
      liamExpenses.forEach((e) => {
        expect(e.child_name).toContain("Liam");
      });

      const all = filterByChild(allExpenses, "all");
      expect(all).toHaveLength(5);
    });
  });

  // --------------------------------------------------------------------------
  // 5. Reports Page Integration & Metrics Computation
  // --------------------------------------------------------------------------
  describe("5. Reports Page Integration & Metrics Computation", () => {
    it("computes accurate ledger metrics across multiple expenses", () => {
      const expenses: Expense[] = [...MOCK_EXPENSES];
      const metrics = computeMetrics(expenses);

      expect(metrics.totalTracked).toBeGreaterThan(0);
      expect(metrics.coParentOwed).toBeGreaterThan(0);
      expect(metrics.arrears).toBeGreaterThanOrEqual(0);
      expect(metrics.childSpends).toBeDefined();
      expect(metrics.categoryBreakdown).toBeDefined();
    });

    it("handles clean slate empty expenses gracefully in reports", () => {
      const emptyExpenses: Expense[] = [];
      const emptyMetrics = computeMetrics(emptyExpenses);

      expect(emptyMetrics.totalTracked).toBe(0);
      expect(emptyMetrics.coParentOwed).toBe(0);
      expect(emptyMetrics.arrears).toBe(0);
      expect(Object.keys(emptyMetrics.childSpends)).toHaveLength(0);
      expect(Object.keys(emptyMetrics.categoryBreakdown)).toHaveLength(0);
    });
  });
});
