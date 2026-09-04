import React from "react";
import Link from "next/link";
import { HeroBalanceCard } from "@/components/dashboard/HeroBalanceCard";
import { ChildSpendCard } from "@/components/dashboard/ChildSpendCard";
import { CategoryChart } from "@/components/dashboard/CategoryChart";
import { ExpenseList } from "@/components/dashboard/ExpenseList";
import { MOCK_EXPENSES } from "@/lib/data/mockData";

export default function DashboardPage() {
  return (
    <div className="flex flex-col w-full gap-space-md pt-2 pb-6">
      {/* Responsive Grid: Single Column on Mobile, Split 2-Column on Desktop (lg:) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md lg:gap-6 items-start">
        {/* Left Column: Hero Balance, Child Spend, Legal Guarantee */}
        <div className="lg:col-span-7 flex flex-col gap-space-md">
          {/* 1. Hero Balance & Apportionment Summary */}
          <HeroBalanceCard
            month="October 2024"
            totalTracked={2845.5}
            slipCount={14}
            coParentOwed={1422.75}
            splitPercentage={50}
          />

          {/* 2. Beneficiaries Spend Allocation (Liam & Maya) */}
          <ChildSpendCard />

          {/* 3. Legal Integrity & Tamper-Proof Guarantee Box */}
          <div className="p-space-md rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm flex items-start gap-space-xs">
            <div className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center text-primary flex-shrink-0">
              <span className="material-symbols-outlined text-[18px]">lock</span>
            </div>
            <div className="min-w-0">
              <h5 className="font-title text-title-md text-on-surface font-semibold">
                Tamper-Proof Legal Ledger
              </h5>
              <p className="font-body text-body-sm text-on-surface-variant mt-0.5 leading-relaxed">
                Receipt images are cryptographically hashed (SHA-256). All recorded slips preserve
                statutory timestamps admissible in Maintenance Court Form 4A & Rule 43 arbitrations.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Category Proportion Visualizer & Expense Feed */}
        <div className="lg:col-span-5 flex flex-col gap-space-md">
          {/* 4. Category Share Visualizer */}
          <CategoryChart />

          {/* 5. Filterable Recent Expenses Feed */}
          <ExpenseList expenses={MOCK_EXPENSES} />
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
