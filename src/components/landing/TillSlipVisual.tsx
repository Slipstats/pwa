"use client";

import React, { useState } from "react";
import Link from "next/link";
import { calculateReceiptAudit, LineItemAuditInput } from "@/lib/calculations";
import { formatCurrency } from "@/lib/utils";

interface DemoItem {
  id: string;
  name: string;
  category: string;
  amount: number;
  isIncluded: boolean;
  allocationRatio: number;
  reason: string;
}

const INITIAL_DEMO_ITEMS: DemoItem[] = [
  {
    id: "item-1",
    name: "Purity Organic Baby Cereal 200g",
    category: "Nutrition",
    amount: 38.5,
    isIncluded: true,
    allocationRatio: 1.0,
    reason: "Essential child nutrition",
  },
  {
    id: "item-2",
    name: "Pampers Active Baby Diapers Size 4 (68s)",
    category: "Hygiene",
    amount: 249.99,
    isIncluded: true,
    allocationRatio: 1.0,
    reason: "Essential infant hygiene",
  },
  {
    id: "item-3",
    name: "Marmite Spread 250g & Wholewheat Bread",
    category: "Household Groceries",
    amount: 62.0,
    isIncluded: true,
    allocationRatio: 0.5,
    reason: "Shared household food (50% child portion)",
  },
  {
    id: "item-4",
    name: "Nespresso Ispirazione Roma Capsules (10s)",
    category: "Adult Luxury",
    amount: 115.0,
    isIncluded: false,
    allocationRatio: 0.0,
    reason: "Personal adult luxury (excluded from claim)",
  },
  {
    id: "item-5",
    name: "Klipdrift Export Brandy 750ml",
    category: "Alcohol",
    amount: 189.99,
    isIncluded: false,
    allocationRatio: 0.0,
    reason: "Alcoholic beverage (excluded by Maintenance Act)",
  },
  {
    id: "item-6",
    name: "Bic 4-Colour Retractable Pen & Eraser",
    category: "School Supplies",
    amount: 34.5,
    isIncluded: true,
    allocationRatio: 1.0,
    reason: "Grade 2 school stationery",
  },
];

export const TillSlipVisual: React.FC = () => {
  const [items, setItems] = useState<DemoItem[]>(INITIAL_DEMO_ITEMS);
  const splitPercentage = 50;

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextIncluded = !item.isIncluded;
          return {
            ...item,
            isIncluded: nextIncluded,
            allocationRatio: nextIncluded ? (item.category.includes("Shared") ? 0.5 : 1.0) : 0.0,
          };
        }
        return item;
      })
    );
  };

  // Run pure calculations
  const auditInputs: LineItemAuditInput[] = items.map((i) => ({
    line_total: i.amount,
    is_included: i.isIncluded,
    child_allocation_ratio: i.allocationRatio,
  }));

  const audit = calculateReceiptAudit(auditInputs, splitPercentage);

  return (
    <section id="till-slip-audit" className="py-16 md:py-24 bg-surface border-b border-outline-variant/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center flex flex-col gap-3 mb-12">
          <span className="font-label text-xs font-bold text-primary tracking-wider uppercase">
            Forensic Itemization Engine
          </span>
          <h2 className="font-headline font-extrabold text-2xl sm:text-4xl text-on-surface tracking-tight">
            Stop Submitting Raw Grocery Slips.
            <br />
            <span className="text-primary">Exclude Personal Items with One Tap.</span>
          </h2>
          <p className="font-body text-base text-on-surface-variant leading-relaxed">
            South African Maintenance Officers reject full grocery till slips because co-parents
            rightfully dispute adult items (coffee pods, wine, luxury cosmetics). Slipstats lets you
            strike out personal expenses with instant recalculation so your court exhibit cannot be
            thrown out.
          </p>
        </div>

        {/* Interactive Interactive Till Slip Simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Receipt Audit (7 cols) */}
          <div className="lg:col-span-7 bg-surface-container-low rounded-3xl border border-outline-variant/40 p-5 sm:p-7 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-outline-variant/30">
              <div>
                <span className="font-label text-[11px] font-bold text-primary uppercase">
                  Interactive Simulator
                </span>
                <h3 className="font-headline text-lg font-bold text-on-surface">
                  Checkers Hyper Till Slip Audit
                </h3>
              </div>
              <span className="font-label text-xs text-on-surface-variant font-medium">
                Tap checkbox to include or exclude items:
              </span>
            </div>

            {/* List of Line Items */}
            <div className="py-4 flex flex-col gap-2.5">
              {items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer select-none ${
                    item.isIncluded
                      ? "bg-surface-container-lowest border-emerald-500/40 shadow-xs hover:border-emerald-500"
                      : "bg-surface-container-high/60 border-rose-500/30 opacity-70 hover:opacity-90"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      type="button"
                      aria-label={`Toggle ${item.name}`}
                      className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors flex-shrink-0 ${
                        item.isIncluded
                          ? "bg-emerald-600 text-white"
                          : "bg-surface-container-highest text-outline border border-outline-variant"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {item.isIncluded ? "check" : "close"}
                      </span>
                    </button>

                    <div className="min-w-0">
                      <p
                        className={`text-xs font-semibold truncate ${
                          item.isIncluded
                            ? "text-on-surface"
                            : "text-rose-700 line-through decoration-rose-500"
                        }`}
                      >
                        {item.name}
                      </p>
                      <p className="text-[11px] text-on-surface-variant flex items-center gap-2">
                        <span>{item.reason}</span>
                        {item.allocationRatio < 1 && item.isIncluded && (
                          <span className="px-1.5 py-0.2 rounded bg-secondary-fixed text-primary font-bold text-[10px]">
                            {item.allocationRatio * 100}% Shared
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0 ml-3">
                    <p
                      className={`font-bold tabular-nums text-xs ${
                        item.isIncluded ? "text-on-surface" : "text-rose-700"
                      }`}
                    >
                      {formatCurrency(item.amount)}
                    </p>
                    <span
                      className={`text-[10px] font-bold ${
                        item.isIncluded ? "text-emerald-700" : "text-rose-600"
                      }`}
                    >
                      {item.isIncluded ? "Claimable" : "Personal"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => setItems(INITIAL_DEMO_ITEMS)}
                className="text-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">restart_alt</span>
                Reset Sample Till Slip
              </button>
              <span className="text-on-surface-variant font-medium">
                {audit.included_count} included • {audit.excluded_count} excluded
              </span>
            </div>
          </div>

          {/* Right Column: Live Recalculated Summary Card (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/40 p-6 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="font-label text-xs font-bold text-primary uppercase">
                  Real-Time Audit Totals
                </span>
                <span className="material-symbols-outlined text-[20px] text-emerald-600">
                  check_circle
                </span>
              </div>

              <div className="space-y-3 pb-2 border-b border-outline-variant/30 text-xs">
                <div className="flex justify-between text-on-surface-variant">
                  <span>Gross Till Slip Total:</span>
                  <span className="font-semibold tabular-nums text-on-surface">
                    {formatCurrency(audit.gross_slip_total)}
                  </span>
                </div>
                <div className="flex justify-between text-rose-700">
                  <span>Excluded Personal / Luxury:</span>
                  <span className="font-semibold tabular-nums">
                    - {formatCurrency(audit.excluded_personal_total)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-emerald-800 text-sm pt-1 border-t border-outline-variant/20">
                  <span>Child Qualifying Total:</span>
                  <span className="tabular-nums">
                    {formatCurrency(audit.child_qualifying_total)}
                  </span>
                </div>
              </div>

              {/* Co-parent 50% Share Box */}
              <div className="p-4 rounded-2xl bg-primary-fixed/50 border border-primary-fixed-dim/70 flex flex-col gap-1">
                <span className="font-label text-xs font-bold text-primary uppercase">
                  Claimable Co-Parent Share ({splitPercentage}%)
                </span>
                <div className="font-headline text-3xl font-extrabold text-primary tabular-nums">
                  {formatCurrency(audit.co_parent_share)}
                </div>
                <p className="text-[11px] text-on-surface-variant mt-1 leading-snug">
                  Adheres to Section 6 Maintenance Act guidelines. Eliminates disputed personal
                  line items before court submission.
                </p>
              </div>

              {/* Legal Tip Box */}
              <div className="p-3.5 rounded-xl bg-surface-container-high border border-outline-variant/40 text-xs flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-primary flex-shrink-0 mt-0.5">
                  lightbulb
                </span>
                <p className="text-on-surface-variant leading-relaxed text-[11px]">
                  <strong>Rule 6 Best Practice:</strong> Courts have full discretion to reject or deprioritise
                  unquantified submissions containing adult items. Slipstats assists by strictly separating
                  personal adult expenditures from qualifying child needs.
                </p>
              </div>

              <Link
                href="/scan"
                className="w-full h-12 rounded-xl bg-primary hover:bg-primary-container text-white font-headline text-sm font-bold shadow-sm flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">document_scanner</span>
                <span>Scan Your Own Till Slip</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
