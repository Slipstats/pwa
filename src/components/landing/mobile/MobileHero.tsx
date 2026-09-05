"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { TillSlipScanCard, LiveDashboardAppCard } from "../shared/MockupVisuals";

export const MobileHero: React.FC = () => {
  const [showInteractive, setShowInteractive] = useState(false);

  return (
    <section className="relative overflow-hidden pt-8 pb-14 bg-gradient-to-b from-surface via-surface to-surface-container-low/60 border-b border-outline-variant/30">
      <div className="px-4 flex flex-col gap-6">
        {/* Statutory Pill */}
        <div className="self-start inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high border border-outline-variant/50 shadow-xs">
          <span className="material-symbols-outlined text-[15px] text-primary">verified</span>
          <span className="font-label text-[10px] font-bold text-on-surface tracking-tight">
            Maintenance Act Rule 6 • ECT Act 25/2002 Compliant
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-headline font-extrabold text-2xl sm:text-3xl text-on-surface tracking-tight leading-tight">
          Turn Crumpled Till Slips Into{" "}
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Court-Ready
          </span>{" "}
          Child Maintenance Claims.
        </h1>

        <p className="font-body text-xs sm:text-sm text-on-surface-variant leading-relaxed">
          Saves your case from being stalled or unread. Maintenance courts are overwhelmed;
          Slipstats formats your expenditure into a court-ready, chronologically indexed financial
          breakdown structured to assist maintenance officers during a financial assessment process.
        </p>

        {/* Full-Width Mobile Action Group (Minimum 48px touch targets) */}
        <div className="flex flex-col gap-2.5 w-full">
          <Link
            href="/login"
            className="w-full h-12 rounded-2xl bg-primary hover:bg-primary-container text-white font-headline text-sm font-bold shadow-md flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
          >
            <span>Sign Up Now</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>

          <Link
            href="/demo"
            className="w-full h-12 rounded-2xl bg-surface-container-highest hover:bg-surface-variant text-primary font-headline text-xs font-bold border border-outline-variant/50 shadow-xs flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-primary">bolt</span>
            <span>Try Live Demo (Instant)</span>
          </Link>
        </div>

        {/* Micro Reassurances */}
        <div className="grid grid-cols-2 gap-2 text-[11px] text-on-surface-variant font-medium pt-1">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-secondary">check_circle</span>
            <span>Interactive Live Demo</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-secondary">check_circle</span>
            <span>Paystack &amp; Capitec Pay</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-secondary">check_circle</span>
            <span>POPIA Protected</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-secondary">check_circle</span>
            <span>Works 100% Offline</span>
          </div>
        </div>

        {/* Mobile Product Mockup Showcase */}
        <div id="mobile-demo" className="mt-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-headline font-bold text-xs text-on-surface flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-primary">visibility</span>
              App & Receipt Demo
            </span>
            <button
              type="button"
              onClick={() => setShowInteractive(!showInteractive)}
              className="text-[11px] font-bold text-primary hover:underline cursor-pointer"
            >
              {showInteractive ? "View 3D Mockup" : "View Live Cards"}
            </button>
          </div>

          {!showInteractive ? (
            <div className="rounded-2xl overflow-hidden border border-outline-variant/40 shadow-xl bg-surface-container-lowest">
              <Image
                src="/images/slipstats_hero_mockup.jpg"
                alt="Slipstats Mobile Mockup"
                width={700}
                height={394}
                className="w-full h-auto object-cover"
                priority
              />
              <div className="p-3 bg-surface-container-low border-t border-outline-variant/30 flex items-center justify-between">
                <span className="text-[10px] font-medium text-on-surface-variant">
                  Pick n Pay & Checkers AI Line Item Extraction
                </span>
                <span className="text-[10px] font-bold text-primary bg-primary-fixed px-2 py-0.5 rounded-full">
                  ZAR R
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <TillSlipScanCard />
              <LiveDashboardAppCard />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
