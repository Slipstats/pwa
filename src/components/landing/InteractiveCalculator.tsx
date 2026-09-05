"use client";

import React, { useState } from "react";
import Link from "next/link";
import { calculateCoParentShare } from "@/lib/calculations";
import { formatCurrency } from "@/lib/utils";

export const InteractiveCalculator: React.FC = () => {
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(8500);
  const [medicalShortfall, setMedicalShortfall] = useState<number>(1800);
  const [splitRatio, setSplitRatio] = useState<number>(50);

  const totalMonthlySpend = monthlyExpenses + medicalShortfall;
  const coParentMonthly = calculateCoParentShare(totalMonthlySpend, splitRatio);
  const annualRecoverable = Math.round(coParentMonthly * 12 * 100) / 100;
  const motherRetained = Math.round((totalMonthlySpend - coParentMonthly) * 100) / 100;

  return (
    <section id="calculator" className="py-16 md:py-24 bg-surface-container-low/40 border-b border-outline-variant/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center flex flex-col gap-3 mb-12">
          <span className="font-label text-xs font-bold text-primary tracking-wider uppercase">
            Maintenance Share Calculator
          </span>
          <h2 className="font-headline font-extrabold text-2xl sm:text-4xl text-on-surface tracking-tight">
            How Much Maintenance Is Unclaimed Each Year?
          </h2>
          <p className="font-body text-base text-on-surface-variant leading-relaxed">
            Most South African mothers absorb between R20,000 and R70,000 per year in unrecovered
            till slips and medical aid gaps simply because compiling receipts manually is too
            exhausting. Calculate your actual recovery potential:
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-surface-container-lowest rounded-3xl border border-outline-variant/40 p-6 sm:p-10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Input Controls (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* Slider 1: Monthly living & school expenses */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                  <label htmlFor="living-expenses-slider" className="font-semibold text-on-surface">
                    Monthly Child Living & School Expenses
                  </label>
                  <span className="font-headline font-bold text-primary text-sm tabular-nums">
                    {formatCurrency(monthlyExpenses)}
                  </span>
                </div>
                <input
                  id="living-expenses-slider"
                  type="range"
                  min="2000"
                  max="35000"
                  step="250"
                  value={monthlyExpenses}
                  onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-on-surface-variant font-medium">
                  <span>R2,000</span>
                  <span>Groceries, School Uniforms, Extramurals</span>
                  <span>R35,000</span>
                </div>
              </div>

              {/* Slider 2: Medical Shortfalls */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                  <label htmlFor="medical-shortfall-slider" className="font-semibold text-on-surface">
                    Average Monthly Out-of-Pocket Medical Gaps
                  </label>
                  <span className="font-headline font-bold text-secondary text-sm tabular-nums">
                    {formatCurrency(medicalShortfall)}
                  </span>
                </div>
                <input
                  id="medical-shortfall-slider"
                  type="range"
                  min="0"
                  max="8000"
                  step="100"
                  value={medicalShortfall}
                  onChange={(e) => setMedicalShortfall(Number(e.target.value))}
                  className="w-full accent-secondary cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-on-surface-variant font-medium">
                  <span>R0</span>
                  <span>Paediatrician, Dentistry, Rx Shortfalls</span>
                  <span>R8,000</span>
                </div>
              </div>

              {/* Split Ratio Selector */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-on-surface">
                  Co-Parent Agreed Split Ratio: <span className="text-primary font-bold">{splitRatio}%</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[50, 60, 70, 100].map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => setSplitRatio(ratio)}
                      className={`h-10 rounded-xl font-headline font-bold text-xs transition-all cursor-pointer ${
                        splitRatio === ratio
                          ? "bg-primary text-white shadow-sm"
                          : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant"
                      }`}
                    >
                      {ratio}% {ratio === 50 ? "(Equal)" : ratio === 100 ? "(Sole)" : ""}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Display (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4 p-5 rounded-2xl bg-surface-container-low border border-outline-variant/40">
              <span className="font-label text-xs font-bold text-primary uppercase">
                Estimated Claimable Support
              </span>

              <div className="flex flex-col gap-1">
                <span className="text-xs text-on-surface-variant">Monthly Co-Parent Contribution</span>
                <div className="font-headline text-3xl font-extrabold text-primary tabular-nums">
                  {formatCurrency(coParentMonthly)}
                  <span className="text-xs font-normal text-on-surface-variant">/month</span>
                </div>
              </div>

              <div className="pt-3 border-t border-outline-variant/30 flex flex-col gap-1">
                <span className="text-xs text-on-surface-variant">Annual Recoverable Claim</span>
                <div className="font-headline text-2xl font-bold text-secondary tabular-nums">
                  {formatCurrency(annualRecoverable)}
                  <span className="text-xs font-normal text-on-surface-variant">/year</span>
                </div>
                <p className="text-[11px] text-on-surface-variant mt-1">
                  Mother retains: {formatCurrency(motherRetained)}/mo ({100 - splitRatio}%)
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href="/dashboard"
                  className="w-full h-11 rounded-xl bg-primary hover:bg-primary-container text-white font-headline text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-[16px]">bolt</span>
                  <span>Try Demo Ledger with This Split</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
