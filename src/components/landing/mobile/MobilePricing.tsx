"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PaystackBadges } from "../shared/PaystackBadges";

export const MobilePricing: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  const monthlyRate = 129;
  const annualMonthlyRate = 99;
  const annualBillable = annualMonthlyRate * 12; // 1188

  const features = [
    "Unlimited till slips & child profiles",
    "AI OCR itemization (Checkers, Woolies, PnP, Dis-Chem)",
    "Automatic adult personal grocery exclusion",
    "Medical aid gap reconciliation & co-payment recovery",
    "Court-ready Form 4A & Rule 6 PDF exhibit bundle",
    "SHA-256 cryptographic timestamps under ECT Act s15",
    "Dynamic per-child split ratio accounting",
    "Section 26 ongoing arrears statement of account",
    "100% offline-first camera scanning (no data needed)",
    "Priority WhatsApp & attorney ZIP evidence export",
  ];

  return (
    <section id="mobile-pricing" className="py-14 bg-surface-container-low/40 border-b border-outline-variant/30">
      <div className="px-4 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <span className="self-start font-label text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container">
            South African Pricing
          </span>
          <h2 className="font-headline font-extrabold text-2xl text-on-surface tracking-tight">
            Fair, Transparent Membership
          </h2>
          <p className="font-body text-xs text-on-surface-variant leading-relaxed">
            All features included. No locked tools, no slip limits.
          </p>
        </div>

        {/* Single Large Mobile Pricing Card */}
        <div className="rounded-3xl bg-surface-container-lowest border-2 border-primary/25 shadow-xl p-5 flex flex-col gap-5">
          {/* Plan Header */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-label text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-primary-fixed text-primary uppercase tracking-wider">
                Full Membership
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                All-Inclusive
              </span>
            </div>
            <h3 className="font-headline font-extrabold text-xl text-on-surface">
              Slipstats Pro
            </h3>
            <p className="font-body text-xs text-on-surface-variant leading-relaxed">
              Complete till slip itemization and court-ready exhibits for Rule 6 financial assessments.
            </p>
          </div>

          {/* Billing Switcher (Monthly vs Annual) */}
          <div className="p-1 rounded-2xl bg-surface-container border border-outline-variant/40 flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsAnnual(false)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all text-center ${
                !isAnnual
                  ? "bg-primary text-white shadow-xs"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Monthly (R{monthlyRate})
            </button>
            <button
              type="button"
              onClick={() => setIsAnnual(true)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                isAnnual
                  ? "bg-primary text-white shadow-xs"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span>Annual (R{annualMonthlyRate})</span>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-emerald-500 text-white font-bold leading-none">
                -23%
              </span>
            </button>
          </div>

          {/* Price Display */}
          <div className="p-4 rounded-2xl bg-surface-container-low/60 border border-outline-variant/30 flex flex-col gap-1">
            <div className="flex items-baseline gap-1">
              <span className="font-headline font-extrabold text-3xl text-on-surface tabular-nums">
                R{isAnnual ? annualMonthlyRate : monthlyRate}
              </span>
              <span className="font-body text-xs text-on-surface-variant font-semibold">
                / month
              </span>
            </div>
            <span className="text-[11px] text-on-surface-variant">
              {isAnnual
                ? `Billed annually at R${annualBillable.toLocaleString("en-ZA")} / yr (Save R360)`
                : "Billed monthly. Cancel anytime online."}
            </span>
          </div>

          {/* Primary CTA Button */}
          <Link
            href="/login"
            className="w-full h-12 rounded-xl bg-primary hover:bg-primary-container text-white font-headline text-sm font-bold shadow-md flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
          >
            <span>Sign Up Now</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>

          {/* Interactive Demo Link */}
          <div className="text-center">
            <Link
              href="/demo"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary"
            >
              <span className="material-symbols-outlined text-[15px]">bolt</span>
              <span>Want to test first? Try the interactive demo</span>
            </Link>
          </div>

          {/* Paystack, Capitec Pay & EFT Badges */}
          <div className="pt-3 border-t border-outline-variant/25">
            <PaystackBadges />
          </div>

          {/* Features List */}
          <div className="pt-3 border-t border-outline-variant/25 flex flex-col gap-2.5">
            <span className="font-label text-[10px] font-bold text-on-surface uppercase tracking-wider">
              Included in your membership:
            </span>
            <div className="flex flex-col gap-2">
              {features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-on-surface leading-tight">
                  <span className="material-symbols-outlined text-[16px] text-emerald-700 shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer guarantees */}
          <div className="pt-2 border-t border-outline-variant/20 flex flex-col gap-1 text-[10px] text-on-surface-variant">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-secondary">verified_user</span>
              <span>Instant activation • SARB &amp; PASA compliant</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-secondary">cancel</span>
              <span>Cancel online anytime without notice</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
