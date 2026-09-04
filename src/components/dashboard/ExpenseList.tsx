"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { Expense } from "@/types/database.types";

interface ExpenseListProps {
  expenses: Expense[];
}

export const ExpenseList: React.FC<ExpenseListProps> = ({ expenses }) => {
  const [activeFilter, setActiveFilter] = useState("All Items");

  const filterChips = [
    "All Items",
    "School & Education",
    "Medical Aid / Doctor",
    "Nutrition & Hygiene",
    "Fuel / Transport",
    "Extramural / Sports",
  ];

  const filteredExpenses = expenses.filter((exp) => {
    if (activeFilter === "All Items") return true;
    return exp.category === activeFilter;
  });

  const getStatusBadge = (status: Expense["status"]) => {
    switch (status) {
      case "reimbursed":
        return (
          <span className="font-label text-label-sm text-primary font-semibold bg-secondary-fixed px-2 py-0.5 rounded-xl">
            Reimbursed
          </span>
        );
      case "pending":
        return (
          <span className="font-label text-label-sm text-on-tertiary-fixed bg-tertiary-fixed px-2 py-0.5 rounded-xl font-semibold">
            Pending Co-Parent
          </span>
        );
      case "draft":
        return (
          <span className="font-label text-label-sm text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded-xl font-semibold">
            Draft Review
          </span>
        );
      default:
        return (
          <span className="font-label text-label-sm text-outline bg-surface-container px-2 py-0.5 rounded-xl font-semibold">
            {status}
          </span>
        );
    }
  };

  const getCategoryIcon = (category: Expense["category"]) => {
    switch (category) {
      case "Medical Aid / Doctor":
        return "medication";
      case "Nutrition & Hygiene":
        return "baby_changing_station";
      case "School & Education":
        return "school";
      case "Fuel / Transport":
        return "local_gas_station";
      case "Extramural / Sports":
        return "sports_soccer";
      default:
        return "receipt_long";
    }
  };

  return (
    <div className="flex flex-col gap-space-md">
      {/* Court-Ready PDF Export Quick Banner */}
      <div className="p-space-sm rounded-2xl bg-surface-container border border-outline-variant/40 flex items-center justify-between gap-space-xs shadow-sm">
        <div className="flex items-center gap-space-xs min-w-0">
          <div className="w-10 h-10 rounded-xl bg-primary-container text-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[20px]">gavel</span>
          </div>
          <div className="min-w-0">
            <h4 className="font-title text-title-md text-on-surface truncate font-semibold">
              Court-Ready PDF Bundle
            </h4>
            <p className="font-body text-body-sm text-on-surface-variant truncate">
              Certified hashes & receipts compiled
            </p>
          </div>
        </div>
        <Link
          href="/reports"
          className="px-3.5 py-1.5 rounded-xl bg-secondary-container text-on-secondary-fixed-variant font-label text-label-md font-semibold flex items-center gap-1 flex-shrink-0 active:scale-95 transition-transform hover:opacity-90"
        >
          <span className="material-symbols-outlined text-[15px]">download</span>
          Export
        </Link>
      </div>

      {/* Filter Horizontal Scroll Carousel */}
      <div className="flex flex-col gap-space-xs -mx-space-md px-space-md overflow-x-auto no-scrollbar py-0.5">
        <div className="flex items-center gap-1.5 flex-nowrap min-w-max">
          {filterChips.map((chip) => {
            const isActive = activeFilter === chip;
            return (
              <button
                key={chip}
                onClick={() => setActiveFilter(chip)}
                className={`px-3.5 py-1.5 rounded-xl font-label text-label-md transition-all flex items-center gap-1 shadow-sm ${
                  isActive
                    ? "bg-primary text-on-primary font-semibold"
                    : "bg-surface-container-high text-on-surface font-medium hover:bg-surface-variant border border-outline-variant/30"
                }`}
                type="button"
              >
                {isActive && (
                  <span className="material-symbols-outlined text-[15px]">check</span>
                )}
                {chip}
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Expenses List Section */}
      <div className="flex flex-col gap-space-xs">
        <div className="flex items-center justify-between px-space-2xs">
          <div className="flex items-center gap-1.5">
            <span className="font-headline text-headline-sm text-on-surface font-bold">
              Recent Expenses
            </span>
            <span className="font-label text-label-sm text-primary bg-primary-fixed px-2 py-0.5 rounded-xl font-bold">
              {filteredExpenses.length} Items
            </span>
          </div>
          <Link
            href="/reports"
            className="font-label text-label-sm text-primary font-semibold hover:underline"
          >
            Audit Table
          </Link>
        </div>

        {filteredExpenses.map((exp) => (
          <div
            key={exp.id}
            className="flex flex-col p-space-sm rounded-2xl bg-surface-container-low border border-outline-variant/30 shadow-sm gap-2"
          >
            <div className="flex items-start justify-between gap-space-xs">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-secondary-fixed flex items-center justify-center text-primary flex-shrink-0">
                  <span className="material-symbols-outlined text-[19px]">
                    {getCategoryIcon(exp.category)}
                  </span>
                </div>
                <div className="min-w-0">
                  <h4 className="font-title text-title-md text-on-surface truncate font-semibold">
                    {exp.vendor}
                  </h4>
                  <span className="font-body text-body-sm text-on-surface-variant">
                    {exp.category.split(" ")[0]} • {exp.expense_date}
                  </span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="font-currency text-currency-md text-on-surface font-bold">
                  {formatCurrency(exp.net_claimable_amount)}
                </div>
                <span className="font-label text-label-sm text-secondary font-medium block">
                  {exp.child_name || "Child"}: {formatCurrency(exp.co_parent_share_amount)}
                </span>
              </div>
            </div>

            <p className="font-body text-body-sm text-on-surface-variant bg-surface-container-lowest border border-outline-variant/30 px-2.5 py-1.5 rounded-xl">
              {exp.description}
            </p>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 font-label text-label-sm text-primary bg-primary-fixed/60 px-2 py-0.5 rounded-lg font-medium">
                  <span className="material-symbols-outlined text-[13px]">document_scanner</span>
                  Till Slip Scanned
                </span>
                <span className="font-label text-label-sm text-on-surface-variant">
                  {exp.receipt_id_tag}
                </span>
              </div>
              {getStatusBadge(exp.status)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
