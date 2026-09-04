"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { ExpenseCategory } from "@/types/database.types";

export default function AddManualExpensePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"manual" | "recurring">("manual");
  const [category, setCategory] = useState<ExpenseCategory>("Medical Aid / Doctor");
  const [grossAmount, setGrossAmount] = useState<string>("850.00");
  const [medicalAidCovered, setMedicalAidCovered] = useState<string>("500.00");
  const [isMedicalExpense, setIsMedicalExpense] = useState<boolean>(true);
  const [vendor, setVendor] = useState<string>("Dr. V Naidoo Paediatrics");
  const [subCategory, setSubCategory] = useState<string>("Out-of-Pocket Consult");
  const [expenseDate, setExpenseDate] = useState<string>("2024-10-24");
  const [childAllocation, setChildAllocation] = useState<string>("liam"); // liam, maya, joint
  const [splitRatio, setSplitRatio] = useState<number>(50); // 50%
  const [legalNotes, setLegalNotes] = useState<string>(
    "Prescribed after emergency allergy consultation. Discovery Health claims remittance attached confirming R350 shortfall."
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitDone, setSubmitDone] = useState<boolean>(false);

  // Calculate net claimable amount (accounting for medical aid gap)
  const numGross = parseFloat(grossAmount) || 0;
  const numMedical = isMedicalExpense ? parseFloat(medicalAidCovered) || 0 : 0;
  const netClaimable = Math.max(0, numGross - numMedical);
  const coParentShare = (netClaimable * splitRatio) / 100;

  const categories: { label: ExpenseCategory; icon: string }[] = [
    { label: "Medical Aid / Doctor", icon: "medical_services" },
    { label: "School & Education", icon: "school" },
    { label: "Rent / Child Room", icon: "cottage" },
    { label: "Fuel / Transport", icon: "local_gas_station" },
    { label: "Extramural / Sports", icon: "sports_soccer" },
    { label: "Nutrition & Hygiene", icon: "baby_changing_station" },
    { label: "Clothing & Essentials", icon: "checkroom" },
  ];

  const handleCategorySelect = (cat: ExpenseCategory) => {
    setCategory(cat);
    setIsMedicalExpense(cat === "Medical Aid / Doctor");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitDone(true);
      setTimeout(() => {
        router.push("/expenses");
      }, 1200);
    }, 800);
  };

  return (
    <div className="flex flex-col w-full gap-space-md pt-2 pb-12">
      {/* Header Back & Title */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors text-sm font-semibold"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          Back to Dashboard
        </Link>
        <span className="font-label text-label-sm text-primary font-bold bg-primary-fixed px-2.5 py-0.5 rounded-full">
          Form 4A Standard
        </span>
      </div>

      {/* Segmented View Control: Manual Entry vs Recurring */}
      <div className="w-full bg-surface-container p-1 rounded-xl flex items-center justify-between shadow-sm">
        <button
          type="button"
          onClick={() => setActiveTab("manual")}
          className={`flex-1 py-space-xs rounded-lg text-sm text-center font-semibold transition-all ${
            activeTab === "manual"
              ? "bg-surface-container-lowest text-primary shadow-sm"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          Single Expense
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("recurring")}
          className={`flex-1 py-space-xs rounded-lg text-sm text-center font-semibold transition-all flex items-center justify-center gap-1 ${
            activeTab === "recurring"
              ? "bg-surface-container-lowest text-primary shadow-sm"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">sync</span>
          Recurring Monthly
        </button>
      </div>

      {/* Legal Reassurance Micro-banner */}
      <div className="p-space-sm rounded-xl bg-secondary-fixed/40 text-on-secondary-fixed flex items-center gap-space-xs border border-secondary-container/40">
        <span className="material-symbols-outlined text-secondary text-[20px]">verified_user</span>
        <span className="text-xs font-medium">
          Logged items format directly into Family Court Maintenance Form 4A & Rule 43 exhibits.
        </span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-space-md">
        {/* Category Horizontal Chips */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider px-1">
            Expense Category
          </label>
          <div className="flex items-center gap-space-xs overflow-x-auto pb-1 no-scrollbar -mx-space-md px-space-md">
            {categories.map((cat) => {
              const isSelected = category === cat.label;
              return (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => handleCategorySelect(cat.label)}
                  className={`shrink-0 px-space-sm py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm ${
                    isSelected
                      ? "bg-primary text-white font-semibold"
                      : "bg-surface-container-high text-on-surface hover:bg-surface-variant border border-outline-variant/30"
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{cat.icon}</span>
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Primary Amount Card */}
        <div className="p-space-md rounded-2xl bg-surface-container-low border border-surface-variant/50 shadow-sm flex flex-col gap-space-sm">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-on-surface-variant">
              Gross Invoice / Receipt Total
            </span>
            <div className="flex items-baseline justify-between rounded-xl bg-surface-container-lowest p-space-sm border border-outline-variant/40 shadow-inner">
              <div className="flex items-center gap-1 w-full">
                <span className="text-2xl text-primary font-bold">R</span>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={grossAmount}
                  onChange={(e) => setGrossAmount(e.target.value)}
                  className="w-full bg-transparent text-2xl text-on-surface font-bold outline-none tabular-nums border-none p-0 focus:ring-0"
                  placeholder="0.00"
                />
              </div>
              <div className="px-2 py-1 rounded-lg bg-surface-container text-on-surface-variant text-xs uppercase font-semibold flex-shrink-0">
                ZAR (R)
              </div>
            </div>
          </div>

          {/* Medical Aid Shortfall Calculator (Crucial for Avoiding Court Disputes) */}
          {isMedicalExpense && (
            <div className="p-space-sm rounded-xl bg-secondary-fixed/30 border border-secondary-fixed-dim/50 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-secondary flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">health_and_safety</span>
                  Medical Aid / Insurance Gap Reconciliation
                </span>
                <span className="text-[11px] text-on-surface-variant">Prevents Double-Claims</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-on-surface-variant font-medium block mb-1">
                    Paid by Medical Aid (R)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={medicalAidCovered}
                    onChange={(e) => setMedicalAidCovered(e.target.value)}
                    className="w-full bg-surface-container-lowest text-sm font-semibold rounded-lg px-2.5 py-1.5 border border-outline-variant/40 outline-none"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-on-surface-variant font-medium block mb-1">
                    Net Claimable Shortfall
                  </label>
                  <div className="w-full bg-surface-container-lowest text-sm font-bold text-primary rounded-lg px-2.5 py-1.5 border border-outline-variant/40">
                    {formatCurrency(netClaimable)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Vendor / Provider */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-on-surface-variant">
              Vendor or Medical Provider Description
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined text-outline absolute left-space-sm text-[20px]">
                apartment
              </span>
              <input
                type="text"
                required
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                className="w-full pl-10 pr-space-sm py-2.5 rounded-xl bg-surface-container-lowest text-on-surface text-sm border border-outline-variant/40 outline-none focus:border-primary transition-all"
                placeholder="e.g. St. Jude Primary or Dr. Naidoo"
              />
            </div>
          </div>

          {/* Sub-Category and Date */}
          <div className="grid grid-cols-2 gap-space-sm">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-on-surface-variant">Sub-Category</label>
              <input
                type="text"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className="w-full px-space-sm py-2 rounded-xl bg-surface-container-lowest text-on-surface text-sm border border-outline-variant/40 outline-none focus:border-primary"
                placeholder="e.g. Consultation / Shoes"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-on-surface-variant">Expense Date</label>
              <input
                type="date"
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
                className="w-full px-space-sm py-2 rounded-xl bg-surface-container-lowest text-on-surface text-sm border border-outline-variant/40 outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Child Allocation & Split Ratio Card */}
        <div className="p-space-md rounded-2xl bg-surface-container-low border border-surface-variant/50 shadow-sm flex flex-col gap-space-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-on-surface font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[18px]">escalator_warning</span>
              Child Allocation
            </span>
            <span className="text-xs text-on-surface-variant">Who is this for?</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "liam", label: "Liam (Age 7)", desc: "100% Liam" },
              { id: "maya", label: "Maya (Age 3)", desc: "100% Maya" },
              { id: "joint", label: "Liam & Maya", desc: "50/50 Joint" },
            ].map((child) => (
              <button
                key={child.id}
                type="button"
                onClick={() => setChildAllocation(child.id)}
                className={`p-2 rounded-xl text-left border transition-all ${
                  childAllocation === child.id
                    ? "bg-primary-fixed/60 border-primary text-primary font-bold shadow-sm"
                    : "bg-surface-container-lowest border-outline-variant/30 text-on-surface"
                }`}
              >
                <div className="font-semibold text-xs truncate">{child.label}</div>
                <div className="text-[10px] text-on-surface-variant">{child.desc}</div>
              </button>
            ))}
          </div>

          {/* Co-Parent Split Ratio */}
          <div className="pt-2 border-t border-outline-variant/20 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-on-surface-variant">
                Co-Parent Share Ratio: <strong className="text-primary">{splitRatio}%</strong>
              </span>
              <span className="font-bold text-secondary text-sm">
                Claim: {formatCurrency(coParentShare)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {[50, 60, 70, 100].map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => setSplitRatio(ratio)}
                  className={`flex-1 py-1 rounded-lg text-xs font-semibold border transition-all ${
                    splitRatio === ratio
                      ? "bg-primary text-white border-primary"
                      : "bg-surface-container-lowest text-on-surface-variant border-outline-variant/30"
                  }`}
                >
                  {ratio}%
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Proof Document / Receipt Attachment */}
        <div className="p-space-md rounded-2xl bg-surface-container-low border border-surface-variant/50 shadow-sm flex flex-col gap-space-xs">
          <div className="flex items-center justify-between">
            <span className="text-sm text-on-surface font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[18px]">attachment</span>
              Court Proof Document
            </span>
            <span className="text-xs text-secondary font-medium">Receipt Attached</span>
          </div>

          <div className="border-2 border-dashed border-outline-variant/60 rounded-xl p-4 flex flex-col items-center justify-center text-center bg-surface-container-lowest">
            <span className="material-symbols-outlined text-[32px] text-primary mb-1">
              add_a_photo
            </span>
            <span className="text-xs font-semibold text-on-surface">
              Till Slip or Doctor Invoice Photo Attached
            </span>
            <span className="text-[11px] text-on-surface-variant mt-0.5">
              Cryptographic SHA-256 hash automatically calculated upon upload
            </span>
          </div>
        </div>

        {/* Legal Notes */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-on-surface-variant">
            Maintenance Court Notes / Agreement Reference
          </label>
          <textarea
            rows={2}
            value={legalNotes}
            onChange={(e) => setLegalNotes(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-surface-container-lowest text-on-surface text-xs border border-outline-variant/40 outline-none focus:border-primary"
            placeholder="e.g. Clause 4.2 compliance, emergency ER visit..."
          />
        </div>

        {/* Submit Actions */}
        <div className="flex flex-col gap-2 pt-2">
          {submitDone ? (
            <div className="w-full h-12 bg-secondary text-white rounded-xl font-label text-sm font-bold flex items-center justify-center gap-2 shadow-md">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              <span>Logged to Family Court Ledger</span>
            </div>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-primary text-white rounded-xl font-label text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:bg-primary-container transition-all active:scale-[0.98] cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined text-[20px] animate-spin">sync</span>
                  <span>Hashing & Recording Exhibit...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">verified</span>
                  <span>Log Expense to Court Ledger</span>
                </>
              )}
            </button>
          )}

          <Link
            href="/"
            className="w-full h-10 bg-transparent text-on-surface-variant hover:text-on-surface font-semibold text-xs flex items-center justify-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
