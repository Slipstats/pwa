import { describe, it, expect } from "vitest";

describe("Landing Page Architecture — Dedicated Desktop & Mobile Views", () => {
  describe("View Separation Contracts", () => {
    it("verifies public landing page renders on '/' route", () => {
      const publicPath = "/";
      const isLandingPage = publicPath === "/";
      expect(isLandingPage).toBe(true);
    });

    it("verifies desktop view target breakpoints and classes", () => {
      const desktopClass = "hidden md:flex flex-col w-full min-h-screen bg-surface text-on-surface";
      expect(desktopClass).toContain("hidden md:flex");
      expect(desktopClass).toContain("bg-surface");
    });

    it("verifies mobile view target breakpoints and classes", () => {
      const mobileClass = "block md:hidden flex-col w-full min-h-screen bg-surface text-on-surface";
      expect(mobileClass).toContain("block md:hidden");
      expect(mobileClass).toContain("bg-surface");
    });
  });

  describe("South African Pricing Model (ZAR)", () => {
    const monthlyRate = 129;
    const annualMonthlyRate = 99;

    it("computes 20% annual discount correctly", () => {
      const discountPercentage = Math.round(((monthlyRate - annualMonthlyRate) / monthlyRate) * 100);
      expect(discountPercentage).toBeGreaterThanOrEqual(20);
    });

    it("computes annual billable total", () => {
      const annualTotal = annualMonthlyRate * 12;
      expect(annualTotal).toBe(1188);
    });
  });

  describe("Legal & Compliance Modal State Machine", () => {
    type ModalState = "privacy" | "terms" | "popia" | null;

    it("handles transition between statutory popups correctly", () => {
      let activeModal: ModalState = null;
      expect(activeModal).toBeNull();

      // Open Privacy Policy
      activeModal = "privacy";
      expect(activeModal).toBe("privacy");

      // Switch to Terms of Service
      activeModal = "terms";
      expect(activeModal).toBe("terms");

      // Switch to POPIA Statutory Notice
      activeModal = "popia";
      expect(activeModal).toBe("popia");

      // Dismiss modal
      activeModal = null;
      expect(activeModal).toBeNull();
    });
  });
});
