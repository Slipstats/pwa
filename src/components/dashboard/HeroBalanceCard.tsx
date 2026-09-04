import React from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

interface HeroBalanceCardProps {
  month?: string;
  totalTracked?: number;
  slipCount?: number;
  coParentOwed?: number;
  splitPercentage?: number;
}

export const HeroBalanceCard: React.FC<HeroBalanceCardProps> = ({
  month = "October 2024",
  totalTracked = 2845.5,
  slipCount = 14,
  coParentOwed = 1422.75,
  splitPercentage = 50,
}) => {
  return (
    <div className="flex flex-col gap-space-xs">
      {/* Reassuring Greeting & Status Indicator */}
      <div className="flex items-center justify-between px-space-2xs">
        <div className="flex items-center gap-space-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse"></span>
          <span className="font-label text-label-md text-on-surface-variant font-medium">
            Court-Grade Audit Trail Active
          </span>
        </div>
        <span className="font-label text-label-sm text-primary font-semibold bg-primary-fixed px-2.5 py-0.5 rounded-xl border border-primary-fixed-dim/50">
          {month}
        </span>
      </div>

      {/* Hero Summary Card */}
      <div className="relative overflow-hidden rounded-2xl bg-surface-container-low p-space-md border border-outline-variant/30 shadow-sm">
        <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-secondary-container/25 pointer-events-none blur-2xl"></div>
        <div className="absolute right-4 bottom-3 opacity-10 pointer-events-none">
          <span className="material-symbols-outlined text-[80px] text-primary">verified_user</span>
        </div>

        <div className="relative z-10 flex flex-col gap-space-sm">
          <div className="flex items-start justify-between gap-space-xs">
            <div>
              <span className="font-label text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                Shared Ledger Balance
              </span>
              <h2 className="font-headline text-headline-md text-primary mt-0.5 font-bold">
                {month.split(" ")[0]} Child Expenses
              </h2>
            </div>
            <span className="inline-flex items-center gap-1 font-label text-label-sm px-2.5 py-1 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed font-semibold">
              <span className="material-symbols-outlined text-[14px]">schedule</span>
              Pending Reimbursement
            </span>
          </div>

          {/* Financial Split Breakdown Grid */}
          <div className="grid grid-cols-2 gap-space-sm mt-1">
            <div className="p-space-sm rounded-xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm">
              <div className="flex items-center gap-1 text-on-surface-variant mb-1">
                <span className="material-symbols-outlined text-[15px] text-primary">receipt_long</span>
                <span className="font-label text-label-sm font-medium">Total Tracked</span>
              </div>
              <div className="font-currency text-currency-lg text-on-surface font-bold tracking-tight">
                {formatCurrency(totalTracked)}
              </div>
              <span className="font-label text-label-sm text-secondary font-medium mt-0.5 block">
                {slipCount} verified slips
              </span>
            </div>

            <div className="p-space-sm rounded-xl bg-secondary-fixed/45 border border-secondary-fixed-dim/60">
              <div className="flex items-center gap-1 text-on-secondary-fixed-variant mb-1">
                <span className="material-symbols-outlined text-[15px] text-secondary">balance</span>
                <span className="font-label text-label-sm font-semibold">
                  Co-Parent Owes ({splitPercentage}%)
                </span>
              </div>
              <div className="font-currency text-currency-lg text-primary font-bold tracking-tight">
                {formatCurrency(coParentOwed)}
              </div>
              <span className="font-label text-label-sm text-on-secondary-fixed-variant font-medium mt-0.5 block">
                Legally apportioned
              </span>
            </div>
          </div>

          {/* Quick Action / Settlement Insight Bar */}
          <div className="flex items-center justify-between pt-1 text-on-surface-variant border-t border-outline-variant/20">
            <div className="flex items-center gap-1.5 font-body text-body-sm">
              <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
              <span>Receipt photos timestamped & indexed</span>
            </div>
            <Link
              href="/reports"
              className="font-label text-label-sm text-primary font-semibold flex items-center gap-0.5 active:opacity-75 hover:underline"
            >
              Legal Summary
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
