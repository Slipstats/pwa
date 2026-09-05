"use client";

import React, { useState } from "react";
import Link from "next/link";
import { calculateMedicalAidGap, calculateCoParentShare } from "@/lib/calculations";
import { formatCurrency } from "@/lib/utils";

interface MedicalScenario {
  id: string;
  provider: string;
  treatment: string;
  grossAmount: number;
  schemeCovered: number;
  splitPercentage: number;
  schemeName: string;
}

const MEDICAL_PRESETS: MedicalScenario[] = [
  {
    id: "paediatrician",
    provider: "Dr. V Naidoo Paediatrics (Sandton Clinic)",
    treatment: "Emergency Infant Allergy & Respiratory Consult",
    grossAmount: 1850.0,
    schemeCovered: 950.0,
    splitPercentage: 60,
    schemeName: "Discovery Health Classic Comprehensive",
  },
  {
    id: "speech",
    provider: "Claremont Speech & Hearing Therapy",
    treatment: "Bi-Weekly Developmental Speech Therapy Session",
    grossAmount: 1200.0,
    schemeCovered: 400.0,
    splitPercentage: 50,
    schemeName: "Bonitas Custom Option",
  },
  {
    id: "orthodontics",
    provider: "Durban North Dental & Orthodontics",
    treatment: "Children Preventative Dental Sealants & X-Rays",
    grossAmount: 2400.0,
    schemeCovered: 1100.0,
    splitPercentage: 70,
    schemeName: "Medihelp Prime One",
  },
];

export const ShortfallVisual: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<MedicalScenario>(MEDICAL_PRESETS[0]);
  const [customGross, setCustomGross] = useState<number>(selectedScenario.grossAmount);
  const [customCovered, setCustomCovered] = useState<number>(selectedScenario.schemeCovered);
  const [splitRatio, setSplitRatio] = useState<number>(selectedScenario.splitPercentage);

  const handleSelectPreset = (preset: MedicalScenario) => {
    setSelectedScenario(preset);
    setCustomGross(preset.grossAmount);
    setCustomCovered(preset.schemeCovered);
    setSplitRatio(preset.splitPercentage);
  };

  const gapAmount = calculateMedicalAidGap(customGross, customCovered);
  const coParentOwed = calculateCoParentShare(gapAmount, splitRatio);
  const motherOwed = Math.round((gapAmount - coParentOwed) * 100) / 100;

  return (
    <section id="medical-shortfall" className="py-16 md:py-24 bg-surface-container-low/50 border-b border-outline-variant/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center flex flex-col gap-3 mb-12">
          <span className="font-label text-xs font-bold text-secondary tracking-wider uppercase">
            Medical Aid Shortfall Reconciliation
          </span>
          <h2 className="font-headline font-extrabold text-2xl sm:text-4xl text-on-surface tracking-tight">
            “Medical Aid Covered It All.”
            <br />
            <span className="text-secondary">Disprove It with Irrefutable Gap Proof.</span>
          </h2>
          <p className="font-body text-base text-on-surface-variant leading-relaxed">
            The most common maintenance dispute in South African courts is out-of-pocket medical
            cash shortfalls. When co-parents claim the scheme paid 100%, Slipstats reconciles the
            original medical bill with the scheme remittance advice to substantiate every cent of
            unpaid co-payments.
          </p>
        </div>

        {/* Preset Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {MEDICAL_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedScenario.id === preset.id
                  ? "bg-secondary text-white shadow-sm"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {preset.provider.split("(")[0].trim()}
            </button>
          ))}
        </div>

        {/* Interactive Reconciliation Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Visual Step-by-Step Flow (7 cols) */}
          <div className="lg:col-span-7 bg-surface-container-lowest rounded-3xl border border-outline-variant/40 p-5 sm:p-7 shadow-sm flex flex-col gap-5">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
              <div>
                <span className="font-label text-[11px] font-bold text-secondary uppercase">
                  Reconciliation Pipeline
                </span>
                <h3 className="font-headline text-base font-bold text-on-surface">
                  {selectedScenario.provider}
                </h3>
                <p className="text-xs text-on-surface-variant">{selectedScenario.treatment}</p>
              </div>
              <span className="font-label text-[11px] font-semibold px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed">
                {selectedScenario.schemeName}
              </span>
            </div>

            {/* 3 Step Decomposition */}
            <div className="flex flex-col gap-3">
              {/* Step 1: Gross Invoice */}
              <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[20px]">medical_services</span>
                  </div>
                  <div>
                    <span className="font-label text-[11px] font-bold text-on-surface-variant uppercase">
                      1. Doctor / Pharmacy Invoice
                    </span>
                    <p className="font-semibold text-xs text-on-surface">Total Gross Amount Incurred</p>
                  </div>
                </div>
                <span className="font-headline font-bold text-base text-on-surface tabular-nums">
                  {formatCurrency(customGross)}
                </span>
              </div>

              {/* Minus Divider */}
              <div className="flex items-center justify-center -my-1 text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px]">remove</span>
              </div>

              {/* Step 2: Scheme Remittance */}
              <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-secondary-container flex items-center justify-center text-on-secondary-container">
                    <span className="material-symbols-outlined text-[20px]">health_and_safety</span>
                  </div>
                  <div>
                    <span className="font-label text-[11px] font-bold text-on-surface-variant uppercase">
                      2. Medical Aid Benefit Paid
                    </span>
                    <p className="font-semibold text-xs text-on-surface">Discovery / Scheme Remittance</p>
                  </div>
                </div>
                <span className="font-headline font-bold text-base text-secondary tabular-nums">
                  - {formatCurrency(customCovered)}
                </span>
              </div>

              {/* Equals Divider */}
              <div className="flex items-center justify-center -my-1 text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px]">drag_handle</span>
              </div>

              {/* Step 3: Net Mother Cash Out-of-Pocket */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
                  </div>
                  <div>
                    <span className="font-label text-[11px] font-bold text-emerald-800 uppercase">
                      3. Net Cash Shortfall (Gap)
                    </span>
                    <p className="font-semibold text-xs text-emerald-900">
                      Paid Out-of-Pocket by Mother
                    </p>
                  </div>
                </div>
                <span className="font-headline font-extrabold text-lg text-emerald-800 tabular-nums">
                  {formatCurrency(gapAmount)}
                </span>
              </div>
            </div>

            {/* Sliders for Interactive Testing */}
            <div className="pt-2 border-t border-outline-variant/30 grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-on-surface-variant font-medium mb-1">
                  Gross Bill: <span className="font-bold tabular-nums">{formatCurrency(customGross)}</span>
                </label>
                <input
                  type="range"
                  min="500"
                  max="5000"
                  step="50"
                  value={customGross}
                  onChange={(e) => setCustomGross(Number(e.target.value))}
                  className="w-full accent-secondary cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-on-surface-variant font-medium mb-1">
                  Scheme Paid:{" "}
                  <span className="font-bold tabular-nums">{formatCurrency(customCovered)}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max={customGross}
                  step="50"
                  value={customCovered}
                  onChange={(e) => setCustomCovered(Number(e.target.value))}
                  className="w-full accent-secondary cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Court-Enforceable Settlement Breakdown (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/40 p-6 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="font-label text-xs font-bold text-secondary uppercase">
                  Court Order Apportionment
                </span>
                <span className="font-label text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-secondary-fixed text-primary">
                  Section 4.2 Settlement Clause
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1.5">
                  Co-Parent Split Ratio: <span className="text-secondary">{splitRatio}%</span>
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[50, 60, 70, 100].map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => setSplitRatio(ratio)}
                      className={`h-8 rounded-lg font-bold text-xs transition-colors ${
                        splitRatio === ratio
                          ? "bg-secondary text-white"
                          : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
                      }`}
                    >
                      {ratio}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Final Co-parent Owed Display */}
              <div className="p-4 rounded-2xl bg-secondary-fixed/40 border border-secondary-fixed-dim/60 flex flex-col gap-1">
                <span className="font-label text-xs font-bold text-secondary uppercase">
                  Co-Parent Enforceable Reimbursement ({splitRatio}%)
                </span>
                <div className="font-headline text-3xl font-extrabold text-secondary tabular-nums">
                  {formatCurrency(coParentOwed)}
                </div>
                <p className="text-[11px] text-on-surface-variant mt-1 leading-snug">
                  Mother covers remaining {100 - splitRatio}% ({formatCurrency(motherOwed)}) in
                  compliance with maintenance order ratios.
                </p>
              </div>

              {/* Affidavit Remittance Citation */}
              <div className="p-3 rounded-xl bg-surface-container text-xs text-on-surface-variant flex flex-col gap-1 border border-outline-variant/30">
                <p className="font-semibold text-on-surface text-[11px] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-secondary">gavel</span>
                  Form 4A Schedule Item 7.3 Reference:
                </p>
                <p className="text-[10px] leading-relaxed font-mono">
                  &ldquo;Claim for medical shortfall R{gapAmount.toFixed(2)} under Settlement Clause 4.2.
                  Proof attached: Invoice {selectedScenario.provider.substring(0, 15)}... + Discovery Health Remittance.&rdquo;
                </p>
              </div>

              <Link
                href="/expenses/new"
                className="w-full h-12 rounded-xl bg-secondary hover:bg-secondary/90 text-white font-headline text-sm font-bold shadow-sm flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                <span>Log a Medical Aid Shortfall</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
