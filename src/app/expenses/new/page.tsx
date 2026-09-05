"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { ExpenseCategory } from "@/types/database.types";
import { ReceiptUploader } from "@/components/shared/ReceiptUploader";
import { createExpenseAction } from "@/app/actions/expenses";
import { useLedger } from "@/context/LedgerContext";
import { calculateMedicalAidGap, calculateCoParentShare } from "@/lib/calculations";

export default function AddManualExpensePage() {
  const router = useRouter();
  const { children, agreement, createExpense } = useLedger();

  const [activeTab, setActiveTab] = useState<"manual" | "recurring">("manual");
  const [recurringPeriod, setRecurringPeriod] = useState<"monthly" | "termly" | "annual">("monthly");
  const [category, setCategory] = useState<ExpenseCategory>("Nutrition & Hygiene");
  const [grossAmount, setGrossAmount] = useState<string>("");
  const [medicalAidCovered, setMedicalAidCovered] = useState<string>("");
  const [isMedicalExpense, setIsMedicalExpense] = useState<boolean>(false);
  const [vendor, setVendor] = useState<string>("");
  const [subCategory, setSubCategory] = useState<string>("");
  const [expenseDate, setExpenseDate] = useState<string>(() => new Date().toISOString().split("T")[0]);
  const [childAllocation, setChildAllocation] = useState<string>("");
  const [splitRatio, setSplitRatio] = useState<number>(50);
  const [legalNotes, setLegalNotes] = useState<string>("");
  const [receiptHash, setReceiptHash] = useState<string | null>(null);
  const [receiptBase64, setReceiptBase64] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitDone, setSubmitDone] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{ vendor?: string; grossAmount?: string; child?: string }>({});

  // Initialize child allocation when children become available
  useEffect(() => {
    if (!childAllocation && children.length > 0) {
      setChildAllocation(children[0].id);
    }
  }, [children, childAllocation]);

  // Sync split ratio from agreement when category or agreement changes
  useEffect(() => {
    const defaultSplit = agreement?.category_split_rules?.[category] ?? 50;
    setSplitRatio(defaultSplit);
  }, [category, agreement]);

  // Real-time calculations
  const numGross = parseFloat(grossAmount) || 0;
  const numMedical = isMedicalExpense ? parseFloat(medicalAidCovered) || 0 : 0;
  const netClaimable = calculateMedicalAidGap(numGross, numMedical);
  const coParentShare = calculateCoParentShare(netClaimable, splitRatio);

  const categories: { label: ExpenseCategory; icon: string }[] = [
    { label: "Nutrition & Hygiene", icon: "baby_changing_station" },
    { label: "Medical Aid / Doctor", icon: "medical_services" },
    { label: "School & Education", icon: "school" },
    { label: "Rent / Child Room", icon: "cottage" },
    { label: "Fuel / Transport", icon: "local_gas_station" },
    { label: "Extramural / Sports", icon: "sports_soccer" },
    { label: "Clothing & Essentials", icon: "checkroom" },
    { label: "Other", icon: "receipt_long" },
  ];

  const handleCategorySelect = (cat: ExpenseCategory) => {
    setCategory(cat);
    const isMedical = cat === "Medical Aid / Doctor";
    setIsMedicalExpense(isMedical);
    if (!isMedical) {
      setMedicalAidCovered("");
    }
  };

  const handleFileSelected = (_file: File, base64: string, hash: string) => {
    setReceiptHash(hash);
    setReceiptBase64(base64);
  };

  const validate = (): boolean => {
    const errors: { vendor?: string; grossAmount?: string; child?: string } = {};

    if (!vendor.trim()) {
      errors.vendor = "Vendor or medical provider is required";
    }
    if (!grossAmount || numGross <= 0) {
      errors.grossAmount = "Gross amount must be greater than zero";
    }
    if (!childAllocation) {
      errors.child = "Child assignment is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      setErrorMsg("Please correct the highlighted errors before submitting.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    // Resolve child name and ID
    let childName = "Joint Allocation";
    let selectedChildId: string | null = null;

    if (childAllocation === "joint") {
      childName = children.map((c) => c.first_name).join(" & ") || "Joint / Shared";
      selectedChildId = null;
    } else {
      const matchedChild = children.find((c) => c.id === childAllocation);
      if (matchedChild) {
        childName = matchedChild.first_name;
        selectedChildId = matchedChild.id;
      }
    }

    const payload = {
      user_id: "user-mother-01",
      child_id: selectedChildId,
      child_name: childName,
      vendor: vendor.trim(),
      description: `${subCategory.trim() || category} (${childName})`,
      category,
      subcategory: subCategory.trim() || null,
      expense_date: expenseDate,
      gross_slip_amount: numGross,
      medical_aid_covered: numMedical,
      net_claimable_amount: netClaimable,
      co_parent_percentage: splitRatio,
      co_parent_share_amount: coParentShare,
      receipt_sha256_hash: receiptHash,
      receipt_id_tag: `#EXP-${Math.floor(1000 + Math.random() * 9000)}`,
      receipt_image_url: receiptBase64 ? "/images/logo.png" : null,
      exhibit_label: "Exhibit",
      legal_court_notes: legalNotes.trim() || null,
      status: "pending" as const,
      ocr_score: null,
      ocr_raw_text: null,
      is_recurring: activeTab === "recurring",
      recurring_period: activeTab === "recurring" ? recurringPeriod : null,
    };

    try {
      // 1. Create in reactive LedgerContext (persists to localRepository & dispatches event)
      await createExpense(payload);
      // 2. Also call server action for server-side state revalidation
      await createExpenseAction(payload);

      setIsSubmitting(false);
      setSubmitDone(true);

      setTimeout(() => {
        router.push("/dashboard");
      }, 900);
    } catch (err: unknown) {
      setIsSubmitting(false);
      setErrorMsg(err instanceof Error ? err.message : "Failed to record expense");
    }
  };

  return (
    <div className="flex flex-col w-full gap-space-md pt-2 pb-12">
      {/* Header Back & Title */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
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

      {activeTab === "recurring" && (
        <div className="p-space-sm rounded-xl bg-surface-container-low border border-outline-variant/40 flex items-center justify-between">
          <span className="text-xs font-semibold text-on-surface">Billing Frequency:</span>
          <div className="flex items-center gap-1">
            {(["monthly", "termly", "annual"] as const).map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => setRecurringPeriod(period)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold uppercase transition-all ${
                  recurringPeriod === period
                    ? "bg-primary text-white"
                    : "bg-surface-container text-on-surface-variant"
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Legal Reassurance Micro-banner */}
      <div className="p-space-sm rounded-xl bg-secondary-fixed/40 text-on-secondary-fixed flex items-center gap-space-xs border border-secondary-container/40">
        <span className="material-symbols-outlined text-secondary text-[20px]">verified_user</span>
        <span className="text-xs font-medium">
          Logged items format directly into Family Court Maintenance Form 4A & Rule 43 exhibits.
        </span>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-error-container text-on-error-container text-xs font-medium flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">error</span>
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-space-md" noValidate>
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
                  className={`shrink-0 px-space-sm py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm cursor-pointer ${
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
              Gross Invoice / Receipt Total *
            </span>
            <div
              className={`flex items-baseline justify-between rounded-xl bg-surface-container-lowest p-space-sm border shadow-inner transition-colors ${
                formErrors.grossAmount
                  ? "border-error focus-within:border-error ring-1 ring-error"
                  : "border-outline-variant/40 focus-within:border-primary"
              }`}
            >
              <div className="flex items-center gap-1 w-full">
                <span className="text-2xl text-primary font-bold">R</span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  id="gross-amount-input"
                  value={grossAmount}
                  onChange={(e) => {
                    setGrossAmount(e.target.value);
                    if (formErrors.grossAmount) {
                      setFormErrors((prev) => ({ ...prev, grossAmount: undefined }));
                    }
                  }}
                  className="w-full bg-transparent text-2xl text-on-surface font-bold outline-none tabular-nums border-none p-0 focus:ring-0"
                  placeholder="0.00"
                />
              </div>
              <div className="px-2 py-1 rounded-lg bg-surface-container text-on-surface-variant text-xs uppercase font-semibold flex-shrink-0">
                ZAR (R)
              </div>
            </div>
            {formErrors.grossAmount && (
              <span className="text-xs text-error font-medium px-1 mt-0.5">
                {formErrors.grossAmount}
              </span>
            )}
          </div>

          {/* Medical Aid Shortfall Calculator */}
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
                    min="0"
                    value={medicalAidCovered}
                    onChange={(e) => setMedicalAidCovered(e.target.value)}
                    className="w-full bg-surface-container-lowest text-sm font-semibold rounded-lg px-2.5 py-1.5 border border-outline-variant/40 outline-none focus:border-primary"
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
              Vendor or Medical Provider Description *
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined text-outline absolute left-space-sm text-[20px]">
                apartment
              </span>
              <input
                type="text"
                id="vendor-input"
                value={vendor}
                onChange={(e) => {
                  setVendor(e.target.value);
                  if (formErrors.vendor) {
                    setFormErrors((prev) => ({ ...prev, vendor: undefined }));
                  }
                }}
                className={`w-full pl-10 pr-space-sm py-2.5 rounded-xl bg-surface-container-lowest text-on-surface text-sm border outline-none transition-all ${
                  formErrors.vendor
                    ? "border-error focus:border-error ring-1 ring-error"
                    : "border-outline-variant/40 focus:border-primary"
                }`}
                placeholder="e.g. Dis-Chem, Woolworths, or Dr. Naidoo"
              />
            </div>
            {formErrors.vendor && (
              <span className="text-xs text-error font-medium px-1 mt-0.5">
                {formErrors.vendor}
              </span>
            )}
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
                placeholder="e.g. Consultation / Medicine"
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

        {/* Dynamic Child Allocation & Split Ratio Card */}
        <div className="p-space-md rounded-2xl bg-surface-container-low border border-surface-variant/50 shadow-sm flex flex-col gap-space-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-on-surface font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[18px]">escalator_warning</span>
              Child Allocation *
            </span>
            <span className="text-xs text-on-surface-variant">Who is this for?</span>
          </div>

          {children.length === 0 ? (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs flex items-center justify-between">
              <span>No children registered yet. Please add a beneficiary.</span>
              <Link href="/children" className="font-semibold underline text-primary">
                + Add Beneficiary
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {children.map((child) => (
                <button
                  key={child.id}
                  type="button"
                  onClick={() => {
                    setChildAllocation(child.id);
                    if (formErrors.child) {
                      setFormErrors((prev) => ({ ...prev, child: undefined }));
                    }
                  }}
                  className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                    childAllocation === child.id
                      ? "bg-primary-fixed/60 border-primary text-primary font-bold shadow-sm ring-1 ring-primary"
                      : "bg-surface-container-lowest border-outline-variant/30 text-on-surface hover:bg-surface-container"
                  }`}
                >
                  <div className="font-semibold text-xs truncate flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">face</span>
                    <span>{child.first_name}</span>
                  </div>
                  <div className="text-[10px] text-on-surface-variant mt-0.5">
                    {child.age_display || `Child • ${child.default_split_ratio}% split`}
                  </div>
                </button>
              ))}

              {children.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    setChildAllocation("joint");
                    if (formErrors.child) {
                      setFormErrors((prev) => ({ ...prev, child: undefined }));
                    }
                  }}
                  className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                    childAllocation === "joint"
                      ? "bg-primary-fixed/60 border-primary text-primary font-bold shadow-sm ring-1 ring-primary"
                      : "bg-surface-container-lowest border-outline-variant/30 text-on-surface hover:bg-surface-container"
                  }`}
                >
                  <div className="font-semibold text-xs truncate flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">groups</span>
                    <span>All Kids (Joint)</span>
                  </div>
                  <div className="text-[10px] text-on-surface-variant mt-0.5">
                    Shared between {children.map((c) => c.first_name).join(" & ")}
                  </div>
                </button>
              )}
            </div>
          )}

          {formErrors.child && (
            <span className="text-xs text-error font-medium px-1">
              {formErrors.child}
            </span>
          )}

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
                  className={`flex-1 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    splitRatio === ratio
                      ? "bg-primary text-white border-primary shadow-xs"
                      : "bg-surface-container-lowest text-on-surface-variant border-outline-variant/30 hover:bg-surface-container"
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
            <span className="text-xs text-secondary font-medium">
              {receiptHash ? "SHA-256 Hashed" : "Optional"}
            </span>
          </div>

          <ReceiptUploader
            label="Upload Slip or Doctor Invoice"
            onFileSelected={handleFileSelected}
          />
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
            placeholder="e.g. Clause 4.2 compliance, emergency paediatric consultation..."
          />
        </div>

        {/* Submit Actions */}
        <div className="flex flex-col gap-2 pt-2">
          {submitDone ? (
            <div className="w-full h-12 bg-secondary text-white rounded-xl font-label text-sm font-bold flex items-center justify-center gap-2 shadow-md animate-fadeIn">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              <span>Logged to Family Court Ledger! Redirecting...</span>
            </div>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-primary text-white rounded-xl font-label text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:bg-primary/90 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
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
            href="/dashboard"
            className="w-full h-10 bg-transparent text-on-surface-variant hover:text-on-surface font-semibold text-xs flex items-center justify-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
