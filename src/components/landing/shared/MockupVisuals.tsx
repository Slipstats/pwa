"use client";

import React, { useState } from "react";
import Image from "next/image";

export const TillSlipScanCard: React.FC = () => {
  return (
    <div className="flex flex-col bg-surface-container-lowest rounded-2xl border border-outline-variant/50 p-4 sm:p-5 shadow-md">
      {/* Till Slip Store Header */}
      <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[18px]">receipt_long</span>
          </div>
          <div>
            <h4 className="font-headline text-xs sm:text-sm font-bold text-on-surface">
              Checkers Hyper Sandton
            </h4>
            <p className="font-label text-[10px] text-on-surface-variant">
              Tax Invoice #CK-49102 • 14 Oct 2026 11:42
            </p>
          </div>
        </div>
        <span className="font-label text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 border border-emerald-500/30 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
          AI Itemized
        </span>
      </div>

      {/* Scanned Line Items */}
      <div className="py-3 flex flex-col gap-2 font-body text-xs">
        {/* Child Item 1 */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <div className="flex items-center gap-2 min-w-0">
            <span className="material-symbols-outlined text-[18px] text-emerald-700 flex-shrink-0">
              check_circle
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-on-surface truncate text-xs">
                Purity Organic Toddler Formula
              </p>
              <p className="text-[10px] text-emerald-700 font-medium">
                Allocated: Liam & Maya (100% Child)
              </p>
            </div>
          </div>
          <span className="font-bold tabular-nums text-emerald-800 flex-shrink-0 ml-2">R48.99</span>
        </div>

        {/* Child Item 2 */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <div className="flex items-center gap-2 min-w-0">
            <span className="material-symbols-outlined text-[18px] text-emerald-700 flex-shrink-0">
              check_circle
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-on-surface truncate text-xs">
                Panado Paediatric Syrup 100ml
              </p>
              <p className="text-[10px] text-emerald-700 font-medium">
                Allocated: Maya (100% Medical)
              </p>
            </div>
          </div>
          <span className="font-bold tabular-nums text-emerald-800 flex-shrink-0 ml-2">R35.50</span>
        </div>

        {/* Child Item 3 */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <div className="flex items-center gap-2 min-w-0">
            <span className="material-symbols-outlined text-[18px] text-emerald-700 flex-shrink-0">
              check_circle
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-on-surface truncate text-xs">
                Staedtler School Wax & Pencil Set
              </p>
              <p className="text-[10px] text-emerald-700 font-medium">
                Allocated: Liam (100% Education)
              </p>
            </div>
          </div>
          <span className="font-bold tabular-nums text-emerald-800 flex-shrink-0 ml-2">R42.00</span>
        </div>

        {/* Excluded Personal Item 1 */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-rose-500/5 border border-rose-500/20 opacity-70">
          <div className="flex items-center gap-2 min-w-0">
            <span className="material-symbols-outlined text-[18px] text-rose-600 flex-shrink-0">
              cancel
            </span>
            <div className="min-w-0">
              <p className="font-medium text-on-surface-variant line-through truncate text-xs">
                Nespresso Espresso Master Pods 10s
              </p>
              <p className="text-[10px] text-rose-600 font-medium">
                Excluded: Adult Personal (0% Child)
              </p>
            </div>
          </div>
          <span className="font-medium tabular-nums text-rose-700 line-through flex-shrink-0 ml-2">
            R38.20
          </span>
        </div>
      </div>

      {/* Audit Reconciliation Summary */}
      <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-between text-xs">
        <div className="flex flex-col">
          <span className="text-[10px] text-on-surface-variant">Gross Till Slip Total</span>
          <span className="font-bold text-on-surface tabular-nums">R164.69</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-emerald-700 font-medium">Child Qualifying (100%)</span>
          <span className="font-bold text-emerald-800 tabular-nums">R126.49</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-primary font-bold">Co-Parent Owes (50%)</span>
          <span className="font-extrabold text-primary tabular-nums text-sm">R63.25</span>
        </div>
      </div>
    </div>
  );
};

export const LiveDashboardAppCard: React.FC = () => {
  return (
    <div className="flex flex-col bg-surface-container-lowest rounded-2xl border border-outline-variant/50 p-4 sm:p-5 shadow-md">
      {/* App Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-[16px]">account_balance_wallet</span>
          </div>
          <span className="font-headline font-bold text-xs sm:text-sm text-on-surface">
            Shared Maintenance Ledger
          </span>
        </div>
        <span className="font-label text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-fixed text-primary">
          Rule 6 &amp; Form 4A Indexed
        </span>
      </div>

      {/* Balance Apportionment Box */}
      <div className="my-3 p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 grid grid-cols-2 gap-3">
        <div>
          <span className="font-label text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
            Total Tracked
          </span>
          <p className="font-headline font-extrabold text-lg sm:text-xl text-on-surface tabular-nums">
            R1 557,70
          </p>
          <span className="text-[10px] text-on-surface-variant">5 verified till slips</span>
        </div>
        <div>
          <span className="font-label text-[10px] font-bold text-primary uppercase tracking-wider">
            Co-Parent Share (50%)
          </span>
          <p className="font-headline font-extrabold text-lg sm:text-xl text-primary tabular-nums">
            R786,35
          </p>
          <span className="text-[10px] text-emerald-700 font-medium">Rule 6 Substantiated</span>
        </div>
      </div>

      {/* Beneficiary Breakdown */}
      <div className="space-y-2">
        <div className="flex items-center justify-between p-2 rounded-xl bg-surface-container/60 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary-fixed text-primary text-[10px] font-bold flex items-center justify-center">
              L
            </div>
            <div>
              <span className="font-semibold text-on-surface">Liam Jenkins</span>
              <span className="text-[10px] text-on-surface-variant ml-1.5">Age 7 • Grade 2</span>
            </div>
          </div>
          <span className="font-bold tabular-nums text-on-surface">R489,50</span>
        </div>

        <div className="flex items-center justify-between p-2 rounded-xl bg-surface-container/60 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold flex items-center justify-center">
              M
            </div>
            <div>
              <span className="font-semibold text-on-surface">Maya Jenkins</span>
              <span className="text-[10px] text-on-surface-variant ml-1.5">Age 3 • Nursery</span>
            </div>
          </div>
          <span className="font-bold tabular-nums text-on-surface">R118,20</span>
        </div>
      </div>

      {/* Evidentiary Stamp */}
      <div className="mt-3 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-[10px] text-on-surface-variant">
        <span className="flex items-center gap-1 text-primary font-medium">
          <span className="material-symbols-outlined text-[14px]">verified</span>
          SHA-256 Custody Hash Verified
        </span>
        <span className="font-mono text-[9px] text-outline">#8f4a..2b91</span>
      </div>
    </div>
  );
};
