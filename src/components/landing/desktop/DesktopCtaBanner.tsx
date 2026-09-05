"use client";

import React from "react";
import Link from "next/link";

export const DesktopCtaBanner: React.FC = () => {
  return (
    <section className="py-20 bg-surface">
      <div className="max-w-6xl mx-auto px-6">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary to-primary-container p-10 lg:p-14 text-white shadow-2xl">
          {/* Subtle background circular glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
            <span className="font-label text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md mb-4 text-white">
              Court-Ready Evidentiary Protection
            </span>

            <h2 className="font-headline font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight">
              Save Your Case From Being Stalled or Unread.
            </h2>

            <p className="font-body text-base sm:text-lg text-white/90 mt-4 max-w-2xl leading-relaxed">
              Presenting messy, unindexed chats or unquantified receipts risks having your evidence
              set aside by overwhelmed officers. Slipstats formats your data into a court-ready,
              indexed financial breakdown structured specifically for the Rule 6 assessment process.
            </p>

            {/* Action buttons with generous padding */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <Link
                href="/login"
                className="min-h-[52px] px-8 py-3.5 rounded-2xl bg-white text-primary font-headline text-base font-bold shadow-lg hover:bg-surface-container-lowest transition-all active:scale-95 flex items-center gap-2.5 cursor-pointer"
              >
                <span>Sign Up Now</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </Link>
              <Link
                href="/demo"
                className="min-h-[52px] px-8 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-headline text-sm font-bold border border-white/30 backdrop-blur-md transition-all active:scale-95 flex items-center gap-2.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">bolt</span>
                <span>Try Live Demo</span>
              </Link>
            </div>

            {/* Micro reassurance */}
            <div className="flex items-center gap-6 text-xs text-white/80 font-medium mt-6">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">check</span>
                Paystack Secure EFT &amp; Card
              </span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">check</span>
                POPIA Section 18 Compliant
              </span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">check</span>
                South African Jurisdiction
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
