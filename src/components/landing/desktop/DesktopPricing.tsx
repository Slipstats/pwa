"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PaystackBadges } from "../shared/PaystackBadges";

export const DesktopPricing: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  const monthlyRate = 129;
  const annualMonthlyRate = 99;
  const annualBillable = annualMonthlyRate * 12; // 1188

  const includedFeatures = [
    {
      title: "AI Till Slip Optical Itemization",
      description: "Line-by-line receipt extraction from Checkers, Woolworths, Pick n Pay, Dis-Chem, and Clicks.",
    },
    {
      title: "Automatic Adult Item Exclusion",
      description: "Strikes out personal adult items (coffee, wine, cosmetics) to protect your good-faith court credibility.",
    },
    {
      title: "Medical Aid Gap Reconciliation",
      description: "Reconciles paediatric invoices against Discovery Health, Bonitas, and GEMS claim statements.",
    },
    {
      title: "Court-Ready Rule 6 Financial Breakdowns",
      description: "Standardized Form 4A & Rule 43 schedules formatted to assist maintenance officers during assessment.",
    },
    {
      title: "ECT Act s15(3) Cryptographic Proof",
      description: "Client-side SHA-256 receipt hashing establishing tamper-evident evidential integrity.",
    },
    {
      title: "Dynamic Settlement Split Accounting",
      description: "Custom ratios (50/50, 60/40) per child beneficiary with running arrears tracking.",
    },
    {
      title: "Section 26 Statement of Account",
      description: "Ongoing debit/credit arrears audit trail of amounts owed versus reimbursements received.",
    },
    {
      title: "Unlimited Till Slips & Children",
      description: "No slip caps or artificial tier restrictions; upload all household receipts freely.",
    },
    {
      title: "100% Offline-First PWA",
      description: "Capture and audit receipts at supermarket checkouts with zero cellular data reception.",
    },
    {
      title: "Priority Concierge & Attorney Export",
      description: "One-click ZIP evidence export for family law practitioners and priority WhatsApp assistance.",
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-surface-container-low/40 border-b border-outline-variant/30">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label text-xs font-bold uppercase tracking-wider mb-3">
            <span className="material-symbols-outlined text-[16px]">payments</span>
            <span>Transparent South African Pricing</span>
          </div>
          <h2 className="font-headline font-extrabold text-3xl sm:text-4xl text-on-surface tracking-tight">
            Fair, Transparent Membership
          </h2>
          <p className="font-body text-base text-on-surface-variant mt-3 leading-relaxed">
            No locked features, no arbitrary slip caps, and no consultation surcharges. Full forensic
            evidentiary tools for less than the cost of a single disputed doctor co-payment.
          </p>
        </div>

        {/* Single Large Pricing Block (Price on Left, Features on Right) */}
        <div className="rounded-3xl bg-surface-container-lowest border-2 border-primary/25 shadow-xl ring-4 ring-primary/5 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Left Column: Plan, Price, Billing Switcher, CTA, Paystack */}
            <div className="lg:col-span-5 p-8 lg:p-10 flex flex-col justify-between bg-surface-container-low/50 border-b lg:border-b-0 lg:border-r border-outline-variant/30">
              <div>
                {/* Plan Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-primary font-label text-xs font-bold uppercase tracking-wider mb-4">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  <span>Court-Ready Full Membership</span>
                </div>

                <h3 className="font-headline font-extrabold text-2xl sm:text-3xl text-on-surface tracking-tight">
                  Slipstats Pro
                </h3>
                <p className="font-body text-xs text-on-surface-variant mt-2 leading-relaxed">
                  Everything you need to substantiate child expenditure for Rule 6 financial assessments.
                </p>

                {/* Billing Interval Toggle (Monthly vs Annual) */}
                <div className="mt-6 p-1.5 rounded-2xl bg-surface-container border border-outline-variant/40 shadow-2xs inline-flex items-center gap-1 w-full max-w-sm">
                  <button
                    type="button"
                    onClick={() => setIsAnnual(false)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                      !isAnnual
                        ? "bg-primary text-white shadow-xs"
                        : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/60"
                    }`}
                  >
                    Monthly (R{monthlyRate})
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAnnual(true)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      isAnnual
                        ? "bg-primary text-white shadow-xs"
                        : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/60"
                    }`}
                  >
                    <span>Annual (R{annualMonthlyRate})</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-emerald-500 text-white font-bold leading-tight">
                      Save 23%
                    </span>
                  </button>
                </div>

                {/* Price Display */}
                <div className="mt-6 pb-6 border-b border-outline-variant/20">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-headline font-extrabold text-4xl sm:text-5xl text-on-surface tabular-nums">
                      R{isAnnual ? annualMonthlyRate : monthlyRate}
                    </span>
                    <span className="font-body text-sm font-semibold text-on-surface-variant">
                      / month
                    </span>
                  </div>
                  <span className="text-xs text-on-surface-variant mt-1.5 block">
                    {isAnnual
                      ? `Billed annually at R${annualBillable.toLocaleString("en-ZA")} / year (Save R360)`
                      : "Billed monthly. Cancel anytime without exit fees or notice periods."}
                  </span>
                </div>
              </div>

              {/* Action Buttons & Paystack Badges */}
              <div className="mt-6 flex flex-col gap-4">
                <Link
                  href="/login"
                  className="w-full min-h-[52px] py-3.5 px-6 rounded-2xl bg-primary hover:bg-primary-container text-white font-headline text-base font-bold shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 transition-all active:scale-95 cursor-pointer group"
                >
                  <span>Sign Up Now</span>
                  <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </Link>

                {/* Interactive Demo Alternative */}
                <div className="text-center">
                  <Link
                    href="/demo"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                  >
                    <span className="material-symbols-outlined text-[16px]">bolt</span>
                    <span>Want to explore first? Test the interactive demo</span>
                  </Link>
                </div>

                {/* Paystack, Capitec Pay & EFT Badges */}
                <div className="pt-4 border-t border-outline-variant/20">
                  <PaystackBadges />
                </div>
              </div>
            </div>

            {/* Right Column: Comprehensive Features Grid */}
            <div className="lg:col-span-7 p-8 lg:p-10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="font-headline font-bold text-lg text-on-surface">
                      Everything Included in Slipstats Pro
                    </h4>
                    <p className="font-body text-xs text-on-surface-variant mt-0.5">
                      Full forensic till slip itemization and statutory compliance engine.
                    </p>
                  </div>
                  <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
                    All-Inclusive
                  </span>
                </div>

                {/* 2-Column Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {includedFeatures.map((feat, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-surface-container-low/50 border border-outline-variant/30 flex items-start gap-3 hover:bg-surface-container transition-colors"
                    >
                      <div className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-[16px]">check</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-headline font-bold text-xs text-on-surface leading-snug">
                          {feat.title}
                        </span>
                        <span className="font-body text-[11px] text-on-surface-variant mt-0.5 leading-relaxed">
                          {feat.description}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Reassurance Banner */}
              <div className="mt-8 pt-5 border-t border-outline-variant/25 flex flex-wrap items-center justify-between gap-3 text-[11px] text-on-surface-variant font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-secondary">verified_user</span>
                  Instant Account Activation
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-secondary">cancel</span>
                  Cancel Online With 1-Click
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-secondary">support_agent</span>
                  South African Support Desk
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
