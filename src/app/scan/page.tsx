"use client";

import React, { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { MOCK_SLIP_ITEMS } from "@/lib/data/mockData";
import { ReceiptLineItem } from "@/types/database.types";
import Link from "next/link";

export default function ScanSlipPage() {
  const [items, setItems] = useState<ReceiptLineItem[]>(MOCK_SLIP_ITEMS);
  const [splitRatio] = useState<number>(50); // 50% co-parent share
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Toggle item inclusion / exclusion
  const handleToggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextIncluded = !item.is_included;
          return {
            ...item,
            is_included: nextIncluded,
            child_portion_amount: nextIncluded
              ? item.line_total * (item.child_allocation_ratio || 1.0)
              : 0,
          };
        }
        return item;
      })
    );
  };

  // Adjust partial allocation ratio (e.g. 70/30 vs 50/50 vs 100)
  const handleCycleRatio = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id && item.is_included) {
          let nextRatio = 1.0;
          if (item.child_allocation_ratio === 1.0) nextRatio = 0.7;
          else if (item.child_allocation_ratio === 0.7) nextRatio = 0.5;
          else nextRatio = 1.0;

          return {
            ...item,
            child_allocation_ratio: nextRatio,
            child_portion_amount: item.line_total * nextRatio,
          };
        }
        return item;
      })
    );
  };

  // Dynamic calculations based on state
  const totalSlip = items.reduce((sum, item) => sum + item.line_total, 0);
  const childEligibleTotal = items
    .filter((item) => item.is_included)
    .reduce((sum, item) => sum + item.child_portion_amount, 0);
  const coParentShare = (childEligibleTotal * splitRatio) / 100;
  const includedCount = items.filter((item) => item.is_included).length;

  // Category breakdown calculation
  const hygieneTotal = items
    .filter(
      (item) =>
        item.is_included &&
        (item.item_name.includes("Diapers") || item.item_name.includes("Toothpaste"))
    )
    .reduce((sum, item) => sum + item.child_portion_amount, 0);

  const foodTotal = items
    .filter(
      (item) =>
        item.is_included &&
        (item.item_name.includes("Formula") || item.item_name.includes("Milk"))
    )
    .reduce((sum, item) => sum + item.child_portion_amount, 0);

  const medicalTotal = items
    .filter(
      (item) => item.is_included && item.item_name.includes("Nurofen")
    )
    .reduce((sum, item) => sum + item.child_portion_amount, 0);

  const handleSaveLedger = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
    }, 800);
  };

  return (
    <div className="flex flex-col w-full gap-space-md pt-2 pb-8">
      {/* 1. Slip Context & Receipt Header Card */}
      <div className="flex flex-col bg-surface-container-lowest rounded-2xl p-space-md border border-outline-variant/40 shadow-sm gap-space-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <div className="w-10 h-10 rounded-xl bg-secondary-fixed flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">storefront</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-headline text-[16px] font-bold text-on-surface truncate">
                Checkers Hyper Sandton
              </span>
              <span className="font-body text-[12px] text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                14 Oct 2024, 16:42 • Tax Inv #CK-49102
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-label text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
              Gross Slip
            </span>
            <span className="font-headline text-[24px] leading-7 text-primary tabular-nums font-bold">
              {formatCurrency(totalSlip)}
            </span>
          </div>
        </div>

        {/* Scanned Thumbnail & OCR Status */}
        <div className="flex items-center justify-between bg-surface-container-low rounded-xl px-space-sm py-2 border border-outline-variant/30">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
            <span className="font-label text-[12px] text-on-surface font-semibold">
              Thermal Slip Scan & Hashing
            </span>
          </div>
          <span className="font-label text-[11px] text-primary font-bold bg-primary-fixed px-2.5 py-0.5 rounded-full">
            99.4% OCR Match
          </span>
        </div>
      </div>

      {/* 2. AI Smart Recognition Banner */}
      <div className="flex items-start gap-space-sm bg-gradient-to-br from-primary to-primary-container text-white rounded-2xl p-space-md shadow-sm relative overflow-hidden">
        <div className="w-9 h-9 rounded-xl bg-white/20 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
          <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
        </div>
        <div className="flex flex-col min-w-0 pr-2">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="font-label text-[12px] text-primary-fixed font-bold tracking-wide uppercase">
              AI Smart Till Allocation
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed-dim animate-pulse"></span>
          </div>
          <p className="font-body text-[13px] text-white/95 leading-snug">
            Identified <strong className="font-semibold text-white">7 line items</strong>.{" "}
            {includedCount} items qualify under Maintenance Act Section 7 Support Guidelines.
          </p>
          <div className="mt-2 inline-flex items-center gap-1 font-label text-[12px] text-primary-fixed bg-white/15 px-2.5 py-0.5 rounded-lg w-fit">
            <span className="font-bold text-white">{formatCurrency(childEligibleTotal)}</span>{" "}
            child-eligible portion detected
          </div>
        </div>
      </div>

      {/* 3. Interactive Line Item Audit */}
      <div className="flex flex-col gap-space-xs">
        <div className="flex items-center justify-between px-1">
          <span className="font-headline text-[17px] font-bold text-on-surface">
            Itemized Slip Audit
          </span>
          <span className="font-label text-[11px] text-on-surface-variant font-medium">
            Tap button to exclude personal items
          </span>
        </div>

        {items.map((item) => {
          const isAllocated = item.is_included;

          return (
            <div
              key={item.id}
              className={`flex flex-col rounded-2xl p-space-md gap-space-xs transition-all duration-200 border ${
                isAllocated
                  ? "bg-surface-container-lowest border-outline-variant/40 shadow-sm"
                  : "bg-surface-container/50 opacity-60 border-outline-variant/20"
              }`}
            >
              <div className="flex items-start justify-between gap-space-sm">
                <div className="flex items-start gap-space-xs min-w-0">
                  <button
                    type="button"
                    onClick={() => handleToggleItem(item.id)}
                    aria-label={isAllocated ? "Exclude item" : "Include item"}
                    className={`mt-0.5 w-6 h-6 rounded-md flex items-center justify-center shrink-0 shadow-sm transition-colors ${
                      isAllocated
                        ? "bg-primary text-white"
                        : "bg-surface-container-highest text-outline"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {isAllocated ? "check" : "remove"}
                    </span>
                  </button>

                  <div className="flex flex-col min-w-0">
                    <span
                      className={`font-headline text-[14px] font-semibold leading-tight ${
                        isAllocated
                          ? "text-on-surface"
                          : "text-on-surface-variant line-through"
                      }`}
                    >
                      {item.item_name}
                    </span>
                    <span className="font-body text-[12px] text-on-surface-variant">
                      Qty: {item.quantity} • Unit: {formatCurrency(item.unit_price)}
                      {item.exclusion_reason && !isAllocated && (
                        <span className="text-outline"> — {item.exclusion_reason}</span>
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span
                    className={`font-headline text-[15px] font-semibold tabular-nums ${
                      isAllocated
                        ? "text-on-surface"
                        : "text-outline line-through"
                    }`}
                  >
                    {formatCurrency(item.line_total)}
                  </span>
                  {isAllocated && item.child_allocation_ratio < 1.0 && (
                    <span className="font-label text-[11px] text-secondary font-medium">
                      Claiming {formatCurrency(item.child_portion_amount)}
                    </span>
                  )}
                </div>
              </div>

              {/* Tag and Sub-actions */}
              <div className="flex items-center justify-between pt-1 gap-2 flex-wrap">
                {isAllocated ? (
                  <>
                    <div className="flex items-center gap-1.5 bg-tertiary-fixed text-on-tertiary-fixed px-2.5 py-0.5 rounded-full">
                      <span className="material-symbols-outlined text-[14px]">
                        {item.child_name?.includes("Maya")
                          ? "face_3"
                          : item.child_name?.includes("Liam")
                          ? "face_6"
                          : "call_split"}
                      </span>
                      <span className="font-label text-[11px] font-semibold">
                        {item.child_name || "Liam & Maya"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCycleRatio(item.id)}
                        className="flex items-center gap-1 text-secondary font-label text-[11px] bg-secondary-fixed/50 px-2 py-0.5 rounded-md hover:bg-secondary-fixed transition-colors"
                      >
                        <span className="material-symbols-outlined text-[13px]">
                          {item.child_allocation_ratio === 1 ? "gavel" : "percent"}
                        </span>
                        <span>
                          {item.child_allocation_ratio === 1
                            ? "100% Child"
                            : `${Math.round(item.child_allocation_ratio * 100)}% Child Split`}
                        </span>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-1.5 bg-surface-container-highest text-outline px-2.5 py-0.5 rounded-full">
                      <span className="material-symbols-outlined text-[14px]">block</span>
                      <span className="font-label text-[11px] font-semibold">
                        Personal / Excluded
                      </span>
                    </div>
                    <span className="font-label text-[11px] text-outline">
                      Omitted from legal claim
                    </span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Court-Ready Exhibit Summary Card */}
      <div className="flex flex-col bg-surface-container-lowest rounded-2xl p-space-md gap-space-sm border border-outline-variant/40 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <div className="w-8 h-8 rounded-lg bg-primary-fixed text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">account_balance</span>
            </div>
            <span className="font-headline text-[16px] font-bold text-on-surface">
              Legal Split Calculations
            </span>
          </div>
          <span className="font-label text-[11px] bg-primary-fixed text-primary font-bold px-2.5 py-0.5 rounded-full">
            Maintenance Act Compliant
          </span>
        </div>

        {/* Calculations Grid */}
        <div className="grid grid-cols-2 gap-space-xs bg-surface-container-low rounded-xl p-space-sm border border-outline-variant/30">
          <div className="flex flex-col bg-surface-container-lowest p-space-xs rounded-lg shadow-sm border border-outline-variant/20">
            <span className="font-label text-[11px] text-on-surface-variant font-medium">
              Child Total Claimable
            </span>
            <span className="font-headline text-[22px] leading-7 text-on-surface font-bold tabular-nums mt-0.5">
              {formatCurrency(childEligibleTotal)}
            </span>
            <span className="font-label text-[11px] text-secondary font-medium mt-1">
              {includedCount} of {items.length} Items Included
            </span>
          </div>

          <div className="flex flex-col bg-surface-container-lowest p-space-xs rounded-lg shadow-sm border border-outline-variant/20">
            <span className="font-label text-[11px] text-on-surface-variant font-medium">
              Co-Parent Share ({splitRatio}%)
            </span>
            <span className="font-headline text-[22px] leading-7 text-primary font-bold tabular-nums mt-0.5">
              {formatCurrency(coParentShare)}
            </span>
            <span className="font-label text-[11px] text-primary font-semibold mt-1">
              Legally Apportioned
            </span>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="flex flex-col gap-1.5 pt-1">
          <span className="font-label text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
            Expense Categories (Audited)
          </span>
          <div className="flex items-center gap-space-xs flex-wrap">
            <div className="flex items-center gap-1.5 bg-surface-container px-3 py-1 rounded-full text-on-surface border border-outline-variant/30">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              <span className="font-label text-[12px]">Hygiene:</span>
              <span className="font-label text-[12px] font-bold tabular-nums">
                {formatCurrency(hygieneTotal)}
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-surface-container px-3 py-1 rounded-full text-on-surface border border-outline-variant/30">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              <span className="font-label text-[12px]">Food:</span>
              <span className="font-label text-[12px] font-bold tabular-nums">
                {formatCurrency(foodTotal)}
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-surface-container px-3 py-1 rounded-full text-on-surface border border-outline-variant/30">
              <span className="w-2 h-2 rounded-full bg-error"></span>
              <span className="font-label text-[12px]">Medical:</span>
              <span className="font-label text-[12px] font-bold tabular-nums">
                {formatCurrency(medicalTotal)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Action CTA Stack */}
      <div className="flex flex-col gap-space-xs pt-1">
        {saveSuccess ? (
          <div className="w-full h-12 bg-secondary text-white rounded-xl font-label text-[14px] font-bold flex items-center justify-center gap-space-xs shadow-md">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            <span>Recorded in Exhibit File & Ledger</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleSaveLedger}
            disabled={isSaving}
            className="w-full h-12 bg-primary text-white rounded-xl font-label text-[14px] font-bold flex items-center justify-center gap-space-xs shadow-md hover:bg-primary-container transition-all active:scale-[0.98] cursor-pointer"
          >
            {isSaving ? (
              <>
                <span className="material-symbols-outlined text-[20px] animate-spin">sync</span>
                <span>Generating Legal Exhibit Hash...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">save</span>
                <span>Save & Add to Court Ledger</span>
              </>
            )}
          </button>
        )}

        <Link
          href="/"
          className="w-full h-11 bg-surface-container-high text-on-surface rounded-xl font-label text-[13px] font-semibold flex items-center justify-center gap-space-xs border border-outline-variant/50 hover:bg-surface-container-highest transition-all active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Back to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
