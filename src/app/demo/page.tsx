"use client";

import React from "react";
import Link from "next/link";
import { HeroBalanceCard } from "@/components/dashboard/HeroBalanceCard";
import { ChildSpendCard, ChildCardItem } from "@/components/dashboard/ChildSpendCard";
import { CategoryChart, CategoryShareItem } from "@/components/dashboard/CategoryChart";
import { ExpenseList } from "@/components/dashboard/ExpenseList";
import { DemoModeBanner } from "@/components/layout/DemoModeBanner";
import { useLedger } from "@/context/LedgerContext";

const CATEGORY_COLORS: Record<string, string> = {
  "School & Education": "bg-primary",
  "Medical Aid / Doctor": "bg-secondary",
  "Nutrition & Hygiene": "bg-tertiary-container",
  "Fuel / Transport": "bg-primary-fixed-dim",
  "Rent / Child Room": "bg-secondary-fixed",
  "Extramural / Sports": "bg-tertiary-fixed",
  "Clothing & Essentials": "bg-outline",
  Other: "bg-outline-variant",
};

export default function DemoPage() {
  const { expenses, children, agreement, metrics, activeChildId } = useLedger();

  const displayedExpenses = activeChildId
    ? expenses.filter((e) => {
        if (e.child_id === activeChildId) return true;
        const childObj = children.find((c) => c.id === activeChildId);
        if (childObj && e.child_name && e.child_name.toLowerCase().includes(childObj.first_name.toLowerCase())) {
          return true;
        }
        return false;
      })
    : expenses;

  const currentMonth = new Date().toLocaleDateString("en-ZA", {
    month: "long",
    year: "numeric",
  });

  // Transform children and metrics into ChildCardItem list
  const childCards: ChildCardItem[] = children.map((child, idx) => {
    const total = metrics.childSpends[child.id] || metrics.childSpends[child.first_name] || 0;
    const splitRatio =
      child.default_split_ratio ?? agreement?.category_split_rules?.default ?? 50;
    const coParentShare = Math.round(((total * splitRatio) / 100) * 100) / 100;

    return {
      id: child.id,
      name: child.first_name,
      meta: child.age_display || `${child.first_name} ${child.last_name || ""}`,
      total,
      coParentShare,
      description: child.notes || "Recorded expenses and audited till slip items",
      avatar:
        child.avatar_url ||
        (idx === 0
          ? "https://lh3.googleusercontent.com/aida-public/AB6AXuDV4Z1uMBbUw8xJc-Gnuy9IP1DrvyQRRLkN43RMhpnp6M7iIpg6UvYMzc-0sQ6albpPdQYsGpGrKJydKbd1bcv_eOmyhWc1221BvrlOAMhhxWyuYyF51Gndbnmzmv2Xu8V-h8N4kkKLse95GST3V0hK_yBHbS9NubuB9XdnIWtx1ncd_yB6oaIXXQ5vufSxekKEPwY26Agh50vJuyO5fdOHQ0KhtJAGKossL-pgfobaUTxJ-ia7hOhNxw"
          : "https://lh3.googleusercontent.com/aida-public/AB6AXuBM7gJ34RP-Ddp9XI1q8kj8MHT-uqz0iWZm54NSLj5uVjxyYIAdlBhck6G5KBtD1umxIQ-UNJ5EWaEEHB2Xbvf1ChbwGr29qEYerrTNrsYA7fEaPQ5x-BGMRG440G4iiVPGPpVB_7p-uXna2ep-kLkSOvR9mWxnqCKhT8RiZ03hNkVam28vbFPJFxjqb8fWH_ETdubdLiwAu55s1zb_VRhkYRUGORa_OusWaxcfbSNceLwLhcFK8KJnKw"),
      badgeColor: idx % 2 === 0 ? "bg-primary-fixed" : "bg-tertiary-fixed",
    };
  });

  // Transform categoryBreakdown into CategoryShareItem list
  const categoryKeys = Object.keys(metrics.categoryBreakdown);
  const totalAmount = metrics.totalTracked > 0 ? metrics.totalTracked : 1;
  const categories: CategoryShareItem[] = categoryKeys.map((name) => {
    const amount = metrics.categoryBreakdown[name] || 0;
    const percentage = Math.round((amount / totalAmount) * 100);
    return {
      name,
      percentage,
      color: CATEGORY_COLORS[name] || "bg-outline-variant",
    };
  });

  return (
    <div className="flex flex-col w-full gap-space-md pt-2 pb-6">
      {/* Demo Mode Notice Banner */}
      <DemoModeBanner />

      {/* Responsive Grid: Single Column on Mobile, Split 2-Column on Desktop (lg:) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md lg:gap-6 items-start">
        {/* Left Column: Hero Balance, Child Spend, Legal Guarantee */}
        <div className="lg:col-span-7 flex flex-col gap-space-md">
          {/* 1. Hero Balance & Apportionment Summary */}
          <HeroBalanceCard
            month={currentMonth}
            totalTracked={metrics.totalTracked}
            slipCount={expenses.length}
            coParentOwed={metrics.coParentOwed}
            splitPercentage={agreement?.category_split_rules?.default ?? 50}
          />

          {/* 2. Beneficiaries Spend Allocation */}
          {children.length > 0 ? (
            <ChildSpendCard cards={childCards} />
          ) : (
            <div className="p-space-md rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-col items-center text-center gap-2">
              <span className="material-symbols-outlined text-3xl text-primary">family_restroom</span>
              <p className="font-semibold text-sm text-on-surface">No Children Added Yet</p>
              <p className="text-xs text-on-surface-variant max-w-sm">
                Add your children to begin allocating till slips and tracking individual maintenance
                split obligations.
              </p>
              <Link
                href="/children"
                className="mt-1 px-4 py-1.5 rounded-xl bg-primary text-white text-xs font-semibold shadow-xs hover:bg-primary/90 transition-colors"
              >
                + Add Beneficiary
              </Link>
            </div>
          )}

          {/* 3. Legal Integrity & Tamper-Proof Guarantee Box */}
          <div className="p-space-md rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm flex items-start gap-space-xs">
            <div className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center text-primary flex-shrink-0">
              <span className="material-symbols-outlined text-[18px]">lock</span>
            </div>
            <div className="min-w-0">
              <h5 className="font-title text-title-md text-on-surface font-semibold">
                Tamper-Proof Legal Ledger (Demo Mode)
              </h5>
              <p className="font-body text-body-sm text-on-surface-variant mt-0.5 leading-relaxed">
                Receipt images are cryptographically hashed (SHA-256). All recorded slips preserve
                statutory timestamps admissible in Maintenance Court Form 4A &amp; Rule 43 arbitrations.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Category Proportion Visualizer & Expense Feed */}
        <div className="lg:col-span-5 flex flex-col gap-space-md">
          {/* 4. Category Share Visualizer */}
          <CategoryChart categories={categories} />

          {/* 5. Filterable Recent Expenses Feed */}
          <ExpenseList expenses={displayedExpenses} />
        </div>
      </div>

      {/* Floating Action Controls (Mobile Only) */}
      <div className="md:hidden fixed right-4 bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px)+1rem)] z-40 flex flex-col items-end gap-2">
        <Link
          href="/expenses/new"
          className="h-10 px-3.5 rounded-full bg-surface-container-highest text-on-surface shadow-md flex items-center gap-1.5 active:scale-95 transition-all text-xs font-semibold hover:bg-surface-variant border border-outline-variant/40"
        >
          <span className="material-symbols-outlined text-[16px]">edit</span>
          Manual Entry
        </Link>
        <Link
          href="/scan"
          className="h-14 px-5 rounded-2xl bg-primary-container text-white shadow-xl flex items-center gap-2.5 active:scale-95 transition-all hover:bg-primary"
        >
          <span className="material-symbols-outlined text-[24px]">document_scanner</span>
          <span className="font-label text-label-lg font-bold tracking-tight">
            + Scan Till Slip
          </span>
        </Link>
      </div>
    </div>
  );
}
