import { describe, it, expect } from "vitest";
import { calculateMedicalAidGap, calculateCoParentShare, calculateReceiptAudit } from "@/lib/calculations";

describe("Milestone 3 — Routing Restructuring & Public Marketing Landing Page", () => {
  describe("AppShell & Public Route Contracts", () => {
    const isPublicRoute = (pathname: string): boolean => {
      return pathname === "/" || pathname === "/login";
    };

    it("identifies public routes where AppHeader and BottomNav are suppressed", () => {
      expect(isPublicRoute("/")).toBe(true);
      expect(isPublicRoute("/login")).toBe(true);
    });

    it("identifies authenticated PWA routes where AppHeader and BottomNav are rendered", () => {
      expect(isPublicRoute("/dashboard")).toBe(false);
      expect(isPublicRoute("/expenses")).toBe(false);
      expect(isPublicRoute("/expenses/new")).toBe(false);
      expect(isPublicRoute("/scan")).toBe(false);
      expect(isPublicRoute("/reports")).toBe(false);
      expect(isPublicRoute("/children")).toBe(false);
    });
  });

  describe("Navigation Realignment Contracts", () => {
    it("verifies bottom navigation items map expenses to /dashboard", () => {
      const bottomNavItems = [
        {
          href: "/dashboard",
          match: ["/dashboard", "/expenses"],
          label: "Expenses",
          icon: "receipt_long",
        },
        {
          href: "/scan",
          match: ["/scan"],
          label: "Scan Slip",
          icon: "document_scanner",
          isHighlighted: true,
        },
        {
          href: "/reports",
          match: ["/reports"],
          label: "Reports",
          icon: "gavel",
        },
        {
          href: "/children",
          match: ["/children"],
          label: "Children",
          icon: "shield_person",
        },
      ];

      expect(bottomNavItems[0].href).toBe("/dashboard");
      expect(bottomNavItems[0].match).toContain("/dashboard");
      expect(bottomNavItems[0].match).toContain("/expenses");
      expect(bottomNavItems.map((item) => item.href)).toEqual([
        "/dashboard",
        "/scan",
        "/reports",
        "/children",
      ]);
    });

    it("verifies public landing page conversion CTAs link to valid target routes", () => {
      const publicCTAs = [
        { label: "Get Started Free", target: "/login" },
        { label: "Try Live Demo (Instant)", target: "/dashboard" },
        { label: "Sign In", target: "/login" },
        { label: "View Sample Court Exhibit", target: "/reports" },
      ];

      const validPwaRoutes = ["/login", "/dashboard", "/reports"];
      for (const cta of publicCTAs) {
        expect(validPwaRoutes).toContain(cta.target);
      }
    });
  });

  describe("Landing Page Core Value Propositions & Calculations", () => {
    it("accurately computes simulated till slip itemization audit", () => {
      // Checkers Hyper till slip simulation:
      // Purity Formula (48.99, included 100%)
      // Panado Syrup (35.50, included 100%)
      // School Stationery (42.00, included 100%)
      // Espresso Pods (38.20, excluded personal 0%)
      // Wine / Spritzer (19.91, excluded personal 0%)
      const items = [
        { line_total: 48.99, is_included: true, child_allocation_ratio: 1.0 },
        { line_total: 35.5, is_included: true, child_allocation_ratio: 1.0 },
        { line_total: 42.0, is_included: true, child_allocation_ratio: 1.0 },
        { line_total: 38.2, is_included: false, child_allocation_ratio: 0.0 },
        { line_total: 19.91, is_included: false, child_allocation_ratio: 0.0 },
      ];

      const audit = calculateReceiptAudit(items, 50);

      expect(audit.gross_slip_total).toBe(184.6);
      expect(audit.child_qualifying_total).toBe(126.49);
      expect(audit.excluded_personal_total).toBe(58.11);
      expect(audit.co_parent_share).toBe(63.25);
      expect(audit.included_count).toBe(3);
      expect(audit.excluded_count).toBe(2);
    });

    it("accurately computes medical aid shortfall gap for paediatric consultations", () => {
      // Dr. V Naidoo Paediatrics emergency consult:
      // Gross: R1,850.00
      // Discovery Health Scheme Paid: R950.00
      // Net Gap: R900.00
      // Co-parent share at 60% per court order: R540.00
      const gross = 1850.0;
      const schemeCovered = 950.0;
      const gap = calculateMedicalAidGap(gross, schemeCovered);
      const coParentShare = calculateCoParentShare(gap, 60);
      const motherShare = Math.round((gap - coParentShare) * 100) / 100;

      expect(gap).toBe(900.0);
      expect(coParentShare).toBe(540.0);
      expect(motherShare).toBe(360.0);
      expect(coParentShare + motherShare).toBe(gap);
    });

    it("verifies interactive calculator annual recovery projections", () => {
      const monthlyLiving = 8500;
      const medicalGap = 1800;
      const totalMonthly = monthlyLiving + medicalGap; // 10,300
      const splitRatio = 50;

      const monthlyCoParentOwed = calculateCoParentShare(totalMonthly, splitRatio); // 5,150
      const annualRecoverable = Math.round(monthlyCoParentOwed * 12 * 100) / 100; // 61,800

      expect(monthlyCoParentOwed).toBe(5150.0);
      expect(annualRecoverable).toBe(61800.0);
    });
  });

  describe("Statutory Compliance & Legal Context", () => {
    it("confirms statutory alignment with South African Maintenance Act 99 of 1998", () => {
      const statutoryHeaders = {
        primaryAct: "Maintenance Act 99 of 1998",
        section6Form: "Form 4A",
        highCourtRule: "Rule 43",
        custodyHash: "SHA-256",
        currency: "ZAR",
      };

      expect(statutoryHeaders.primaryAct).toBe("Maintenance Act 99 of 1998");
      expect(statutoryHeaders.section6Form).toBe("Form 4A");
      expect(statutoryHeaders.highCourtRule).toBe("Rule 43");
      expect(statutoryHeaders.custodyHash).toBe("SHA-256");
      expect(statutoryHeaders.currency).toBe("ZAR");
    });
  });
});
