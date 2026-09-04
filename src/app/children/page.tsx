"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MOCK_CHILDREN, MOCK_AGREEMENT, MOCK_PROFILE } from "@/lib/data/mockData";
import { Child } from "@/types/database.types";

export default function ChildrenSplitsPage() {
  const [childrenList] = useState<Child[]>(MOCK_CHILDREN);
  const [agreement, setAgreement] = useState(MOCK_AGREEMENT);
  const [saved, setSaved] = useState(false);

  const handleUpdateSplit = (categoryKey: string, val: number) => {
    setAgreement((prev) => ({
      ...prev,
      category_split_rules: {
        ...prev.category_split_rules,
        [categoryKey]: val,
      },
    }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col w-full gap-space-md pt-2 pb-12">
      {/* 1. Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-primary tracking-tight font-headline">
            Children & Court Splits
          </h1>
          <p className="font-body text-body-sm text-on-surface-variant">
            Beneficiaries, settlement rules, and jurisdiction configuration
          </p>
        </div>
        <span className="font-label text-xs font-bold text-primary bg-primary-fixed px-2.5 py-1 rounded-full">
          Case: {MOCK_PROFILE.court_case_number}
        </span>
      </div>

      {/* 2. Children / Beneficiaries Cards */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <span className="font-headline text-base font-bold text-on-surface">
            Registered Children
          </span>
          <button
            type="button"
            className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            Add Beneficiary
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {childrenList.map((child) => (
            <div
              key={child.id}
              className="p-space-md rounded-2xl bg-surface-container-low border border-outline-variant/30 shadow-sm flex items-center justify-between gap-space-sm"
            >
              <div className="flex items-center gap-space-sm min-w-0">
                <div className="w-12 h-12 rounded-2xl overflow-hidden relative flex-shrink-0 bg-primary-fixed">
                  {child.avatar_url && (
                    <Image
                      src={child.avatar_url}
                      alt={child.first_name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-headline text-sm font-bold text-on-surface leading-tight">
                    {child.first_name} {child.last_name}
                  </h3>
                  <span className="font-body text-xs text-on-surface-variant block">
                    {child.age_display} • {child.school_name}
                  </span>
                  <span className="font-label text-[11px] text-secondary font-medium">
                    Medical Aid: {child.medical_aid_number}
                  </span>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <span className="font-label text-[11px] text-on-surface-variant block">
                  Court Split
                </span>
                <span className="font-bold text-sm text-primary">
                  {child.default_split_ratio}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Maintenance Court Agreement Settings */}
      <div className="p-space-md rounded-2xl bg-surface-container-low border border-outline-variant/30 shadow-sm flex flex-col gap-space-sm">
        <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[20px]">
              gavel
            </span>
            <span className="font-headline text-sm font-bold text-on-surface">
              Maintenance Court Order Details
            </span>
          </div>
          <span className="text-xs text-secondary font-semibold bg-secondary-fixed/50 px-2 py-0.5 rounded-md">
            Active Order
          </span>
        </div>

        <div className="grid grid-cols-2 gap-space-sm text-xs">
          <div>
            <span className="text-on-surface-variant font-medium block">Court Case Number</span>
            <strong className="text-on-surface">{agreement.case_number}</strong>
          </div>
          <div>
            <span className="text-on-surface-variant font-medium block">Order Date</span>
            <strong className="text-on-surface">{agreement.court_order_date}</strong>
          </div>
          <div>
            <span className="text-on-surface-variant font-medium block">Co-Parent Name</span>
            <strong className="text-on-surface">{agreement.co_parent_full_name}</strong>
          </div>
          <div>
            <span className="text-on-surface-variant font-medium block">Monthly Due Day</span>
            <strong className="text-on-surface">Day {agreement.payment_due_day} of each month</strong>
          </div>
        </div>
      </div>

      {/* 4. Category Split Ratio Rules */}
      <div className="p-space-md rounded-2xl bg-surface-container-low border border-outline-variant/30 shadow-sm flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-headline text-sm font-bold text-on-surface block">
              Agreed Category Split Rules
            </span>
            <span className="text-[11px] text-on-surface-variant">
              Applies default ratios to new expenses automatically
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-1">
          {Object.entries(agreement.category_split_rules).map(([cat, ratio]) => (
            <div
              key={cat}
              className="p-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex items-center justify-between"
            >
              <span className="text-xs font-semibold text-on-surface">{cat}</span>
              <div className="flex items-center gap-2">
                {[50, 60, 70, 100].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleUpdateSplit(cat, r)}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold border transition-all ${
                      ratio === r
                        ? "bg-primary text-white border-primary"
                        : "bg-surface-container text-on-surface-variant border-outline-variant/30"
                    }`}
                  >
                    {r}%
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <button
        type="button"
        onClick={handleSave}
        className="w-full h-12 bg-primary text-white rounded-xl font-label text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:bg-primary-container active:scale-[0.98] transition-all cursor-pointer"
      >
        <span className="material-symbols-outlined text-[20px]">
          {saved ? "check" : "save"}
        </span>
        <span>{saved ? "Agreement Settings Saved" : "Save Agreement & Split Settings"}</span>
      </button>
    </div>
  );
}
