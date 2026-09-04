"use client";

import React, { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { MOCK_EXPENSES, MOCK_COURT_BUNDLE, MOCK_PROFILE } from "@/lib/data/mockData";

export default function CourtReportsPage() {
  const [selectedPeriod] = useState("October 2024");
  const [presetType, setPresetType] = useState<"form_4a" | "rule_43" | "arrears">("form_4a");

  const totalTracked = MOCK_EXPENSES.reduce((sum, e) => sum + e.net_claimable_amount, 0);
  const totalCoParentShare = MOCK_EXPENSES.reduce((sum, e) => sum + e.co_parent_share_amount, 0);
  const settledAmount = MOCK_EXPENSES.filter((e) => e.status === "reimbursed").reduce(
    (sum, e) => sum + e.co_parent_share_amount,
    0
  );
  const outstandingArrears = totalCoParentShare - settledAmount;

  const handlePrint = () => {
    window.print();
  };

  const handleEmailLegal = () => {
    const subject = encodeURIComponent(
      `Maintenance Court Statement — Case ${MOCK_PROFILE.court_case_number} (${selectedPeriod})`
    );
    const body = encodeURIComponent(
      `Dear Legal Counsel / Maintenance Officer,\n\nPlease find the certified Child Expense Statement and verified till slip exhibits for ${selectedPeriod} under Case No: ${MOCK_PROFILE.court_case_number}.\n\nTotal Tracked Child Expenses: ${formatCurrency(totalTracked)}\nTotal Co-Parent Share Owed: ${formatCurrency(totalCoParentShare)}\nOutstanding Arrears: ${formatCurrency(outstandingArrears)}\n\nCertified SHA-256 Bundle Hash: ${MOCK_COURT_BUNDLE.cryptographic_bundle_hash}\n\nYours faithfully,\n${MOCK_PROFILE.full_name}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="flex flex-col w-full gap-space-md pt-2 pb-12">
      {/* 1. Header & Audit Status */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <h1 className="text-[22px] font-bold text-primary tracking-tight font-headline">
            Court Statement & PDF Export
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
      <div className="grid grid-cols-3 gap-2">
        {[
          { id: "form_4a", label: "Form 4A Exhibit", desc: "Maintenance Court" },
          { id: "rule_43", label: "Rule 43 Statement", desc: "High Court" },
          { id: "arrears", label: "Arrears Ledger", desc: "Enforcement" },
        ].map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => setPresetType(preset.id as any)}
            className={`p-2.5 rounded-xl text-left border transition-all ${
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
              {MOCK_PROFILE.court_jurisdiction}
            </span>
          </div>
          <span className="font-label text-xs font-bold text-primary bg-primary-fixed px-2 py-0.5 rounded-lg">
            Case: {MOCK_PROFILE.court_case_number}
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
            <span>Certified Timestamp:</span>
            <span>24 Oct 2024, 14:32 SAST</span>
          </div>
        </div>
      </div>

      {/* 4. Action Bar (Print / Export PDF / Email) */}
      <div className="grid grid-cols-2 gap-2 no-print">
        <button
          type="button"
          onClick={handlePrint}
          className="h-11 rounded-xl bg-primary text-white font-label text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm hover:bg-primary-container active:scale-95 transition-all cursor-pointer"
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
            Itemized Exhibit Schedule
          </span>
          <span className="text-xs text-on-surface-variant font-medium">
            {MOCK_EXPENSES.length} Certified Slips Attached
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-outline-variant/40 bg-surface-container-lowest shadow-sm">
          <table className="w-full min-w-[620px] text-left text-xs">
            <thead className="bg-surface-container border-b border-outline-variant/30 text-on-surface font-semibold">
              <tr>
                <th className="py-2.5 px-3">Exhibit</th>
                <th className="py-2.5 px-2">Date</th>
                <th className="py-2.5 px-3">Vendor / Purpose</th>
                <th className="py-2.5 px-2">Child</th>
                <th className="py-2.5 px-3 text-right">Total</th>
                <th className="py-2.5 px-3 text-right">Co-Parent (50%)</th>
                <th className="py-2.5 px-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {MOCK_EXPENSES.map((exp) => (
                <tr key={exp.id} className="hover:bg-surface-container-low/50">
                  <td className="py-2.5 px-3 font-mono font-bold text-primary">
                    {exp.exhibit_label}
                  </td>
                  <td className="py-2.5 px-2 text-on-surface-variant whitespace-nowrap">
                    {exp.expense_date.substring(5)}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-on-surface">{exp.vendor}</div>
                    <div className="text-[11px] text-on-surface-variant truncate max-w-[180px]">
                      {exp.subcategory || exp.category}
                    </div>
                  </td>
                  <td className="py-2.5 px-2 whitespace-nowrap font-medium text-on-surface">
                    {exp.child_name || "Both"}
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
      </div>

      {/* 6. Legal Certification Sign-Off Block */}
      <div className="p-space-md rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-col gap-2">
        <span className="font-headline text-xs font-bold uppercase tracking-wider text-on-surface-variant">
          Affidavit & Certification of Correctness
        </span>
        <p className="font-body text-[11px] text-on-surface-variant leading-relaxed">
          I, the undersigned <strong>{MOCK_PROFILE.full_name}</strong>, hereby certify that the
          expenses detailed herein were necessarily and genuinely incurred for the maintenance,
          healthcare, and education of the minor children, and that all attached till slips are
          true and correct copies.
        </p>
        <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between text-[11px] text-on-surface-variant">
          <span>Signed at: Sandton / Johannesburg</span>
          <span>Date: 24 October 2024</span>
        </div>
      </div>
    </div>
  );
}
