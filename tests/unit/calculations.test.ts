import { describe, it, expect } from "vitest";
import {
  calculateMedicalAidGap,
  calculateCoParentShare,
  calculateLineItemPortion,
  calculateReceiptAudit,
  calculateOutstandingArrears,
  roundToTwo,
  LineItemAuditInput,
} from "@/lib/calculations";
import { MOCK_SLIP_ITEMS } from "@/lib/data/mockData";

describe("Core Calculations — Maintenance Act 99 of 1998 & Rule 43 Compliance", () => {
  describe("roundToTwo helper", () => {
    it("rounds numbers accurately to 2 decimal places", () => {
      expect(roundToTwo(10.555)).toBe(10.56);
      expect(roundToTwo(10.554)).toBe(10.55);
      expect(roundToTwo(0)).toBe(0);
      expect(roundToTwo(184.60000000000002)).toBe(184.6);
      expect(roundToTwo(0.1 + 0.2)).toBe(0.3);
    });

    it("handles invalid or non-numeric inputs safely", () => {
      expect(roundToTwo(NaN)).toBe(0);
      expect(roundToTwo(Infinity)).toBe(0);
      expect(roundToTwo(-Infinity)).toBe(0);
    });
  });

  describe("calculateMedicalAidGap", () => {
    it("calculates exact medical aid shortfall when covered is less than gross", () => {
      // Dr. Naidoo consult: Gross R850.00 - Medical Aid R500.00 = R350.00 net claimable
      expect(calculateMedicalAidGap(850.0, 500.0)).toBe(350.0);
    });

    it("returns R0.00 when medical aid covers 100% of the cost", () => {
      expect(calculateMedicalAidGap(450.0, 450.0)).toBe(0.0);
    });

    it("returns R0.00 when medical aid coverage exceeds gross amount (boundary)", () => {
      expect(calculateMedicalAidGap(200.0, 250.0)).toBe(0.0);
    });

    it("returns full gross amount when medical aid coverage is zero (private prescription)", () => {
      // Clicks Pharmacy inhaler: R64.50 gross with R0 medical aid
      expect(calculateMedicalAidGap(64.5, 0.0)).toBe(64.5);
    });

    it("handles floating-point decimal precision without drift", () => {
      // R129.99 - R75.50 = R54.49
      expect(calculateMedicalAidGap(129.99, 75.5)).toBe(54.49);
      expect(calculateMedicalAidGap(199.99, 99.95)).toBe(100.04);
    });

    it("handles zero and negative boundary inputs safely", () => {
      expect(calculateMedicalAidGap(0, 0)).toBe(0);
      expect(calculateMedicalAidGap(-50, 20)).toBe(0);
      expect(calculateMedicalAidGap(100, -20)).toBe(120);
    });
  });

  describe("calculateCoParentShare", () => {
    it("calculates standard 50% split correctly", () => {
      // R350.00 @ 50% = R175.00
      expect(calculateCoParentShare(350.0, 50)).toBe(175.0);
      // R141.80 @ 50% = R70.90
      expect(calculateCoParentShare(141.8, 50)).toBe(70.9);
    });

    it("calculates statutory 60% fuel / transport split correctly", () => {
      // R1,200.00 @ 60% = R720.00
      expect(calculateCoParentShare(1200.0, 60)).toBe(720.0);
      // R75.00 @ 60% = R45.00 (from MOCK_EXPENSES exp-04)
      expect(calculateCoParentShare(75.0, 60)).toBe(45.0);
    });

    it("calculates 70% exceptional extramural split correctly", () => {
      // R850.00 @ 70% = R595.00
      expect(calculateCoParentShare(850.0, 70)).toBe(595.0);
    });

    it("calculates 100% sole parental liability split correctly", () => {
      expect(calculateCoParentShare(64.5, 100)).toBe(64.5);
    });

    it("returns R0.00 for 0% split ratio or excluded categories", () => {
      expect(calculateCoParentShare(500.0, 0)).toBe(0.0);
    });

    it("handles non-standard split percentages and fractional cents", () => {
      // R100.00 @ 33.33% = R33.33
      expect(calculateCoParentShare(100.0, 33.33)).toBe(33.33);
      // R145.27 @ 50% = R72.635 -> R72.64
      expect(calculateCoParentShare(145.27, 50)).toBe(72.64);
    });

    it("returns R0.00 for negative or zero amounts", () => {
      expect(calculateCoParentShare(0, 50)).toBe(0);
      expect(calculateCoParentShare(-100, 50)).toBe(0);
      expect(calculateCoParentShare(100, -50)).toBe(0);
    });
  });

  describe("calculateLineItemPortion", () => {
    it("returns full line total when included at 100% (ratio 1.0)", () => {
      const item: LineItemAuditInput = {
        line_total: 34.99,
        is_included: true,
        child_allocation_ratio: 1.0,
      };
      expect(calculateLineItemPortion(item)).toBe(34.99);
    });

    it("defaults to ratio 1.0 when child_allocation_ratio is omitted", () => {
      const item: LineItemAuditInput = {
        line_total: 48.5,
        is_included: true,
      };
      expect(calculateLineItemPortion(item)).toBe(48.5);
    });

    it("calculates partial allocation ratio (e.g. 70% shared household items)", () => {
      const item: LineItemAuditInput = {
        line_total: 42.0,
        is_included: true,
        child_allocation_ratio: 0.7,
      };
      expect(calculateLineItemPortion(item)).toBe(29.4);
    });

    it("calculates partial allocation ratio at 50% (ratio 0.5)", () => {
      const item: LineItemAuditInput = {
        line_total: 50.0,
        is_included: true,
        child_allocation_ratio: 0.5,
      };
      expect(calculateLineItemPortion(item)).toBe(25.0);
    });

    it("returns R0.00 for excluded personal items regardless of ratio", () => {
      const item: LineItemAuditInput = {
        line_total: 18.2,
        is_included: false,
        child_allocation_ratio: 1.0,
      };
      expect(calculateLineItemPortion(item)).toBe(0.0);
    });

    it("handles zero, negative, or invalid line totals and ratios", () => {
      expect(calculateLineItemPortion({ line_total: 0, is_included: true })).toBe(0);
      expect(calculateLineItemPortion({ line_total: -20, is_included: true, child_allocation_ratio: 1.0 })).toBe(0);
      expect(calculateLineItemPortion({ line_total: 50, is_included: true, child_allocation_ratio: 0 })).toBe(0);
      expect(calculateLineItemPortion({ line_total: 50, is_included: true, child_allocation_ratio: -0.5 })).toBe(0);
    });
  });

  describe("calculateReceiptAudit with Checkers Hyper Sandton Seed Items", () => {
    it("correctly audits MOCK_SLIP_ITEMS seed data", () => {
      const audit = calculateReceiptAudit(MOCK_SLIP_ITEMS, 50);

      // Gross slip total: 34.99 + 48.50 + 4.90 + 24.01 + 18.20 + 12.00 + 42.00 = 184.60
      expect(audit.gross_slip_total).toBe(184.6);

      // Child qualifying total: 34.99 + 48.50 + 4.90 + 24.01 + (42.00 * 0.7 = 29.40) = 141.80
      expect(audit.child_qualifying_total).toBe(141.8);

      // Excluded personal total: 184.60 - 141.80 = 42.80 (18.20 + 12.00 + 12.60 non-child portion of milk)
      expect(audit.excluded_personal_total).toBe(42.8);

      // Co-parent share @ 50%: 141.80 * 0.5 = 70.90
      expect(audit.co_parent_share).toBe(70.9);

      // Counts
      expect(audit.included_count).toBe(5);
      expect(audit.excluded_count).toBe(2);
    });

    it("handles dynamic item inclusion toggling (e.g. including espresso beans)", () => {
      // Clone items and toggle Espresso Beans (18.20) to included with ratio 1.0
      const modifiedItems: LineItemAuditInput[] = MOCK_SLIP_ITEMS.map((item) => {
        if (item.id === "slip-item-5") {
          return { ...item, is_included: true, child_allocation_ratio: 1.0 };
        }
        return item;
      });

      const audit = calculateReceiptAudit(modifiedItems, 50);

      expect(audit.gross_slip_total).toBe(184.6);
      // Previous 141.80 + 18.20 = 160.00
      expect(audit.child_qualifying_total).toBe(160.0);
      // Excluded: 184.60 - 160.00 = 24.60
      expect(audit.excluded_personal_total).toBe(24.6);
      // Co-parent share @ 50%: 160.00 * 0.5 = 80.00
      expect(audit.co_parent_share).toBe(80.0);
      expect(audit.included_count).toBe(6);
      expect(audit.excluded_count).toBe(1);
    });

    it("handles an empty items array cleanly", () => {
      const audit = calculateReceiptAudit([]);
      expect(audit.gross_slip_total).toBe(0);
      expect(audit.child_qualifying_total).toBe(0);
      expect(audit.excluded_personal_total).toBe(0);
      expect(audit.co_parent_share).toBe(0);
      expect(audit.included_count).toBe(0);
      expect(audit.excluded_count).toBe(0);
    });

    it("handles all items being excluded", () => {
      const allExcluded: LineItemAuditInput[] = [
        { line_total: 100, is_included: false },
        { line_total: 200, is_included: false },
      ];
      const audit = calculateReceiptAudit(allExcluded, 50);
      expect(audit.gross_slip_total).toBe(300);
      expect(audit.child_qualifying_total).toBe(0);
      expect(audit.excluded_personal_total).toBe(300);
      expect(audit.co_parent_share).toBe(0);
      expect(audit.included_count).toBe(0);
      expect(audit.excluded_count).toBe(2);
    });

    it("handles all items being included with 100% allocation", () => {
      const allIncluded: LineItemAuditInput[] = [
        { line_total: 150.5, is_included: true, child_allocation_ratio: 1.0 },
        { line_total: 49.5, is_included: true, child_allocation_ratio: 1.0 },
      ];
      const audit = calculateReceiptAudit(allIncluded, 60);
      expect(audit.gross_slip_total).toBe(200);
      expect(audit.child_qualifying_total).toBe(200);
      expect(audit.excluded_personal_total).toBe(0);
      expect(audit.co_parent_share).toBe(120); // 200 * 0.60
      expect(audit.included_count).toBe(2);
      expect(audit.excluded_count).toBe(0);
    });
  });

  describe("calculateOutstandingArrears", () => {
    it("calculates outstanding arrears accurately", () => {
      // Total owed R1422.75 - Settled R475.00 = R947.75 (from MOCK_COURT_BUNDLE)
      expect(calculateOutstandingArrears(1422.75, 475.0)).toBe(947.75);
    });

    it("returns R0.00 when fully settled", () => {
      expect(calculateOutstandingArrears(500.0, 500.0)).toBe(0.0);
    });

    it("returns R0.00 when overpaid (settled exceeds owed)", () => {
      expect(calculateOutstandingArrears(400.0, 600.0)).toBe(0.0);
    });

    it("handles decimal precision in arrears calculation", () => {
      expect(calculateOutstandingArrears(1250.35, 416.78)).toBe(833.57);
    });

    it("handles zero and negative inputs safely", () => {
      expect(calculateOutstandingArrears(0, 0)).toBe(0);
      expect(calculateOutstandingArrears(-100, 50)).toBe(0);
    });
  });
});
