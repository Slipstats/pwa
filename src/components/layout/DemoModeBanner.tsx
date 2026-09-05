"use client";

import React, { useState } from "react";
import { useLedger } from "@/context/LedgerContext";

export const DemoModeBanner: React.FC = () => {
  const { demoMode, toggleDemoMode, resetToSeed, clearToCleanSlate } = useLedger();
  const [isOpen, setIsOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    setIsResetting(true);
    await resetToSeed();
    setIsResetting(false);
    setIsOpen(false);
  };

  const handleClear = async () => {
    setIsResetting(true);
    await clearToCleanSlate();
    setIsResetting(false);
    setIsOpen(false);
  };

  return (
    <div className="relative z-30 w-full mb-3">
      <div
        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors border ${
          demoMode
            ? "bg-amber-500/10 text-amber-900 border-amber-500/30"
            : "bg-emerald-500/10 text-emerald-900 border-emerald-500/30"
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-amber-600">
            {demoMode ? "bolt" : "person_check"}
          </span>
          <span className="font-medium">
            {demoMode ? (
              <>
                <strong className="font-semibold">Demo Mode Active:</strong> Viewing Sarah Jenkins
                sample data (Liam & Maya)
              </>
            ) : (
              <>
                <strong className="font-semibold">Clean Slate Mode:</strong> Your private local
                offline ledger
              </>
            )}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="px-2.5 py-1 rounded-lg bg-surface-container-lowest font-semibold hover:bg-surface-container text-on-surface border border-outline-variant/40 shadow-xs flex items-center gap-1 cursor-pointer transition-all active:scale-95"
            aria-expanded={isOpen}
          >
            <span>Options</span>
            <span className="material-symbols-outlined text-[14px]">
              {isOpen ? "expand_less" : "expand_more"}
            </span>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-64 bg-surface-container-lowest border border-outline-variant/40 rounded-xl shadow-xl p-2 z-40 animate-fadeIn text-xs">
          <div className="px-2 py-1 border-b border-outline-variant/20 mb-1">
            <p className="font-semibold text-on-surface">Data Mode Controls</p>
            <p className="text-[10px] text-on-surface-variant">
              Manage your local storage & demo presets
            </p>
          </div>

          <button
            type="button"
            onClick={async () => {
              await toggleDemoMode();
              setIsOpen(false);
            }}
            disabled={isResetting}
            className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-surface-container text-on-surface flex items-center gap-2 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-primary">
              published_with_changes
            </span>
            <span>Switch to {demoMode ? "Clean Slate" : "Sarah Jenkins Demo"}</span>
          </button>

          {demoMode ? (
            <button
              type="button"
              onClick={handleReset}
              disabled={isResetting}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-surface-container text-on-surface flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-secondary">
                restart_alt
              </span>
              <span>Reset Demo Seed Data</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleClear}
              disabled={isResetting}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-error-container/20 text-error flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
              <span>Clear to Empty Clean Slate</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
