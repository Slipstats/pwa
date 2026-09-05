"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Child, SettlementAgreement } from "@/types/database.types";
import { AddChildModal } from "@/components/children/AddChildModal";
import { saveAgreementAction } from "@/app/actions/agreements";
import { useLedger } from "@/context/LedgerContext";

export default function ChildrenSplitsPage() {
  const { children, agreement, saveAgreement, profile, updateProfile, deleteChild } = useLedger();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Local editable form fields initialized from LedgerContext
  const [caseNumber, setCaseNumber] = useState(agreement?.case_number || profile?.court_case_number || "");
  const [courtJurisdiction, setCourtJurisdiction] = useState(profile?.court_jurisdiction || "Randburg Magistrate Court");
  const [courtOrderDate, setCourtOrderDate] = useState(agreement?.court_order_date || "");
  const [coParentName, setCoParentName] = useState(agreement?.co_parent_full_name || "");
  const [coParentEmail, setCoParentEmail] = useState(agreement?.co_parent_email || "");
  const [paymentDueDay, setPaymentDueDay] = useState<number>(agreement?.payment_due_day || 1);
  const [maintenanceOfficer, setMaintenanceOfficer] = useState("Adv. P. Khumalo (Court Room 4)");
  const [bankingDetails, setBankingDetails] = useState("Standard Bank • Acc: 102948291 • Branch: 051001");

  const [categorySplits, setCategorySplits] = useState<Record<string, number>>(() => ({
    "School & Education": 50,
    "Medical Aid / Doctor": 50,
    "Rent / Child Room": 50,
    "Fuel / Transport": 50,
    "Extramural / Sports": 50,
    "Nutrition & Hygiene": 50,
    "Clothing & Essentials": 50,
    "Other": 50,
    ...(agreement?.category_split_rules || {}),
  }));

  // Sync state when agreement or profile updates
  useEffect(() => {
    if (agreement) {
      if (agreement.case_number) setCaseNumber(agreement.case_number);
      if (agreement.court_order_date) setCourtOrderDate(agreement.court_order_date);
      if (agreement.co_parent_full_name) setCoParentName(agreement.co_parent_full_name);
      if (agreement.co_parent_email) setCoParentEmail(agreement.co_parent_email);
      if (agreement.payment_due_day) setPaymentDueDay(agreement.payment_due_day);
      if (agreement.category_split_rules) {
        setCategorySplits((prev) => ({
          ...prev,
          ...agreement.category_split_rules,
        }));
      }
    }
    if (profile?.court_case_number && !agreement?.case_number) {
      setCaseNumber(profile.court_case_number);
    }
    if (profile?.court_jurisdiction) {
      setCourtJurisdiction(profile.court_jurisdiction);
    }
  }, [agreement, profile]);

  // Real-time split adjustment
  const handleUpdateSplit = async (categoryKey: string, val: number) => {
    const updated = {
      ...categorySplits,
      [categoryKey]: val,
    };
    setCategorySplits(updated);

    // Persist real-time to LedgerContext repository
    try {
      await saveAgreement({
        category_split_rules: updated,
      });
    } catch (e) {
      console.error("Real-time split persist error", e);
    }
  };

  // Full form save for court order and agreement details
  const handleSaveAll = async () => {
    setSaving(true);

    const agreementPayload: Partial<SettlementAgreement> = {
      case_number: caseNumber.trim() || null,
      court_order_date: courtOrderDate || null,
      co_parent_full_name: coParentName.trim() || "Co-Parent",
      co_parent_email: coParentEmail.trim() || null,
      payment_due_day: paymentDueDay,
      category_split_rules: categorySplits,
    };

    try {
      // 1. Save in LedgerContext
      await saveAgreement(agreementPayload);
      await updateProfile({
        court_case_number: caseNumber.trim() || null,
        court_jurisdiction: courtJurisdiction.trim() || null,
      });

      // 2. Also save via server action
      if (agreement) {
        await saveAgreementAction({
          ...agreement,
          ...agreementPayload,
        } as SettlementAgreement);
      }

      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      console.error("Agreement save failed", e);
      setSaving(false);
    }
  };

  const handleDeleteChild = async (childId: string, childName: string) => {
    if (confirm(`Remove ${childName} from registered beneficiaries?`)) {
      await deleteChild(childId);
    }
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
          Case: {caseNumber || profile?.court_case_number || "Unregistered"}
        </span>
      </div>

      {/* 2. Children / Beneficiaries Cards */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <span className="font-headline text-base font-bold text-on-surface">
            Registered Children ({children.length})
          </span>
          <button
            type="button"
            id="add-child-btn"
            onClick={() => setIsModalOpen(true)}
            className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            Add Beneficiary
          </button>
        </div>

        {children.length === 0 ? (
          <div className="p-6 rounded-2xl bg-surface-container-low border border-dashed border-outline-variant flex flex-col items-center text-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary-fixed text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">family_restroom</span>
            </div>
            <p className="font-headline font-bold text-sm text-on-surface">No Children Added Yet</p>
            <p className="font-body text-xs text-on-surface-variant max-w-sm">
              Register your children to calculate individual maintenance allocations and link till slip items.
            </p>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="mt-1 px-4 py-1.5 rounded-xl bg-primary text-white text-xs font-bold shadow-xs hover:bg-primary/90 transition-colors cursor-pointer"
            >
              + Register First Child
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {children.map((child) => (
              <div
                key={child.id}
                className="p-space-md rounded-2xl bg-surface-container-low border border-outline-variant/30 shadow-sm flex items-center justify-between gap-space-sm"
              >
                <div className="flex items-center gap-space-sm min-w-0">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden relative flex-shrink-0 bg-primary-fixed flex items-center justify-center text-primary font-bold text-base">
                    {child.avatar_url ? (
                      <Image
                        src={child.avatar_url}
                        alt={child.first_name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    ) : (
                      <span>{child.first_name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-headline text-sm font-bold text-on-surface leading-tight">
                      {child.first_name} {child.last_name || ""}
                    </h3>
                    <span className="font-body text-xs text-on-surface-variant block">
                      {child.age_display} {child.school_name ? `• ${child.school_name}` : ""}
                    </span>
                    {child.medical_aid_number && (
                      <span className="font-label text-[11px] text-secondary font-medium block">
                        Medical Aid: {child.medical_aid_number}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <span className="font-label text-[11px] text-on-surface-variant block">
                      Court Split
                    </span>
                    <span className="font-bold text-sm text-primary">
                      {child.default_split_ratio}%
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteChild(child.id, child.first_name)}
                    aria-label={`Remove ${child.first_name}`}
                    className="w-8 h-8 rounded-lg text-outline hover:text-error hover:bg-error-container/20 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Maintenance Court Agreement Settings (Editable Form) */}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm text-xs">
          <div className="flex flex-col gap-1">
            <label className="text-on-surface-variant font-medium">Court Case Number</label>
            <input
              type="text"
              value={caseNumber}
              onChange={(e) => setCaseNumber(e.target.value)}
              placeholder="e.g. MC-2024/7821"
              className="px-2.5 py-1.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-on-surface font-semibold text-xs outline-none focus:border-primary"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-on-surface-variant font-medium">Court Jurisdiction</label>
            <input
              type="text"
              value={courtJurisdiction}
              onChange={(e) => setCourtJurisdiction(e.target.value)}
              placeholder="e.g. Randburg Magistrate Court"
              className="px-2.5 py-1.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-on-surface font-semibold text-xs outline-none focus:border-primary"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-on-surface-variant font-medium">Order Date</label>
            <input
              type="date"
              value={courtOrderDate}
              onChange={(e) => setCourtOrderDate(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-on-surface font-semibold text-xs outline-none focus:border-primary"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-on-surface-variant font-medium">Co-Parent Full Name</label>
            <input
              type="text"
              value={coParentName}
              onChange={(e) => setCoParentName(e.target.value)}
              placeholder="e.g. Mark Jenkins"
              className="px-2.5 py-1.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-on-surface font-semibold text-xs outline-none focus:border-primary"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-on-surface-variant font-medium">Co-Parent Email</label>
            <input
              type="email"
              value={coParentEmail}
              onChange={(e) => setCoParentEmail(e.target.value)}
              placeholder="e.g. mark@example.com"
              className="px-2.5 py-1.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-on-surface font-semibold text-xs outline-none focus:border-primary"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-on-surface-variant font-medium">Monthly Due Day (1-31)</label>
            <input
              type="number"
              min={1}
              max={31}
              value={paymentDueDay}
              onChange={(e) => setPaymentDueDay(parseInt(e.target.value) || 1)}
              className="px-2.5 py-1.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-on-surface font-semibold text-xs outline-none focus:border-primary"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-on-surface-variant font-medium">Maintenance Officer</label>
            <input
              type="text"
              value={maintenanceOfficer}
              onChange={(e) => setMaintenanceOfficer(e.target.value)}
              placeholder="e.g. Adv. P. Khumalo"
              className="px-2.5 py-1.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-on-surface font-semibold text-xs outline-none focus:border-primary"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-on-surface-variant font-medium">Maintenance Banking Details</label>
            <input
              type="text"
              value={bankingDetails}
              onChange={(e) => setBankingDetails(e.target.value)}
              placeholder="e.g. Standard Bank • Acc: 102948291"
              className="px-2.5 py-1.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-on-surface font-semibold text-xs outline-none focus:border-primary"
            />
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
              Tap percentage button to update split ratio in real-time
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-1">
          {Object.entries(categorySplits).map(([cat, ratio]) => (
            <div
              key={cat}
              className="p-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex items-center justify-between"
            >
              <span className="text-xs font-semibold text-on-surface">{cat}</span>
              <div className="flex items-center gap-1.5">
                {[50, 60, 70, 100].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleUpdateSplit(cat, r)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      ratio === r
                        ? "bg-primary text-white border-primary shadow-xs"
                        : "bg-surface-container text-on-surface-variant border-outline-variant/30 hover:bg-surface-container-high"
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
        id="save-agreement-btn"
        onClick={handleSaveAll}
        disabled={saving}
        className="w-full h-12 bg-primary text-white rounded-xl font-label text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:bg-primary/90 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
      >
        <span className="material-symbols-outlined text-[20px]">
          {saved ? "check_circle" : saving ? "sync" : "save"}
        </span>
        <span>
          {saved
            ? "Agreement Settings Saved!"
            : saving
            ? "Saving to Ledger..."
            : "Save Agreement & Split Settings"}
        </span>
      </button>

      {/* Add Child Modal */}
      <AddChildModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onChildAdded={(_child) => {
          // LedgerContext automatically updates state and re-renders
        }}
      />
    </div>
  );
}
