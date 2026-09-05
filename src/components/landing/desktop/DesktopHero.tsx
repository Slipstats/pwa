"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { TillSlipScanCard, LiveDashboardAppCard } from "../shared/MockupVisuals";

export const DesktopHero: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"visual" | "interactive">("visual");

  return (
    <section className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-surface via-surface to-surface-container-low/50 border-b border-outline-variant/30">
      {/* Subtle ambient light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-primary-fixed/20 via-secondary-container/20 to-primary-fixed/15 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-6">
        {/* Hero Top Hook & Typography */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto gap-6">
          {/* Statutory Trust Signal Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-high border border-outline-variant/50 shadow-xs">
            <span className="material-symbols-outlined text-[18px] text-primary">verified</span>
            <span className="font-label text-xs font-bold text-on-surface tracking-tight">
              Maintenance Act 99 of 1998 (Rule 6) • ECT Act 25 of 2002 Evidentiary Integrity
            </span>
          </div>

          {/* Primary Headline */}
          <h1 className="font-headline font-extrabold text-4xl sm:text-5xl lg:text-6xl text-on-surface tracking-tight leading-[1.12]">
            Turn Crumpled Till Slips Into{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Court-Ready
            </span>{" "}
            Child Maintenance Claims.
          </h1>

          <p className="font-body text-base sm:text-lg text-on-surface-variant max-w-2xl leading-relaxed">
            Saves your case from being stalled or unread. Maintenance courts are overwhelmed;
            Slipstats formats your expenditure into a court-ready, chronologically indexed
            financial breakdown structured to assist maintenance officers during a financial
            assessment process.
          </p>

          {/* Dual CTAs with generous padding */}
          <div className="flex items-center justify-center gap-4 w-auto mt-3">
            <Link
              href="/login"
              className="min-h-[52px] px-8 py-3.5 rounded-2xl bg-primary hover:bg-primary-container text-white font-headline text-base font-bold shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 transition-all active:scale-95 cursor-pointer"
            >
              <span>Sign Up Now</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </Link>

            <Link
              href="/demo"
              className="min-h-[52px] px-8 py-3.5 rounded-2xl bg-surface-container-highest hover:bg-surface-variant text-primary font-headline text-sm font-bold border border-outline-variant/60 shadow-xs hover:shadow-sm flex items-center justify-center gap-2.5 transition-all active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px] text-primary">bolt</span>
              <span>Try Live Demo (Instant)</span>
            </Link>
          </div>

          {/* Microcopy & Guarantees */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-on-surface-variant font-medium pt-1">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
              Interactive Live Demo
            </span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
              Paystack &amp; Capitec Pay Secure
            </span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
              POPIA Compliant
            </span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
              Works 100% Offline (PWA)
            </span>
          </div>
        </div>

        {/* Hero App Mockup Showcase */}
        <div id="till-slip-demo" className="mt-14 relative">
          {/* Mockup View Switcher */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-primary">visibility</span>
              <span className="font-headline font-bold text-sm text-on-surface">
                Interactive Product Demonstration
              </span>
            </div>
            <div className="inline-flex p-1.5 rounded-2xl bg-surface-container border border-outline-variant/40 shadow-xs gap-1">
              <button
                type="button"
                onClick={() => setActiveTab("visual")}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "visual"
                    ? "bg-primary text-white shadow-xs"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/60"
                }`}
              >
                App & Till Slip View
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("interactive")}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "interactive"
                    ? "bg-primary text-white shadow-xs"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/60"
                }`}
              >
                Live Calculation Cards
              </button>
            </div>
          </div>

          {activeTab === "visual" ? (
            <div className="relative rounded-3xl overflow-hidden border border-outline-variant/50 shadow-2xl bg-surface-container-lowest">
              <Image
                src="/images/slipstats_hero_mockup.jpg"
                alt="Slipstats App and Till Slip Mockup"
                width={1280}
                height={720}
                className="w-full h-auto object-cover"
                priority
              />
              <div className="absolute bottom-4 left-6 right-6 p-4 rounded-2xl bg-surface/90 backdrop-blur-md border border-outline-variant/40 shadow-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-700 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">document_scanner</span>
                  </div>
                  <div>
                    <h5 className="font-headline font-bold text-xs text-on-surface">
                      Designed For Immediate Evidentiary Clarity
                    </h5>
                    <p className="text-[11px] text-on-surface-variant">
                      Dramatically speeds up review times with clear, legible, chronologically indexed data that stands up to scrutiny under ECT Act Section 15
                    </p>
                  </div>
                </div>
                <Link
                  href="/demo"
                  className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container transition-colors shadow-xs active:scale-95"
                >
                  Test in Demo
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start rounded-3xl bg-surface-container-low border border-outline-variant/50 p-6 shadow-xl">
              <div className="lg:col-span-6">
                <TillSlipScanCard />
              </div>
              <div className="lg:col-span-6">
                <LiveDashboardAppCard />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
