"use client";

import React, { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { MOCK_COURT_BUNDLE, MOCK_PROFILE } from "@/lib/data/mockData";
import { useLedger } from "@/context/LedgerContext";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function CourtReportsPage() {
  const { profile: authProfile } = useAuth();
  const { expenses, profile: ledgerProfile, agreement, metrics } = useLedger();

  const [presetType, setPresetType] = useState<"form_4a" | "rule_43" | "arrears">("form_4a");

  const currentPeriod = new Date().toLocaleDateString("en-ZA", {
    month: "long",
    year: "numeric",
  });

  const totalTracked = metrics.totalTracked;
  const totalCoParentShare = metrics.coParentOwed;
  const outstandingArrears = metrics.arrears;

  const displayedExpenses =
    presetType === "arrears"
      ? expenses.filter((e) => e.status !== "reimbursed")
      : expenses;

  const handlePrint = () => {
    window.print();
  };

  const caseNo =
    ledgerProfile?.court_case_number ||
    agreement?.case_number ||
    authProfile?.court_case_number ||
    MOCK_PROFILE.court_case_number;

  const jurisdiction =
    ledgerProfile?.court_jurisdiction ||
    authProfile?.court_jurisdiction ||
    MOCK_PROFILE.court_jurisdiction;

  const fullName =
    ledgerProfile?.full_name ||
    authProfile?.full_name ||
    MOCK_PROFILE.full_name;

  const handleEmailLegal = () => {
    const subject = encodeURIComponent(
      `Maintenance Court Statement — Case ${caseNo} (${currentPeriod})`
    );
    const body = encodeURIComponent(
      `Dear Legal Counsel / Maintenance Officer,\n\nPlease find the certified Child Expense Statement and verified till slip exhibits for ${currentPeriod} under Case No: ${caseNo}.\n\nTotal Tracked Child Expenses: ${formatCurrency(totalTracked)}\nTotal Co-Parent Share Owed: ${formatCurrency(totalCoParentShare)}\nOutstanding Arrears: ${formatCurrency(outstandingArrears)}\n\nCertified SHA-256 Bundle Hash: ${MOCK_COURT_BUNDLE.cryptographic_bundle_hash}\n\nYours faithfully,\n${fullName}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="flex flex-col w-full gap-space-md pt-2 pb-12">
      {/* 1. Header & Audit Status */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <h1 className="text-[22px] font-bold text-primary tracking-tight font-headline">
            {presetType === "form_4a" && "Form 4A Maintenance Court Statement"}
            {presetType === "rule_43" && "High Court Rule 43 Financial Schedule"}
            {presetType === "arrears" && "Maintenance Arrears Enforcement Ledger"}
          </h1>
          <span className="inline-flex items-center gap-1 bg-secondary-fixed text-on-secondary-fixed px-2.5 py-1 rounded-full text-[11px] font-semibold">
            <span className="material-symbols-outlined text-[14px] text-primary">verified</span>
            Audit-Ready
          </span>
        </div>
        <p className="font-body text-body-sm text-on-surface-variant">
          Certified under Maintenance Act 99 of 1998 • Admissible family court exhibit format
        </p>
      </div>

      {/* 2. Preset Selector */}
      <div className="grid grid-cols-3 gap-2 no-print">
        {[
          { id: "form_4a", label: "Form 4A Exhibit", desc: "Maintenance Court" },
          { id: "rule_43", label: "Rule 43 Statement", desc: "High Court" },
          { id: "arrears", label: "Arrears Ledger", desc: "Enforcement & Recovery" },
        ].map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => setPresetType(preset.id as any)}
            className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
              presetType === preset.id
                ? "bg-primary text-white border-primary shadow-sm"
                : "bg-surface-container-low border-outline-variant/30 text-on-surface hover:bg-surface-container"
            }`}
          >
            <div className="font-semibold text-xs truncate">{preset.label}</div>
            <div
              className={`text-[10px] truncate ${
                presetType === preset.id ? "text-primary-fixed" : "text-on-surface-variant"
              }`}
            >
              {preset.desc}
            </div>
          </button>
        ))}
      </div>

      {/* 3. Cryptographic Legal Authority Card */}
      <div className="p-space-md rounded-2xl bg-surface-container-low border border-outline-variant/30 shadow-sm flex flex-col gap-space-xs">
        <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-primary">gavel</span>
            <span className="font-headline text-sm font-bold text-on-surface">
              {jurisdiction}
            </span>
          </div>
          <span className="font-label text-xs font-bold text-primary bg-primary-fixed px-2 py-0.5 rounded-lg">
            Case: {caseNo}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1 text-center">
          <div className="p-2 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
            <span className="text-[10px] text-on-surface-variant uppercase font-semibold block">
              Total Tracked
            </span>
            <span className="font-currency text-base font-bold text-on-surface">
              {formatCurrency(totalTracked)}
            </span>
          </div>
          <div className="p-2 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
            <span className="text-[10px] text-on-surface-variant uppercase font-semibold block">
              Co-Parent Share
            </span>
            <span className="font-currency text-base font-bold text-primary">
              {formatCurrency(totalCoParentShare)}
            </span>
          </div>
          <div className="p-2 rounded-xl bg-tertiary-fixed/40 border border-tertiary-container/30">
            <span className="text-[10px] text-on-tertiary-fixed uppercase font-semibold block">
              Arrears Due
            </span>
            <span className="font-currency text-base font-bold text-error">
              {formatCurrency(outstandingArrears)}
            </span>
          </div>
        </div>

        <div className="pt-2 flex flex-col gap-0.5 text-[11px] text-on-surface-variant">
          <div className="flex items-center justify-between">
            <span>Cryptographic SHA-256 Hash:</span>
            <span className="font-mono text-[10px] text-primary truncate max-w-[200px]">
              {MOCK_COURT_BUNDLE.cryptographic_bundle_hash}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Period & Timestamp:</span>
            <span>{currentPeriod} • Certified SAST</span>
          </div>
        </div>
      </div>

      {/* 4. Action Bar (Print / Export PDF / Email) */}
      <div className="grid grid-cols-2 gap-2 no-print">
        <button
          type="button"
          onClick={handlePrint}
          className="h-11 rounded-xl bg-primary text-white font-label text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm hover:bg-primary/90 active:scale-95 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">print</span>
          Print / PDF Statement
        </button>
        <button
          type="button"
          onClick={handleEmailLegal}
          className="h-11 rounded-xl bg-surface-container-high text-on-surface font-label text-xs font-semibold flex items-center justify-center gap-1.5 border border-outline-variant/40 hover:bg-surface-container-highest active:scale-95 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">email</span>
          Email PDF to Attorney
        </button>
      </div>

      {/* 5. Itemized Court Exhibit Ledger Table */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <span className="font-headline text-base font-bold text-on-surface">
            {presetType === "arrears" ? "Outstanding Arrears Schedule" : "Itemized Exhibit Schedule"}
          </span>
          <span className="text-xs text-on-surface-variant font-medium">
            {displayedExpenses.length} Records Listed
          </span>
        </div>

        {displayedExpenses.length === 0 ? (
          <div className="p-8 rounded-2xl bg-surface-container-low border border-dashed border-outline-variant flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary-fixed/60 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">folder_off</span>
            </div>
            <div>
              <p className="font-headline font-bold text-sm text-on-surface">
                {presetType === "arrears" ? "No Outstanding Arrears" : "No Expenses Logged Yet"}
              </p>
              <p className="font-body text-xs text-on-surface-variant max-w-sm mt-1">
                {presetType === "arrears"
                  ? "All recorded maintenance expenses have been reimbursed or settled."
                  : "Expenses created via manual entry or till slip scanning will automatically appear here formatted for court submission."}
              </p>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Link
                href="/expenses/new"
                className="px-3.5 py-1.5 rounded-xl bg-surface-container-highest text-on-surface text-xs font-semibold hover:bg-surface-variant transition-colors"
              >
                + Manual Expense
              </Link>
              <Link
                href="/scan"
                className="px-3.5 py-1.5 rounded-xl bg-primary text-white text-xs font-bold shadow-xs hover:bg-primary/90 transition-colors"
              >
                + Scan Till Slip
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-outline-variant/40 bg-surface-container-lowest shadow-sm">
            <table className="w-full min-w-[620px] text-left text-xs">
              <thead className="bg-surface-container border-b border-outline-variant/30 text-on-surface font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Exhibit</th>
                  <th className="py-2.5 px-2">Date</th>
                  <th className="py-2.5 px-3">Vendor / Purpose</th>
                  <th className="py-2.5 px-2">Child</th>
                  <th className="py-2.5 px-3 text-right">Total</th>
                  <th className="py-2.5 px-3 text-right">Co-Parent Share</th>
                  <th className="py-2.5 px-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {displayedExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-surface-container-low/50">
                    <td className="py-2.5 px-3 font-mono font-bold text-primary">
                      {exp.exhibit_label || "Exhibit"}
                    </td>
                    <td className="py-2.5 px-2 text-on-surface-variant whitespace-nowrap">
                      {exp.expense_date ? exp.expense_date.substring(5) : ""}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-on-surface">{exp.vendor}</div>
                      <div className="text-[11px] text-on-surface-variant truncate max-w-[180px]">
                        {exp.subcategory || exp.category}
                      </div>
                    </td>
                    <td className="py-2.5 px-2 whitespace-nowrap font-medium text-on-surface">
                      {exp.child_name || "Joint / Shared"}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums font-semibold">
                      {formatCurrency(exp.net_claimable_amount)}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums font-bold text-primary">
                      {formatCurrency(exp.co_parent_share_amount)}
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          exp.status === "reimbursed"
                            ? "bg-secondary-fixed text-primary"
                            : "bg-tertiary-fixed text-on-tertiary-fixed"
                        }`}
                      >
                        {exp.status === "reimbursed" ? "Paid" : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 6. Legal Certification Sign-Off Block */}
      <div className="p-space-md rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-col gap-2">
        <span className="font-headline text-xs font-bold uppercase tracking-wider text-on-surface-variant">
          Affidavit & Certification of Correctness
        </span>
        <p className="font-body text-[11px] text-on-surface-variant leading-relaxed">
          I, the undersigned <strong>{fullName}</strong>, hereby certify that the
          expenses detailed herein were necessarily and genuinely incurred for the maintenance,
          healthcare, and education of the minor children, and that all attached till slips are
          true and correct copies.
        </p>
        <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between text-[11px] text-on-surface-variant">
          <span>Signed at: Sandton / Johannesburg</span>
          <span>Date: {new Date().toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" })}</span>
        </div>
      </div>
    </div>
  );
}
